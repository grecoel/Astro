

import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';

// 1. IMPOR CSS GLOBAL ANDA
import '../css/app.css'; 

// 2. IMPOR KOMPONEN HALAMAN ANDA
import RegistrasiForm from './components/RegistrasiForm/RegistrasiForm';

// 3. Dapatkan "Kanvas" dari app.blade.php
const container = document.getElementById('app');
const root = createRoot(container);

// 4. "Gambar" komponen Anda ke kanvas
root.render(
    <React.StrictMode>
        {/* Gunakan class .page-container dari CSS global */}
        <div className="page-container">
            <RegistrasiForm />
        </div>
    </React.StrictMode>
);

