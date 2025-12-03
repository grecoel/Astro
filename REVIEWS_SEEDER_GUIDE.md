# 📝 Panduan Populate Reviews Database

## ✨ File yang Dibuat
- `database/seeders/ReviewsSeeder.php` - Seeder untuk generate reviews realistis

## 🎯 Fitur Seeder

### Data Realistis:
- ✅ 50 nama depan + 40 nama belakang Indonesia (2000+ kombinasi nama unik)
- ✅ 10 provinsi dengan 40+ kota di Indonesia
- ✅ Nomor telepon format Indonesia (0812, 0813, 0821, dll)
- ✅ Email berdasarkan nama reviewer
- ✅ Rating mengikuti distribusi realistis:
  - 60% rating 5 ⭐⭐⭐⭐⭐
  - 25% rating 4 ⭐⭐⭐⭐
  - 8% rating 3 ⭐⭐⭐
  - 5% rating 2 ⭐⭐
  - 2% rating 1 ⭐

### Komentar Review:
- 30 template komentar positif (rating 4-5)
- 15 template komentar netral (rating 3)
- 10 template komentar negatif (rating 1-2)
- Tanggal review random dalam 6 bulan terakhir

### Jumlah Reviews per Produk:
- Random antara **5-15 reviews** per produk
- Setiap produk yang ada di database akan mendapat reviews

## 🚀 Cara Menjalankan

### Opsi 1: Run Seeder Khusus Reviews
```bash
php artisan db:seed --class=ReviewsSeeder
```

### Opsi 2: Tambahkan ke DatabaseSeeder (Opsional)
Jika ingin reviews auto-generate setiap kali run `php artisan db:seed`, tambahkan di `database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    // ... existing code ...
    
    // Seed reviews (di bagian paling akhir)
    $this->call([
        ReviewsSeeder::class,
    ]);
}
```

## ⚠️ PERHATIAN SEBELUM RUN

### 1. Backup Database (Sangat Disarankan!)
```bash
# Jika pakai MySQL/PostgreSQL
php artisan db:backup

# Atau export manual lewat GUI
```

### 2. Cek Koneksi Database
```bash
php artisan db:show
```

### 3. Test di Local Dulu
Jangan langsung run di production database!

## 🧪 Testing Seeder

### Dry Run (Cek Berapa Review yang Akan Dibuat)
Buka file `ReviewsSeeder.php` dan comment bagian `Review::create()`, lalu uncomment bagian ini:

```php
// Ganti:
Review::create([...]);

// Dengan (untuk testing):
// $this->command->info("     → Review #{$i}: {$name} ({$rating}⭐) - {$location['city']}");
```

Jalankan untuk lihat output tanpa insert data:
```bash
php artisan db:seed --class=ReviewsSeeder
```

## 📊 Estimasi Data yang Akan Dibuat

Jika Anda punya **50 produk** di database:
- Minimum: 50 × 5 = **250 reviews**
- Maximum: 50 × 15 = **750 reviews**
- Average: 50 × 10 = **500 reviews**

## 🔄 Menghapus Reviews (Jika Perlu Rollback)

### Hapus Semua Reviews:
```bash
php artisan tinker
```

Lalu ketik:
```php
DB::table('reviews')->truncate();
```

### Atau buat Seeder untuk Delete:
```bash
php artisan make:seeder DeleteAllReviewsSeeder
```

## 📋 Checklist Sebelum Run

- [ ] Database sudah di-backup
- [ ] Sudah konfirmasi environment (local/staging/production)
- [ ] Sudah cek jumlah produk: `DB::table('products')->count()`
- [ ] Sudah cek struktur tabel reviews sesuai: `php artisan db:show`
- [ ] Migrasi `add_city_to_reviews_table` sudah running
- [ ] Siap untuk generate reviews

## ✅ Cara Verifikasi Setelah Seeding

### 1. Cek Total Reviews:
```bash
php artisan tinker
```
```php
\App\Models\Review::count()
```

### 2. Cek Distribusi Rating:
```php
DB::table('reviews')->select('rating', DB::raw('count(*) as total'))
    ->groupBy('rating')
    ->orderBy('rating', 'desc')
    ->get();
```

### 3. Cek Sample Review:
```php
\App\Models\Review::with('product')->latest()->take(5)->get();
```

### 4. Cek Product dengan Reviews Terbanyak:
```php
DB::table('reviews')
    ->select('product_id', DB::raw('count(*) as review_count'))
    ->groupBy('product_id')
    ->orderBy('review_count', 'desc')
    ->take(10)
    ->get();
```

## 🎨 Customisasi (Opsional)

### Ubah Jumlah Reviews per Produk:
Di file `ReviewsSeeder.php` line ~227:
```php
// Dari:
$reviewCount = rand(5, 15);

// Ubah jadi (misal 10-25):
$reviewCount = rand(10, 25);
```

### Ubah Distribusi Rating:
Di method `getRealisticRatingDistribution()`, ubah persentase sesuai keinginan.

### Tambah Template Komentar:
Tambahkan string baru di array `$positiveComments`, `$neutralComments`, atau `$negativeComments`.

## 🆘 Troubleshooting

### Error: "Class ReviewsSeeder not found"
```bash
composer dump-autoload
```

### Error: "SQLSTATE[23000]: Integrity constraint violation"
Kemungkinan `product_id` tidak valid. Pastikan ada produk di database:
```bash
php artisan tinker
\App\Models\Product::count()
```

### Seeder Jalan Terlalu Lama
Jika punya banyak produk (>100), seeder mungkin butuh 1-2 menit. Ini normal.

### Ingin Generate Lebih Cepat
Gunakan bulk insert (advanced). Tapi seeder ini sudah optimal untuk <200 produk.

## 📞 Kontak
Jika ada masalah, cek log Laravel:
```bash
tail -f storage/logs/laravel.log
```

---

**INGAT:** Selalu backup database sebelum running seeder di production! 🛡️
