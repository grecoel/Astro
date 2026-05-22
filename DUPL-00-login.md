# Rencana Uji dan Hasil Uji - Login (DUPL-00)

## Tabel Rencana Uji (Kelas Uji 0)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 0. Pengujian Login (Masuk Akun) | 0.1 Login dengan email dan password valid. | SRS-MartPlace-00 | DUPL-00-01 | Sistem | Black Box | Gege Centiana Putra |
| 0. Pengujian Login (Masuk Akun) | 0.2 Validasi form saat email dan password kosong. | SRS-MartPlace-00 | DUPL-00-02 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 0. Pengujian Login (Masuk Akun) | 0.3 Menolak login saat email atau password salah. | SRS-MartPlace-00 | DUPL-00-03 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 0. Pengujian Login (Masuk Akun) | 0.4 Password masking pada field password. | SRS-MartPlace-00 | DUPL-00-04 | Sistem | Black Box | Evia Auamara Unsa N. |
| 0. Pengujian Login (Masuk Akun) | 0.5 Redirect berdasarkan role (admin vs seller). | SRS-MartPlace-00 | DUPL-00-05 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 0)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-00-01 | Login dengan kredensial valid. | Isi email dan password valid, lalu klik "LOG IN". | Email: akun_valid@email.com<br>Password: rahasia123 | Tampil toast sukses "Selamat datang, <nama>!"; token tersimpan di localStorage; redirect ke dashboard sesuai role setelah sekitar 1 detik. | API /api/login mengembalikan token; aplikasi menyimpan token dan user, lalu navigasi ke /admin/dashboard atau /seller/dashboard. |  |  |
| DUPL-00-02 | Validasi form login dengan input kosong. | Biarkan email dan password kosong, lalu klik "LOG IN". | Email: <kosong><br>Password: <kosong> | Toast error "Email harus diisi"; tidak ada request ke API. | Submit dihentikan di client-side; pesan error muncul hanya untuk email terlebih dahulu. |  |  |
| DUPL-00-03 | Login dengan kombinasi kredensial salah. | Isi email valid, isi password salah, lalu klik "LOG IN". | Email: akun_valid@email.com<br>Password: salah123 | Toast error "Email atau password salah. Silakan periksa kembali."; tetap di halaman login. | API /api/login merespons 401; tidak ada token tersimpan. |  |  |
| DUPL-00-04 | Password masking pada field password. | Ketikkan karakter pada field password. | Password: rahasia123 | Karakter tampil sebagai titik atau simbol masking. | Field password menggunakan type="password" dan nilai tidak terlihat jelas. |  |  |
| DUPL-00-05 | Redirect berdasarkan role. | Login sebagai seller, logout, lalu login sebagai admin. | Data login seller, lalu data login admin | Seller diarahkan ke /seller/dashboard; admin diarahkan ke /admin/dashboard. | Redirect mengikuti role dari response login (admin/seller). |  |  |

## Catatan Penyesuaian Sistem

- Validasi kosong tidak menampilkan pesan gabungan; jika email kosong, hanya toast "Email harus diisi" yang muncul.
- Login menggunakan token (SPA) dan menyimpan token di localStorage, bukan session server-side.
- Pesan error login yang ditampilkan mengikuti mapping di UI, bukan teks mentah dari API.
