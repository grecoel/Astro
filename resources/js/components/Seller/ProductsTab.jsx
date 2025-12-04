import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SellerDashboard.module.css';

const ProductsTab = ({ products = [], onEdit, onDelete }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterStock, setFilterStock] = useState('all');

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by stock status
        if (filterStock === 'low') {
            filtered = filtered.filter(p => (p.stock || 0) < 2);
        } else if (filterStock === 'out') {
            filtered = filtered.filter(p => (p.stock || 0) === 0);
        } else if (filterStock === 'in') {
            filtered = filtered.filter(p => (p.stock || 0) >= 2);
        }

        // Sort
        if (sortBy === 'name') {
            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'stock-high') {
            filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        } else if (sortBy === 'stock-low') {
            filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === 'price-low') {
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        }

        return filtered;
    }, [products, searchQuery, sortBy, filterStock]);

    if (products.length === 0) {
        return (
            <div className={styles.emptyStateTab}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                </svg>
                <h3>Belum Ada Produk</h3>
                <p>Mulai dengan menambahkan produk Anda untuk mulai berjualan</p>
                <button 
                    className={styles.btnAddProduct}
                    onClick={() => navigate('/seller/upload-produk')}
                >
                    + Tambah Produk Baru
                </button>
            </div>
        );
    }

    return (
        <div className={styles.productsTabContainer}>
            {/* Filters & Search */}
            <div className={styles.productsHeader}>
                <div className={styles.searchBox}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterControls}>
                    <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">Semua Stok</option>
                        <option value="in">Stok Tersedia</option>
                        <option value="low">Stok Rendah (&lt; 2)</option>
                        <option value="out">Stok Habis</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="name">Urutkan: Nama</option>
                        <option value="stock-high">Stok: Terbanyak</option>
                        <option value="stock-low">Stok: Tersedikit</option>
                        <option value="price-high">Harga: Termahal</option>
                        <option value="price-low">Harga: Termurah</option>
                    </select>

                    <button 
                        className={styles.btnAddProductHeader}
                        onClick={() => navigate('/seller/upload-produk')}
                        title="Tambah produk baru"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Tambah Produk
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className={styles.productsTableWrapper}>
                <table className={styles.productsTable}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>No</th>
                            <th>Produk</th>
                            <th>Kategori</th>
                            <th style={{ width: '100px' }}>Harga</th>
                            <th style={{ width: '80px' }} className={styles.textCenter}>Stok</th>
                            <th style={{ width: '80px' }} className={styles.textCenter}>Rating</th>
                            <th style={{ width: '100px' }} className={styles.textCenter}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedProducts.map((product, idx) => (
                            <tr key={product.id}>
                                <td className={styles.textCenter}>{idx + 1}</td>
                                <td>
                                    <div className={styles.productCell}>
                                        <img
                                            src={product.image || '/placeholder.png'}
                                            alt={product.name}
                                            className={styles.productThumb}
                                            onError={(e) => e.target.src = '/placeholder.png'}
                                        />
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td>{product.category?.name || '-'}</td>
                                <td>Rp {(product.price || 0).toLocaleString('id-ID')}</td>
                                <td className={styles.textCenter}>
                                    <span className={`${styles.stockBadge} ${(product.stock || 0) < 2 ? styles.stockLow : styles.stockOk}`}>
                                        {product.stock || 0}
                                    </span>
                                </td>
                                <td className={styles.textCenter}>
                                    <div className={styles.ratingCell}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                        </svg>
                                        <span>{product.reviews_avg_rating ? parseFloat(product.reviews_avg_rating).toFixed(1) : '0.0'}</span>
                                    </div>
                                </td>
                                <td className={styles.textCenter}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.btnEdit}
                                            onClick={() => onEdit && onEdit(product)}
                                            title="Edit produk"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => onDelete && onDelete(product.id)}
                                            title="Hapus produk"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAndSortedProducts.length === 0 && (
                    <div className={styles.noResults}>
                        <p>Tidak ada produk yang sesuai dengan filter</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className={styles.productsFooter}>
                <div className={styles.productStats}>
                    <span>Total: <strong>{filteredAndSortedProducts.length}</strong> produk</span>
                    <span>Ditampilkan dari <strong>{products.length}</strong> produk</span>
                </div>
            </div>
        </div>
    );
};

export default ProductsTab;
