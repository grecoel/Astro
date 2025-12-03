import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

const SplashScreen = ({ onComplete }) => {
    const [stage, setStage] = useState('init'); // init -> logo -> brand -> tagline -> fadeOut
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Ensure all assets are loaded
        const img = new Image();
        img.src = '/logo.png';
        img.onload = () => {
            setIsReady(true);
        };
        img.onerror = () => {
            setIsReady(true); // Continue even if logo fails to load
        };

        // Fallback if image takes too long
        const fallbackTimer = setTimeout(() => {
            setIsReady(true);
        }, 500);

        return () => clearTimeout(fallbackTimer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        // Start animation sequence (faster timing)
        const initTimer = setTimeout(() => {
            setStage('logo');
        }, 200);

        // Logo entrance complete
        const logoTimer = setTimeout(() => {
            setStage('brand');
        }, 1000);

        // Brand name shown
        const brandTimer = setTimeout(() => {
            setStage('tagline');
        }, 1600);

        // Tagline shown
        const taglineTimer = setTimeout(() => {
            setStage('fadeOut');
        }, 2200);

        // Complete and reveal catalog
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2800);

        return () => {
            clearTimeout(initTimer);
            clearTimeout(logoTimer);
            clearTimeout(brandTimer);
            clearTimeout(taglineTimer);
            clearTimeout(completeTimer);
        };
    }, [isReady, onComplete]);

    return (
        <div className={`${styles.splashContainer} ${isReady ? styles.ready : ''} ${styles[stage]}`}>
            <div className={styles.content}>
                {/* Logo Container */}
                <div className={styles.logoWrapper}>
                        <img 
                            src="/logo.png" 
                            alt="Astro Logo" 
                            className={styles.logo}
                        />
                    <div className={styles.logoGlow}></div>
                </div>

                {/* Brand Name */}
                <div className={styles.brandName}>
                    <span className={styles.brandText}>AstroEcomm</span>
                    <span className={styles.brandDot}>.</span>
                </div>

                {/* Tagline */}
                <div className={styles.tagline}>
                    <span className={styles.taglineText}>Shop to the Sky</span>
                    <div className={styles.taglineUnderline}></div>
                </div>

                {/* Loading Indicator */}
                <div className={styles.loadingIndicator}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                </div>
            </div>

            {/* Background Particles */}
            <div className={styles.particles}>
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className={styles.particle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className={styles.gradientOverlay}></div>
        </div>
    );
};

export default SplashScreen;
