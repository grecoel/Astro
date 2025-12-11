<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toko Kamu Disetujui</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #171719;
            background-color: #F2F4F0;
            padding: 20px;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .header {
            background-color: #D3F26A;
            color: #667A30;
            padding: 30px 30px;
            text-align: center;
        }
        .logo-container {
            margin-bottom: 12px;
        }
        .logo-img {
            max-width: 60px;
            height: auto;
            margin: 0 auto 12px;
        }
        .header-title {
            font-size: 22px;
            font-weight: 700;
            color: #667A30;
            margin-bottom: 6px;
        }
        .header-subtitle {
            font-size: 13px;
            color: #667A30;
            font-weight: 500;
        }
        .content {
            padding: 35px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #171719;
            margin-bottom: 20px;
        }
        .congratulations-badge {
            display: inline-block;
            background-color: #D3F26A;
            color: #667A30;
            padding: 10px 24px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.3px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(211, 242, 106, 0.3);
        }
        .message {
            font-size: 15px;
            color: #171719;
            line-height: 1.7;
            margin-bottom: 20px;
        }
        .store-card {
            background-color: #FFFEF8;
            border-left: 4px solid #D3F26A;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }
        .store-name {
            font-size: 20px;
            font-weight: 700;
            color: #667A30;
            margin-bottom: 8px;
        }
        .store-owner {
            font-size: 14px;
            color: #171719;
            font-weight: 500;
        }
        .info-box {
            background-color: #FFF9E6;
            border: 2px solid #D3F26A;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .info-title {
            font-size: 16px;
            font-weight: 600;
            color: #667A30;
            margin-bottom: 12px;
        }
        .info-steps {
            list-style: none;
            padding: 0;
        }
        .info-steps li {
            padding: 8px 0;
            color: #171719;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            padding-left: 24px;
        }
        .info-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #D3F26A;
            font-weight: bold;
            font-size: 16px;
        }
        .cta-container {
            text-align: center;
            margin: 35px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #D3F26A;
            color: #667A30;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.3px;
        }
        .cta-button:hover {
            background-color: #B8D354;
            color: #171719;
        }
        .expiry-notice {
            background-color: #FFF9E6;
            border: 2px solid #D3F26A;
            border-radius: 6px;
            padding: 16px;
            text-align: center;
            margin: 20px 0;
        }
        .expiry-notice p {
            color: #667A30;
            font-size: 13px;
            font-weight: 600;
            margin: 0;
        }
        .footer {
            background-color: #D3F26A;
            padding: 30px;
            text-align: center;
            border-top: none;
        }
        .footer-logo {
            max-width: 50px;
            height: auto;
            margin: 0 auto 12px;
        }
        .footer-tagline {
            font-size: 13px;
            color: #667A30;
            margin-bottom: 16px;
            font-weight: 600;
        }
        .footer-contact {
            font-size: 12px;
            color: #667A30;
            line-height: 1.8;
        }
        .footer-contact a {
            color: #667A30;
            text-decoration: none;
            font-weight: 600;
        }
        .footer-contact a:hover {
            color: #171719;
            text-decoration: underline;
        }
            font-size: 12px;
            color: #171719;
            line-height: 1.8;
        }
        .footer-contact a {
            color: #667A30;
            text-decoration: none;
            font-weight: 500;
        }
        .footer-contact a:hover {
            color: #7DBA30;
            text-decoration: underline;
        }
        .divider {
            height: 1px;
            background-color: #E0DDD8;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <img src="{{ $message->embed(public_path('logo.png')) }}" alt="AstroEcomm" class="logo-img">
            </div>
            <h1 class="header-title">Toko Disetujui!</h1>
            <p class="header-subtitle">Selamat! Toko kamu siap untuk berjualan</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div style="text-align: center;">
                <span class="congratulations-badge">Pendaftaran Disetujui</span>
            </div>

            <h1 class="greeting">Selamat, {{ $notifiable->pic_name }}!</h1>
            
            <p class="message">
                Kami dengan senang hati memberitahukan bahwa pendaftaran toko kamu telah berhasil disetujui 
                oleh tim AstroEcomm. Kamu sekarang dapat mulai berjualan dan menjangkau ribuan pembeli!
            </p>

            <!-- Store Card -->
            <div class="store-card">
                <div class="store-name">🏪 {{ $notifiable->store_name }}</div>
                <div class="store-owner">👤 Pemilik: {{ $notifiable->pic_name }}</div>
            </div>

            <!-- Activation Instructions -->
            <div class="info-box">
                <div class="info-title">Langkah Selanjutnya:</div>
                <ul class="info-steps">
                    <li>Klik tombol aktivasi di bawah untuk membuat password akun</li>
                    <li>Lengkapi profil toko kamu dengan informasi yang menarik</li>
                    <li>Unggah produk pertama kamu dan mulai berjualan</li>
                    <li>Kelola pesanan dan bangun reputasi toko yang baik</li>
                </ul>
            </div>

            <p class="message">
                Untuk mengaktifkan akun dan mulai berjualan, silakan klik tombol di bawah ini untuk 
                membuat password akun kamu. Pastikan password yang dibuat aman dan mudah diingat.
            </p>

            <!-- CTA Button -->
            <div class="cta-container">
                <a href="{{ $actionUrl }}" class="cta-button">Buat Password & Aktivasi Akun 🚀</a>
            </div>

            <!-- Expiry Notice -->
            <div class="expiry-notice">
                <p>⏰ Tautan aktivasi ini akan kadaluarsa dalam 60 menit</p>
            </div>

            <p class="message" style="font-size: 14px; color: #171719;">
                Jika kamu mengalami kesulitan atau memiliki pertanyaan, jangan ragu untuk menghubungi 
                tim support kami. Kami siap membantu kamu memulai perjalanan sebagai penjual di AstroEcomm!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <img src="{{ $message->embed(public_path('AstroBlackPlain.svg')) }}" alt="AstroEcomm" class="footer-logo">
            <p class="footer-tagline">Platform e-commerce terpercaya dengan katalog produk terlengkap</p>
            
            <div class="divider"></div>
            
            <div class="footer-contact">
                <p>
                    <strong>Hubungi Kami:</strong><br>
                    Email: <a href="mailto:astro.ecomm01@gmail.com">astro.ecomm01@gmail.com</a>
                </p>
                <p style="margin-top: 12px; color: #667A30; font-size: 11px;">
                    © 2025 AstroEcomm. All Rights Reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
