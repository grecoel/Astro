import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import ReviewModal from './ReviewModal';
import AllReviewsModal from './AllReviewsModal';
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
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
    const [reviewModalType, setReviewModalType] = useState('all');
    const [reviewFade, setReviewFade] = useState({ left: false, right: true });
    const [showHelpModal, setShowHelpModal] = useState(false);

    useEffect(() => {
        fetchProductData();
    }, [id]);

    // Check fade effect saat data reviews berubah
    useEffect(() => {
        if (product && product.reviews.length > 0) {
            const container = document.querySelector(`.${styles.reviewScroll}`);
            if (container) {
                const isScrolling = container.scrollWidth > container.clientWidth;
                setReviewFade({ left: false, right: isScrolling });
            }
        }
    }, [product]);

    // Fungsi untuk fetch data produk (bisa dipanggil ulang tanpa reload)
    const fetchProductData = async () => {
        try {
            const res = await axios.get(`/api/catalog/${id}`);
            
            if (!res.data || !res.data.product) {
                throw new Error('Data produk tidak ditemukan');
            }
            
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
        } catch (err) {
            console.error('Error fetching product data:', err);
            setLoading(false);
            
            // Error handling dengan user-friendly message
            if (err.response?.status === 404) {
                alert('Produk tidak ditemukan. Anda akan dialihkan ke halaman utama.');
                window.location.href = '/';
            } else if (err.response?.status === 500) {
                alert('Terjadi kesalahan server. Silakan coba lagi nanti.');
            } else if (!navigator.onLine) {
                alert('Tidak ada koneksi internet. Periksa koneksi Anda.');
            } else {
                alert('Gagal memuat data produk. Silakan refresh halaman.');
            }
        }
    };

    // Fungsi untuk refresh data setelah submit review
    const refreshProductData = async () => {
        try {
            const res = await axios.get(`/api/catalog/${id}`);
            
            if (!res.data || !res.data.product) {
                throw new Error('Gagal memperbarui data produk');
            }
            
            setProduct(res.data.product);
            setStats(res.data.rating_counts);
            setSellerRating({
                avg: res.data.seller_avg_rating || 0,
                total: res.data.seller_total_reviews || 0
            });
        } catch (err) {
            console.error('Error refreshing product data:', err);
            // Silent error, tidak mengganggu user experience
        }
    };

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

    // Handle scroll untuk fade effect pada review cards
    const handleReviewScroll = (e) => {
        const container = e.target;
        const isScrolling = container.scrollWidth > container.clientWidth;
        
        if (!isScrolling) {
            setReviewFade({ left: false, right: false });
            return;
        }

        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;

        // Fade kiri muncul ketika scroll > 0
        const showLeftFade = scrollLeft > 0;
        // Fade kanan muncul ketika belum mencapai end
        const showRightFade = scrollLeft < maxScroll - 10;

        setReviewFade({ left: showLeftFade, right: showRightFade });
    };

    // Helper: Hitung persentase kepuasan (rating 4 dan 5)
    const getSatisfactionRate = () => {
        const total = product.reviews.length || 0;
        if (total === 0) return 0;
        const satisfied = (stats[5] || 0) + (stats[4] || 0);
        return Math.round((satisfied / total) * 100);
    };

    // Helper: Get rating average dengan fallback
    const getRatingAvg = () => {
        if (!product || !product.rating_avg) {
            return '0.0';
        }
        
        // Convert to number jika string
        const ratingNum = typeof product.rating_avg === 'string' 
            ? parseFloat(product.rating_avg) 
            : product.rating_avg;
        
        // Check if valid number
        if (isNaN(ratingNum) || ratingNum === 0) {
            return '0.0';
        }
        
        return ratingNum.toFixed(1);
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                    <Link to="/" className={styles.breadcrumbLink} aria-label="Kembali ke beranda">Home</Link>
                    <span className={styles.breadcrumbSeparator} aria-hidden="true">&gt;</span>
                    <Link to="/search" className={styles.breadcrumbLink} aria-label="Kembali ke halaman produk">Produk</Link>
                    <span className={styles.breadcrumbSeparator} aria-hidden="true">&gt;</span>
                    <span className={styles.breadcrumbCurrent} aria-current="page">{product.category?.name}</span>
                </nav>

            {/* --- TOP SECTION --- */}
            <div className={styles.topSection}>
                
                {/* 1. Galeri Gambar */}
                <div className={styles.gallery}>
                    <img 
                        src={selectedImage} 
                        alt={`Gambar produk ${product.name}`} 
                        className={styles.mainImage}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400x400?text=Gambar+Tidak+Tersedia';
                        }}
                    />
                    <div className={styles.thumbnailContainer}>
                        {product.images.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img.image_url} 
                                alt={`Thumbnail ${idx + 1} dari ${product.name}`}
                                className={`${styles.thumbnail} ${selectedImage === img.image_url ? styles.active : ''}`}
                                onClick={() => setSelectedImage(img.image_url)}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/60x60?text=N/A';
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Lihat gambar ${idx + 1}`}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedImage(img.image_url);
                                    }
                                }}
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
                    
                    {/* Stock Status Section */}
                    <div className={`${styles.stockSection} ${product.stock < 5 ? styles.lowStock : styles.inStock}`}>
                        <div className={styles.stockHeader}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{marginRight: '8px'}}>
                                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div>
                                <div className={styles.stockStatus}>
                                    {product.stock > 0 ? 'Stok Tersedia' : 'Stok Habis'}
                                </div>
                                <div className={styles.stockCount}>
                                    <strong>{product.stock}</strong> unit
                                </div>
                            </div>
                        </div>
                        {product.stock < 5 && product.stock > 0 && (
                            <div className={styles.stockWarning}>
                                ⚠️ Stok terbatas, buruan pesan!
                            </div>
                        )}
                    </div>

                    <div className={styles.totalPriceRow}>
                        <span>Total Harga</span>
                        <span style={{fontSize:'1.2rem'}}>{fmtMoney(product.price * qty)}</span>
                    </div>

                    {/* Tombol sesuai gambar */}
                    <button 
                        className={styles.btnBlack}
                        onClick={() => setShowReviewModal(true)}
                        aria-label="Beri rating dan komentar untuk produk ini"
                    >
                        Beri Rating & Komentar
                    </button>
                    <button 
                        className={styles.btnOutline}
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: product.name,
                                    text: `Lihat ${product.name} di AstroEcomm`,
                                    url: window.location.href
                                }).catch(err => console.log('Share cancelled'));
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link produk berhasil disalin!');
                            }
                        }}
                        aria-label="Bagikan produk ini"
                    >
                        Bagikan Produk
                    </button>
                </div>
            </div>

            {/* --- RATING SECTION --- */}
            <div className={styles.sectionBox}>
                <div className={styles.sectionHeader}>
                    <h3>Rating Produk</h3>
                </div>
                
                <div className={styles.ratingContainer}>
                    <div className={styles.ratingBig}>
                        <div className={styles.ratingScore}>
                            <StarIcon size={48} /> 
                            <span className={styles.scoreNumber}>{getRatingAvg()}</span>
                            <span className={styles.scoreMax}>dari 5.0</span>
                        </div>
                        <div style={{fontSize:'0.9rem', marginTop:'10px', color: '#555'}}>
                            {product.reviews.length > 0 ? (
                                <>
                                    {getSatisfactionRate()}% pembeli merasa puas<br/>
                                    {product.reviews.length} rating • {product.reviews.length} ulasan
                                </>
                            ) : (
                                <>
                                    Belum ada penilaian<br/>
                                    Jadilah yang pertama memberi ulasan
                                </>
                            )}
                        </div>
                    </div>

                    {/* Progress Bars Split - Kiri (3,4,5) & Kanan (1,2) */}
                    <div className={styles.ratingBarsWrapper}>
                        {/* Bagian Kiri - Rating 5, 4, 3 */}
                        <div className={styles.ratingBarsLeft}>
                            {[5, 4, 3].map(star => (
                                <div key={star} className={styles.barRow}>
                                    <span className={styles.barLabel}><StarIcon size={12} />{star}</span>
                                    <div className={styles.progressBg}>
                                        <div className={styles.progressFill} style={{width: getBarWidth(star)}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bagian Kanan - Rating 2, 1 */}
                        <div className={styles.ratingBarsRight}>
                            {[2, 1].map(star => (
                                <div key={star} className={styles.barRow}>
                                    <span className={styles.barLabel}><StarIcon size={12} />{star}</span>
                                    <div className={styles.progressBg}>
                                        <div className={styles.progressFill} style={{width: getBarWidth(star)}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- KOMENTAR PRODUK --- */}
            <div className={styles.sectionBox}>
                <div className={styles.sectionHeader}>
                    <h3>Komentar Produk</h3>
                    {product.reviews.length > 0 && (
                        <a 
                            href="#" 
                            className={styles.seeMore}
                            onClick={(e) => {
                                e.preventDefault();
                                setReviewModalType('comments');
                                setShowAllReviewsModal(true);
                            }}
                            aria-label={`Lihat semua ${product.reviews.length} komentar`}
                        >
                            Lihat Semua ({product.reviews.length})
                        </a>
                    )}
                </div>

                <div 
                    className={`${styles.reviewScroll} ${reviewFade.left ? styles.fadeLeft : ''} ${reviewFade.right ? styles.fadeRight : ''}`}
                    onScroll={handleReviewScroll}
                    role="region"
                    aria-label="Daftar komentar produk"
                >
                    {product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewerName}>{review.reviewer_name}</div>
                            <div className={styles.reviewVariant}>Variasi: Original</div>
                            <div className={styles.reviewText}>{review.comment}</div>
                        </div>
                    )) : (
                        <div className={styles.noReviews}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{marginBottom: '12px', opacity: 0.3}}>
                                <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#D1D5DB" strokeWidth="2"/>
                                <path d="M16 20H16.02M32 20H32.02M16 28C16 28 19 32 24 32C29 32 32 28 32 28" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <p style={{margin: 0, fontSize: '14px', color: '#6B7280'}}>Belum ada komentar untuk produk ini.</p>
                            <p style={{margin: '8px 0 0 0', fontSize: '13px', color: '#9CA3AF'}}>Jadilah yang pertama memberikan ulasan!</p>
                        </div>
                    )}
                </div>
            </div>

                {/* Help Button */}
                <button 
                    className={styles.helpButton}
                    onClick={() => setShowHelpModal(true)}
                    aria-label="Bantuan halaman detail produk"
                    title="Klik untuk melihat bantuan"
                >
                    <div className={styles.helpCircle}>?</div>
                    <span className={styles.helpTooltip}>Butuh bantuan?</span>
                </button>

                {/* Help Modal Island */}
                {showHelpModal && (
                    <div className={styles.helpModalOverlay} onClick={() => setShowHelpModal(false)}>
                        <div className={styles.helpModal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.helpModalHeader}>
                                <h2>Bantuan Halaman Detail Produk</h2>
                                <button 
                                    className={styles.helpModalClose}
                                    onClick={() => setShowHelpModal(false)}
                                    aria-label="Tutup bantuan"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className={styles.helpModalContent}>
                                <div className={styles.helpItem}>
                                    <div className={styles.helpIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect x="2" y="3" width="20" height="18" rx="2" stroke="#D3F26A" strokeWidth="2"/>
                                            <path d="M2 8h20M8 3v18" stroke="#D3F26A" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Lihat Detail Gambar</h3>
                                        <p>Klik gambar kecil di bawah untuk melihat berbagai sudut pandang produk dengan lebih detail.</p>
                                    </div>
                                </div>

                                <div className={styles.helpItem}>
                                    <div className={styles.helpIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#D3F26A"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Baca Rating & Ulasan</h3>
                                        <p>Scroll ke bawah untuk melihat rating, ulasan, dan pengalaman pembeli lain dengan produk ini.</p>
                                    </div>
                                </div>

                                <div className={styles.helpItem}>
                                    <div className={styles.helpIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v-2h8v2zm0-3h-8V9h8v2zm0-3H6V6h12v2z" fill="#D3F26A"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Berikan Ulasan Anda</h3>
                                        <p>Klik "Beri Rating & Komentar" untuk berbagi pengalaman Anda dengan pembeli lain.</p>
                                    </div>
                                </div>

                                <div className={styles.helpItem}>
                                    <div className={styles.helpIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="#D3F26A"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Lihat Produk Penjual Lain</h3>
                                        <p>Klik nama toko penjual untuk melihat koleksi produk lengkap dari toko tersebut.</p>
                                    </div>
                                </div>

                                <div className={styles.helpItem}>
                                    <div className={styles.helpIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.82 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.82 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="#D3F26A"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Bagikan Produk</h3>
                                        <p>Gunakan tombol "Bagikan Produk" untuk membagikan link produk kepada teman melalui berbagai platform.</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.helpModalFooter}>
                                <button 
                                    className={styles.helpModalButton}
                                    onClick={() => setShowHelpModal(false)}
                                >
                                    Mengerti, Terima Kasih
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Review Modal */}
            <ReviewModal 
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                product={product}
                onReviewSubmitted={refreshProductData}
            />

            {/* All Reviews Modal */}
            <AllReviewsModal 
                isOpen={showAllReviewsModal}
                onClose={() => setShowAllReviewsModal(false)}
                product={product}
                stats={stats}
                type={reviewModalType}
            />
            
            <Footer />
        </>
    );
};

export default ProductDetail;