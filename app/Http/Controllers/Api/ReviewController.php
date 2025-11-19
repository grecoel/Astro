<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use App\Services\SupabaseStorageService;

class ReviewController extends Controller
{
    protected $supabaseStorage;

    public function __construct(SupabaseStorageService $supabaseStorage)
    {
        $this->supabaseStorage = $supabaseStorage;
    }

    /**
     * Menampilkan semua review dari sebuah produk.
     */
    public function index($productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }

        $reviews = Review::where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Daftar review berhasil diambil.',
            'data' => $reviews
        ]);
    }

    /**
     * Menambah review baru.
     */
    public function store(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'user_id'   => 'required|exists:users,id',
            'rating'    => 'required|integer|min:1|max:5',
            'review'    => 'nullable|string',
            'photo'     => 'nullable|image|max:4096', // 4 MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }

        $photoPath = null;

        try {
            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $filename = 'review_photos/' . uniqid() . '_' . $file->getClientOriginalName();
                $photoPath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $review = Review::create([
                'product_id' => $productId,
                'user_id' => $request->user_id,
                'rating' => $request->rating,
                'review' => $request->review,
                'photo_path' => $photoPath,
            ]);

            return response()->json([
                'message' => 'Review berhasil ditambahkan.',
                'data' => $review
            ], 201);

        } catch (\Exception $e) {
            if ($photoPath) {
                $this->supabaseStorage->delete($photoPath);
            }

            return response()->json([
                'message' => 'Gagal menambah review.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update review.
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating'    => 'sometimes|required|integer|min:1|max:5',
            'review'    => 'nullable|string',
            'photo'     => 'nullable|image|max:4096',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $photoPath = $review->photo_path;

        try {
            if ($request->hasFile('photo')) {
                if ($photoPath) {
                    $this->supabaseStorage->delete($photoPath);
                }

                $file = $request->file('photo');
                $filename = 'review_photos/' . uniqid() . '_' . $file->getClientOriginalName();
                $photoPath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $review->update([
                'rating' => $request->rating ?? $review->rating,
                'review' => $request->review ?? $review->review,
                'photo_path' => $photoPath,
            ]);

            return response()->json([
                'message' => 'Review berhasil diperbarui.',
                'data' => $review
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui review.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus review.
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review tidak ditemukan.'], 404);
        }

        if ($review->photo_path) {
            $this->supabaseStorage->delete($review->photo_path);
        }

        $review->delete();

        return response()->json(['message' => 'Review berhasil dihapus.']);
    }
}