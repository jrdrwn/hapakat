# Hapakat

Website buku audio cerita rakyat Kalimantan Tengah, dibuat dengan Next.js. Data pengunjung memakai Postgres saat `DATABASE_URL` tersedia; SQLite digunakan hanya untuk pengembangan lokal tanpa URL tersebut.

Memerlukan Node.js 24 atau lebih baru.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Situs ini menggunakan server Next.js; hasil build tidak lagi berupa ekspor statis.

## Halaman

- `/` — beranda dan cerita pilihan.
- `/galeri` — pencarian koleksi video, peta bahasa dari materi sumber, dan kamus mini berbasis judul buku dwibahasa.
- `/galeri/[slug]` — video utama, audio, halaman PDF yang mengikuti narasi, dan cerita terkait.
- `/cerita-pendengar` — kirim dan baca cerita serta umpan balik pengunjung.
- Halaman Cerita Pendengar juga menampilkan tiga pilihan editorial dari katalog; pilihan itu diberi label terpisah dari kiriman pengunjung.
- `/sukarelawan` — daftar untuk berkontribusi.
- `/tentang` — latar dan tujuan Hapakat.
- `/jejak` — dokumentasi implementasi dan arsip tangkapan layar Hapakat terdahulu.
- `/kelola` — lihat pendaftaran privat serta kelola cerita dan umpan balik pendengar.

## Data dan akses pengelola

Untuk produksi, isi `DATABASE_URL` dengan URL Postgres. Tabel dibuat otomatis saat akses data pertama. Tanpa `DATABASE_URL`, pengembangan lokal memakai `storage/hapakat.sqlite` yang dibuat otomatis; lokasinya dapat diganti dengan `HAPAKAT_DB_PATH`. Vercel tidak memakai SQLite lokal karena filesystem runtime tidak persisten.

Untuk masuk ke `/kelola`, isi `ADMIN_PASSWORD` di `.env.local` dengan kata sandi minimal 16 karakter. Salin `.env.example` bila menyiapkan proyek baru. File `.env.local` dan `storage/` tidak masuk Git. Pendaftaran sukarelawan hanya dapat dibaca pengelola; cerita pendengar tampil untuk umum setelah dikirim.

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

Untuk membuat ulang video web dan mengunggahnya, jalankan `python scripts/prepare_videos.py`, kemudian `node --env-file=.env.local scripts/upload_imagekit_videos.mjs`. Skrip menyimpan URL hasil unggahan ke `src/data/video-urls.json`; berkas video sementara berada di `tmp/` dan tidak ikut Git. Unggahan memakai folder dari `IMAGEKIT_UPLOAD_FOLDER`.
