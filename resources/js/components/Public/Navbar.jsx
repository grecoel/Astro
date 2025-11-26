import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    // Debounced search function
    const searchProducts = useCallback(async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const res = await axios.get(`/api/catalog?search=${encodeURIComponent(query)}&page=1`);
            const products = res.data.products?.data || [];
            setSearchResults(products.slice(0, 6)); // Limit to 6 results
            setShowDropdown(true);
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value;
        setKeyword(value);

        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce search
        debounceRef.current = setTimeout(() => {
            searchProducts(value);
        }, 300);
    };

    // Handle form submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            setShowDropdown(false);
            navigate(`/search?search=${encodeURIComponent(keyword)}`);
        }
    };

    // Handle product click from dropdown
    const handleProductClick = (productId) => {
        setShowDropdown(false);
        setKeyword('');
        navigate(`/product/${productId}`);
    };

    // Handle "Lihat Semua" click
    const handleViewAll = () => {
        setShowDropdown(false);
        navigate(`/search?search=${encodeURIComponent(keyword)}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format price
    const formatPrice = (price) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    };

    return (
        <nav className={styles.navbarContainer}>
            <div className={styles.navContent}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <img src="/logo.png" alt="Astro" style={{width: '50px', height: '50px'}} />
                    <Link to="/" className={styles.textWrapper61}>AstroEcomm.</Link>
                </div>
                
                {/* Search Bar with Preview */}
                <div className={styles.searchWrapper} ref={searchRef}>
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <div className={`${styles.rectangle31} ${isFocused ? styles.searchFocused : ''}`}>
                            <input
                                type="text"
                                placeholder="Cari Produk"
                                value={keyword}
                                onChange={handleInputChange}
                                onFocus={() => {
                                    setIsFocused(true);
                                    if (keyword.length >= 2 && searchResults.length > 0) {
                                        setShowDropdown(true);
                                    }
                                }}
                                onBlur={() => setIsFocused(false)}
                                className={styles.textWrapper60}
                            />
                            {isSearching ? (
                                <div className={styles.searchSpinner}></div>
                            ) : (
                                <button type="submit" className={styles.searchIcon}>
                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                                        <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M13 13L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Search Preview Dropdown */}
                    {showDropdown && (
                        <div className={styles.searchDropdown}>
                            {searchResults.length > 0 ? (
                                <>
                                    <div className={styles.dropdownHeader}>
                                        <span className={styles.dropdownTitle}>Hasil Pencarian</span>
                                        <span className={styles.dropdownHint}>"{keyword}"</span>
                                    </div>
                                    <div className={styles.dropdownResults}>
                                        {searchResults.map((product) => {
                                            const imageUrl = product.images?.[0]?.image_url || product.thumbnail_url || 'https://placehold.co/60';
                                            const rating = product.rating_avg ? parseFloat(product.rating_avg).toFixed(1) : '0.0';
                                            
                                            return (
                                                <div 
                                                    key={product.id}
                                                    className={styles.dropdownItem}
                                                    onClick={() => handleProductClick(product.id)}
                                                >
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={product.name}
                                                        className={styles.dropdownItemImage}
                                                    />
                                                    <div className={styles.dropdownItemInfo}>
                                                        <div className={styles.dropdownItemName}>{product.name}</div>
                                                        <div className={styles.dropdownItemPrice}>{formatPrice(product.price)}</div>
                                                        <div className={styles.dropdownItemMeta}>
                                                            <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                                                                <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFC107"/>
                                                            </svg>
                                                            <span>{rating}</span>
                                                            <span className={styles.dropdownItemStore}>{product.seller?.store_name || 'Store'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={styles.dropdownFooter} onClick={handleViewAll}>
                                        <span>Lihat Semua Hasil</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.dropdownEmpty}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#a0a0a1" strokeWidth="2"/>
                                        <path d="M21 21L16.65 16.65" stroke="#a0a0a1" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    <span>Produk tidak ditemukan untuk "{keyword}"</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Actions */}
                <div className={styles.rightSection}>
                    {/* Dashboard Seller */}
                    <div className={styles.group17}>
                        <div className={styles.ellipse}></div>
                        <Link to="/login" className={styles.dashboardPenjual}>
                            Dashboard Penjual
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;