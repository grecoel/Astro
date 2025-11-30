import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SellerManagement.module.css';

function SellerManagement() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    
    // Data states
    const [products, setProducts] = useState([]);
    const [productRatings, setProductRatings] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [generating, setGenerating] = useState(false);

    // Fetch user data
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');
                return;
            }

            console.log('Fetching user data...');
            
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Parallel API calls untuk kecepatan
            const [userResponse, sellerResponse, dashResponse] = await Promise.all([
                axios.get('/api/user'),
                axios.get('/api/seller/status'),
                axios.get('/api/seller/dashboard/data')
            ]);

            console.log('User response:', userResponse.data);
            console.log('Seller response:', sellerResponse.data);
            console.log('Dashboard data response:', dashResponse.data);
            
            if (userResponse.data.user.role !== 'seller') {
                console.log('User is not a seller, redirecting...');
                navigate('/');
                return;
            }

            setUser(userResponse.data.user);

            if (sellerResponse.data.activated) {
                setSeller(sellerResponse.data.seller);
                
                // Process products data
                const productsData = dashResponse.data.productStocks || [];
                const ratingsData = dashResponse.data.productRatings || [];
                console.log('Products data:', productsData);
                console.log('Ratings data:', ratingsData);
                
                setProducts(productsData);
                setProductRatings(ratingsData);
                
                // Sort by stock descending
                const byStock = [...productsData].sort((a, b) => (b.stock || 0) - (a.stock || 0));
                setSortedProducts(byStock);
                console.log('Sorted by stock:', byStock);
                
                // Filter low stock (< 2)
                const lowStock = productsData.filter(p => (p.stock || 0) < 2);
                setLowStockProducts(lowStock);
                console.log('Low stock products:', lowStock);
            } else {
                setError('Akun seller Anda belum diaktivasi');
            }
            
        } catch (err) {
            console.error('Error fetching user data:', err);
            console.error('Error response:', err.response);
            
            if (err.response?.status === 401) {
                console.log('Unauthorized, clearing token and redirecting to login');
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                navigate('/login');
                return;
            }
            
            setError(err.response?.data?.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        }
    };

    // Download PDF dari Backend
    const downloadPDF = async (reportType) => {
        setGenerating(true);
        try {
            console.log(`Downloading ${reportType} report...`);
            const response = await axios.get(`/api/seller/reports/${reportType}`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Set filename based on report type
            const fileName = {
                'stock': `Laporan_Stok_${new Date().getTime()}.pdf`,
                'rating': `Laporan_Rating_${new Date().getTime()}.pdf`,
                'reorder': `Laporan_Reorder_${new Date().getTime()}.pdf`
            };
            
            link.setAttribute('download', fileName[reportType]);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            console.log(`${reportType} report downloaded successfully`);
            
        } catch (err) {
            console.error('Error downloading PDF:', err);
            console.error('Error response:', err.response);
            alert('Gagal mengunduh laporan PDF: ' + (err.response?.data?.message || err.message));
        } finally {
            setGenerating(false);
        }
    };

    // Generate PDF - Laporan Stock (Descending)
    const generateStockReport = () => {
        downloadPDF('stock');
    };

    // Generate PDF - Laporan Rating (Descending)
    const generateRatingReport = () => {
        downloadPDF('rating');
    };

    // Generate PDF - Laporan Stok Habis (Reorder)
    const generateReorderReport = () => {
        downloadPDF('reorder');
    };

    if (loading) {
        return (
            <div className={styles.dashboardWrapper}>
                <aside className={styles.sidebar}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoIcon}>
                            <img src="/logo.png" alt="Logo" />
                        </div>
                        <span className={styles.logoText}>AstroEcomm</span>
                    </div>
                    <nav className={styles.nav}>
                        <div className={styles.navItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                            </svg>
                            Dashboard
                        </div>
                        <div className={styles.navItemActive}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                            Managemen Toko
                        </div>
                    </nav>
                </aside>
                <main className={styles.mainContent}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Memuat data...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorBox}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="#dc2626">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <h3>Terjadi Kesalahan</h3>
                    <p>{error}</p>
                    <div className={styles.errorActions}>
                        <button onClick={() => {
                            setError('');
                            fetchUserData();
                        }} className={styles.btnRetry}>
                            Coba Lagi
                        </button>
                        <button onClick={() => navigate('/seller/dashboard')} className={styles.btnBack}>
                            Kembali ke Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <button className={styles.navItem} onClick={() => navigate('/seller/dashboard')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                        Dashboard
                    </button>
                    <button className={styles.navItemActive}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        Managemen Toko
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>Managemen Toko</h1>
                        <p className={styles.pageSubtitle}>Kelola laporan dan data toko Anda</p>
                    </div>
                    
                    <div className={styles.headerRight}>
                        <button 
                            className={styles.btnUpload}
                            onClick={() => navigate('/seller/upload-produk')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            Upload Produk
                        </button>
                        
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
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className={styles.userName}>{seller?.store_name || 'Seller'}</span>
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

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#7A57B3">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-8 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h14v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryLabel}>Total Produk</div>
                            <div className={styles.summaryValue}>{products.length}</div>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#10b981">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryLabel}>Total Stok</div>
                            <div className={styles.summaryValue}>
                                {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.summaryCard} ${lowStockProducts.length > 0 ? styles.summaryCardWarning : ''}`}>
                        <div className={styles.summaryIcon}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={lowStockProducts.length > 0 ? "#dc2626" : "#6b7280"}>
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryLabel}>Stok Rendah</div>
                            <div className={styles.summaryValue}>{lowStockProducts.length}</div>
                        </div>
                    </div>
                </div>

                {/* Report Sections */}
                <div className={styles.reportsContainer}>
                    {/* Report 1: By Stock */}
                    <div className={styles.reportCard}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#7A57B3">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                                </svg>
                                <div>
                                    <h3>Laporan Stok Produk</h3>
                                    <p>Daftar produk diurutkan berdasarkan stok (menurun)</p>
                                </div>
                            </div>
                            <button 
                                className={styles.btnDownload}
                                onClick={generateStockReport}
                                disabled={generating || products.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generating ? 'Mengunduh...' : 'Download PDF'}
                            </button>
                        </div>
                        <div className={styles.reportPreview}>
                            {products.length > 0 ? (
                                <div className={styles.previewTable}>
                                    {sortedProducts.map((product, index) => (
                                        <div key={index} className={styles.previewRow}>
                                            <div className={styles.previewImage}>
                                                <img 
                                                    src={product.image || '/placeholder-product.jpg'} 
                                                    alt={product.name}
                                                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                                />
                                            </div>
                                            <span className={styles.previewName}>{product.name}</span>
                                            <span className={styles.previewStock}>Stok: {product.stock || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>Belum ada produk</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Report 2: By Rating */}
                    <div className={styles.reportCard}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FDB813">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <div>
                                    <h3>Laporan Rating Produk</h3>
                                    <p>Daftar produk diurutkan berdasarkan rating (menurun)</p>
                                </div>
                            </div>
                            <button 
                                className={styles.btnDownload}
                                onClick={generateRatingReport}
                                disabled={generating || products.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generating ? 'Mengunduh...' : 'Download PDF'}
                            </button>
                        </div>
                        <div className={styles.reportPreview}>
                            {productRatings.length > 0 ? (
                                <div className={styles.previewTable}>
                                    {productRatings.map((product, index) => (
                                        <div key={index} className={styles.previewRow}>
                                            <div className={styles.previewImage}>
                                                <img 
                                                    src={product.image || '/placeholder-product.jpg'} 
                                                    alt={product.name}
                                                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                                />
                                            </div>
                                            <span className={styles.previewName}>{product.name}</span>
                                            <span className={styles.previewRating}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FDB813">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                                </svg>
                                                {product.rating}
                                            </span>
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

                    {/* Report 3: Reorder */}
                    <div className={`${styles.reportCard} ${lowStockProducts.length > 0 ? styles.reportCardWarning : ''}`}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc2626">
                                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                                </svg>
                                <div>
                                    <h3>Laporan Produk Segera Dipesan</h3>
                                    <p>Produk dengan stok &lt; 2 yang perlu segera dipesan</p>
                                </div>
                            </div>
                            <button 
                                className={`${styles.btnDownload} ${styles.btnDownloadWarning}`}
                                onClick={generateReorderReport}
                                disabled={generating || lowStockProducts.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generating ? 'Mengunduh...' : 'Download PDF'}
                            </button>
                        </div>
                        <div className={styles.reportPreview}>
                            {lowStockProducts.length > 0 ? (
                                <div className={styles.previewTable}>
                                    {lowStockProducts.map((product, index) => (
                                        <div key={index} className={`${styles.previewRow} ${styles.previewRowWarning}`}>
                                            <div className={styles.previewImage}>
                                                <img 
                                                    src={product.image || '/placeholder-product.jpg'} 
                                                    alt={product.name}
                                                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                                />
                                            </div>
                                            <span className={styles.previewName}>{product.name}</span>
                                            <span className={styles.previewStockLow}>Stok: {product.stock || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#10b981">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                    </svg>
                                    <p>Semua produk memiliki stok yang cukup!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SellerManagement;