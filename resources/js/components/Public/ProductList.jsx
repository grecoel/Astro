import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get('category');

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    const fetchData = async () => {
        try {
            const categoriesRes = await axios.get('/api/categories');
            setCategories(categoriesRes.data);

            let url = '/api/products';
            if (categoryId) {
                url = `/api/products/category/${categoryId}`;
            }
            
            const productsRes = await axios.get(url);
            setProducts(productsRes.data.data || productsRes.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterByCategory = (catId) => {
        if (catId) {
            setSearchParams({ category: catId });
        } else {
            setSearchParams({});
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow mb-8">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">Astro Marketplace</Link>
                        <nav className="space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4">
                <div className="flex gap-6">
                    {/* Sidebar Filter */}
                    <aside className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-bold text-lg mb-4">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => filterByCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded ${!categoryId ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                                    >
                                        All Products
                                    </button>
                                </li>
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => filterByCategory(category.id)}
                                            className={`w-full text-left px-3 py-2 rounded ${categoryId == category.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold">
                                {categoryId ? categories.find(c => c.id == categoryId)?.name : 'All Products'}
                            </h1>
                            <p className="text-gray-600 mt-2">{products.length} products found</p>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-xl">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <Link 
                                        key={product.id} 
                                        to={`/products/${product.id}`}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                                    >
                                        <img 
                                            src={product.image_url || '/images/placeholder.png'} 
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
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
                    </main>
                </div>
            </div>
        </div>
    );
}