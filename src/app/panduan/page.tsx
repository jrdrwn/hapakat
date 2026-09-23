import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { coverFor, stories } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "/panduan",
  "Panduan Menggunakan Hapakat",
  "Pelajari cara memilih cerita, menonton video, mendengarkan audio, membaca buku yang mengikuti narasi, dan berbagi cerita di Hapakat.",
);

const featured = stories[0];

const questions = [
  { question: "Apakah saya perlu membuat akun?", answer: "Tidak. Kamu bisa menjelajahi galeri, menonton, mendengar, dan membaca cerita tanpa membuat akun." },
  { question: "Bisakah saya membaca buku tanpa memutar video?", answer: "Bisa. Gunakan tombol halaman sebelumnya dan berikutnya pada bagian Baca Buku, atau pilih Buka PDF lengkap untuk melihat dokumen dalam tab baru." },
  { question: "Mengapa halaman buku tidak mengikuti narasi saya?", answer: "Jika kamu sempat berpindah halaman secara manual, tekan Ikuti narasi. Halaman akan kembali mengikuti waktu video atau audio yang sedang diputar." },
  { question: "Apakah cerita yang saya kirim langsung terlihat orang lain?", answer: "Ya. Cerita, nama panggilan, dan kesan yang kamu kirim melalui Cerita Pendengar tampil untuk umum. Pendaftaran sukarelawan hanya dapat dilihat pengelola." },
];

export default function GuidePage() {
  return <main>
    <section className="page-hero guide-page-hero">
      <div className="wrap guide-hero-grid">
        <div className="guide-hero-copy">
          <div className="section-kicker">PANDUAN / HAPAKAT</div>
          <h1>Mulai dari satu cerita.<br /><em>Ikuti suaranya.</em></h1>
          <p>Hapakat mengajakmu menonton, mendengar, dan membaca cerita rakyat Kalimantan Tengah. Panduan singkat ini membantumu memilih cerita dan memakai setiap fiturnya.</p>
          <a className="button button-primary" href="#mulai">Mulai panduan <span aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <div className="guide-hero-art" aria-label={`Contoh cerita ${featured.title} tersedia sebagai video, audio, dan buku`}>
          <div className="guide-hero-cover"><Image src={coverFor(featured)} alt={`Sampul ${featured.title}`} width={440} height={310} sizes="(max-width: 800px) 75vw, 30vw" /></div>
          <div className="guide-hero-formats"><span>01 <b>Video</b></span><span>02 <b>Audio</b></span><span>03 <b>Buku</b></span></div>
        </div>
      </div>
    </section>

    <section className="guide-highlights" id="mulai">
      <div className="wrap guide-highlight-grid" data-reveal>
        <a href="#pilih-cerita"><span>01</span><strong>Pilih cerita</strong><small>Temukan bahasa dan tema yang ingin kamu jelajahi.</small><ArrowIcon /></a>
        <a href="#nikmati-cerita"><span>02</span><strong>Tonton, dengar, baca</strong><small>Tiga cara mengikuti satu cerita yang sama.</small><ArrowIcon /></a>
        <a href="#ikut-berbagi"><span>03</span><strong>Ikut berbagi</strong><small>Tulis kisah atau sampaikan kesanmu.</small><ArrowIcon /></a>
      </div>
    </section>

    <section className="section-pad guide-main-section">
      <div className="wrap guide-layout">
        <nav className="guide-toc" aria-label="Isi panduan"><span>DI HALAMAN INI</span><a href="#pilih-cerita">01 / Memilih cerita</a><a href="#nikmati-cerita">02 / Menonton dan mendengar</a><a href="#baca-buku">03 / Mengikuti buku</a><a href="#jelajah-bahasa">04 / Mengenal bahasa</a><a href="#ikut-berbagi">05 / Berbagi cerita</a><a href="#pertanyaan">Pertanyaan umum</a></nav>
        <div className="guide-articles">
          <article className="guide-step" data-reveal id="pilih-cerita"><div className="guide-step-number">01 / TEMUKAN CERITA</div><h2>Pilih cerita yang<br /><em>menarik perhatianmu.</em></h2><p>Buka Galeri Cerita untuk melihat seluruh koleksi. Gunakan pilihan bahasa Dayak Ngaju, Maanyan, atau Bakumpay. Kamu juga dapat mencari judul, penulis, atau tema, lalu mengurutkan judul dari A sampai Z.</p><ol><li>Buka <strong>Galeri Cerita</strong>.</li><li>Pilih bahasa atau ketik kata kunci pada kolom pencarian.</li><li>Tekan sampul atau judul cerita untuk masuk ke halaman cerita.</li></ol><Link className="guide-inline-link" href="/galeri">Jelajahi galeri <ArrowIcon direction="right" /></Link></article>

          <article className="guide-step" data-reveal id="nikmati-cerita"><div className="guide-step-number">02 / PUTAR CERITA</div><h2>Mulai dari video,<br /><em>lanjutkan dengan audio.</em></h2><p>Di halaman cerita, video menjadi sajian utama. Tekan tombol putar untuk menonton narasi dan gambar buku. Jika ingin fokus mendengar, gunakan pemutar <strong>Versi audio</strong> di bawah video. Saat satu pemutar berjalan, pemutar lainnya berhenti otomatis.</p><div className="guide-tip"><span>COBA SEKARANG</span><p>Di beranda, tombol <strong>Putar cerita acak</strong> juga bisa memilihkan satu narasi sebagai kejutan. Suara baru menyala setelah kamu menekannya.</p></div><Link className="guide-inline-link" href={`/galeri/${featured.slug}`}>Coba cerita {featured.title} <ArrowIcon direction="right" /></Link></article>

          <article className="guide-step" data-reveal id="baca-buku"><div className="guide-step-number">03 / BACA BUKU</div><h2>Halaman buku mengikuti<br /><em>suara yang diputar.</em></h2><p>Bagian <strong>Baca Buku</strong> menampilkan halaman cerita langsung di situs. Saat video atau audio diputar, halaman akan berganti mengikuti waktu narasi.</p><ol><li>Gunakan tombol panah untuk melihat halaman lain secara manual.</li><li>Tekan <strong>Ikuti narasi</strong> untuk kembali ke halaman sesuai audio atau video.</li><li>Pilih <strong>Buka PDF lengkap</strong> jika ingin membaca dokumen utuh dalam tab baru.</li></ol></article>

          <article className="guide-step" data-reveal id="jelajah-bahasa"><div className="guide-step-number">04 / KENALI BAHASANYA</div><h2>Temukan kata<br /><em>di balik judul.</em></h2><p>Setelah koleksi cerita di Galeri, ada bagian <strong>Bahasa di Balik Cerita</strong> dan <strong>Kamus Mini Hapakat</strong>. Di sana kamu bisa melihat peta bahasa serta padanan judul cerita daerah dalam bahasa Indonesia. Pilih satu ungkapan untuk membuka ceritanya.</p><Link className="guide-inline-link" href="/galeri#bahasa-di-balik-cerita">Lihat bahasa di balik cerita <ArrowIcon direction="right" /></Link></article>

          <article className="guide-step" data-reveal id="ikut-berbagi"><div className="guide-step-number">05 / IKUT MERAWAT</div><h2>Bagikan cerita,<br /><em>kesan, atau keahlianmu.</em></h2><p>Di Cerita Pendengar, kamu bisa menulis kisah dari daerahmu atau memberi kesan setelah menjelajahi Hapakat. Nama panggilan dan tulisan yang dikirim akan tampil untuk umum. Jika ingin membantu sebagai penutur, penulis, ilustrator, atau penyunting, isi formulir Sukarelawan; kontakmu hanya dilihat pengelola.</p><div className="guide-link-row"><Link className="guide-inline-link" href="/cerita-pendengar#bagikan">Bagikan cerita <ArrowIcon direction="right" /></Link><Link className="guide-inline-link" href="/sukarelawan">Jadi sukarelawan <ArrowIcon direction="right" /></Link></div></article>
        </div>
      </div>
    </section>

    <section className="section-pad guide-faq" id="pertanyaan"><div className="wrap guide-faq-grid" data-reveal><div><div className="section-kicker">MASIH BINGUNG?</div><h2>Pertanyaan<br /><em>yang sering muncul.</em></h2><p>Mulai saja dari cerita yang kamu suka. Berikut jawaban untuk beberapa hal yang mungkin kamu temui.</p></div><div className="guide-faq-list">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="guide-end"><div className="wrap"><div><span className="section-kicker">SIAP MENJELAJAH?</span><h2>Satu cerita bisa membuka<br /><em>banyak percakapan.</em></h2></div><Link className="button button-primary" href="/galeri">Pilih cerita pertama <ArrowIcon /></Link></div></section>
  </main>;
}
