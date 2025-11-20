import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AktivasiAkun() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        token: '',
        password: '',
        password_confirmation: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Ambil token dan email dari URL (dari email yang diklik)
        setFormData(prev => ({
            ...prev,
            email: searchParams.get('email') || '',
            token: searchParams.get('token') || ''
        }));
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await axios.post('/api/aktivasi-akun', formData);
            setMessage('Akun berhasil diaktifkan! Mengalihkan ke login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '400px' }}>
            <h2>Aktivasi Akun Penjual</h2>
            <p>Halo, <strong>{formData.email}</strong>. Silakan buat password untuk akun Anda.</p>
            
            {message && <div style={{color: 'green'}}>{message}</div>}
            {error && <div style={{color: 'red'}}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Password Baru</label>
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div>
                    <label>Konfirmasi Password</label>
                    <input 
                        type="password" 
                        value={formData.password_confirmation}
                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    Aktifkan Akun
                </button>
            </form>
        </div>
    );
}

export default AktivasiAkun;