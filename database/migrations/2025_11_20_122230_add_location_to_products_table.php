<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Cek dulu biar aman, kalau belum ada baru dibuat
            if (!Schema::hasColumn('products', 'location')) {
                $table->string('location')->nullable()->after('name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'location')) {
                $table->dropColumn('location');
            }
        });
    }
};