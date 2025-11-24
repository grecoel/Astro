import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footerSection}>
            <div className={styles.footerContent}>
                <div className={styles.footerGrid}>
                    <div>
                        <h3 className={styles.footerTitle}>AstroEcomm.</h3>
                        <p>Tentang Astro</p>
                        <p>IF Undip</p>
                        <p>Kebijakan</p>
                        <p>Kontak Media</p>
                        <p>Astro Seller Club</p>
                    </div>
                    <div>
                        <h3 className={styles.footerTitle}>Customer Service</h3>
                        <p>Bantuan</p>
                        <p>Metode Pembayaran</p>
                        <p>SKS (Saldo Koin Spesial)</p>
                        <p>Pengembalian Produk & Dana</p>
                        <p>Pengajuan Komplain</p>
                        <p>Hubungi Kami</p>
                    </div>
                    <div>
                        <h3 className={styles.footerTitle}>Follow Us</h3>
                        <div className={styles.socialLinks}>
                            {/* Instagram */}
                            <p>
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm12 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
                                </svg>
                                astroe.comm
                            </p>

                            {/* Twitter/X */}
                            <p>
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2H21.5l-7.61 8.71L22 22h-6.828l-5.35-6.934L3.83 22H.5l8.15-9.32L2 2h6.91l4.78 6.257L18.244 2zm-2.4 17.17h1.86L8.125 4.69H6.176l9.668 14.48z"/>
                                </svg>
                                astroecomm.twt
                            </p>

                            {/* TikTok */}
                            <p>
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.5 2c1.1 2.9 3.7 5 6.8 5.2v3.3c-2.1-.1-4-.8-5.6-2v7.8a6.7 6.7 0 1 1-6.7-6.7c.4 0 .9 0 1.3.1v3.4a3.4 3.4 0 1 0 3.4 3.4V2h.8z"/>
                                </svg>
                                astroecomm.tiktok
                            </p>

                            {/* Facebook */}
                            <p>
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z"/>
                                </svg>
                                astroecomm.fb
                            </p>

                            {/* GitHub */}
                            <p>
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 11c.6.1.8-.3.8-.6v-2c-3.2.7-4-1.4-4-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.7 1.2 3.4.9.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.3 1.9 1.3 3.2 0 4.7-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v2.9c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/>
                                </svg>
                                astroecomm.git
                            </p>
                        </div>

                    </div>
                    <div>
                        <h3 className={styles.footerTitle}>Contact Us</h3>
                        <p>Email: astro.ecomm01@gmail.com</p>
                        <p>Call Center: 0298-1236-6969</p>
                        <p>Whatsapp: 0693-8569-1269</p>
                        <div className={styles.supportSection}>
                            <h3 className={styles.footerTitle}>Support Us</h3>
                            <div className={styles.qrCode}>
                                <div className={styles.qrPlaceholder}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footerBottom}>
                © AstroEcomm. 2025. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
