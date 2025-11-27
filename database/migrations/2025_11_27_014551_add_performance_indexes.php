<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Index untuk Tabel Products
        Schema::table('products', function (Blueprint $table) {
            // Index kolom seller_id agar relasi ke Seller cepat
            $table->index('seller_id'); 
            // Index kolom category_id agar filter kategori cepat
            $table->index('category_id');
        });

        // 2. Index untuk Tabel Reviews (PENTING BANGET)
        Schema::table('reviews', function (Blueprint $table) {
            // Agar saat buka Detail Produk, loading reviewnya instan
            $table->index('product_id'); 
        });

        // 3. Index untuk Tabel Product Images
        Schema::table('product_images', function (Blueprint $table) {
            // Agar loading galeri gambar instan
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kalau di-rollback, cuma hapus indexnya saja, DATA TETAP AMAN
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['seller_id']);
            $table->dropIndex(['category_id']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['product_id']);
        });

        Schema::table('product_images', function (Blueprint $table) {
            $table->dropIndex(['product_id']);
        });
    }
};