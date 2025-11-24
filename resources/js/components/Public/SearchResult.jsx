import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { locations } from '../../Data/locations';
import styles from './Search.module.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('search') || '';
    
    const [products, setProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [selectedCat, setSelectedCat] = useState(''); // Single category ID
    const [selectedLocs, setSelectedLocs] = useState([]);
    const [tempLocs, setTempLocs] = useState([]); // Temporary location selections before apply
    const [locationSearch, setLocationSearch] = useState('');
    const [expandedProvince, setExpandedProvince] = useState(''); // Province yang di-expand untuk show cities
    
    // Modal states
    const [showModalCat, setShowModalCat] = useState(false);
    const [showModalLoc, setShowModalLoc] = useState(false);

    // Fetch products from API (only when selectedLocs changes, not tempLocs)
    useEffect(() => {
        fetchProducts();
    }, [keyword, selectedCat, selectedLocs]);

    const fetchProducts = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.append('search', keyword);
        if (selectedCat) params.append('categories[]', selectedCat);
        selectedLocs.forEach(l => params.append('locations[]', l));

        axios.get(`/api/catalog?${params.toString()}`)
            .then(res => {
                setProducts(res.data.products.data || []);
                setCategoriesList(res.data.categories || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // Handle category click (single selection)
    const handleCategoryClick = (id) => {
        setSelectedCat(id === selectedCat ? '' : id); // Toggle off if same category
    };

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
                        <p className={styles.resultCount}>
                            Menampilkan {products.length} hasil pencarian dari "{keyword}"
                        </p>

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
                            <div className={styles.productGrid}>
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>Produk tidak ditemukan.</p>
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
                                            onChange={() => handleCheckLoc(prov)}
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