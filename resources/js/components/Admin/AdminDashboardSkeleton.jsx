import React from 'react';
import styles from './AdminDashboardSkeleton.module.css';

export const AdminDashboardSkeleton = () => {
    return (
        <div className={styles.container}>
            {/* Header Skeleton */}
            <div className={styles.headerSkeleton}>
                <div className={styles.titleSkeleton}></div>
                <div className={styles.subtitleSkeleton}></div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className={styles.summaryGrid}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles.summaryCard}>
                        <div className={styles.summaryIcon}></div>
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryNumber}></div>
                            <div className={styles.summaryLabel}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map Section Skeleton */}
            <div className={styles.mapSection}>
                <div className={styles.sectionTitle}></div>
                <div className={styles.filterContainer}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.filterButton}></div>
                    ))}
                </div>
                <div className={styles.mapSkeleton}>
                    <div className={styles.shimmer}></div>
                </div>
            </div>

            {/* Charts Section Skeleton */}
            <div className={styles.chartsSection}>
                {/* Seller Status Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}></div>
                    </div>
                    <div className={styles.pieChartSkeleton}>
                        <div className={styles.shimmer}></div>
                    </div>
                </div>

                {/* Products Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div className={styles.chartTitle}></div>
                        <div className={styles.chartFilter}></div>
                    </div>
                    <div className={styles.barChartSkeleton}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.barItem}>
                                <div className={styles.barLabel}></div>
                                <div className={styles.barWrapper}>
                                    <div className={styles.barFill}></div>
                                </div>
                                <div className={styles.barCount}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ratings Chart Skeleton */}
            <div className={styles.ratingSection}>
                <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}></div>
                    <div className={styles.chartFilter}></div>
                </div>
                <div className={styles.ratingChartSkeleton}>
                    <div className={styles.ratingHeader}>
                        <div className={styles.avgRating}></div>
                        <div className={styles.totalReviews}></div>
                    </div>
                    <div className={styles.ratingBars}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.ratingRow}>
                                <div className={styles.starLabel}></div>
                                <div className={styles.ratingTrack}>
                                    <div className={styles.ratingFill}></div>
                                </div>
                                <div className={styles.ratingCount}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reports Section Skeleton */}
            <div className={styles.reportsSection}>
                <div className={styles.sectionTitle}></div>
                <div className={styles.reportCards}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.reportCard}>
                            <div className={styles.reportIcon}></div>
                            <div className={styles.reportContent}>
                                <div className={styles.reportTitle}></div>
                                <div className={styles.reportDescription}></div>
                            </div>
                            <div className={styles.reportArrow}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className={styles.quickActionsSection}>
                <div className={styles.sectionTitle}></div>
                <div className={styles.quickActionsGrid}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={styles.quickActionSkeleton}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
