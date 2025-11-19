import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SellerManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/sellers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSellers(res.data);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (sellerId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/sellers/${sellerId}/verify`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Seller status updated!');
            fetchSellers();
        } catch (error) {
            console.error('Error updating seller:', error);
            alert('Failed to update seller status');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-600">Admin - Seller Management</h1>
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600">← Back to Dashboard</Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">All Sellers</h2>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sellers.map(seller => (
                                <tr key={seller.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{seller.id}</td>
                                    <td className="px-6 py-4 font-medium">{seller.name}</td>
                                    <td className="px-6 py-4">{seller.email}</td>
                                    <td className="px-6 py-4">{seller.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            seller.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            seller.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {seller.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <Link 
                                                to={`/admin/sellers/${seller.id}`}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                View
                                            </Link>
                                            {seller.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleVerify(seller.id, 'approved')}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleVerify(seller.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}