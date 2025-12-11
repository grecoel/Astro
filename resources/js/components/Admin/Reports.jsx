import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerReportModal from './SellerReportModal';
import ProvinceReportModal from './ProvinceReportModal';
import ProductRatingReportModal from './ProductRatingReportModal';
import styles from './Reports.module.css';

export default function Reports() {
    const navigate = useNavigate();
    const [isSellerReportModalOpen, setIsSellerReportModalOpen] = useState(false);
    const [isProvinceReportModalOpen, setIsProvinceReportModalOpen] = useState(false);
    const [isProductRatingReportModalOpen, setIsProductRatingReportModalOpen] = useState(false);

    const reportCards = [
        {
            id: 'seller',
            title: 'Laporan Penjual',
            description: 'Daftar akun penjual berdasarkan status aktif dan tidak aktif',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
            ),
            color: '#667A30',
            onClick: () => setIsSellerReportModalOpen(true)
        },
        {
            id: 'province',
            title: 'Laporan Toko per Provinsi',
            description: 'Daftar toko berdasarkan lokasi provinsi',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
            ),
            color: '#7DBA30',
            onClick: () => setIsProvinceReportModalOpen(true)
        },
        {
            id: 'rating',
            title: 'Laporan Produk Rating',
            description: 'Daftar produk berdasarkan rating tertinggi',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            ),
            color: '#D3F26A',
            onClick: () => setIsProductRatingReportModalOpen(true)
        }
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Laporan</h1>
                    <p className={styles.subtitle}>Kelola dan lihat berbagai laporan data marketplace</p>
                </div>
                <button 
                    className={styles.backButton}
                    onClick={() => navigate('/admin/dashboard')}
                    title="Kembali ke Dashboard"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Kembali ke Dashboard
                </button>
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                </div>
                <div>
                    <h3 className={styles.infoTitle}>Tentang Laporan</h3>
                    <p className={styles.infoText}>
                        Halaman ini menyediakan akses ke berbagai laporan data penting dalam marketplace. 
                        Klik pada kartu laporan untuk membuka dan melihat data secara detail.
                    </p>
                </div>
            </div>

            {/* Report Cards Grid */}
            <div className={styles.reportsGrid}>
                {reportCards.map((report) => (
                    <button
                        key={report.id}
                        className={styles.reportCard}
                        onClick={report.onClick}
                        style={{ '--card-color': report.color }}
                    >
                        <div className={styles.reportIconWrapper} style={{ color: report.color }}>
                            {report.icon}
                        </div>
                        <div className={styles.reportContent}>
                            <h3 className={styles.reportTitle}>{report.title}</h3>
                            <p className={styles.reportDescription}>{report.description}</p>
                        </div>
                        <div className={styles.reportArrow}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            {/* Quick Stats Section */}
            <div className={styles.quickStats}>
                <h2 className={styles.sectionTitle}>Akses Cepat</h2>
                <div className={styles.quickStatsGrid}>
                    <div className={styles.statCard}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                        <span>Dashboard</span>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/admin/kategori')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6"/>
                        </svg>
                        <span>Kelola Kategori</span>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/admin/banners')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>Kelola Banner</span>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/admin/seller-management')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>Manajemen Penjual</span>
                    </div>
                </div>
            </div>

            {/* Reuse Modals */}
            <SellerReportModal 
                isOpen={isSellerReportModalOpen} 
                onClose={() => setIsSellerReportModalOpen(false)} 
            />
            <ProvinceReportModal 
                isOpen={isProvinceReportModalOpen} 
                onClose={() => setIsProvinceReportModalOpen(false)} 
            />
            <ProductRatingReportModal 
                isOpen={isProductRatingReportModalOpen} 
                onClose={() => setIsProductRatingReportModalOpen(false)} 
            />
        </div>
    );
}
