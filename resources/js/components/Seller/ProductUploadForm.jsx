import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UploadProduk.module.css';
import formStyles from './ProductUploadForm.module.css';
import CustomSelect from '../Common/CustomSelect';

function ProductUploadForm({ onSuccess, onCancel }) {
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

    // State Gambar (Array untuk 5 slot)
    const [images, setImages] = useState([null, null, null, null, null]); 
    const [previews, setPreviews] = useState([null, null, null, null, null]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    // 1. Load Kategori saat komponen dimuat
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

    // 3. Handle File Upload untuk slot tertentu (Support Multiple Files)
    const handleImageChange = (e, slotIndex) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newImages = [...images];
        const newPreviews = [...previews];
        
        // Always start from the first empty slot
        let currentIndex = newImages.findIndex(img => img === null);
        
        // If no empty slot found, alert and return
        if (currentIndex === -1) {
            alert('Semua slot sudah terisi. Hapus foto terlebih dahulu untuk menambah foto baru.');
            return;
        }
        
        for (const file of files) {
            // Find next empty slot
            while (currentIndex < 5 && newImages[currentIndex] !== null) {
                currentIndex++;
            }
            
            // If no more slots available
            if (currentIndex >= 5) {
                alert(`Maksimal 5 foto. ${files.length - (currentIndex - newImages.findIndex(img => img === null))} foto tidak dapat ditambahkan.`);
                break;
            }
            
            // Validasi ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} terlalu besar (max 2MB)`);
                continue;
            }
            
            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} bukan gambar!`);
                continue;
            }

            newImages[currentIndex] = file;
            newPreviews[currentIndex] = URL.createObjectURL(file);
            currentIndex++;
        }
        
        setImages(newImages);
        setPreviews(newPreviews);
    };

    // 4. Handle Drag & Drop untuk slot tertentu
    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert(`File terlalu besar (max 2MB)`);
            return;
        }
        
        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            alert(`File bukan gambar!`);
            return;
        }

        // Update state
        const newImages = [...images];
        const newPreviews = [...previews];
        
        newImages[slotIndex] = file;
        newPreviews[slotIndex] = URL.createObjectURL(file);
        
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Remove photo from slot and shift remaining photos to the left
    const removeImage = (slotIndex) => {
        const newImages = [...images];
        const newPreviews = [...previews];
        
        // Revoke URL to free memory
        if (newPreviews[slotIndex]) {
            URL.revokeObjectURL(newPreviews[slotIndex]);
        }
        
        // Remove the image at slotIndex
        newImages.splice(slotIndex, 1);
        newPreviews.splice(slotIndex, 1);
        
        // Add null at the end to maintain 5 slots
        newImages.push(null);
        newPreviews.push(null);
        
        setImages(newImages);
        setPreviews(newPreviews);
    };

    // Handle drag start for reordering
    const handleDragStart = (e, index) => {
        if (images[index] === null) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Handle drag over for reordering
    const handleDragOverSlot = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Handle drop for reordering
    const handleDropSlot = (e, dropIndex) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedIndex === null) return;
        if (draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        // Only allow swap if both slots have images
        if (images[draggedIndex] === null || images[dropIndex] === null) {
            setDraggedIndex(null);
            return;
        }

        const newImages = [...images];
        const newPreviews = [...previews];

        // Swap images
        [newImages[draggedIndex], newImages[dropIndex]] = [newImages[dropIndex], newImages[draggedIndex]];
        [newPreviews[draggedIndex], newPreviews[dropIndex]] = [newPreviews[dropIndex], newPreviews[draggedIndex]];

        setImages(newImages);
        setPreviews(newPreviews);
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
        
        // Filter only uploaded images
        const uploadedImages = images.filter(img => img !== null);
        if (uploadedImages.length === 0) return alert("Upload minimal 1 foto!");

        setIsLoading(true);
        const data = new FormData();
        const token = localStorage.getItem('token');

        // Masukkan semua data teks ke FormData
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        
        // Tambahkan Status (DRAFT atau ACTIVE)
        data.append('status', status);

        // Tambahkan Gambar (hanya yang ada)
        uploadedImages.forEach((file) => {
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
            if (onSuccess) onSuccess(); // Callback untuk refresh data

        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || error.response?.data?.error || 'Terjadi kesalahan server';
            const validationErrors = error.response?.data?.errors;
            
            if (validationErrors) {
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
        <div className={formStyles.formWrapper}>
            <div className={formStyles.formHeader}>
                <h2>Form Jual Produk</h2>
                <button 
                    onClick={onCancel} 
                    className={formStyles.closeBtn}
                    type="button"
                >
                    ✕
                </button>
            </div>
            
            <div className={formStyles.formContent}>
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

                {/* Upload Foto Produk Section - NEW 5 SLOT DESIGN */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Upload Foto Produk</h2>
                    <p className={styles.sectionSubtitle}>
                        Upload hingga 5 foto produk (bisa sekaligus). Foto pertama akan menjadi foto utama. 
                        Drag foto untuk mengatur urutan.
                    </p>
                    
                    <div className={formStyles.imageSlots}>
                        {/* Main Image Slot (Larger) */}
                        <div 
                            className={`${formStyles.imageSlot} ${formStyles.mainSlot} ${draggedIndex === 0 ? formStyles.dragging : ''}`}
                            draggable={images[0] !== null}
                            onDragStart={(e) => handleDragStart(e, 0)}
                            onDragOver={(e) => handleDragOverSlot(e, 0)}
                            onDrop={(e) => handleDropSlot(e, 0)}
                            onDragEnd={handleDragEnd}
                        >
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                onChange={(e) => handleImageChange(e, 0)} 
                                id="imageInput0" 
                                style={{display: 'none'}} 
                            />
                            
                            {previews[0] ? (
                                <div className={formStyles.slotPreview}>
                                    <img src={previews[0]} alt="Preview 0" />
                                    <span className={formStyles.mainBadge}>Utama</span>
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(0)}
                                        className={formStyles.removeBtn}
                                    >
                                        ✕
                                    </button>
                                    <div className={formStyles.dragHint}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <path d="M9 3h6l2 2h-10l2-2zm-5 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-12h-16zm5 10v-8l-3 3 3 3zm6 0l3-3-3-3v8z"/>
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="imageInput0" 
                                    className={formStyles.slotEmpty}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 0)}
                                >
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                    <span>Foto Utama</span>
                                    <small>Klik atau Drop (Multiple)</small>
                                </label>
                            )}
                        </div>

                        {/* Secondary Image Slots (Smaller) */}
                        <div className={formStyles.secondarySlots}>
                            {[1, 2, 3, 4].map((index) => (
                                <div 
                                    key={index} 
                                    className={`${formStyles.imageSlot} ${draggedIndex === index ? formStyles.dragging : ''}`}
                                    draggable={images[index] !== null}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOverSlot(e, index)}
                                    onDrop={(e) => handleDropSlot(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        onChange={(e) => handleImageChange(e, index)} 
                                        id={`imageInput${index}`} 
                                        style={{display: 'none'}} 
                                    />
                                    
                                    {previews[index] ? (
                                        <div className={formStyles.slotPreview}>
                                            <img src={previews[index]} alt={`Preview ${index}`} />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className={formStyles.removeBtn}
                                            >
                                                ✕
                                            </button>
                                            <div className={formStyles.dragHint}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                                    <path d="M9 3h6l2 2h-10l2-2zm-5 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-12h-16zm5 10v-8l-3 3 3 3zm6 0l3-3-3-3v8z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <label 
                                            htmlFor={`imageInput${index}`} 
                                            className={formStyles.slotEmpty}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <polyline points="21 15 16 10 5 21"/>
                                            </svg>
                                            <small>Foto {index + 1}</small>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
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

export default ProductUploadForm;
