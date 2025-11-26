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
            // Cek dulu biar aman, kalau belum ada baru buat
            if (!Schema::hasColumn('reviews', 'reviewer_city')) {
                $table->string('reviewer_city')->nullable()->after('reviewer_province');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('reviewer_city');
        });
    }
};
