import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../Common/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { locations } from '../../Data/locations';
import styles from './Search.module.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('search') || '';
    const navigate = useNavigate();
    const { showError, showSuccess, showInfo } = useToast();
    
    const [products, setProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Filter states
    const [selectedCat, setSelectedCat] = useState(''); // Single category ID
    const [selectedLocs, setSelectedLocs] = useState([]);
    const [tempLocs, setTempLocs] = useState([]); // Temporary location selections before apply (only for modal)
    const [locationSearch, setLocationSearch] = useState('');
    const [expandedProvince, setExpandedProvince] = useState(''); // Province yang di-expand untuk show cities
    
    // Modal states
    const [showModalCat, setShowModalCat] = useState(false);
    const [showModalLoc, setShowModalLoc] = useState(false);

    // Fetch products from API (only when selectedLocs changes, not tempLocs)
    useEffect(() => {
        fetchProducts(1);
    }, [keyword, selectedCat, selectedLocs]);

    const fetchProducts = (page = 1) => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        
        const params = new URLSearchParams();
        if (keyword) params.append('search', keyword);
        if (selectedCat) params.append('categories[]', selectedCat);
        selectedLocs.forEach(l => params.append('locations[]', l));
        params.append('page', page);

        axios.get(`/api/catalog?${params.toString()}`)
            .then(res => {
                if (page === 1) {
                    setProducts(res.data.products.data || []);
                    setCurrentPage(1);
                } else {
                    setProducts(prev => [...prev, ...(res.data.products.data || [])]);
                    setCurrentPage(page);
                }
                setCategoriesList(res.data.categories || []);
                setHasMore(res.data.products?.current_page < res.data.products?.last_page);
                setLoading(false);
                setLoadingMore(false);
            })
            .catch(err => {
                console.error(err);
                let errorMsg = 'Gagal memuat produk.';
                if (err.code === 'ERR_NETWORK') {
                    errorMsg = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
                } else if (err.response?.status === 500) {
                    errorMsg = 'Server error. Silakan coba lagi nanti.';
                } else if (err.response?.status === 404) {
                    errorMsg = 'Endpoint tidak ditemukan.';
                }
                showError(errorMsg);
                if (page === 1) {
                    setProducts([]);
                }
                setLoading(false);
                setLoadingMore(false);
            });
    };

    // Handle category click (single selection)
    const handleCategoryClick = (id) => {
        setSelectedCat(id === selectedCat ? '' : id); // Toggle off if same category
    };

    // Handle location check di list (langsung apply)
    const handleCheckLocDirect = (locName) => {
        setSelectedLocs(prev => 
            prev.includes(locName) ? prev.filter(l => l !== locName) : [...prev, locName]
        );
    };

    // Handle location check di modal (pakai tempLocs, perlu apply)
    const handleCheckLoc = (locName) => {
        setTempLocs(prev => 
            prev.includes(locName) ? prev.filter(l => l !== locName) : [...prev, locName]
        );
    };

    const handleProvinceClick = (province) => {
        // Toggle expand/collapse province
        if (expandedProvince === province) {
            setExpandedProvince('');
        } else {
            setExpandedProvince(province);
        }
    };

    const resetCategoryFilter = () => {
        setSelectedCat('');
        showInfo('Filter kategori direset');
    };

    // Nielsen's Heuristic: Reset entire search
    const handleResetSearch = () => {
        setSelectedCat('');
        setSelectedLocs([]);
        navigate('/search');
        showInfo('Menampilkan semua produk');
    };

    // Nielsen's Heuristic: Clear all filters
    const handleClearAllFilters = () => {
        setSelectedCat('');
        setSelectedLocs([]);
        showSuccess('Semua filter dibersihkan');
    };

    const applyLocationFilter = () => {
        setSelectedLocs(tempLocs);
        setShowModalLoc(false);
    };

    const resetLocationFilter = () => {
        setTempLocs([]);
    };

    const clearAllLocationFilter = () => {
        setSelectedLocs([]);
        setTempLocs([]);
        setExpandedProvince('');
    };

    // Sync tempLocs with selectedLocs when modal opens
    useEffect(() => {
        if (showModalLoc) {
            setTempLocs(selectedLocs);
        }
    }, [showModalLoc]);

    // Scroll handler for infinite scroll pagination
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target.documentElement;
        if (scrollHeight - (scrollTop + clientHeight) < 300 && hasMore && !loadingMore && !loading) {
            fetchProducts(currentPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, hasMore, loadingMore, loading, keyword, selectedCat, selectedLocs]);

    // Filter locations based on search
    const filteredLocations = Object.keys(locations).filter(prov => 
        prov.toLowerCase().includes(locationSearch.toLowerCase()) ||
        locations[prov].some(city => city.toLowerCase().includes(locationSearch.toLowerCase()))
    );

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                    <span className={styles.breadcrumbSeparator}>&gt;</span>
                    <span className={styles.breadcrumbCurrent}>Pencarian</span>
                </div>

                <div className={styles.layout}>
                
                    {/* --- LEFT: RESULTS --- */}
                    <main className={styles.mainContent}>
                        <div className={styles.resultHeader}>
                            <p className={styles.resultCount}>
                                {loading ? (
                                    'Memuat produk...'
                                ) : (
                                    <>
                                        Menampilkan <strong>{products.length}</strong> {keyword ? <>hasil untuk <strong className={styles.keyword}>"{keyword}"</strong></> : 'produk'}
                                        {(selectedCat || selectedLocs.length > 0) && ' dengan filter'}
                                    </>
                                )}
                            </p>
                            <div className={styles.resultActions}>
                                {(selectedCat || selectedLocs.length > 0) && (
                                    <button 
                                        className={styles.clearFiltersBtn}
                                        onClick={handleClearAllFilters}
                                        title="Hapus semua filter"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Hapus Filter
                                    </button>
                                )}
                                <button 
                                    className={styles.resetSearchBtn}
                                    onClick={handleResetSearch}
                                    title="Reset pencarian dan kembali ke home"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M21 3v5h-5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Reset Pencarian
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.productGrid}>
                                {[...Array(8)].map((_, index) => (
                                    <div key={index} className={styles.skeletonCard}>
                                        <div className={styles.skeletonImage}></div>
                                        <div className={styles.skeletonContent}>
                                            <div className={styles.skeletonTitle}></div>
                                            <div className={styles.skeletonPrice}></div>
                                            <div className={styles.skeletonMeta}>
                                                <div className={styles.skeletonLocation}></div>
                                                <div className={styles.skeletonRating}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className={styles.productGrid}>
                                    {products.map(p => <ProductCard key={p.id} product={p} />)}
                                    {loadingMore && (
                                        <>
                                            {[...Array(4)].map((_, index) => (
                                                <div key={`skeleton-${index}`} className={styles.skeletonCard}>
                                                    <div className={styles.skeletonImage}></div>
                                                    <div className={styles.skeletonContent}>
                                                        <div className={styles.skeletonTitle}></div>
                                                        <div className={styles.skeletonPrice}></div>
                                                        <div className={styles.skeletonMeta}>
                                                            <div className={styles.skeletonLocation}></div>
                                                            <div className={styles.skeletonRating}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                {!hasMore && products.length > 0 && (
                                    <div className={styles.endMessage}>
                                        <p>Semua produk telah ditampilkan</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className={styles.emptyIcon}>
                                    <path d="M3 3l18 18M21 21l-3.6-3.6m0 0L3 3l14.4 14.4zM10.5 10.5a3 3 0 104.24 4.24" stroke="#D3F26A" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M21 21l-4.35-4.35M10.5 10.5L3 3l7.5 7.5z" stroke="#667a30" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <p className={styles.emptyTitle}>Produk tidak ditemukan</p>
                                <p className={styles.emptyText}>
                                    {keyword ? `Tidak ada produk yang cocok dengan "${keyword}"` : (selectedCat || selectedLocs.length > 0) ? 'Tidak ada produk dengan filter ini' : 'Belum ada produk tersedia'}
                                </p>
                                <div className={styles.emptyActions}>
                                    {(selectedCat || selectedLocs.length > 0) && (
                                        <button className={styles.emptyButton} onClick={handleClearAllFilters}>
                                            Hapus Filter
                                        </button>
                                    )}
                                    <button className={styles.emptyButtonSecondary} onClick={handleResetSearch}>
                                        Reset Pencarian
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* --- RIGHT: SIDEBAR FILTER --- */}
                    <aside className={styles.sidebarWrapper}>
                        <div className={styles.filterHeader}>Filter</div>
                        
                        <div className={styles.sidebar}>
                            {/* FILTER KATEGORI */}
                            <div className={styles.filterGroup}>
                                <span className={styles.filterTitle}>Kategori</span>
                                <div className={styles.filterList}>
                                    {categoriesList.slice(0, 5).map(cat => (
                                        <div 
                                            key={cat.id} 
                                            className={`${styles.categoryItem} ${selectedCat === cat.id ? styles.categoryItemActive : ''}`}
                                            onClick={() => handleCategoryClick(cat.id)}
                                        >
                                            {cat.name}
                                        </div>
                                    ))}
                                </div>
                                {categoriesList.length > 5 && (
                                    <button className={styles.seeMore} onClick={() => setShowModalCat(true)}>
                                        Lihat semua
                                    </button>
                                )}
                            </div>

                        {/* FILTER LOKASI */}
                        <div className={styles.filterGroup}>
                            <span className={styles.filterTitle}>Lokasi</span>
                            <div className={styles.filterList}>
                                {Object.keys(locations).slice(0, 5).map(prov => (
                                    <label key={prov} className={styles.checkboxItem}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedLocs.includes(prov)}
                                            onChange={() => handleCheckLocDirect(prov)}
                                        />
                                        <span>{prov}</span>
                                    </label>
                                ))}
                            </div>
                            <button className={styles.seeMore} onClick={() => setShowModalLoc(true)}>
                                Lihat Semua
                            </button>
                        </div>
                        </div>
                    </aside>
                </div>

                {/* --- DROPDOWN KATEGORI (Floating Island) --- */}
                {showModalCat && (
                    <>
                        <div className={styles.dropdownOverlay} onClick={() => setShowModalCat(false)} />
                        <div className={styles.categoryDropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3>Semua Kategori</h3>
                                <button className={styles.closeBtn} onClick={() => setShowModalCat(false)}>×</button>
                            </div>
                            <div className={styles.dropdownBody}>
                                <div className={styles.categoryGrid}>
                                    {categoriesList.map(cat => (
                                        <div 
                                            key={cat.id} 
                                            className={`${styles.categoryItemModal} ${selectedCat === cat.id ? styles.categoryItemActive : ''}`}
                                            onClick={() => {
                                                handleCategoryClick(cat.id);
                                                setShowModalCat(false);
                                            }}
                                        >
                                            {cat.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* --- DROPDOWN LOKASI (Floating Island) --- */}
                {showModalLoc && (
                    <>
                        <div className={styles.dropdownOverlay} onClick={() => setShowModalLoc(false)} />
                        <div className={styles.locationDropdown}>
                            <div className={styles.dropdownHeaderWithSearch}>
                                <div className={styles.headerLeft}>
                                    <h3>Pilih Lokasi</h3>
                                    {/* Search Lokasi di Header */}
                                    <div className={styles.searchContainer}>
                                        <input 
                                            type="text" 
                                            placeholder="Cari Provinsi atau Kota" 
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                        <svg className={styles.searchIconInModal} width="16" height="16" viewBox="0 0 19 19" fill="none">
                                            <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M13 13L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    <button className={styles.closeBtn} onClick={() => setShowModalLoc(false)}>×</button>
                                </div>
                                </div>
                            
                            <div className={styles.dropdownBody}>
                                <div className={styles.locationList}>
                                    {filteredLocations.map(prov => (
                                        <div key={prov} className={styles.locationGroup}>
                                            {/* Provinsi - Clickable untuk expand/collapse */}
                                            <div className={styles.provinceItem}>
                                                <label className={styles.checkboxItemBold}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={tempLocs.includes(prov)}
                                                        onChange={() => handleCheckLoc(prov)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span>{prov}</span>
                                                </label>
                                                <button 
                                                    className={styles.expandBtn}
                                                    onClick={() => handleProvinceClick(prov)}
                                                >
                                                    {expandedProvince === prov ? '−' : '+'}
                                                </button>
                                            </div>
                                            
                                            {/* Kota/Kabupaten - Hanya tampil jika province di-expand */}
                                            {expandedProvince === prov && (
                                                <div className={styles.cityGrid}>
                                                    {locations[prov].map(city => (
                                                        <label key={city} className={styles.checkboxItem}>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={tempLocs.includes(city)}
                                                                onChange={() => handleCheckLoc(city)}
                                                            />
                                                            <span>{city}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Footer dengan tombol Reset dan Terapkan */}
                            <div className={styles.dropdownFooter}>
                                <button className={styles.btnReset} onClick={resetLocationFilter}>Reset</button>
                                <button className={styles.btnApply} onClick={applyLocationFilter}>Terapkan</button>
                            </div>
                        </div>
                    </>
                )}

                {/* Help Button */}
                <div className={styles.helpButton}>
                    <div className={styles.helpCircle}>?</div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default SearchResults;