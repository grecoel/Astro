<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Review;
use App\Enums\SellerStatus;
use Illuminate\Http\Request;
use Mpdf\Mpdf;

class ReportController extends Controller
{
    /**
     * Get sellers data for report preview
     * SRS: Admin bisa mendapatkan laporan daftar akun penjual aktif dan tidak aktif
     */
    public function getSellersData(Request $request)
    {
        try {
            // Get current date and user info
            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Get all sellers sorted by status (Active first, then Inactive/Rejected)
            $sellers = Seller::orderByRaw("
                    CASE 
                        WHEN status = 'ACTIVE' THEN 1 
                        ELSE 2 
                    END
                ")
                ->orderBy('store_name', 'asc')
                ->get()
                ->map(function ($seller, $index) {
                    $isActive = $seller->status->value === 'ACTIVE';
                    
                    return [
                        'no' => $index + 1,
                        'nama_user' => $seller->pic_email ?? '-',
                        'nama_pic' => $seller->pic_name ?? '-',
                        'nama_toko' => $seller->store_name ?? '-',
                        'status' => $isActive ? 'Aktif' : 'Tidak Aktif',
                        'status_raw' => $seller->status->value,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $sellers,
                'generated_by' => $generatedBy,
                'generated_date' => $generatedDate,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getSellersData: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjual: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF report for sellers
     */
    public function generateSellersPdf(Request $request)
    {
        try {
        // Get all sellers sorted by status
        $sellers = Seller::orderByRaw("
                CASE 
                    WHEN status = 'ACTIVE' THEN 1 
                    ELSE 2 
                END
            ")
            ->orderBy('store_name', 'asc')
            ->get();            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Create PDF
            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4',
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 20,
                'margin_bottom' => 20,
            ]);

            // Build HTML content
            $html = $this->buildPdfHtml($sellers, $generatedBy, $generatedDate);
            
            $mpdf->WriteHTML($html);
            
            // Output PDF
            $filename = 'Laporan_Penjual_' . now()->format('Y-m-d_His') . '.pdf';
            return response($mpdf->Output($filename, 'S'))
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sellers data grouped by province for report preview
     * SRS: Laporan daftar penjual (toko) untuk setiap lokasi provinsi
     */
    public function getSellersDataByProvince(Request $request)
    {
        try {
            // Get current date and user info
            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Get all active sellers sorted by province then store name
            $sellers = Seller::where('status', SellerStatus::ACTIVE)
                ->orderBy('pic_province', 'asc')
                ->orderBy('store_name', 'asc')
                ->get()
                ->map(function ($seller, $index) {
                    return [
                        'no' => $index + 1,
                        'nama_toko' => $seller->store_name ?? '-',
                        'nama_pic' => $seller->pic_name ?? '-',
                        'provinsi' => $seller->pic_province ?? 'Tidak Diketahui',
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $sellers,
                'meta' => [
                    'total_sellers' => $sellers->count(),
                    'generated_by' => $generatedBy,
                    'generated_date' => $generatedDate,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getSellersDataByProvince: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjual per provinsi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF report for sellers grouped by province
     */
    public function generateSellersByProvincePdf(Request $request)
    {
        try {
            // Get all active sellers sorted by province
            $sellers = Seller::where('status', SellerStatus::ACTIVE)
                ->orderBy('pic_province', 'asc')
                ->orderBy('store_name', 'asc')
                ->get();
            
            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Create PDF
            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4',
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 20,
                'margin_bottom' => 20,
            ]);

            // Build HTML content
            $html = $this->buildProvinceReportPdfHtml($sellers, $generatedBy, $generatedDate);
            
            $mpdf->WriteHTML($html);
            
            // Output PDF
            $filename = 'Laporan_Toko_Per_Provinsi_' . now()->format('Y-m-d_His') . '.pdf';
            return response($mpdf->Output($filename, 'S'))
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Build HTML content for province report PDF
     */
    private function buildProvinceReportPdfHtml($sellers, $generatedBy, $generatedDate)
    {
        // Get logo path
        $logoPath = public_path('logo.png');
        $logoData = '';
        if (file_exists($logoPath)) {
            $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @page {
                    margin: 20mm 15mm;
                }
                body {
                    font-family: "Helvetica", Arial, sans-serif;
                    font-size: 10pt;
                    color: #333;
                    line-height: 1.4;
                }
                
                /* Layout Tables */
                .layout-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: none;
                }
                .layout-table td {
                    border: none;
                    padding: 0;
                    vertical-align: middle;
                }

                /* Header */
                .header-container {
                    border-bottom: 3px solid #667A30;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .company-name {
                    font-size: 20pt;
                    font-weight: bold;
                    color: #667A30;
                    margin: 0;
                    letter-spacing: -0.5px;
                }
                .company-tagline {
                    font-size: 9pt;
                    color: #666;
                    margin: 2px 0 0 0;
                }
                .logo {
                    width: 60px;
                    height: auto;
                }

                /* Report Info */
                .report-info {
                    background-color: #f8f9f8;
                    border-left: 4px solid #667A30;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .report-title {
                    font-size: 14pt;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                }
                .meta-table {
                    width: 100%;
                    font-size: 9pt;
                }
                .meta-table td {
                    padding: 2px 0;
                    border: none;
                }
                .meta-label {
                    font-weight: bold;
                    color: #555;
                    width: 140px;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 9pt;
                }
                .data-table th {
                    background-color: #667A30;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    font-weight: bold;
                    border: 1px solid #556628;
                    text-transform: uppercase;
                }
                .data-table td {
                    padding: 8px 10px;
                    border: 1px solid #ddd;
                    color: #333;
                }
                .data-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }

                /* Footer */
                .footer-container {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    font-size: 8pt;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="header-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 70px;">
                            ' . ($logoData ? '<img src="' . $logoData . '" class="logo">' : '') . '
                        </td>
                        <td>
                            <div class="company-name">AstroEcomm</div>
                            <div class="company-tagline">Marketplace Platform</div>
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            <div style="font-size: 9pt; color: #888;">Laporan Resmi</div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Report Info -->
            <div class="report-info">
                <div class="report-title">Laporan Daftar Toko Berdasarkan Lokasi Provinsi</div>
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Tanggal Dibuat</td>
                        <td>: ' . $generatedDate . ' oleh ' . $generatedBy . '</td>
                    </tr>
                </table>
            </div>

            <!-- Data Table -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 8%; text-align: center;">No</th>
                        <th style="width: 35%;">Nama Toko</th>
                        <th style="width: 32%;">Nama PIC</th>
                        <th style="width: 25%;">Provinsi</th>
                    </tr>
                </thead>
                <tbody>';
        
        foreach ($sellers as $index => $seller) {
            $no = $index + 1;
            $namaToko = $seller->store_name ?? '-';
            $namaPic = $seller->pic_name ?? '-';
            $provinsi = $seller->pic_province ?? 'Tidak Diketahui';
            
            $html .= '
                    <tr>
                        <td style="text-align: center;">' . $no . '</td>
                        <td>' . htmlspecialchars($namaToko) . '</td>
                        <td>' . htmlspecialchars($namaPic) . '</td>
                        <td>' . htmlspecialchars($provinsi) . '</td>
                    </tr>';
        }
        
        $html .= '
                </tbody>
            </table>

            <!-- Footer -->
            <div class="footer-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 50%;">
                            <strong>AstroEcomm</strong> - Marketplace Platform<br>
                            <i style="font-size: 7pt;">***) Diurutkan berdasarkan provinsi</i>
                        </td>
                        <td style="width: 50%; text-align: right; vertical-align: top;">
                            Halaman 1 dari 1<br>
                            Dicetak: ' . now()->format('d/m/Y H:i') . '
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>';
        
        return $html;
    }

    /**
     * Build HTML content for PDF
     */
    private function buildPdfHtml($sellers, $generatedBy, $generatedDate)
    {
        // Get logo path
        $logoPath = public_path('logo.png');
        $logoData = '';
        if (file_exists($logoPath)) {
            $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @page {
                    margin: 20mm 15mm;
                }
                body {
                    font-family: "Helvetica", Arial, sans-serif;
                    font-size: 10pt;
                    color: #333;
                    line-height: 1.4;
                }
                
                /* Layout Tables */
                .layout-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: none;
                }
                .layout-table td {
                    border: none;
                    padding: 0;
                    vertical-align: middle;
                }

                /* Header */
                .header-container {
                    border-bottom: 3px solid #667A30;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .company-name {
                    font-size: 20pt;
                    font-weight: bold;
                    color: #667A30;
                    margin: 0;
                    letter-spacing: -0.5px;
                }
                .company-tagline {
                    font-size: 9pt;
                    color: #666;
                    margin: 2px 0 0 0;
                }
                .logo {
                    width: 60px;
                    height: auto;
                }

                /* Report Info */
                .report-info {
                    background-color: #f8f9f8;
                    border-left: 4px solid #667A30;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .report-title {
                    font-size: 14pt;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                }
                .meta-table {
                    width: 100%;
                    font-size: 9pt;
                }
                .meta-table td {
                    padding: 2px 0;
                    border: none;
                }
                .meta-label {
                    font-weight: bold;
                    color: #555;
                    width: 100px;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 9pt;
                }
                .data-table th {
                    background-color: #667A30;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    font-weight: bold;
                    border: 1px solid #556628;
                    text-transform: uppercase;
                }
                .data-table td {
                    padding: 8px 10px;
                    border: 1px solid #ddd;
                    color: #333;
                }
                .data-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                
                /* Status Styles */
                .status-active {
                    color: #667A30;
                    font-weight: bold;
                }
                .status-inactive {
                    color: #FF6B6B;
                    font-weight: bold;
                }

                /* Footer */
                .footer-container {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    font-size: 8pt;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="header-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 70px;">
                            ' . ($logoData ? '<img src="' . $logoData . '" class="logo">' : '') . '
                        </td>
                        <td>
                            <div class="company-name">AstroEcomm</div>
                            <div class="company-tagline">Marketplace Platform</div>
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            <div style="font-size: 9pt; color: #888;">Laporan Resmi</div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Report Info -->
            <div class="report-info">
                <div class="report-title">Laporan Daftar Akun Penjual</div>
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Tanggal</td>
                        <td>: ' . $generatedDate . '</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Dicetak Oleh</td>
                        <td>: ' . $generatedBy . '</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Total Data</td>
                        <td>: ' . count($sellers) . ' Penjual</td>
                    </tr>
                </table>
            </div>

            <!-- Data Table -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 5%; text-align: center;">No</th>
                        <th style="width: 25%;">Nama User</th>
                        <th style="width: 25%;">Nama PIC</th>
                        <th style="width: 30%;">Nama Toko</th>
                        <th style="width: 15%;">Status</th>
                    </tr>
                </thead>
                <tbody>';
        
        foreach ($sellers as $index => $seller) {
            $no = $index + 1;
            $namaUser = $seller->pic_email ?? '-';
            $namaPic = $seller->pic_name ?? '-';
            $namaToko = $seller->store_name ?? '-';
            $isActive = $seller->status->value === 'ACTIVE';
            $status = $isActive ? 'Aktif' : 'Tidak Aktif';
            $statusClass = $isActive ? 'status-active' : 'status-inactive';
            
            $html .= '
                    <tr>
                        <td style="text-align: center;">' . $no . '</td>
                        <td>' . htmlspecialchars($namaUser) . '</td>
                        <td>' . htmlspecialchars($namaPic) . '</td>
                        <td>' . htmlspecialchars($namaToko) . '</td>
                        <td><span class="' . $statusClass . '">' . $status . '</span></td>
                    </tr>';
        }
        
        $html .= '
                </tbody>
            </table>

            <!-- Footer -->
            <div class="footer-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 50%;">
                            <strong>AstroEcomm</strong> - Marketplace Platform<br>
                            <i style="font-size: 7pt;">Dokumen ini digenerate secara otomatis oleh sistem</i>
                        </td>
                        <td style="width: 50%; text-align: right; vertical-align: top;">
                            Halaman 1 dari 1<br>
                            Dicetak: ' . now()->format('d/m/Y H:i') . '
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>';
        
        return $html;
    }

    /**
     * Get products with ratings data for report preview
     * SRS: Laporan daftar produk dan ratingnya yang diurutkan berdasarkan rating secara menurun
     */
    public function getProductsByRatingData(Request $request)
    {
        try {
            // Get current date and user info
            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Get all products with reviews, ordered by average rating descending
            $products = Product::with(['reviews', 'seller', 'category'])
                ->whereHas('reviews')
                ->get()
                ->map(function ($product) {
                    $avgRating = $product->reviews->avg('rating');
                    $reviewerProvince = $product->reviews->first()->reviewer_province ?? 'Tidak Diketahui';
                    
                    return [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'category_name' => $product->category->name ?? '-',
                        'price' => $product->price,
                        'rating' => round($avgRating, 1),
                        'store_name' => $product->seller->store_name ?? '-',
                        'province' => $reviewerProvince,
                    ];
                })
                ->sortByDesc('rating')
                ->values()
                ->map(function ($item, $index) {
                    return array_merge(['no' => $index + 1], $item);
                });

            return response()->json([
                'success' => true,
                'data' => $products,
                'meta' => [
                    'total_products' => $products->count(),
                    'generated_by' => $generatedBy,
                    'generated_date' => $generatedDate,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getProductsByRatingData: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produk berdasarkan rating: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF report for products ordered by rating
     */
    public function generateProductsByRatingPdf(Request $request)
    {
        try {
            // Get all products with reviews, ordered by rating
            $products = Product::with(['reviews', 'seller', 'category'])
                ->whereHas('reviews')
                ->get()
                ->map(function ($product) {
                    $avgRating = $product->reviews->avg('rating');
                    $reviewerProvince = $product->reviews->first()->reviewer_province ?? 'Tidak Diketahui';
                    
                    return [
                        'product_name' => $product->name,
                        'category_name' => $product->category->name ?? '-',
                        'price' => $product->price,
                        'rating' => round($avgRating, 1),
                        'store_name' => $product->seller->store_name ?? '-',
                        'province' => $reviewerProvince,
                    ];
                })
                ->sortByDesc('rating')
                ->values();
            
            $generatedBy = auth()->user()->name;
            $generatedDate = now()->format('d-m-Y');
            
            // Create PDF
            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4-L',
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 20,
                'margin_bottom' => 20,
            ]);

            // Build HTML content
            $html = $this->buildProductRatingReportPdfHtml($products, $generatedBy, $generatedDate);
            
            $mpdf->WriteHTML($html);
            
            // Output PDF
            $filename = 'Laporan_Produk_Rating_' . now()->format('Y-m-d_His') . '.pdf';
            return response($mpdf->Output($filename, 'S'))
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Build HTML content for product rating report PDF
     */
    private function buildProductRatingReportPdfHtml($products, $generatedBy, $generatedDate)
    {
        // Get logo path
        $logoPath = public_path('logo.png');
        $logoData = '';
        if (file_exists($logoPath)) {
            $logoData = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @page {
                    margin: 20mm 15mm;
                }
                body {
                    font-family: "Helvetica", Arial, sans-serif;
                    font-size: 9pt;
                    color: #333;
                    line-height: 1.4;
                }
                
                /* Layout Tables */
                .layout-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: none;
                }
                .layout-table td {
                    border: none;
                    padding: 0;
                    vertical-align: middle;
                }

                /* Header */
                .header-container {
                    border-bottom: 3px solid #667A30;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .company-name {
                    font-size: 20pt;
                    font-weight: bold;
                    color: #667A30;
                    margin: 0;
                    letter-spacing: -0.5px;
                }
                .company-tagline {
                    font-size: 9pt;
                    color: #666;
                    margin: 2px 0 0 0;
                }
                .logo {
                    width: 60px;
                    height: auto;
                }

                /* Report Info */
                .report-info {
                    background-color: #f8f9f8;
                    border-left: 4px solid #667A30;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .report-title {
                    font-size: 14pt;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                }
                .meta-table {
                    width: 100%;
                    font-size: 9pt;
                }
                .meta-table td {
                    padding: 2px 0;
                    border: none;
                }
                .meta-label {
                    font-weight: bold;
                    color: #555;
                    width: 140px;
                }

                /* Data Table */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 8pt;
                }
                .data-table th {
                    background-color: #667A30;
                    color: white;
                    padding: 10px 8px;
                    text-align: left;
                    font-weight: bold;
                    border: 1px solid #556628;
                    text-transform: uppercase;
                }
                .data-table td {
                    padding: 8px;
                    border: 1px solid #ddd;
                    color: #333;
                }
                .data-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }

                /* Footer */
                .footer-container {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    font-size: 8pt;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="header-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 70px;">
                            ' . ($logoData ? '<img src="' . $logoData . '" class="logo">' : '') . '
                        </td>
                        <td>
                            <div class="company-name">AstroEcomm</div>
                            <div class="company-tagline">Marketplace Platform</div>
                        </td>
                        <td style="text-align: right; vertical-align: bottom;">
                            <div style="font-size: 9pt; color: #888;">Laporan Resmi</div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Report Info -->
            <div class="report-info">
                <div class="report-title">Laporan Daftar Produk Berdasarkan Rating</div>
                <table class="meta-table">
                    <tr>
                        <td class="meta-label">Tanggal Dibuat</td>
                        <td>: ' . $generatedDate . ' oleh ' . $generatedBy . '</td>
                    </tr>
                </table>
            </div>

            <!-- Data Table -->
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 5%; text-align: center;">No</th>
                        <th style="width: 25%;">Produk</th>
                        <th style="width: 15%;">Kategori</th>
                        <th style="width: 12%; text-align: right;">Harga</th>
                        <th style="width: 8%; text-align: center;">Rating</th>
                        <th style="width: 18%;">Nama Toko</th>
                        <th style="width: 17%;">Provinsi</th>
                    </tr>
                </thead>
                <tbody>';
        
        foreach ($products as $index => $product) {
            $no = $index + 1;
            $productName = $product['product_name'] ?? '-';
            $category = $product['category_name'] ?? '-';
            $price = 'Rp ' . number_format($product['price'] ?? 0, 0, ',', '.');
            $rating = $product['rating'] ?? 0;
            $storeName = $product['store_name'] ?? '-';
            $province = $product['province'] ?? 'Tidak Diketahui';
            
            $html .= '
                    <tr>
                        <td style="text-align: center;">' . $no . '</td>
                        <td>' . htmlspecialchars($productName) . '</td>
                        <td>' . htmlspecialchars($category) . '</td>
                        <td style="text-align: right;">' . $price . '</td>
                        <td style="text-align: center;">' . $rating . '</td>
                        <td>' . htmlspecialchars($storeName) . '</td>
                        <td>' . htmlspecialchars($province) . '</td>
                    </tr>';
        }
        
        $html .= '
                </tbody>
            </table>

            <!-- Footer -->
            <div class="footer-container">
                <table class="layout-table">
                    <tr>
                        <td style="width: 50%;">
                            <strong>AstroEcomm</strong> - Marketplace Platform<br>
                            <i style="font-size: 7pt;">***) Provinsi diisikan provinsi pemberi rating</i>
                        </td>
                        <td style="width: 50%; text-align: right; vertical-align: top;">
                            Halaman 1 dari 1<br>
                            Dicetak: ' . now()->format('d/m/Y H:i') . '
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>';
        
        return $html;
    }
}
