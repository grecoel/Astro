import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import Footer from './Footer';
import SplashScreen from './SplashScreen';
import { BannerSkeleton, CategorySkeleton, ProductGridSkeleton } from './SkeletonLoader';
import { useToast } from '../Common/ToastContext';
import styles from './Home.module.css';

const Home = () => {
    const { showError, showInfo } = useToast();
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [hasError, setHasError] = useState(false);
    // Check if user has visited before
    const [showSplash, setShowSplash] = useState(() => {
        const hasVisited = localStorage.getItem('astro_visited');
        return !hasVisited; // Show splash only if not visited before
    });
    const [initialLoading, setInitialLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [bannerTranslate, setBannerTranslate] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categoryFade, setCategoryFade] = useState({ left: false, right: true });
    const [bannerHovered, setBannerHovered] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category_id') || '';

    const fetchData = async (search = '', categoryId = '', page = 1, isInitial = false) => {
        try {
            if (isInitial) {
                setInitialLoading(true);
            } else if (page === 1) {
                setProductsLoading(true);
            } else {
                setLoadingMore(true);
            }
            
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryId) params.append('category_id', categoryId);
            params.append('page', page);
            
            const res = await axios.get(`/api/catalog?${params.toString()}`);
            
            if (page === 1) {
                // Hanya set banners dan categories pada initial load
                if (isInitial) {
                    setBanners(res.data.banners || []);
                    setCategories(res.data.categories || []);
                }
                setProducts(res.data.products?.data || []);
                setCurrentPage(1);
            } else {
                setProducts(prev => [...prev, ...(res.data.products?.data || [])]);
                setCurrentPage(page);
            }
            
            setHasMore(res.data.products?.current_page < res.data.products?.last_page);
            setHasError(false);
        } catch (err) {
            console.error('Error fetching catalog:', err);
            setHasError(true);
            
            let errorMsg = 'Terjadi kesalahan saat memuat katalog.';
            let shouldRetry = true;
            
            // Comprehensive error handling
            if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                errorMsg = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else if (err.code === 'ECONNABORTED') {
                errorMsg = 'Koneksi timeout. Silakan coba lagi.';
            } else if (err.response?.status === 500) {
                errorMsg = 'Terjadi kesalahan pada server. Silakan coba lagi.';
            } else if (err.response?.status === 404) {
                errorMsg = 'Data tidak ditemukan.';
                shouldRetry = false;
            } else if (err.response?.status === 403) {
                errorMsg = 'Akses ditolak. Silakan login kembali.';
                shouldRetry = false;
            } else if (err.response?.status === 429) {
                errorMsg = 'Terlalu banyak permintaan. Tunggu sebentar dan coba lagi.';
            } else if (!navigator.onLine) {
                errorMsg = 'Anda sedang offline. Periksa koneksi internet.';
            }
            
            if (isInitial || page === 1) {
                showError(errorMsg, shouldRetry ? 5000 : 7000);
            }
            
            if (page === 1) {
                if (isInitial) {
                    setBanners([]);
                    setCategories([]);
                }
                setProducts([]);
            }
        } finally {
            if (isInitial) {
                setInitialLoading(false);
            } else if (page === 1) {
                setProductsLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        // Initial load dengan banners dan categories
        fetchData(searchQuery, categoryQuery, 1, true);
        setSelectedCategoryId(categoryQuery);
        setCurrentPage(1);
        setHasMore(true);
        setBannerTranslate(0);
    }, []);

    useEffect(() => {
        // Filter kategori atau search (tanpa reload banners/categories)
        if (!initialLoading) {
            fetchData(searchQuery, categoryQuery, 1, false);
            setSelectedCategoryId(categoryQuery);
            setCurrentPage(1);
            setHasMore(true);
        }
    }, [searchQuery, categoryQuery]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target.documentElement;
        if (scrollHeight - (scrollTop + clientHeight) < 300 && hasMore && !loadingMore && !productsLoading && !initialLoading) {
            fetchData(searchQuery, categoryQuery, currentPage + 1, false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, hasMore, loadingMore, productsLoading, initialLoading, searchQuery, categoryQuery]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setBannerTranslate((prev) => {
                const nextTranslate = prev - 100;
                // Reset to 0 instantly when reaching the last position (without transition)
                if (nextTranslate === -banners.length * 100) {
                    // Remove transition temporarily and reset to 0
                    setTimeout(() => {
                        const track = document.querySelector(`.${styles.bannerTrack}`);
                        if (track) {
                            track.style.transition = 'none';
                            setBannerTranslate(0);
                            // Re-enable transition after reset
                            setTimeout(() => {
                                track.style.transition = 'transform 0.7s ease-in-out';
                            }, 50);
                        }
                    }, 700);
                    return nextTranslate;
                }
                return nextTranslate;
            });
        }, 5500);
        return () => clearInterval(timer);
    }, [banners.length]);

    const handleCategoryClick = (id) => {
        // Toggle: jika kategori yang sama diklik, hapus filter
        if (selectedCategoryId === id) {
            setSelectedCategoryId('');
            setSearchParams({});
            showInfo('Filter kategori dihapus');
        } else {
            // Jika kategori berbeda, set kategori baru
            setSelectedCategoryId(id);
            if (id === '') {
                setSearchParams({});
                showInfo('Menampilkan semua produk');
            } else {
                const categoryName = categories.find(cat => cat.id === id)?.name || 'kategori';
                setSearchParams({ category_id: id });
                showInfo(`Filter: ${categoryName}`);
            }
        }
    };

    // Handle scroll untuk fade effect
    const handleCategoryScroll = (e) => {
        const container = e.target;
        const isScrolling = container.scrollWidth > container.clientWidth;
        
        if (!isScrolling) {
            setCategoryFade({ left: false, right: false });
            return;
        }

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        // Fade kiri muncul ketika scroll > 0
        const showLeftFade = scrollLeft > 0;
        // Fade kanan muncul ketika belum mencapai end
        const showRightFade = scrollLeft < maxScroll - 10;

        setCategoryFade({ left: showLeftFade, right: showRightFade });
    };

    // Handle banner navigation
    const handleBannerPrev = () => {
        setBannerTranslate((prev) => {
            const currentIndex = Math.floor(-prev / 100) % banners.length;
            const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
            return -newIndex * 100;
        });
    };

    const handleBannerNext = () => {
        setBannerTranslate((prev) => {
            const currentIndex = Math.floor(-prev / 100) % banners.length;
            const newIndex = (currentIndex + 1) % banners.length;
            return -newIndex * 100;
        });
    };

    // Handle splash screen completion
    const handleSplashComplete = () => {
        setShowSplash(false);
        // Mark as visited so splash won't show again
        localStorage.setItem('astro_visited', 'true');
    };

    // Show splash screen on first load
    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} />;
    }

    return (
        <div className={styles.uiDesktopKatalog}>
            <Navbar />

            {/* BANNER */}
            {initialLoading ? (
                <BannerSkeleton />
            ) : (
                banners.length > 0 && (
                    <div 
                        className={styles.bannerContainer}
                        onMouseEnter={() => setBannerHovered(true)}
                        onMouseLeave={() => setBannerHovered(false)}
                    >
                    <div 
                        className={styles.bannerTrack}
                        style={{ 
                            transform: `translateX(${bannerTranslate}%)`,
                            transition: 'transform 0.7s ease-in-out'
                        }}
                    >
                        {/* Render all banners + first banner at end for loop */}
                        {[...banners, banners[0]].map((banner, idx) => (
                            <img 
                                key={idx}
                                src={banner?.image_full_url} 
                                alt={banner?.title}
                                className={styles.bannerMaskedItem}
                            />
                        ))}
                    </div>
                    
                    {/* Navigation Buttons - Show on hover */}
                    {banners.length > 1 && bannerHovered && (
                        <>
                            <button 
                                className={`${styles.bannerNavButton} ${styles.bannerNavLeft}`}
                                onClick={handleBannerPrev}
                                aria-label="Previous banner"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button 
                                className={`${styles.bannerNavButton} ${styles.bannerNavRight}`}
                                onClick={handleBannerNext}
                                aria-label="Next banner"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </>
                    )}
                    
                    {banners.length > 1 && (
                        <div className={styles.carouselDots}>
                            {banners.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.ellipseDot} ${Math.floor(-bannerTranslate / 100) % banners.length === idx ? styles.activeDot : ''}`}
                                    onClick={() => setBannerTranslate(-idx * 100)}
                                />
                            ))}
                        </div>
                    )}
                    </div>
                )
            )}

            {/* KATEGORI */}
            {initialLoading ? (
                <CategorySkeleton />
            ) : (
                <div className={styles.rectangle24}>
                <div className={styles.textWrapper55}>Kategori</div>
                
                <div 
                    className={`${styles.categoryContainer} ${categoryFade.left ? styles.fadeLeft : ''} ${categoryFade.right ? styles.fadeRight : ''}`}
                    onScroll={handleCategoryScroll}
                >
                    {/* All Categories Button */}
                    <div 
                        className={`${styles.categoryItem} ${selectedCategoryId === '' && categoryQuery === '' ? '' : ''}`}
                        onClick={() => handleCategoryClick('')}
                    >
                        <div className={styles.categoryCard}>
                            <div className={styles.categoryIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="7" height="7" rx="1" fill="#000"/>
                                    <rect x="14" y="3" width="7" height="7" rx="1" fill="#000"/>
                                    <rect x="3" y="14" width="7" height="7" rx="1" fill="#000"/>
                                    <rect x="14" y="14" width="7" height="7" rx="1" fill="#000"/>
                                </svg>
                            </div>
                            <div className={styles.categoryName}>All</div>
                        </div>
                    </div>

                    {/* Dynamic Categories */}
                    {categories.map((cat) => (
                        <div 
                            key={cat.id} 
                            className={`${styles.categoryItem} ${selectedCategoryId === cat.id ? styles.categorySelected : ''}`}
                            onClick={() => handleCategoryClick(cat.id)}
                        >
                            <div className={styles.categoryCard}>
                                {cat.icon_full_url ? (
                                    <img 
                                        src={cat.icon_full_url} 
                                        alt={cat.name}
                                        className={styles.categoryIcon}
                                    />
                                ) : (
                                    <div className={styles.categoryIcon} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px'
                                    }}>📦</div>
                                )}
                                <div className={styles.categoryName}>{cat.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            )}

            {/* PRODUCTS GRID */}
            {initialLoading ? (
                <ProductGridSkeleton count={24} />
            ) : (
                <>
                    {productsLoading ? (
                        <ProductGridSkeleton count={24} />
                    ) : products.length > 0 ? (
                        <>
                            <div className={styles.productGrid}>
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {loadingMore && (
                                <ProductGridSkeleton count={12} />
                            )}
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <svg className={styles.emptyIcon} width="80" height="80" viewBox="0 0 24 24" fill="none">
                                <path d="M9.5 2C8.67 2 8 2.67 8 3.5V4H6.5C5.67 4 5 4.67 5 5.5V21C5 21.83 5.67 22.5 6.5 22.5H17.5C18.33 22.5 19 21.83 19 21V5.5C19 4.67 18.33 4 17.5 4H16V3.5C16 2.67 15.33 2 14.5 2H9.5Z" stroke="#D3F26A" strokeWidth="1.5" fill="#F4FADF"/>
                                <path d="M9 10H15M9 14H13" stroke="#667a30" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <h3 className={styles.emptyTitle}>Tidak ada produk ditemukan</h3>
                            <p className={styles.emptyDescription}>
                                {searchQuery ? `Pencarian "${searchQuery}" tidak ditemukan.` : 'Produk belum tersedia untuk kategori ini.'}
                            </p>
                            {(searchQuery || categoryQuery) && (
                                <button 
                                    className={styles.emptyButton}
                                    onClick={() => {
                                        setSearchParams({});
                                        setSelectedCategoryId('');
                                        showInfo('Filter telah direset');
                                    }}
                                    aria-label="Reset filter pencarian"
                                >
                                    Lihat Semua Produk
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* HELP BUTTON */}
            <button 
                className={styles.helpButton}
                onClick={() => setShowHelpModal(true)}
                aria-label="Bantuan halaman katalog"
                title="Klik untuk melihat bantuan"
            >
                <div className={styles.helpCircle}>?</div>
                <span className={styles.helpTooltip}>Butuh bantuan?</span>
            </button>

            {/* Help Modal */}
            {showHelpModal && (
                <div className={styles.helpModalOverlay} onClick={() => setShowHelpModal(false)} role="presentation">
                    <div className={styles.helpModal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="help-modal-title" aria-modal="true">
                        <div className={styles.helpModalHeader}>
                            <h2 id="help-modal-title">Bantuan Halaman Katalog</h2>
                            <button 
                                className={styles.helpModalClose}
                                onClick={() => setShowHelpModal(false)}
                                aria-label="Tutup bantuan"
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.helpModalContent}>
                            <div className={styles.helpItem}>
                                <div className={styles.helpIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#D3F26A" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Cari Produk</h3>
                                    <p>Gunakan kolom pencarian di navbar untuk mencari produk yang Anda inginkan dengan cepat.</p>
                                </div>
                            </div>

                            <div className={styles.helpItem}>
                                <div className={styles.helpIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="7" height="7" rx="2" fill="#D3F26A"/>
                                        <rect x="14" y="3" width="7" height="7" rx="2" fill="#D3F26A"/>
                                        <rect x="3" y="14" width="7" height="7" rx="2" fill="#D3F26A"/>
                                        <rect x="14" y="14" width="7" height="7" rx="2" fill="#D3F26A"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Filter Kategori</h3>
                                    <p>Klik kategori di bagian atas untuk melihat produk berdasarkan kategori tertentu.</p>
                                </div>
                            </div>

                            <div className={styles.helpItem}>
                                <div className={styles.helpIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect x="2" y="3" width="20" height="18" rx="2" stroke="#D3F26A" strokeWidth="2"/>
                                        <path d="M2 8h20" stroke="#D3F26A" strokeWidth="2"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Lihat Detail Produk</h3>
                                    <p>Klik pada kartu produk untuk melihat informasi lengkap, rating, dan ulasan pembeli.</p>
                                </div>
                            </div>

                            <div className={styles.helpItem}>
                                <div className={styles.helpIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D3F26A"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Rating & Ulasan</h3>
                                    <p>Lihat rating bintang dan jumlah ulasan untuk mengetahui kualitas produk dari pembeli lain.</p>
                                </div>
                            </div>

                            <div className={styles.helpItem}>
                                <div className={styles.helpIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="#D3F26A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3>Scroll untuk Muat Lebih</h3>
                                    <p>Scroll ke bawah halaman untuk memuat produk lebih banyak secara otomatis.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.helpModalFooter}>
                            <button 
                                className={styles.helpModalButton}
                                onClick={() => setShowHelpModal(false)}
                            >
                                Mengerti, Terima Kasih
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home;