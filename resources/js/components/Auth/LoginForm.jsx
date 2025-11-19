import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Login request (no CSRF needed for token auth)
            const response = await axios.post('/api/login', formData);
            
            console.log('Login response:', response.data);

            if (response.data.token) {
                // Store token and user
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Set token in axios header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                console.log('User role:', response.data.user.role);
                console.log('User data:', response.data.user);
                
                // Redirect based on role
                if (response.data.user.role === 'admin') {
                    console.log('Redirecting to admin dashboard');
                    navigate('/admin/verifikasi');
                } else if (response.data.user.role === 'seller') {
                    console.log('Redirecting to seller dashboard');
                    navigate('/seller/dashboard');
                } else {
                    console.log('Unknown role, redirecting to home');
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.status === 422) {
                setError('Email atau password tidak boleh kosong');
            } else if (err.response?.status === 401) {
                setError('Email atau password salah');
            } else if (err.response?.status === 403) {
                setError('Akun Anda belum diaktivasi. Periksa email Anda untuk link aktivasi.');
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
                console.error('Error details:', err.response?.data || err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBox}>
                <h2 className={styles.authTitle}>Login</h2>
                
                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Email Anda"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>Belum punya akun? <a href="/registrasi" style={{color: '#007bff'}}>Daftar di sini</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
