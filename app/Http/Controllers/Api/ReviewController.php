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

        // 2. Cek apakah email sudah pernah review produk ini
        $existingReview = Review::where('product_id', $request->product_id)
            ->where('reviewer_email', $request->reviewer_email)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'Email Anda sudah pernah memberikan review untuk produk ini. Setiap email hanya dapat memberikan satu review per produk.'
            ], 422);
        }

        // 3. Simpan
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

        // 4. Ambil data produk untuk email
        $product = Product::find($request->product_id);

        // 5. Kirim email ucapan terima kasih (async dengan timeout handling)
        // Jalankan di background menggunakan Laravel's defer
        if (function_exists('defer')) {
            defer(function () use ($review, $product) {
                $this->sendReviewThankYouEmail($review, $product);
            });
        } else {
            // Fallback: kirim langsung dengan timeout yang lebih toleran
            $this->sendReviewThankYouEmail($review, $product);
        }

        return response()->json(['message' => 'Review berhasil dikirim! Terima kasih atas penilaian Anda.', 'data' => $review], 201);
    }

    /**
     * Send review thank you email with timeout handling
     */
    private function sendReviewThankYouEmail($review, $product)
    {
        try {
            // Allow script to continue even if user closes connection
            ignore_user_abort(true);
            
            // Set max execution time untuk email saja (120 detik)
            set_time_limit(120);

            Mail::send('emails.review-thankyou', [
                'reviewerName' => $review->reviewer_name,
                'productName' => $product->name ?? 'Produk',
                'rating' => $review->rating,
                'comment' => $review->comment,
            ], function ($message) use ($review) {
                $message->to($review->reviewer_email, $review->reviewer_name)
                        ->subject('Terima Kasih atas Review - AstroEcomm');
            });

            Log::info('Review thank you email sent successfully to: ' . $review->reviewer_email);
        } catch (\Symfony\Component\Mailer\Exception\TransportException $e) {
            // SMTP specific error
            Log::error('SMTP Transport Error when sending review email', [
                'error' => $e->getMessage(),
                'reviewer_email' => $review->reviewer_email,
                'product_id' => $review->product_id,
            ]);
        } catch (\Exception $e) {
            // General error
            Log::error('Failed to send review thank you email', [
                'error' => $e->getMessage(),
                'reviewer_email' => $review->reviewer_email,
                'product_id' => $review->product_id,
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}