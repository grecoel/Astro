import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import Footer from './Footer';
import { BannerSkeleton, CategorySkeleton, ProductGridSkeleton } from './SkeletonLoader';
import styles from './Home.module.css';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [bannerTranslate, setBannerTranslate] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categoryFade, setCategoryFade] = useState({ left: false, right: true });
    
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
        } catch (err) {
            console.error('Error fetching catalog:', err);
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

    return (
        <div className={styles.uiDesktopKatalog}>
            <Navbar />

            {/* BANNER */}
            {initialLoading ? (
                <BannerSkeleton />
            ) : (
                banners.length > 0 && (
                    <div className={styles.bannerContainer}>
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
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#666'
                        }}>
                            Tidak ada produk ditemukan.
                        </div>
                    )}
                </>
            )}

            {/* HELP BUTTONS */}
            <div className={styles.group9First}>
                <div className={styles.rectangle26}></div>
                <div className={styles.textWrapper57}>?</div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;