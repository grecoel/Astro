import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SellerDashboard.module.css';
import IndonesiaMap from './IndonesiaMap';

function SellerDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Dashboard Data
    const [dashboardData, setDashboardData] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeView, setActiveView] = useState('all'); // 'all', 'products', 'ratings', 'reviewers'
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [hoveredProvince, setHoveredProvince] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Get user info
            const userResponse = await axios.get('/api/user', { headers });
            setUser(userResponse.data.user);

            // Get seller status
            const statusResponse = await axios.get('/api/seller/status', { headers });
            
            if (statusResponse.data.activated) {
                setSeller(statusResponse.data.seller);
                
                // Get comprehensive dashboard data
                const dashResponse = await axios.get('/api/seller/dashboard/data', { headers });
                console.log('Dashboard Data:', dashResponse.data);
                console.log('Product Stocks:', dashResponse.data.productStocks);
                console.log('Product Ratings:', dashResponse.data.productRatings);
                setDashboardData(dashResponse.data);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Memuat data dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorBox}>
                    <h3>Error</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')} className={styles.btnPrimary}>
                        Kembali ke Login
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return null;
    }

    // Safely destructure dashboard data
    const { 
        summary = {}, 
        productStocks = [], 
        productRatings = [], 
        reviewersByProvince = [] 
    } = dashboardData || {};
    
    // Calculate max values for chart scaling
    const maxStock = productStocks.length > 0 ? Math.max(...productStocks.map(p => p.stock || 0), 1) : 1;
    const maxReviewers = reviewersByProvince.length > 0 ? Math.max(...reviewersByProvince.map(p => p.total || 0), 1) : 1;
    
    // Generate Y-axis labels for stock chart
    const generateYAxisLabels = (max) => {
        const step = Math.ceil(max / 5);
        const labels = [];
        for (let i = 5; i >= 0; i--) {
            labels.push(step * i);
        }
        return labels;
    };
    
    const yAxisLabels = generateYAxisLabels(maxStock);

    return (
        <div className={styles.dashboardWrapper}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <div className={styles.logoIcon}>
                        <img src="/logo.png" alt="Logo" />
                    </div>
                    <span className={styles.logoText}>AstroEcomm</span>
                </div>
                
                <nav className={styles.nav}>
                    <button className={styles.navItemActive}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                        Dashboard
                    </button>
                    <button className={styles.navItem} onClick={() => navigate('/seller/detail')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Detail Toko
                    </button>
                    <button className={styles.navItem} onClick={() => navigate('/seller/upload-produk')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Upload Produk
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>Dashboard</h1>
                        <p className={styles.pageSubtitle}>Selamat datang kembali, {user?.name}!</p>
                    </div>
                    
                    <div className={styles.headerRight}>
                        <button 
                            className={styles.btnCatalog}
                            onClick={() => navigate('/products')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                            Kunjungi Katalog
                        </button>
                        
                        <div className={styles.userMenu}>
                            <button 
                                className={styles.userButton}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className={styles.userAvatar}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className={styles.userName}>{seller?.store_name}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </button>
                            
                            {showDropdown && (
                                <div className={styles.dropdown}>
                                    <button onClick={handleLogout} className={styles.dropdownItem}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stats Cards - Clickable */}
                <div className={styles.statsGrid}>
                    <button 
                        className={`${styles.statCard} ${styles.statCardPurple} ${activeView === 'products' ? styles.statCardActive : ''}`}
                        onClick={() => setActiveView(activeView === 'products' ? 'all' : 'products')}
                    >
                        <div className={styles.statIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Total Produk</div>
                            <div className={styles.statValue}>{summary.totalProducts}</div>
                            <div className={styles.statSubtext}>{summary.totalStock} unit total stok</div>
                        </div>
                        {activeView === 'products' && <div className={styles.activeIndicator}></div>}
                    </button>

                    <button 
                        className={`${styles.statCard} ${activeView === 'ratings' ? styles.statCardActive : ''}`}
                        onClick={() => setActiveView(activeView === 'ratings' ? 'all' : 'ratings')}
                    >
                        <div className={styles.statIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#7A57B3">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Rating Rata-rata</div>
                            <div className={styles.statValue}>{summary.averageRating}/5.0</div>
                            <div className={styles.statSubtext}>Dari {summary.totalReviews} ulasan</div>
                        </div>
                        {activeView === 'ratings' && <div className={styles.activeIndicator}></div>}
                    </button>

                    <button 
                        className={`${styles.statCard} ${activeView === 'reviewers' ? styles.statCardActive : ''}`}
                        onClick={() => setActiveView(activeView === 'reviewers' ? 'all' : 'reviewers')}
                    >
                        <div className={styles.statIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#7A57B3">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                        </div>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Total Reviewer</div>
                            <div className={styles.statValue}>{summary.totalReviewers}</div>
                            <div className={styles.statSubtext}>Reviewer unik</div>
                        </div>
                        {activeView === 'reviewers' && <div className={styles.activeIndicator}></div>}
                    </button>
                </div>

                {/* Charts Section - Conditional Rendering */}
                <div className={styles.chartsContainer}>
                    {/* Chart 1: Sebaran Stok Produk - Show when 'all' or 'products' */}
                    {(activeView === 'all' || activeView === 'products') && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div className={styles.chartTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#7A57B3">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                                <div>
                                    <h3>Sebaran Stok Produk</h3>
                                    <p>Jumlah stok per produk yang Anda miliki</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBody}>
                            {productStocks.length > 0 ? (
                                <div className={styles.barChartWrapper}>
                                    {/* Y-Axis */}
                                    <div className={styles.yAxis}>
                                        {yAxisLabels.map((label, idx) => (
                                            <div key={idx} className={styles.yAxisLabel}>
                                                <span>{label}</span>
                                                <div className={styles.yAxisLine}></div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Chart Area */}
                                    <div className={styles.chartArea}>
                                        {/* Grid Lines */}
                                        <div className={styles.gridLines}>
                                            {yAxisLabels.map((_, idx) => (
                                                <div key={idx} className={styles.gridLine}></div>
                                            ))}
                                        </div>
                                        
                                        {/* Bars */}
                                        <div className={styles.barsContainer}>
                                            {productStocks.map((product, index) => (
                                                <div 
                                                    key={index} 
                                                    className={styles.barColumn}
                                                    onMouseEnter={() => setHoveredProduct(index)}
                                                    onMouseLeave={() => setHoveredProduct(null)}
                                                >
                                                    {/* Tooltip */}
                                                    {hoveredProduct === index && (
                                                        <div className={styles.barTooltip}>
                                                            <div className={styles.tooltipName}>{product.name}</div>
                                                            <div className={styles.tooltipValue}>Stok: {product.stock} unit</div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className={styles.barWrapper}>
                                                        <div 
                                                            className={`${styles.bar} ${hoveredProduct === index ? styles.barHovered : ''}`}
                                                            style={{ height: `${(product.stock / yAxisLabels[0]) * 100}%` }}
                                                        >
                                                            <span className={styles.barValueLabel}>{product.stock}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Product Image/Label */}
                                                    <div className={styles.barLabel}>
                                                        <div className={styles.productThumbWrapper}>
                                                            {product.image ? (
                                                                <img 
                                                                    src={product.image} 
                                                                    alt={product.name}
                                                                    className={styles.productThumb}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextElementSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div 
                                                                className={styles.productThumbPlaceholder} 
                                                                style={{ display: product.image ? 'none' : 'flex' }}
                                                            >
                                                                {product.name?.charAt(0) || '?'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>Belum ada produk</p>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Chart 2: Rating Per Produk - Show when 'all' or 'ratings' */}
                    {(activeView === 'all' || activeView === 'ratings') && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div className={styles.chartTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#7A57B3">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <div>
                                    <h3>Rating Per Produk</h3>
                                    <p>Rata-rata rating yang diterima setiap produk</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBody}>
                            {productRatings.length > 0 ? (
                                <div className={styles.ratingList}>
                                    {productRatings.map((product, index) => (
                                        <div key={index} className={styles.ratingItem}>
                                            <div className={styles.ratingLeft}>
                                                {product.image ? (
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name}
                                                        className={styles.productImage}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div 
                                                    className={styles.productImagePlaceholder}
                                                    style={{ display: product.image ? 'none' : 'flex' }}
                                                >
                                                    {product.name?.charAt(0) || '?'}
                                                </div>
                                                <div className={styles.productInfo}>
                                                    <div className={styles.productName}>{product.name}</div>
                                                    <div className={styles.reviewCount}>{product.review_count} ulasan</div>
                                                </div>
                                            </div>
                                            <div className={styles.ratingRight}>
                                                <div className={styles.ratingBar}>
                                                    <div 
                                                        className={styles.ratingBarFill}
                                                        style={{ width: `${(product.rating / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className={styles.ratingValue}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FDB813">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                    </svg>
                                                    {product.rating}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>Belum ada produk dengan rating</p>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Chart 3: Sebaran Reviewer by Provinsi dengan Peta - Show when 'all' or 'reviewers' */}
                    {(activeView === 'all' || activeView === 'reviewers') && (
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <div className={styles.chartTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#7A57B3">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <div>
                                    <h3>Sebaran Reviewer by Provinsi</h3>
                                    <p>Lokasi asal pemberi rating (Top 10)</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartBody}>
                            {reviewersByProvince.length > 0 ? (
                                <div className={styles.mapContainer}>
                                    {/* Real Indonesia Map with Leaflet */}
                                    <div className={styles.indonesiaMap}>
                                        <IndonesiaMap 
                                            data={reviewersByProvince}
                                            maxValue={maxReviewers}
                                            hoveredIndex={hoveredProvince}
                                            onHover={setHoveredProvince}
                                        />
                                    </div>
                                    
                                    {/* Legend / List */}
                                    <div className={styles.mapLegend}>
                                        <div className={styles.legendTitle}>Top Provinsi</div>
                                        {reviewersByProvince.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className={`${styles.legendItem} ${hoveredProvince === index ? styles.legendItemHovered : ''}`}
                                                onMouseEnter={() => setHoveredProvince(index)}
                                                onMouseLeave={() => setHoveredProvince(null)}
                                            >
                                                <div className={styles.legendRank}>#{index + 1}</div>
                                                <div className={styles.legendInfo}>
                                                    <div className={styles.legendName}>{item.province}</div>
                                                    <div className={styles.legendBar}>
                                                        <div 
                                                            className={styles.legendBarFill}
                                                            style={{ width: `${(item.total / maxReviewers) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className={styles.legendCount}>{item.total}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>Belum ada data reviewer</p>
                                </div>
                            )}
                        </div>
                    </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SellerDashboard;
