
import React, { useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../RegistrasiForm/RegistrasiForm.module.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const success = await login(email, password);

        if (success) {
            navigate('/admin/verifikasi'); 
        } else {
            setError('Login gagal. Email atau password salah, atau Anda bukan Admin.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Login Admin</h2>
            <p>Gunakan akun Admin (cth: admin@market.com / password123)</p>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px' }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;