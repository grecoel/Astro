# Rencana Uji dan Hasil Uji - Pemberian Komentar dan Rating (DUPL-06)

## Tabel Rencana Uji (Kelas Uji 6)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 6. Pemberian Komentar dan Rating | 6.1 Submit ulasan saat semua field wajib terisi valid. | SRS-MartPlace-06 | DUPL-06-01 | Sistem | Black Box | Gege Centiana Putra |
| 6. Pemberian Komentar dan Rating | 6.2 Validasi saat field Nama kosong. | SRS-MartPlace-06 | DUPL-06-02 | Sistem | Black Box | Gege Centiana Putra |
| 6. Pemberian Komentar dan Rating | 6.3 Validasi saat field Nomor HP kosong. | SRS-MartPlace-06 | DUPL-06-03 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 6. Pemberian Komentar dan Rating | 6.4 Input Nomor HP berisi huruf/simbol. | SRS-MartPlace-06 | DUPL-06-04 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 6. Pemberian Komentar dan Rating | 6.5 Validasi saat field Email kosong. | SRS-MartPlace-06 | DUPL-06-05 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 6. Pemberian Komentar dan Rating | 6.6 Validasi format Email tidak valid. | SRS-MartPlace-06 | DUPL-06-06 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 6. Pemberian Komentar dan Rating | 6.7 Validasi saat rating belum dipilih. | SRS-MartPlace-06 | DUPL-06-07 | Sistem | Black Box | Evia Auamara Unsa N. |
| 6. Pemberian Komentar dan Rating | 6.8 Navigasi pembatalan (Batal) pada form ulasan. | SRS-MartPlace-06 | DUPL-06-08 | Sistem | Black Box | Cikal Wahyuning B. |
| 6. Pemberian Komentar dan Rating | 6.9 Email notifikasi terima kasih setelah ulasan berhasil. | SRS-MartPlace-06 | DUPL-06-09 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 6)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-06-01 | Submit ulasan saat semua data valid. | Di halaman produk, klik "Beri Rating & Komentar", isi form lengkap lalu klik "Kirim". | Nama, No HP, Email, Provinsi, Kota, Rating 1-5, Komentar valid | Toast sukses "Terima kasih! Review Anda berhasil dikirim. Silakan cek email Anda.", modal tertutup, data ulasan tampil setelah refresh data. | API /api/reviews mengembalikan 201 dan ulasan tersimpan; rating/komen masuk ke daftar. |  |  |
| DUPL-06-02 | Nama kosong. | Kosongkan Nama, isi field lain valid, klik "Kirim". | Nama = <kosong> | Error box tampil "Semua field harus diisi"; submit dibatalkan. | Validasi client-side menghentikan submit; tidak ada request ke API. |  |  |
| DUPL-06-03 | Nomor HP kosong. | Kosongkan Nomor HP, isi field lain valid, klik "Kirim". | No HP = <kosong> | Error box "Semua field harus diisi"; submit dibatalkan. | Validasi client-side menghentikan submit. |  |  |
| DUPL-06-04 | Nomor HP berisi huruf/simbol. | Isi Nomor HP dengan "ABCD" atau "!@#", isi field lain valid, klik "Kirim". | No HP = "ABCD" | Ulasan tetap bisa terkirim (tidak ada validasi numerik). | Backend menerima reviewer_phone sebagai string; ulasan tersimpan. |  |  |
| DUPL-06-05 | Email kosong. | Kosongkan Email, isi field lain valid, klik "Kirim". | Email = <kosong> | Error box "Semua field harus diisi"; submit dibatalkan. | Validasi client-side menghentikan submit. |  |  |
| DUPL-06-06 | Email format tidak valid. | Isi email tanpa format valid (mis. "budi_tanpa_domain"), klik "Kirim". | Email = "budi_tanpa_domain" | Browser menolak submit dan menampilkan pesan validasi native; jika bypass, API mengembalikan 422. | Validasi HTML5/Backend mencegah email tidak valid. |  |  |
| DUPL-06-07 | Rating belum dipilih. | Jangan pilih bintang rating, isi field lain valid, klik "Kirim". | Rating = <kosong> | Teks "Rating diperlukan" tampil dan tombol Kirim tetap disabled; jika dipaksa submit, error "Pilih rating terlebih dahulu". | Tidak ada request ke API saat rating kosong. |  |  |
| DUPL-06-08 | Pembatalan ulasan. | Klik tombol "Batal" pada modal ulasan. | <Klik> Batal | Modal tertutup tanpa menyimpan data. | Tidak ada request ke API; data ulasan tidak berubah. |  |  |
| DUPL-06-09 | Email terima kasih setelah ulasan sukses. | Kirim ulasan valid, lalu cek inbox email pengulas. | Email pengulas valid | Email masuk dengan subjek "Terima Kasih atas Review - AstroEcomm". | Email dikirim setelah ulasan tersimpan (asinkron). Jika pengiriman gagal, ulasan tetap tersimpan. |  |  |

## Catatan Penyesuaian Sistem

- Field Provinsi dan Kota wajib diisi (menggunakan CustomSelect) dan divalidasi bersama field lain.
- Validasi nomor HP hanya required; tidak ada validasi numerik di UI maupun backend.
- Pesan error untuk field kosong digabung menjadi "Semua field harus diisi" (bukan per-field).
- Ada pembatasan 1 review per email per produk (API menolak jika email sudah pernah review). Ini bisa dijadikan kasus uji tambahan.
