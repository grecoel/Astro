# Rencana Uji dan Hasil Uji - Laporan Penjual per Provinsi (DUPL-10)

## Tabel Rencana Uji (Kelas Uji 10)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.1 Pengujian pemuatan halaman laporan dan modal laporan penjual per provinsi. | SRS-MartPlace-10 | DUPL-10-01 | Sistem | Black Box | Gege Centiana Putra |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.2 Pengujian proses unduh PDF dan cetak laporan. | SRS-MartPlace-10 | DUPL-10-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.3 Pengujian keakuratan format visual dokumen PDF (judul, metadata, dan kolom tabel). | SRS-MartPlace-10 | DUPL-10-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.4 Pengujian akurasi data penjual pada PDF (hanya status Aktif dan urutan provinsi). | SRS-MartPlace-10 | DUPL-10-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.5 Pengujian penanganan kondisi empty record. | SRS-MartPlace-10 | DUPL-10-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 10. Pencetakan Laporan Penjual per Provinsi | 10.6 Pengujian penutupan modal laporan dan navigasi kembali ke dashboard. | SRS-MartPlace-10 | DUPL-10-06 | Sistem | Black Box | Gege Centiana Putra |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 10 - Laporan Penjual per Provinsi)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-10-01 | Memuat halaman laporan dan modal laporan penjual per provinsi. | Login sebagai Admin Platform, buka halaman Laporan, klik kartu "Laporan Toko per Provinsi". | <Klik> Laporan Toko per Provinsi | Modal laporan tampil, data laporan dimuat dan tabel ter-render. | Data diambil dari /api/admin/reports/sellers/province/data; tidak ada error alert saat memuat. |  |  |
| DUPL-10-02 | Unduh PDF dan cetak laporan. | Di modal laporan, klik "Download PDF" lalu klik "Cetak". | <Klik> Download PDF; <Klik> Cetak | File PDF terunduh dengan ekstensi .pdf; tab baru terbuka untuk proses cetak. | Unduhan berjalan via blob; tombol "Cetak" membuka tab PDF dan memicu dialog print. |  |  |
| DUPL-10-03 | Validasi layout dan header di dalam PDF. | Buka file PDF dan periksa header, metadata, serta kolom tabel. | Dokumen PDF keluaran sistem | Header memuat judul "Laporan Daftar Toko Berdasarkan Lokasi Provinsi" dan metadata tanggal dibuat; kolom tabel: No, Nama Toko, Nama PIC, Provinsi. | Format dokumen rapi dan kolom sesuai dengan template PDF di sistem. |  |  |
| DUPL-10-04 | Validasi akurasi data PDF terhadap data sistem. | Bandingkan sebagian isi PDF dengan data penjual di sistem. | Data PDF vs data sistem | Hanya penjual berstatus Aktif yang tampil; urutan data berdasarkan provinsi lalu nama toko. | Dataset PDF sesuai hasil query laporan (status Aktif, urutan provinsi). |  |  |
| DUPL-10-05 | Uji laporan empty record. | Pastikan tidak ada penjual aktif, lalu buka modal laporan. | Data penjual aktif = 0 | Modal menampilkan pesan "Belum ada data penjual"; PDF tetap bisa digenerate tanpa error. | Sistem tidak crash ketika data kosong; respons tetap 200 untuk PDF. |  |  |
| DUPL-10-06 | Penutupan modal dan navigasi kembali. | Klik tombol "×" atau area luar modal untuk menutup; gunakan tombol "Kembali ke Dashboard" pada halaman laporan. | <Klik> Tutup; <Klik> Kembali ke Dashboard | Modal tertutup tanpa unduh; navigasi kembali ke /admin/dashboard. | Penutupan modal tidak memicu cetak/unduh; tombol kembali mengarah ke dashboard. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada dropdown "Lokasi Provinsi" atau filter pemilihan provinsi pada modal.
- Data laporan dan PDF diambil dari /api/admin/reports/sellers/province/data dan /api/admin/reports/sellers/province/pdf.
- PDF tidak menggunakan judul dinamis per provinsi karena tidak ada filter provinsi.
- Data hanya menampilkan penjual berstatus Aktif dan diurutkan berdasarkan provinsi.
- Tidak ada tombol "Batal" di modal; penutupan via tombol "×" atau klik area luar modal.
