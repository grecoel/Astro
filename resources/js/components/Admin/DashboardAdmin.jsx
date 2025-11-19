import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DashboardAdmin() {
    const [stats, setStats] = useState({
        totalSellers: 0,
        pendingSellers: 0,
        totalProducts: 0,
        totalCategories: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch statistics from multiple endpoints
            const [sellersRes, productsRes, categoriesRes] = await Promise.all([
                axios.get('/api/admin/sellers', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/admin/products', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/categories')
            ]);

            const sellers = sellersRes.data;
            const products = productsRes.data.data || productsRes.data;
            const categories = categoriesRes.data;

            setStats({
                totalSellers: sellers.length,
                pendingSellers: sellers.filter(s => s.status === 'pending').length,
                totalProducts: products.length,
                totalCategories: categories.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
                        <div className="space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                            <button 
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome, Admin!</h2>
                    <p className="text-gray-600">Manage your marketplace from here</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Sellers</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalSellers}</p>
                            </div>
                            <div className="text-blue-600 text-4xl">👥</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Pending Sellers</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingSellers}</p>
                            </div>
                            <div className="text-yellow-600 text-4xl">⏳</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Products</p>
                                <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
                            </div>
                            <div className="text-green-600 text-4xl">📦</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Categories</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.totalCategories}</p>
                            </div>
                            <div className="text-purple-600 text-4xl">📁</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link 
                            to="/admin/pending-sellers"
                            className="border-2 border-yellow-500 text-yellow-700 p-4 rounded-lg hover:bg-yellow-50 transition text-center"
                        >
                            <div className="text-3xl mb-2">⏳</div>
                            <h4 className="font-semibold mb-1">Verify Sellers</h4>
                            <p className="text-sm">{stats.pendingSellers} pending</p>
                        </Link>

                        <Link 
                            to="/admin/sellers"
                            className="border-2 border-blue-500 text-blue-700 p-4 rounded-lg hover:bg-blue-50 transition text-center"
                        >
                            <div className="text-3xl mb-2">👥</div>
                            <h4 className="font-semibold mb-1">Manage Sellers</h4>
                            <p className="text-sm">View all sellers</p>
                        </Link>

                        <Link 
                            to="/admin/products"
                            className="border-2 border-green-500 text-green-700 p-4 rounded-lg hover:bg-green-50 transition text-center"
                        >
                            <div className="text-3xl mb-2">📦</div>
                            <h4 className="font-semibold mb-1">Manage Products</h4>
                            <p className="text-sm">View all products</p>
                        </Link>
                    </div>
                </div>

                {/* Management Menu */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Management Menu</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link 
                            to="/admin/categories"
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="text-3xl mr-4">📁</div>
                            <div>
                                <h4 className="font-semibold">Category Management</h4>
                                <p className="text-sm text-gray-600">Add, edit, or delete categories</p>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/banners"
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="text-3xl mr-4">🎨</div>
                            <div>
                                <h4 className="font-semibold">Banner Management</h4>
                                <p className="text-sm text-gray-600">Manage homepage banners</p>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/verifikasi"
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="text-3xl mr-4">✅</div>
                            <div>
                                <h4 className="font-semibold">Seller Verification</h4>
                                <p className="text-sm text-gray-600">Review seller applications</p>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/sellers"
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="text-3xl mr-4">👤</div>
                            <div>
                                <h4 className="font-semibold">Seller Management</h4>
                                <p className="text-sm text-gray-600">Manage all sellers</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}