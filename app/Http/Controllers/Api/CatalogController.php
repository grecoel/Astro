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
}