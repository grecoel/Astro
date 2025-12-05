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
    const [dragOverAdd, setDragOverAdd] = useState(false);
    const [dragOverEdit, setDragOverEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleDragOver = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'add') setDragOverAdd(true);
        else setDragOverEdit(true);
    };

    const handleDragLeave = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'add') setDragOverAdd(false);
        else setDragOverEdit(false);
    };

    const handleDropAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverAdd(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setIcon(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIconPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDropEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverEdit(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setEditIcon(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setEditIconPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
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
        setEditIconPreview(category.icon_url || null);
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
                <div className={styles.headerContent}>
                    <h1>Manajemen Kategori Produk</h1>
                    <p className={styles.subtitle}>Kelola semua kategori produk di Astro E-Commerce</p>
                </div>
                <div className={styles.searchBar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
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
                {(() => {
                    const filteredCategories = categories.filter(cat => 
                        cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    
                    if (filteredCategories.length === 0) {
                        return (
                            <p className={styles.empty}>
                                {searchQuery ? `Tidak ada kategori yang cocok dengan "${searchQuery}"` : 'Belum ada kategori. Tambahkan kategori baru menggunakan form di atas.'}
                            </p>
                        );
                    }
                    
                    return (
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
                                {filteredCategories.map((cat, idx) => (
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
                    );
                })()}
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
                                    <div 
                                        className={`${styles.dragDropZone} ${dragOverAdd ? styles.dragOver : ''}`}
                                        onDragOver={(e) => handleDragOver(e, 'add')}
                                        onDragLeave={(e) => handleDragLeave(e, 'add')}
                                        onDrop={handleDropAdd}
                                    >
                                        <input 
                                            type="file"
                                            id="iconInput"
                                            accept="image/*"
                                            onChange={handleIconChange}
                                            className={styles.fileInput}
                                            disabled={loading}
                                        />
                                        <label htmlFor="iconInput" className={styles.dragDropLabel}>
                                            {iconPreview ? (
                                                <>
                                                    <img src={iconPreview} alt="Icon Preview" className={styles.dragDropPreview} />
                                                    <p>Ubah Icon</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                                    <p className={styles.dragDropTitle}>Klik untuk upload icon</p>
                                                    <p className={styles.dragDropSubtitle}>atau drag & drop di sini</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
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
                                    <div 
                                        className={`${styles.dragDropZone} ${dragOverEdit ? styles.dragOver : ''}`}
                                        onDragOver={(e) => handleDragOver(e, 'edit')}
                                        onDragLeave={(e) => handleDragLeave(e, 'edit')}
                                        onDrop={handleDropEdit}
                                    >
                                        <input 
                                            type="file"
                                            id="editIconInput"
                                            accept="image/*"
                                            onChange={handleEditIconChange}
                                            className={styles.fileInput}
                                            disabled={loading}
                                        />
                                        <label htmlFor="editIconInput" className={styles.dragDropLabel}>
                                            {editIconPreview ? (
                                                <>
                                                    <img src={editIconPreview} alt="New Icon Preview" className={styles.dragDropPreview} />
                                                    <p>Ubah Icon</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                                    <p className={styles.dragDropTitle}>Klik untuk upload icon</p>
                                                    <p className={styles.dragDropSubtitle}>atau drag & drop di sini</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
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