import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './BannerManager.module.css';

const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load Banners saat halaman dibuka
    const fetchBanners = async () => {
        try {
            setPageLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token tidak ditemukan. Silakan login kembali.');
                setBanners([]);
                return;
            }

            const res = await axios.get('/api/admin/banners', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            let data = res.data?.data || res.data || [];
            if (!Array.isArray(data)) {
                data = [];
            }
            setBanners(data);
            setError(null);
        } catch (err) {
            console.error("Gagal load banner:", err);
            setBanners([]);
            if (err.response?.status === 401) {
                setError('Anda tidak terautentikasi. Silakan login kembali.');
            } else if (err.response?.status === 403) {
                setError('Anda tidak memiliki akses untuk melihat banner.');
            } else {
                setError('Gagal memuat banner: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi ukuran file (max 5MB untuk banner)
            if (file.size > 5 * 1024 * 1024) {
                setError('File terlalu besar (max 5MB)');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size > 5 * 1024 * 1024) {
                    setError('File terlalu besar (max 5MB)');
                    return;
                }
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setError(null);
            }
        }
    };

    const openAddModal = () => {
        setShowAddModal(true);
        setError(null);
        setTitle('');
        setLinkUrl('');
        setImageFile(null);
        setImagePreview(null);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setTitle('');
        setLinkUrl('');
        setImageFile(null);
        setImagePreview(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setError('Judul banner tidak boleh kosong');
            return;
        }

        if (!linkUrl.trim()) {
            setError('URL link banner tidak boleh kosong');
            return;
        }

        if (!imageFile) {
            setError('Upload gambar banner terlebih dahulu');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('link_url', linkUrl.trim());
        formData.append('image', imageFile);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/banners', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            closeAddModal();
            await fetchBanners();
            setSuccess('Banner berhasil ditambahkan');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || 'Gagal menambah banner';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/banners/${id}/toggle`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchBanners();
            setSuccess('Status banner diubah');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || 'Gagal mengubah status banner';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/banners/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setDeleteConfirmId(null);
            await fetchBanners();
            setSuccess('Banner berhasil dihapus');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data?.error || 'Gagal menghapus banner';
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
                    <p>Memuat banner...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Manajemen Banner Promo</h1>
                    <p className={styles.subtitle}>Kelola semua banner promosi di Astro E-Commerce</p>
                </div>
                <div className={styles.searchBar}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari banner..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Alert Messages */}
            {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
            {success && <div className={styles.alert + ' ' + styles.success}>{success}</div>}

            {/* Button Tambah Banner */}
            <div className={styles.actionBar}>
                <button 
                    onClick={openAddModal}
                    className={styles.btnPrimary}
                >
                    + Tambah Banner
                </button>
            </div>

            {/* Tabel Banner */}
            <div className={styles.tableCard}>
                <h2>Daftar Banner</h2>
                {(() => {
                    const filteredBanners = banners.filter(banner => 
                        banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        banner.link_url?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    
                    if (filteredBanners.length === 0) {
                        return (
                            <p className={styles.empty}>
                                {searchQuery ? `Tidak ada banner yang cocok dengan "${searchQuery}"` : 'Belum ada banner. Tambahkan banner baru menggunakan tombol di atas.'}
                            </p>
                        );
                    }
                    
                    return (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Preview</th>
                                    <th>Judul</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBanners.map((banner, idx) => (
                                    <tr key={banner.id}>
                                        <td className={styles.colNo}>{idx + 1}</td>
                                        <td className={styles.colPreview}>
                                            {banner.image_full_url ? (
                                                <img src={banner.image_full_url} alt={banner.title} className={styles.bannerPreview} />
                                            ) : (
                                                <span className={styles.noIcon}>-</span>
                                            )}
                                        </td>
                                        <td className={styles.colTitle}>
                                            <b>{banner.title}</b>
                                            {banner.link_url && (
                                                <>
                                                    <br/>
                                                    <small style={{color: '#718096'}}>{banner.link_url}</small>
                                                </>
                                            )}
                                        </td>
                                        <td className={styles.colStatus}>
                                            <button 
                                                onClick={() => handleToggle(banner.id)}
                                                disabled={loading}
                                                className={`${styles.btnToggle} ${!banner.is_active ? styles.inactive : ''}`}
                                            >
                                                {banner.is_active ? 'Aktif' : 'Non-Aktif'}
                                            </button>
                                        </td>
                                        <td className={styles.colActions}>
                                            <div className={styles.actionButtons}>
                                                <button 
                                                    onClick={() => setDeleteConfirmId(banner.id)}
                                                    disabled={loading}
                                                    className={styles.btnDelete}
                                                    title="Hapus banner"
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

            {/* Modal Tambah Banner */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Tambah Banner Baru</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
                                
                                <div className={styles.formGroup}>
                                    <label>Judul Banner</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        placeholder="Contoh: Flash Sale UTS, Diskon Hingga 50%, dll" 
                                        className={styles.input}
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Link URL</label>
                                    <input 
                                        type="text" 
                                        value={linkUrl} 
                                        onChange={e => setLinkUrl(e.target.value)} 
                                        placeholder="https://example.com/promo" 
                                        className={styles.input}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Gambar Banner (Max 5MB)</label>
                                    <div 
                                        className={`${styles.dragDropZone} ${dragOver ? styles.dragOver : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input 
                                            type="file"
                                            id="bannerImageInput"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={styles.fileInput}
                                            disabled={loading}
                                        />
                                        <label htmlFor="bannerImageInput" className={styles.dragDropLabel}>
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Banner Preview" className={styles.dragDropPreview} />
                                                    <p>Ubah Gambar</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                                    <p className={styles.dragDropTitle}>Klik untuk upload gambar</p>
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
                                    {loading ? 'Menyimpan...' : 'Tambah Banner'}
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
                            <p>Apakah Anda yakin ingin menghapus banner ini?</p>
                            <p className={styles.warning}>Aksi ini tidak dapat dibatalkan.</p>
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
                                {loading ? 'Menghapus...' : 'Ya, Hapus Banner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManager;