import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import loginIllustration from '../Public/images/login-illustration.png';
import { useToast } from '../Common/ToastContext';

function LoginForm() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!formData.email.trim()) {
            showError('Email harus diisi');
            return;
        }
        if (!formData.password.trim()) {
            showError('Password harus diisi');
            return;
        }
        if (formData.password.length < 6) {
            showError('Password minimal 6 karakter');
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await axios.post('/api/login', formData);
            
            if (response.data.token) {
                // Store token and user
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Set token in axios header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Show success message
                showSuccess(`Selamat datang, ${response.data.user.name}!`);
                
                // Redirect based on role with slight delay for toast
                setTimeout(() => {
                    if (response.data.user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (response.data.user.role === 'seller') {
                        navigate('/seller/dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
            let errorMsg = 'Terjadi kesalahan pada server. Silakan coba lagi.';
            
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                if (errors) {
                    const firstError = Object.values(errors)[0];
                    errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                } else {
                    errorMsg = 'Data yang dimasukkan tidak valid';
                }
            } else if (err.response?.status === 401) {
                errorMsg = 'Email atau password salah. Silakan periksa kembali.';
            } else if (err.response?.status === 403) {
                errorMsg = 'Akun Anda belum diaktivasi. Periksa email untuk link aktivasi.';
            } else if (err.response?.status === 429) {
                errorMsg = 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.';
            } else if (err.code === 'ERR_NETWORK') {
                errorMsg = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            }
            
            showError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.floorLine}></div>
            
            <div className={styles.loginContainer}>
                <div className={styles.bgWhite} />
                <div className={styles.bgGreen} />
                
                <div className={styles.illustrationWrapper}>
                    <img 
                        src={loginIllustration} 
                        alt="Shopping Illustration" 
                        className={styles.illustration}
                    />
                </div>
                
                <div className={styles.card}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.logo}>AstroEcomm.</h1>
                </div>
                
                <p className={styles.greeting}>Selamat datang!</p>
                <h2 className={styles.title}>Log In</h2>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Email <span className={styles.required} aria-label="wajib diisi">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="contoh@email.com"
                            required
                            autoComplete="email"
                            aria-required="true"
                            aria-describedby="email-hint"
                        />
                        <small id="email-hint" className={styles.hint}>Gunakan email yang terdaftar</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            Password <span className={styles.required} aria-label="wajib diisi">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Masukkan password Anda"
                            required
                            autoComplete="current-password"
                            aria-required="true"
                            minLength="6"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className={styles.spinner} aria-hidden="true"></span>
                                <span>Memproses...</span>
                            </>
                        ) : 'LOG IN'}
                    </button>
                    
                    {/* Keyboard shortcut hint */}
                    <small className={styles.keyboardHint}>Tekan Enter untuk login</small>
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

            </div>
        </>
    );
}

export default LoginForm;
