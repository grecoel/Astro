import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SellerReportModal.module.css';

export default function SellerReportModal({ isOpen, onClose }) {
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
            const response = await axios.get('/api/admin/reports/sellers/data', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setReportData(response.data.data);
                setGeneratedBy(response.data.generated_by);
                setGeneratedAt(response.data.generated_date);
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
            const response = await axios.get('/api/admin/reports/sellers/pdf', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Penjual_${new Date().toISOString().split('T')[0]}.pdf`);
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
                    <h2 className={styles.modalTitle}>Laporan Penjual</h2>
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
                                    LAPORAN DAFTAR AKUN PENJUAL BERDASARKAN STATUS
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
                                        <span className={styles.metaValue}>{reportData.length} Penjual</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.tableWrapper}>
                                <table className={styles.reportTable}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '5%' }}>No</th>
                                            <th style={{ width: '25%' }}>Nama User</th>
                                            <th style={{ width: '25%' }}>Nama PIC</th>
                                            <th style={{ width: '30%' }}>Nama Toko</th>
                                            <th style={{ width: '15%' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className={styles.noData}>
                                                    Tidak ada data penjual
                                                </td>
                                            </tr>
                                        ) : (
                                            reportData.map((item) => (
                                                <tr key={item.no}>
                                                    <td className={styles.textCenter}>{item.no}</td>
                                                    <td>{item.nama_user}</td>
                                                    <td>{item.nama_pic}</td>
                                                    <td>{item.nama_toko}</td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${
                                                            item.status === 'Aktif' 
                                                                ? styles.statusAktif 
                                                                : styles.statusTidakAktif
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.reportFooter}>
                                <p className={styles.footerNote}>
                                    ***) Diurutkan berdasarkan status (Aktif terlebih dahulu, kemudian Tidak Aktif)
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
