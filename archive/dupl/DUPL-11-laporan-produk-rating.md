# Rencana Uji dan Hasil Uji - Laporan Produk & Rating (DUPL-11)

## Tabel Rencana Uji (Kelas Uji 11)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 11. Laporan Platform - Daftar Produk & Rating | 11.1 Pengujian pemuatan halaman laporan dan modal "Laporan Produk Rating". | SRS-MartPlace-11 | DUPL-11-01 | Sistem | Black Box | Gege Centiana Putra |
| 11. Laporan Platform - Daftar Produk & Rating | 11.2 Pengujian eksekusi cetak dan unduh PDF laporan. | SRS-MartPlace-11 | DUPL-11-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 11. Laporan Platform - Daftar Produk & Rating | 11.3 Pengujian keakuratan format visual dokumen PDF (judul, metadata, dan kolom tabel). | SRS-MartPlace-11 | DUPL-11-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 11. Laporan Platform - Daftar Produk & Rating | 11.4 Pengujian akurasi data dan urutan berdasarkan rating tertinggi. | SRS-MartPlace-11 | DUPL-11-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 11. Laporan Platform - Daftar Produk & Rating | 11.5 Pengujian kondisi empty state ketika belum ada produk yang memiliki rating. | SRS-MartPlace-11 | DUPL-11-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 11. Laporan Platform - Daftar Produk & Rating | 11.6 Pengujian penutupan modal laporan dan navigasi kembali ke dashboard. | SRS-MartPlace-11 | DUPL-11-06 | Sistem | Black Box | Gege Centiana Putra |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 11 - Laporan Produk & Rating)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-11-01 | Memuat halaman laporan dan modal laporan produk rating. | Login sebagai Admin Platform, buka halaman Laporan, klik kartu "Laporan Produk Rating". | <Klik> Laporan Produk Rating | Modal laporan tampil, data laporan dimuat dan tabel ter-render. | Data diambil dari /api/admin/reports/products/rating/data; tidak ada error alert saat memuat. |  |  |
| DUPL-11-02 | Unduh PDF dan cetak laporan produk rating. | Di modal laporan, klik "Download PDF" lalu klik "Cetak". | <Klik> Download PDF; <Klik> Cetak | File PDF terunduh dengan ekstensi .pdf; tab baru terbuka untuk proses cetak. | Unduhan berjalan via blob; tombol "Cetak" membuka tab PDF dan memicu dialog print. |  |  |
| DUPL-11-03 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header memuat judul "Laporan Daftar Produk Berdasarkan Rating" dan metadata tanggal dibuat; kolom tabel: No, Produk, Kategori, Harga, Rating, Nama Toko, Provinsi. | Format dokumen rapi dan kolom sesuai template PDF di sistem. |  |  |
| DUPL-11-04 | Validasi akurasi data dan urutan rating. | Bandingkan beberapa baris di PDF dengan data produk dan review di sistem. | Data PDF vs data sistem | Hanya produk yang memiliki review yang muncul; urutan berdasarkan rating tertinggi ke terendah. | Dataset PDF berasal dari produk yang memiliki review; urutan mengikuti rating desc tanpa kriteria sekunder. |  |  |
| DUPL-11-05 | Uji empty state ketika belum ada produk dengan rating. | Pastikan tidak ada produk yang memiliki review, lalu buka modal laporan. | Produk ber-rating = 0 | Modal menampilkan pesan "Belum ada data produk dengan rating"; PDF tetap bisa digenerate tanpa error. | Sistem tidak crash ketika data kosong; respons tetap 200 untuk PDF. |  |  |
| DUPL-11-06 | Penutupan modal dan navigasi kembali. | Klik tombol "×" atau area luar modal untuk menutup; gunakan tombol "Kembali ke Dashboard" pada halaman laporan. | <Klik> Tutup; <Klik> Kembali ke Dashboard | Modal tertutup tanpa unduh; navigasi kembali ke /admin/dashboard. | Penutupan modal tidak memicu cetak/unduh; tombol kembali mengarah ke dashboard. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada tombol "Batal" di modal; penutupan via tombol "×" atau klik area luar modal.
- Data laporan dan PDF diambil dari /api/admin/reports/products/rating/data dan /api/admin/reports/products/rating/pdf.
- Laporan hanya memuat produk yang memiliki review (rating). Produk tanpa review tidak masuk laporan.
- Kolom "Provinsi" diisi dari provinsi pemberi rating (reviewer), bukan lokasi toko.
- Tidak ada aturan urutan sekunder saat rating sama.
