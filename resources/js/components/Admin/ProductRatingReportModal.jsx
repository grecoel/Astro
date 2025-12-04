import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SellerReportModal.module.css';

export default function ProductRatingReportModal({ isOpen, onClose }) {
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
            const response = await axios.get('/api/admin/reports/products/rating/data', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setReportData(response.data.data);
                setGeneratedBy(response.data.meta.generated_by);
                setGeneratedAt(response.data.meta.generated_date);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            alert('Gagal memuat data laporan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/admin/reports/products/rating/pdf', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Produk_Rating_${new Date().toISOString().split('T')[0]}.pdf`);
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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Laporan Produk Berdasarkan Rating</h2>
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
                                    LAPORAN DAFTAR PRODUK BERDASARKAN RATING
                                </h2>
                                <div className={styles.reportMeta}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Tanggal:</span>
                                        <span className={styles.metaValue}>{generatedAt}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Dicetak oleh:</span>
                                        <span className={styles.metaValue}>{generatedBy}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Total Data:</span>
                                        <span className={styles.metaValue}>{reportData.length} Produk</span>
                                    </div>
                                </div>
                            </div>

                            {reportData.length === 0 ? (
                                <div className={styles.noData}>
                                    <p>Belum ada data produk dengan rating</p>
                                </div>
                            ) : (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.reportTable}>
                                        <thead>
                                            <tr>
                                                <th className={styles.textCenter} style={{ width: '5%' }}>No</th>
                                                <th style={{ width: '25%' }}>Produk</th>
                                                <th style={{ width: '15%' }}>Kategori</th>
                                                <th className={styles.textRight} style={{ width: '12%' }}>Harga</th>
                                                <th className={styles.textCenter} style={{ width: '8%' }}>Rating</th>
                                                <th style={{ width: '18%' }}>Nama Toko</th>
                                                <th style={{ width: '17%' }}>Provinsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.map((product) => (
                                                <tr key={product.product_id}>
                                                    <td className={styles.textCenter}>{product.no}</td>
                                                    <td>{product.product_name}</td>
                                                    <td>{product.category_name}</td>
                                                    <td className={styles.textRight}>
                                                        Rp {product.price.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className={styles.textCenter}>{product.rating}</td>
                                                    <td>{product.store_name}</td>
                                                    <td>{product.province}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className={styles.reportFooter}>
                                <p className={styles.footerNote}>
                                    ***) Provinsi diisikan provinsi pemberi rating
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
