# Masukan Uji Registrasi Penjual (DUPL-01)

## Data dasar valid (acuan)

| Field | Nilai contoh |
| --- | --- |
| store_name | Toko A |
| store_description | Menjual aksesoris elektronik dan gadget |
| pic_name | Ahmad Fauzi |
| pic_phone | 081234567890 |
| pic_email | pic.tokoa@example.test |
| pic_address | Jalan Merdeka No. 123 |
| pic_rt | 001 |
| pic_rw | 002 |
| pic_district | Cicendo |
| pic_city | Bandung |
| pic_province | Jawa Barat |
| pic_ktp_number | 1234567890123456 |
| pic_photo | foto-pic.jpg (image/jpeg, 500KB) |
| pic_ktp_file | ktp-pic.jpg (image/jpeg, 400KB) |

## Masukan per kasus uji

    | ID | Masukan |
    | --- | --- |
    | DUPL-01-01 | Gunakan seluruh data dasar valid (termasuk kedua file). |
    | DUPL-01-02 | Data dasar valid, tetapi store_name = "". |
    | DUPL-01-03 | Data dasar valid, tetapi store_description = "". |
    | DUPL-01-04 | Data dasar valid, tetapi pic_name = "". |
    | DUPL-01-05 | Data dasar valid, tetapi pic_phone = "ABCD-EFGH" (atau "!@#$"). |
    | DUPL-01-06 | Data dasar valid, tetapi pic_email = "budi_tanpa_domain". |
    | DUPL-01-07 | Data dasar valid, tetapi pic_address = "" dan pic_district = "". |
    | DUPL-01-08 | Data dasar valid, tetapi pic_rt = "XX" dan pic_rw = "YY". |
    | DUPL-01-09 | Data dasar valid, tetapi pic_province tidak dipilih dan pic_city tidak dipilih (biarkan placeholder). |
    | DUPL-01-10 | Data dasar valid, tetapi pic_ktp_number = "123456789". |
    | DUPL-01-11 | Data dasar valid, tetapi pic_photo = "foto.pdf" (application/pdf, <2MB). |
    | DUPL-01-12 | Data dasar valid, tetapi pic_photo = "foto_besar.jpg" (image/jpeg, 5MB). |
    | DUPL-01-13 | Data dasar valid, tetapi pic_ktp_file tidak diunggah. |
    | DUPL-01-14 | Isi sebagian data (contoh: store_name = "Toko A", store_description = "Tes"), lalu klik Batal pada step 1. |

## Kriteria evaluasi hasil

| ID | Kriteria lulus (hasil) |
| --- | --- |
| DUPL-01-01 | Submit berhasil: tampil toast sukses, redirect ke /login, API mengembalikan 201, dan data seller tersimpan dengan status PENDING. |
| DUPL-01-02 | Tampil error "Nama toko harus diisi"; tidak bisa lanjut ke step berikutnya; tidak ada request submit. |
| DUPL-01-03 | Tidak ada error; bisa lanjut ke step berikutnya dan registrasi tetap dapat diproses. |
| DUPL-01-04 | Tampil error "Nama lengkap PIC harus diisi"; tidak bisa lanjut ke step berikutnya. |
| DUPL-01-05 | Tampil error format HP ("Format: 08xxxxxxxxxx...") atau input non-angka ditolak; tidak bisa lanjut. |
| DUPL-01-06 | Tampil error "Format email tidak valid. Contoh: nama@email.com"; tidak bisa lanjut. |
| DUPL-01-07 | Tampil error "Alamat lengkap harus diisi" dan "Kecamatan harus diisi"; tidak bisa lanjut. |
| DUPL-01-08 | Tampil error "RT harus berupa angka 1-3 digit" dan "RW harus berupa angka 1-3 digit"; tidak bisa lanjut. |
| DUPL-01-09 | Tampil error "Provinsi harus dipilih" dan "Kota/Kabupaten harus dipilih"; tidak bisa lanjut. |
| DUPL-01-10 | Tampil toast error "Nomor KTP harus 16 digit angka"; submit dibatalkan. |
| DUPL-01-11 | Tampil toast error "File harus berupa gambar (JPG, PNG, dll)"; file tidak diterima. |
| DUPL-01-12 | Tampil toast error "Ukuran file foto maksimal 2MB"; file tidak diterima. |
| DUPL-01-13 | Tampil toast error "File KTP harus diupload"; submit dibatalkan; API mengembalikan 422 jika tetap dikirim. |
| DUPL-01-14 | Klik Batal pada step 1 mengarah ke "/" (halaman utama); tidak ada data tersubmit. |

## Keluaran yang diharapkan

| ID | Keluaran yang diharapkan |
| --- | --- |
| DUPL-01-01 | Toast sukses muncul, form terkirim, lalu redirect ke /login setelah ~2 detik. |
| DUPL-01-02 | Pesan error di bawah field "Nama Toko": "Nama toko harus diisi"; tetap di step 1. |
| DUPL-01-03 | Tidak ada pesan error pada "Deskripsi Toko"; bisa lanjut ke step 2. |
| DUPL-01-04 | Pesan error di bawah field "Nama Lengkap PIC": "Nama lengkap PIC harus diisi"; tetap di step 2. |
| DUPL-01-05 | Pesan error di bawah field "No. HP PIC": "Format: 08xxxxxxxxxx (8-13 digit, dimulai dengan 08)"; tetap di step 2. |
| DUPL-01-06 | Pesan error di bawah field "Email PIC": "Format email tidak valid. Contoh: nama@email.com"; tetap di step 2. |
| DUPL-01-07 | Pesan error di bawah field "Alamat Lengkap" dan "Kecamatan"; tetap di step 3. |
| DUPL-01-08 | Pesan error di bawah field "RT" dan "RW": "RT harus berupa angka 1-3 digit" dan "RW harus berupa angka 1-3 digit"; tetap di step 3. |
| DUPL-01-09 | Pesan error di bawah "Provinsi" dan "Kota/Kabupaten": "Provinsi harus dipilih" dan "Kota/Kabupaten harus dipilih"; tetap di step 3. |
| DUPL-01-10 | Toast error "Nomor KTP harus 16 digit angka"; submit dibatalkan di step 4. |
| DUPL-01-11 | Toast error "File harus berupa gambar (JPG, PNG, dll)"; file foto ditolak. |
| DUPL-01-12 | Toast error "Ukuran file foto maksimal 2MB"; file foto ditolak. |
| DUPL-01-13 | Toast error "File KTP harus diupload"; submit dibatalkan. |
| DUPL-01-14 | Navigasi kembali ke halaman utama ("/"); form tidak tersimpan. |

## Catatan

- UI registrasi menggunakan field "Kecamatan" untuk pic_district (tidak ada field "Kelurahan" terpisah).
- Tombol "Batal" hanya ada pada step 1; tidak ada tombol "Reset" khusus.
