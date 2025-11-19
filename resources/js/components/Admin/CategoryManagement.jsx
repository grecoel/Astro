import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (editId) {
                await axios.put(`/api/categories/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/categories', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            alert('Category saved successfully!');
            setShowForm(false);
            setEditId(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setEditId(category.id);
        setFormData({ name: category.name, description: category.description });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
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
                        <h1 className="text-2xl font-bold text-blue-600">Admin - Category Management</h1>
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600">← Back to Dashboard</Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Categories</h2>
                    <button 
                        onClick={() => {
                            setShowForm(true);
                            setEditId(null);
                            setFormData({ name: '', description: '' });
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        + Add Category
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-6">
                                {editId ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full border rounded px-3 py-2"
                                        rows="3"
                                    ></textarea>
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

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <div key={category.id} className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleEdit(category)}
                                    className="flex-1 text-blue-600 border border-blue-600 py-2 rounded hover:bg-blue-50"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(category.id)}
                                    className="flex-1 text-red-600 border border-red-600 py-2 rounded hover:bg-red-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}