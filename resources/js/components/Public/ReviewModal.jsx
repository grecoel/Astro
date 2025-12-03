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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Ulasan</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
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
                <p className={styles.ratingLabel}>Bagaimana kualitas produk ini menurut anda?</p>
                <div className={styles.starsContainer}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && <span className={styles.ratingText}>{getRatingLabel(rating)}</span>}
                </div>
              </div>

              <div className={styles.commentSection}>
                <label>Berikan komentar untuk produk ini:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder=""
                  rows={4}
                  required
                />
              </div>

              <div className={styles.biodataSection}>
                <h3>Biodata Pengulas</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nama:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Provinsi Asal:</label>
                <CustomSelect
                  value={province}
                  onChange={(value) => {
                    setProvince(value);
                    setCity('');
                  }}
                  options={Object.keys(locations)}
                  placeholder="Pilih Provinsi"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nomor HP:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Kota / Kabupaten Asal:</label>
                <CustomSelect
                  value={city}
                  onChange={setCity}
                  options={cities}
                  placeholder="Pilih Kabupaten/Kota"
                  disabled={!province}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  required
                />
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

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.footer}>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingWrapper}>
                  <span className={styles.spinner}></span>
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
