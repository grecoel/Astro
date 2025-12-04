import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './UploadProduk.module.css';
import CustomSelect from '../Common/CustomSelect';

function UploadProduk() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // State Form
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        condition: 'Baru',
        price: '',
        stock: 1,
        weight: 1000,
        description: '',
        location: '', 
    });

    // State Gambar (Array)
    const [images, setImages] = useState([]); 
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

    // 1. Load Kategori saat halaman dibuka
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/api/seller/products/create', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                setCategories(res.data.categories);
            })
            .catch(err => {
                console.error("Gagal load kategori:", err);
                alert('Gagal memuat kategori: ' + (err.response?.data?.message || err.message));
            });
    }, []);

    // 2. Handle Input Teks Biasa
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle File Upload (Multiple + Preview)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    // Process files (untuk upload dan drag & drop)
    const processFiles = (files) => {
        // Validasi Maksimal 5 Foto
        if (images.length + files.length > 5) {
            alert("Maksimal 5 foto produk!");
            return;
        }

        // Validasi ukuran file (max 2MB per file)
        for (let file of files) {
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} terlalu besar (max 2MB)`);
                return;
            }
            
            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} bukan gambar!`);
                return;
            }
        }

        // Simpan File Asli ke State
        setImages([...images, ...files]);

        // Buat URL Preview untuk ditampilkan
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    // 4. Handle Drag & Drop
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    // Remove photo from list
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    // Handle drag start for reordering
    const handleImageDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Handle drag over for reordering
    const handleImageDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedIndex === null || draggedIndex === index) return;
        
        // Reorder images
        const newImages = [...images];
        const newPreviews = [...previews];
        
        const draggedImage = newImages[draggedIndex];
        const draggedPreview = newPreviews[draggedIndex];
        
        newImages.splice(draggedIndex, 1);
        newPreviews.splice(draggedIndex, 1);
        
        newImages.splice(index, 0, draggedImage);
        newPreviews.splice(index, 0, draggedPreview);
        
        setImages(newImages);
        setPreviews(newPreviews);
        setDraggedIndex(index);
    };

    // Handle drag end for reordering
    const handleImageDragEnd = () => {
        setDraggedIndex(null);
    };

    // 5. Submit Form
    const handleSubmit = async (status) => {
        // Validasi Sederhana di Frontend
        if (!formData.category_id) return alert("Pilih kategori dulu!");
        if (!formData.name || !formData.name.trim()) return alert("Isi nama produk!");
        if (!formData.price || formData.price <= 0) return alert("Isi harga produk dengan nilai > 0!");
        if (!formData.description || !formData.description.trim()) return alert("Isi deskripsi produk!");
        if (!formData.location || !formData.location.trim()) return alert("Isi lokasi barang!");
        if (images.length === 0) return alert("Upload minimal 1 foto!");
        if (images.length > 5) return alert("Maksimal 5 foto!");

        setIsLoading(true);
        const data = new FormData();
        const token = localStorage.getItem('token');

        // Masukkan semua data teks ke FormData
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        
        // Tambahkan Status (DRAFT atau ACTIVE)
        data.append('status', status);

        // Tambahkan Gambar (Looping array)
        // Penting: Gunakan 'images[]' agar Laravel membacanya sebagai array
        images.forEach((file) => {
            data.append('images[]', file);
        });

        try {
            // Kirim ke Backend dengan Bearer Token
            await axios.post('/api/seller/products', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            alert(status === 'ACTIVE' ? 'Produk Berhasil Tayang!' : 'Draft Disimpan!');
            navigate('/seller/dashboard'); // Kembali ke dashboard

        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || error.response?.data?.error || 'Terjadi kesalahan server';
            const validationErrors = error.response?.data?.errors;
            
            if (validationErrors) {
                // Jika error validasi, tampilkan detailnya
                const errorList = Object.entries(validationErrors)
                    .map(([key, msgs]) => `${key}: ${msgs.join(', ')}`)
                    .join('\n');
                alert('Gagal: ' + errorList);
            } else {
                alert('Gagal: ' + message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button 
                    onClick={() => navigate('/seller/management')} 
                    className={styles.backButton}
                    type="button"
                >
                    ← Kembali
                </button>
                <h1>Form Jual Produk</h1>
            </div>
            
            <div className={styles.card}>
                {/* Informasi Produk Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informasi Produk</h2>
                    
                <div className={styles.formGroup}>
                    <label>Nama Produk</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Contoh: Sepatu Nike Air Jordan"
                    />
                </div>
                
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Kategori</label>
                        <CustomSelect
                            value={categories.find(c => c.id === formData.category_id)?.name || ''}
                            onChange={(value) => {
                                const category = categories.find(c => c.name === value);
                                if (category) {
                                    setFormData(prev => ({ ...prev, category_id: category.id }));
                                }
                            }}
                            options={categories.map(c => c.name)}
                            placeholder="-- Pilih Kategori --"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Kondisi</label>
                        <CustomSelect
                            value={formData.condition}
                            onChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                            options={['Baru', 'Bekas']}
                            placeholder="Pilih Kondisi"
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Harga (Rupiah)</label>
                        <input type="number" name="price" onChange={handleChange} placeholder="Rp 4.000" min="0" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Stok</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="25" min="0" />
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Lokasi Barang</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Tomohon City" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Berat (gram)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="300" min="0" />
                    </div>
                </div>

                    <div className={styles.formGroup}>
                        <label>Deskripsi Produk</label>
                        <textarea name="description" rows="5" onChange={handleChange} placeholder="Jelaskan detail produk, spesifikasi, kondisi, dan keunggulan produk Anda secara lengkap..."></textarea>
                    </div>
                </div>

                {/* Upload Foto Produk Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Upload Foto Produk</h2>
                    
                    <div 
                        className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            id="fileInput" 
                            style={{display: 'none'}} 
                        />
                        <label htmlFor="fileInput" className={styles.uploadBtn}>
                            {isDragging ? (
                                <>📥 Lepaskan Gambar di Sini</>
                            ) : (
                                <>
                                    <span className={styles.uploadIcon}>+</span>
                                    <span>Klik atau Seret File untuk Upload</span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Preview Gallery */}
                    <div className={styles.previewGrid}>
                        {previews.map((src, i) => (
                            <div 
                                key={i} 
                                className={`${styles.previewItem} ${draggedIndex === i ? styles.previewItemDragging : ''}`}
                                draggable
                                onDragStart={(e) => handleImageDragStart(e, i)}
                                onDragOver={(e) => handleImageDragOver(e, i)}
                                onDragEnd={handleImageDragEnd}
                            >
                                <img src={src} alt={`Preview ${i}`} />
                                {i === 0 && <span className={styles.mainBadge}>Utama</span>}
                                <button 
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className={styles.removeBtn}
                                    title="Hapus foto"
                                >
                                    ✕
                                </button>
                                <div className={styles.dragHint}>⋮⋮</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- BUTTONS --- */}
                <div className={styles.actionButtons}>
                    <button 
                        onClick={() => handleSubmit('DRAFT')} 
                        className={styles.btnDraft} 
                        disabled={isLoading}
                    >
                        Simpan Draft
                    </button>
                    <button 
                        onClick={() => handleSubmit('ACTIVE')} 
                        className={styles.btnPublish} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Mengupload...' : 'Upload Produk'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadProduk;