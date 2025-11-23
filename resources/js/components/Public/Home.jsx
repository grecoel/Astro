import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import styles from './Home.module.css';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [previousBannerIndex, setPreviousBannerIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categoryFade, setCategoryFade] = useState({ left: false, right: true });
    
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category_id') || '';

    const fetchData = async (search = '', categoryId = '', page = 1) => {
        try {
            page === 1 ? setLoading(true) : setLoadingMore(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryId) params.append('category_id', categoryId);
            params.append('page', page);
            
            const res = await axios.get(`/api/catalog?${params.toString()}`);
            
            if (page === 1) {
                setBanners(res.data.banners || []);
                setCategories(res.data.categories || []);
                setProducts(res.data.products?.data || []);
                setCurrentBannerIndex(0);
                setCurrentPage(1);
            } else {
                setProducts(prev => [...prev, ...(res.data.products?.data || [])]);
                setCurrentPage(page);
            }
            
            setHasMore(res.data.products?.current_page < res.data.products?.last_page);
        } catch (err) {
            console.error('Error fetching catalog:', err);
            if (page === 1) {
                setBanners([]);
                setCategories([]);
                setProducts([]);
            }
        } finally {
            page === 1 ? setLoading(false) : setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchData(searchQuery, categoryQuery, 1);
        setSelectedCategoryId(categoryQuery);
        setCurrentPage(1);
        setHasMore(true);
    }, [searchQuery, categoryQuery]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target.documentElement;
        if (scrollHeight - (scrollTop + clientHeight) < 300 && hasMore && !loadingMore && !loading) {
            fetchData(searchQuery, categoryQuery, currentPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, hasMore, loadingMore, loading, searchQuery, categoryQuery]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setPreviousBannerIndex((prev) => currentBannerIndex);
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 700);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length, currentBannerIndex]);

    const handleSearch = (keyword) => {
        if (keyword.trim()) {
            setSearchParams({ search: keyword });
        }
    };

    const handleCategoryClick = (id) => {
        // Toggle: jika kategori yang sama diklik, hapus filter
        if (selectedCategoryId === id) {
            setSelectedCategoryId('');
            setSearchParams({});
        } else {
            // Jika kategori berbeda, set kategori baru
            setSelectedCategoryId(id);
            if (id === '') {
                setSearchParams({});
            } else {
                setSearchParams({ category_id: id });
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

    const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : null;

    return (
        <div className={styles.uiDesktopKatalog}>
            <Navbar onSearch={handleSearch} />

            {/* BANNER */}
            {banners.length > 0 && (
                <div className={styles.bannerContainer}>
                    <img 
                        src={currentBanner?.image_full_url} 
                        alt={currentBanner?.title}
                        className={`${styles.bannerMasked} ${!isTransitioning ? '' : ''}`}
                    />
                    {banners.length > 1 && (
                        <div className={styles.carouselDots}>
                            {banners.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.ellipseDot} ${idx === currentBannerIndex ? styles.activeDot : ''}`}
                                    onClick={() => setCurrentBannerIndex(idx)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* KATEGORI */}
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

            {/* PRODUCTS GRID */}
            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#999'
                }}>
                    Memuat produk...
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className={styles.productGrid}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {loadingMore && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#999'
                        }}>
                            <div style={{ marginBottom: '1rem' }}>Memuat lebih banyak produk...</div>
                            <div style={{
                                display: 'inline-block',
                                width: '30px',
                                height: '30px',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #AD7BFF',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        </div>
                    )}
                </>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#666'
                }}>
                    Tidak ada produk ditemukan.
                </div>
            )}

            {/* HELP BUTTONS */}
            <div className={styles.group9First}>
                <div className={styles.rectangle26}></div>
                <div className={styles.textWrapper57}>?</div>
            </div>

            {/* FOOTER */}
            <footer className={styles.footerSection}>
                <div className={styles.footerGrid}>
                    <div>
                        <h3 style={{fontWeight: 'bold', marginBottom: '1rem'}}>AstroEcomm.</h3>
                        <p>Tentang Astro</p>
                        <p>IF Undip</p>
                        <p>Kebijakan</p>
                        <p>Kontak Media</p>
                        <p>Astro Seller Club</p>
                    </div>
                    <div>
                        <h3 style={{fontWeight: 'bold', marginBottom: '1rem'}}>Customer Service</h3>
                        <p>Bantuan</p>
                        <p>Metode Pembayaran</p>
                        <p>Daftar (Sudah Dari Sebelah)</p>
                        <p>Pengembalian Produk & Dana</p>
                        <p>Pengajuan Komplain</p>
                        <p>Hubungi Kami</p>
                    </div>
                    <div>
                        <h3 style={{fontWeight: 'bold', marginBottom: '1rem'}}>Follow Us</h3>
                        <p>astro.com</p>
                        <p>astroecomm.twt</p>
                        <p>astroecomm.tiktok</p>
                        <p>astroecomm.threads</p>
                        <p>astroecomm.fb</p>
                    </div>
                    <div>
                        <h3 style={{fontWeight: 'bold', marginBottom: '1rem'}}>Contact Us</h3>
                        <p>Email: astro.ecomm01@gmail.com</p>
                        <p>Call Center: 0298-1236-6969</p>
                        <p>Whatsapp: 0893-8569-1269</p>
                        <div style={{marginTop: '1rem'}}>
                            <h3 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>Support Us</h3>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff'
                            }}>QR</div>
                        </div>
                    </div>
                </div>
                <div style={{
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                    marginTop: '2rem',
                    paddingTop: '1rem',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    © AstroEcomm. 2025. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;