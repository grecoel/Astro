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
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f9' }}>
            {/* SIDEBAR */}
            <aside style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px', margin: '0 0 20px 0' }}>Admin Panel</h3>
                
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#34495e'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Dashboard</Link>
                    <Link to="/admin/kategori" style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#34495e'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Kelola Kategori</Link>
                    <Link to="/admin/verifikasi" style={{ color: 'white', textDecoration: 'none', padding: '10px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#34495e'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>Verifikasi Seller</Link>
                </nav>

                <button onClick={handleLogout} style={{ marginTop: '50px', background: '#e74c3c', color: 'white', border: 'none', padding: '10px', width: '100%', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#c0392b'} onMouseLeave={(e) => e.target.style.background = '#e74c3c'}>
                    Logout
                </button>
            </aside>

            {/* KONTEN UTAMA */}
            <main style={{ flex: 1, padding: '20px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'white', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ margin: 0 }}>Dashboard Admin</h2>
                    <span style={{ color: '#666' }}>Halo, {user.name}</span>
                </header>

                {/* Outlet untuk child routes */}
                <Outlet /> 
            </main>
        </div>
    );
}

export default AdminLayout;