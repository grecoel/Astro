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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', background: '#f8f9fa' }}>
            {/* HEADER - FULL WIDTH - FIXED */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--color-dark)',
                padding: '1.25rem 2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderBottom: '2px solid var(--color-primary)',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                zIndex: '1000',
                height: '70px'
            }}>
                <h1 style={{
                    margin: '0',
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    letterSpacing: '0.5px'
                }}>Astro Admin</h1>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <span style={{
                        fontSize: '1rem',
                        color: 'var(--color-light)',
                        fontWeight: '600'
                    }}>
                        {user.name}
                    </span>
                    <button onClick={handleLogout} style={{
                        background: 'var(--color-error)',
                        color: 'white',
                        border: '2px solid var(--color-error)',
                        padding: '0.65rem 1.25rem',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = 'var(--color-error)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'var(--color-error)';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* CONTAINER - SIDEBAR + CONTENT */}
            <div style={{ display: 'flex', flex: 1, width: '100%', marginTop: '70px' }}>
                {/* SIDEBAR - FIXED */}
                <aside style={{
                    width: '250px',
                    minWidth: '250px',
                    background: 'var(--color-dark)',
                    color: 'white',
                    padding: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                    position: 'fixed',
                    left: '0',
                    top: '70px',
                    height: 'calc(100vh - 70px)',
                    overflowY: 'auto',
                    zIndex: '999'
                }}>
                    {/* Navigation */}
                    <nav style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                        flex: 1,
                        padding: '1rem 0'
                    }}>
                        <Link to="/admin/dashboard" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '0',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderLeft: '4px solid transparent',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 242, 106, 0.15)';
                            e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderLeftColor = 'transparent';
                        }}>
                            Dashboard
                        </Link>

                        <Link to="/admin/kategori" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '0',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderLeft: '4px solid transparent',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 242, 106, 0.15)';
                            e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderLeftColor = 'transparent';
                        }}>
                            Kategori
                        </Link>

                        <Link to="/admin/banners" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '0',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderLeft: '4px solid transparent',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 242, 106, 0.15)';
                            e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderLeftColor = 'transparent';
                        }}>
                            Banner
                        </Link>

                        <Link to="/admin/verifikasi" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '1rem 1.5rem',
                            borderRadius: '0',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderLeft: '4px solid transparent',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 242, 106, 0.15)';
                            e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderLeftColor = 'transparent';
                        }}>
                            Verifikasi Penjual
                        </Link>
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main style={{
                    flex: 1,
                    marginLeft: '250px',
                    overflow: 'auto',
                    background: '#f8f9fa'
                }}>
                    {/* Content Area */}
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;