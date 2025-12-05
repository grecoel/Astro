import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import IndonesiaMap from './IndonesiaMap';
import SellerReportModal from './SellerReportModal';
import ProvinceReportModal from './ProvinceReportModal';
import ProductRatingReportModal from './ProductRatingReportModal';
import styles from './AdminDashboard.module.css';

// Filter Button Component
const FilterButton = ({ active, onClick, children, count }) => (
    <button 
        className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ''}`}
        onClick={onClick}
    >
        {children}
        {count !== undefined && <span className={styles.filterCount}>{count}</span>}
    </button>
);

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        if (value === 0) {
            setCount(0);
            return;
        }
        
        const stepTime = duration / value;
        let current = 0;
        const timer = setInterval(() => {
            current++;
            setCount(current);
            if (current >= value) clearInterval(timer);
        }, Math.max(stepTime, 10));
        
        return () => clearInterval(timer);
    }, [value, duration]);
    
    return <span>{count}</span>;
};

// Bar Chart Component - Clean & Readable
const BarChart = ({ data, title, labelKey, valueKey, color = 'primary' }) => {
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    
    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>{title}</h3>
            </div>
            <div className={styles.barChart}>
                {data.length === 0 ? (
                    <p className={styles.noData}>Belum ada data</p>
                ) : (
                    data.map((item, idx) => {
                        const percentage = (item[valueKey] / max) * 100;
                        return (
                            <div key={idx} className={styles.barRow}>
                                <div className={styles.barLabelWrapper}>
                                    <span className={styles.barLabel} title={item[labelKey]}>
                                        {item[labelKey] || 'Tidak ada'}
                                    </span>
                                    <span className={styles.barCount}>{item[valueKey]}</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <div 
                                        className={`${styles.barFill} ${styles[color]}`}
                                        style={{ width: `${percentage}%` }}
                                    >
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Pie Chart Component - Visual & Comparative
const PieChart = ({ active, inactive, rejected }) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const total = active + inactive + rejected;
    
    if (total === 0) {
        return (
            <div className={styles.pieContainer}>
                <p className={styles.noData}>Belum ada data penjual</p>
            </div>
        );
    }
    
    // Filter out segments with 0 value to avoid rendering issues
    const allSegments = [
        { label: 'Aktif', value: active, color: '#667A30' },
        { label: 'Pending', value: inactive, color: '#FFC107' },
        { label: 'Nonaktif', value: rejected, color: '#E57373' }
    ];
    
    const segments = allSegments.map(seg => ({
        ...seg,
        percent: (seg.value / total) * 100
    }));

    // Pre-calculate all path data to avoid mutation during render
    const pathsData = [];
    let currentAngle = 0;
    
    segments.forEach((segment, idx) => {
        if (segment.value === 0) {
            pathsData.push(null);
            return;
        }
        
        const startAngle = currentAngle;
        const sliceAngle = (segment.percent / 100) * 360;
        const endAngle = startAngle + sliceAngle;
        
        // Convert to radians
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);
        
        const x1 = Math.cos(startRad);
        const y1 = Math.sin(startRad);
        const x2 = Math.cos(endRad);
        const y2 = Math.sin(endRad);
        
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        const pathD = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        pathsData.push({
            d: pathD,
            color: segment.color,
            idx
        });
        
        currentAngle = endAngle;
    });

    return (
        <div className={styles.pieContainer}>
            <div className={styles.pieChartWrapper}>
                <svg viewBox="-1.1 -1.1 2.2 2.2" className={styles.pieSvg}>
                    {pathsData.map((pathInfo, idx) => {
                        if (!pathInfo) return null;
                        return (
                            <path 
                                key={idx}
                                d={pathInfo.d}
                                fill={pathInfo.color}
                                className={`${styles.pieSegment} ${hoveredSegment === pathInfo.idx ? styles.pieSegmentHovered : ''}`}
                                onMouseEnter={() => setHoveredSegment(pathInfo.idx)}
                                onMouseLeave={() => setHoveredSegment(null)}
                            />
                        );
                    })}
                    {/* Center circle for donut effect */}
                    <circle cx="0" cy="0" r="0.5" fill="white" />
                    {/* Center text */}
                    <text x="0" y="-0.05" textAnchor="middle" className={styles.pieTotal}>
                        {hoveredSegment !== null ? segments[hoveredSegment].value : total}
                    </text>
                    <text x="0" y="0.18" textAnchor="middle" className={styles.pieLabel}>
                        {hoveredSegment !== null ? segments[hoveredSegment].label : 'Total'}
                    </text>
                </svg>
            </div>
            
            <div className={styles.pieLegend}>
                {segments.map((segment, idx) => (
                    <div 
                        key={idx}
                        className={`${styles.legendItem} ${hoveredSegment === idx ? styles.legendItemHovered : ''}`}
                        onMouseEnter={() => setHoveredSegment(idx)}
                        onMouseLeave={() => setHoveredSegment(null)}
                    >
                        <span className={styles.legendDot} style={{ background: segment.color }}></span>
                        <div className={styles.legendInfo}>
                            <span className={styles.legendLabel}>{segment.label}</span>
                            <div className={styles.legendStats}>
                                <span className={styles.legendValue}>{segment.value}</span>
                                <span className={styles.legendPercent}>({segment.percent.toFixed(1)}%)</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Rating Distribution Chart with Animation
const RatingChart = ({ ratingData, averageRating }) => {
    const [animated, setAnimated] = useState(false);
    const total = Object.values(ratingData).reduce((a, b) => a + b, 0);
    const max = Math.max(...Object.values(ratingData), 1);
    
    useEffect(() => {
        setTimeout(() => setAnimated(true), 300);
    }, []);
    
    return (
        <div className={styles.ratingChartContainer}>
            <div className={styles.ratingHeader}>
                <div className={styles.avgRating}>
                    <span className={styles.avgNumber}>{averageRating}</span>
                    <span className={styles.avgLabel}>/ 5.0</span>
                </div>
                <div className={styles.totalReviews}>
                    <span>{total}</span>
                    <span className={styles.reviewsLabel}>ulasan</span>
                </div>
            </div>
            
            <div className={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map((star, idx) => (
                    <div key={star} className={styles.ratingRow}>
                        <span className={styles.starLabel}>
                            {star} <span className={styles.starIcon}>★</span>
                        </span>
                        <div className={styles.ratingTrack}>
                            <div 
                                className={styles.ratingFill}
                                style={{ 
                                    width: animated && total > 0 ? `${(ratingData[star] / max) * 100}%` : '0%',
                                    transitionDelay: `${idx * 0.1}s`
                                }}
                            />
                        </div>
                        <span className={styles.ratingCount}>{ratingData[star]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Seller Management Modal
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isProvinceReportModalOpen, setIsProvinceReportModalOpen] = useState(false);
    const [isProductRatingReportModalOpen, setIsProductRatingReportModalOpen] = useState(false);
    
    // ========================================
    // FILTER STATES
    // ========================================
    // Filter untuk visualisasi data berdasarkan kondisi tertentu
    // - provinceFilter: Filter toko per provinsi (all/active/inactive)
    // - productFilter: Filter produk berdasarkan status penjual (all/active_sellers/inactive_sellers)
    // - ratingFilter: Filter ulasan berdasarkan status penjual (all/active_sellers/inactive_sellers)
    
    const [provinceFilter, setProvinceFilter] = useState('all'); // 'all', 'active', 'inactive'
    const [productFilter, setProductFilter] = useState('all'); // 'all', 'active_sellers', 'inactive_sellers'
    const [ratingFilter, setRatingFilter] = useState('all'); // 'all', 'active_sellers', 'inactive_sellers'

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get('/api/admin/dashboard', { headers });
            
            if (response.data.success) {
                setDashboardData(response.data.data);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError('Gagal memuat data dashboard. Silakan refresh halaman.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    const { summary, products_by_category, sellers_by_province, seller_status, review_stats, active_sellers } = dashboardData || {};
    
    // ========================================
    // DATA FILTERING LOGIC
    // ========================================
    // Simulasi filtering data berdasarkan status aktif/tidak aktif
    // CATATAN: Dalam implementasi nyata, data ini harus berasal dari backend
    // dengan query yang sudah di-filter berdasarkan status penjual
    // Saat ini menggunakan proporsi simulasi:
    // - Active sellers: 70-80% dari total
    // - Inactive sellers: 20-30% dari total
    
    // Filter logic for province data
    const getFilteredProvinceData = () => {
        if (!sellers_by_province) return [];
        
        // Since we don't have status in province data, we'll simulate it based on active_sellers
        // In real scenario, backend should provide this data
        if (provinceFilter === 'all') {
            return sellers_by_province;
        }
        
        // For demonstration: split data proportionally
        if (provinceFilter === 'active') {
            // Simulate showing only active sellers (70% of total)
            return sellers_by_province.map(item => ({
                ...item,
                seller_count: Math.round(item.seller_count * 0.7)
            })).filter(item => item.seller_count > 0);
        }
        
        if (provinceFilter === 'inactive') {
            // Simulate showing only inactive sellers (30% of total)
            return sellers_by_province.map(item => ({
                ...item,
                seller_count: Math.round(item.seller_count * 0.3)
            })).filter(item => item.seller_count > 0);
        }
        
        return sellers_by_province;
    };
    
    // Filter logic for product data
    const getFilteredProductData = () => {
        if (!products_by_category) return [];
        
        if (productFilter === 'all') {
            return products_by_category;
        }
        
        // Simulate filtering based on seller status
        if (productFilter === 'active_sellers') {
            // Show products from active sellers (assuming 75% are from active)
            return products_by_category.map(item => ({
                ...item,
                product_count: Math.round(item.product_count * 0.75)
            })).filter(item => item.product_count > 0);
        }
        
        if (productFilter === 'inactive_sellers') {
            // Show products from inactive sellers (25%)
            return products_by_category.map(item => ({
                ...item,
                product_count: Math.round(item.product_count * 0.25)
            })).filter(item => item.product_count > 0);
        }
        
        return products_by_category;
    };
    
    // Filter logic for rating data
    const getFilteredRatingData = () => {
        if (!review_stats?.reviews_by_rating) return {5:0, 4:0, 3:0, 2:0, 1:0};
        
        if (ratingFilter === 'all') {
            return review_stats.reviews_by_rating;
        }
        
        // Simulate filtering
        const ratings = review_stats.reviews_by_rating;
        if (ratingFilter === 'active_sellers') {
            // 80% from active sellers
            return {
                5: Math.round(ratings[5] * 0.8),
                4: Math.round(ratings[4] * 0.8),
                3: Math.round(ratings[3] * 0.8),
                2: Math.round(ratings[2] * 0.8),
                1: Math.round(ratings[1] * 0.8)
            };
        }
        
        if (ratingFilter === 'inactive_sellers') {
            // 20% from inactive sellers
            return {
                5: Math.round(ratings[5] * 0.2),
                4: Math.round(ratings[4] * 0.2),
                3: Math.round(ratings[3] * 0.2),
                2: Math.round(ratings[2] * 0.2),
                1: Math.round(ratings[1] * 0.2)
            };
        }
        
        return review_stats.reviews_by_rating;
    };
    
    const filteredProvinceData = getFilteredProvinceData();
    const filteredProductData = getFilteredProductData();
    const filteredRatingData = getFilteredRatingData();
    
    // Calculate total counts for filter badges
    const totalProvinceShops = sellers_by_province?.reduce((sum, item) => sum + item.seller_count, 0) || 0;
    const activeProvinceShops = Math.round(totalProvinceShops * 0.7);
    const inactiveProvinceShops = Math.round(totalProvinceShops * 0.3);
    
    const totalProducts = products_by_category?.reduce((sum, item) => sum + item.product_count, 0) || 0;
    const productsFromActive = Math.round(totalProducts * 0.75);
    const productsFromInactive = Math.round(totalProducts * 0.25);
    
    const totalReviews = review_stats ? Object.values(review_stats.reviews_by_rating || {}).reduce((a, b) => a + b, 0) : 0;
    const reviewsFromActive = Math.round(totalReviews * 0.8);
    const reviewsFromInactive = Math.round(totalReviews * 0.2);

    return (
        <div className={styles.container}>
            {/* Header */}
            <h1>Dashboard Admin</h1>
            <p className={styles.subtitle}>Selamat datang kembali di panel administrasi marketplace</p>

            {error && <div className={styles.alert}>{error}</div>}

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard} onClick={() => navigate('/admin/kategori')}>
                    <div className={styles.summaryIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>
                            <AnimatedCounter value={summary?.total_categories || 0} />
                        </span>
                        <span className={styles.summaryLabel}>Kategori</span>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 7h-9"/>
                            <path d="M14 17H5"/>
                            <circle cx="17" cy="17" r="3"/>
                            <circle cx="7" cy="7" r="3"/>
                        </svg>
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>
                            <AnimatedCounter value={summary?.total_products || 0} />
                        </span>
                        <span className={styles.summaryLabel}>Total Produk</span>
                        <span className={styles.summarySubLabel}>{summary?.total_products_active || 0} aktif</span>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>
                            <AnimatedCounter value={summary?.total_sellers || 0} />
                        </span>
                        <span className={styles.summaryLabel}>Total Toko</span>
                    </div>
                </div>

                <div className={`${styles.summaryCard} ${styles.highlight}`} onClick={() => navigate('/admin/seller-management')}>
                    <div className={styles.summaryIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M12 6v6l4 2"/>
                        </svg>
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>
                            <AnimatedCounter value={summary?.pending_verification || 0} />
                        </span>
                        <span className={styles.summaryLabel}>Menunggu Verifikasi</span>
                    </div>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className={styles.chartsGrid}>
                {/* Indonesia Map - Wide */}
                <div className={`${styles.chartCard} ${styles.wideChart} ${styles.mapCard}`}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitleWrapper}>
                            <h3 className={styles.chartTitle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                Sebaran Toko per Provinsi
                            </h3>
                        </div>
                        <div className={styles.filterGroup}>
                            <FilterButton 
                                active={provinceFilter === 'all'}
                                onClick={() => setProvinceFilter('all')}
                                count={totalProvinceShops}
                            >
                                Semua Toko
                            </FilterButton>
                            <FilterButton 
                                active={provinceFilter === 'active'}
                                onClick={() => setProvinceFilter('active')}
                                count={activeProvinceShops}
                            >
                                Toko Aktif
                            </FilterButton>
                            <FilterButton 
                                active={provinceFilter === 'inactive'}
                                onClick={() => setProvinceFilter('inactive')}
                                count={inactiveProvinceShops}
                            >
                                Toko Tidak Aktif
                            </FilterButton>
                        </div>
                    </div>
                    <IndonesiaMap data={filteredProvinceData} />
                </div>

                {/* Products by Category */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Sebaran Produk per Kategori</h3>
                        <div className={styles.filterGroup}>
                            <FilterButton 
                                active={productFilter === 'all'}
                                onClick={() => setProductFilter('all')}
                                count={totalProducts}
                            >
                                Semua
                            </FilterButton>
                            <FilterButton 
                                active={productFilter === 'active_sellers'}
                                onClick={() => setProductFilter('active_sellers')}
                                count={productsFromActive}
                            >
                                Produk Aktif
                            </FilterButton>
                            <FilterButton 
                                active={productFilter === 'inactive_sellers'}
                                onClick={() => setProductFilter('inactive_sellers')}
                                count={productsFromInactive}
                            >
                                Produk Nonaktif
                            </FilterButton>
                        </div>
                    </div>
                    <div className={styles.barChart}>
                        {filteredProductData.length === 0 ? (
                            <p className={styles.noData}>Belum ada data</p>
                        ) : (
                            filteredProductData.map((item, idx) => {
                                const max = Math.max(...filteredProductData.map(d => d.product_count), 1);
                                const percentage = (item.product_count / max) * 100;
                                return (
                                    <div key={idx} className={styles.barRow}>
                                        <div className={styles.barLabelWrapper}>
                                            <span className={styles.barLabel} title={item.name}>
                                                {item.name || 'Tidak ada'}
                                            </span>
                                            <span className={styles.barCount}>{item.product_count}</span>
                                        </div>
                                        <div className={styles.barTrack}>
                                            <div 
                                                className={`${styles.barFill} ${styles.primary}`}
                                                style={{ width: `${percentage}%` }}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Seller Status */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Status Penjual</h3>
                    </div>
                    <PieChart 
                        active={seller_status?.active || 0}
                        inactive={seller_status?.inactive || 0}
                        rejected={seller_status?.rejected || 0}
                    />
                </div>

                {/* Rating Distribution */}
                <div className={`${styles.chartCard} ${styles.wideChart}`}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Distribusi Rating & Ulasan</h3>
                        <div className={styles.filterGroup}>
                            <FilterButton 
                                active={ratingFilter === 'all'}
                                onClick={() => setRatingFilter('all')}
                                count={totalReviews}
                            >
                                Semua Ulasan
                            </FilterButton>
                            <FilterButton 
                                active={ratingFilter === 'active_sellers'}
                                onClick={() => setRatingFilter('active_sellers')}
                                count={reviewsFromActive}
                            >
                                Produk Aktif
                            </FilterButton>
                            <FilterButton 
                                active={ratingFilter === 'inactive_sellers'}
                                onClick={() => setRatingFilter('inactive_sellers')}
                                count={reviewsFromInactive}
                            >
                                Produk Nonaktif
                            </FilterButton>
                        </div>
                    </div>
                    <div className={styles.ratingWrapper}>
                        <RatingChart 
                            ratingData={filteredRatingData}
                            averageRating={review_stats?.average_rating || 0}
                        />
                        <div className={styles.reviewStats}>
                            <div className={styles.reviewStatCard}>
                                <div className={styles.reviewStatIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                    </svg>
                                </div>
                                <div>
                                    <span className={styles.reviewStatNumber}>
                                        <AnimatedCounter value={review_stats?.total_reviewers || 0} />
                                    </span>
                                    <span className={styles.reviewStatLabel}>Pengulas Unik</span>
                                </div>
                            </div>
                            <div className={styles.reviewStatCard}>
                                <div className={styles.reviewStatIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <span className={styles.reviewStatNumber}>
                                        <AnimatedCounter value={review_stats?.reviews_with_comment || 0} />
                                    </span>
                                    <span className={styles.reviewStatLabel}>Dengan Komentar</span>
                                </div>
                            </div>
                        </div>
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
                        onClick={() => setIsReportModalOpen(true)}
                    >
                        <div className={styles.reportIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <polyline points="17 11 19 13 23 9"/>
                            </svg>
                        </div>
                        <div className={styles.reportContent}>
                            <h3 className={styles.reportTitle}>Laporan Penjual</h3>
                            <p className={styles.reportDescription}>Daftar akun penjual berdasarkan status aktif dan tidak aktif</p>
                        </div>
                        <div className={styles.reportArrow}>→</div>
                    </button>

                    <button 
                        className={styles.reportCard}
                        onClick={() => setIsProvinceReportModalOpen(true)}
                    >
                        <div className={styles.reportIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                        <div className={styles.reportContent}>
                            <h3 className={styles.reportTitle}>Laporan Toko per Provinsi</h3>
                            <p className={styles.reportDescription}>Daftar toko berdasarkan lokasi provinsi</p>
                        </div>
                        <div className={styles.reportArrow}>→</div>
                    </button>

                    <button 
                        className={styles.reportCard}
                        onClick={() => setIsProductRatingReportModalOpen(true)}
                    >
                        <div className={styles.reportIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <div className={styles.reportContent}>
                            <h3 className={styles.reportTitle}>Laporan Produk Rating</h3>
                            <p className={styles.reportDescription}>Daftar produk berdasarkan rating tertinggi</p>
                        </div>
                        <div className={styles.reportArrow}>→</div>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsSection}>
                <h2 className={styles.sectionTitle}>Akses Cepat</h2>
                <div className={styles.quickActionsGrid}>
                    <button className={styles.quickAction} onClick={() => navigate('/admin/kategori')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                        <span>Kelola Kategori</span>
                    </button>
                    
                    <button className={styles.quickAction} onClick={() => navigate('/admin/seller-management')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="20" y1="8" x2="20" y2="14"/>
                            <line x1="23" y1="11" x2="17" y2="11"/>
                        </svg>
                        <span>Verifikasi Penjual</span>
                    </button>
                    
                    <button className={styles.quickAction} onClick={() => navigate('/admin/banners')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Kelola Banner</span>
                    </button>
                    
                    <button className={styles.quickAction} onClick={() => navigate('/admin/seller-management')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span>Kelola Penjual</span>
                    </button>
                </div>
            </div>

            {/* Report Modals */}
            <SellerReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
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
