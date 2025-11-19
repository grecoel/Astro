import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BannerManagement() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        image_url: '', 
        is_active: true 
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axios.get('/api/banners');
            setBanners(res.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (editId) {
                await axios.put(`/api/banners/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/banners', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert('Banner saved successfully!');
            setShowForm(false);
            setEditId(null);
            setFormData({ title: '', description: '', image_url: '', is_active: true });
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Failed to save banner');
        }
    };

    const handleEdit = (banner) => {
        setEditId(banner.id);
        setFormData({
            title: banner.title,
            description: banner.description,
            image_url: banner.image_url,
            is_active: banner.is_active
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/banners/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Banner deleted successfully!');
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Failed to delete banner');
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
                        <h1 className="text-2xl font-bold text-blue-600">Admin - Banner Management</h1>
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600">← Back to Dashboard</Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Banners</h2>
                    <button 
                        onClick={() => {
                            setShowForm(true);
                            setEditId(null);
                            setFormData({ title: '', description: '', image_url: '', is_active: true });
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        + Add Banner
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-6">
                                {editId ? 'Edit Banner' : 'Add New Banner'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium">Active</span>
                                    </label>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Banners Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {banners.map(banner => (
                        <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
                            <img 
                                src={banner.image_url} 
                                alt={banner.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{banner.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {banner.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{banner.description}</p>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleEdit(banner)}
                                        className="flex-1 text-blue-600 border border-blue-600 py-2 rounded hover:bg-blue-50"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(banner.id)}
                                        className="flex-1 text-red-600 border border-red-600 py-2 rounded hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}