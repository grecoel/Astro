import React from 'react';
import styles from './SellerDashboardSkeleton.module.css';

export const DashboardSkeleton = () => {
    return (
        <div className={styles.container}>
            {/* Summary Cards Skeleton */}
            <div className={styles.summaryGrid}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles.summaryCard}>
                        <div className={styles.shimmer}></div>
                    </div>
                ))}
            </div>

            {/* Charts Section Skeleton */}
            <div className={styles.chartsSection}>
                {/* Stock Distribution Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}></div>
                        <div className={styles.chartFilter}></div>
                    </div>
                    <div className={styles.pieChartSkeleton}>
                        <div className={styles.shimmer}></div>
                    </div>
                </div>

                {/* Rating Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}></div>
                        <div className={styles.chartFilter}></div>
                    </div>
                    <div className={styles.barChartSkeleton}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles.barItem}>
                                <div className={styles.barLabel}></div>
                                <div className={styles.barWrapper}>
                                    <div className={styles.barFill}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Section Skeleton */}
            <div className={styles.mapSection}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}></div>
                    <div className={styles.chartFilter}></div>
                </div>
                <div className={styles.mapSkeleton}>
                    <div className={styles.shimmer}></div>
                </div>
            </div>

            {/* Reports Section Skeleton */}
            <div className={styles.reportsSection}>
                <div className={styles.sectionTitle}></div>
                <div className={styles.reportCards}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.reportCard}>
                            <div className={styles.reportIcon}></div>
                            <div className={styles.reportTitle}></div>
                            <div className={styles.reportButton}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
