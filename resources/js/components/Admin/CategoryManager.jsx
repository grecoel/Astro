import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Load Kategori
    const fetchCategories = async () => {
        try {
            setPageLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login kembali.');
                return;
            }
            
            const res = await axios.get('/api/admin/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(res.data.data || res.data);
            setError(null);
        } catch (err) {
            console.error("Gagal load kategori:", err);
            if (err.response?.status === 401) {
                setError('Anda tidak terautentikasi. Silakan login kembali.');
            } else if (err.response?.status === 403) {
                setError('Anda tidak memiliki akses untuk melihat kategori.');
            } else {
                setError('Gagal memuat kategori: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Tambah Kategori
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Nama kategori tidak boleh kosong');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/categories', 
                { name: name.trim() },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setName('');
            await fetchCategories();
            setSuccess('Kategori berhasil ditambah');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || 'Gagal menambah kategori';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Edit Kategori
    const startEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setError(null);
    };

    const handleEdit = async (id) => {
        if (!editName.trim()) {
            setError('Nama kategori tidak boleh kosong');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/categories/${id}`, 
                { name: editName.trim() },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setEditingId(null);
            setEditName('');
            await fetchCategories();
            setSuccess('Kategori berhasil diperbarui');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || 'Gagal memperbarui kategori';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Hapus Kategori
    const handleDelete = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/categories/${id}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setDeleteConfirmId(null);
            await fetchCategories();
            setSuccess('Kategori berhasil dihapus');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || 'Gagal menghapus kategori';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Memuat kategori...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manajemen Kategori Produk</h1>
                <p className={styles.subtitle}>Kelola semua kategori produk di marketplace</p>
            </div>

            {/* Alert Messages */}
            {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
            {success && <div className={styles.alert + ' ' + styles.success}>{success}</div>}

            {/* Form Tambah */}
            <div className={styles.formCard}>
                <h2>Tambah Kategori Baru</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nama Kategori</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Masukkan nama kategori (contoh: Elektronik, Fashion, dll)" 
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={styles.btnPrimary}
                    >
                        {loading ? 'Menyimpan...' : 'Tambah Kategori'}
                    </button>
                </form>
            </div>

            {/* Tabel Kategori */}
            <div className={styles.tableCard}>
                <h2>Daftar Kategori</h2>
                {categories.length === 0 ? (
                    <p className={styles.empty}>Belum ada kategori. Tambahkan kategori baru menggunakan form di atas.</p>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Kategori</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id}>
                                        <td className={styles.colNo}>{idx + 1}</td>
                                        <td className={styles.colName}>
                                            {editingId === cat.id ? (
                                                <input 
                                                    type="text" 
                                                    value={editName} 
                                                    onChange={e => setEditName(e.target.value)}
                                                    className={styles.editInput}
                                                    disabled={loading}
                                                    autoFocus
                                                />
                                            ) : (
                                                cat.name
                                            )}
                                        </td>
                                        <td className={styles.colActions}>
                                            {editingId === cat.id ? (
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        onClick={() => handleEdit(cat.id)}
                                                        disabled={loading}
                                                        className={styles.btnSave}
                                                        title="Simpan"
                                                    >
                                                        Simpan
                                                    </button>
                                                    <button 
                                                        onClick={cancelEdit}
                                                        disabled={loading}
                                                        className={styles.btnCancel}
                                                        title="Batal"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={styles.actionButtons}>
                                                    <button 
                                                        onClick={() => startEdit(cat)}
                                                        disabled={loading}
                                                        className={styles.btnEdit}
                                                        title="Edit kategori"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirmId(cat.id)}
                                                        disabled={loading}
                                                        className={styles.btnDelete}
                                                        title="Hapus kategori"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Konfirmasi Penghapusan</h3>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Apakah Anda yakin ingin menghapus kategori ini?</p>
                            <p className={styles.warning}>Aksi ini tidak dapat dibatalkan dan mungkin mempengaruhi produk yang menggunakan kategori ini.</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={loading}
                                className={styles.btnCancel}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirmId)}
                                disabled={loading}
                                className={styles.btnDelete}
                            >
                                {loading ? 'Menghapus...' : 'Ya, Hapus Kategori'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;