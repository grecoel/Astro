<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
            
            // Biodata (Sesuai kolom tabel Anda)
            'reviewer_name' => 'required|string',
            'reviewer_phone' => 'required|string',
            'reviewer_email' => 'required|email',
            'reviewer_province' => 'required|string',
            'reviewer_city' => 'required|string', // Wajib diisi karena ada di UI
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Simpan
        $review = Review::create([
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'reviewer_name' => $request->reviewer_name,
            'reviewer_phone' => $request->reviewer_phone,
            'reviewer_email' => $request->reviewer_email,
            'reviewer_province' => $request->reviewer_province,
            'reviewer_city' => $request->reviewer_city,
        ]);

        // 3. Ambil data produk untuk email
        $product = Product::find($request->product_id);

        // 4. Kirim email ucapan terima kasih
        try {
            Mail::send('emails.review-thankyou', [
                'reviewerName' => $review->reviewer_name,
                'productName' => $product->name ?? 'Produk',
                'rating' => $review->rating,
                'comment' => $review->comment,
            ], function ($message) use ($review) {
                $message->to($review->reviewer_email, $review->reviewer_name)
                        ->subject('Terima Kasih atas Review Anda - AstroEcomm');
            });
        } catch (\Exception $e) {
            // Log error tapi tetap return success karena review sudah tersimpan
            Log::error('Failed to send review thank you email: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Review berhasil dikirim! Terima kasih atas penilaian Anda.', 'data' => $review], 201);
    }
}