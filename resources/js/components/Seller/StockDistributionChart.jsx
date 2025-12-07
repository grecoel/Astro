import React, { useMemo } from 'react';
import styles from './SellerDashboard.module.css';

const StockDistributionChart = ({ products = [] }) => {
    // Calculate stock by category
    const stockByCategory = useMemo(() => {
        const categories = {};
        
        products.forEach(product => {
            const category = product.category?.name || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = {
                    name: category,
                    stock: 0,
                    count: 0
                };
            }
            categories[category].stock += product.stock || 0;
            categories[category].count += 1;
        });
        
        return Object.values(categories)
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 6); // Top 6 categories
    }, [products]);

    const totalStock = useMemo(() => {
        return stockByCategory.reduce((sum, cat) => sum + cat.stock, 0);
    }, [stockByCategory]);

    if (stockByCategory.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#d1d5db">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                <p>Belum ada data kategori</p>
            </div>
        );
    }

    // Colors for categories - vibrant and distinguishable
    const colors = [
        '#7A57B3', // Purple
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Orange
        '#EF4444', // Red
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#06B6D4'  // Cyan
    ];

    // Calculate angles for pie chart
    const segments = stockByCategory.map((cat, idx) => ({
        ...cat,
        percentage: (cat.stock / totalStock) * 100,
        color: colors[idx % colors.length]
    }));

    // SVG Pie Chart dimensions
    const size = 200;
    const radius = 75;
    const cx = size / 2;
    const cy = size / 2;

    let currentAngle = -90;
    const paths = segments.map((segment, idx) => {
        const sliceAngle = (segment.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);
        
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        currentAngle = endAngle;
        
        return { path, ...segment, idx };
    });

    return (
        <div className={styles.stockDistributionContainer}>
            <div className={styles.pieChartWrapper}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.pieChart}>
                    {paths.map((item) => (
                        <path
                            key={item.idx}
                            d={item.path}
                            fill={item.color}
                            opacity="0.9"
                            className={styles.pieSlice}
                        />
                    ))}
                </svg>
                
                <div className={styles.pieCenter}>
                    <div className={styles.pieCenterValue}>{totalStock}</div>
                    <div className={styles.pieCenterLabel}>Total Stok</div>
                </div>
            </div>

            <div className={styles.categoryLegend}>
                {segments.map((segment) => (
                    <div key={segment.name} className={styles.legendItem}>
                        <div 
                            className={styles.legendColor}
                            style={{ backgroundColor: segment.color }}
                        />
                        <div className={styles.legendContent}>
                            <div className={styles.legendName}>{segment.name}</div>
                            <div className={styles.legendStats}>
                                <span className={styles.legendValue}>{segment.stock}</span>
                                <span className={styles.legendPercent}>({segment.percentage.toFixed(1)}%)</span>
                                <span className={styles.legendCount}>·&nbsp;{segment.count} item</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockDistributionChart;
