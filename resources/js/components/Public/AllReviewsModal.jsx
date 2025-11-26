import React, { useState } from 'react';
import styles from './AllReviewsModal.module.css';

const AllReviewsModal = ({ isOpen, onClose, product, stats, type = 'all' }) => {
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  if (!isOpen) return null;

  const StarIcon = ({ size = 15, fill = "#FDB813" }) => (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill={fill}/>
    </svg>
  );

  const getBarWidth = (star) => {
    const count = stats[star] || 0;
    const total = product.reviews.length || 1;
    return `${(count / total) * 100}%`;
  };

  const getRatingAvg = () => {
    if (!product.rating_avg) return '0.0';
    const ratingNum = typeof product.rating_avg === 'string' 
      ? parseFloat(product.rating_avg) 
      : product.rating_avg;
    return isNaN(ratingNum) ? '0.0' : ratingNum.toFixed(1);
  };

  const getSatisfactionRate = () => {
    const total = product.reviews.length || 0;
    if (total === 0) return 0;
    const satisfied = (stats[5] || 0) + (stats[4] || 0);
    return Math.round((satisfied / total) * 100);
  };

  const filteredReviews = filter === 'all' 
    ? product.reviews 
    : product.reviews.filter(r => r.rating === parseInt(filter));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{type === 'ratings' ? 'Semua Rating' : 'Semua Ulasan'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.contentWrapper}>
          {/* Sidebar Kiri - Rating Summary */}
          <div className={styles.sidebar}>
            <div className={styles.ratingBig}>
              <div className={styles.ratingScore}>
                <StarIcon size={40} />
                <span className={styles.scoreNumber}>{getRatingAvg()}</span>
                <span className={styles.scoreMax}>dari 5.0</span>
              </div>
              <div className={styles.ratingInfo}>
                {product.reviews.length > 0 ? (
                  <>
                    {getSatisfactionRate()}% pembeli merasa puas<br/>
                    {product.reviews.length} ulasan
                  </>
                ) : (
                  <>Belum ada penilaian</>
                )}
              </div>
            </div>

            {/* Rating Bars */}
            <div className={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map(star => (
                <div 
                  key={star} 
                  className={`${styles.barRow} ${filter === star.toString() ? styles.barRowActive : ''}`}
                  onClick={() => setFilter(star.toString())}
                >
                  <span className={styles.barLabel}>
                    <StarIcon size={12} />{star}
                  </span>
                  <div className={styles.progressBg}>
                    <div className={styles.progressFill} style={{width: getBarWidth(star)}}></div>
                  </div>
                  <span className={styles.barCount}>({stats[star] || 0})</span>
                </div>
              ))}
            </div>

            {filter !== 'all' && (
              <button className={styles.resetFilter} onClick={() => setFilter('all')}>
                Lihat Semua Rating
              </button>
            )}
          </div>

          {/* Content Kanan - Reviews List */}
          <div className={styles.reviewsContent}>
            <div className={styles.reviewsHeader}>
              <span>{filteredReviews.length} ulasan {filter !== 'all' ? `(${filter} bintang)` : ''}</span>
            </div>

            <div className={styles.reviewsList}>
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <div className={styles.reviewerName}>{review.reviewer_name}</div>
                        <div className={styles.reviewerLocation}>
                          {review.reviewer_city}, {review.reviewer_province}
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            size={14} 
                            fill={i < review.rating ? "#FDB813" : "#e0e0e0"} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className={styles.reviewText}>{review.comment}</div>
                    <div className={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Tidak ada ulasan {filter !== 'all' ? `dengan ${filter} bintang` : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewsModal;
