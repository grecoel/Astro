<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

class CatalogController extends Controller
{
    /**
     * Endpoint Utama Homepage
     * GET /api/catalog
     */
    public function index(Request $request)
    {
        // 1. Ambil Banner (Hanya yang aktif)
        $banners = Banner::where('is_active', true)->latest()->get();

        // 2. Ambil Kategori
        $categories = Category::orderBy('name')->get();

        // 3. Ambil Produk (Yang statusnya ACTIVE)
        $query = Product::with(['category', 'images', 'seller']) 
            ->select([
                'products.*',
                DB::raw('COALESCE(ROUND(AVG(reviews.rating), 1), 0.0) as rating_avg'),
                DB::raw('COUNT(reviews.id) as rating_count')
            ])
            ->leftJoin('reviews', 'products.id', '=', 'reviews.product_id')
            ->groupBy('products.id')
            ->where('products.status', 'ACTIVE');

        // --- IMPLEMENTASI SRS-05: PENCARIAN PRODUK ---
        // A. FILTER SEARCH (nama produk, deskripsi, nama toko)
        if ($request->has('search') && $request->search != '') {
            $keyword = $request->search;
            $query->where(function($q) use ($keyword) {
                $q->where('products.name', 'LIKE', "%{$keyword}%")
                  ->orWhere('products.description', 'LIKE', "%{$keyword}%")
                  ->orWhereHas('seller', function($sq) use ($keyword) {
                      $sq->where('store_name', 'LIKE', "%{$keyword}%");
                  });
            });
        }

        // B. FILTER KATEGORI (Menerima Array atau Single)
        // Contoh URL: ?categories[]=uuid-1&categories[]=uuid-2
        if ($request->has('categories')) {
            $cats = is_array($request->categories) ? $request->categories : explode(',', $request->categories);
            $query->whereIn('category_id', $cats);
        }

        // C. FILTER LOKASI (Provinsi & Kota)
        // Kita gabung saja logic-nya: mencari di kolom province ATAU city
        if ($request->has('locations')) {
            $locs = is_array($request->locations) ? $request->locations : explode(',', $request->locations);
            
            $query->whereHas('seller', function($q) use ($locs) {
                $q->where(function($sub) use ($locs) {
                    foreach ($locs as $loc) {
                        $sub->orWhere('pic_province', 'LIKE', "%{$loc}%")
                            ->orWhere('pic_city', 'LIKE', "%{$loc}%");
                    }
                });
            });
        }

        // Ambil data dengan Pagination (24 produk per load)
        $products = $query->latest()->paginate(24);

        return response()->json([
            'banners' => $banners,
            'categories' => $categories,
            'products' => $products
        ]);
    }

    public function show($id)
    {
        // 1. Ambil produk dengan semua relasi penting
        $product = Product::with(['seller', 'category', 'images', 'reviews'])
            ->where('status', 'ACTIVE')
            ->findOrFail($id);

        // 2. Hitung Statistik Rating untuk UI
        // Contoh output: [5 => 10, 4 => 2, 3 => 0, ...]
        $ratingCounts = [
            5 => $product->reviews->where('rating', 5)->count(),
            4 => $product->reviews->where('rating', 4)->count(),
            3 => $product->reviews->where('rating', 3)->count(),
            2 => $product->reviews->where('rating', 2)->count(),
            1 => $product->reviews->where('rating', 1)->count(),
        ];

        $totalReviews = $product->reviews->count();
        
        // Hitung rata-rata rating produk
        $ratingAvg = $totalReviews > 0 
            ? round($product->reviews->avg('rating'), 1) 
            : 0.0;
        
        // Tambahkan rating_avg ke product object
        $product->rating_avg = $ratingAvg;

        // 3. Hitung rata-rata rating seller dari semua produknya
        $sellerAvgRating = 0;
        $sellerTotalReviews = 0;
        
        try {
            if ($product->seller && $product->seller_id) {
                $sellerProducts = Product::where('seller_id', $product->seller_id)
                    ->where('status', 'ACTIVE')
                    ->withAvg('reviews', 'rating')
                    ->withCount('reviews')
                    ->get();
                
                $totalRating = 0;
                $totalReviews = 0;
                
                foreach ($sellerProducts as $prod) {
                    if ($prod->reviews_count > 0 && $prod->reviews_avg_rating) {
                        $totalRating += ($prod->reviews_avg_rating * $prod->reviews_count);
                        $totalReviews += $prod->reviews_count;
                    }
                }
                
                if ($totalReviews > 0) {
                    $sellerAvgRating = round($totalRating / $totalReviews, 1);
                }
                $sellerTotalReviews = $totalReviews;
            }
        } catch (\Exception $e) {
            // Jika error, biarkan default 0
            \Log::warning('Error calculating seller rating: ' . $e->getMessage());
        }

        return response()->json([
            'product' => $product,
            'rating_counts' => $ratingCounts,
            'total_reviews' => $totalReviews,
            'seller_avg_rating' => $sellerAvgRating,
            'seller_total_reviews' => $sellerTotalReviews,
        ]);
    }
}