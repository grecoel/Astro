
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
                alert('Terjadi kesalahan pada server.');
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
                        <input type="text" id="store_name" name="store_name" onChange={handleChange} required />
                        {getError('store_name')}
                    </div>
                    {/* ... (input deskripsi singkat) ... */}
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Data PIC</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_name">Nama PIC*</label>
                        <input type="text" id="pic_name" name="pic_name" onChange={handleChange} required />
                        {getError('pic_name')}
                    </div>
                    {/* ... (input no HP & email) ... */}
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Alamat PIC</legend>
                    {/* ... (semua input alamat: jalan, rt, rw, dll) ... */}
                </fieldset>

                <fieldset className={styles.formSection}>
                    <legend>Dokumen Identitas PIC</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_ktp_number">No. KTP PIC*</label>
                        <input type="text" id="pic_ktp_number" name="pic_ktp_number" onChange={handleChange} required />
                        {getError('pic_ktp_number')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_photo">Foto PIC (≤2MB)</label>
                        <input type="file" id="pic_photo" name="pic_photo" onChange={(e) => setPicPhoto(e.target.files[0])} accept="image/*" />
                        {getError('pic_photo')}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="pic_ktp_file">File KTP (≤5MB)*</label>
                        <input type="file" id="pic_ktp_file" name="pic_ktp_file" onChange={(e) => setPicKtpFile(e.target.files[0])} accept="image/*,application/pdf" required />
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