import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './UploadProduk.module.css';

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
        }

        // Simpan File Asli ke State
        setImages([...images, ...files]);

        // Buat URL Preview untuk ditampilkan
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    // Remove photo from list
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    // 4. Submit Form
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
                <h1>Form Jual Produk</h1>
            </div>
            
            <div className={styles.card}>
                {/* --- FORM INPUTS --- */}
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
                        <select name="category_id" onChange={handleChange}>
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Kondisi</label>
                        <select name="condition" onChange={handleChange}>
                            <option value="Baru">Baru</option>
                            <option value="Bekas">Bekas</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Harga (Rp)</label>
                        <input type="number" name="price" onChange={handleChange} placeholder="0" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Stok</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Lokasi Barang</label>
                    <input type="text" name="location" onChange={handleChange} placeholder="Kota / Kecamatan" />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Berat (Gram)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label>Deskripsi Produk</label>
                    <textarea name="description" rows="5" onChange={handleChange} placeholder="Jelaskan detail produk Anda..."></textarea>
                </div>

                {/* --- IMAGE UPLOAD --- */}
                <div className={styles.uploadSection}>
                    <label className={styles.uploadLabel}>Foto Produk (Max 5)</label>
                    
                    <div className={styles.uploadArea}>
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            id="fileInput" 
                            style={{display: 'none'}} 
                        />
                        <label htmlFor="fileInput" className={styles.uploadBtn}>
                            📸 Klik untuk Upload Foto
                        </label>
                    </div>

                    {/* Preview Gallery */}
                    <div className={styles.previewGrid}>
                        {previews.map((src, i) => (
                            <div key={i} className={styles.previewItem}>
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
                        {isLoading ? 'Mengupload...' : 'Tayangkan Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadProduk;