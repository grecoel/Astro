import React, { useState } from "react";
import axios from "axios";
import styles from "./UploadProdukForm.module.css";

const API_URL = "/api/products";

function UploadProdukForm() {
    const [formData, setFormData] = useState({
        product_name: "",
        category: "",
        condition: "",
        price: "",
        stock: "",
        description: "",
        location: "",
        weight: "",
        shipping_methods: [],
    });

    const [productPhotos, setProductPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [modalMessage, setModalMessage] = useState("");

    // -------------------------
    // HANDLE INPUT TEXT
    // -------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // -------------------------
    // HANDLE CHECKBOX
    // -------------------------
    const handleCheckbox = (e) => {
        const { value, checked } = e.target;

        setFormData((prev) => {
            if (checked) {
                return {
                    ...prev,
                    shipping_methods: [...prev.shipping_methods, value],
                };
            }
            return {
                ...prev,
                shipping_methods: prev.shipping_methods.filter((m) => m !== value),
            };
        });
    };

    // -------------------------
    // HANDLE MULTIPLE FILE UPLOAD
    // -------------------------
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setProductPhotos(files);

        // buat preview foto
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewPhotos(previews);
    };

    // -------------------------
    // SUBMIT
    // -------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const data = new FormData();

        for (const key in formData) {
            if (key === "shipping_methods") {
                formData.shipping_methods.forEach((m) => data.append("shipping_methods[]", m));
            } else {
                data.append(key, formData[key]);
            }
        }

        productPhotos.forEach((photo) => {
            data.append("photos[]", photo);
        });

        try {
            const res = await axios.post(API_URL, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModalType("success");
            setModalMessage("Produk berhasil diupload!");
            setShowModal(true);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                setModalType("error");
                setModalMessage("Cek kembali data yang Anda masukkan.");
                setShowModal(true);
            } else {
                setModalType("error");
                setModalMessage("Terjadi kesalahan server.");
                setShowModal(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getError = (field) =>
        errors[field] ? <span className={styles.errorText}>{errors[field][0]}</span> : null;

    // ======================================================
    // RENDER FORM (DESAIN SAMA DENGAN UI GAMBAR)
    // ======================================================

    return (
        <div className={styles.container}>
            <h2>Form Jual Produk</h2>
            <p className={styles.subtitle}>
                Lengkapi informasi produk, foto pendukung, dan detail pengiriman sebelum menayangkan produk.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <fieldset className={styles.section}>
                    <legend>Informasi Produk</legend>

                    <label>Nama Produk</label>
                    <input
                        type="text"
                        name="product_name"
                        placeholder="Contoh: Mie Instan"
                        value={formData.product_name}
                        onChange={handleChange}
                        required
                    />
                    {getError("product_name")}

                    <div className={styles.gridTwo}>
                        <div>
                            <label>Kategori</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="">Pilih Kategori</option>
                                <option value="food">Makanan dan Minuman</option>
                                <option value="fashion">Fashion</option>
                                <option value="electronic">Elektronik</option>
                            </select>
                        </div>
                        <div>
                            <label>Kondisi</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}>
                                <option value="">Pilih Kondisi</option>
                                <option value="new">Baru</option>
                                <option value="used">Bekas</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.gridTwo}>
                        <div>
                            <label>Harga (Rupiah)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="3000"
                                inputMode="numeric"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Stok</label>
                            <input
                                type="number"
                                name="stock"
                                placeholder="25"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <label>Deskripsi Produk</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Ceritakan detail produk, varian rasa, dan alasan mengapa pembeli harus memilih produk ini."
                    />

                    <div className={styles.uploadSection}>
                        <div className={styles.uploadHeader}>
                            <label>Upload Foto Produk</label>
                            <span className={styles.helperText}>Maksimal 5 foto, ukuran maksimal 2MB</span>
                        </div>

                        <div className={styles.photoGrid}>
                            <label htmlFor="productPhotos" className={styles.dropzone}>
                                <span className={styles.dropIcon}>+</span>
                                <p>Klik atau drop untuk upload</p>
                            </label>
                            <input
                                id="productPhotos"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className={styles.hiddenInput}
                            />

                            {previewPhotos.map((src, i) => (
                                <div key={i} className={styles.photoItem}>
                                    <img src={src} alt={`Foto ${i + 1}`} />
                                </div>
                            ))}

                            {previewPhotos.length === 0 && (
                                <div className={styles.photoPlaceholder}>Belum ada foto</div>
                            )}

                            {previewPhotos.length > 0 && (
                                <div className={styles.photoCount}>Foto {previewPhotos.length}</div>
                            )}
                        </div>
                    </div>
                </fieldset>

                <fieldset className={styles.section}>
                    <legend>Lokasi & Pengiriman</legend>

                    <div className={styles.gridTwo}>
                        <div>
                            <label>Lokasi Barang</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Contoh: Tembalang City"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Berat (gram)</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="300"
                                value={formData.weight}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <label>Metode Pengiriman</label>
                    <div className={styles.shippingGrid}>
                        {["JNE", "J&T", "SiCepat", "COD di Kampus"].map((s) => (
                            <label key={s} className={styles.shippingOption}>
                                <input
                                    type="checkbox"
                                    value={s}
                                    checked={formData.shipping_methods.includes(s)}
                                    onChange={handleCheckbox}
                                />
                                <span>{s}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className={styles.buttonRow}>
                    <button type="button" className={styles.draftButton}>
                        Simpan Draft
                    </button>

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? "Mengupload..." : "Upload Produk"}
                    </button>
                </div>
            </form>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div
                        className={`${styles.modal} ${styles[`modal-${modalType}`]}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{modalType === "success" ? "Berhasil!" : "Terjadi Kesalahan"}</h3>
                        <p>{modalMessage}</p>
                        <button onClick={() => setShowModal(false)}>Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadProdukForm;
