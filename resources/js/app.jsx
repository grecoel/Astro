import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import '../css/app.css'; 

import RegistrasiForm from './components/RegistrasiForm/RegistrasiForm';
import VerifikasiList from './components/Admin/VerifikasiList'; 
import VerifikasiDetail from './components/Admin/VerifikasiDetail';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="page-container">
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registrasi" element={<RegistrasiForm />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin/verifikasi" element={
                        <ProtectedRoute>
                            <VerifikasiList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/verifikasi/:sellerId" element={
                        <ProtectedRoute>
                            <VerifikasiDetail />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={
                        <div style={{textAlign: 'center', marginTop: '50px'}}>
                            <h3>Selamat Datang di Project Marketplace</h3>
                            <p>Silakan pilih menu di atas untuk mulai.</p>
                        </div>
                    } />
                </Routes>

            </div>
        </BrowserRouter>
    </React.StrictMode>
);