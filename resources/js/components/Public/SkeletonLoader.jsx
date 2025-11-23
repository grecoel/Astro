import React from 'react';
import styles from './SkeletonLoader.module.css';

export const BannerSkeleton = () => (
    <div className={styles.bannerSkeleton}>
        <div className={styles.shimmer}></div>
    </div>
);

export const CategorySkeleton = () => (
    <div className={styles.categorySkeleton}>
        <div className={styles.categoryTitle}></div>
        <div className={styles.categoryItems}>
            {[...Array(8)].map((_, i) => (
                <div key={i} className={styles.categoryItem}>
                    <div className={styles.shimmer}></div>
                </div>
            ))}
        </div>
    </div>
);

export const ProductGridSkeleton = ({ count = 24 }) => (
    <div className={styles.productGridSkeleton}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className={styles.productCardSkeleton}>
                <div className={styles.productImage}>
                    <div className={styles.shimmer}></div>
                </div>
                <div className={styles.productInfo}>
                    <div className={styles.productTitle}></div>
                    <div className={styles.productPrice}></div>
                    <div className={styles.productMeta}>
                        <div className={styles.productRating}></div>
                        <div className={styles.productLocation}></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
