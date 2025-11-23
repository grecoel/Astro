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
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Relasi ke Produk
            $table->foreignUuid('product_id')->constrained('products')->onDelete('cascade');
            
            // Data Reviewer (Pengunjung Umum)
            $table->string('reviewer_name');
            $table->string('reviewer_phone');
            $table->string('reviewer_email');
            $table->string('reviewer_province'); // Kita simpan nama provinsinya saja
            
            // Isi Review
            $table->integer('rating'); // 1 sampai 5
            $table->text('comment')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
