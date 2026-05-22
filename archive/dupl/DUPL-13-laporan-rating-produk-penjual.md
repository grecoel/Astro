# Rencana Uji dan Hasil Uji - Laporan Produk Urut Rating (DUPL-13)

## Tabel Rencana Uji (Kelas Uji 13)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.1 Pengujian pemuatan modal laporan rating produk penjual. | SRS-MartPlace-13 | DUPL-13-01 | Sistem | Black Box | Gege Centiana Putra |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.2 Pengujian eksekusi cetak dan unduh PDF laporan. | SRS-MartPlace-13 | DUPL-13-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.3 Pengujian keakuratan format PDF (header identitas toko dan kolom tabel). | SRS-MartPlace-13 | DUPL-13-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.4 Pengujian akurasi data dan urutan rating tertinggi. | SRS-MartPlace-13 | DUPL-13-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.5 Pengujian empty state saat belum ada produk dengan rating. | SRS-MartPlace-13 | DUPL-13-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 13. Laporan Penjualan - Daftar Stok Produk Urut Rating | 13.6 Pengujian penutupan modal laporan. | SRS-MartPlace-13 | DUPL-13-06 | Sistem | Black Box | Gege Centiana Putra |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 13 - Laporan Produk Urut Rating)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-13-01 | Memuat modal laporan rating produk. | Login sebagai seller, buka menu Laporan, klik kartu "Laporan Rating". | <Klik> Laporan Rating | Modal laporan tampil, data laporan dimuat dan tabel ter-render. | Data diambil dari /api/seller/reports/rating/data; header menampilkan tanggal dan nama pembuat. |  |  |
| DUPL-13-02 | Unduh PDF dan cetak laporan rating. | Di modal laporan, klik "Download PDF" lalu klik "Cetak". | <Klik> Download PDF; <Klik> Cetak | File PDF terunduh dengan ekstensi .pdf; dialog print browser muncul untuk halaman saat ini. | Unduhan berjalan via blob dari /api/seller/reports/rating; tombol "Cetak" menjalankan window.print (bukan membuka PDF baru). |  |  |
| DUPL-13-03 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header menampilkan "Laporan Seller - {Nama Toko}" dan judul "Laporan Daftar Produk Berdasarkan Rating"; kolom: No, Produk, Kategori, Harga, Stock, Rating. | Format dokumen rapi dan kolom sesuai template PDF di sistem. |  |  |
| DUPL-13-04 | Validasi akurasi data dan urutan rating. | Bandingkan beberapa baris di PDF dengan data produk penjual. | Data PDF vs data sistem | Hanya produk yang memiliki review yang muncul; urutan berdasarkan rating tertinggi ke terendah. | Dataset PDF hanya dari seller_id yang login; tidak ada aturan urutan sekunder saat rating sama. |  |  |
| DUPL-13-05 | Uji empty state ketika belum ada produk dengan rating. | Pastikan tidak ada produk yang memiliki review, lalu buka laporan. | Produk ber-rating = 0 | Modal menampilkan "Tidak ada data produk"; PDF tetap bisa digenerate dan menampilkan "Tidak ada data". | Sistem tidak crash ketika data kosong. |  |  |
| DUPL-13-06 | Penutupan modal laporan. | Klik tombol "Tutup" atau ikon "×" pada modal. | <Klik> Tutup / × | Modal tertutup tanpa unduh/cetak otomatis. | Penutupan modal tidak memicu proses lain. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada tombol "Batal" atau "Kembali" pada modal laporan; hanya "Tutup" dan ikon "×".
- Tombol "Cetak" menjalankan window.print (mencetak halaman modal), bukan mengunduh PDF.
- Data laporan dan PDF diambil dari /api/seller/reports/rating/data dan /api/seller/reports/rating.
- Laporan hanya memuat produk yang memiliki review (rating). Produk tanpa review tidak masuk laporan.
- Urutan data berdasarkan rating desc tanpa aturan sekunder ketika rating sama.
