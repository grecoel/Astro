import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SellerReportModal.module.css';

export default function RatingReportModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [generatedBy, setGeneratedBy] = useState('');
    const [generatedAt, setGeneratedAt] = useState('');
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchReportData();
        }
    }, [isOpen]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/seller/reports/rating/data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setReportData(response.data.data || []);
                setGeneratedBy(response.data.generated_by || 'Seller');
                setGeneratedAt(response.data.generated_date || new Date().toLocaleDateString('id-ID'));
            }
        } catch (error) {
            console.error('Error fetching rating report data:', error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/seller/reports/rating', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Rating_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Gagal mengunduh PDF. Silakan coba lagi.');
        } finally {
            setDownloading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className={styles.starFilled}>★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className={styles.starHalf}>★</span>);
            } else {
                stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
            }
        }
        return stars;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Laporan Rating Produk</h2>
                    <button className={styles.closeButton} onClick={onClose} title="Tutup">×</button>
                </div>

                <div className={styles.modalBody}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Memuat data laporan...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.reportHeader}>
                                <h2 className={styles.reportTitle}>
                                    Laporan Daftar Produk Berdasarkan Rating
                                </h2>
                                <p className={styles.reportSubtitle}>
                                    Tanggal dibuat: {generatedAt} oleh {generatedBy}
                                </p>
                            </div>

            <div className={styles.tableWrapper}>
                                <table className={styles.reportTable}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '8%' }}>No</th>
                                            <th style={{ width: '32%' }}>Produk</th>
                                            <th style={{ width: '20%' }}>Kategori</th>
                                            <th style={{ width: '18%' }}>Harga</th>
                                            <th style={{ width: '10%' }}>Stock</th>
                                            <th style={{ width: '12%' }}>Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className={styles.noData}>
                                                    Tidak ada data produk
                                                </td>
                                            </tr>
                                        ) : (
                                            reportData.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className={styles.textCenter}>{item.no}</td>
                                                    <td>{item.nama_produk}</td>
                                                    <td>{item.kategori}</td>
                                                    <td>Rp {(item.harga || 0).toLocaleString('id-ID')}</td>
                                                    <td className={styles.textCenter}>{item.stok || 0}</td>
                                                    <td className={styles.textCenter}>{item.rating?.toFixed(1) || '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

            <div className={styles.reportFooter}>
                                <p className={styles.footerNote}>
                                    ***) urutkan berdasarkan rating
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.btnSecondary} 
                        onClick={onClose}
                        disabled={downloading}
                    >
                        Tutup
                    </button>
                    <div className={styles.actionButtons}>
                        <button 
                            className={styles.btnPrint} 
                            onClick={handlePrint}
                            disabled={loading || downloading}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9"/>
                                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                                <rect x="6" y="14" width="12" height="8"/>
                            </svg>
                            Cetak
                        </button>
                        <button 
                            className={styles.btnDownload} 
                            onClick={handleDownloadPdf}
                            disabled={loading || downloading}
                        >
                            {downloading ? (
                                <>
                                    <div className={styles.miniSpinner}></div>
                                    Mengunduh...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
