import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './SellerDashboard.module.css';
import '../../../css/app.css'; // Import global CSS

function SellerDashboard() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalProducts: 0,
        averageRating: 0,
        totalReviewers: 0
    });
    const [productStock, setProductStock] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        const fetchSellerStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Get current user info
                const userResponse = await axios.get('/api/user', { headers });
                setUser(userResponse.data.user);

                // Get seller status
                const statusResponse = await axios.get('/api/seller/status', { headers });
                
                if (statusResponse.data.activated) {
                    setSeller(statusResponse.data.seller);
                    
                    // Fetch seller's products for dashboard
                    const productsResponse = await axios.get('/api/seller/dashboard/products', { headers });
                    const products = productsResponse.data.products;
                    
                    // Transform products data for stock chart
                    const stockData = products.map(product => ({
                        name: product.name,
                        stock: product.stock || 0
                    }));
                    setProductStock(stockData);
                    
                    // Fetch statistics from dedicated endpoint
                    const statsResponse = await axios.get('/api/seller/dashboard/stats', { headers });
                    setStats(statsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching seller data:', err);
                setError(err.response?.data?.message || 'Gagal memuat data seller');
            } finally {
                setLoading(false);
            }
        };

        fetchSellerStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handleSort = (option) => {
        setSortOption(option);
        setShowSortDropdown(false);
        
        let sortedStock = [...productStock];
        if (option === 'tertinggi') {
            sortedStock.sort((a, b) => b.stock - a.stock);
        } else if (option === 'terendah') {
            sortedStock.sort((a, b) => a.stock - b.stock);
        } else if (option === 'default') {
            sortedStock.sort((a, b) => a.name.localeCompare(b.name));
        }
        setProductStock(sortedStock);
    };

    const getSortButtonText = () => {
        switch(sortOption) {
            case 'tertinggi':
                return 'Tertinggi';
            case 'terendah':
                return 'Terendah';
            default:
                return 'Urutkan';
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingBox}>
                    <p>Memuat data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorBox}>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')}>Kembali ke Login</button>
                </div>
            </div>
        );
    }

    const maxStock = Math.max(...productStock.map(p => p.stock)); 

    return (
        <div className={styles.dashboardWrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}></div>
                    <span>Astroecomm</span>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.navItemActive}>
                        <span className={styles.navIcon}></span>
                        Dashboard
                    </button>
                    <button className={styles.navItem} onClick={() => navigate('/seller/detail')}>
                        <span className={styles.navIcon}></span>
                        Detail
                    </button>
                    <button className={styles.navItem} onClick={() => navigate('/seller/upload-produk')}>
                        <span className={styles.navIcon}></span>
                        Upload Produk
                    </button>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.topHeader}>
                    <div className={styles.searchContainer}>
                        <input 
                            type="text" 
                            placeholder="Search ..." 
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.userSection}>
                        <button 
                            className={styles.catalogBtn}
                            onClick={() => navigate('/products')}
                        >
                            Kunjungi Katalog
                        </button>
                        <div className={styles.userInfo} onClick={() => setShowDropdown(!showDropdown)}>
                            <img src="/images/store-icon.png" alt="Store" className={styles.storeIcon} />
                            <span className={styles.storeName}>Toko {seller?.store_name || user?.name}</span>
                            <span className={styles.dropdownArrow}>▼</span>
                        </div>
                        {showDropdown && (
                            <div className={styles.dropdown}>
                                <button className={styles.dropdownItem} onClick={handleLogout}>
                                    <span></span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className={styles.contentArea}>
                    <h1 className={styles.welcomeTitle}>Welcome back, <span>{user?.name}</span>!</h1>

                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} ${styles.statCardPurple}`}>
                            <div className={styles.statLabel}>Total Produk</div>
                            <div className={styles.statValue}>{stats.totalProducts}</div>
                            <div className={styles.statSubtext}>+5% peningkatan produk bulan ini</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Rerata Rating Produk</div>
                            <div className={styles.statValue}>{stats.averageRating}</div>
                            <div className={styles.statSubtext}>+5% peningkatan rating dari bulan sebelumnya</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Jumlah Pemberi Rating</div>
                            <div className={styles.statValue}>{stats.totalReviewers}</div>
                            <div className={styles.statSubtext}>+5% peningkatan rating dari bulan sebelumnya</div>
                        </div>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h2>Stok Produk</h2>
                            <div className={styles.sortContainer}>
                                <button 
                                    className={styles.sortBtn}
                                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                                >
                                    {getSortButtonText()}
                                    <span className={styles.sortArrow}>▼</span>
                                </button>
                                {showSortDropdown && (
                                    <div className={styles.sortDropdown}>
                                        <button 
                                            className={styles.sortDropdownItem}
                                            onClick={() => handleSort('default')}
                                        >
                                            Urutkan
                                        </button>
                                        <button 
                                            className={styles.sortDropdownItem}
                                            onClick={() => handleSort('tertinggi')}
                                        >
                                            Tertinggi
                                        </button>
                                        <button 
                                            className={styles.sortDropdownItem}
                                            onClick={() => handleSort('terendah')}
                                        >
                                            Terendah
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.chartYAxis}>
                                {[1000, 500, 100, 50, 10, 1, 0].map(num => (
                                    <div key={num} className={styles.yAxisLabel}>{num}</div>
                                ))}
                            </div>
                            <div className={styles.chartBars}>
                                {productStock.map((product, index) => (
                                    <div key={index} className={styles.barWrapper}>
                                        <div 
                                            className={styles.bar}
                                            style={{ height: `${(product.stock / maxStock) * 100}%` }}
                                        ></div>
                                        <div className={styles.barLabel}>{product.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SellerDashboard;
