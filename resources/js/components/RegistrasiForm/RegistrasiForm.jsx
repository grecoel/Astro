
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrasiForm.module.css';
import { locations } from '../../Data/locations';
import loginIllustration from '../Public/images/login-illustration.png';
import CustomSelect from '../Common/CustomSelect';
import { useToast } from '../Common/ToastContext';

const API_URL = '/api/sellers';

function RegistrasiForm() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
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

    const [availableCities, setAvailableCities] = useState([]);
    const [picPhoto, setPicPhoto] = useState(null);
    const [picPhotoPreview, setPickPhotoPreview] = useState(null);
    const [picKtpFile, setPicKtpFile] = useState(null);
    const [picKtpPreview, setPickKtpPreview] = useState(null);
    const [dragOverPhoto, setDragOverPhoto] = useState(false);
    const [dragOverKtp, setDragOverKtp] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            pic_province: selectedProvince,
            pic_city: ''
        }));
        
        if (selectedProvince && locations[selectedProvince]) {
            setAvailableCities(locations[selectedProvince]);
        } else {
            setAvailableCities([]);
        }
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            pic_city: selectedCity 
        }));
    };

    // File Upload Handlers
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showError('File harus berupa gambar (JPG, PNG, dll)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showError('Ukuran file foto maksimal 2MB');
                return;
            }
            setPicPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPickPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKtpChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                showError('File KTP harus berupa gambar atau PDF');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showError('Ukuran file KTP maksimal 5MB');
                return;
            }
            setPicKtpFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPickKtpPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag & Drop Handlers for Photo
    const handlePhotoDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPhoto(true);
    };

    const handlePhotoDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPhoto(false);
    };

    const handlePhotoDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPhoto(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                showError('File harus berupa gambar (JPG, PNG, dll)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showError('Ukuran file foto maksimal 2MB');
                return;
            }
            setPicPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPickPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag & Drop Handlers for KTP
    const handleKtpDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverKtp(true);
    };

    const handleKtpDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverKtp(false);
    };

    const handleKtpDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverKtp(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                showError('File KTP harus berupa gambar atau PDF');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showError('Ukuran file KTP maksimal 5MB');
                return;
            }
            setPicKtpFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPickKtpPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep = () => {
        const newErrors = {};
        
        if (currentStep === 1) {
            if (!formData.store_name.trim()) {
                newErrors.store_name = ['Nama toko harus diisi'];
            } else if (formData.store_name.trim().length < 3) {
                newErrors.store_name = ['Nama toko minimal 3 karakter'];
            } else if (formData.store_name.trim().length > 100) {
                newErrors.store_name = ['Nama toko maksimal 100 karakter'];
            }
        } else if (currentStep === 2) {
            if (!formData.pic_name.trim()) {
                newErrors.pic_name = ['Nama lengkap PIC harus diisi'];
            } else if (formData.pic_name.trim().length < 3) {
                newErrors.pic_name = ['Nama minimal 3 karakter'];
            }
            if (!formData.pic_phone.trim()) {
                newErrors.pic_phone = ['No. HP PIC harus diisi'];
            } else if (!/^08\d{8,11}$/.test(formData.pic_phone)) {
                newErrors.pic_phone = ['Format: 08xxxxxxxxxx (8-13 digit, dimulai dengan 08)'];
            }
            if (!formData.pic_email.trim()) {
                newErrors.pic_email = ['Email PIC harus diisi'];
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.pic_email)) {
                newErrors.pic_email = ['Format email tidak valid. Contoh: nama@email.com'];
            }
        } else if (currentStep === 3) {
            if (!formData.pic_address.trim()) {
                newErrors.pic_address = ['Alamat lengkap harus diisi'];
            } else if (formData.pic_address.trim().length < 10) {
                newErrors.pic_address = ['Alamat minimal 10 karakter untuk kelengkapan'];
            }
            if (!formData.pic_rt.trim()) {
                newErrors.pic_rt = ['RT harus diisi'];
            } else if (!/^\d{1,3}$/.test(formData.pic_rt)) {
                newErrors.pic_rt = ['RT harus berupa angka 1-3 digit'];
            }
            if (!formData.pic_rw.trim()) {
                newErrors.pic_rw = ['RW harus diisi'];
            } else if (!/^\d{1,3}$/.test(formData.pic_rw)) {
                newErrors.pic_rw = ['RW harus berupa angka 1-3 digit'];
            }
            if (!formData.pic_province) {
                newErrors.pic_province = ['Provinsi harus dipilih'];
            }
            if (!formData.pic_city) {
                newErrors.pic_city = ['Kota/Kabupaten harus dipilih'];
            }
            if (!formData.pic_district.trim()) {
                newErrors.pic_district = ['Kecamatan harus diisi'];
            }
        }
        
        return newErrors;
    };

    const handleNext = (e) => {
        e.preventDefault();
        
        const validationErrors = validateStep();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Focus on first error field for accessibility
            const firstErrorField = Object.keys(validationErrors)[0];
            const errorElement = document.getElementById(firstErrorField);
            if (errorElement) {
                errorElement.focus();
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        setCurrentStep(currentStep + 1);
        setErrors({});
        // Scroll to top of card content
        const cardContent = document.querySelector(`.${styles.cardContent}`);
        if (cardContent) {
            cardContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
        // Scroll to top of card content
        const cardContent = document.querySelector(`.${styles.cardContent}`);
        if (cardContent) {
            cardContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate step 4 (KTP)
        if (!formData.pic_ktp_number.trim()) {
            showError('Nomor KTP harus diisi');
            return;
        }
        if (!/^\d{16}$/.test(formData.pic_ktp_number)) {
            showError('Nomor KTP harus 16 digit angka');
            return;
        }
        if (!picKtpFile) {
            showError('File KTP harus diupload');
            return;
        }
        
        setIsLoading(true);
        setErrors({});

        const data = new FormData();
        
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        
        if (picPhoto) data.append('pic_photo', picPhoto);
        if (picKtpFile) data.append('pic_ktp_file', picKtpFile);

        try {
            const response = await axios.post(API_URL, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('Registration successful:', response.data);
            showSuccess('Registrasi berhasil! Akun Anda sedang dalam proses verifikasi. Cek email Anda untuk aktivasi.');
            
            // Redirect to login after short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                setErrors(errors);
                
                // Show first error in toast
                const firstError = Object.values(errors)[0];
                const errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                showError(errorMsg);
                
                // Focus on first error field
                const firstErrorField = Object.keys(errors)[0];
                const errorElement = document.getElementById(firstErrorField);
                if (errorElement) {
                    errorElement.focus();
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (error.response?.status === 409) {
                showError('Email atau nomor HP sudah terdaftar. Silakan gunakan yang lain.');
            } else if (error.response?.status === 413) {
                showError('Ukuran file terlalu besar. Kompres file dan coba lagi.');
            } else if (error.code === 'ERR_NETWORK') {
                showError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
            } else {
                const errorMsg = error.response?.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.';
                showError(errorMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getError = (field) => errors[field] ? (
        <span className={styles.errorText}>{errors[field][0]}</span>
    ) : null;

    const getStepTitle = () => {
        switch(currentStep) {
            case 1: return 'Data Toko';
            case 2: return 'Data PIC';
            case 3: return 'Alamat PIC';
            case 4: return 'Dokumen Identitas';
            default: return 'Registrasi Penjual';
        }
    };

    const renderStepContent = () => {
        if (currentStep === 1) {
            return (
                <>
                    <div className={styles.formGroup}>
                        <label htmlFor="store_name">
                            Nama Toko <span className={styles.required}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="store_name" 
                            name="store_name" 
                            value={formData.store_name}
                            onChange={handleChange} 
                            placeholder="Contoh: Toko Elektronik Jaya"
                            required
                            maxLength="100"
                            aria-required="true"
                            aria-describedby="store_name-hint"
                        />
                        <small id="store_name-hint" className={styles.hint}>
                            {formData.store_name.length}/100 karakter (minimal 3 karakter)
                        </small>
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
                            placeholder="Ceritakan tentang produk yang Anda jual dan keunggulan toko Anda"
                            maxLength="500"
                            aria-describedby="store_description-hint"
                        />
                        <small id="store_description-hint" className={styles.hint}>
                            {formData.store_description.length}/500 karakter (opsional)
                        </small>
                        {getError('store_description')}
                    </div>
                </>
            );
        }
        
        if (currentStep === 2) {
            return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_name">
                                Nama Lengkap PIC <span className={styles.required}>*</span>
                            </label>
                            <input 
                                type="text" 
                                id="pic_name" 
                                name="pic_name" 
                                value={formData.pic_name}
                                onChange={handleChange}
                                placeholder="Contoh: Ahmad Fauzi"
                                required
                                aria-required="true"
                                aria-describedby="pic_name-hint"
                            />
                            <small id="pic_name-hint" className={styles.hint}>
                                PIC (Person In Charge) adalah penanggung jawab toko
                            </small>
                            {getError('pic_name')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_phone">
                                No. HP PIC <span className={styles.required}>*</span>
                            </label>
                            <input 
                                type="tel" 
                                id="pic_phone" 
                                name="pic_phone" 
                                value={formData.pic_phone}
                                onChange={handleChange} 
                                maxLength="13"
                                placeholder="081234567890"
                                required
                                aria-required="true"
                                aria-describedby="pic_phone-hint"
                            />
                            <small id="pic_phone-hint" className={styles.hint}>
                                Format: 08xxxxxxxxxx (8-13 digit, dimulai dengan 08)
                            </small>
                            {getError('pic_phone')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_email">
                                Email PIC <span className={styles.required}>*</span>
                            </label>
                            <input 
                                type="email" 
                                id="pic_email" 
                                name="pic_email" 
                                value={formData.pic_email}
                                onChange={handleChange}
                                placeholder="contoh@email.com"
                                required
                                autoComplete="email"
                                aria-required="true"
                                aria-describedby="pic_email-hint"
                            />
                            <small id="pic_email-hint" className={styles.hint}>
                                Email akan digunakan untuk login dan notifikasi
                            </small>
                            {getError('pic_email')}
                        </div>
                    </>
                );
        }
        
        if (currentStep === 3) {
            return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_address">
                                Alamat Lengkap <span className={styles.required}>*</span>
                            </label>
                            <textarea 
                                id="pic_address" 
                                name="pic_address" 
                                value={formData.pic_address}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Contoh: Jalan Merdeka No. 123"
                                required
                                maxLength="200"
                                aria-required="true"
                                aria-describedby="pic_address-hint"
                            />
                            <small id="pic_address-hint" className={styles.hint}>
                                {formData.pic_address.length}/200 karakter (minimal 10 karakter untuk kelengkapan)
                            </small>
                            {getError('pic_address')}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="pic_rt">
                                    RT <span className={styles.required}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="pic_rt" 
                                    name="pic_rt" 
                                    value={formData.pic_rt}
                                    onChange={handleChange}
                                    maxLength="3"
                                    placeholder="001"
                                    required
                                    aria-required="true"
                                />
                                {getError('pic_rt')}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="pic_rw">
                                    RW <span className={styles.required}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="pic_rw" 
                                    name="pic_rw" 
                                    value={formData.pic_rw}
                                    onChange={handleChange}
                                    maxLength="3"
                                    placeholder="001"
                                    required
                                    aria-required="true"
                                />
                                {getError('pic_rw')}
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_province">
                                Provinsi <span className={styles.required}>*</span>
                            </label>
                            <CustomSelect
                                value={formData.pic_province}
                                onChange={(value) => {
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        pic_province: value,
                                        pic_city: ''
                                    }));
                                    if (value && locations[value]) {
                                        setAvailableCities(locations[value]);
                                    } else {
                                        setAvailableCities([]);
                                    }
                                }}
                                options={Object.keys(locations)}
                                placeholder="Pilih Provinsi"
                                required={true}
                                error={!!errors.pic_province}
                            />
                            {getError('pic_province')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_city">
                                Kota/Kabupaten <span className={styles.required}>*</span>
                            </label>
                            <CustomSelect
                                value={formData.pic_city}
                                onChange={(value) => {
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        pic_city: value 
                                    }));
                                }}
                                options={availableCities}
                                placeholder="Pilih Kota/Kabupaten"
                                disabled={!formData.pic_province}
                                required={true}
                                error={!!errors.pic_city}
                            />
                            <small className={styles.hint}>
                                {!formData.pic_province && 'Pilih provinsi terlebih dahulu'}
                            </small>
                            {getError('pic_city')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_district">Kecamatan*</label>
                            <input 
                                type="text" 
                                id="pic_district" 
                                name="pic_district" 
                                value={formData.pic_district}
                                onChange={handleChange}
                                placeholder="Masukkan kecamatan"
                                required 
                            />
                            {getError('pic_district')}
                        </div>
                    </>
                );
        }
        
        if (currentStep === 4) {
            return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_ktp_number">Nomor KTP* (16 digit)</label>
                            <input 
                                type="text" 
                                id="pic_ktp_number" 
                                name="pic_ktp_number" 
                                value={formData.pic_ktp_number}
                                onChange={handleChange}
                                maxLength="20"
                                placeholder="Masukkan 16 digit nomor KTP"
                                required 
                            />
                            {getError('pic_ktp_number')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_photo">Foto PIC (Opsional, max 2MB)</label>
                            <div 
                                className={`${styles.dragDropZone} ${dragOverPhoto ? styles.dragOver : ''}`}
                                onDragOver={handlePhotoDragOver}
                                onDragLeave={handlePhotoDragLeave}
                                onDrop={handlePhotoDrop}
                            >
                                <input 
                                    type="file" 
                                    id="pic_photo" 
                                    name="pic_photo" 
                                    onChange={handlePhotoChange} 
                                    accept="image/*"
                                    className={styles.fileInput}
                                />
                                <label htmlFor="pic_photo" className={styles.dragDropLabel}>
                                    {picPhotoPreview ? (
                                        <>
                                            <img src={picPhotoPreview} alt="Foto Preview" className={styles.dragDropPreview} />
                                            <p>Ubah Foto</p>
                                        </>
                                    ) : (
                                        <>
                                            <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className={styles.dragDropTitle}>Klik untuk upload foto</p>
                                            <p className={styles.dragDropSubtitle}>atau drag & drop di sini</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_ktp_file">File KTP* (max 5MB)</label>
                            <div 
                                className={`${styles.dragDropZone} ${dragOverKtp ? styles.dragOver : ''}`}
                                onDragOver={handleKtpDragOver}
                                onDragLeave={handleKtpDragLeave}
                                onDrop={handleKtpDrop}
                            >
                                <input 
                                    type="file" 
                                    id="pic_ktp_file" 
                                    name="pic_ktp_file" 
                                    onChange={handleKtpChange} 
                                    accept="image/*,application/pdf"
                                    className={styles.fileInput}
                                    required 
                                />
                                <label htmlFor="pic_ktp_file" className={styles.dragDropLabel}>
                                    {picKtpPreview ? (
                                        <>
                                            <img src={picKtpPreview} alt="KTP Preview" className={styles.dragDropPreview} />
                                            <p>Ubah File KTP</p>
                                        </>
                                    ) : (
                                        <>
                                            <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className={styles.dragDropTitle}>Klik untuk upload KTP</p>
                                            <p className={styles.dragDropSubtitle}>atau drag & drop di sini</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </>
                );
        }
        
        return null;
    };

    return (
        <>
            <div className={styles.bgWhite} />
            <div className={styles.bgGreen} />
            
            {/* Illustration on the right */}
            <div className={styles.illustrationWrapper}>
                <img
                    src={loginIllustration}
                    alt="Shopping Illustration"
                    className={styles.illustration}
                />
            </div>
            <div className={styles.floorLine} />
            
            <div className={styles.card}>
                <div className={styles.cardContent}>
                    <div className={styles.logoContainer}>
                        <h1 className={styles.logo}>AstroEcomm.</h1>
                    </div>
                    
                    <p className={styles.greeting}>Bergabunglah bersama kami!</p>
                    <h2 className={styles.title}>{getStepTitle()}</h2>

                    <div className={styles.stepIndicator} role="navigation" aria-label="Progress indicator">
                        <div className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : ''}`} aria-current={currentStep === 1 ? 'step' : undefined}>1</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : ''}`} aria-current={currentStep === 2 ? 'step' : undefined}>2</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 3 ? styles.stepActive : ''}`} aria-current={currentStep === 3 ? 'step' : undefined}>3</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 4 ? styles.stepActive : ''}`} aria-current={currentStep === 4 ? 'step' : undefined}>4</div>
                    </div>

                    <form id="registrationForm" onSubmit={currentStep === 4 ? handleSubmit : handleNext} className={styles.form} noValidate>
                        {renderStepContent()}
                        
                        {/* Golden Rules: Keyboard shortcut hint */}
                        <small className={styles.keyboardHint}>
                            Tekan Enter untuk {currentStep === 4 ? 'submit' : 'lanjut'}
                        </small>
                    </form>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.buttonGroup}>
                        {currentStep === 1 ? (
                            <button 
                                type="button" 
                                className={styles.backButton} 
                                onClick={() => navigate('/')}
                                aria-label="Batalkan registrasi dan kembali ke halaman utama"
                            >
                                Batal
                            </button>
                        ) : currentStep > 1 && (
                            <button 
                                type="button" 
                                className={styles.backButton} 
                                onClick={handlePrev}
                                aria-label={`Kembali ke step ${currentStep - 1}`}
                            >
                                Kembali
                            </button>
                        )}
                        <button 
                            type="submit" 
                            form="registrationForm"
                            onClick={currentStep === 4 ? handleSubmit : handleNext}
                            className={styles.submitButton}
                            disabled={isLoading}
                            aria-busy={isLoading}
                            aria-label={currentStep === 4 ? 'Submit registrasi' : `Lanjut ke step ${currentStep + 1}`}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner} aria-hidden="true"></span>
                                    <span>Memproses...</span>
                                </>
                            ) : currentStep === 4 ? 'Daftar' : 'Berikutnya'}
                        </button>
                    </div>

                    <p className={styles.signupPrompt}>
                        <span className={styles.signupPromptText}>Sudah punya akun?</span>
                        <span className={styles.signupPromptSpace}>&nbsp;</span>
                        <span className={styles.signupPromptLink} onClick={() => navigate('/login')}>Login yuk!</span>
                    </p>
                </div>
            </div>

        </>
    );
}

export default RegistrasiForm;
