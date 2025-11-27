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
        Schema::table('reviews', function (Blueprint $table) {
            // Tambahkan unique index untuk kombinasi product_id dan reviewer_email
            // Ini memastikan satu email hanya bisa memberikan satu review per produk
            $table->unique(['product_id', 'reviewer_email'], 'reviews_product_email_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Hapus unique index
            $table->dropUnique('reviews_product_email_unique');
        });
    }
};
