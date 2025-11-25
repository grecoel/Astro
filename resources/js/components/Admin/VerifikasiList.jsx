import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './VerifikasiList.module.css';

function VerifikasiList() {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const fetchPendingSellers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/pending-sellers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPendingSellers(response.data.data || response.data);
            setError(null);
        } catch (error) {
            console.error("Error mengambil data:", error);
            const message = error.response?.data?.message || 'Gagal memuat data penjual';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Memuat data penjual...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Verifikasi Penjual</h1>
                <p className={styles.subtitle}>Kelola permohonan pendaftaran penjual baru di Astro E-Commerce</p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {pendingSellers.length > 0 && (
                <div className={styles.statsCard}>
                    <p>Total penjual menunggu verifikasi: <strong>{pendingSellers.length}</strong></p>
                </div>
            )}

            {pendingSellers.length === 0 ? (
                <div className={styles.empty}>
                    <p>Tidak ada penjual yang menunggu verifikasi.</p>
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <h2>Daftar Permohonan Verifikasi</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Toko</th>
                                    <th>Nama PIC</th>
                                    <th>Email PIC</th>
                                    <th>Tanggal Daftar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingSellers.map((seller, idx) => (
                                    <tr key={seller.id}>
                                        <td className={styles.colNo}>{idx + 1}</td>
                                        <td className={styles.colStore}>{seller.store_name}</td>
                                        <td className={styles.colPic}>{seller.pic_name}</td>
                                        <td className={styles.colEmail}>{seller.pic_email}</td>
                                        <td className={styles.colDate}>
                                            {new Date(seller.created_at).toLocaleDateString('id-ID', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        <td className={styles.colAction}>
                                            <Link to={`/admin/verifikasi/${seller.id}`} className={styles.btnDetail}>
                                                Lihat Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerifikasiList;