<?php

namespace Database\Seeders;

use App\Models\User;
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

        // Optional: Create test seller user
        User::firstOrCreate(
            ['email' => 'seller@test.com'],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'name' => 'Test Seller',
                'password' => bcrypt('seller123'),
                'role' => 'seller',
                'email_verified_at' => now(),
            ]
        );
    }
}
