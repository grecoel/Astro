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

        // --- IMPLEMENTASI SRS-05---
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Filter Kategori (Opsional, jika user klik ikon kategori)
        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
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