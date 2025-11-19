import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import styles from './Admin.module.css';

function VerifikasiDetail() {
    const { sellerId } = useParams(); 
    const navigate = useNavigate(); 
    const [seller, setSeller] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/admin/sellers/${sellerId}`, { withCredentials: true })
            .then(response => {
                setSeller(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching seller:", error);
                setIsLoading(false);
            });
    }, [sellerId]);

    // Fungsi untuk memproses aksi (Approve/Reject)
    const handleAction = (action) => {
        const verb = action === 'APPROVE' ? 'menyetujui' : 'menolak';
        if (!window.confirm(`Anda yakin ingin ${verb} pendaftar ini?`)) {
            return;
        }
        
        axios.post(`/api/admin/sellers/${sellerId}/verify`, { action }/*, { withCredentials: true }*/)
            .then(response => {
                alert(`Seller berhasil di-${action}.`);
                navigate('/admin/verifikasi'); 
            })
            .catch(error => {
                console.error("Error:", error);
                alert('Gagal memproses aksi. Pastikan Anda sudah login sebagai admin.');
            });
    };

    if (isLoading) return <AdminLayout><div>Loading detail seller...</div></AdminLayout>;
    if (!seller) return <AdminLayout><div>Seller tidak ditemukan.</div></AdminLayout>;

    return (
        <AdminLayout title={`Detail: ${seller.store_name}`}>
        <div className={styles.detailContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Detail Verifikasi: {seller.store_name}</h2>
            </div>
            
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Data Toko</h3>
                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Nama Toko</span>
                        <span className={styles.value}>{seller.store_name}</span>
                    </div>
                    <div>
                        <span className={styles.label}>Deskripsi</span>
                        <span className={styles.value}>{seller.store_description || '-'}</span>
                    </div>
                </div>
            </div>
            
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Data PIC</h3>
                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Nama PIC</span>
                        <span className={styles.value}>{seller.pic_name}</span>
                    </div>
                    <div>
                        <span className={styles.label}>Email</span>
                        <span className={styles.value}>{seller.pic_email}</span>
                    </div>
                    <div>
                        <span className={styles.label}>No. HP</span>
                        <span className={styles.value}>{seller.pic_phone}</span>
                    </div>
                </div>
            </div>
            
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Alamat Lengkap</h3>
                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>Jalan & RT/RW</span>
                        <span className={styles.value}>
                            {seller.pic_address}, RT {seller.pic_rt} / RW {seller.pic_rw}
                        </span>
                    </div>
                    <div>
                        <span className={styles.label}>Wilayah</span>
                        <span className={styles.value}>
                            Kel. {seller.pic_district}, {seller.pic_city}, {seller.pic_province}
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 4: Dokumen (PENTING: Menggunakan URL Accessor) */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Dokumen & Identitas</h3>
                <div className={styles.row}>
                    <div>
                        <span className={styles.label}>No. KTP</span>
                        <span className={styles.value}>{seller.pic_ktp_number}</span>
                    </div>
                    <div>
                        <span className={styles.label}>File KTP</span>
                        {/* Menggunakan ktp_url dari Accessor Laravel */}
                        <a href={seller.ktp_url} target="_blank" rel="noreferrer" className={styles.fileLink}>
                            📄 Buka File KTP
                        </a>
                    </div>
                </div>
                
                <div style={{ marginTop: '1.5rem' }}>
                    <span className={styles.label}>Foto PIC</span>
                    {seller.photo_url ? (
                        <img 
                            src={seller.photo_url} 
                            alt="Foto PIC" 
                            className={styles.imagePreview} 
                        />
                    ) : (
                        <span className={styles.value}>Tidak ada foto.</span>
                    )}
                </div>
            </div>

            <div className={styles.actionGroup}>
                <button 
                    onClick={() => handleAction('APPROVE')}
                    className={styles.btnApprove}
                >
                    ✓ SETUJUI PENDAFTARAN
                </button>
                
                <button 
                    onClick={() => handleAction('REJECT')}
                    className={styles.btnReject}
                >
                    ✕ TOLAK PENDAFTARAN
                </button>
            </div>
        </div>
        </AdminLayout>
    );
}

export default VerifikasiDetail;