import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editIcon, setEditIcon] = useState(null);
    const [editIconPreview, setEditIconPreview] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Load Kategori
    const fetchCategories = async () => {
        try {
            setPageLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login kembali.');
                setCategories([]);
                return;
            }
            
            const res = await axios.get('/api/admin/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Ensure categories is always an array
            let data = res.data?.data || res.data || [];
            if (!Array.isArray(data)) {
                data = [];
            }
            setCategories(data);
            setError(null);
        } catch (err) {
            console.error("Gagal load kategori:", err);
            setCategories([]); // Ensure empty array on error
            if (err.response?.status === 401) {
                setError('Anda tidak terautentikasi. Silakan login kembali.');
            } else if (err.response?.status === 403) {
                setError('Anda tidak memiliki akses untuk melihat kategori.');
            } else if (err.message === 'Network Error' || !err.response) {
                setError('Gagal terhubung ke server. Periksa koneksi Anda.');
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

    const handleIconChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIcon(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditIconChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditIcon(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
            const formData = new FormData();
            formData.append('name', name.trim());
            if (icon) {
                formData.append('icon', icon);
            }

            await axios.post('/api/admin/categories', 
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setName('');
            setIcon(null);
            setIconPreview(null);
            setShowAddModal(false);
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

    const openAddModal = () => {
        setShowAddModal(true);
        setError(null);
        setName('');
        setIcon(null);
        setIconPreview(null);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setName('');
        setIcon(null);
        setIconPreview(null);
        setError(null);
    };

    // Edit Kategori
    const startEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditIcon(null);
        setEditIconPreview(null);
        setError(null);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingId(null);
        setEditName('');
        setEditIcon(null);
        setEditIconPreview(null);
        setError(null);
    };

    const cancelEdit = () => {
        closeEditModal();
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
            const formData = new FormData();
            formData.append('name', editName.trim());
            if (editIcon) {
                formData.append('icon', editIcon);
            }

            await axios.put(`/api/admin/categories/${id}`, 
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            closeEditModal();
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

            {/* Button Tambah Kategori */}
            <div className={styles.actionBar}>
                <button 
                    onClick={openAddModal}
                    className={styles.btnPrimary}
                >
                    + Tambah Kategori
                </button>
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
                                    <th>Icon</th>
                                    <th>Nama Kategori</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id}>
                                        <td className={styles.colNo}>{idx + 1}</td>
                                        <td className={styles.colIcon}>
                                            {cat.icon_url ? (
                                                <img src={cat.icon_url} alt={cat.name} className={styles.categoryIcon} />
                                            ) : (
                                                <span className={styles.noIcon}>-</span>
                                            )}
                                        </td>
                                        <td className={styles.colName}>
                                            {cat.name}
                                        </td>
                                        <td className={styles.colActions}>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Tambah Kategori */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Tambah Kategori Baru</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
                                <div className={styles.formGroup}>
                                    <label>Nama Kategori</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        placeholder="Masukkan nama kategori (contoh: Elektronik, Fashion, dll)" 
                                        className={styles.input}
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Icon Kategori (Opsional)</label>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleIconChange}
                                        className={styles.input}
                                        disabled={loading}
                                    />
                                    {iconPreview && (
                                        <div className={styles.iconPreview}>
                                            <img src={iconPreview} alt="Icon Preview" />
                                            <span>Preview Icon</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button"
                                    onClick={closeAddModal}
                                    disabled={loading}
                                    className={styles.btnCancel}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={styles.btnPrimary}
                                >
                                    {loading ? 'Menyimpan...' : 'Tambah Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Kategori */}
            {showEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Kategori</h3>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleEdit(editingId); }}>
                            <div className={styles.modalBody}>
                                {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
                                <div className={styles.formGroup}>
                                    <label>Nama Kategori</label>
                                    <input 
                                        type="text" 
                                        value={editName} 
                                        onChange={e => setEditName(e.target.value)} 
                                        placeholder="Masukkan nama kategori" 
                                        className={styles.input}
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Icon Kategori (Opsional)</label>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditIconChange}
                                        className={styles.input}
                                        disabled={loading}
                                    />
                                    {editIconPreview && (
                                        <div className={styles.iconPreview}>
                                            <img src={editIconPreview} alt="New Icon Preview" />
                                            <span>Preview Icon Baru</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button 
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className={styles.btnCancel}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className={styles.btnPrimary}
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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