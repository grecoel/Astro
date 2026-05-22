# Rencana Uji dan Hasil Uji - Laporan Akun Penjual (DUPL-09)

## Tabel Rencana Uji (Kelas Uji 9)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 9. Pencetakan Laporan Akun Penjual | 9.1 Pengujian pemuatan halaman laporan dan modal laporan penjual. | SRS-MartPlace-09 | DUPL-09-01 | Sistem | Black Box | Gege Centiana Putra |
| 9. Pencetakan Laporan Akun Penjual | 9.2 Pengujian proses unduh PDF dan cetak laporan. | SRS-MartPlace-09 | DUPL-09-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 9. Pencetakan Laporan Akun Penjual | 9.3 Pengujian keakuratan format visual dokumen PDF (judul, metadata, dan kolom tabel). | SRS-MartPlace-09 | DUPL-09-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 9. Pencetakan Laporan Akun Penjual | 9.4 Pengujian akurasi data penjual pada PDF terhadap data saat request dibuat. | SRS-MartPlace-09 | DUPL-09-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 9. Pencetakan Laporan Akun Penjual | 9.5 Pengujian penutupan modal laporan dan navigasi kembali ke dashboard. | SRS-MartPlace-09 | DUPL-09-05 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 9 - Laporan Akun Penjual)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-09-01 | Memuat halaman laporan dan modal laporan penjual. | Login sebagai Admin Platform, buka halaman Laporan, klik kartu "Laporan Penjual". | <Klik> Laporan Penjual | Modal laporan tampil, data laporan dimuat dan tabel ter-render. | Data diambil dari /api/admin/reports/sellers/data; tidak ada error alert saat memuat. |  |  |
| DUPL-09-02 | Unduh PDF dan cetak laporan penjual. | Di modal laporan, klik "Download PDF" lalu klik "Cetak". | <Klik> Download PDF; <Klik> Cetak | File PDF terunduh dengan ekstensi .pdf; tab baru terbuka untuk proses cetak. | Unduhan berjalan via blob; tombol "Cetak" membuka tab PDF dan memicu dialog print. |  |  |
| DUPL-09-03 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header memuat judul "Laporan Daftar Akun Penjual" dan metadata Tanggal, Dicetak Oleh, Total Data; kolom tabel: No, Nama User, Nama PIC, Nama Toko, Status. | Format dokumen rapi dan kolom sesuai dengan template PDF di sistem. |  |  |
| DUPL-09-04 | Validasi akurasi data PDF terhadap data sistem saat request dibuat. | Bandingkan sebagian isi PDF dengan data penjual di sistem. | Data PDF vs data sistem | Data nama user, PIC, nama toko, dan status sesuai data pada saat PDF dibuat; urutan status menempatkan "Aktif" lebih dulu. | Dataset PDF sesuai hasil query laporan; tidak ada filter status di UI. |  |  |
| DUPL-09-05 | Penutupan modal laporan dan navigasi kembali. | Klik tombol "×" atau area luar modal untuk menutup laporan; gunakan tombol "Kembali ke Dashboard" pada halaman laporan. | <Klik> Tutup; <Klik> Kembali ke Dashboard | Modal tertutup tanpa unduh; navigasi kembali ke /admin/dashboard. | Penutupan modal tidak memicu cetak/unduh; tombol kembali mengarah ke dashboard. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada filter status (Semua/Aktif/Tidak Aktif) pada modal laporan penjual.
- Tombol yang tersedia adalah "Cetak" dan "Download PDF"; tidak ada tombol "Batal" di modal.
- Data laporan dan PDF diambil dari /api/admin/reports/sellers/data dan /api/admin/reports/sellers/pdf.
- Urutan data: status Aktif lebih dahulu, lalu Tidak Aktif.
