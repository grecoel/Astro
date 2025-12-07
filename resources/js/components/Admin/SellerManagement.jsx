import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './SellerManagement.module.css';

const TABS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const STATUS_MAP = {
    'PENDING': { label: 'Menunggu', color: '#8BA63D' },
    'ACTIVE': { label: 'Aktif', color: '#558B2F' },
    'REJECTED': { label: 'Nonaktif', color: '#C62828' }
};

// Normalize seller status from API (status -> seller_status)
const normalizeSeller = (seller, defaultStatus = 'PENDING') => {
    return {
        ...seller,
        seller_status: seller.seller_status || seller.status || defaultStatus,
        products_count: seller.products_count || 0,
        active_products_count: seller.active_products_count || 0
    };
};

function SellerManagement() {
    const [activeTab, setActiveTab] = useState(TABS.PENDING);
    const [sellers, setSellers] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        fetchSellers();
    }, []);

    useEffect(() => {
        filterSellers();
    }, [activeTab, sellers, searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fetchSellers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            // Fetch all sellers data
            const [pendingRes, dashboardRes] = await Promise.all([
                axios.get('/api/admin/pending-sellers', { headers }),
                axios.get('/api/admin/dashboard', { headers })
            ]);

            // Handle pending sellers (direct array)
            const pendingSellers = Array.isArray(pendingRes.data) 
                ? pendingRes.data 
                : (pendingRes.data.data || []);
            
            // Handle active sellers from dashboard (nested in data.data)
            const dashboardData = dashboardRes.data?.data || dashboardRes.data || {};
            const activeSellers = dashboardData.active_sellers || [];
            
            // Normalize all sellers with proper status field
            const normalizedPending = pendingSellers.map(s => normalizeSeller(s, 'PENDING'));
            const normalizedActive = activeSellers.map(s => normalizeSeller(s, 'ACTIVE'));
            
            // Combine all sellers
            const allSellers = [...normalizedPending, ...normalizedActive];
            setSellers(allSellers);
            setError(null);
        } catch (error) {
            console.error("Error fetching sellers:", error);
            setError(error.response?.data?.message || 'Gagal memuat data penjual');
        } finally {
            setIsLoading(false);
        }
    };

    const filterSellers = () => {
        let filtered = sellers;

        // Filter by tab
        if (activeTab === TABS.PENDING) {
            filtered = filtered.filter(s => s.seller_status === 'PENDING');
        } else if (activeTab === TABS.ACTIVE) {
            filtered = filtered.filter(s => s.seller_status === 'ACTIVE');
        } else if (activeTab === TABS.INACTIVE) {
            filtered = filtered.filter(s => s.seller_status === 'REJECTED');
        }

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s => 
                s.store_name?.toLowerCase().includes(query) ||
                s.pic_name?.toLowerCase().includes(query) ||
                s.pic_email?.toLowerCase().includes(query)
            );
        }

        setFilteredSellers(filtered);
    };

    const handleToggleStatus = async (seller) => {
        const action = seller.seller_status === 'ACTIVE' ? 'menonaktifkan' : 'mengaktifkan';
        
        if (!confirm(`Yakin ingin ${action} toko "${seller.store_name}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/admin/sellers/${seller.id}/toggle-status`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` }}
            );

            showNotification(`Berhasil ${action} toko`, 'success');
            
            // Refresh data to get updated status
            fetchSellers();
        } catch (error) {
            console.error("Error toggling status:", error);
            showNotification(error.response?.data?.message || 'Gagal mengubah status', 'error');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getCountByStatus = (status) => {
        return sellers.filter(s => s.seller_status === status).length;
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
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Manajemen Penjual</h1>
                    <p className={styles.subtitle}>
                        Kelola verifikasi dan status penjual di Astro E-Commerce
                    </p>
                </div>
                
                {/* Search Bar */}
                <div className={styles.searchBar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari toko, nama, atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{background: '#FFF3E0'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFA726">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Menunggu Verifikasi</span>
                        <span className={styles.statValue}>{getCountByStatus('PENDING')}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{background: '#E8F5E9'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#66BB6A">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Toko Aktif</span>
                        <span className={styles.statValue}>{getCountByStatus('ACTIVE')}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{background: '#FFEBEE'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF5350">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Toko Nonaktif</span>
                        <span className={styles.statValue}>{getCountByStatus('REJECTED')}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === TABS.PENDING ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(TABS.PENDING)}
                >
                    Menunggu Verifikasi ({getCountByStatus('PENDING')})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === TABS.ACTIVE ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(TABS.ACTIVE)}
                >
                    Toko Aktif ({getCountByStatus('ACTIVE')})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === TABS.INACTIVE ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(TABS.INACTIVE)}
                >
                    Toko Nonaktif ({getCountByStatus('REJECTED')})
                </button>
            </div>

            {/* Table */}
            {filteredSellers.length === 0 ? (
                <div className={styles.empty}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 7h-9M14 17H5M18 12h-7"/>
                        <circle cx="17" cy="17" r="3"/>
                    </svg>
                    <p>
                        {searchQuery 
                            ? 'Tidak ada hasil yang cocok dengan pencarian Anda' 
                            : 'Tidak ada data penjual untuk ditampilkan'
                        }
                    </p>
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Toko</th>
                                    <th>Nama PIC</th>
                                    <th>Email PIC</th>
                                    <th>Tanggal Daftar</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSellers.map((seller, idx) => (
                                    <tr key={seller.id}>
                                        <td className={styles.colNo}>{idx + 1}</td>
                                        <td className={styles.colStore}>
                                            <div className={styles.storeInfo}>
                                                <strong>{seller.store_name}</strong>
                                                {seller.product_count !== undefined && (
                                                    <span className={styles.productCount}>
                                                        {seller.product_count} produk
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.colPic}>{seller.pic_name}</td>
                                        <td className={styles.colEmail}>{seller.pic_email}</td>
                                        <td className={styles.colDate}>
                                            {new Date(seller.created_at).toLocaleDateString('id-ID', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        <td className={styles.colStatus}>
                                            <span 
                                                className={styles.statusBadge}
                                                style={{
                                                    background: STATUS_MAP[seller.seller_status]?.color + '15',
                                                    color: STATUS_MAP[seller.seller_status]?.color
                                                }}
                                            >
                                                {STATUS_MAP[seller.seller_status]?.label}
                                            </span>
                                        </td>
                                        <td className={styles.colAction}>
                                            <div className={styles.actionButtons}>
                                                {seller.seller_status === 'PENDING' ? (
                                                    <Link 
                                                        to={`/admin/verifikasi/${seller.id}`} 
                                                        className={styles.btnDetail}
                                                    >
                                                        Verifikasi
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <button
                                                            className={`${styles.btnToggle} ${
                                                                seller.seller_status === 'ACTIVE' 
                                                                    ? styles.btnDeactivate 
                                                                    : styles.btnActivate
                                                            }`}
                                                            onClick={() => handleToggleStatus(seller)}
                                                        >
                                                            {seller.seller_status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                                                        </button>
                                                        <Link 
                                                            to={`/admin/seller/${seller.id}`} 
                                                            className={styles.btnView}
                                                        >
                                                            Detail
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showScrollTop && (
                <button 
                    className={styles.scrollTopBtn}
                    onClick={scrollToTop}
                    aria-label="Kembali ke atas"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18 15 12 9 6 15"/>
                    </svg>
                </button>
            )}
        </div>
    );
}

export default SellerManagement;
