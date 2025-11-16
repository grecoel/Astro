/**
 * Bootstrap file untuk aplikasi Laravel + React
 * File ini di-import oleh app.jsx untuk setup konfigurasi global
 */

import axios from 'axios';

// Expose axios ke window untuk kompatibilitas dengan kode Laravel/legacy
window.axios = axios;

// Set header default agar Laravel mendeteksi request sebagai AJAX
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token dari meta tag (jika ada)
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Tambahkan konfigurasi lain di sini jika diperlukan
// Contoh: Echo untuk broadcasting, dll
