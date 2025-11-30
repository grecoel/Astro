<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #7A57B3;
        }
        
        .header h1 {
            color: #7A57B3;
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .header p {
            color: #666;
            font-size: 12px;
            margin: 3px 0;
        }
        
        .info-section {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .info-label {
            font-weight: bold;
            color: #7A57B3;
        }
        
        .info-value {
            color: #333;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        thead {
            background: #7A57B3;
            color: white;
        }
        
        th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
        }
        
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        tbody tr:nth-child(even) {
            background: #f9fafb;
        }
        
        tbody tr:hover {
            background: #f3f0ff;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
            font-style: italic;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
        
        .total-row {
            font-weight: bold;
            background: #f3f0ff !important;
            border-top: 2px solid #7A57B3;
        }
        
        .status-warning {
            color: #dc2626;
            font-weight: bold;
        }
        
        .status-good {
            color: #10b981;
            font-weight: bold;
        }
        
        .rating-star {
            color: #FDB813;
        }
        
        .page-number:after {
            content: counter(page);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>{{ $subtitle }}</p>
    </div>
    
    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Nama Toko:</span>
            <span class="info-value">{{ $seller->store_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Tanggal Cetak:</span>
            <span class="info-value">{{ $generated_at }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Produk:</span>
            <span class="info-value">{{ count($products) }} produk</span>
        </div>
    </div>
    
    @if(count($products) > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 45%;">Nama Produk</th>
                    @if($type === 'stock' || $type === 'reorder')
                        <th style="width: 15%;">Stok</th>
                    @endif
                    @if($type === 'rating')
                        <th style="width: 15%;">Rating</th>
                        <th style="width: 15%;">Ulasan</th>
                    @endif
                    <th style="width: 20%;">Harga</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $index => $product)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $product['name'] }}</td>
                        @if($type === 'stock' || $type === 'reorder')
                            <td class="{{ $product['stock'] < 2 ? 'status-warning' : 'status-good' }}">
                                {{ $product['stock'] }} unit
                            </td>
                        @endif
                        @if($type === 'rating')
                            <td><span class="rating-star">★</span> {{ $product['rating'] }}</td>
                            <td>{{ $product['review_count'] }} ulasan</td>
                        @endif
                        <td>Rp {{ number_format($product['price'], 0, ',', '.') }}</td>
                    </tr>
                @endforeach
                @if($type === 'stock' || $type === 'reorder')
                    <tr class="total-row">
                        <td colspan="2">TOTAL</td>
                        <td>{{ collect($products)->sum('stock') }} unit</td>
                        <td>Rp {{ number_format(collect($products)->sum('price'), 0, ',', '.') }}</td>
                    </tr>
                @endif
            </tbody>
        </table>
    @else
        <div class="no-data">
            <p>Tidak ada data produk untuk laporan ini.</p>
        </div>
    @endif
    
    <div class="footer">
        <p>Laporan ini digenerate secara otomatis oleh sistem AstroEcomm</p>
        <p>{{ $seller->store_name }} - {{ $generated_at }}</p>
    </div>
</body>
</html>
