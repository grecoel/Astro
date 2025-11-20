<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SellerProductController extends Controller
{
    // GET /api/seller/products (List semua produk seller)
    public function index()
    {
        try {
            $user = auth()->user();
            $sellerId = $user->seller_id;

            if (!$sellerId) {
                return response()->json(['error' => 'User tidak terhubung ke Seller profile'], 403);
            }

            $products = Product::where('seller_id', $sellerId)
                ->with('category', 'images')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json(['data' => $products]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal mengambil produk', 'message' => $e->getMessage()], 500);
        }
    }

    // GET /api/seller/products/create (Untuk isi dropdown kategori)
    public function create()
    {
        return response()->json([
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    // POST /api/seller/products (Upload)
    public function store(Request $request)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'condition' => 'required|in:Baru,Bekas',
            'price' => 'required|numeric|min:100',
            'stock' => 'required|integer|min:1',
            'weight' => 'nullable|numeric|min:1',
            'description' => 'required|string',
            'location' => 'required|string',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'image|max:2048',
            'status' => 'required|in:DRAFT,ACTIVE',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // 2. Simpan Produk Utama
            $user = auth()->user();
            $sellerId = $user->seller_id;

            if (!$sellerId) {
                return response()->json(['error' => 'User tidak terhubung ke Seller profile'], 403);
            }

            $product = Product::create([
                'seller_id' => $sellerId,
                'category_id' => $request->category_id,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'condition' => $request->condition,
                'location' => $request->location,
                'status' => $request->status,
                'weight' => $request->weight ?? 1000,
            ]);

            // 3. Upload & Simpan Gambar (Looping)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    // Nama file unik
                    $filename = Str::uuid() . '.' . $file->extension();
                    
                    // Upload ke Disk 'supabase_products'
                    Storage::disk('supabase_products')->putFileAs('', $file, $filename);

                    // Simpan path ke DB
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $filename,
                        'is_primary' => $index === 0,
                    ]);
                }
            }

            DB::commit();

            // Return dengan relasi images
            $product->load('images');
            
            return response()->json([
                'message' => 'Produk berhasil disimpan!',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Upload produk error:', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'error' => 'Gagal menyimpan produk',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}