<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terima Kasih atas Review</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #c3ff41;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
        }
        .rating-stars {
            color: #000000ff;
            font-size: 24px;
            margin: 15px 0;
        }
        .content {
            margin: 20px 0;
        }
        .review-box {
            background-color: #f9f9f9;
            border-left: 4px solid #c3ff41;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .product-name {
            font-weight: bold;
            color: #667A30;
            font-size: 18px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">AstroEcomm.</div>
            <p style="margin: 0; color: #666;">Terima kasih telah memberikan review!</p>
        </div>

        <div class="content">
            <h2 style="color: #000;">Halo, {{ $reviewerName }}! 👋</h2>
            
            <p>Terima kasih telah meluangkan waktu untuk memberikan review pada produk kami. Penilaian Anda sangat berarti bagi kami dan membantu pembeli lain dalam membuat keputusan pembelian.</p>

            <div class="review-box">
                <div class="product-name">{{ $productName }}</div>
                <div class="rating-stars">
                    @for ($i = 1; $i <= 5; $i++)
                        @if ($i <= $rating)
                            ★
                        @else
                            ☆
                        @endif
                    @endfor
                    <span style="color: #333; font-size: 16px;">({{ $rating }}/5)</span>
                </div>
                <p style="margin: 10px 0 0 0; color: #666; font-style: italic;">"{{ $comment }}"</p>
            </div>

            <p>Review Anda akan segera ditampilkan di halaman produk dan membantu calon pembeli lain membuat keputusan yang lebih baik.</p>

            <center>
                <a href="{{ config('app.url') }}" class="button">Kunjungi AstroEcomm</a>
            </center>
        </div>

        <div class="footer">
            <p><strong>AstroEcomm.</strong></p>
            <p>Platform e-commerce terpercaya dengan katalog produk terlengkap</p>
            <p style="margin-top: 10px;">
                Email: astro.ecomm01@gmail.com<br>
                © 2025 AstroEcomm. All Rights Reserved.
            </p>
        </div>
    </div>
</body>
</html>
