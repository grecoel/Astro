# Rencana Uji dan Hasil Uji - Dashboard Platform (DUPL-07)

## Tabel Rencana Uji (Kelas Uji 7)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 7. Dashboard Platform | 7.1 Memuat halaman dashboard admin setelah login. | SRS-MartPlace-07 | DUPL-07-01 | Sistem | Black Box | Gege Centiana Putra |
| 7. Dashboard Platform | 7.2 Menampilkan sebaran jumlah produk per kategori. | SRS-MartPlace-07 | DUPL-07-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 7. Dashboard Platform | 7.3 Menampilkan sebaran jumlah toko per provinsi (peta). | SRS-MartPlace-07 | DUPL-07-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 7. Dashboard Platform | 7.4 Menampilkan status penjual (Aktif, Pending, Rejected). | SRS-MartPlace-07 | DUPL-07-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 7. Dashboard Platform | 7.5 Menampilkan ringkasan ulasan (pengulas unik & distribusi rating). | SRS-MartPlace-07 | DUPL-07-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 7. Dashboard Platform | 7.6 Memuat ulang data dashboard (refresh). | SRS-MartPlace-07 | DUPL-07-06 | Sistem | Black Box | Gege Centiana Putra |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 7)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-07-01 | Memuat halaman dashboard admin. | Login sebagai admin lalu akses /admin/dashboard. | <Login> admin | Halaman dashboard tampil dengan ringkasan dan grafik. | API /api/admin/dashboard mengembalikan success=true dan data dashboard. |  |  |
| DUPL-07-02 | Sebaran jumlah produk per kategori. | Lihat panel "Sebaran Produk per Kategori". | Data produk tersedia | Bar chart muncul dengan nama kategori dan jumlah produk. | Data berasal dari products_by_category di /api/admin/dashboard. |  |  |
| DUPL-07-03 | Sebaran toko per provinsi. | Lihat panel peta "Sebaran Toko per Provinsi" dan klik filter "Semua/Toko Aktif/Toko Tidak Aktif". | Filter provinsi | Peta menampilkan distribusi sesuai filter. | Data berasal dari sellers_by_province_all/active/inactive. |  |  |
| DUPL-07-04 | Status penjual. | Lihat panel "Status Penjual" (pie chart). | Data seller tersedia | Donut chart menampilkan Aktif, Pending, Rejected. | Data berasal dari seller_status. |  |  |
| DUPL-07-05 | Ringkasan ulasan. | Lihat panel "Distribusi Rating & Ulasan" dan kartu "Pengulas Unik". | Data ulasan tersedia | Distribusi rating 1-5 muncul, angka pengulas unik tampil. | Data berasal dari review_stats (reviews_by_rating, total_reviewers). |  |  |
| DUPL-07-06 | Refresh data dashboard. | Klik tombol "Coba Lagi" saat terjadi error, atau reload halaman browser. | <Reload> halaman | Data dashboard dimuat ulang. | Tidak ada tombol refresh khusus; reload halaman memanggil ulang /api/admin/dashboard. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada tombol refresh real-time; pembaruan dilakukan dengan reload halaman atau tombol "Coba Lagi" ketika error.
- Status penjual yang ditampilkan terdiri dari ACTIVE, PENDING, dan REJECTED.
- Grafik produk per kategori dan distribusi rating tidak memakai hover detail khusus; nilai tampil langsung di UI.
