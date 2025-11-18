
import React, { useState } from 'react';
import axios from 'axios';
import styles from './RegistrasiForm.module.css';

const API_URL = '/api/sellers';

function RegistrasiForm() {
    // State untuk data teks
    const [formData, setFormData] = useState({
        store_name: '',
        store_description: '',
        pic_name: '',
        pic_phone: '',
        pic_email: '',
        pic_address: '',
        pic_rt: '',
        pic_rw: '',
        pic_district: '',
        pic_city: '',
        pic_province: '',
        pic_ktp_number: '',
    });

    // State untuk file
    const [picPhoto, setPicPhoto] = useState(null);
    const [picKtpFile, setPicKtpFile] = useState(null);
    
    // State untuk UI
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Untuk error validasi Laravel

    // Handler untuk semua input teks
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler untuk kirim form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Bersihkan error lama

        // 1. Buat FormData (WAJIB untuk file upload)
        const data = new FormData();
        
        // 2. Isi dengan data teks
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        
        // 3. Isi dengan file
        if (picPhoto) data.append('pic_photo', picPhoto);
        if (picKtpFile) data.append('pic_ktp_file', picKtpFile);

        // 4. Kirim ke API Laravel
        try {
            const response = await axios.post(API_URL, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response.data);
            alert('Registrasi berhasil! Data Anda sedang diverifikasi.');
            // (Opsional: reset form di sini)

        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Tangani error validasi 422 dari Laravel
                setErrors(error.response.data.errors);
                alert('Registrasi gagal. Cek kembali data yang Anda masukkan.');
            } else {
                console.error('Server Error:', error);
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                alert(`Terjadi kesalahan pada server: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Helper untuk menampilkan error di bawah input
    const getError = (field) => errors[field] ? (
        <span className={styles.errorText}>{errors[field][0]}</span>
    ) : null;

    // UI Form berdasarkan kebutuhan registrasi seller
    return (
        <div className={styles.container}>
            <h2>Formulir Registrasi Penjual (Toko)</h2>
            <p>Implementasi SRS-01</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                
                <fieldset className={styles.formSection}>
                    <legend>Data Toko</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="store_name">Nama Toko*</label>
                        <input 
                            type="text" 
                            id="store_name" 
                            name="store_name" 
                            value={formData.store_name}
                            onChange={handleChange} 
                            required 
                        />
                        {getError('store_name')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="store_description">Deskripsi Toko</label>
                        <textarea 
                            id="store_description" 
                            name="store_description" 
                            value={formData.store_description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Jelaskan tentang toko Anda (opsional)"
                        />
                        {getError('store_description')}
                    </div>
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Data PIC (Person in Charge)</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_name">Nama PIC*</label>
                        <input 
                            type="text" 
                            id="pic_name" 
                            name="pic_name" 
                            value={formData.pic_name}
                            onChange={handleChange} 
                            required 
                        />
                        {getError('pic_name')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_phone">No. HP PIC* (max 13 digit)</label>
                        <input 
                            type="tel" 
                            id="pic_phone" 
                            name="pic_phone" 
                            value={formData.pic_phone}
                            onChange={handleChange} 
                            maxLength="13"
                            placeholder="08xxxxxxxxxx"
                            required 
                        />
                        {getError('pic_phone')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_email">Email PIC*</label>
                        <input 
                            type="email" 
                            id="pic_email" 
                            name="pic_email" 
                            value={formData.pic_email}
                            onChange={handleChange} 
                            placeholder="email@example.com"
                            required 
                        />
                        {getError('pic_email')}
                    </div>
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Alamat PIC</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_address">Alamat Lengkap*</label>
                        <textarea 
                            id="pic_address" 
                            name="pic_address" 
                            value={formData.pic_address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Jalan, nomor rumah, dll"
                            required 
                        />
                        {getError('pic_address')}
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_rt">RT* (max 3 digit)</label>
                            <input 
                                type="text" 
                                id="pic_rt" 
                                name="pic_rt" 
                                value={formData.pic_rt}
                                onChange={handleChange}
                                maxLength="3"
                                placeholder="001"
                                required 
                            />
                            {getError('pic_rt')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_rw">RW* (max 3 digit)</label>
                            <input 
                                type="text" 
                                id="pic_rw" 
                                name="pic_rw" 
                                value={formData.pic_rw}
                                onChange={handleChange}
                                maxLength="3"
                                placeholder="001"
                                required 
                            />
                            {getError('pic_rw')}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_district">Kecamatan*</label>
                        <input 
                            type="text" 
                            id="pic_district" 
                            name="pic_district" 
                            value={formData.pic_district}
                            onChange={handleChange} 
                            required 
                        />
                        {getError('pic_district')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_city">Kota/Kabupaten*</label>
                        <input 
                            type="text" 
                            id="pic_city" 
                            name="pic_city" 
                            value={formData.pic_city}
                            onChange={handleChange} 
                            required 
                        />
                        {getError('pic_city')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_province">Provinsi*</label>
                        <input 
                            type="text" 
                            id="pic_province" 
                            name="pic_province" 
                            value={formData.pic_province}
                            onChange={handleChange} 
                            required 
                        />
                        {getError('pic_province')}
                    </div>
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Dokumen Identitas PIC</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_ktp_number">No. KTP PIC* (max 20 digit)</label>
                        <input 
                            type="text" 
                            id="pic_ktp_number" 
                            name="pic_ktp_number" 
                            value={formData.pic_ktp_number}
                            onChange={handleChange}
                            maxLength="20"
                            placeholder="16 digit nomor KTP"
                            required 
                        />
                        {getError('pic_ktp_number')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_photo">Foto PIC (Opsional, max 2MB)</label>
                        <input 
                            type="file" 
                            id="pic_photo" 
                            name="pic_photo" 
                            onChange={(e) => setPicPhoto(e.target.files[0])} 
                            accept="image/*" 
                        />
                        <small className={styles.helpText}>Format: JPG, PNG, GIF. Maksimal 2MB</small>
                        {getError('pic_photo')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_ktp_file">File KTP* (max 5MB)</label>
                        <input 
                            type="file" 
                            id="pic_ktp_file" 
                            name="pic_ktp_file" 
                            onChange={(e) => setPicKtpFile(e.target.files[0])} 
                            accept="image/*,application/pdf" 
                            required 
                        />
                        <small className={styles.helpText}>Format: JPG, PNG, PDF. Maksimal 5MB</small>
                        {getError('pic_ktp_file')}
                    </div>
                </fieldset>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Mengirim...' : 'Registrasi Penjual'}
                    </button>
                    <button type="button" className={styles.cancelButton} disabled={isLoading}>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegistrasiForm;