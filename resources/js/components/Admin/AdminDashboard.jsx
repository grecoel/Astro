import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalSellers: 0,
        pendingSellers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch categories count
            const categoriesRes = await axios.get('/api/admin/categories', { headers });
            const totalCategories = categoriesRes.data.data?.length || 0;

            // Fetch pending sellers count
            let pendingSellers = 0;
            try {
                const sellersRes = await axios.get('/api/admin/pending-sellers', { headers });
                pendingSellers = sellersRes.data.data?.length || 0;
            } catch (err) {
                console.log('Pending sellers endpoint not available');
            }

            setStats({
                totalCategories,
                totalSellers: 0,
                pendingSellers
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Dashboard Admin</h1>
                <p className={styles.subtitle}>Selamat datang kembali di panel administrasi marketplace</p>
            </div>

            {error && <div className={styles.alert}>{error}</div>}

            <div className={styles.statsGrid}>
                <div className={styles.statCard} onClick={() => navigate('/admin/kategori')}>
                    <h3>Kategori Produk</h3>
                    <p className={styles.statNumber}>{stats.totalCategories}</p>
                    <span className={styles.statAction}>Kelola Kategori →</span>
                </div>

                <div className={styles.statCard + ' ' + styles.pending} onClick={() => navigate('/admin/verifikasi')}>
                    <h3>Menunggu Verifikasi</h3>
                    <p className={styles.statNumber}>{stats.pendingSellers}</p>
                    <span className={styles.statAction}>Verifikasi Penjual →</span>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                    <h2>Fitur Manajemen</h2>
                    <ul>
                        <li>Kelola kategori produk yang tersedia di marketplace</li>
                        <li>Verifikasi dan terima penjual baru yang mendaftar</li>
                        <li>Monitor aktivitas penjual dan transaksi</li>
                        <li>Kelola pengaturan dan konfigurasi sistem</li>
                    </ul>
                </div>

                <div className={styles.infoCard}>
                    <h2>Akses Cepat</h2>
                    <div className={styles.quickLinks}>
                        <a href="/admin/kategori" className={styles.quickLink}>
                            <span>Manajemen Kategori</span>
                        </a>
                        <a href="/admin/verifikasi" className={styles.quickLink}>
                            <span>Verifikasi Penjual</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
