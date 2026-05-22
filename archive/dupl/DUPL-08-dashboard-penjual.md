# Rencana Uji dan Hasil Uji - Dashboard Penjual (DUPL-08)

## Tabel Rencana Uji (Kelas Uji 8)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 8. Dashboard Penjual | 8.1 Memuat halaman dashboard penjual setelah login. | SRS-MartPlace-08 | DUPL-08-01 | Sistem | Black Box | Gege Centiana Putra |
| 8. Dashboard Penjual | 8.2 Menampilkan sebaran stok per produk. | SRS-MartPlace-08 | DUPL-08-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 8. Dashboard Penjual | 8.3 Menampilkan sebaran rating per produk. | SRS-MartPlace-08 | DUPL-08-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 8. Dashboard Penjual | 8.4 Menampilkan sebaran reviewer per provinsi (peta). | SRS-MartPlace-08 | DUPL-08-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 8. Dashboard Penjual | 8.5 Refresh data dashboard penjual. | SRS-MartPlace-08 | DUPL-08-05 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 8)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-08-01 | Memuat dashboard penjual. | Login sebagai seller, akses /seller/dashboard. | <Login> seller | Dashboard penjual tampil, ringkasan statistik dan grafik muncul. | API /api/seller/dashboard/data mengembalikan data; halaman tidak redirect ke login. |  |  |
| DUPL-08-02 | Sebaran stok per produk. | Lihat panel "Sebaran Stok per Kategori" dan filter stok. | Data produk tersedia | Grafik stok tampil (bar chart) dan bisa difilter (Semua/Aktif/Draft/Stok Rendah/Stok Habis). | Data berasal dari productStocks pada /api/seller/dashboard/data. |  |  |
| DUPL-08-03 | Sebaran rating per produk. | Lihat panel "Rating Produk" dan filter rating. | Data rating tersedia | Daftar produk beserta rating tampil; filter (Semua/Aktif/Draft/Minimal 5 Review) berfungsi. | Data berasal dari productRatings pada /api/seller/dashboard/data. |  |  |
| DUPL-08-04 | Sebaran reviewer per provinsi. | Lihat peta "Sebaran Reviewer per Provinsi" dan hover provinsi. | Data reviewer tersedia | Peta menampilkan intensitas berdasarkan jumlah reviewer; hover menampilkan popup jumlah reviewer. | Data berasal dari reviewersByProvince; peta menggunakan GeoJSON lokal. |  |  |
| DUPL-08-05 | Refresh data dashboard. | Klik tombol "Refresh" di header dashboard. | <Klik> Refresh | Data dashboard dimuat ulang. | Tombol Refresh memanggil fetchDashboardData dan request ulang ke /api/seller/dashboard/data. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada hover detail pada grafik bar stok/rating; nilai tampil langsung di UI.
- Peta reviewer menggunakan hover/popup pada provinsi (Leaflet), bukan chart tooltip.
- Data dashboard diambil dari 3 endpoint: /api/user, /api/seller/status, dan /api/seller/dashboard/data.
- Jika token tidak valid, sistem mengarahkan kembali ke /login.
