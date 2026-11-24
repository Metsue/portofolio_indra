# Muhammad Indra — Portfolio

Portofolio bertema dark purple, dibangun dengan **Laravel 13 + React 19 + TypeScript + Vite**. Versi Laravel berjalan lokal; versi statis untuk GitHub Pages dibangun dari frontend yang sama. Layout mengikuti referensi video: navbar pill, hero dengan kartu identitas menggantung, About, pendidikan/pengalaman, statistik, listening room, portfolio bertab, detail proyek, sertifikat, dan contact.

## Website publik di GitHub Pages

Repository: `https://github.com/Metsue/portofolio_indra`. Alamat publik: `https://metsue.github.io/portofolio_indra/`. Workflow `.github/workflows/pages.yml` membangun dan menerbitkan situs pada setiap push ke `main`. Di **Settings → Pages**, sumber deployment adalah **GitHub Actions**. Build lokal untuk memeriksa versi publik: `npm.cmd run build:pages`; hasil berada di `dist-pages/` dan tidak ikut masuk Git. Untuk menguji situs yang sudah online, jalankan `$env:PAGES_TEST_URL='https://metsue.github.io/portofolio_indra/'; node scripts/pages-browser-qa.mjs`.

GitHub Pages hanya melayani file statis. Karena itu versi publik menggunakan navigasi berbasis hash agar halaman detail proyek bisa dibuka ulang, contact melalui `mailto:` dan Instagram, serta panel ajakan kolaborasi sebagai pengganti guestbook Laravel. Guestbook yang menyimpan komentar tetap ada pada versi Laravel lokal; untuk mengaktifkannya di internet dibutuhkan hosting backend terpisah. Aset foto dan sertifikat di `public/assets/` memang ikut diterbitkan sebagai bagian portofolio publik.

## Buka website

Aktifkan Apache XAMPP, lalu buka **http://localhost/portofolio_indra/**. Alamat tersebut mengarah ke aplikasi Laravel di `/portofolio_indra/public/`.

Dependensi dan build sudah dipasang di komputer ini. Setelah mengubah frontend:

```powershell
npm.cmd run build
```

Untuk instalasi ulang di checkout baru:

```powershell
composer install
npm.cmd ci
Copy-Item .env.example .env
php artisan key:generate
npm.cmd run build
```

Jangan menimpa `.env` atau membuat ulang APP_KEY pada instalasi yang sedang digunakan. Tidak perlu migrasi database untuk fitur portofolio ini: session, cache, dan guestbook menggunakan file. PHP minimal 8.3 diperlukan; lingkungan yang diuji PHP 8.5.10.

Untuk pengembangan dengan HMR, jalankan `npm.cmd run dev` lalu buka alamat Laravel di atas. Vite hanya melayani aset, bukan halaman aplikasi. Alternatif tanpa Apache: `php artisan serve --host=127.0.0.1 --port=8000`, lalu buka http://127.0.0.1:8000. Hentikan Vite ketika selesai agar Laravel kembali menggunakan hasil build.

Untuk hosting Laravel dengan backend di tempat lain, document root harus menunjuk ke `public/`, atur APP_URL sesuai domain, APP_ENV=production, APP_DEBUG=false. Jangan menyediakan root repository sebagai document root publik tanpa pembatasan. Konfigurasi root `.htaccess` saat ini khusus subfolder XAMPP ini dan menolak akses source, konfigurasi, vendor, serta storage.

## Interaksi

- Kartu menggunakan foto **memegang jam tangan**, `public/assets/indra/hero-watch.webp`, dari foto asli yang dikirim pengguna. Crop foto dinaikkan agar rambut dan wajah terlihat jelas.
- Tarik kartu atau talinya untuk memindahkan kartu; lepas untuk melihat ayunan dan inersia. Mode **Putar** atau Shift + tarik memutar sisi kartu dalam 3D. **Balik** menampilkan belakang; **Reset** mengembalikan posisi.
- Mendukung mouse, sentuhan, pointer capture, dan keyboard: panah kiri/kanan memutar, atas/bawah memberi impuls, Enter/Space membalik, Home reset. Simulasi spring dan tali SVG digambar setiap frame yang diperlukan; perspektif menggunakan CSS 3D.
- Bintang, meteor, aurora hero, glow kursor, kartu proyek yang mengikuti gerak pointer, sorotan kartu, transisi tab bertahap, reveal saat scroll, marquee, angka statistik, dan vinyl animasi. Potret About bergerak lembut mengikuti pointer dengan orbit dan cahaya di belakang. Tombol pause navbar serta `prefers-reduced-motion` mengurangi animasi.
- Sertifikat memiliki filter, preview native dialog, zoom, navigasi halaman lampiran, dan Escape. Pencapaian terhubung ke bukti sertifikat.

## Konten terverifikasi

Hanya tiga proyek yang ditampilkan sesuai permintaan terakhir:

| Proyek      | Sumber lokal                                                                             | Screenshot                                           |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| PyroRescue  | `C:\xampp\htdocs\PyroRescue`, dokumentasi, routes, halaman pengembang                    | Halaman publik aplikasi asli                         |
| SiagaGambut | `C:\xampp\htdocs\parujiklahanbasah`, README dan halaman About                            | Aset asli `artifacts/home-1440.png`, demo dan lesson |
| SIPKOS      | `C:\xampp\htdocs\web_sipkos_2`, README dan dokumentasi; API pendukung di `sipkos-ai-api` | Halaman publik aplikasi asli                         |

Folder proyek tersebut hanya dibaca dengan izin pengguna. EduKit Banua, IsyaratKita, dan GambutQuest tidak ditampilkan dan tidak perlu dikirim untuk versi ini. Pendidikan ULM/Pendidikan Komputer dan kontribusi PyroRescue berasal dari halaman pengembang; pendidikan TKJ/SMK Negeri 1 Gambut dan pengalaman industri berasal dari sertifikat.

## Sertifikat dan pencapaian

Delapan dokumen bernama Muhammad Indra dari `D:\Downloads\sertifikat.zip` ditampilkan:

1. BNSP / LSP Media Informatika — Network Administrator Muda, 27 Maret 2024.
2. Committee Pueblo Science Workshop, FKIP ULM, 28–29 Mei 2025.
3. Praktik Kerja Industri, PT Suka Guna Indonesia, 3 Juli–20 Oktober 2023.
4. Penilaian praktik industri TKJ, SMK Negeri 1 Gambut, 1 November 2023; hasil kerja **94,56 — Sangat Baik**.
5. Seminar Nasional Konservasi Alam, BEM FKIP ULM, 21 Agustus 2024.
6. Seminar Peran Pustakawan di Era Digital, e-Guru.id, 23 September 2024, 4 JP. Memiliki halaman lampiran materi.
7. Bincang Rupawan, Bank Indonesia, 8 November 2024.
8. Partisipasi PEMIRA FKIP ULM 2024.

PDF dirender dan gambar dioptimalkan menjadi WebP, disertai thumbnail terpisah. Resolusi penuh tetap tersedia di viewer. Tiga pencapaian adalah sertifikasi BNSP, kontribusi panitia Pueblo Science, dan hasil praktik industri; tidak dibuat sebagai penghargaan lomba.

Dua sertifikat public speaking tidak ditampilkan karena kolom nama pada gambar masih kosong. Sertifikat vaksin tidak dimasukkan ke portofolio. Materi asli tetap berada di ZIP pengguna; salinan kerja audit dipindahkan ke folder cadangan di Downloads, bukan aset publik.

## Listening room

Tersedia 10 video YouTube, pemilihan lagu, acak tanpa mengulang lagu yang sedang dipilih, sebelumnya/berikutnya, serta stop yang melepas iframe. Tidak ada autoplay sebelum interaksi. Seek, volume, dan playback memakai kontrol YouTube; tautan langsung tersedia jika embed dibatasi.

**Tarot — .Feast** berasal dari tautan pengguna: https://www.youtube.com/watch?v=EHP-mktD8uE. Sembilan lagu lainnya adalah rekomendasi, bukan klaim riwayat dengar pribadi: Nina, Evaluasi, Rumah ke Rumah, Secukupnya, Bertaut, Satu Bulan, Rehat, Gala Bunga Matahari, dan Rayuan Perempuan Gila. Semua ID/judul diperiksa melalui YouTube oEmbed. Data dan URL video ada di `src/data/playlist.ts`.

## Contact dan guestbook

Email: **mhmmadindrra@gmail.com**. Satu-satunya media sosial adalah Instagram **@mhmmd\_.indra**.

Default contact memakai `mailto:`: formulir menyiapkan subjek/pesan, lalu pengguna menyelesaikan pengiriman di aplikasi email. Website tidak menyatakan bahwa email sudah terkirim. Untuk mengaktifkan pengiriman langsung, isi konfigurasi SMTP melalui variabel MAIL_* di `.env`, set MAIL_MAILER=smtp dan CONTACT_MAIL_ENABLED=true, lalu `php artisan config:clear`. Jangan memasukkan password ke variabel VITE. SMTP nyata belum diuji karena kredensial belum disediakan.

Guestbook tersimpan di `storage/app/private/guestbook.json` dan terbaca antar-browser. Maksimal 100 catatan; hanya pemilik sesi browser yang dapat menghapus catatannya. Nama maksimal 50 karakter, komentar 1000. Backend memakai validasi, session ownership, pembatasan request, proteksi request-forgery Laravel, dan file locking. Isi dirender sebagai teks React. Tidak ada komentar contoh yang dibuat sebagai testimoni.

## Struktur utama

- `routes/web.php`, `app/Http/Controllers/`: halaman Laravel dan endpoint guestbook/contact.
- `app/Services/GuestbookStore.php`: penyimpanan file dengan lock.
- `resources/views/portfolio.blade.php`: shell HTML, konfigurasi runtime, CSRF, dan aset Vite.
- `src/components/`: UI reusable; HangingIdCard, MusicPanel, CertificateGallery, Contact, dan Interactions.
- `src/data/`: profil, tiga proyek, sertifikat, pencapaian, teknologi, dan playlist.
- `src/styles/`: tema/layout, tata cahaya potret About yang transparan, dan interaksi tambahan.
- `public/assets/`: foto, screenshot proyek, sertifikat WebP. Semua font disajikan lokal.

Foto About menggunakan foto baru berjas almamater kuning yang dikirim pengguna. Latar dihapus menjadi transparan dan hasilnya dikompresi sebagai `public/assets/indra/about-cutout.webp` (sekitar 100 KB). Foto ID tetap foto asli yang sedang memegang jam. Link demo/repository atau CV hanya ditambahkan setelah URL/file aslinya tersedia.

Screenshot proyek asli juga sudah dikonversi ke WebP. Gambar lama, build statis lama, dan file setup dipindahkan keluar folder website ke `D:\Downloads\portofolio_indra_unused_backup` agar dapat dipulihkan bila perlu. Build terbaru hanya menyertakan font WOFF2 lokal. Folder `.qa/` hanya menyimpan ringkasan pemeriksaan terbaru; screenshot lengkap diarsipkan di `D:\Downloads\portofolio_indra_unused_backup\qa-review` agar folder kerja tetap ringan.

## Pengujian

```powershell
npm.cmd run build
php artisan test --compact
npm.cmd run test:browser
node scripts/touch-and-details-qa.mjs
```

Suite PHP memeriksa persistensi/ownership, validasi, status email tanpa SMTP, serta route yang valid/tidak valid. Suite browser menggunakan Chrome lokal dan Apache; override CHROME_PATH untuk suite utama bila diperlukan. Meliputi tarik kartu/tali, putar/reset, sertifikat/filter/zoom/lampiran, proyek/detail/reload, playlist, guestbook antar-browser, proteksi request, reduced motion, keyboard, serta overflow 360/390/768/1024/1440 px. Suite sentuhan memakai native Chrome touch events dan memeriksa ketiga detail proyek serta galeri mobile.

Hasil QA terbaru disimpan di `.qa/`; screenshot pemeriksaan sebelumnya diarsipkan di folder cadangan tersebut. Komentar uji dihapus setelah pengujian. Pemutaran video tetap bergantung pada ketersediaan dan kebijakan YouTube.
