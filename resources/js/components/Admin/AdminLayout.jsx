import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import axios from 'axios';
// Pastikan Anda punya file CSS ini (bisa pakai style Admin.module.css sebelumnya)
import styles from './AdminLayout.module.css'; 

function AdminLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Cek Token saat halaman dimuat
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            // Jika tidak ada token, tendang ke login
            navigate('/login');
            return;
        }

        // 2. Set Axios Header (PENTING: Agar request kategori nanti tidak 401 Unauthorized)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    if (!user) return null; // Jangan render apa-apa sebelum cek user selesai

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#f8f9fa' }}>
            {/* SIDEBAR */}
            <aside style={{ 
                width: '250px', 
                minWidth: '250px',
                background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
                color: 'white', 
                padding: '0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo/Brand */}
                <div style={{
                    padding: '2rem 1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ 
                        margin: '0',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        letterSpacing: '1px'
                    }}>ADMIN PANEL</h3>
                </div>
                <div className={styles.navLinks}>
                    <Link to="/admin" className={styles.navLink}>Dashboard</Link>
                    <Link to="/admin/verifikasi" className={styles.navLink}>Verifikasi Seller</Link>
                    <Link to="/admin/seller" className={styles.navLink}>Data Seller</Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ 
                flex: 1, 
                width: 'calc(100% - 250px)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'white', 
                    padding: '1.5rem 2rem', 
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <h2 style={{ 
                        margin: '0',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1a202c',
                        letterSpacing: '-0.5px'
                    }}>Dashboard</h2>
                    <span style={{ 
                        color: '#4a5568',
                        fontSize: '0.95rem',
                        background: '#f7fafc',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontWeight: '500'
                    }}>
                        {user.name}
                    </span>
                </header>

                {/* Content Area */}
                <div style={{ flex: 1, overflow: 'auto', background: '#f8f9fa' }}>
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;