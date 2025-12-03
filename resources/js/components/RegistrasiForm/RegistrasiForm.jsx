
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './RegistrasiForm.module.css';
import { locations } from '../../Data/locations';
import loginIllustration from '../Public/images/login-illustration.png';

const API_URL = '/api/sellers';

function RegistrasiForm() {
    const navigate = useNavigate();
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
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('success');
    const [modalMessage, setModalMessage] = useState('');

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
            if (file.size > 2 * 1024 * 1024) {
                alert('File terlalu besar (max 2MB)');
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
            if (file.size > 5 * 1024 * 1024) {
                alert('File terlalu besar (max 5MB)');
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
            if (file.type.startsWith('image/')) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('File terlalu besar (max 2MB)');
                    return;
                }
                setPicPhoto(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPickPhotoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
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
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                if (file.size > 5 * 1024 * 1024) {
                    alert('File terlalu besar (max 5MB)');
                    return;
                }
                setPicKtpFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPickKtpPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
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

            console.log(response.data);
            setModalType('success');
            setModalMessage('Registrasi berhasil! Data Anda sedang diverifikasi.');
            setShowModal(true);

        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                setModalType('error');
                setModalMessage('Registrasi gagal. Cek kembali data yang Anda masukkan.');
                setShowModal(true);
            } else {
                console.error('Server Error:', error);
                setModalType('error');
                setModalMessage(`Terjadi kesalahan pada server: ${error.response?.data?.message || error.message}`);
                setShowModal(true);
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
                        <label htmlFor="store_name">Nama Toko*</label>
                        <input 
                            type="text" 
                            id="store_name" 
                            name="store_name" 
                            value={formData.store_name}
                            onChange={handleChange} 
                            placeholder="Masukkan nama toko"
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
                            placeholder="Ceritakan tentang toko Anda"
                        />
                        {getError('store_description')}
                    </div>
                </>
            );
        }
        
        if (currentStep === 2) {
            return (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_name">Nama Lengkap PIC*</label>
                            <input 
                                type="text" 
                                id="pic_name" 
                                name="pic_name" 
                                value={formData.pic_name}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
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
                    </>
                );
        }
        
        if (currentStep === 3) {
            return (
                    <>
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
                                <label htmlFor="pic_rt">RT*</label>
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
                                <label htmlFor="pic_rw">RW*</label>
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
                            <label htmlFor="pic_province">Provinsi*</label>
                            <select 
                                id="pic_province" 
                                name="pic_province" 
                                value={formData.pic_province}
                                onChange={handleProvinceChange}
                                required
                            >
                                <option value="">Pilih Provinsi</option>
                                {Object.keys(locations).map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                            {getError('pic_province')}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="pic_city">Kota/Kabupaten*</label>
                            <select 
                                id="pic_city" 
                                name="pic_city" 
                                value={formData.pic_city}
                                onChange={handleCityChange}
                                disabled={!formData.pic_province}
                                required
                            >
                                <option value="">Pilih Kota/Kabupaten</option>
                                {availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
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

                    <div className={styles.stepIndicator}>
                        <div className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : ''}`}>1</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : ''}`}>2</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 3 ? styles.stepActive : ''}`}>3</div>
                        <div className={styles.stepLine}></div>
                        <div className={`${styles.step} ${currentStep >= 4 ? styles.stepActive : ''}`}>4</div>
                    </div>

                    <form id="registrationForm" onSubmit={currentStep === 4 ? handleSubmit : handleNext} className={styles.form}>
                        {renderStepContent()}
                    </form>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.buttonGroup}>
                        {currentStep === 1 ? (
                            <button type="button" className={styles.backButton} onClick={() => navigate('/')}>
                                Batal
                            </button>
                        ) : currentStep > 1 && (
                            <button type="button" className={styles.backButton} onClick={handlePrev}>
                                Kembali
                            </button>
                        )}
                        <button 
                            type="submit" 
                            form="registrationForm"
                            onClick={currentStep === 4 ? handleSubmit : handleNext}
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mengirim...' : currentStep === 4 ? 'Daftar Sekarang' : 'Berikutnya'}
                        </button>
                    </div>

                    <p className={styles.signupPrompt}>
                        <span className={styles.signupPromptText}>Sudah punya akun?</span>
                        <span className={styles.signupPromptSpace}>&nbsp;</span>
                        <span className={styles.signupPromptLink} onClick={() => navigate('/login')}>Login yuk!</span>
                    </p>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={`${styles.modal} ${styles[`modal-${modalType}`]}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalIcon + ' ' + (modalType === 'success' ? styles.iconSuccess : styles.iconError)}></div>
                        </div>
                        <div className={styles.modalContent}>
                            <h3>{modalType === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</h3>
                            <p>{modalMessage}</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.modalButton}
                                onClick={() => {
                                    setShowModal(false);
                                    if (modalType === 'success') {
                                        setFormData({
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
                                        setPicPhoto(null);
                                        setPicKtpFile(null);
                                    }
                                }}
                            >
                                {modalType === 'success' ? 'Tutup' : 'Coba Lagi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RegistrasiForm;
