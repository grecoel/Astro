<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #2c3e50;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px 30px;
            margin-bottom: 25px;
            border-radius: 8px;
        }
        
        .report-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .meta-info {
            font-size: 11px;
            opacity: 0.95;
            margin-top: 5px;
        }
        
        .meta-info strong {
            font-weight: 600;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            border-radius: 8px;
            overflow: hidden;
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th {
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }
        
        th.text-center {
            text-align: center;
        }
        
        th.text-right {
            text-align: right;
        }
        
        td {
            padding: 10px;
            font-size: 10px;
            border-bottom: 1px solid #e8e8e8;
        }
        
        td.text-center {
            text-align: center;
        }
        
        td.text-right {
            text-align: right;
            font-weight: 500;
        }
        
        tbody tr {
            background-color: #ffffff;
            transition: background-color 0.2s;
        }
        
        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        tbody tr:hover {
            background-color: #f0f4ff;
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #95a5a6;
            font-style: italic;
            font-size: 12px;
        }
        
        .product-name {
            font-weight: 500;
            color: #2c3e50;
        }
        
        .category-name {
            color: #7f8c8d;
            font-size: 9px;
        }
        
        .price {
            color: #000000;
            font-weight: 600;
        }
        
        .stock-badge {
            font-weight: 600;
            font-size: 10px;
        }
        
        .stock-high {
            color: #27ae60;
        }
        
        .stock-low {
            color: #e74c3c;
        }
        
        .rating-badge {
            font-weight: 600;
            font-size: 10px;
            color: #f39c12;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e8e8e8;
            text-align: center;
            font-size: 9px;
            color: #95a5a6;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="report-title">{{ $title }}</div>
        <div class="meta-info">Tanggal dibuat: <strong>{{ $generated_at }}</strong> oleh <strong>{{ $user->name }}</strong></div>
    </div>
    
    @if(count($products) > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 6%;" class="text-center">No</th>
                    <th style="width: 35%;">Produk</th>
                    <th style="width: 20%;">Kategori</th>
                    <th style="width: 17%;" class="text-right">Harga</th>
                    
                    @if($type === 'stock')
                        <th style="width: 11%;" class="text-center">Rating</th>
                        <th style="width: 11%;" class="text-center">Stock</th>
                    @elseif($type === 'rating')
                        <th style="width: 11%;" class="text-center">Stock</th>
                        <th style="width: 11%;" class="text-center">Rating</th>
                    @else
                        <th style="width: 22%;" class="text-center">Stock</th>
                    @endif
                </tr>
            </thead>
            <tbody>
                @foreach($products as $index => $product)
                    <tr>
                        <td class="text-center" style="font-weight: 600; color: #7f8c8d;">{{ $index + 1 }}</td>
                        <td class="product-name">{{ $product->name }}</td>
                        <td class="category-name">{{ $product->category ? $product->category->name : '-' }}</td>
                        <td class="text-right price">Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                        
                        @if($type === 'stock')
                            <td class="text-center">
                                @if($product->reviews_avg_rating)
                                    <span class="rating-badge">★ {{ number_format($product->reviews_avg_rating, 1) }}</span>
                                @else
                                    <span style="color: #95a5a6;">-</span>
                                @endif
                            </td>
                            <td class="text-center">
                                <span class="stock-badge {{ $product->stock >= 2 ? 'stock-high' : 'stock-low' }}">
                                    {{ $product->stock }} unit
                                </span>
                            </td>
                        @elseif($type === 'rating')
                            <td class="text-center">
                                <span class="stock-badge {{ $product->stock >= 2 ? 'stock-high' : 'stock-low' }}">
                                    {{ $product->stock }} unit
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="rating-badge">★ {{ number_format($product->reviews_avg_rating, 1) }}</span>
                            </td>
                        @else
                            <td class="text-center">
                                <span class="stock-badge stock-low">{{ $product->stock }} unit</span>
                            </td>
                        @endif
                    </tr>
                @endforeach
            </tbody>
        </table>
        
        <div class="footer">
            <p>Laporan ini digenerate secara otomatis oleh sistem AstroEcomm</p>
            <p>{{ $seller->store_name }} | {{ now()->format('d F Y H:i') }}</p>
        </div>
    @else
        <div class="no-data">
            <p>Tidak ada data produk untuk laporan ini.</p>
        </div>
    @endif
</body>
</html>
