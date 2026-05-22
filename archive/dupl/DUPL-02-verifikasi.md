# Rencana Uji dan Hasil Uji - Verifikasi Penjual oleh Platform (DUPL-02)

## Tabel Rencana Uji (Kelas Uji 2)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 2. Verifikasi Penjual oleh Platform | 2.1 Memuat halaman Verifikasi Penjual dan menampilkan daftar penjual berstatus PENDING. | SRS-MartPlace-02 | DUPL-02-01 | Sistem | Black Box | Gege Centiana Putra |
| 2. Verifikasi Penjual oleh Platform | 2.2 Menampilkan rincian data dan lampiran dokumen calon penjual dari daftar antrean. | SRS-MartPlace-02 | DUPL-02-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 2. Verifikasi Penjual oleh Platform | 2.3 Menyetujui calon penjual melalui tombol SETUJUI PENDAFTARAN. | SRS-MartPlace-02 | DUPL-02-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 2. Verifikasi Penjual oleh Platform | 2.4 Mengirim email notifikasi persetujuan berisi tautan aktivasi akun. | SRS-MartPlace-02 | DUPL-02-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 2. Verifikasi Penjual oleh Platform | 2.5 Menampilkan konfirmasi penolakan saat tombol TOLAK PENDAFTARAN ditekan. | SRS-MartPlace-02 | DUPL-02-05 | Sistem | Black Box | Cikal Wahyuning B. |
| 2. Verifikasi Penjual oleh Platform | 2.6 Menolak calon penjual melalui tombol TOLAK PENDAFTARAN. | SRS-MartPlace-02 | DUPL-02-06 | Sistem | Black Box | Gege Centiana Putra |
| 2. Verifikasi Penjual oleh Platform | 2.7 Mengirim email notifikasi penolakan kepada penjual. | SRS-MartPlace-02 | DUPL-02-07 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 2. Verifikasi Penjual oleh Platform | 2.8 Data yang sudah diproses (APPROVE/REJECT) hilang dari antrean aktif. | SRS-MartPlace-02 | DUPL-02-08 | Sistem | Black Box | Erzachel Senna Rizky F. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 2)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-02-01 | Pengujian memuat daftar antrean penjual (status PENDING). | Akses menu Admin -> Verifikasi Penjual (/admin/verifikasi). | <Klik> menu Verifikasi Penjual | Tabel daftar penjual muncul (kolom No, Nama Toko, Nama PIC, Email PIC, Tanggal Daftar, Aksi). Jika tidak ada data, tampil pesan "Tidak ada penjual yang menunggu verifikasi." | Data diambil dari /api/admin/pending-sellers dan hanya berisi status PENDING; loading "Memuat data penjual..." lalu tabel tampil tanpa error. |  |  |
| DUPL-02-02 | Pengujian detail calon penjual dari daftar antrean. | Klik tombol "Lihat Detail" pada salah satu baris. | <Klik> Lihat Detail pada "Toko A" | Halaman /admin/verifikasi/{id} menampilkan Data Toko, Data PIC, Alamat, dan Dokumen; link "Buka File KTP" tersedia jika ada; Foto PIC tampil jika tersedia. | Detail yang ditampilkan konsisten dengan data seller; link KTP dapat dibuka; foto tampil atau teks "Tidak ada foto tersedia" jika kosong. |  |  |
| DUPL-02-03 | Pengujian tombol SETUJUI PENDAFTARAN. | Di halaman detail, klik Setujui lalu konfirmasi. | <Klik> SETUJUI PENDAFTARAN -> <Klik> Ya, Setujui | Muncul pesan sukses "Penjual berhasil disetujui dan akan menerima email notifikasi.", lalu redirect ke /admin/seller-management setelah sekitar 2 detik. | Status seller berubah ke ACTIVE dan request /api/admin/sellers/{id}/verify action=APPROVE berhasil. |  |  |
| DUPL-02-04 | Pengujian email notifikasi persetujuan. | Buka inbox email penjual yang disetujui. | Email = penjual_a@email.com | Email masuk dengan subjek "Toko Disetujui - AstroEcomm" berisi tautan aktivasi /aktivasi-akun?token=...&email=.... | Email terkirim otomatis setelah approve; tautan aktivasi valid dan membuka halaman aktivasi akun. |  |  |
| DUPL-02-05 | Pengujian konfirmasi penolakan. | Di halaman detail, klik Tolak lalu pilih Batal. | <Klik> TOLAK PENDAFTARAN -> <Klik> Batal | Modal "Konfirmasi Aksi" tampil; saat Batal dipilih tidak ada perubahan status dan tetap di halaman detail. | Tidak ada request penolakan yang diproses; status seller tetap PENDING; tidak ada email terkirim. |  |  |
| DUPL-02-06 | Pengujian tombol TOLAK PENDAFTARAN. | Di halaman detail, klik Tolak lalu konfirmasi. | <Klik> TOLAK PENDAFTARAN -> <Klik> Ya, Tolak | Muncul pesan sukses "Penjual berhasil ditolak dan akan menerima email notifikasi.", lalu redirect ke /admin/seller-management setelah sekitar 2 detik. | Status seller berubah ke REJECTED dan request /api/admin/sellers/{id}/verify action=REJECT berhasil. |  |  |
| DUPL-02-07 | Pengujian email notifikasi penolakan. | Buka inbox email penjual yang ditolak. | Email = penjual_b@email.com | Email masuk dengan subjek "Pendaftaran Penjual Ditolak!" berisi informasi penolakan dan tombol "Coba Pendaftaran Ulang" ke /register. | Email terkirim otomatis setelah reject; isi email tidak memuat alasan spesifik karena sistem belum menyimpan alasan. |  |  |
| DUPL-02-08 | Pengujian hilangnya data terverifikasi dari antrean aktif. | Setelah approve/reject, buka kembali halaman antrean dan refresh. | <Refresh> halaman /admin/verifikasi | Seller yang sudah diproses tidak muncul di tabel; jika kosong, tampil pesan "Tidak ada penjual yang menunggu verifikasi." | Data antrean hanya menampilkan status PENDING. |  |  |

## Catatan Penyesuaian Sistem

- Tidak ada field "Alasan Penolakan" pada UI maupun API verifikasi; penolakan hanya melalui konfirmasi modal.
- Email penolakan tidak memuat alasan khusus, hanya informasi penolakan umum dan tautan pendaftaran ulang.
- Redirect setelah approve/reject menuju /admin/seller-management sesuai implementasi saat ini.
