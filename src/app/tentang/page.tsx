import { ArrowIcon } from "@/components/arrow-icon";
import { CulturalMotif } from "@/components/cultural-motif";
import { LivingBackdrop } from "@/components/living-backdrop";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tentang", "Tentang Hapakat", "Kenali tujuan Hapakat dalam melestarikan bahasa daerah Kalimantan Tengah melalui buku audio.");
const missions = [
  { number: "01", title: "Mendokumentasikan suara", text: "Cerita daerah direkam sebagai buku audio untuk menjaga bahasa dan pelafalannya." },
  { number: "02", title: "Membuka ruang belajar", text: "Cerita dwibahasa menjadi bahan belajar yang dekat dengan keseharian pembaca dan pendengar." },
  { number: "03", title: "Merawat bersama", text: "Generasi muda, penutur, komunitas, dan sukarelawan ikut memperkaya koleksi cerita." },
];

export default function AboutPage() {
  return <main><section className="page-hero about-page-hero"><LivingBackdrop variant="about" /><div className="wrap"><div className="section-kicker">TENTANG / HAPAKAT</div><h1>Tradisi lisan,<br /><em>ruang digital.</em></h1><p>Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah menghadirkan cerita rakyat sebagai buku audio yang mudah dijangkau generasi muda dan masyarakat luas.</p></div></section><section className="section-pad about-story living-section"><LivingBackdrop tone="light" variant="about" /><div className="wrap about-story-grid"><div><div className="section-kicker">KENAPA HAPAKAT ADA</div><h2>Menjaga bahasa<br />dengan <em>mendengarnya.</em></h2></div><div><p>Bahasa daerah hidup di percakapan dan cerita yang diwariskan dari satu generasi ke generasi berikutnya. Hapakat membawa tradisi lisan itu ke ruang digital melalui buku audio cerita rakyat Kalimantan Tengah.</p><p>Hapakat dikembangkan sebagai krida Duta Bahasa Provinsi Kalimantan Tengah tahun 2025. Koleksi awalnya menghadirkan cerita dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay, disertai buku cerita dwibahasa.</p><Link className="text-link dark" href="/jejak">Lihat jejak kegiatan <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div></div></section><section className="section-pad mission-section section-with-motif"><CulturalMotif side="left" /><div className="wrap"><div className="section-kicker">TUJUAN HAPAKAT</div><h2>Suara yang tersimpan,<br /><em>bahasa yang terus dipakai.</em></h2><div className="mission-grid">{missions.map((item) => <article className="mission-card" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section><section className="about-bottom living-section"><LivingBackdrop tone="light" variant="about" /><div className="wrap about-bottom-grid"><div><Image className="about-logo-tagline" src="/media/heritage/logo-tagline.webp" alt="Logo Hapakat: Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah" width={360} height={120} /><span>03 BAHASA DAERAH</span><h2>Dayak Ngaju.<br />Maanyan.<br />Bakumpay.</h2></div><div><p>Mulai dari satu cerita yang menarik perhatianmu. Dengarkan, baca, lalu bicarakan kembali dengan orang di sekitarmu.</p><Link className="button button-primary" href="/galeri">Mulai mendengar <span aria-hidden="true"><ArrowIcon /></span></Link></div></div></section></main>;
}
