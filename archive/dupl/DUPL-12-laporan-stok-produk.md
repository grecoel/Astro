# Rencana Uji dan Hasil Uji - Laporan Stok Produk Penjual (DUPL-12)

## Tabel Rencana Uji (Kelas Uji 12)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 12. Laporan Penjual - Daftar Stok Produk | 12.1 Pengujian pemuatan modal laporan stok produk penjual. | SRS-MartPlace-12 | DUPL-12-01 | Sistem | Black Box | Gege Centiana Putra |
| 12. Laporan Penjual - Daftar Stok Produk | 12.2 Pengujian eksekusi cetak dan unduh laporan (PDF). | SRS-MartPlace-12 | DUPL-12-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 12. Laporan Penjual - Daftar Stok Produk | 12.3 Pengujian keakuratan format PDF (header identitas toko dan kolom tabel). | SRS-MartPlace-12 | DUPL-12-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 12. Laporan Penjual - Daftar Stok Produk | 12.4 Pengujian isolasi data penjual dan urutan berdasarkan stok terbanyak. | SRS-MartPlace-12 | DUPL-12-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 12. Laporan Penjual - Daftar Stok Produk | 12.5 Pengujian boundary value stok 0 dan empty state saat belum ada produk. | SRS-MartPlace-12 | DUPL-12-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 12. Laporan Penjual - Daftar Stok Produk | 12.6 Pengujian penutupan modal laporan. | SRS-MartPlace-12 | DUPL-12-06 | Sistem | Black Box | Gege Centiana Putra |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 12 - Laporan Stok Produk Penjual)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-12-01 | Memuat modal laporan stok produk. | Login sebagai seller, buka menu Laporan, klik kartu "Laporan Stok". | <Klik> Laporan Stok | Modal laporan tampil, data laporan dimuat dan tabel ter-render. | Data diambil dari /api/seller/reports/stock/data; header memuat tanggal dan nama pembuat. |  |  |
| DUPL-12-02 | Unduh PDF dan cetak laporan. | Di modal laporan, klik "Download PDF" lalu klik "Cetak". | <Klik> Download PDF; <Klik> Cetak | File PDF terunduh dengan ekstensi .pdf; dialog print browser muncul untuk halaman saat ini. | Unduhan berjalan via blob dari /api/seller/reports/stock; tombol "Cetak" menjalankan window.print (bukan membuka PDF baru). |  |  |
| DUPL-12-03 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header menampilkan "Laporan Seller - {Nama Toko}" dan judul "Laporan Daftar Produk Berdasarkan Stock"; kolom: No, Produk, Kategori, Harga, Rating, Stock. | Format dokumen rapi dan kolom sesuai template PDF di sistem. |  |  |
| DUPL-12-04 | Validasi akurasi data dan urutan stok. | Bandingkan beberapa baris di PDF dengan data produk penjual. | Data PDF vs data sistem | Produk hanya milik seller aktif yang login; urutan berdasarkan stok terbanyak (desc). | Dataset PDF hanya dari seller_id yang login; tidak ada urutan sekunder saat stok sama. |  |  |
| DUPL-12-05 | Uji stok 0 dan empty state. | Pastikan ada produk dengan stok 0 dan/atau seller tanpa produk; buka laporan. | Stok = 0; Produk = 0 | Stok 0 tampil di tabel; jika tidak ada produk, tabel menampilkan "Tidak ada data produk" di UI dan "Tidak ada data" di PDF. | Sistem tidak crash saat data kosong atau stok 0. |  |  |
| DUPL-12-06 | Penutupan modal laporan. | Klik tombol "Tutup" atau ikon "×" pada modal. | <Klik> Tutup / × | Modal tertutup tanpa unduh/cetak otomatis. | Penutupan modal tidak memicu proses lain. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada tombol "Batal" atau "Kembali" pada modal laporan; hanya "Tutup" dan ikon "×".
- Tombol "Cetak" menjalankan window.print (mencetak halaman modal), bukan mengunduh PDF.
- Data laporan dan PDF diambil dari /api/seller/reports/stock/data dan /api/seller/reports/stock.
- Urutan data berdasarkan stok desc tanpa aturan sekunder ketika stok sama.
