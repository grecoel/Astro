# Rencana Uji dan Hasil Uji - Upload Produk oleh Penjual (DUPL-03)

## Tabel Rencana Uji (Kelas Uji 3)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 3. Upload Produk oleh Penjual | 3.1 Upload produk dengan semua data valid dan minimal 1 foto. | SRS-MartPlace-03 | DUPL-03-01 | Sistem | Black Box | Gege Centiana Putra |
| 3. Upload Produk oleh Penjual | 3.2 Validasi saat Nama Produk kosong. | SRS-MartPlace-03 | DUPL-03-02 | Sistem | Black Box | Gege Centiana Putra |
| 3. Upload Produk oleh Penjual | 3.3 Validasi saat Kategori belum dipilih. | SRS-MartPlace-03 | DUPL-03-03 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.4 Validasi saat Harga diisi huruf atau simbol non numerik. | SRS-MartPlace-03 | DUPL-03-04 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.5 Validasi nilai batas saat Harga atau Stok bernilai 0 atau negatif. | SRS-MartPlace-03 | DUPL-03-05 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.6 Validasi saat Stok diisi huruf (non numerik). | SRS-MartPlace-03 | DUPL-03-06 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.7 Uji berat produk kosong (opsional). | SRS-MartPlace-03 | DUPL-03-07 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.8 Validasi saat Lokasi Barang kosong. | SRS-MartPlace-03 | DUPL-03-08 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.9 Validasi saat Deskripsi Produk kosong. | SRS-MartPlace-03 | DUPL-03-09 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.10 Validasi saat tidak ada foto produk diunggah. | SRS-MartPlace-03 | DUPL-03-10 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.11 Validasi format file foto produk salah (bukan gambar). | SRS-MartPlace-03 | DUPL-03-11 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.12 Validasi ukuran file foto produk melebihi 2MB. | SRS-MartPlace-03 | DUPL-03-12 | Sistem | Black Box | Cikal Wahyuning B. |
| 3. Upload Produk oleh Penjual | 3.13 Upload produk dengan hanya 1 foto (tanpa foto tambahan). | SRS-MartPlace-03 | DUPL-03-13 | Sistem | Black Box | Cikal Wahyuning B. |
| 3. Upload Produk oleh Penjual | 3.14 Navigasi saat menekan tombol Kembali pada form upload. | SRS-MartPlace-03 | DUPL-03-14 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 3)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-03-01 | Upload produk dengan data valid. | Isi seluruh field, unggah minimal 1 foto, klik Upload Produk. | Nama, Kategori, Harga, Stok, Berat, Kondisi, Deskripsi, Lokasi valid; foto 1 file image | Muncul alert "Produk Berhasil Tayang!" lalu redirect ke /seller/dashboard. | API /api/seller/products mengembalikan 201; produk tersimpan dengan status ACTIVE; foto pertama diset sebagai utama. |  |  |
| DUPL-03-02 | Nama produk kosong. | Pilih kategori dan isi field lain valid, kosongkan Nama Produk, klik Upload Produk. | Nama Produk = <kosong> | Alert "Isi nama produk!"; tidak ada request submit. | Validasi client-side menghentikan submit. |  |  |
| DUPL-03-03 | Kategori belum dipilih. | Isi Nama Produk dan field lain valid, biarkan kategori kosong, klik Upload Produk. | Kategori = <kosong> | Alert "Pilih kategori dulu!"; tidak ada request submit. | Validasi client-side menghentikan submit. |  |  |
| DUPL-03-04 | Harga diisi huruf atau simbol. | Coba ketik huruf di field Harga. | Harga = "abc" | Field hanya menerima angka; jika tetap terkirim, backend menolak dengan error validasi price. | Input type=number mencegah huruf; tidak ada data tersimpan. |  |  |
| DUPL-03-05 | Harga atau stok bernilai 0 atau negatif. | Isi Harga 0 atau -1; isi Stok 0 atau -1; klik Upload Produk. | Harga = 0, Stok = 0 | Harga: alert "Isi harga produk dengan nilai > 0!". Stok: backend 422 dan alert berisi error "stock". | Harga <= 0 dihentikan di client; stok <= 0 ditolak oleh backend. |  |  |
| DUPL-03-06 | Stok diisi huruf. | Coba ketik huruf di field Stok. | Stok = "xyz" | Field hanya menerima angka; jika tetap terkirim, backend menolak dengan error validasi stock. | Input type=number mencegah huruf; tidak ada data tersimpan. |  |  |
| DUPL-03-07 | Berat kosong (opsional). | Kosongkan Berat, lalu klik Upload Produk. | Berat = <kosong> | Upload tetap berhasil; berat default diset oleh server. | Backend menerima nilai kosong (nullable) dan menyimpan default 1000 gram. |  |  |
| DUPL-03-08 | Lokasi barang kosong. | Kosongkan Lokasi Barang, klik Upload Produk. | Lokasi = <kosong> | Alert "Isi lokasi barang!"; tidak ada request submit. | Validasi client-side menghentikan submit. |  |  |
| DUPL-03-09 | Deskripsi produk kosong. | Kosongkan Deskripsi Produk, klik Upload Produk. | Deskripsi = <kosong> | Alert "Isi deskripsi produk!"; tidak ada request submit. | Validasi client-side menghentikan submit. |  |  |
| DUPL-03-10 | Tidak ada foto produk diunggah. | Jangan unggah foto, klik Upload Produk. | Foto = <kosong> | Alert "Upload minimal 1 foto!"; tidak ada request submit. | Validasi client-side menghentikan submit. |  |  |
| DUPL-03-11 | Format file foto salah. | Unggah file non gambar (contoh .pdf). | File = dokumen.pdf | Alert "File <nama> bukan gambar!"; file ditolak. | Validasi client-side menolak tipe file non image. |  |  |
| DUPL-03-12 | Ukuran file foto terlalu besar. | Unggah file gambar > 2MB. | File = foto_besar.jpg (3MB) | Alert "File <nama> terlalu besar (max 2MB)"; file ditolak. | Validasi client-side menolak ukuran > 2MB. |  |  |
| DUPL-03-13 | Foto tambahan kosong (hanya 1 foto). | Unggah 1 foto saja, klik Upload Produk. | Foto = 1 file image | Upload berhasil; badge "Utama" muncul pada foto pertama. | Produk tersimpan dan 1 foto diset sebagai utama (is_primary). |  |  |
| DUPL-03-14 | Tombol Kembali pada form upload. | Klik tombol Kembali di header form. | <Klik> Kembali | Navigasi ke /seller/management sesuai implementasi. | Navigasi berjalan ke URL tersebut. |  |  |

## Catatan Penyesuaian Sistem

- Kondisi produk menggunakan CustomSelect dengan nilai default "Baru"; tidak ada radio button dan tidak ada kondisi kosong.
- Harga minimal di backend adalah 100, stok minimal 1, berat minimal 1 jika diisi; frontend hanya memvalidasi harga > 0 dan tidak memvalidasi stok atau berat.
- Foto utama ditentukan dari urutan foto; foto pertama akan ditandai sebagai utama.
- Sistem membatasi maksimal 5 foto; disarankan menambah kasus uji khusus batas 5 foto.
- Tombol Kembali mengarah ke /seller/management, namun route tersebut tidak ada di daftar rute saat ini.
# Rencana Uji dan Hasil Uji - Upload Produk oleh Penjual (DUPL-03)

## Tabel Rencana Uji (Kelas Uji 3)

| Kelas Uji | Butir Uji | Identifikasi SKPL | Identifikasi DUPL | Tingkat Pengujian | Jenis Pengujian | Penguji |
| --- | --- | --- | --- | --- | --- | --- |
| 3. Upload Produk oleh Penjual | 3.1 Simpan produk saat seluruh data valid dan minimal 1 foto diunggah. | SRS-MartPlace-03 | DUPL-03-01 | Sistem | Black Box | Gege Centiana Putra |
| 3. Upload Produk oleh Penjual | 3.2 Validasi form saat field wajib "Nama Produk" kosong. | SRS-MartPlace-03 | DUPL-03-02 | Sistem | Black Box | Gege Centiana Putra |
| 3. Upload Produk oleh Penjual | 3.3 Validasi form saat dropdown "Kategori" belum dipilih. | SRS-MartPlace-03 | DUPL-03-03 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.4 Validasi tipe data saat "Harga" diisi huruf atau simbol non-numerik. | SRS-MartPlace-03 | DUPL-03-04 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.5 Validasi batas nilai saat "Harga" atau "Stok" diisi 0 atau negatif. | SRS-MartPlace-03 | DUPL-03-05 | Sistem | Black Box | Firzi Assidqie Ramadhani |
| 3. Upload Produk oleh Penjual | 3.6 Validasi tipe data saat "Stok" diisi huruf. | SRS-MartPlace-03 | DUPL-03-06 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.7 Uji opsi berat kosong (opsional). | SRS-MartPlace-03 | DUPL-03-07 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.8 Validasi saat field "Lokasi Barang" kosong. | SRS-MartPlace-03 | DUPL-03-08 | Sistem | Black Box | Erzachel Senna Rizky F. |
| 3. Upload Produk oleh Penjual | 3.9 Validasi saat "Deskripsi Produk" kosong. | SRS-MartPlace-03 | DUPL-03-09 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.10 Validasi saat tidak ada foto produk diunggah. | SRS-MartPlace-03 | DUPL-03-10 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.11 Unggah foto dengan ekstensi non-gambar (.pdf/.docx). | SRS-MartPlace-03 | DUPL-03-11 | Sistem | Black Box | Evia Auamara Unsa N. |
| 3. Upload Produk oleh Penjual | 3.12 Unggah foto dengan ukuran lebih dari 2MB. | SRS-MartPlace-03 | DUPL-03-12 | Sistem | Black Box | Cikal Wahyuning B. |
| 3. Upload Produk oleh Penjual | 3.13 Unggah hanya 1 foto (foto tambahan kosong). | SRS-MartPlace-03 | DUPL-03-13 | Sistem | Black Box | Cikal Wahyuning B. |
| 3. Upload Produk oleh Penjual | 3.14 Navigasi tombol "Kembali" di halaman upload produk. | SRS-MartPlace-03 | DUPL-03-14 | Sistem | Black Box | Cikal Wahyuning B. |

## Tabel Deskripsi dan Hasil Uji (Kelas Uji 3)

| Identifikasi | Deskripsi | Prosedur Pengujian | Masukan | Keluaran yang Diharapkan | Kriteria Evaluasi Hasil | Hasil yang Didapat | Kesimpulan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUPL-03-01 | Simpan produk saat data valid dan foto ada. | Isi semua field, pilih kategori, isi harga >= 100, stok >= 1, lokasi, deskripsi, lalu unggah 1 foto dan klik "Upload Produk". | Data valid + 1 foto gambar (<= 2MB). | Muncul alert "Produk Berhasil Tayang!" lalu redirect ke /seller/dashboard. | API /api/seller/products mengembalikan 201 dan data produk tersimpan. |  |  |
| DUPL-03-02 | Validasi nama produk kosong. | Pilih kategori dan isi field lain valid, kosongkan "Nama Produk", klik "Upload Produk". | name = "" | Alert "Isi nama produk!"; submit dibatalkan. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-03 | Validasi kategori kosong. | Isi field lain valid, biarkan kategori belum dipilih, klik "Upload Produk". | category_id = "" | Alert "Pilih kategori dulu!"; submit dibatalkan. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-04 | Validasi harga non-numerik. | Coba isi harga dengan huruf/simbol. | price = "ABCD" | Input type number menolak huruf; saat submit, alert "Isi harga produk dengan nilai > 0!" jika harga kosong. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-05 | Validasi harga/stok 0 atau negatif. | Isi harga 0 atau -1 lalu submit; ulangi dengan stok 0 atau -1. | price = 0 atau -1; stock = 0 atau -1 | Harga 0/negatif memunculkan alert "Isi harga produk dengan nilai > 0!"; stok 0/negatif memunculkan alert "Gagal: stock: ..." dari backend. | Harga gagal di frontend; stok gagal di backend (422). |  |  |
| DUPL-03-06 | Validasi stok non-numerik. | Coba isi stok dengan huruf. | stock = "ABC" | Input type number menolak huruf; jika tetap terkirim, alert "Gagal: stock: ..." dari backend. | Backend menolak jika stok tidak integer (422). |  |  |
| DUPL-03-07 | Uji berat kosong (opsional). | Kosongkan "Berat (gram)" lalu submit dengan data lain valid. | weight = "" | Produk tetap tersimpan; tidak ada error. | Backend menerima weight null dan menyimpan default 1000. |  |  |
| DUPL-03-08 | Validasi lokasi kosong. | Kosongkan "Lokasi Barang" lalu submit. | location = "" | Alert "Isi lokasi barang!"; submit dibatalkan. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-09 | Validasi deskripsi kosong. | Kosongkan "Deskripsi Produk" lalu submit. | description = "" | Alert "Isi deskripsi produk!"; submit dibatalkan. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-10 | Validasi tidak ada foto produk. | Jangan unggah foto lalu submit. | images = <kosong> | Alert "Upload minimal 1 foto!"; submit dibatalkan. | Tidak ada request ke /api/seller/products. |  |  |
| DUPL-03-11 | Validasi foto non-gambar. | Unggah file .pdf/.docx sebagai foto. | images = file non-gambar | Alert "File <nama> bukan gambar!"; file tidak ditambahkan. | File ditolak di frontend. |  |  |
| DUPL-03-12 | Validasi ukuran foto > 2MB. | Unggah foto ukuran > 2MB. | images = foto 3MB | Alert "File <nama> terlalu besar (max 2MB)"; file tidak ditambahkan. | File ditolak di frontend. |  |  |
| DUPL-03-13 | Foto tambahan kosong (unggah 1 foto saja). | Unggah 1 foto valid lalu submit. | images = 1 foto | Produk tersimpan; foto pertama ditandai "Utama" di preview. | Backend menerima images array min 1. |  |  |
| DUPL-03-14 | Navigasi tombol Kembali. | Klik tombol "Kembali" pada header form. | <Klik> Kembali | Aplikasi mencoba navigasi ke /seller/management. | Navigasi mengikuti implementasi tombol; rute /seller/management perlu tersedia agar tidak 404. |  |  |

## Catatan Penyesuaian Sistem

- Kondisi produk memakai CustomSelect dengan default "Baru", bukan radio; tidak ada state kosong.
- "Foto Utama" adalah foto pertama pada urutan preview (badge "Utama").
- Backend mensyaratkan price >= 100 dan stock >= 1; jika price di bawah 100, backend akan menolak meski frontend lolos.
- Maksimal foto adalah 5 (frontend menolak jika lebih dari 5). Tes ini dapat ditambahkan bila diperlukan.
- Tombol "Upload Produk" mengirim status ACTIVE; tombol "Simpan Draft" mengirim status DRAFT.
