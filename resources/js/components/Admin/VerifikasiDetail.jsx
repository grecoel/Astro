import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './VerifikasiDetail.module.css';

function VerifikasiDetail() {
    const { sellerId } = useParams(); 
    const navigate = useNavigate(); 
    const [seller, setSeller] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchSellerDetail();
    }, [sellerId]);

    const fetchSellerDetail = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/admin/sellers/${sellerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSeller(response.data.data || response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching seller:", error);
            setError('Gagal memuat detail penjual');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (action) => {
        setConfirmAction(action);
        setShowConfirmModal(true);
    };

    const confirmActionHandler = async () => {
        if (!confirmAction) return;

        try {
            setProcessing(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silahkan login kembali.');
                setShowConfirmModal(false);
                return;
            }

            const response = await axios.post(
                `/api/admin/sellers/${sellerId}/verify`,
                { action: confirmAction },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            const successMsg = confirmAction === 'APPROVE' 
                ? 'Penjual berhasil disetujui dan akan menerima email notifikasi.'
                : 'Penjual berhasil ditolak dan akan menerima email notifikasi.';
            
            setSuccessMessage(successMsg);
            setShowConfirmModal(false);
            
            setTimeout(() => {
                navigate('/admin/seller-management');
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            let errorMsg = 'Gagal memproses aksi';
            
            if (error.response?.status === 401) {
                errorMsg = 'Anda tidak memiliki otorisasi. Silahkan login kembali.';
            } else if (error.response?.status === 403) {
                errorMsg = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            }
            
            setError(errorMsg);
            setShowConfirmModal(false);
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Memuat detail penjual...</p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className={styles.container}>
                <div className={styles.errorSection}>
                    {error ? (
                        <>
                            <div className={styles.error}>{error}</div>
                            <button onClick={() => navigate('/admin/seller-management')} className={styles.btnBack}>
                                ← Kembali ke Daftar
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={styles.error}>Penjual tidak ditemukan</div>
                            <button onClick={() => navigate('/admin/seller-management')} className={styles.btnBack}>
                                ← Kembali ke Daftar
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (successMessage) {
        return (
            <div className={styles.container}>
                <div className={styles.successSection}>
                    <div className={styles.successMessage}>
                        <div className={styles.successCheckmark}></div>
                        <p>{successMessage}</p>
                        <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '1rem' }}>
                            Anda akan dialihkan dalam 2 detik...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate('/admin/seller-management')} className={styles.backButton}>
                    ← Kembali
                </button>
                <h1 className={styles.title}>Detail Verifikasi Penjual</h1>
                <p className={styles.storeNameSubtitle}>{seller.store_name}</p>
            </div>

            {successMessage && (
                <div className={styles.successNotification}>
                    <div className={styles.checkmark}></div>
                    <p>{successMessage}</p>
                </div>
            )}
            
            <div className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Data Toko</div>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>Nama Toko</span>
                            <span className={styles.value}>{seller.store_name}</span>
                        </div>
                        <div className={styles.field}>
                            <span className={styles.label}>Deskripsi</span>
                            <span className={styles.value}>{seller.store_description || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Data PIC (Penanggung Jawab)</div>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>Nama PIC</span>
                            <span className={styles.value}>{seller.pic_name}</span>
                        </div>
                        <div className={styles.field}>
                            <span className={styles.label}>Email</span>
                            <span className={styles.value}>{seller.pic_email}</span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>No. HP</span>
                            <span className={styles.value}>{seller.pic_phone}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Alamat Lengkap</div>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>Jalan & RT/RW</span>
                            <span className={styles.value}>
                                {seller.pic_address}, RT {seller.pic_rt} / RW {seller.pic_rw}
                            </span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>Kelurahan, Kota, Provinsi</span>
                            <span className={styles.value}>
                                Kel. {seller.pic_district}, {seller.pic_city}, {seller.pic_province}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTitle}>Dokumen & Identitas</div>
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <span className={styles.label}>No. KTP</span>
                            <span className={styles.value}>{seller.pic_ktp_number}</span>
                        </div>
                        <div className={styles.field}>
                            <span className={styles.label}>File KTP</span>
                            {seller.ktp_url ? (
                                <a href={seller.ktp_url} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                    Buka File KTP
                                </a>
                            ) : (
                                <span className={styles.value}>—</span>
                            )}
                        </div>
                    </div>
                    
                    <div className={styles.photoSection}>
                        <span className={styles.label}>Foto PIC</span>
                        {seller.photo_url ? (
                            <div className={styles.imagePreviewContainer}>
                                <img 
                                    src={seller.photo_url} 
                                    alt="Foto PIC" 
                                    className={styles.imagePreview} 
                                />
                            </div>
                        ) : (
                            <span className={styles.value}>Tidak ada foto tersedia</span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.actionGroup}>
                <button 
                    onClick={() => handleAction('APPROVE')}
                    className={styles.btnApprove}
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'SETUJUI PENDAFTARAN'}
                </button>
                
                <button 
                    onClick={() => handleAction('REJECT')}
                    className={styles.btnReject}
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'TOLAK PENDAFTARAN'}
                </button>
            </div>

            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Konfirmasi Aksi</h3>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Anda yakin ingin {confirmAction === 'APPROVE' ? 'menyetujui' : 'menolak'} pendaftaran penjual <strong>{seller.store_name}</strong>?</p>
                            {confirmAction === 'REJECT' && (
                                <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '1rem' }}>
                                    Penjual akan menerima email notifikasi penolakan.
                                </p>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className={styles.btnCancel}
                                disabled={processing}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmActionHandler}
                                className={confirmAction === 'APPROVE' ? styles.btnConfirmApprove : styles.btnConfirmReject}
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : (confirmAction === 'APPROVE' ? 'Ya, Setujui' : 'Ya, Tolak')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VerifikasiDetail;