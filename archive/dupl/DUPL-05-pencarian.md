# Rencana Uji dan Hasil Uji - Pencarian Produk (DUPL-05)

## Tabel Rencana Uji (Kelas Uji 5)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 5. Pencarian Produk | 5.1 Pencarian dengan kata kunci Nama Produk melalui kolom search. | SRS-MartPlace-05 | DUPL-05-01 | Sistem | Black Box | Gege Centiana Putra |
| 5. Pencarian Produk | 5.2 Pencarian dengan kata kunci Nama Toko melalui kolom search. | SRS-MartPlace-05 | DUPL-05-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 5. Pencarian Produk | 5.3 Filter Kategori Produk pada halaman /search. | SRS-MartPlace-05 | DUPL-05-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 5. Pencarian Produk | 5.4 Filter Lokasi (Provinsi/Kota) pada halaman /search. | SRS-MartPlace-05 | DUPL-05-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 5. Pencarian Produk | 5.5 Pencarian Nama Produk + filter Kategori. | SRS-MartPlace-05 | DUPL-05-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 5. Pencarian Produk | 5.6 Pencarian Nama Toko + filter Lokasi. | SRS-MartPlace-05 | DUPL-05-06 | Sistem | Black Box | Gege Centiana Putra |
| 5. Pencarian Produk | 5.7 Empty state saat hasil pencarian/filter kosong. | SRS-MartPlace-05 | DUPL-05-07 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 5. Pencarian Produk | 5.8 Reset pencarian dan filter untuk menampilkan semua produk. | SRS-MartPlace-05 | DUPL-05-08 | Sistem | Black Box | Erzachel Senna Rizky F. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 5)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-05-01 | Pencarian berdasarkan Nama Produk. | Ketik nama produk pada kolom "Cari Produk", tekan Enter. | search = "Sepatu" | Halaman /search menampilkan produk dengan nama/deskripsi mengandung kata kunci. | API /api/catalog?search=... mengembalikan produk relevan (status ACTIVE). |  |  |
| DUPL-05-02 | Pencarian berdasarkan Nama Toko. | Ketik nama toko pada kolom "Cari Produk", tekan Enter. | search = "Toko A" | Halaman /search menampilkan produk dari toko yang namanya cocok. | Pencarian juga mencakup seller.store_name sesuai implementasi backend. |  |  |
| DUPL-05-03 | Filter kategori. | Di halaman /search, klik salah satu kategori di sidebar. | categories[] = <id kategori> | Hasil produk terfilter sesuai kategori; klik kategori yang sama menghapus filter. | Query /api/catalog?categories[]=... digunakan; produk tampil sesuai filter kategori. |  |  |
| DUPL-05-04 | Filter lokasi (provinsi/kota). | Di sidebar lokasi, centang provinsi; atau buka modal "Lihat Semua", pilih provinsi/kota, lalu klik "Terapkan". | locations[] = "Jawa Barat" atau "Bandung" | Produk terfilter berdasarkan lokasi seller (provinsi/kota). | Filter lokasi memakai seller.pic_province/pic_city; multi-select didukung. |  |  |
| DUPL-05-05 | Pencarian nama produk + kategori. | Isi search kata kunci, pilih kategori di sidebar. | search = "Sepatu", categories[] = <id> | Produk memenuhi kedua kriteria (search dan kategori). | Backend menggabungkan filter search + kategori. |  |  |
| DUPL-05-06 | Pencarian nama toko + lokasi. | Isi search nama toko, pilih lokasi provinsi/kota. | search = "Toko A", locations[] = "Jawa Barat" | Produk dari toko tersebut pada lokasi yang dipilih. | Backend menggabungkan filter search + lokasi. |  |  |
| DUPL-05-07 | Empty state pencarian/filter. | Gunakan kata kunci atau filter yang tidak memiliki hasil. | search = "zzzzz" | Tampil state kosong dengan judul "Produk tidak ditemukan" dan tombol "Hapus Filter" / "Reset Pencarian". | Empty state muncul saat products.length = 0. |  |  |
| DUPL-05-08 | Reset pencarian/filter. | Klik tombol "Reset Pencarian" di header atau empty state. | <Klik> Reset Pencarian | Kata kunci dan filter direset; halaman /search menampilkan semua produk. | handleResetSearch menghapus query & filter dan memuat ulang data. |  |  |

## Catatan Penyesuaian Sistem

- Pencarian memakai satu kolom "Cari Produk" (tidak ada field khusus Nama Toko), namun backend mencari juga nama toko.
- Filter kategori bersifat single-select (klik lagi untuk membatalkan).
- Filter lokasi menggunakan checkbox (provinsi/kota), bukan dropdown; tombol "Terapkan" hanya ada pada modal lokasi.
- Tombol "Hapus Filter" hanya menghapus filter kategori/lokasi tanpa mengosongkan keyword; tombol "Reset Pencarian" menghapus semuanya.
- Preview pencarian di navbar muncul saat panjang keyword >= 2 karakter, tetapi submit pencarian dapat dilakukan dengan keyword 1 karakter.
