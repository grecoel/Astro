<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Review;
use App\Enums\SellerStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for admin
     * SRS-MartPlace-07: Dashboard grafis admin
     */
    public function index()
    {
        // 1. Sebaran jumlah produk berdasarkan kategori
        $productsByCategory = Category::select('categories.id', 'categories.name')
            ->selectRaw('COUNT(products.id) as product_count')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('product_count')
            ->get();

        // 2. Sebaran jumlah toko berdasarkan lokasi provinsi - 3 KATEGORI FILTER
        // Filter "Semua Toko" = ACTIVE + PENDING + REJECTED (20 toko)
        $allSellersByProvince = Seller::select('pic_province as province')
            ->selectRaw('COUNT(*) as seller_count')
            ->whereNotNull('pic_province')
            ->groupBy('pic_province')
            ->orderByDesc('seller_count')
            ->get();

        // Filter "Toko Aktif" = hanya ACTIVE (17 toko)
        $activeSellersByProvince = Seller::select('pic_province as province')
            ->selectRaw('COUNT(*) as seller_count')
            ->where('status', SellerStatus::ACTIVE)
            ->whereNotNull('pic_province')
            ->groupBy('pic_province')
            ->orderByDesc('seller_count')
            ->get();

        // Filter "Toko Tidak Aktif" = PENDING + REJECTED (3 toko)
        $inactiveSellersByProvince = Seller::select('pic_province as province')
            ->selectRaw('COUNT(*) as seller_count')
            ->whereIn('status', [SellerStatus::PENDING, SellerStatus::REJECTED])
            ->whereNotNull('pic_province')
            ->groupBy('pic_province')
            ->orderByDesc('seller_count')
            ->get();

        // Default to "Semua Toko" untuk backward compatibility
        $sellersByProvince = $allSellersByProvince;

        // 3. Jumlah user penjual aktif dan tidak aktif
        $sellerStatus = [
            'active' => Seller::where('status', SellerStatus::ACTIVE)->count(),
            'inactive' => Seller::where('status', SellerStatus::PENDING)->count(),
            'rejected' => Seller::where('status', SellerStatus::REJECTED)->count(),
        ];

        // 4. Jumlah pengunjung yang memberikan komentar dan rating
        $reviewStats = [
            'total_reviews' => Review::count(),
            'total_reviewers' => Review::distinct('reviewer_email')->count('reviewer_email'),
            'reviews_with_comment' => Review::whereNotNull('comment')->where('comment', '!=', '')->count(),
            'reviews_by_rating' => [
                5 => Review::where('rating', 5)->count(),
                4 => Review::where('rating', 4)->count(),
                3 => Review::where('rating', 3)->count(),
                2 => Review::where('rating', 2)->count(),
                1 => Review::where('rating', 1)->count(),
            ],
            'average_rating' => round(Review::avg('rating') ?? 0, 1),
        ];

        // Summary statistics
        $summary = [
            'total_categories' => Category::count(),
            'total_products' => Product::count(),
            'total_products_active' => Product::where('status', 'ACTIVE')->count(),
            'total_sellers' => Seller::count(),
            'pending_verification' => Seller::where('status', SellerStatus::PENDING)->count(),
        ];

        // Get active sellers list for management
        $activeSellers = Seller::where('status', SellerStatus::ACTIVE)
            ->select('id', 'store_name', 'pic_name', 'pic_email', 'pic_province', 'pic_city', 'created_at')
            ->withCount(['products', 'products as active_products_count' => function ($query) {
                $query->where('status', 'ACTIVE');
            }])
            ->orderBy('store_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'products_by_category' => $productsByCategory,
                'sellers_by_province' => $sellersByProvince,
                'sellers_by_province_all' => $allSellersByProvince,
                'sellers_by_province_active' => $activeSellersByProvince,
                'sellers_by_province_inactive' => $inactiveSellersByProvince,
                'seller_status' => $sellerStatus,
                'review_stats' => $reviewStats,
                'active_sellers' => $activeSellers,
            ]
        ]);
    }

    /**
     * Toggle seller status (ACTIVE <-> REJECTED)
     * When seller becomes REJECTED, all their products are deactivated
     */
    public function toggleSellerStatus(Request $request, Seller $seller)
    {
        DB::beginTransaction();
        
        try {
            $previousStatus = $seller->status;
            
            if ($seller->status === SellerStatus::ACTIVE) {
                // Deactivate seller
                $seller->status = SellerStatus::REJECTED;
                $seller->save();
                
                // Deactivate all seller's products
                $deactivatedCount = Product::where('seller_id', $seller->id)
                    ->where('status', 'ACTIVE')
                    ->update(['status' => 'INACTIVE']);
                
                $message = "Seller {$seller->store_name} telah dinonaktifkan. {$deactivatedCount} produk dinonaktifkan.";
            } else {
                // Reactivate seller
                $seller->status = SellerStatus::ACTIVE;
                $seller->save();
                
                // Optionally reactivate products
                $reactivatedCount = Product::where('seller_id', $seller->id)
                    ->where('status', 'INACTIVE')
                    ->update(['status' => 'ACTIVE']);
                
                $message = "Seller {$seller->store_name} telah diaktifkan kembali. {$reactivatedCount} produk diaktifkan.";
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'seller_id' => $seller->id,
                    'store_name' => $seller->store_name,
                    'previous_status' => $previousStatus->value,
                    'new_status' => $seller->status->value,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status seller: ' . $e->getMessage()
            ], 500);
        }
    }
}
