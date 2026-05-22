# Rencana Uji dan Hasil Uji - Katalog Produk dan Pengunjung Umum (DUPL-04)

## Tabel Rencana Uji (Kelas Uji 4)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 4. Katalog Produk dan Pengunjung Umum | 4.1 Memuat halaman katalog publik (tanpa login). | SRS-MartPlace-04 | DUPL-04-01 | Sistem | Black Box | Gege Centiana Putra |
| 4. Katalog Produk dan Pengunjung Umum | 4.2 Menampilkan ringkasan produk pada grid (gambar, nama, harga). | SRS-MartPlace-04 | DUPL-04-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 4. Katalog Produk dan Pengunjung Umum | 4.3 Menampilkan nilai rating rata-rata pada kartu produk. | SRS-MartPlace-04 | DUPL-04-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 4. Katalog Produk dan Pengunjung Umum | 4.4 Navigasi ke halaman detail saat produk diklik. | SRS-MartPlace-04 | DUPL-04-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 4. Katalog Produk dan Pengunjung Umum | 4.5 Memuat detail produk (stok, kondisi, kategori, lokasi, deskripsi). | SRS-MartPlace-04 | DUPL-04-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 4. Katalog Produk dan Pengunjung Umum | 4.6 Menampilkan rating rata-rata pada halaman detail produk. | SRS-MartPlace-04 | DUPL-04-06 | Sistem | Black Box | Gege Centiana Putra |
| 4. Katalog Produk dan Pengunjung Umum | 4.7 Menampilkan daftar komentar ulasan pada halaman detail. | SRS-MartPlace-04 | DUPL-04-07 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 4. Katalog Produk dan Pengunjung Umum | 4.8 Menampilkan distribusi rating (1-5) pada halaman detail. | SRS-MartPlace-04 | DUPL-04-08 | Sistem | Black Box | Erzachel Senna Rizky F. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 4)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-04-01 | Memuat katalog publik tanpa login. | Akses halaman / pada browser tanpa login. | <Buka> / | Halaman katalog tampil. Pada kunjungan pertama, splash screen dapat muncul sebelum katalog. | Data katalog diambil dari /api/catalog dan hanya menampilkan produk berstatus ACTIVE. |  |  |
| DUPL-04-02 | Menampilkan ringkasan produk pada grid. | Amati kartu produk di grid katalog. | Data produk tersedia | Kartu produk menampilkan gambar, nama produk, harga. Jika gambar tidak ada, tampil placeholder. | Setiap kartu menggunakan ProductCard dengan thumbnail (image_url/thumbnail_url), nama, dan harga. |  |  |
| DUPL-04-03 | Menampilkan rating rata-rata pada kartu produk. | Amati area rating pada kartu produk. | Data rating tersedia / tidak tersedia | Rating tampil dalam format angka (mis. 4.7) dan jumlah ulasan; jika tidak ada ulasan, tampil 0.0 dan (0). | Nilai rating diambil dari rating_avg dan rating_count di /api/catalog. |  |  |
| DUPL-04-04 | Navigasi ke detail produk. | Klik salah satu kartu produk. | <Klik> kartu produk | Browser berpindah ke /product/{id}. | Route /product/:id terbuka dan memuat detail produk yang sesuai. |  |  |
| DUPL-04-05 | Memuat detail produk lengkap. | Di halaman /product/{id}, amati informasi produk. | Produk dengan data lengkap | Tampil stok, kondisi, kategori, lokasi penjual, deskripsi produk, serta galeri gambar. | Data detail diambil dari /api/catalog/{id}; jika id tidak ada, sistem kembali ke halaman utama. |  |  |
| DUPL-04-06 | Menampilkan rating rata-rata pada detail. | Lihat section "Rating Produk" pada halaman detail. | Data rating tersedia / tidak tersedia | Angka rating rata-rata tampil (mis. 4.3 dari 5.0); jika belum ada ulasan, tampil 0.0 dan teks "Belum ada penilaian". | Nilai rating dihitung dari review dan ditampilkan pada section rating. |  |  |
| DUPL-04-07 | Menampilkan komentar ulasan. | Lihat section "Komentar Produk" pada halaman detail. | Data ulasan tersedia / tidak tersedia | Daftar komentar tampil; jika kosong, tampil pesan "Belum ada komentar untuk produk ini." | Komentar diambil dari product.reviews. |  |  |
| DUPL-04-08 | Menampilkan distribusi rating 1-5. | Lihat bar rating pada section "Rating Produk". | Data rating tersedia / tidak tersedia | Tampil bar untuk bintang 5 sampai 1 dengan proporsi sesuai jumlah rating. | Distribusi dihitung dari rating_counts (1-5) dan ditampilkan sebagai progress bar. |  |  |

## Catatan Penyesuaian Sistem

- Katalog publik berada di halaman /, tanpa proteksi login.
- Kartu produk selalu menampilkan rating, termasuk 0.0 jika belum ada ulasan.
- Detail produk menampilkan stok, kondisi, kategori, lokasi, dan deskripsi; tidak ada field spesifikasi terpisah.
- Jika produk tidak ditemukan (404), halaman detail memberi alert dan mengarahkan ke /.
