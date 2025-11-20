<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Update tabel products (jika belum ada kolomnya)
        Schema::table('products', function (Blueprint $table) {
            // Tambahkan kolom jika belum ada di migrasi awal Anda
            if (!Schema::hasColumn('products', 'weight')) {
                $table->integer('weight')->default(1000); // Gram
                $table->string('status')->default('DRAFT'); // DRAFT / ACTIVE
                $table->integer('stock')->default(0);
                // Pastikan category_id dan seller_id sudah ada dari migrasi sebelumnya
            }
        });

        // 2. Tabel Foto Produk (One-to-Many)
        Schema::create('product_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->onDelete('cascade');
            $table->string('image_path'); // Path di Supabase
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        // 3. Tabel Master Metode Pengiriman (JNE, J&T, dll)
        Schema::create('shipping_methods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code'); // JNE, JNT, SICEPAT
            $table->string('name'); // JNE Reguler, dll
            $table->timestamps();
        });

        // 4. Tabel Pivot Produk <-> Pengiriman (Many-to-Many)
        Schema::create('product_shipping_method', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('shipping_method_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_shipping_method');
        Schema::dropIfExists('shipping_methods');
        Schema::dropIfExists('product_images');
        // (Opsional: drop columns from products)
    }
};