import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
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
            >
                <div className={styles.rectangle}>
                    {imageUrl ? (
                        <>
                            <img 
                                src={imageUrl} 
                                alt={product.name}
                                className={styles.productImage}
                            />
                            {/* Image Counter and Navigation - Show on hover if multiple images */}
                            {images.length > 1 && isHovering && (
                                <>
                                    <div className={styles.imageDots}>
                                        {images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`${styles.dot} ${idx === currentImageIndex ? styles.activeDot : ''}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.noImage}>No Image</div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productPrice}>{formatPrice(product.price)}</div>
                
                {/* Rating */}
                <div className={styles.ratingContainer}>
                    <svg className={styles.starIcon} width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFC107"/>
                    </svg>
                    <span className={styles.ratingText}>{rating}</span>
                    <span className={styles.ratingCount}>({ratingCount})</span>
                </div>

                {/* Store Name dengan Badge Verified */}
                <div className={styles.sellerContainer}>
                    <div className={styles.storeNameBadge}>
                        <span className={styles.sellerName}>{storeName}</span>
                        <span className={styles.verifiedBadge}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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