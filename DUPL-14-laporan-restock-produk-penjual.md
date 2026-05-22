# Rencana Uji dan Hasil Uji - Laporan Barang Segera Dipesan (DUPL-14)

## Tabel Rencana Uji (Kelas Uji 14)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 14. Laporan Penjual - Barang Segera Dipesan | 14.1 Pengujian pemuatan modal laporan restock dan eksekusi cetak/unduh PDF. | SRS-MartPlace-14 | DUPL-14-01 | Sistem | Black Box | Gege Centiana Putra |
| 14. Laporan Penjual - Barang Segera Dipesan | 14.2 Pengujian keakuratan format PDF (judul laporan dan kolom tabel). | SRS-MartPlace-14 | DUPL-14-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 14. Laporan Penjual - Barang Segera Dipesan | 14.3 Pengujian boundary value stok untuk laporan restock. | SRS-MartPlace-14 | DUPL-14-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 14. Laporan Penjual - Barang Segera Dipesan | 14.4 Pengujian isolasi data penjual (produk tidak bocor ke toko lain). | SRS-MartPlace-14 | DUPL-14-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 14. Laporan Penjual - Barang Segera Dipesan | 14.5 Pengujian empty state saat tidak ada produk stok rendah. | SRS-MartPlace-14 | DUPL-14-05 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 14 - Laporan Barang Segera Dipesan)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-14-01 | Memuat modal laporan restock dan eksekusi cetak/unduh PDF. | Login sebagai seller, buka menu Laporan, klik kartu "Laporan Restock" lalu klik "Download PDF" dan "Cetak". | <Klik> Laporan Restock; <Klik> Download PDF; <Klik> Cetak | Modal laporan tampil; file PDF terunduh dengan ekstensi .pdf; dialog print browser muncul. | Data diambil dari /api/seller/reports/reorder/data; unduh dari /api/seller/reports/reorder; tombol "Cetak" menjalankan window.print. |  |  |
| DUPL-14-02 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header menampilkan "Laporan Seller - {Nama Toko}" dan judul "Laporan Daftar Produk Segera Dipesan"; kolom: No, Produk, Kategori, Harga, Stock. | Format dokumen rapi dan kolom sesuai template PDF di sistem. |  |  |
| DUPL-14-03 | Boundary value stok untuk laporan restock. | Siapkan produk dengan stok 0, 1, dan 2; buka laporan restock. | Stok: 0, 1, 2 | Hanya produk dengan stok < 2 yang muncul (0 dan 1); stok 2 tidak muncul. | Query backend menggunakan kondisi stock < 2. |  |  |
| DUPL-14-04 | Validasi isolasi data penjual. | Bandingkan isi laporan dengan data produk seller lain. | Data PDF vs data sistem | Laporan hanya memuat produk milik seller yang login; tidak ada produk dari seller lain. | Dataset difilter berdasarkan seller_id yang login. |  |  |
| DUPL-14-05 | Uji empty state saat tidak ada produk stok rendah. | Pastikan semua stok >= 2 atau seller belum punya produk; buka laporan. | Stok rendah = 0 | Modal menampilkan "Tidak ada data produk"; PDF tetap bisa digenerate dan menampilkan "Tidak ada data". | Sistem tidak crash saat data kosong. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada tombol "Batal" atau "Kembali" di modal; penutupan via tombol "Tutup" dan ikon "×".
- Tombol "Cetak" menjalankan window.print (mencetak halaman modal), bukan membuka PDF baru.
- Data laporan dan PDF diambil dari /api/seller/reports/reorder/data dan /api/seller/reports/reorder.
- Filter restock menggunakan kondisi stock < 2.
