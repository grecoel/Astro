import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. IMPOR CSS GLOBAL
import '../css/app.css'; 

// 2. IMPOR KOMPONEN
// Auth
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Seller
import RegistrasiForm from './components/RegistrasiForm/RegistrasiForm';
import UploadProdukForm from './components/UploadProdukForm/UploadProdukForm';
import SellerProducts from './components/Seller/SellerProducts';

// Admin
import DashboardAdmin from './components/Admin/DashboardAdmin';
import VerifikasiList from './components/Admin/VerifikasiList';
import VerifikasiDetail from './components/Admin/VerifikasiDetail';
import SellerManagement from './components/Admin/SellerManagement';
import CategoryManagement from './components/Admin/CategoryManagement';
import BannerManagement from './components/Admin/BannerManagement';
import ProductManagement from './components/Admin/ProductManagement';

// Public
import Home from './components/Public/Home';
import ProductList from './components/Public/ProductList';
import ProductDetail from './components/Public/ProductDetail';

// 3. Setup Root
const container = document.getElementById('app');
const root = createRoot(container);

// 4. Render dengan Routing
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/seller/register" element={<RegistrasiForm />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                
                {/* Seller Routes */}
                <Route path="/seller" element={
                    <ProtectedRoute role="seller">
                        <SellerProducts />
                    </ProtectedRoute>
                } />
                <Route path="/seller/products" element={
                    <ProtectedRoute role="seller">
                        <SellerProducts />
                    </ProtectedRoute>
                } />
                <Route path="/seller/products/create" element={
                    <ProtectedRoute role="seller">
                        <UploadProdukForm />
                    </ProtectedRoute>
                } />
                <Route path="/seller/products/:id/edit" element={
                    <ProtectedRoute role="seller">
                        <UploadProdukForm />
                    </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <DashboardAdmin />
                    </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                        <DashboardAdmin />
                    </ProtectedRoute>
                } />
                <Route path="/admin/pending-sellers" element={
                    <ProtectedRoute role="admin">
                        <VerifikasiList />
                    </ProtectedRoute>
                } />
                <Route path="/admin/verifikasi" element={
                    <ProtectedRoute role="admin">
                        <VerifikasiList />
                    </ProtectedRoute>
                } />
                <Route path="/admin/sellers/:id" element={
                    <ProtectedRoute role="admin">
                        <VerifikasiDetail />
                    </ProtectedRoute>
                } />
                <Route path="/admin/verifikasi/:id" element={
                    <ProtectedRoute role="admin">
                        <VerifikasiDetail />
                    </ProtectedRoute>
                } />
                <Route path="/admin/sellers" element={
                    <ProtectedRoute role="admin">
                        <SellerManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                    <ProtectedRoute role="admin">
                        <CategoryManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/banners" element={
                    <ProtectedRoute role="admin">
                        <BannerManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute role="admin">
                        <ProductManagement />
                    </ProtectedRoute>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);