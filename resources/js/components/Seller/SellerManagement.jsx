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
    const [generatingStock, setGeneratingStock] = useState(false);
    const [generatingRating, setGeneratingRating] = useState(false);
    const [generatingReorder, setGeneratingReorder] = useState(false);
    
    // PDF Preview Modal states
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfFileName, setPdfFileName] = useState('');
    
    // Active View State
    const [activeView, setActiveView] = useState('reports'); // 'reports' or 'products'
    const [activeProductType, setActiveProductType] = useState(''); // 'all', 'lowStock', 'totalStock'
    const [displayProducts, setDisplayProducts] = useState([]);
    
    // Product Detail Modal states
    const [showProductDetail, setShowProductDetail] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
                
                // Merge ratings into products
                const mergedProducts = productsData.map(product => {
                    const ratingInfo = ratingsData.find(r => r.id === product.id);
                    return {
                        ...product,
                        reviews_avg_rating: ratingInfo?.rating || null,
                        reviews_count: ratingInfo?.review_count || null
                    };
                });
                
                setProducts(mergedProducts);
                setProductRatings(ratingsData);
                
                // Sort by stock descending
                const byStock = [...mergedProducts].sort((a, b) => (b.stock || 0) - (a.stock || 0));
                setSortedProducts(byStock);
                console.log('Sorted by stock:', byStock);
                
                // Filter low stock (< 2)
                const lowStock = mergedProducts.filter(p => (p.stock || 0) < 2);
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

    // Download PDF dari Backend dengan Preview Modal
    const downloadPDF = async (reportType, setLoadingState) => {
        setLoadingState(true);
        try {
            console.log(`Loading ${reportType} report...`);
            const response = await axios.get(`/api/seller/reports/${reportType}`, {
                responseType: 'blob'
            });

            // Create blob URL for preview
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Set filename
            const fileNames = {
                'stock': `Laporan_Stok_${new Date().getTime()}.pdf`,
                'rating': `Laporan_Rating_${new Date().getTime()}.pdf`,
                'reorder': `Laporan_Reorder_${new Date().getTime()}.pdf`
            };
            
            // Show modal with PDF preview
            setPdfUrl(url);
            setPdfFileName(fileNames[reportType]);
            setShowPdfModal(true);
            
            console.log(`${reportType} report loaded successfully`);
            
        } catch (err) {
            console.error('Error loading PDF:', err);
            console.error('Error response:', err.response);
            alert('Gagal memuat laporan PDF: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingState(false);
        }
    };
    
    // Close PDF Modal
    const closePdfModal = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
        }
        setShowPdfModal(false);
        setPdfUrl(null);
        setPdfFileName('');
    };
    
    // Download PDF from modal
    const downloadPdfFromModal = () => {
        if (!pdfUrl || !pdfFileName) return;
        
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', pdfFileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    };

    // Generate PDF - Laporan Stock (Descending)
    const generateStockReport = () => {
        downloadPDF('stock', setGeneratingStock);
    };

    // Generate PDF - Laporan Rating (Descending)
    const generateRatingReport = () => {
        downloadPDF('rating', setGeneratingRating);
    };

    // Generate PDF - Laporan Stok Habis (Reorder)
    const generateReorderReport = () => {
        downloadPDF('reorder', setGeneratingReorder);
    };
    
    // Show Product Details (toggle view)
    const showProductDetails = (type) => {
        // If clicking the same card, toggle back to reports
        if (activeView === 'products' && activeProductType === type) {
            setActiveView('reports');
            setActiveProductType('');
            setDisplayProducts([]);
            return;
        }
        
        let productsToShow = [];
        
        switch(type) {
            case 'all':
                // Sort alphabetically by name
                productsToShow = [...products].sort((a, b) => 
                    a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
                );
                break;
            case 'lowStock':
                productsToShow = lowStockProducts;
                break;
            case 'totalStock':
                // Sort by stock highest to lowest
                productsToShow = sortedProducts;
                break;
            default:
                productsToShow = [];
        }
        
        setActiveProductType(type);
        setDisplayProducts(productsToShow);
        setActiveView('products');
    };
    
    // Open product detail modal
    const openProductDetail = (product) => {
        setSelectedProduct(product);
        // Set default selected image
        const firstImg = product.images?.find(i => i.is_primary)?.image_url 
                        || product.images?.[0]?.image_url
                        || product.image 
                        || '/placeholder-product.jpg';
        setSelectedImage(firstImg);
        setShowProductDetail(true);
    };
    
    // Close product detail modal
    const closeProductDetail = () => {
        setShowProductDetail(false);
        setSelectedProduct(null);
        setSelectedImage('');
        setIsDescriptionExpanded(false);
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
                    <div 
                        className={`${styles.summaryCard} ${activeView === 'products' && activeProductType === 'all' ? styles.summaryCardActive : ''}`}
                        onClick={() => showProductDetails('all')} 
                        style={{cursor: 'pointer'}}
                    >
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

                    <div 
                        className={`${styles.summaryCard} ${activeView === 'products' && activeProductType === 'totalStock' ? styles.summaryCardActive : ''}`}
                        onClick={() => showProductDetails('totalStock')} 
                        style={{cursor: 'pointer'}}
                    >
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

                    <div 
                        className={`${styles.summaryCard} ${lowStockProducts.length > 0 ? styles.summaryCardWarning : ''} ${activeView === 'products' && activeProductType === 'lowStock' ? styles.summaryCardActive : ''}`}
                        onClick={() => showProductDetails('lowStock')}
                        style={{cursor: 'pointer'}}
                    >
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

                {/* Report Sections or Product List */}
                <div className={styles.reportsContainer}>
                    {activeView === 'reports' ? (
                        <>
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
                                disabled={generatingStock || products.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generatingStock ? 'Mengunduh...' : 'Download PDF'}
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
                                disabled={generatingRating || products.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generatingRating ? 'Mengunduh...' : 'Download PDF'}
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
                                disabled={generatingReorder || lowStockProducts.length === 0}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                                {generatingReorder ? 'Mengunduh...' : 'Download PDF'}
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
                    </>
                    ) : (
                        /* Product List View */
                        <div className={styles.productListSection}>
                            <div className={styles.productListHeader}>
                                <h2>
                                    {activeProductType === 'all' && 'Semua Produk'}
                                    {activeProductType === 'totalStock' && 'Produk dengan Stok Tertinggi'}
                                    {activeProductType === 'lowStock' && 'Produk Stok Rendah'}
                                </h2>
                                <p className={styles.productCount}>
                                    Menampilkan {displayProducts.length} produk
                                    {activeProductType === 'all' && ' (Diurutkan A-Z)'}
                                    {activeProductType === 'totalStock' && ' (Diurutkan dari stok tertinggi)'}
                                    {activeProductType === 'lowStock' && ' (Stok < 2)'}
                                </p>
                            </div>
                            {displayProducts.length > 0 ? (
                                <div className={styles.productGrid}>
                                    {displayProducts.map((product, index) => (
                                        <div key={product.id || index} className={styles.productCard} onClick={() => openProductDetail(product)}>
                                            <div className={styles.productCardImage}>
                                                <img 
                                                    src={product.main_image || product.image || '/placeholder-product.jpg'} 
                                                    alt={product.name}
                                                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                                />
                                                {product.stock < 2 && (
                                                    <span className={styles.lowStockTag}>Stok Rendah!</span>
                                                )}
                                            </div>
                                            <div className={styles.productCardContent}>
                                                <h4>{product.name}</h4>
                                                <p className={styles.productCardCategory}>{product.category?.name || 'Tanpa Kategori'}</p>
                                                <div className={styles.productCardFooter}>
                                                    <div className={styles.productCardPrice}>
                                                        Rp{new Intl.NumberFormat('id-ID').format(parseFloat(product.price) || 0)}
                                                    </div>
                                                    <div className={styles.productCardBadges}>
                                                        <span className={`${styles.productCardStock} ${product.stock < 2 ? styles.stockLow : ''}`}>
                                                            Stok: {product.stock || 0}
                                                        </span>
                                                        {product.reviews_avg_rating != null && product.reviews_avg_rating > 0 && (
                                                            <span className={styles.productCardRating}>
                                                                ★ {parseFloat(product.reviews_avg_rating).toFixed(1)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState} style={{padding: '4rem'}}>
                                    <p>Tidak ada produk</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            {/* PDF Preview Modal */}
            {showPdfModal && (
                <div className={styles.modalOverlay} onClick={closePdfModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Preview Laporan PDF</h3>
                            <div className={styles.modalActions}>
                                <button 
                                    className={styles.btnModalDownload}
                                    onClick={downloadPdfFromModal}
                                    title="Download PDF"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                    </svg>
                                    Download
                                </button>
                                <button 
                                    className={styles.btnModalClose}
                                    onClick={closePdfModal}
                                    title="Tutup"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe
                                src={pdfUrl}
                                className={styles.pdfViewer}
                                title="PDF Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Product Detail Modal */}
            {showProductDetail && selectedProduct && (
                <div className={styles.modalOverlay} onClick={closeProductDetail}>
                    <div className={styles.productDetailModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.productDetailHeader}>
                            <h3>Detail Produk</h3>
                            <button 
                                className={styles.btnModalClose}
                                onClick={closeProductDetail}
                                title="Tutup"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className={styles.productDetailBody}>
                            {/* Gallery Section */}
                            <div className={styles.gallery}>
                                <img 
                                    src={selectedImage} 
                                    alt={selectedProduct.name} 
                                    className={styles.mainImage}
                                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                />
                                {selectedProduct.images && selectedProduct.images.length > 0 && (
                                    <div className={styles.thumbnailContainer}>
                                        {selectedProduct.images.map((img, idx) => (
                                            <img
                                                key={img.id || idx}
                                                src={img.image_url}
                                                alt={`${selectedProduct.name} ${idx + 1}`}
                                                className={`${styles.thumbnail} ${selectedImage === img.image_url ? styles.activeThumbnail : ''}`}
                                                onClick={() => setSelectedImage(img.image_url)}
                                                onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                            />
                                        ))}
                                    </div>
                                )}
                                {selectedProduct.images && selectedProduct.images.length > 1 && (
                                    <p className={styles.imageCount}>
                                        {selectedProduct.images.length} gambar tersedia
                                    </p>
                                )}
                            </div>
                            
                            {/* Product Info Section */}
                            <div className={styles.productInfo}>
                                <h2 className={styles.productTitle}>{selectedProduct.name}</h2>
                                
                                {/* Price */}
                                <div className={styles.priceSection}>
                                    <span className={styles.priceLabel}>Harga</span>
                                    <span className={styles.priceValue}>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(selectedProduct.price) || 0)}
                                    </span>
                                </div>
                                
                                {/* Description */}
                                {selectedProduct.description && (
                                    <div className={styles.descriptionSection}>
                                        <h4 className={styles.sectionTitle}>Deskripsi Produk</h4>
                                        <p className={`${styles.descriptionText} ${!isDescriptionExpanded ? styles.descriptionCollapsed : ''}`}>
                                            {selectedProduct.description}
                                        </p>
                                        {selectedProduct.description.length > 200 && (
                                            <button 
                                                className={styles.toggleDescriptionBtn}
                                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            >
                                                {isDescriptionExpanded ? '← Sembunyikan' : 'Lihat Selengkapnya →'}
                                            </button>
                                        )}
                                    </div>
                                )}
                                
                                {/* Meta Info */}
                                <div className={styles.metaInfo}>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Nama Produk</span>
                                        <span className={styles.metaValue}>{selectedProduct.name}</span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Kategori</span>
                                        <span className={styles.metaValue}>
                                            {selectedProduct.category?.name || 'Tanpa Kategori'}
                                        </span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Kondisi</span>
                                        <span className={styles.metaValue}>{selectedProduct.condition || '-'}</span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Stok</span>
                                        <span className={`${styles.metaValue} ${selectedProduct.stock < 2 ? styles.stockLowText : styles.stockOkText}`}>
                                            {selectedProduct.stock || 0} Unit
                                        </span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Berat</span>
                                        <span className={styles.metaValue}>{selectedProduct.weight ? `${selectedProduct.weight} gram` : '-'}</span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Lokasi</span>
                                        <span className={styles.metaValue}>{selectedProduct.location || '-'}</span>
                                    </div>
                                    {selectedProduct.discount_price && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Harga Diskon</span>
                                            <span className={styles.metaValue}>
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(selectedProduct.discount_price))}
                                            </span>
                                        </div>
                                    )}
                                    {selectedProduct.sku && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>SKU</span>
                                            <span className={styles.metaValue}>{selectedProduct.sku}</span>
                                        </div>
                                    )}
                                    {selectedProduct.brand && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Merek</span>
                                            <span className={styles.metaValue}>{selectedProduct.brand}</span>
                                        </div>
                                    )}
                                    {selectedProduct.warranty_period && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Garansi</span>
                                            <span className={styles.metaValue}>{selectedProduct.warranty_period}</span>
                                        </div>
                                    )}
                                    {selectedProduct.material && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Material</span>
                                            <span className={styles.metaValue}>{selectedProduct.material}</span>
                                        </div>
                                    )}
                                    {selectedProduct.color && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Warna</span>
                                            <span className={styles.metaValue}>{selectedProduct.color}</span>
                                        </div>
                                    )}
                                    {selectedProduct.size && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Ukuran</span>
                                            <span className={styles.metaValue}>{selectedProduct.size}</span>
                                        </div>
                                    )}
                                    {selectedProduct.dimensions && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Dimensi</span>
                                            <span className={styles.metaValue}>{selectedProduct.dimensions}</span>
                                        </div>
                                    )}
                                    {selectedProduct.video_url && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Video</span>
                                            <a href={selectedProduct.video_url} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
                                                Lihat Video
                                            </a>
                                        </div>
                                    )}
                                    {selectedProduct.min_order && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Min. Pembelian</span>
                                            <span className={styles.metaValue}>{selectedProduct.min_order} Unit</span>
                                        </div>
                                    )}
                                    {selectedProduct.tags && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Tags</span>
                                            <span className={styles.metaValue}>{selectedProduct.tags}</span>
                                        </div>
                                    )}
                                    <div className={styles.metaRow}>
                                        <span className={styles.metaLabel}>Status Publikasi</span>
                                        <span className={`${styles.statusBadge} ${styles['status' + selectedProduct.status]}`}>
                                            {selectedProduct.status || 'DRAFT'}
                                        </span>
                                    </div>
                                    {selectedProduct.is_featured !== undefined && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Produk Unggulan</span>
                                            <span className={styles.metaValue}>
                                                {selectedProduct.is_featured ? '✓ Ya' : '✗ Tidak'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedProduct.view_count !== undefined && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Total Dilihat</span>
                                            <span className={styles.metaValue}>{selectedProduct.view_count} kali</span>
                                        </div>
                                    )}
                                    {selectedProduct.seller && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Nama Toko</span>
                                            <span className={styles.metaValue}>{selectedProduct.seller.store_name}</span>
                                        </div>
                                    )}
                                    {selectedProduct.created_at && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>Ditambahkan</span>
                                            <span className={styles.metaValue}>
                                                {new Date(selectedProduct.created_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                    {selectedProduct.updated_at && selectedProduct.updated_at !== selectedProduct.created_at && (
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaLabel}>🔄 Terakhir Diubah</span>
                                            <span className={styles.metaValue}>
                                                {new Date(selectedProduct.updated_at).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Rating & Reviews Summary */}
                                {selectedProduct.reviews_avg_rating != null && selectedProduct.reviews_avg_rating > 0 && (
                                    <div className={styles.ratingSection}>
                                        <div className={styles.ratingBadge}>
                                            <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
                                                <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FDB813"/>
                                            </svg>
                                            <span className={styles.ratingValue}>
                                                {parseFloat(selectedProduct.reviews_avg_rating).toFixed(1)}
                                            </span>
                                        </div>
                                        <span className={styles.reviewCount}>
                                            ({selectedProduct.reviews_count || 0} penilaian)
                                        </span>
                                    </div>
                                )}
                                
                                {/* Reviews Section */}
                                {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
                                    <div className={styles.reviewsSection}>
                                        <h4 className={styles.sectionTitle}>
                                            Penilaian & Ulasan ({selectedProduct.reviews.length})
                                        </h4>
                                        <div className={styles.reviewsList}>
                                            {selectedProduct.reviews.map((review, idx) => (
                                                <div key={review.id || idx} className={styles.reviewCard}>
                                                    <div className={styles.reviewHeader}>
                                                        <div className={styles.reviewerInfo}>
                                                            <div className={styles.reviewerAvatar}>
                                                                {review.reviewer_name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <div className={styles.reviewerName}>{review.reviewer_name}</div>
                                                                <div className={styles.reviewerLocation}>{review.reviewer_province}</div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.reviewRating}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg key={i} width="14" height="14" viewBox="0 0 15 15" fill="none">
                                                                    <path 
                                                                        d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" 
                                                                        fill={i < review.rating ? "#FDB813" : "#e5e7eb"}
                                                                    />
                                                                </svg>
                                                            ))}
                                                            <span className={styles.reviewRatingText}>{review.rating}.0</span>
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className={styles.reviewComment}>{review.comment}</p>
                                                    )}
                                                    <div className={styles.reviewDate}>
                                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerManagement;