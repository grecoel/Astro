import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './SellerDashboard.module.css';
import StockReportModal from './StockReportModal';
import RatingReportModal from './RatingReportModal';
import ReorderReportModal from './ReorderReportModal';
import ProductsTab from './ProductsTab';
import StockDistributionChart from './StockDistributionChart';
import { DashboardSkeleton } from './SellerDashboardSkeleton';
import CustomSelect from '../Common/CustomSelect';

// Province name normalization
const PROVINCE_ALIASES = {
    'PROVINSI ACEH': 'ACEH', 'NAD': 'ACEH',
    'PROVINSI SUMATERA UTARA': 'SUMATERA UTARA', 'SUMUT': 'SUMATERA UTARA',
    'PROVINSI SUMATERA BARAT': 'SUMATERA BARAT', 'SUMBAR': 'SUMATERA BARAT',
    'PROVINSI RIAU': 'RIAU',
    'PROVINSI KEPULAUAN RIAU': 'KEPULAUAN RIAU', 'KEPRI': 'KEPULAUAN RIAU',
    'PROVINSI JAMBI': 'JAMBI',
    'PROVINSI SUMATERA SELATAN': 'SUMATERA SELATAN', 'SUMSEL': 'SUMATERA SELATAN',
    'PROVINSI BENGKULU': 'BENGKULU',
    'PROVINSI LAMPUNG': 'LAMPUNG',
    'PROVINSI BANGKA BELITUNG': 'BANGKA BELITUNG', 'BABEL': 'BANGKA BELITUNG',
    'PROVINSI DKI JAKARTA': 'DKI JAKARTA', 'JAKARTA': 'DKI JAKARTA',
    'PROVINSI JAWA BARAT': 'JAWA BARAT', 'JABAR': 'JAWA BARAT',
    'PROVINSI BANTEN': 'BANTEN',
    'PROVINSI JAWA TENGAH': 'JAWA TENGAH', 'JATENG': 'JAWA TENGAH',
    'PROVINSI DI YOGYAKARTA': 'DI YOGYAKARTA', 'DIY': 'DI YOGYAKARTA', 'YOGYAKARTA': 'DI YOGYAKARTA',
    'PROVINSI JAWA TIMUR': 'JAWA TIMUR', 'JATIM': 'JAWA TIMUR',
    'PROVINSI BALI': 'BALI',
    'PROVINSI NUSA TENGGARA BARAT': 'NUSA TENGGARA BARAT', 'NTB': 'NUSA TENGGARA BARAT',
    'PROVINSI NUSA TENGGARA TIMUR': 'NUSA TENGGARA TIMUR', 'NTT': 'NUSA TENGGARA TIMUR',
    'PROVINSI KALIMANTAN BARAT': 'KALIMANTAN BARAT', 'KALBAR': 'KALIMANTAN BARAT',
    'PROVINSI KALIMANTAN TENGAH': 'KALIMANTAN TENGAH', 'KALTENG': 'KALIMANTAN TENGAH',
    'PROVINSI KALIMANTAN SELATAN': 'KALIMANTAN SELATAN', 'KALSEL': 'KALIMANTAN SELATAN',
    'PROVINSI KALIMANTAN TIMUR': 'KALIMANTAN TIMUR', 'KALTIM': 'KALIMANTAN TIMUR',
    'PROVINSI KALIMANTAN UTARA': 'KALIMANTAN UTARA', 'KALTARA': 'KALIMANTAN UTARA',
    'PROVINSI SULAWESI UTARA': 'SULAWESI UTARA', 'SULUT': 'SULAWESI UTARA',
    'PROVINSI GORONTALO': 'GORONTALO',
    'PROVINSI SULAWESI TENGAH': 'SULAWESI TENGAH', 'SULTENG': 'SULAWESI TENGAH',
    'PROVINSI SULAWESI BARAT': 'SULAWESI BARAT', 'SULBAR': 'SULAWESI BARAT',
    'PROVINSI SULAWESI SELATAN': 'SULAWESI SELATAN', 'SULSEL': 'SULAWESI SELATAN',
    'PROVINSI SULAWESI TENGGARA': 'SULAWESI TENGGARA', 'SULTRA': 'SULAWESI TENGGARA',
    'PROVINSI MALUKU UTARA': 'MALUKU UTARA', 'MALUT': 'MALUKU UTARA',
    'PROVINSI MALUKU': 'MALUKU',
    'PROVINSI PAPUA BARAT': 'PAPUA BARAT',
    'PROVINSI PAPUA': 'PAPUA',
};

const normalizeProvinceName = (name) => {
    if (!name) return null;
    const upper = name.toUpperCase().trim();
    return PROVINCE_ALIASES[upper] || upper;
};

const getShortName = (name) => {
    const shortNames = {
        'SUMATERA UTARA': 'Sumut', 'SUMATERA BARAT': 'Sumbar', 'SUMATERA SELATAN': 'Sumsel',
        'KEPULAUAN RIAU': 'Kepri', 'BANGKA BELITUNG': 'Babel', 'DKI JAKARTA': 'Jakarta',
        'JAWA BARAT': 'Jabar', 'JAWA TENGAH': 'Jateng', 'DI YOGYAKARTA': 'DIY',
        'JAWA TIMUR': 'Jatim', 'NUSA TENGGARA BARAT': 'NTB', 'NUSA TENGGARA TIMUR': 'NTT',
        'KALIMANTAN BARAT': 'Kalbar', 'KALIMANTAN TENGAH': 'Kalteng',
        'KALIMANTAN SELATAN': 'Kalsel', 'KALIMANTAN TIMUR': 'Kaltim', 'KALIMANTAN UTARA': 'Kaltara',
        'SULAWESI UTARA': 'Sulut', 'SULAWESI TENGAH': 'Sulteng', 'SULAWESI BARAT': 'Sulbar',
        'SULAWESI SELATAN': 'Sulsel', 'SULAWESI TENGGARA': 'Sultra', 'MALUKU UTARA': 'Malut',
    };
    return shortNames[name] || name;
};

// Map Bounds Component
function MapBounds() {
    const map = useMap();
    useEffect(() => {
        map.setView([-2.5, 118], 5);
        map.setMinZoom(4);
        map.setMaxZoom(8);
    }, [map]);
    return null;
}

// Horizontal Bar Chart Component
const HorizontalBarChart = ({ data, labelKey, valueKey, showImage = false, unit = '' }) => {
    const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
    
    if (data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#d1d5db">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <p>Belum ada data</p>
            </div>
        );
    }
    
    return (
        <div className={styles.barChart}>
            {data.slice(0, 8).map((item, idx) => {
                const percentage = (item[valueKey] / max) * 100;
                return (
                    <div key={idx} className={styles.barRow}>
                        <div className={styles.barInfo}>
                            {showImage && (
                                <div className={styles.barThumb}>
                                    {item.image ? (
                                        <img src={item.image} alt="" onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <span>{item[labelKey]?.charAt(0) || '?'}</span>
                                    )}
                                </div>
                            )}
                            <span className={styles.barLabel}>{item[labelKey]}</span>
                            <span className={styles.barValue}>{item[valueKey]}{unit && ` ${unit}`}</span>
                        </div>
                        <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ width: `${Math.max(percentage, 4)}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Rating Stars Component
const RatingStars = ({ rating }) => (
    <div className={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} width="14" height="14" viewBox="0 0 24 24" 
                fill={star <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
        ))}
        <span className={styles.ratingNum}>{rating}</span>
    </div>
);

// Product Rating List
const ProductRatingList = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#d1d5db">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <p>Belum ada rating</p>
            </div>
        );
    }

    return (
        <div className={styles.ratingList}>
            {data.slice(0, 6).map((item, idx) => (
                <div key={idx} className={styles.ratingItem}>
                    <div className={styles.ratingThumb}>
                        {item.image ? (
                            <img src={item.image} alt="" onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                            <span>{item.name?.charAt(0) || '?'}</span>
                        )}
                    </div>
                    <div className={styles.ratingInfo}>
                        <span className={styles.ratingName}>{item.name}</span>
                        <span className={styles.ratingCount}>{item.review_count} ulasan</span>
                    </div>
                    <RatingStars rating={item.rating} />
                </div>
            ))}
        </div>
    );
};

// Main Component
function SellerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [activeNav, setActiveNav] = useState('dashboard');
    
    // Report modal states
    const [isStockReportOpen, setIsStockReportOpen] = useState(false);
    const [isRatingReportOpen, setIsRatingReportOpen] = useState(false);
    const [isReorderReportOpen, setIsReorderReportOpen] = useState(false);
    
    // Filter states for charts
    const [stockFilter, setStockFilter] = useState('all'); // all, active, draft, lowStock, outOfStock
    const [ratingFilter, setRatingFilter] = useState('all'); // all, active, draft, hasReviews
    const [reviewerFilter, setReviewerFilter] = useState('all'); // all, recent, top

    // Extract data before early returns to keep hook order consistent
    const { summary = {}, productStocks = [], productRatings = [], reviewersByProvince = [] } = dashboardData || {};
    
    // Filter products for stock chart - MUST be before any early returns
    const filteredStockProducts = useMemo(() => {
        let filtered = [...productStocks];
        
        if (stockFilter === 'active') {
            filtered = filtered.filter(p => p.status === 'ACTIVE');
        } else if (stockFilter === 'draft') {
            filtered = filtered.filter(p => p.status === 'DRAFT');
        } else if (stockFilter === 'lowStock') {
            filtered = filtered.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10);
        } else if (stockFilter === 'outOfStock') {
            filtered = filtered.filter(p => (p.stock || 0) === 0);
        }
        
        return filtered;
    }, [productStocks, stockFilter]);
    
    // Filter products for rating chart - MUST be before any early returns
    const filteredRatingProducts = useMemo(() => {
        let filtered = [...productRatings];
        
        if (ratingFilter === 'active') {
            filtered = filtered.filter(p => p.status === 'ACTIVE');
        } else if (ratingFilter === 'draft') {
            filtered = filtered.filter(p => p.status === 'DRAFT');
        } else if (ratingFilter === 'hasReviews') {
            filtered = filtered.filter(p => (p.review_count || 0) >= 5);
        }
        
        return filtered;
    }, [productRatings, ratingFilter]);
    
    // Filter reviewers by province - MUST be before any early returns
    const filteredReviewersByProvince = useMemo(() => {
        let filtered = [...reviewersByProvince];
        
        if (reviewerFilter === 'active') {
            // Filter provinces with active products only
            const activeProvinces = productRatings
                .filter(p => p.status === 'ACTIVE')
                .flatMap(p => p.reviewers || [])
                .map(r => normalizeProvinceName(r.province));
            const uniqueProvinces = [...new Set(activeProvinces)];
            filtered = filtered.filter(p => uniqueProvinces.includes(normalizeProvinceName(p.province)));
        } else if (reviewerFilter === 'topProvinces') {
            // Top 10 provinces by reviewer count
            filtered = filtered
                .sort((a, b) => (b.total || 0) - (a.total || 0))
                .slice(0, 10);
        } else if (reviewerFilter === 'highActivity') {
            // Provinces with more than 5 reviewers
            filtered = filtered.filter(p => (p.total || 0) >= 5);
        }
        
        return filtered;
    }, [reviewersByProvince, reviewerFilter, productRatings]);

    useEffect(() => {
        fetchDashboardData();
        loadGeoJSON();
    }, []);

    const loadGeoJSON = async () => {
        try {
            const response = await fetch('/geojson/38_provinsi_indo.json');
            if (response.ok) {
                const data = await response.json();
                setGeoJsonData(data);
            }
        } catch (error) {
            console.warn('Error loading GeoJSON:', error);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            const headers = { 'Authorization': `Bearer ${token}` };
            const [userRes, statusRes, dashRes] = await Promise.all([
                axios.get('/api/user', { headers }),
                axios.get('/api/seller/status', { headers }),
                axios.get('/api/seller/dashboard/data', { headers })
            ]);

            setUser(userRes.data.user);
            if (statusRes.data.activated) {
                setSeller(statusRes.data.seller);
                setDashboardData(dashRes.data);
            } else {
                setError('Akun seller belum diaktivasi');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || 'Gagal memuat dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (e) {}
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Map styling
    const getProvinceStyle = (feature) => {
        const provinceName = feature.properties.name || feature.properties.PROVINSI;
        const normalized = normalizeProvinceName(provinceName);
        const count = provinceData[normalized] || 0;
        const opacity = count === 0 ? 0.1 : 0.15 + ((count / maxReviewers) * 0.85);
        const isHovered = hoveredProvince === normalized;
        
        return {
            fillColor: '#7A57B3',
            fillOpacity: isHovered ? Math.min(opacity + 0.2, 1) : opacity,
            color: isHovered ? '#5A3A8A' : '#ffffff',
            weight: isHovered ? 2.5 : 1,
            opacity: 1
        };
    };

    const onEachProvince = (feature, layer) => {
        const provinceName = feature.properties.name || feature.properties.PROVINSI;
        const normalized = normalizeProvinceName(provinceName);
        const count = provinceData[normalized] || 0;
        
        layer.bindPopup(`
            <div style="text-align:center;padding:8px;min-width:80px;">
                <strong style="font-size:13px;color:#333;">${getShortName(normalized)}</strong>
                <div style="font-size:18px;font-weight:700;color:#7A57B3;margin-top:4px;">
                    ${count} <span style="font-size:11px;font-weight:400;">Reviewer</span>
                </div>
            </div>
        `);
        
        layer.on({
            mouseover: (e) => {
                setHoveredProvince(normalized);
                e.target.bringToFront();
            },
            mouseout: () => setHoveredProvince(null)
        });
    };

    // Loading - use skeleton
    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.logoIcon}>
                            <img src="/logo.png" alt="Astro Logo" />
                        </div>
                        <span className={styles.logoText}>Astro Seller</span>
                    </div>
                    <nav className={styles.sidebarNav}>
                        <div className={`${styles.navItem} ${styles.navActive}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                            </svg>
                            Dashboard
                        </div>
                    </nav>
                </aside>
                <main className={styles.mainContent}>
                    <DashboardSkeleton />
                </main>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.errorState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#dc2626">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <h3>Terjadi Kesalahan</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className={styles.retryBtn}>Coba Lagi</button>
                </div>
            </div>
        );
    }

    // Process province data for map - using filtered data
    const provinceData = {};
    filteredReviewersByProvince.forEach(item => {
        const normalized = normalizeProvinceName(item.province);
        if (normalized) provinceData[normalized] = (provinceData[normalized] || 0) + (item.total || 0);
    });
    const maxReviewers = Math.max(...Object.values(provinceData), 1);
    const totalReviewers = filteredReviewersByProvince.reduce((sum, p) => sum + (p.total || 0), 0);
    const activeProvinces = Object.keys(provinceData).length;

    return (
        <div className={styles.pageWrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoIcon}>
                        <img src="/logo.png" alt="Astro Logo" />
                    </div>
                    <span className={styles.logoText}>Astro Seller</span>
                </div>

                <nav className={styles.sidebarNav}>
                    <button 
                        className={`${styles.navItem} ${activeNav === 'dashboard' ? styles.navActive : ''}`}
                        onClick={() => setActiveNav('dashboard')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                        Dashboard
                    </button>
                    <button 
                        className={`${styles.navItem} ${activeNav === 'products' ? styles.navActive : ''}`}
                        onClick={() => setActiveNav('products')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                        </svg>
                        Kelola Produk
                    </button>
                    <button 
                        className={`${styles.navItem} ${activeNav === 'reports' ? styles.navActive : ''}`}
                        onClick={() => setActiveNav('reports')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Laporan
                    </button>
                    <button 
                        className={styles.navItem}
                        onClick={() => navigate('/')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Kunjungi Katalog Astro
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name}</span>
                            <span className={styles.userEmail}>{user?.email}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header */}
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.pageTitle}>
                            {activeNav === 'dashboard' ? 'Dashboard' : 
                             activeNav === 'products' ? 'Kelola Produk' : 
                             'Laporan'}
                        </h1>
                        <p className={styles.pageSubtitle}>
                            {activeNav === 'dashboard' 
                                ? `Selamat datang, ${seller?.store_name || user?.name}`
                                : activeNav === 'products'
                                ? 'Kelola dan monitor semua produk Anda'
                                : 'Lihat dan unduh laporan penjualan Anda'
                            }
                        </p>
                    </div>
                    <button className={styles.refreshBtn} onClick={fetchDashboardData}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        Refresh
                    </button>
                </header>

                {/* Dashboard View */}
                {activeNav === 'dashboard' && (
                <>
                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={`${styles.summaryIcon} ${styles.iconProduct}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryBody}>
                            <span className={styles.summaryValue}>{summary.totalProducts || 0}</span>
                            <span className={styles.summaryLabel}>Total Produk</span>
                            <span className={styles.summarySub}>{summary.totalStock || 0} unit stok</span>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={`${styles.summaryIcon} ${styles.iconRating}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryBody}>
                            <span className={styles.summaryValue}>{summary.averageRating || '0.0'}</span>
                            <span className={styles.summaryLabel}>Rating Rata-rata</span>
                            <span className={styles.summarySub}>{summary.totalReviews || 0} ulasan</span>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={`${styles.summaryIcon} ${styles.iconReviewer}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryBody}>
                            <span className={styles.summaryValue}>{summary.totalReviewers || 0}</span>
                            <span className={styles.summaryLabel}>Total Reviewer</span>
                            <span className={styles.summarySub}>{activeProvinces} provinsi</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className={styles.chartsRow}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Sebaran Stok per Kategori</h3>
                            <div className={styles.chartFilterWrapper}>
                                <CustomSelect
                                    value={stockFilter === 'all' ? 'Semua Produk' : 
                                           stockFilter === 'active' ? 'Produk Aktif' : 
                                           stockFilter === 'draft' ? 'Produk Draft' : 
                                           stockFilter === 'lowStock' ? 'Stok Rendah (<10)' : 
                                           stockFilter === 'outOfStock' ? 'Stok Habis' : 'Semua Produk'}
                                    onChange={(val) => {
                                        const filterMap = {
                                            'Semua Produk': 'all',
                                            'Produk Aktif': 'active',
                                            'Produk Draft': 'draft',
                                            'Stok Rendah (<10)': 'lowStock',
                                            'Stok Habis': 'outOfStock'
                                        };
                                        setStockFilter(filterMap[val] || 'all');
                                    }}
                                    options={['Semua Produk', 'Produk Aktif', 'Produk Draft', 'Stok Rendah (<10)', 'Stok Habis']}
                                    placeholder="Filter Stok"
                                />
                            </div>
                        </div>
                        <StockDistributionChart products={filteredStockProducts} />
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Rating Produk</h3>
                            <div className={styles.chartFilterWrapper}>
                                <CustomSelect
                                    value={ratingFilter === 'all' ? 'Semua Produk' : 
                                           ratingFilter === 'active' ? 'Produk Aktif' : 
                                           ratingFilter === 'draft' ? 'Produk Draft' : 
                                           ratingFilter === 'hasReviews' ? 'Minimal 5 Review' : 'Semua Produk'}
                                    onChange={(val) => {
                                        const filterMap = {
                                            'Semua Produk': 'all',
                                            'Produk Aktif': 'active',
                                            'Produk Draft': 'draft',
                                            'Minimal 5 Review': 'hasReviews'
                                        };
                                        setRatingFilter(filterMap[val] || 'all');
                                    }}
                                    options={['Semua Produk', 'Produk Aktif', 'Produk Draft', 'Minimal 5 Review']}
                                    placeholder="Filter Rating"
                                />
                            </div>
                        </div>
                        <ProductRatingList data={filteredRatingProducts} />
                    </div>
                </div>

                {/* Map Section */}
                <div className={styles.mapSection}>
                    <div className={styles.chartHeader}>
                        <h3>Sebaran Reviewer per Provinsi</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div className={styles.chartFilterWrapper}>
                                <CustomSelect
                                    value={reviewerFilter === 'all' ? 'Semua Provinsi' : 
                                           reviewerFilter === 'active' ? 'Dari Produk Aktif' : 
                                           reviewerFilter === 'topProvinces' ? 'Top 10 Provinsi' : 
                                           reviewerFilter === 'highActivity' ? 'Aktivitas Tinggi (≥5)' : 'Semua Provinsi'}
                                    onChange={(val) => {
                                        const filterMap = {
                                            'Semua Provinsi': 'all',
                                            'Dari Produk Aktif': 'active',
                                            'Top 10 Provinsi': 'topProvinces',
                                            'Aktivitas Tinggi (≥5)': 'highActivity'
                                        };
                                        setReviewerFilter(filterMap[val] || 'all');
                                    }}
                                    options={['Semua Provinsi', 'Dari Produk Aktif', 'Top 10 Provinsi', 'Aktivitas Tinggi (≥5)']}
                                    placeholder="Filter Provinsi"
                                />
                            </div>
                            <span className={styles.mapBadge}>{totalReviewers} Total Reviewer</span>
                        </div>
                    </div>
                    
                    <div className={styles.mapLayout}>
                        <div className={styles.mapWrapper}>
                            {geoJsonData && (
                                <MapContainer
                                    center={[-2.5, 118]}
                                    zoom={5}
                                    scrollWheelZoom={true}
                                    className={styles.leafletMap}
                                >
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                                    />
                                    <GeoJSON 
                                        data={geoJsonData}
                                        style={getProvinceStyle}
                                        onEachFeature={onEachProvince}
                                    />
                                    <MapBounds />
                                </MapContainer>
                            )}
                            
                            {/* Map Legend */}
                            <div className={styles.mapLegend}>
                                <span>Sedikit</span>
                                <div className={styles.legendBar}>
                                    <div style={{background:'#7A57B3',opacity:0.15}}></div>
                                    <div style={{background:'#7A57B3',opacity:0.4}}></div>
                                    <div style={{background:'#7A57B3',opacity:0.65}}></div>
                                    <div style={{background:'#7A57B3',opacity:0.9}}></div>
                                    <div style={{background:'#7A57B3',opacity:1}}></div>
                                </div>
                                <span>Banyak</span>
                            </div>
                        </div>

                        <div className={styles.provinceList}>
                            <div className={styles.provinceListHeader}>Top Provinsi</div>
                            {reviewersByProvince.slice(0, 10).map((item, idx) => (
                                <div key={idx} className={styles.provinceItem}>
                                    <span className={styles.provinceRank}>#{idx + 1}</span>
                                    <span className={styles.provinceName}>{getShortName(normalizeProvinceName(item.province))}</span>
                                    <span className={styles.provinceCount}>{item.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Stats */}
                    <div className={styles.mapStats}>
                        <div className={styles.mapStat}>
                            <span className={styles.statValue}>{activeProvinces}</span>
                            <span className={styles.statLabel}>Provinsi Aktif</span>
                        </div>
                        <div className={styles.mapStat}>
                            <span className={styles.statValue}>{totalReviewers}</span>
                            <span className={styles.statLabel}>Total Reviewer</span>
                        </div>
                        <div className={styles.mapStat}>
                            <span className={styles.statValue}>{maxReviewers}</span>
                            <span className={styles.statLabel}>Terbanyak</span>
                        </div>
                        <div className={styles.mapStat}>
                            <span className={styles.statValue}>{activeProvinces > 0 ? Math.round(totalReviewers / activeProvinces) : 0}</span>
                            <span className={styles.statLabel}>Rata-rata</span>
                        </div>
                    </div>
                </div>

                {/* Reports Section */}
                <div className={styles.reportsSection}>
                    <h2 className={styles.sectionTitle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Laporan
                    </h2>
                    <div className={styles.reportsGrid}>
                        <button 
                            className={styles.reportCard}
                            onClick={() => setIsStockReportOpen(true)}
                        >
                            <div className={styles.reportIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                                </svg>
                            </div>
                            <div className={styles.reportContent}>
                                <h3 className={styles.reportTitle}>Laporan Stok</h3>
                                <p className={styles.reportDescription}>Lihat daftar produk berdasarkan jumlah stok tersedia</p>
                            </div>
                            <div className={styles.reportArrow}>→</div>
                        </button>

                        <button 
                            className={styles.reportCard}
                            onClick={() => setIsRatingReportOpen(true)}
                        >
                            <div className={styles.reportIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                            </div>
                            <div className={styles.reportContent}>
                                <h3 className={styles.reportTitle}>Laporan Rating</h3>
                                <p className={styles.reportDescription}>Lihat daftar produk berdasarkan rating tertinggi</p>
                            </div>
                            <div className={styles.reportArrow}>→</div>
                        </button>

                        <button 
                            className={styles.reportCard}
                            onClick={() => setIsReorderReportOpen(true)}
                        >
                            <div className={styles.reportIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <div className={styles.reportContent}>
                                <h3 className={styles.reportTitle}>Laporan Restock</h3>
                                <p className={styles.reportDescription}>Produk dengan stok rendah yang perlu segera diisi ulang</p>
                            </div>
                            <div className={styles.reportArrow}>→</div>
                        </button>
                    </div>
                </div>
                </>
                )}

                {/* Products View */}
                {activeNav === 'products' && (
                    <ProductsTab 
                        products={dashboardData?.productStocks || []}
                        onEdit={(product) => console.log('Edit:', product)}
                        onDelete={(productId) => console.log('Delete:', productId)}
                        onRefresh={fetchDashboardData}
                    />
                )}

                {/* Reports View */}
                {activeNav === 'reports' && (
                    <div className={styles.reportsViewContainer}>
                        <div className={styles.reportsIntro}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7A57B3" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            <h2>Laporan Penjualan</h2>
                            <p>Kelola dan unduh laporan produk Anda dalam format PDF</p>
                        </div>

                        <div className={styles.reportsGrid}>
                            <button 
                                className={styles.reportCard}
                                onClick={() => setIsStockReportOpen(true)}
                            >
                                <div className={styles.reportIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                                    </svg>
                                </div>
                                <div className={styles.reportContent}>
                                    <h3 className={styles.reportTitle}>Laporan Stok</h3>
                                    <p className={styles.reportDescription}>Lihat daftar produk berdasarkan jumlah stok tersedia</p>
                                    <div className={styles.reportStats}>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                                            </svg>
                                            {summary.totalProducts || 0} Produk
                                        </span>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                                            </svg>
                                            {summary.totalStock || 0} Unit
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.reportArrow}>→</div>
                            </button>

                            <button 
                                className={styles.reportCard}
                                onClick={() => setIsRatingReportOpen(true)}
                            >
                                <div className={styles.reportIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                    </svg>
                                </div>
                                <div className={styles.reportContent}>
                                    <h3 className={styles.reportTitle}>Laporan Rating</h3>
                                    <p className={styles.reportDescription}>Lihat daftar produk berdasarkan rating tertinggi</p>
                                    <div className={styles.reportStats}>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                            </svg>
                                            {summary.averageRating || '0.0'} Rata-rata
                                        </span>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                            </svg>
                                            {summary.totalReviews || 0} Ulasan
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.reportArrow}>→</div>
                            </button>

                            <button 
                                className={styles.reportCard}
                                onClick={() => setIsReorderReportOpen(true)}
                            >
                                <div className={styles.reportIcon}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                </div>
                                <div className={styles.reportContent}>
                                    <h3 className={styles.reportTitle}>Laporan Restock</h3>
                                    <p className={styles.reportDescription}>Produk dengan stok rendah yang perlu segera diisi ulang</p>
                                    <div className={styles.reportStats}>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="8" x2="12" y2="12"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                                            </svg>
                                            Stok Rendah
                                        </span>
                                        <span className={styles.statItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 20v-6M6 20V10M18 20V4"/>
                                            </svg>
                                            Prioritas
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.reportArrow}>→</div>
                            </button>
                        </div>

                        <div className={styles.reportsInfo}>
                            <div className={styles.infoCard}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A57B3" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 16v-4"/>
                                    <path d="M12 8h.01"/>
                                </svg>
                                <div>
                                    <h4>Cara Menggunakan</h4>
                                    <p>Klik pada kartu laporan untuk melihat pratinjau data. Anda dapat mengunduh laporan dalam format PDF dengan tombol "Unduh PDF".</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Report Modals */}
            <StockReportModal 
                isOpen={isStockReportOpen} 
                onClose={() => setIsStockReportOpen(false)} 
            />
            <RatingReportModal 
                isOpen={isRatingReportOpen} 
                onClose={() => setIsRatingReportOpen(false)} 
            />
            <ReorderReportModal 
                isOpen={isReorderReportOpen} 
                onClose={() => setIsReorderReportOpen(false)} 
            />
        </div>
    );
}

export default SellerDashboard;
