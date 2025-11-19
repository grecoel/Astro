import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminLayout.module.css';

function AdminLayout({ children, title }) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        if (!window.confirm('Yakin ingin logout?')) return;

        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await axios.post('/api/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear everything
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/login');
        }
    };

    return (
        <div className={styles.adminLayout}>
            <nav className={styles.navbar}>
                <div className={styles.navBrand}>
                    <h2>🚀 Astro Admin</h2>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/admin/verifikasi" className={styles.navLink}>
                        Verifikasi Seller
                    </Link>
                </div>
                <div className={styles.navUser}>
                    {user && (
                        <>
                            <span className={styles.userName}>
                                👤 {user.name}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className={styles.logoutBtn}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
            <main className={styles.mainContent}>
                {title && <h1 className={styles.pageTitle}>{title}</h1>}
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;
