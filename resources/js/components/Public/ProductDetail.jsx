import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [stats, setStats] = useState(null);
    const [sellerRating, setSellerRating] = useState({ avg: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    
    // State UI
    const [selectedImage, setSelectedImage] = useState('');
    const [qty, setQty] = useState(1);
    const [showFullDesc, setShowFullDesc] = useState(false);

    useEffect(() => {
        axios.get(`/api/catalog/${id}`)
            .then(res => {
                setProduct(res.data.product);
                setStats(res.data.rating_counts);
                setSellerRating({
                    avg: res.data.seller_avg_rating || 0,
                    total: res.data.seller_total_reviews || 0
                });
                // Set gambar default (gambar pertama atau placeholder)
                const firstImg = res.data.product.images.find(i => i.is_primary)?.image_url 
                                || res.data.product.images[0]?.image_url
                                || 'https://placehold.co/400';
                setSelectedImage(firstImg);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    // Star Icon Component untuk konsistensi
    const StarIcon = ({ size = 15, fill = "#FDB813" }) => (
        <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill={fill}/>
        </svg>
    );

    if (loading || !product) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div className={styles.breadcrumbSkeleton}></div>
                    <div className={styles.topSection}>
                        <div className={styles.gallery}>
                            <div className={styles.skeletonMainImage}></div>
                            <div className={styles.thumbnailContainer}>
                                {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonThumbnail}></div>)}
                            </div>
                        </div>
                        <div className={styles.productInfo}>
                            <div className={styles.skeletonTitle}></div>
                            <div className={styles.skeletonRating}></div>
                            <div className={styles.skeletonPrice}></div>
                            <div className={styles.skeletonMeta}>
                                <div className={styles.skeletonMetaLine}></div>
                                <div className={styles.skeletonMetaLine}></div>
                                <div className={styles.skeletonMetaLine}></div>
                            </div>
                            <div className={styles.skeletonDescription}></div>
                        </div>
                        <div className={styles.actionCard}>
                            <div className={styles.skeletonActionTitle}></div>
                            <div className={styles.skeletonQty}></div>
                            <div className={styles.skeletonTotal}></div>
                            <div className={styles.skeletonButton}></div>
                            <div className={styles.skeletonButton}></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Helper: Format Rupiah
    const fmtMoney = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);

    // Helper: Hitung Persentase Bar Rating
    const getBarWidth = (star) => {
        const count = stats[star] || 0;
        const total = product.reviews.length || 1; // avoid division by zero
        return `${(count / total) * 100}%`;
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                    <span className={styles.breadcrumbSeparator}>&gt;</span>
                    <Link to="/search" className={styles.breadcrumbLink}>Produk</Link>
                    <span className={styles.breadcrumbSeparator}>&gt;</span>
                    <span className={styles.breadcrumbCurrent}>{product.category?.name}</span>
                </div>

            {/* --- TOP SECTION --- */}
            <div className={styles.topSection}>
                
                {/* 1. Galeri Gambar */}
                <div className={styles.gallery}>
                    <img src={selectedImage} alt={product.name} className={styles.mainImage} />
                    <div className={styles.thumbnailContainer}>
                        {product.images.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img.image_url} 
                                className={`${styles.thumbnail} ${selectedImage === img.image_url ? styles.active : ''}`}
                                onClick={() => setSelectedImage(img.image_url)}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. Informasi Produk */}
                <div className={styles.productInfo}>
                    <h1>{product.name}</h1>
                    <div className={styles.ratingSummary}>
                        Dinilai {product.reviews.length}x • <StarIcon size={14} /> {product.rating_avg} ({product.reviews.length} komentar)
                    </div>
                    <div className={styles.price}>{fmtMoney(product.price)}</div>

                    <div className={styles.metaInfo}>
                        <div><span className={styles.metaLabel}>Kondisi:</span> {product.condition}</div>
                        <div><span className={styles.metaLabel}>Kategori:</span> {product.category?.name}</div>
                        <div><span className={styles.metaLabel}>Lokasi:</span> {product.seller?.pic_city}</div>
                    </div>

                    <div className={styles.description}>
                        {showFullDesc ? product.description : product.description.substring(0, 150) + '...'}
                    </div>
                    {product.description.length > 150 && (
                        <div className={styles.seeMore} onClick={() => setShowFullDesc(!showFullDesc)}>
                            {showFullDesc ? 'Lihat Lebih Sedikit' : 'Lihat Selengkapnya'}
                        </div>
                    )}

                    {/* Profil Seller */}
                    <div className={styles.sellerSection}>
                        <img 
                            src={product.seller?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller?.store_name || 'S')}&background=c3ff41&color=000`} 
                            className={styles.sellerAvatar} 
                            alt="Seller" 
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller?.store_name || 'S')}&background=c3ff41&color=000`;
                            }}
                        />
                        <div>
                            <div className={styles.sellerName}>
                                {product.seller?.store_name}
                                <svg className={styles.verifiedBadge} width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <circle cx="10" cy="10" r="10" fill="#8B5CF6"/>
                                    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className={styles.sellerRating}>
                                <StarIcon size={14} />
                                <span>{sellerRating.avg > 0 ? sellerRating.avg : '0.0'}</span>
                                <span className={styles.sellerRatingCount}>
                                    ({sellerRating.total > 0 ? `${sellerRating.total} penilaian` : 'Belum ada penilaian'})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Card Aksi (Kanan) */}
                <div className={styles.actionCard}>
                    <div className={styles.actionTitle}>Jumlah Produk & Total Harga</div>
                    
                    <div className={styles.qtyControl}>
                        <div className={styles.qtyInputGroup}>
                            <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span className={styles.qtyValue}>{qty}</span>
                            <button className={styles.qtyBtn} onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                        </div>
                        <span className={styles.stockLabel}>Jumlah Stok: {product.stock}</span>
                    </div>

                    <div className={styles.totalPriceRow}>
                        <span>Total Harga</span>
                        <span style={{fontSize:'1.2rem'}}>{fmtMoney(product.price * qty)}</span>
                    </div>

                    {/* Tombol sesuai gambar */}
                    <button className={styles.btnBlack}>Beri Rating & Komentar</button>
                    <button className={styles.btnOutline}>Bagikan Produk</button>
                </div>
            </div>

            {/* --- RATING SECTION --- */}
            <div className={styles.sectionBox}>
                <div className={styles.sectionHeader}>
                    <h3>Rating Produk</h3>
                    <a href="#" className={styles.seeMore}>Lihat Semua</a>
                </div>
                
                <div className={styles.ratingContainer}>
                    <div className={styles.ratingBig}>
                        <div className={styles.ratingScore}><StarIcon size={48} /> {product.rating_avg} <span style={{fontSize:'1rem', color:'#555'}}>dari 5.0</span></div>
                        <div style={{fontSize:'0.9rem', marginTop:'10px'}}>
                            99% pembeli merasa puas<br/>
                            {product.reviews.length} rating • {product.reviews.length} komentar
                        </div>
                    </div>

                    {/* Progress Bars (Ungu) */}
                    <div className={styles.ratingBars}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className={styles.barRow}>
                                <span style={{display:'flex', alignItems:'center', gap:'4px', width:'40px'}}><StarIcon size={12} />{star}</span>
                                <div className={styles.progressBg}>
                                    <div className={styles.progressFill} style={{width: getBarWidth(star)}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- KOMENTAR PRODUK --- */}
            <div className={styles.sectionBox}>
                <div className={styles.sectionHeader}>
                    <h3>Komentar Produk</h3>
                    <a href="#" className={styles.seeMore}>Lihat Semua</a>
                </div>

                <div className={styles.reviewScroll}>
                    {product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewerName}>{review.reviewer_name}</div>
                            <div className={styles.reviewVariant}>Variasi: Original</div>
                            <div className={styles.reviewText}>{review.comment}</div>
                        </div>
                    )) : (
                        <p className={styles.noReviews}>Belum ada komentar.</p>
                    )}
                </div>
            </div>

                {/* Help Button */}
                <div className={styles.helpButton}>
                    <div className={styles.helpCircle}>?</div>
                </div>
            </div>
            
            <Footer />
        </>
    );
};

export default ProductDetail;