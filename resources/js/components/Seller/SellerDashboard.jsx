import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SellerDashboard.module.css';

function SellerDashboard() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSellerStatus = async () => {
            try {
                // Get current user info
                const userResponse = await axios.get('/api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(userResponse.data.user);

                // Get seller status
                const statusResponse = await axios.get('/api/seller/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (statusResponse.data.activated) {
                    setSeller(statusResponse.data.seller);
                }
            } catch (err) {
                console.error('Error fetching seller data:', err);
                setError(err.response?.data?.message || 'Gagal memuat data seller');
            } finally {
                setLoading(false);
            }
        };

        fetchSellerStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingBox}>
                    <p>Memuat data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorBox}>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')}>Kembali ke Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Dashboard Seller</h1>
                    <p className={styles.welcome}>Selamat datang, {user?.name}!</p>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </div>

            {seller && (
                <div className={styles.mainContent}>
                    <div className={styles.sellerCard}>
                        <h2>Informasi Toko</h2>
                        <div className={styles.sellerInfo}>
                            <div className={styles.infoRow}>
                                <label>Nama Toko:</label>
                                <span>{seller.store_name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Nama PIC:</label>
                                <span>{seller.pic_name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Email:</label>
                                <span>{seller.pic_email}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Status:</label>
                                <span className={styles.statusBadge}>{seller.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickActionsGrid}>
                        <div className={styles.actionCard}>
                            <h3>Produk</h3>
                            <p>0 Produk</p>
                            <button onClick={() => navigate('/seller/upload-produk')}>Upload Produk</button>
                        </div>

                        <div className={styles.actionCard}>
                            <h3>Rating</h3>
                            <p>Belum ada rating</p>
                            <button onClick={() => {}}>Lihat Rating</button>
                        </div>
                    </div>

                    <div className={styles.settingsCard}>
                        <h2>Pengaturan</h2>
                        <div className={styles.settingsMenu}>
                            <button className={styles.settingItem}>
                                Edit Profil Toko
                            </button>
                            <button className={styles.settingItem}>
                                Ubah Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerDashboard;
