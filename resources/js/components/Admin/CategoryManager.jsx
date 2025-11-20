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
            const res = await axios.get('/api/admin/categories');
            setCategories(res.data.data || res.data);
            setError(null);
        } catch (err) {
            console.error("Gagal load kategori:", err);
            setError('Gagal memuat kategori');
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
            await axios.post('/api/admin/categories', { name: name.trim() });
            setName('');
            await fetchCategories();
            setSuccess('Kategori berhasil ditambah');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menambah kategori';
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
            await axios.put(`/api/admin/categories/${id}`, { name: editName.trim() });
            setEditingId(null);
            setEditName('');
            await fetchCategories();
            setSuccess('Kategori berhasil diperbarui');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal memperbarui kategori';
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
            await axios.delete(`/api/admin/categories/${id}`);
            setDeleteConfirmId(null);
            await fetchCategories();
            setSuccess('Kategori berhasil dihapus');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal menghapus kategori';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className={styles.container}><p>Memuat kategori...</p></div>;
    }

    return (
        <div className={styles.container}>
            <h1>Manajemen Kategori Produk</h1>

            {/* Alert Messages */}
            {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
            {success && <div className={styles.alert + ' ' + styles.success}>{success}</div>}

            {/* Form Tambah */}
            <div className={styles.formCard}>
                <h3>Tambah Kategori Baru</h3>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Masukkan nama kategori..." 
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className={styles.btnPrimary}
                    >
                        {loading ? 'Menyimpan...' : '+ Tambah Kategori'}
                    </button>
                </form>
            </div>

            {/* Tabel Kategori */}
            <div className={styles.tableCard}>
                <h3>Daftar Kategori</h3>
                {categories.length === 0 ? (
                    <p className={styles.empty}>Tidak ada kategori. Tambahkan kategori baru di atas.</p>
                ) : (
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
                                    <td>{idx + 1}</td>
                                    <td>
                                        {editingId === cat.id ? (
                                            <input 
                                                type="text" 
                                                value={editName} 
                                                onChange={e => setEditName(e.target.value)}
                                                className={styles.editInput}
                                                disabled={loading}
                                            />
                                        ) : (
                                            cat.name
                                        )}
                                    </td>
                                    <td className={styles.actions}>
                                        {editingId === cat.id ? (
                                            <>
                                                <button 
                                                    onClick={() => handleEdit(cat.id)}
                                                    disabled={loading}
                                                    className={styles.btnSuccess}
                                                >
                                                    Simpan
                                                </button>
                                                <button 
                                                    onClick={cancelEdit}
                                                    disabled={loading}
                                                    className={styles.btnSecondary}
                                                >
                                                    Batal
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => startEdit(cat)}
                                                    disabled={loading}
                                                    className={styles.btnInfo}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(cat.id)}
                                                    disabled={loading}
                                                    className={styles.btnDanger}
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Konfirmasi Penghapusan</h3>
                        <p>Apakah Anda yakin ingin menghapus kategori ini? Aksi ini tidak dapat dibatalkan.</p>
                        <div className={styles.modalActions}>
                            <button 
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={loading}
                                className={styles.btnSecondary}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => handleDelete(deleteConfirmId)}
                                disabled={loading}
                                className={styles.btnDanger}
                            >
                                {loading ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;