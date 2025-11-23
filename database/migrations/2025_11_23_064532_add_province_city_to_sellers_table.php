<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sellers', function (Blueprint $table) {
            // Kita gunakan 'nullable()' agar data lama tidak error/hilang
            // Kita taruh setelah kolom 'address' agar rapi
            
            if (!Schema::hasColumn('sellers', 'province')) {
                $table->string('province')->nullable()->after('address');
            }
            
            if (!Schema::hasColumn('sellers', 'city')) {
                $table->string('city')->nullable()->after('province');
            }
        });
    }

    public function down(): void
    {
        // Jika migrasi dibatalkan, hanya kolom ini yang dihapus
        // Data nama toko, alamat lama, dll TETAP AMAN
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn(['province', 'city']);
        });
    }
};