import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const carouselIntervalRef = useRef(null);

    const formatPrice = (price) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
    };

    // Get images array - try different possible properties
    const images = product.images && Array.isArray(product.images) ? product.images : [];
    const currentImage = images[currentImageIndex];
    const imageUrl = currentImage?.image_url || currentImage?.image_full_url || product.thumbnail_url;
    
    const rating = product.rating_avg ? parseFloat(product.rating_avg).toFixed(1) : '0.0';
    const ratingCount = product.rating_count || 0;
    const storeName = product.seller?.store_name || 'Unknown Store';

    // Auto-carousel on hover
    useEffect(() => {
        if (isHovering && images.length > 1) {
            carouselIntervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1200); // Change image every 1200ms (slower)
        }
        return () => {
            if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
        };
    }, [isHovering, images.length]);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setCurrentImageIndex(0); // Reset to first image
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <Link to={`/product/${product.id}`} className={styles.productCard}>
            {/* Product Image */}
            <div 
                className={styles.productImageContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="img"
                aria-label={`Foto produk ${product.name}`}
            >
                <div className={styles.rectangle}>
                    {imageUrl && !imageError ? (
                        <>
                            {/* Loading skeleton */}
                            {imageLoading && (
                                <div className={styles.imageSkeleton} aria-hidden="true">
                                    <div className={styles.skeletonShimmer}></div>
                                </div>
                            )}
                            <img 
                                src={imageUrl} 
                                alt={product.name}
                                className={`${styles.productImage} ${imageLoading ? styles.imageHidden : ''}`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                                loading="lazy"
                            />
                            {/* Image Counter and Navigation - Show on hover if multiple images */}
                            {images.length > 1 && isHovering && !imageLoading && (
                                <>
                                    <div className={styles.imageDots} role="tablist" aria-label="Foto produk">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                role="tab"
                                                aria-selected={idx === currentImageIndex}
                                                aria-label={`Foto ${idx + 1} dari ${images.length}`}
                                                className={`${styles.dot} ${idx === currentImageIndex ? styles.activeDot : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCurrentImageIndex(idx);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {images.length > 1 && (
                                        <div className={styles.imageCounter} aria-live="polite">
                                            {currentImageIndex + 1}/{images.length}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.noImage} role="img" aria-label="Gambar tidak tersedia">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" strokeWidth="1.5"/>
                                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                                <path d="M3 15L7 11L10 14L14 10L21 17V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15Z" fill="#E5E7EB"/>
                            </svg>
                            <span>Gambar tidak tersedia</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfo}>
                <h3 className={styles.productName} title={product.name}>{product.name}</h3>
                <div className={styles.productPrice} aria-label={`Harga ${formatPrice(product.price)}`}>
                    {formatPrice(product.price)}
                </div>
                
                {/* Rating with accessibility */}
                <div className={styles.ratingContainer} role="img" aria-label={`Rating ${rating} dari 5 berdasarkan ${ratingCount} ulasan`}>
                    <svg className={styles.starIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFC107"/>
                    </svg>
                    <span className={styles.ratingText}>{rating}</span>
                    <span className={styles.ratingCount} aria-label={`${ratingCount} ulasan`}>({ratingCount})</span>
                </div>

                {/* Store Name dengan Badge Verified */}
                <div className={styles.sellerContainer}>
                    <div className={styles.storeNameBadge}>
                        <span className={styles.sellerName} title={storeName}>{storeName}</span>
                        <span className={styles.verifiedBadge} role="img" aria-label="Toko terverifikasi" title="Toko terverifikasi">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="12" cy="12" r="11" fill="#AD7BFF"/>
                                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;