import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminLayout.module.css'; 

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    if (!user) return null;

    const navLinkStyle = (path) => ({
        color: isActive(path) ? '#4A5A22' : '#555',
        textDecoration: 'none',
        padding: '0.875rem 1.25rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderLeft: isActive(path) ? '3px solid #7DBA30' : '3px solid transparent',
        fontSize: '0.9rem',
        fontWeight: isActive(path) ? '600' : '500',
        background: isActive(path) ? 'rgba(125, 186, 48, 0.1)' : 'transparent'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#f5f7f6' }}>
            {/* SIDEBAR - WHITE WITH GREEN ACCENT */}
            <aside style={{
                width: '260px',
                minWidth: '260px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04)',
                position: 'fixed',
                left: '0',
                top: '0',
                height: '100vh',
                overflowY: 'auto',
                zIndex: '999',
                borderRight: '1px solid #e8ebe9'
            }}>
                {/* Logo/Brand */}
                <div style={{
                    padding: '1.5rem 1.25rem',
                    borderBottom: '1px solid #e8ebe9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <img 
                        src="/logo.png" 
                        alt="Astro" 
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                        }} 
                    />
                    <div>
                        <h1 style={{
                            margin: '0',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#2d3436',
                            letterSpacing: '-0.3px'
                        }}>Astro Admin</h1>
                        <span style={{
                            fontSize: '0.75rem',
                            color: '#7DBA30',
                            fontWeight: '500'
                        }}>Dashboard</span>
                    </div>
                </div>

                {/* User Info */}
                <div style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid #e8ebe9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#f0f4f1',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#7DBA30'
                    }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#2d3436'
                        }}>{user.name}</div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#888'
                        }}>Administrator</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '0.75rem 0'
                }}>
                    <div style={{
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: '#aaa',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>Menu</div>

                    <Link to="/admin/dashboard" style={navLinkStyle('/admin/dashboard')}
                        onMouseEnter={(e) => {
                            if (!isActive('/admin/dashboard')) {
                                e.currentTarget.style.background = 'rgba(125, 186, 48, 0.05)';
                                e.currentTarget.style.borderLeftColor = '#A8D94A';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive('/admin/dashboard')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                            }
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                        Dashboard
                    </Link>

                    <Link to="/admin/kategori" style={navLinkStyle('/admin/kategori')}
                        onMouseEnter={(e) => {
                            if (!isActive('/admin/kategori')) {
                                e.currentTarget.style.background = 'rgba(125, 186, 48, 0.05)';
                                e.currentTarget.style.borderLeftColor = '#A8D94A';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive('/admin/kategori')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                            }
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6"/>
                        </svg>
                        Kategori
                    </Link>

                    <Link to="/admin/banners" style={navLinkStyle('/admin/banners')}
                        onMouseEnter={(e) => {
                            if (!isActive('/admin/banners')) {
                                e.currentTarget.style.background = 'rgba(125, 186, 48, 0.05)';
                                e.currentTarget.style.borderLeftColor = '#A8D94A';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive('/admin/banners')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                            }
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        Banner
                    </Link>

                    <Link to="/admin/seller-management" style={navLinkStyle('/admin/seller-management')}
                        onMouseEnter={(e) => {
                            if (!isActive('/admin/seller-management')) {
                                e.currentTarget.style.background = 'rgba(125, 186, 48, 0.05)';
                                e.currentTarget.style.borderLeftColor = '#A8D94A';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive('/admin/seller-management')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                            }
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        Manajemen Penjual
                    </Link>
                </nav>

                {/* Logout Button */}
                <div style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid #e8ebe9'
                }}>
                    <button onClick={handleLogout} style={{
                        width: '100%',
                        background: '#fff',
                        color: '#e74c3c',
                        border: '1px solid #fde2e2',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#fef2f2';
                        e.target.style.borderColor = '#e74c3c';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = '#fff';
                        e.target.style.borderColor = '#fde2e2';
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16,17 21,12 16,7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                overflow: 'auto',
                background: '#f5f7f6',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;