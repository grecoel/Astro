import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Aktivasi.module.css';

function AktivasiAkun() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        password: '',
        password_confirmation: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('success');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // Ambil token dan email dari URL (dari email yang diklik)
        setFormData(prev => ({
            ...prev,
            email: searchParams.get('email') || '',
            token: searchParams.get('token') || ''
        }));
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/aktivasi-akun', formData);
            setModalType('success');
            setModalMessage('Akun berhasil diaktifkan! Mengalihkan ke login...');
            setShowModal(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Terjadi kesalahan saat aktivasi akun.';
            setModalType('error');
            setModalMessage(errorMsg);
            setShowModal(true);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={styles.bgGreen} />
            <div className={styles.whiteBackground} />
            
            <div className={styles.card}>
                <h2 className={styles.title}>Aktivasi Akun</h2>
                <p className={styles.subtitle}>
                    Halo, <strong>{formData.email}</strong><br/>
                    Silakan buat password untuk akun Anda.
                </p>

                {message && <div className={`${styles.alertMessage} ${styles.successMessage}`}>{message}</div>}
                {error && <div className={`${styles.alertMessage} ${styles.errorMessage}`}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">Password Baru*</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Masukkan password baru"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password_confirmation">Konfirmasi Password*</label>
                        <input 
                            type="password" 
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Konfirmasi password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Mengaktifkan...' : 'Aktifkan Akun'}
                    </button>
                </form>
            </div>

            {/* Modal Popup */}
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
                                onClick={() => {
                                    setShowModal(false);
                                    if (modalType === 'success') {
                                        navigate('/login');
                                    }
                                }}
                            >
                                {modalType === 'success' ? 'Ke Login' : 'Coba Lagi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AktivasiAkun;