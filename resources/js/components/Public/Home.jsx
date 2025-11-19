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
        } catch (error) {
            console.error('Error fetching home data:', error);
            setError('Failed to load data. Please refresh the page.');
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

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-xl text-red-600 mb-4">{error}</div>
                <button 
                    onClick={fetchHomeData}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Retry
                </button>
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

            {/* Banners */}
            {banners.length > 0 && (
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <div className="relative h-96 rounded-lg overflow-hidden">
                            <img 
                                src={banners[0].image_url} 
                                alt={banners[0].title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/1200x400?text=Banner';
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <h2 className="text-4xl font-bold mb-4">{banners[0].title}</h2>
                                    <p className="text-xl">{banners[0].description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-600">No categories available</p>
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
                        <p className="text-gray-600">No products available</p>
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