<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ReviewsSeeder extends Seeder
{
    /**
     * Daftar nama-nama Indonesia yang realistis
     */
    private $firstNames = [
        'Andi', 'Budi', 'Citra', 'Dinda', 'Eko', 'Fitri', 'Gilang', 'Hana', 'Indra', 'Joko',
        'Kartika', 'Lestari', 'Made', 'Nurul', 'Oka', 'Putri', 'Rahmat', 'Sari', 'Tono', 'Udin',
        'Vera', 'Wulan', 'Yanto', 'Zahra', 'Agus', 'Bunga', 'Cahya', 'Dewi', 'Fajar', 'Gita',
        'Hadi', 'Intan', 'Jaya', 'Kusuma', 'Lina', 'Mega', 'Nanda', 'Oki', 'Prasetyo', 'Ratna',
        'Sugeng', 'Tari', 'Umar', 'Vina', 'Wahyu', 'Yuni', 'Zaki', 'Ayu', 'Bayu', 'Chandra'
    ];

    private $lastNames = [
        'Pratama', 'Kusuma', 'Wibowo', 'Santoso', 'Wijaya', 'Saputra', 'Nugroho', 'Setiawan',
        'Lestari', 'Hidayat', 'Firmansyah', 'Maulana', 'Ramadhan', 'Permana', 'Gunawan', 'Putra',
        'Utama', 'Kurniawan', 'Adriansyah', 'Sutanto', 'Hakim', 'Mahendra', 'Syahputra', 'Wicaksono',
        'Prawira', 'Setiyadi', 'Kusumawati', 'Rahayu', 'Purnama', 'Suharto', 'Budiman', 'Irawan',
        'Hartono', 'Suryanto', 'Anwar', 'Fitriani', 'Hastuti', 'Septiani', 'Anggraini', 'Safitri'
    ];

    /**
     * Provinsi dan kota-kota di Indonesia (Lengkap dari locations.js)
     */
    private $locations = [
        "Aceh" => [
            "Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Subulussalam",
            "Aceh Barat", "Aceh Barat Daya", "Aceh Besar", "Aceh Jaya", "Aceh Selatan",
            "Aceh Singkil", "Aceh Tamiang", "Aceh Tengah", "Aceh Tenggara",
            "Aceh Timur", "Aceh Utara", "Bener Meriah", "Bireuen", "Gayo Lues",
            "Nagan Raya", "Pidie", "Pidie Jaya", "Simeulue"
        ],
        "Sumatera Utara" => [
            "Medan", "Binjai", "Padang Sidempuan", "Pematangsiantar", "Sibolga",
            "Tanjungbalai", "Tebing Tinggi", "Gunungsitoli", "Asahan", "Batubara",
            "Dairi", "Deli Serdang", "Humbang Hasundutan", "Karo",
            "Labuhan Batu", "Labuhan Batu Selatan", "Labuhan Batu Utara",
            "Langkat", "Mandailing Natal", "Nias", "Nias Barat", "Nias Selatan",
            "Nias Utara", "Padang Lawas", "Padang Lawas Utara",
            "Pakpak Bharat", "Samosir", "Serdang Bedagai", "Simalungun",
            "Tapanuli Selatan", "Tapanuli Tengah", "Tapanuli Utara", "Toba"
        ],
        "Sumatera Barat" => [
            "Padang", "Bukittinggi", "Padang Panjang", "Pariaman",
            "Payakumbuh", "Sawahlunto", "Solok",
            "Agam", "Dharmasraya", "Kepulauan Mentawai", "Lima Puluh Kota",
            "Padang Pariaman", "Pasaman", "Pasaman Barat", "Pesisir Selatan",
            "Sijunjung", "Solok Selatan", "Tanah Datar"
        ],
        "Riau" => [
            "Pekanbaru", "Dumai",
            "Bengkalis", "Indragiri Hilir", "Indragiri Hulu", "Kampar",
            "Kepulauan Meranti", "Kuantan Singingi", "Pelalawan",
            "Rokan Hilir", "Rokan Hulu", "Siak"
        ],
        "Jambi" => [
            "Jambi", "Sungai Penuh",
            "Batanghari", "Bungo", "Kerinci", "Merangin", "Muaro Jambi",
            "Sarolangun", "Tanjung Jabung Barat", "Tanjung Jabung Timur", "Tebo"
        ],
        "Sumatera Selatan" => [
            "Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih",
            "Banyuasin", "Empat Lawang", "Lahat", "Muara Enim",
            "Musi Banyuasin", "Musi Rawas", "Musi Rawas Utara",
            "Ogan Ilir", "Ogan Komering Ilir", "Ogan Komering Ulu",
            "Ogan Komering Ulu Selatan", "Ogan Komering Ulu Timur", "Penukal Abab Lematang Ilir"
        ],
        "Bengkulu" => [
            "Bengkulu",
            "Bengkulu Selatan", "Bengkulu Tengah", "Bengkulu Utara", "Kaur",
            "Kepahiang", "Lebong", "Mukomuko", "Rejang Lebong", "Seluma"
        ],
        "Lampung" => [
            "Bandar Lampung", "Metro",
            "Lampung Barat", "Lampung Selatan", "Lampung Tengah",
            "Lampung Timur", "Lampung Utara", "Mesuji", "Pesawaran",
            "Pesisir Barat", "Pringsewu", "Tanggamus", "Tulang Bawang",
            "Tulang Bawang Barat", "Way Kanan"
        ],
        "Kepulauan Bangka Belitung" => [
            "Pangkalpinang",
            "Bangka", "Bangka Barat", "Bangka Selatan", "Bangka Tengah",
            "Belitung", "Belitung Timur"
        ],
        "Kepulauan Riau" => [
            "Batam", "Tanjungpinang",
            "Bintan", "Karimun", "Kepulauan Anambas", "Lingga", "Natuna"
        ],
        "DKI Jakarta" => [
            "Jakarta Pusat", "Jakarta Barat", "Jakarta Selatan",
            "Jakarta Timur", "Jakarta Utara", "Kepulauan Seribu"
        ],
        "Jawa Barat" => [
            "Bandung", "Bandung Barat", "Bekasi", "Bogor", "Ciamis",
            "Cianjur", "Cirebon", "Garut", "Indramayu", "Karawang",
            "Kuningan", "Majalengka", "Pangandaran", "Purwakarta",
            "Subang", "Sukabumi", "Sumedang", "Tasikmalaya",
            "Banjar", "Cimahi", "Depok"
        ],
        "Jawa Tengah" => [
            "Banjarnegara", "Banyumas", "Batang", "Blora", "Boyolali",
            "Brebes", "Cilacap", "Demak", "Grobogan", "Jepara",
            "Karanganyar", "Kebumen", "Kendal", "Klaten", "Kudus",
            "Magelang", "Pati", "Pekalongan", "Pemalang", "Purbalingga",
            "Purworejo", "Rembang", "Semarang", "Sragen", "Sukoharjo",
            "Tegal", "Temanggung", "Wonogiri", "Wonosobo",
            "Salatiga", "Surakarta"
        ],
        "DI Yogyakarta" => [
            "Bantul", "Gunung Kidul", "Kulon Progo", "Sleman", "Yogyakarta"
        ],
        "Jawa Timur" => [
            "Bangkalan", "Banyuwangi", "Blitar", "Bojonegoro", "Bondowoso",
            "Gresik", "Jember", "Jombang", "Kediri", "Lamongan",
            "Lumajang", "Madiun", "Magetan", "Malang", "Mojokerto",
            "Nganjuk", "Ngawi", "Pacitan", "Pamekasan", "Pasuruan",
            "Ponorogo", "Probolinggo", "Sampang", "Sidoarjo",
            "Situbondo", "Sumenep", "Trenggalek", "Tuban", "Tulungagung",
            "Batu", "Surabaya"
        ],
        "Banten" => [
            "Cilegon", "Serang", "Tangerang Selatan", "Tangerang",
            "Lebak", "Pandeglang"
        ],
        "Bali" => [
            "Badung", "Bangli", "Buleleng", "Gianyar", "Jembrana",
            "Karangasem", "Klungkung", "Tabanan", "Denpasar"
        ],
        "Nusa Tenggara Barat" => [
            "Mataram", "Bima",
            "Dompu", "Lombok Barat", "Lombok Tengah",
            "Lombok Timur", "Lombok Utara", "Sumbawa", "Sumbawa Barat"
        ],
        "Nusa Tenggara Timur" => [
            "Kupang", "Alor", "Belu", "Ende", "Flores Timur",
            "Lembata", "Malaka", "Manggarai", "Manggarai Barat",
            "Manggarai Timur", "Nagekeo", "Ngada", "Rote Ndao",
            "Sabu Raijua", "Sikka", "Sumba Barat", "Sumba Barat Daya",
            "Sumba Tengah", "Sumba Timur", "Timor Tengah Selatan",
            "Timor Tengah Utara"
        ],
        "Kalimantan Barat" => [
            "Pontianak", "Singkawang",
            "Bengkayang", "Kapuas Hulu", "Kayong Utara", "Ketapang",
            "Kubu Raya", "Landak", "Melawi", "Mempawah", "Sambas",
            "Sanggau", "Sekadau", "Sintang"
        ],
        "Kalimantan Tengah" => [
            "Palangka Raya",
            "Barito Selatan", "Barito Timur", "Barito Utara",
            "Gunung Mas", "Kapuas", "Katingan", "Kotawaringin Barat",
            "Kotawaringin Timur", "Lamandau", "Murung Raya",
            "Pulang Pisau", "Sukamara", "Seruyan"
        ],
        "Kalimantan Selatan" => [
            "Banjarmasin", "Banjarbaru",
            "Balangan", "Banjar", "Barito Kuala", "Hulu Sungai Selatan",
            "Hulu Sungai Tengah", "Hulu Sungai Utara", "Kotabaru",
            "Tabalong", "Tanah Bumbu", "Tanah Laut", "Tapin"
        ],
        "Kalimantan Timur" => [
            "Balikpapan", "Bontang", "Samarinda",
            "Berau", "Kutai Barat", "Kutai Kartanegara", "Kutai Timur",
            "Mahakam Ulu", "Paser", "Penajam Paser Utara"
        ],
        "Kalimantan Utara" => [
            "Tarakan",
            "Bulungan", "Malinau", "Nunukan", "Tana Tidung"
        ],
        "Sulawesi Utara" => [
            "Manado", "Bitung", "Tomohon", "Kotamobagu",
            "Bolaang Mongondow", "Bolaang Mongondow Selatan",
            "Bolaang Mongondow Timur", "Bolaang Mongondow Utara",
            "Kepulauan Sangihe", "Kepulauan Siau Tagulandang Biaro",
            "Kepulauan Talaud", "Minahasa", "Minahasa Selatan",
            "Minahasa Tenggara", "Minahasa Utara"
        ],
        "Sulawesi Tengah" => [
            "Palu",
            "Banggai", "Banggai Kepulauan", "Banggai Laut",
            "Buol", "Donggala", "Morowali", "Morowali Utara",
            "Parigi Moutong", "Poso", "Sigi", "Tojo Una-Una", "Toli-Toli"
        ],
        "Sulawesi Selatan" => [
            "Makassar", "Palopo", "Parepare",
            "Bantaeng", "Barru", "Bone", "Bulukumba", "Enrekang",
            "Gowa", "Jeneponto", "Kepulauan Selayar", "Luwu",
            "Luwu Timur", "Luwu Utara", "Maros", "Pangkajene dan Kepulauan",
            "Pinrang", "Sidenreng Rappang", "Sinjai", "Soppeng",
            "Takalar", "Tana Toraja", "Toraja Utara", "Wajo"
        ],
        "Sulawesi Tenggara" => [
            "Kendari", "Baubau",
            "Bombana", "Buton", "Buton Selatan", "Buton Tengah",
            "Buton Utara", "Kolaka", "Kolaka Timur", "Kolaka Utara",
            "Konawe", "Konawe Kepulauan", "Konawe Selatan",
            "Konawe Utara", "Muna", "Muna Barat", "Wakatobi"
        ],
        "Gorontalo" => [
            "Gorontalo",
            "Boalemo", "Bone Bolango", "Gorontalo Utara", "Pohuwato"
        ],
        "Sulawesi Barat" => [
            "Mamuju", "Majene", "Mamasa", "Mamuju Tengah", "Polewali Mandar"
        ],
        "Maluku" => [
            "Ambon", "Tual",
            "Buru", "Buru Selatan", "Kepulauan Aru", "Maluku Barat Daya",
            "Maluku Tengah", "Maluku Tenggara", "Seram Bagian Barat",
            "Seram Bagian Timur"
        ],
        "Maluku Utara" => [
            "Ternate", "Tidore Kepulauan",
            "Halmahera Barat", "Halmahera Selatan", "Halmahera Tengah",
            "Halmahera Timur", "Halmahera Utara", "Kepulauan Sula", "Pulau Morotai", "Pulau Taliabu"
        ],
        "Papua" => [
            "Jayapura",
            "Asmat", "Biak Numfor", "Boven Digoel", "Deiyai", "Dogiyai",
            "Intan Jaya", "Jayawijaya", "Keerom", "Kepulauan Yapen",
            "Lanny Jaya", "Mamberamo Raya", "Mamberamo Tengah",
            "Mappi", "Merauke", "Mimika", "Nabire", "Nduga",
            "Paniai", "Pegunungan Bintang", "Puncak", "Puncak Jaya",
            "Sarmi", "Supiori", "Tolikara", "Waropen", "Yahukimo", "Yalimo"
        ],
        "Papua Barat" => [
            "Manokwari", "Sorong",
            "Fakfak", "Kaimana", "Manokwari Selatan", "Pegunungan Arfak",
            "Raja Ampat", "Sorong Selatan", "Tambrauw", "Teluk Bintuni", "Teluk Wondama"
        ],
        "Papua Selatan" => [
            "Merauke", "Asmat", "Mappi", "Boven Digoel"
        ],
        "Papua Tengah" => [
            "Nabire", "Paniai", "Mimika", "Deiyai", "Dogiyai", "Intan Jaya"
        ],
        "Papua Pegunungan" => [
            "Wamena", "Jayawijaya", "Lanny Jaya", "Mamberamo Tengah",
            "Nduga", "Pegunungan Bintang", "Tolikara", "Yahukimo", "Yalimo"
        ],
        "Papua Barat Daya" => [
            "Sorong", "Raja Ampat", "Sorong Selatan",
            "Tambrauw", "Maybrat", "Kepulauan Ayau"
        ]
    ];
    

    /**
     * Template komentar positif (rating 4-5)
     */
    private $positiveComments = [
        'Produk sangat bagus! Sesuai deskripsi dan pengiriman cepat.',
        'Barang berkualitas, packaging rapi. Recommended seller!',
        'Pelayanan memuaskan, produk ori. Terima kasih!',
        'Mantap! Kualitas premium, worth it banget.',
        'Barang sudah sampai dengan selamat. Kualitas oke punya!',
        'Sangat puas dengan pembelian ini. Fast response seller.',
        'Original 100%! Seller ramah dan responsif.',
        'Barang sesuai ekspektasi, bahkan lebih bagus dari foto.',
        'Pengiriman cepat, packing aman. Top markotop!',
        'Kualitas bagus, harga terjangkau. Will order again!',
        'Produk berkualitas tinggi, tidak mengecewakan.',
        'Pelayanan excellent! Barang sampai tepat waktu.',
        'Barang ori, sesuai gambar. Sangat memuaskan.',
        'Packaging rapi banget, produk mulus. Recommended!',
        'Seller fast response, produk berkualitas. Mantap!',
        'Worth it! Barang bagus dengan harga bersahabat.',
        'Produk ori, kualitas terjamin. Puas banget!',
        'Barang sesuai deskripsi 100%. Terima kasih banyak!',
        'Pelayanan ramah, barang ori. Highly recommended!',
        'Sangat bagus! Pengiriman cepat dan aman.',
        'Produk kualitas premium, tidak mengecewakan sama sekali.',
        'Seller responsif, barang sampai cepat. Good job!',
        'Barang original dan berkualitas. Puas!',
        'Packaging rapih, produk sesuai ekspektasi. Thanks!',
        'Kualitas juara! Bakal repeat order pasti.',
        'Produk mantap, harga oke. Recommended seller!',
        'Barang bagus banget, pengiriman juga cepat.',
        'Sangat puas! Produk ori dan pelayanan memuaskan.',
        'Worth the price! Kualitas tidak diragukan lagi.',
        'Seller terpercaya, barang berkualitas. Sukses terus!',
    ];

    /**
     * Template komentar netral (rating 3)
     */
    private $neutralComments = [
        'Barang oke, tapi pengirimannya agak lama.',
        'Produk sesuai deskripsi, harga sedikit mahal.',
        'Lumayan bagus, tapi packaging bisa lebih rapi.',
        'Barang sampai dengan aman, kualitas standar.',
        'Oke sih, tapi ada yang bisa ditingkatkan lagi.',
        'Barang sesuai gambar, pengiriman standar.',
        'Cukup memuaskan, overall oke lah.',
        'Produk bagus tapi proses agak lama.',
        'Lumayan, sesuai harga yang dibayar.',
        'Kualitas standar, tidak terlalu istimewa.',
        'Barang oke, tapi customer service bisa lebih baik.',
        'Sesuai ekspektasi, tidak lebih tidak kurang.',
        'Cukup memuaskan untuk harga segini.',
        'Barang bagus, sayang pengiriman lama.',
        'Overall oke, tapi ada sedikit kekurangan.',
    ];

    /**
     * Template komentar negatif (rating 1-2)
     */
    private $negativeComments = [
        'Barang tidak sesuai gambar. Kecewa.',
        'Kualitas kurang memuaskan, harga tidak worth it.',
        'Pengiriman sangat lama, barang ada cacat sedikit.',
        'Tidak sesuai ekspektasi. Agak mengecewakan.',
        'Kualitas biasa saja, tidak sesuai harga.',
        'Barang ada lecet, packaging kurang rapi.',
        'Agak kecewa dengan kualitasnya.',
        'Pengiriman lama, produk tidak sesuai deskripsi.',
        'Kurang memuaskan, tidak akan beli lagi.',
        'Barang ada cacat, seller kurang responsif.',
    ];

    /**
     * Distribusi rating yang realistis
     * Kebanyakan produk memiliki rating bagus (4-5)
     * Sedikit rating buruk (1-2) dan netral (3)
     */
    private function getRealisticRatingDistribution()
    {
        $rand = rand(1, 100);
        
        if ($rand <= 60) {
            return 5; // 60% rating 5
        } elseif ($rand <= 85) {
            return 4; // 25% rating 4
        } elseif ($rand <= 93) {
            return 3; // 8% rating 3
        } elseif ($rand <= 98) {
            return 2; // 5% rating 2
        } else {
            return 1; // 2% rating 1
        }
    }

    /**
     * Generate nama lengkap yang realistis
     */
    private function generateName()
    {
        $firstName = $this->firstNames[array_rand($this->firstNames)];
        $lastName = $this->lastNames[array_rand($this->lastNames)];
        return $firstName . ' ' . $lastName;
    }

    /**
     * Generate nomor telepon Indonesia yang valid
     */
    private function generatePhone()
    {
        $prefix = ['0812', '0813', '0821', '0822', '0852', '0853', '0856', '0857', '0858', '0895', '0896', '0897', '0898'];
        return $prefix[array_rand($prefix)] . rand(10000000, 99999999);
    }

    /**
     * Generate email berdasarkan nama
     */
    private function generateEmail($name)
    {
        $cleanName = strtolower(str_replace(' ', '', $name));
        $domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        $suffix = rand(100, 999);
        return $cleanName . $suffix . '@' . $domains[array_rand($domains)];
    }

    /**
     * Pilih lokasi random
     */
    private function getRandomLocation()
    {
        $province = array_rand($this->locations);
        $cities = $this->locations[$province];
        $city = $cities[array_rand($cities)];
        
        return [
            'province' => $province,
            'city' => $city
        ];
    }

    /**
     * Pilih komentar berdasarkan rating
     */
    private function getCommentByRating($rating)
    {
        if ($rating >= 4) {
            return $this->positiveComments[array_rand($this->positiveComments)];
        } elseif ($rating == 3) {
            return $this->neutralComments[array_rand($this->neutralComments)];
        } else {
            return $this->negativeComments[array_rand($this->negativeComments)];
        }
    }

    /**
     * Generate tanggal random dalam 6 bulan terakhir
     */
    private function getRandomDate()
    {
        $daysAgo = rand(1, 180); // 1-180 hari yang lalu (6 bulan)
        return Carbon::now()->subDays($daysAgo);
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Mulai generate reviews untuk semua produk...');
        
        // Ambil semua produk dari database
        $products = Product::all();
        
        if ($products->isEmpty()) {
            $this->command->error('❌ Tidak ada produk ditemukan di database!');
            return;
        }

        $this->command->info("📦 Ditemukan {$products->count()} produk");
        
        $totalReviews = 0;
        
        foreach ($products as $product) {
            // Setiap produk akan mendapat 5-15 reviews (random)
            $reviewCount = rand(5, 15);
            
            $this->command->info("   → Generate {$reviewCount} reviews untuk: {$product->name}");
            
            for ($i = 0; $i < $reviewCount; $i++) {
                $name = $this->generateName();
                $location = $this->getRandomLocation();
                $rating = $this->getRealisticRatingDistribution();
                
                Review::create([
                    'id' => (string) Str::uuid(),
                    'product_id' => $product->id,
                    'reviewer_name' => $name,
                    'reviewer_phone' => $this->generatePhone(),
                    'reviewer_email' => $this->generateEmail($name),
                    'reviewer_province' => $location['province'],
                    'reviewer_city' => $location['city'],
                    'rating' => $rating,
                    'comment' => $this->getCommentByRating($rating),
                    'created_at' => $this->getRandomDate(),
                    'updated_at' => now(),
                ]);
                
                $totalReviews++;
            }
        }
        
        $this->command->info("✅ Selesai! Total {$totalReviews} reviews berhasil dibuat untuk {$products->count()} produk.");
        $this->command->info('📊 Rata-rata ' . round($totalReviews / $products->count(), 1) . ' reviews per produk');
    }
}
