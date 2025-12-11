import React, { useState } from 'react';
import styles from './ReviewModal.module.css';
import { locations } from '../../Data/locations';
import axios from 'axios';
import { useToast } from '../Common/ToastContext';
import CustomSelect from '../Common/CustomSelect';

const ReviewModal = ({ isOpen, onClose, product, onReviewSubmitted }) => {
  const { showSuccess, showError } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(false);

  const cities = province ? locations[province] || [] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!rating) {
      setError('Pilih rating terlebih dahulu');
      return;
    }
    if (!comment.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }
    if (!name.trim() || !phone.trim() || !email.trim() || !province || !city) {
      setError('Semua field harus diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/reviews', {
        product_id: product.id,
        rating,
        comment,
        reviewer_name: name,
        reviewer_phone: phone,
        reviewer_email: email,
        reviewer_province: province,
        reviewer_city: city
      });

      // Reset form
      setRating(0);
      setComment('');
      setName('');
      setPhone('');
      setEmail('');
      setProvince('');
      setCity('');
      
      // Show success toast notification
      showSuccess('Terima kasih! Review Anda berhasil dikirim. Silakan cek email Anda.', 5000);
      onClose();
      
      // Callback untuk refresh data tanpa reload
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mengirim review. Silakan coba lagi.';
      setError(errorMessage);
      // Durasi lebih panjang untuk pesan error yang lebih panjang
      showError(errorMessage, 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getRatingLabel = (rating) => {
    if (rating === 5) return 'Sangat Baik';
    if (rating === 4) return 'Baik';
    if (rating === 3) return 'Cukup';
    if (rating === 2) return 'Kurang';
    if (rating === 1) return 'Buruk';
    return '';
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="review-modal-title" aria-modal="true">
        <div className={styles.header}>
          <div>
            <h2 id="review-modal-title">Tulis Ulasan Produk</h2>
            <p className={styles.headerSubtitle}>Bagikan pengalaman kamu dengan pembeli lain</p>
          </div>
          <button 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Tutup modal ulasan"
            title="Tekan ESC atau klik untuk tutup"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.contentWrapper}>
            {/* Kolom Kiri - Foto Produk */}
            <div className={styles.leftColumn}>
              <div className={styles.productImageWrapper}>
                <img 
                  src={product.images?.[0]?.image_url || '/placeholder.jpg'} 
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
            </div>

            {/* Kolom Tengah - Form */}
            <div className={styles.centerColumn}>
              <p className={styles.sellerInfo}>Penjual : {product.seller?.store_name || 'Toko'}</p>
              <div className={styles.productName}>{product.name}</div>

              <div className={styles.ratingSection}>
                <p className={styles.ratingLabel}>Bagaimana kualitas produk ini menurut Anda?</p>
                <div className={styles.starsContainer}>
                  <div className={styles.stars} role="group" aria-label="Rating bintang">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                        onClick={() => setRating(star)}
                        aria-pressed={rating >= star}
                        aria-label={`${star} bintang`}
                        title={`Beri rating ${star} bintang - ${['Buruk', 'Kurang', 'Cukup', 'Baik', 'Sangat Baik'][star - 1]}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className={styles.ratingText} role="status" aria-live="polite">
                      {getRatingLabel(rating)}
                    </span>
                  )}
                </div>
                {!rating && <span className={styles.requiredFeedback} role="alert">Rating diperlukan</span>}
              </div>

              <div className={styles.commentSection}>
                <label htmlFor="comment-input">Berikan komentar untuk produk ini:</label>
                <div className={styles.commentInputWrapper}>
                  <textarea
                    id="comment-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    placeholder="Jelaskan pengalaman Anda dengan produk ini..."
                    rows={4}
                    aria-describedby="comment-helper"
                    required
                  />
                  <div className={styles.commentHelper} id="comment-helper">
                    <span className={comment.length > 450 ? styles.warningText : ''}>
                      {comment.length}/500 karakter
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.biodataSection}>
                <h3>Biodata Pengulas</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name-input">Nama Lengkap:</label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  aria-required="true"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="province-input">Provinsi Asal:</label>
                <CustomSelect
                  id="province-input"
                  value={province}
                  onChange={(value) => {
                    setProvince(value);
                    setCity('');
                  }}
                  options={Object.keys(locations)}
                  placeholder="Pilih Provinsi"
                  aria-required="true"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone-input">Nomor HP:</label>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  aria-required="true"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city-input">Kota / Kabupaten Asal:</label>
                <CustomSelect
                  id="city-input"
                  value={city}
                  onChange={setCity}
                  options={cities}
                  placeholder="Pilih Kabupaten/Kota"
                  disabled={!province}
                  aria-required="true"
                  required
                  aria-label={province ? undefined : 'Pilih provinsi terlebih dahulu'}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email-input">Email:</label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: nama@email.com"
                  aria-describedby="email-hint"
                  aria-required="true"
                  required
                />
                <span className={styles.fieldHint} id="email-hint">Kami akan mengirim pemberitahuan ke email ini</span>
              </div>
              <div className={styles.formGroup}></div>
            </div>
              </div>
            </div>

            {/* Kolom Kanan - Tips */}
            <div className={styles.rightColumn}>
              <div 
                className={`${styles.tipsBox} ${showTips ? styles.tipsBoxExpanded : ''}`}
                onClick={() => setShowTips(!showTips)}
              >
                <div className={styles.tipsHeader}>
                  <h4>Tips Menulis Ulasan</h4>
                  <span className={styles.tipsToggle}>{showTips ? '▼' : '▶'}</span>
                </div>
                <div className={`${styles.tipsContent} ${showTips ? styles.tipsContentShow : ''}`}>
                  <ul>
                    <li>Berikan penilaian yang jujur</li>
                    <li>Jelaskan kelebihan dan kekurangan produk</li>
                    <li>Sertakan detail pengalaman Anda</li>
                    <li>Gunakan bahasa yang sopan</li>
                    <li>Hindari kata-kata kasar atau SARA</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert" aria-live="assertive">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{flexShrink: 0}}>
                <circle cx="10" cy="10" r="9" stroke="#DC2626" strokeWidth="2"/>
                <path d="M10 6v4M10 14h.01" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.footer}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Batal dan tutup modal"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting || !rating || !comment.trim()}
              aria-label={isSubmitting ? 'Sedang mengirim review' : 'Kirim review'}
            >
              {isSubmitting ? (
                <span className={styles.loadingWrapper}>
                  <span className={styles.spinner} aria-hidden="true"></span>
                  Mengirim Review...
                </span>
              ) : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
