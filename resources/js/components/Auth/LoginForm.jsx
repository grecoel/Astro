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
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('error');
    const [modalMessage, setModalMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const { email, password } = formData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        console.log('Data yang dikirim:', { email, password }); // Tambahkan ini

        try {
            // Login request
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            console.log('Response:', response.data); // Tambahkan ini

            if (response.data.token && response.data.user) {
                // Store token and user
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Set token in axios header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                const userRole = response.data.user.role;
                console.log('User role:', userRole); // Debug log

                // Redirect based on role
                if (userRole === 'admin') {
                    console.log('Redirecting to admin dashboard...'); // Debug log
                    navigate('/admin/dashboard', { replace: true });
                } else if (userRole === 'seller') {
                    console.log('Redirecting to seller dashboard...'); // Debug log
                    navigate('/seller', { replace: true });
                } else {
                    console.log('Redirecting to home...'); // Debug log
                    navigate('/', { replace: true });
                }
            } else {
                setError('Login gagal. Data tidak lengkap.');
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            console.error('Error detail:', err.response); // Tambahkan ini
            
            let errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
            
            if (err.response?.status === 422) {
                errorMsg = 'Email atau password tidak boleh kosong';
            } else if (err.response?.status === 401) {
                errorMsg = 'Email atau password salah';
            } else if (err.response?.status === 403) {
                setError('Akses ditolak.');
            } else {
                setError(err.response?.data?.message || errorMsg);
            }
            
            setModalType('error');
            setModalMessage(errorMsg);
            setShowModal(true);
            setError(errorMsg);
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
                            placeholder="admin@astroecomm.com"
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
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
            </div>

            {/* Modal Popup untuk Error */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={`${styles.modal} ${styles[`modal-${modalType}`]}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalIcon + ' ' + styles.iconError}>✕</div>
                        </div>
                        <div className={styles.modalContent}>
                            <h3>Terjadi Kesalahan</h3>
                            <p>{modalMessage}</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.modalButton}
                                onClick={() => setShowModal(false)}
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
