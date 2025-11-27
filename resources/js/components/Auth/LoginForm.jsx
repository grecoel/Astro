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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
                    navigate('/admin/dashboard');
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
            let errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
            
            if (err.response?.status === 422) {
                errorMsg = 'Email atau password tidak boleh kosong';
            } else if (err.response?.status === 401) {
                errorMsg = 'Email atau password salah';
            } else if (err.response?.status === 403) {
                errorMsg = 'Akun Anda belum diaktivasi. Periksa email Anda untuk link aktivasi.';
            } else {
                console.error('Error details:', err.response?.data || err.message);
            }
            
            setModalType('error');
            setModalMessage(errorMsg);
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.bgGreen} />
            <div className={styles.whiteBackground} />
            
            <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logo}>AstroEcomm.</h1>
                </div>
                
                <p className={styles.greeting}>Selamat datang!</p>
                <h2 className={styles.title}>Log In</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Masukkan email Anda"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'LOG IN'}
                    </button>
                </form>

                <p className={styles.signupPrompt}>
                    <span className={styles.signupPromptText}>Belum punya akun?</span>
                    <span className={styles.signupPromptSpace}>&nbsp;</span>
                    <span className={styles.signupPromptLink} onClick={() => navigate('/registrasi')}>Daftar yuk!</span>
                </p>

                <p className={styles.signupPrompt}>
                    <span className={styles.signupPromptText}>Atau</span>
                    <span className={styles.signupPromptSpace}>&nbsp;</span>
                    <span className={styles.signupPromptLink} onClick={() => navigate('/')}>Kembali ke Katalog</span>
                </p>
            </div>

            {/* Modal Popup untuk Error */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={`${styles.modal} ${styles[`modal-${modalType}`]}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalIcon + ' ' + (modalType === 'success' ? styles.iconSuccess : styles.iconError)}></div>
                        </div>
                        <div className={styles.modalContent}>
                            <h3>{modalType === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</h3>
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
        </>
    );
}

export default LoginForm;
