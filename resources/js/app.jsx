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
import AktivasiAkun from './components/Auth/AktivasiAkun';
import SellerDashboard from './components/Seller/SellerDashboard';
import AdminLayout from './components/Admin/AdminLayout';
import CategoryManager from './components/Admin/CategoryManager';
import AdminDashboard from './components/Admin/AdminDashboard';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="page-container">
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/registrasi" element={<RegistrasiForm />} />
                    <Route path="/aktivasi-akun" element={<AktivasiAkun />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="kategori" element={<CategoryManager />} />
                        <Route path="verifikasi" element={<VerifikasiList />} />
                        <Route path="verifikasi/:sellerId" element={<VerifikasiDetail />} />
                    </Route>

                    {/* Protected Seller Routes */}
                    <Route path="/seller/dashboard" element={
                        <ProtectedRoute>
                            <SellerDashboard />
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