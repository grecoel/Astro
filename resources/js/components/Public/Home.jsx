import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            console.log('Fetching home data...');
            
            const [bannersRes, categoriesRes, productsRes] = await Promise.all([
                axios.get('/api/banners').catch(err => {
                    console.error('Banners error:', err);
                    return { data: [] };
                }),
                axios.get('/api/categories').catch(err => {
                    console.error('Categories error:', err);
                    return { data: [] };
                }),
                axios.get('/api/products?limit=8').catch(err => {
                    console.error('Products error:', err);
                    return { data: [] };
                })
            ]);

            console.log('Data loaded:', { bannersRes, categoriesRes, productsRes });

            setBanners(bannersRes.data || []);
            setCategories(categoriesRes.data || []);
            setProducts(productsRes.data.data || productsRes.data || []);
            setError(null); // Clear error jika berhasil
        } catch (error) {
            console.error('Error fetching home data:', error);
            // Jangan set error, biarkan tampil dengan data kosong
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-xl mb-4">Loading...</div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-600">Astro Marketplace</h1>
                        <nav className="space-x-4">
                            <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                            <Link to="/seller/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Become a Seller
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Banners - Tampil default jika kosong */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="relative h-96 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
                        {banners.length > 0 ? (
                            <>
                                <img 
                                    src={banners[0].image_url} 
                                    alt={banners[0].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <h2 className="text-4xl font-bold mb-4">{banners[0].title}</h2>
                                        <p className="text-xl">{banners[0].description}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <h2 className="text-4xl font-bold mb-4">Welcome to Astro Marketplace</h2>
                                    <p className="text-xl">Discover amazing products from trusted sellers</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                    {categories.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg">No categories available yet</p>
                            <p className="text-gray-500 text-sm mt-2">Categories will appear here once added by admin</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map(category => (
                                <Link 
                                    key={category.id} 
                                    to={`/products?category=${category.id}`}
                                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
                                >
                                    <h3 className="font-semibold text-lg">{category.name}</h3>
                                    {category.description && (
                                        <p className="text-gray-600 text-sm mt-2">{category.description}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Featured Products</h2>
                        <Link to="/products" className="text-blue-600 hover:underline">View All</Link>
                    </div>
                    {products.length === 0 ? (
                        <div className="bg-white p-12 rounded-lg shadow text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg">No products available yet</p>
                            <p className="text-gray-500 text-sm mt-2">Products will appear here once sellers upload them</p>
                            <Link 
                                to="/seller/register" 
                                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                            >
                                Become a Seller
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {products.map(product => (
                                <Link 
                                    key={product.id} 
                                    to={`/products/${product.id}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                                >
                                    <img 
                                        src={product.image_url || 'https://via.placeholder.com/400x300?text=Product'} 
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Product';
                                        }}
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-600 font-bold text-xl">
                                                Rp {parseInt(product.price).toLocaleString()}
                                            </span>
                                            <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Astro Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}