# Hapakat

Website buku audio cerita rakyat Kalimantan Tengah, dibuat dengan Next.js 16 App Router, React 19, TypeScript, dan Tailwind CSS 4. Data pengunjung memakai Postgres saat `DATABASE_URL` tersedia; SQLite digunakan hanya untuk pengembangan lokal tanpa URL tersebut.

Memerlukan Node.js 24.x sesuai `package.json`.

## Arsitektur proyek

| Lokasi | Tanggung jawab |
| --- | --- |
| `src/app/` | Halaman, metadata, sitemap, robots, dan Route Handler API. |
| `src/components/` | Komponen antarmuka, pemutar cerita, katalog interaktif, dan formulir. |
| `src/lib/stories.ts` | Katalog sembilan cerita dan path media berdasarkan slug. |
| `src/lib/db.ts` | Skema dan operasi data untuk Postgres atau SQLite. |
| `src/lib/admin.ts` | Verifikasi kata sandi dan cookie sesi pengelola. |
| `src/data/` | URL video publik dan penanda waktu halaman buku. |
| `public/media/` | Aset yang disajikan langsung ke peramban. |
| `scripts/` | Pembuatan aset dari materi sumber dan unggahan video. |

Aplikasi berjalan melalui server Next.js. Route Handler menerima kiriman pengunjung, sedangkan Server Action menangani masuk, keluar, dan penghapusan data oleh pengelola.

## Jalankan lokal

```powershell
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Buka `http://localhost:3000`. Ganti `ADMIN_PASSWORD` di `.env.local` sebelum memakai `/kelola`. Salinan repositori tidak menyertakan `data/`, sehingga video lokal memerlukan materi sumber tersebut. Sampul, audio, PDF, dan gambar halaman tetap tersedia dari `public/media/`. Situs ini menggunakan server Next.js; hasil build tidak lagi berupa ekspor statis.

Untuk memeriksa build produksi secara lokal, jalankan `npm run lint`, `npm run build`, lalu `npm run start`.

## Halaman

- `/` — beranda dan cerita pilihan.
- `/galeri` — pencarian koleksi video, peta bahasa dari materi sumber, dan kamus mini berbasis judul buku dwibahasa.
- `/galeri/[slug]` — video utama, audio, halaman PDF yang mengikuti narasi, dan cerita terkait.
- `/panduan` — langkah memakai galeri, pemutar cerita, buku yang mengikuti narasi, dan formulir partisipasi.
- `/cerita-pendengar` — kirim dan baca cerita serta umpan balik pengunjung.
- Halaman Cerita Pendengar juga menampilkan tiga pilihan editorial dari katalog; pilihan itu diberi label terpisah dari kiriman pengunjung.
- `/sukarelawan` — daftar untuk berkontribusi.
- `/tentang` — latar dan tujuan Hapakat.
- `/jejak` — dokumentasi implementasi dan arsip tangkapan layar Hapakat terdahulu.
- `/kelola` — lihat pendaftaran privat serta kelola cerita dan umpan balik pendengar.

## API dan alur data

| Endpoint | Metode | Fungsi |
| --- | --- | --- |
| `/api/cerita-pendengar` | `GET`, `POST` | Membaca dan menambah cerita pendengar. |
| `/api/umpan-balik` | `GET`, `POST` | Membaca dan menambah kesan pengunjung. |
| `/api/sukarelawan` | `POST` | Menyimpan pendaftaran sukarelawan. |
| `/api/video/[slug]` | `GET`, `HEAD` | Mengirim video lokal dengan dukungan byte range; di Vercel dialihkan ke ImageKit. |

Ketiga endpoint kiriman menerima JSON pada `POST` dan mengembalikan JSON. Route Handler memvalidasi panjang isian, pilihan bahasa atau peran, dan slug cerita. `POST` yang berhasil mengembalikan status `201`; data tidak valid mengembalikan `400`. `GET` cerita dan umpan balik mengirim `Cache-Control: no-store`. Cerita dan kesan yang dikirim langsung tampil untuk umum, termasuk nama pengirim; pendaftaran sukarelawan hanya terlihat di `/kelola`.

Pengelola masuk melalui `/kelola/masuk`. Sesi disimpan dalam cookie `httpOnly` yang berlaku delapan jam. Tindakan hapus cerita dan umpan balik memakai Server Action yang memeriksa sesi pengelola; pendaftaran sukarelawan hanya dapat dibaca. Skema data berisi tabel `listener_stories`, `feedback`, dan `volunteers`.

## Data dan akses pengelola

Untuk produksi, isi `DATABASE_URL` dengan URL Postgres. Tabel dibuat otomatis saat akses data pertama. Tanpa `DATABASE_URL`, pengembangan lokal memakai `storage/hapakat.sqlite` yang dibuat otomatis; lokasinya dapat diganti dengan `HAPAKAT_DB_PATH`. Vercel tidak memakai SQLite lokal karena filesystem runtime tidak persisten.

| Variabel | Kegunaan |
| --- | --- |
| `DATABASE_URL` | URL Postgres; wajib di Vercel. |
| `ADMIN_PASSWORD` | Kata sandi akses pengelola, minimal 16 karakter. |
| `HAPAKAT_DB_PATH` | Lokasi alternatif berkas SQLite untuk pengembangan lokal. |
| `NEXT_PUBLIC_SITE_URL` | URL dasar canonical, Open Graph, sitemap, dan robots. |
| `IMAGEKIT_PRIVATE_KEY` | Kunci privat untuk skrip unggah video saja. |
| `IMAGEKIT_UPLOAD_FOLDER` | Folder tujuan video pada ImageKit. |

Simpan rahasia di `.env.local` atau pengaturan environment platform. Jangan beri awalan `NEXT_PUBLIC_` pada `IMAGEKIT_PRIVATE_KEY`.

File `.env.local` dan `storage/` tidak masuk Git. Nilai contoh `ADMIN_PASSWORD` perlu diganti sebelum akses pengelola digunakan.

Materi sumber berada di `data/AUDIOBOOK CERITA DAERAH/`. Sembilan video web berada di ImageKit, dengan URL publik di `src/data/video-urls.json`. Pada Vercel, `next.config.ts` memetakan `/api/video/[slug]` ke ImageKit melalui rewrite eksternal sehingga peramban memakai domain situs sendiri. Saat pengembangan lokal, route tersebut membaca berkas asli dari `data/` dengan dukungan byte range. Folder `data/` tidak ikut Git dan tidak diperlukan di Vercel.

Sampul, audio, dan PDF yang digunakan website berada di `public/media/`. Gambar per halaman di `public/media/pages/` berasal dari PDF asli. Penanda waktu di `src/data/book-cues.json` disusun dari pencocokan halaman PDF dengan bingkai video, sehingga halaman yang sedang dibaca mengikuti video atau audio. Pengunjung dapat memilih halaman sendiri lalu menekan **Ikuti narasi** untuk kembali ke halaman sesuai waktu. PDF lengkap juga dapat dibuka dari halaman cerita.

Jika sumber PDF atau video berubah, jalankan `scripts/prepare_story_media.py` dengan Python yang memiliki Pillow dan NumPy, serta `ffmpeg` dan `pdftoppm` tersedia di PATH, untuk membuat ulang gambar dan penanda waktu.

Foto budaya, dokumentasi kegiatan, tangkapan layar lama, peta bahasa, dan poster arsip yang dipilih dari `data/` disimpan sebagai WebP ringan di `public/media/heritage/`. Jalankan `scripts/prepare_heritage_media.py` dengan Python dan Pillow untuk membuat ulang aset tersebut dari sumbernya. Video demo `data/Video Hapakat.mp4` digunakan sebagai referensi tampilan lama. Poster Gelombang 2 adalah arsip bertanggal 2025, bukan pengumuman pendaftaran saat ini.

Gambar pratinjau tautan 1200 × 630 berada di `public/media/social/`, termasuk satu gambar untuk tiap cerita. Jalankan `scripts/prepare_social_images.py` dengan Python dan Pillow untuk membuat ulang gambarnya. Metadata Open Graph, Twitter Card, canonical, sitemap, dan robots memakai `NEXT_PUBLIC_SITE_URL`; nilai bawaan adalah `https://hapakat.vercel.app`. Ganti variabel tersebut bila memakai domain lain.

## Verifikasi sebelum Vercel

- Pilih Node.js 24.x (juga ditentukan pada `package.json`).
- Atur `DATABASE_URL` dan `ADMIN_PASSWORD` pada environment Vercel. `IMAGEKIT_PRIVATE_KEY` hanya diperlukan untuk skrip unggah lokal; jangan jadikan variabel publik.
- Pastikan sembilan URL di `src/data/video-urls.json` aktif. Pada Vercel, aktifkan system environment variables agar `VERCEL=1` tersedia saat build dan rewrite video dibuat. Sampul, audio, PDF, gambar halaman, dan foto dokumentasi sudah ada di `public/media/` serta ikut Git.
- Jalankan `npm run lint` dan `npm run build`. Tidak ada langkah penulisan file lokal saat request produksi.

Untuk membuat ulang video web dan mengunggahnya, jalankan `python scripts/prepare_videos.py` dengan `ffmpeg` tersedia di PATH, kemudian `node --env-file=.env.local scripts/upload_imagekit_videos.mjs`. Skrip menyimpan URL hasil unggahan ke `src/data/video-urls.json`; berkas video sementara berada di `tmp/` dan tidak ikut Git. Unggahan memakai folder dari `IMAGEKIT_UPLOAD_FOLDER`. Skrip melewati slug yang sudah memiliki URL dalam berkas JSON tersebut; jika video perlu diganti, hapus entri slug terkait sebelum mengunggah ulang.
