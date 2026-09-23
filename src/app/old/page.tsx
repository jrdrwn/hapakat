import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { stories, videoFor, coverFor } from "@/lib/stories";
import styles from "./old.module.css";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/old", "Hapakat versi lama", "Tampilan Hapakat terdahulu, dihidupkan kembali dari dokumentasi aslinya.");

const groups = [
  {
    id: "dayak-ngaju",
    title: "Bahasa Dayak Ngaju",
    language: "Dayak Ngaju",
    description: "Bahasa Dayak Ngaju merupakan bahasa yang dituturkan oleh sebagian besar penduduk Kalimantan Tengah. Penutur bahasa tersebut dapat dijumpai hampir di sepanjang daerah aliran sungai di Kalimantan Tengah.",
  },
  {
    id: "maanyan",
    title: "Bahasa Maanyan",
    language: "Maanyan",
    description: "Bahasa Maanyan dituturkan oleh masyarakat di Kabupaten Kapuas, Barito Timur, Barito Selatan, dan Barito Utara, Provinsi Kalimantan Tengah.",
  },
  {
    id: "bakumpai",
    title: "Bahasa Bakumpai",
    language: "Bakumpay",
    description: "Bahasa Bakumpai dituturkan oleh masyarakat di Kabupaten Barito Selatan, Barito Utara, dan di Kabupaten Kapuas, Provinsi Kalimantan Tengah.",
  },
] as const;

const testimonials = [
  { quote: "Luar biasa! HAPAKAT bukan hanya menghadirkan cerita, tapi juga menghidupkan kembali jati diri dan kebanggaan akan bahasa daerah kita. Terima kasih telah menjadi jembatan pelestarian budaya yang inspiratif!", name: "I Made Juniar Ardika", role: "Duta Bahasa Kalimantan Tengah" },
  { quote: "Hapakat.id merupakan inisiatif yang inspiratif dalam upaya pelestarian budaya lokal, khususnya dalam menghidupkan kembali bahasa daerah melalui narasi dan konten yang relevan bagi generasi muda. Ditunggu cerita lainnya!", name: "Avillia Yufensi Ngagalan", role: "Duta Bahasa Kalimantan Tengah" },
  { quote: "Lamannya bagus dan banyak cerita, lebih banyak cerita lagi ya", name: "Siti Aziza Kurnia", role: "Graha Beton" },
  { quote: "Pertahankan dan perbanyak cerita kearifan lokal.", name: "Yusef F Hadiwinata", role: "RMU" },
];

const nav = [
  { href: "#utama", label: "Utama" },
  { href: "#galeri", label: "Galeri Cerita" },
  { href: "#cerita-pendengar", label: "Cerita Pendengar" },
  { href: "#sukarelawan", label: "Sukarelawan" },
  { href: "#tentang", label: "Tentang" },
];

export default function OldPage() {
  return <main className={styles.old}>
    <header className={styles.header}>
      <a href="#utama" className={styles.brand} aria-label="Hapakat versi lama, kembali ke utama"><Image src="/media/logo-hapakat.png" width={220} height={63} alt="Hapakat" priority /></a>
      <nav aria-label="Navigasi Hapakat versi lama">{nav.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
    </header>

    <section id="utama" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah</h1>
        <p>Selamat datang di Hapakat, laman hasil kesepakatan bersama untuk melestarikan bahasa daerah Kalimantan Tengah melalui cerita rakyat berformat audio dari penutur asli.</p>
        <div className={styles.heroActions}><a href="#sukarelawan">Menjadi Sukarelawan</a><a href="#cerita-pendengar">Ceritakan Pengalamanmu</a></div>
      </div>
      <span className={styles.photoCredit}>Sumber: Resa</span>
    </section>

    <section id="galeri" className={styles.galleryIntro}>
      <h2>Galeri Cerita</h2>
      <p>Jelajahi cerita rakyat Kalimantan Tengah dalam bahasa daerah, disuarakan oleh penutur asli.</p>
      <div className={styles.languageLinks}>{groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}</div>
    </section>

    {groups.map(group => <section className={styles.languageSection} id={group.id} key={group.id}>
      <h2>{group.title}</h2><p className={styles.languageDescription}>{group.description}</p>
      <div className={styles.storyList}>{stories.filter(story => story.language === group.language).map(story => <article className={styles.story} key={story.slug}>
        <div className={styles.videoWrap}><video controls preload="none" playsInline poster={coverFor(story)} aria-label={`Video cerita ${story.title}`}><source src={videoFor(story)} type="video/mp4" />Browser Anda tidak mendukung pemutar video.</video></div>
        <div className={styles.storyCopy}><h3>{story.title}</h3><p>{story.subtitle} — cerita rakyat berbahasa {group.title.replace("Bahasa ", "")} dari Kalimantan Tengah.</p><dl><div><dt>Penulis</dt><dd>: {story.author}</dd></div><div><dt>Bahasa</dt><dd>: {group.title.replace("Bahasa ", "")}</dd></div><div><dt>Koleksi</dt><dd>: {story.wave}</dd></div></dl><Link href={`/galeri/${story.slug}`}>Baca dan dengarkan cerita <ArrowIcon direction="right" /></Link></div>
      </article>)}</div>
    </section>)}

    <section id="cerita-pendengar" className={styles.listener}>
      <div className={styles.listenerLead}><h2>Cerita Pendengar</h2><p>Bagikan pengalaman Anda setelah mendengarkan cerita di Hapakat—setiap kesan dan cerita dari pendengar menjadi bagian penting dalam menghidupkan kembali bahasa dan budaya kita.</p><Link href="/cerita-pendengar">Bantu tingkatkan kualitas Hapakat</Link></div>
      <div className={styles.testimonials}><h3>Apa kata mereka?</h3><div className={styles.quoteGrid}>{testimonials.map(item => <blockquote key={item.name}><p>{item.quote}</p><footer><span className={styles.avatar} aria-hidden="true">{item.name[0]}</span><span>{item.name}<small>{item.role}</small></span></footer></blockquote>)}</div></div>
    </section>

    <section id="sukarelawan" className={styles.volunteer}>
      <div className={styles.volunteerPhoto}><h2>Sukarelawan</h2><span>Sumber: Resa</span></div>
      <div className={styles.volunteerCopy}><h3>Jadi Sukarelawan</h3><p>Mari bergabung menjadi relawan Hapakat dan ambil bagian dalam pelestarian bahasa daerah Kalimantan Tengah! Tak hanya sebagai pengisi suara, kamu juga bisa berkontribusi sebagai editor video. Dengan keterampilan dan semangatmu, kita bisa bersama-sama menghidupkan kembali warisan budaya lisan agar terus hidup dan menginspirasi generasi berikutnya.</p></div>
      <div className={styles.volunteerAction}><Link href="/sukarelawan">Informasi lebih lanjut</Link></div>
    </section>

    <section id="tentang" className={styles.about}>
      <Image src="/media/heritage/logo-tagline.webp" alt="Hapakat: Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah" width={1250} height={375} sizes="(max-width: 800px) 100vw, 85vw" />
      <p><strong>Hapakat</strong> berasal dari bahasa Dayak Ngaju yang berarti <em>sepakat</em>—mewakili semangat persatuan untuk menjaga dan melestarikan bahasa daerah Kalimantan Tengah. Laman ini merupakan aksi digital kolaboratif yang dibangun atas kesepakatan bersama antara Duta Bahasa Kalimantan Tengah 2025, alumni Ikatan Dubas Kalimantan Tengah, komunitas bahasa, dan Balai Bahasa Provinsi Kalimantan Tengah. Melalui Hapakat, masyarakat diajak untuk aktif menyuarakan kembali cerita rakyat, memperluas akses terhadap narasi lokal dalam format audio, dan menjadikan teknologi sebagai ruang kebanggaan berbahasa daerah.</p>
    </section>
    <footer className={styles.footer}><Link href="/">Lihat Hapakat sekarang <ArrowIcon /></Link><span>Palangka Raya, Kalimantan Tengah</span></footer>
    <a className={styles.backTop} href="#utama" aria-label="Kembali ke atas">↑</a>
  </main>;
}
