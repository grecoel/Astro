import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalSellers: 0,
        pendingSellers: 0,
        totalUsers: 0
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

            // Fetch sellers count (if endpoint exists)
            let totalSellers = 0;
            let pendingSellers = 0;
            try {
                const sellersRes = await axios.get('/api/admin/pending-sellers', { headers });
                pendingSellers = sellersRes.data.data?.length || 0;
            } catch (err) {
                console.log('Pending sellers endpoint not available');
            }

            setStats({
                totalCategories,
                totalSellers,
                pendingSellers,
                totalUsers: 0
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Gagal memuat statistik dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.container}><p>Memuat dashboard...</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1>Dashboard Admin</h1>
            
            {error && <div className={styles.alert}>{error}</div>}
            
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Kategori Produk</h3>
                    <p className={styles.number}>{stats.totalCategories}</p>
                </div>
                
                <div className={styles.statCard}>
                    <h3>Penjual Menunggu Verifikasi</h3>
                    <p className={styles.number}>{stats.pendingSellers}</p>
                </div>
                
                <div className={styles.statCard}>
                    <h3>Total Penjual</h3>
                    <p className={styles.number}>{stats.totalSellers}</p>
                </div>
                
                <div className={styles.statCard}>
                    <h3>Total Pengguna</h3>
                    <p className={styles.number}>{stats.totalUsers}</p>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Aksi Cepat</h2>
                <ul>
                    <li><a href="/admin/kategori">Kelola Kategori Produk</a></li>
                    <li><a href="/admin/verifikasi">Verifikasi Penjual</a></li>
                    <li><a href="/login">Logout</a></li>
                </ul>
            </div>
        </div>
    );
}
