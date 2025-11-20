<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder {
    public function run(): void
    {
        $categories = ['Makanan & Minuman', 'Alat Lab', 'Elektronik', 'Skincare', 'Alat Olahraga', 
        'Pakaian', 'Buku', 'Dapur', 'Film & Musik', 'Gaming', 'Kesehatan', 'Logam Mulia', 'Mainan & Hobi', 
        'Otomotif', 'Bodycare', 'Pertukangan'];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat]); 
        }
    }
}
