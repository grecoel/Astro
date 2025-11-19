import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/api/products/${id}`);
            setProduct(res.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/reviews?product_id=${id}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login to submit a review');
            return;
        }

        try {
            await axios.post('/api/reviews', {
                product_id: id,
                rating,
                comment: reviewText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Review submitted successfully!');
            setReviewText('');
            setRating(5);
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-12">Product not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow mb-8">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">Astro Marketplace</Link>
                        <nav className="space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                            <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div>
                            <img 
                                src={product.image_url || '/images/placeholder.png'} 
                                alt={product.name}
                                className="w-full rounded-lg"
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-blue-600">
                                    Rp {parseInt(product.price).toLocaleString()}
                                </span>
                            </div>
                            <div className="mb-6">
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Category:</span>
                                    <span>{product.category?.name}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Stock:</span>
                                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Seller:</span>
                                    <span>{product.seller?.name}</span>
                                </div>
                            </div>
                            <button 
                                className={`w-full py-3 rounded-lg font-semibold ${
                                    product.stock > 0 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={product.stock === 0}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t p-8">
                        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                        
                        {/* Review Form */}
                        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">Write a Review</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Comment</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Submit Review
                            </button>
                        </form>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="border-b pb-4">
                                        <div className="flex items-center mb-2">
                                            <div className="flex text-yellow-400 mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                            <span className="font-semibold">{review.user?.name}</span>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}