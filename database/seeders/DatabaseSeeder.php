<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@astroecomm.com'],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Admin Astro',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create test seller record
        $seller = Seller::firstOrCreate(
            ['pic_email' => 'seller@test.com'],
            [
                'store_name' => 'Toko Test Seller',
                'store_description' => 'Toko untuk testing seller',
                'pic_name' => 'Test Seller',
                'pic_phone' => '081234567890',
                'pic_email' => 'seller@test.com',
                'pic_address' => 'Jalan Test No. 1',
                'pic_rt' => '01',
                'pic_rw' => '02',
                'pic_district' => 'Kelurahan Test',
                'pic_city' => 'Kota Test',
                'pic_province' => 'Provinsi Test',
                'pic_ktp_number' => '1234567890123456',
                'pic_ktp_file_path' => 'ktp_files/test_ktp.pdf',
                'pic_photo_path' => 'pic_photos/test_photo.jpg',
                'status' => 'ACTIVE',
            ]
        );

        // Create test seller user linked to seller
        User::firstOrCreate(
            ['email' => 'seller@test.com'],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Test Seller',
                'password' => bcrypt('seller123'),
                'role' => 'seller',
                'seller_id' => $seller->id,
                'email_verified_at' => now(),
            ]
        );
    }
}
