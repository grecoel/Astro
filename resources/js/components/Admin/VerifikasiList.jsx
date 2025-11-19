import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import styles from './Admin.module.css';

function VerifikasiList() {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use absolute API path and include credentials for session-based auth
        axios.get('/api/admin/pending-sellers', { withCredentials: true })
            .then(response => {
                setPendingSellers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error mengambil data:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <AdminLayout><div>Loading...</div></AdminLayout>;
    if (pendingSellers.length === 0) return <AdminLayout><div>Tidak ada pendaftar baru.</div></AdminLayout>;

    return (
        <AdminLayout title="Verifikasi Penjual">
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nama Toko</th>
                        <th>Email PIC</th>
                        <th>Tanggal Daftar</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingSellers.map(seller => (
                        <tr key={seller.id}>
                            <td>{seller.store_name}</td>
                            <td>{seller.pic_email}</td>
                            <td>{new Date(seller.created_at).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/admin/verifikasi/${seller.id}`}>
                                    Lihat Detail
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
}

export default VerifikasiList;