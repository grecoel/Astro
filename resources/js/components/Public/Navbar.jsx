import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            if (onSearch) {
                onSearch(keyword);
            } else {
                navigate(`/?search=${keyword}`);
            }
        }
    };

    return (
        <nav className={styles.navbarContainer}>
            <div className={styles.navContent}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <div className={styles.ellipse2}></div>
                    <Link to="/" className={styles.textWrapper61}>Astro</Link>
                </div>
                
                {/* Search Bar */}
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <div className={styles.rectangle31}>
                        <input
                            type="text"
                            placeholder="Cari Produk"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className={styles.textWrapper60}
                        />
                        <button type="submit" className={styles.searchIcon}>
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                                <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M13 13L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Right Actions */}
                <div className={styles.rightSection}>
                    {/* Dashboard Seller */}
                    <div className={styles.group17}>
                        <div className={styles.ellipse}></div>
                        <Link to="/login" className={styles.dashboardPenjual}>
                            Dashboard<br/>Penjual
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;