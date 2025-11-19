import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children, role }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            // Set token in header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await axios.get('/api/user');

            if (response.data.user) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (role && user && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data.data || res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <ProtectedRoute role="admin">
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-blue-600">Admin - Product Management</h1>
                            <Link to="/admin" className="text-gray-700 hover:text-blue-600">← Back to Dashboard</Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold mb-6">All Products</h2>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img 
                                                src={product.image_url || '/images/placeholder.png'} 
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium">{product.name}</td>
                                        <td className="px-6 py-4">{product.seller?.name}</td>
                                        <td className="px-6 py-4">Rp {parseInt(product.price).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{product.category?.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Link 
                                                    to={`/products/${product.id}`}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    View
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}