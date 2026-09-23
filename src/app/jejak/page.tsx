import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeritageGallery } from "@/components/heritage-gallery";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/jejak", "Jejak Hapakat", "Dokumentasi pengenalan Hapakat dan arsip tampilan lamannya.");

const snapshots = [
  { image: "hapakat-lama-utama", title: "Halaman utama", note: "Foto budaya sebagai pintu masuk cerita." },
  { image: "hapakat-lama-galeri", title: "Galeri cerita", note: "Cerita daerah dikelompokkan menurut bahasa." },
  { image: "hapakat-lama-sukarelawan", title: "Sukarelawan", note: "Ajakan untuk ikut merawat bahasa daerah." },
  { image: "hapakat-lama-tentang", title: "Tentang Hapakat", note: "Identitas dan tujuan laman pada masa awal." },
];

export default function HeritagePage() {
  return <main>
    <section className="page-hero heritage-page-hero"><div className="wrap"><div className="section-kicker">DOKUMENTASI / HAPAKAT</div><h1>Jejak cerita.<br /><em>Jejak pertemuan.</em></h1><p>Bahasa daerah hidup saat kisahnya didengar bersama. Lihat momen pengenalan Hapakat dan bagaimana laman ini tampil pada masa awalnya.</p></div></section>
    <section className="heritage-story section-pad"><div className="wrap heritage-story-grid"><div><span className="section-kicker">DARI LAMAN KE RUANG KELAS</span><h2>Cerita bergerak<br />melampaui layar.</h2></div><div><p>Hapakat dikembangkan dalam kegiatan Krida Kebahasaan dan Kesastraan Duta Bahasa Provinsi Kalimantan Tengah. Materi cerita dan buku audio diperkenalkan kepada pelajar serta masyarakat melalui kegiatan langsung.</p><p>Foto di bawah berasal dari dokumentasi implementasi yang disimpan bersama materi Hapakat. Nama lokasi mengikuti keterangan folder dokumentasi asli.</p><Link className="text-link dark" href="/tentang">Kenali tujuan Hapakat <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div></div></section>
    <section className="heritage-photo-section section-pad"><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">01 / DOKUMENTASI KEGIATAN</div><h2>Ketika cerita<br /><em>didengar bersama.</em></h2></div><p>Potret dari sekolah dan kegiatan pengenalan Hapakat. Pilih foto untuk melihat lebih dekat.</p></div><HeritageGallery /></div></section>
    <section className="heritage-archive section-pad"><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">02 / ARSIP DIGITAL</div><h2>Wajah Hapakat<br /><em>di masa awal.</em></h2></div><p>Tangkapan layar dari dokumentasi laman terdahulu. Warna jingga, foto budaya, dan menu utamanya menjadi rujukan visual pengembangan laman saat ini. <Link className="text-link dark" href="/old">Jelajahi versi lama <ArrowIcon direction="right" /></Link></p></div><div className="heritage-archive-grid">{snapshots.map((item, index) => <article className="heritage-snapshot" data-reveal key={item.image}><div className="heritage-snapshot-image"><Image src={`/media/heritage/${item.image}.webp`} alt={`Tangkapan layar lama Hapakat: ${item.title}`} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="heritage-snapshot-caption"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.note}</p></div><a href={`/media/heritage/${item.image}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Buka tangkapan layar ${item.title}`}><ArrowIcon /></a></div></article>)}</div></div></section>
    <section className="heritage-poster-section section-pad"><div className="wrap heritage-poster-grid"><div className="heritage-poster-copy"><div className="section-kicker">03 / ELEMEN ASLI</div><h2>Ajakan yang pernah<br /><em>menggerakkan cerita.</em></h2><p>Poster perekrutan sukarelawan Gelombang 2 adalah bagian dari arsip visual Hapakat tahun 2025. Motif Dayak dan identitas jingga pada poster ini turut menjadi rujukan tampilan website.</p><p className="heritage-poster-note">Periode pendaftaran yang tercantum pada poster sudah berlalu. Formulir sukarelawan saat ini tersedia di halaman tersendiri.</p><Link className="button button-primary" href="/sukarelawan">Lihat halaman sukarelawan <span aria-hidden="true"><ArrowIcon /></span></Link></div><div className="heritage-poster-image"><Image src="/media/heritage/volunteer-poster-2025.webp" alt="Arsip poster Rekrutmen Relawan Hapakat Gelombang 2 tahun 2025" width={955} height={1350} sizes="(max-width: 800px) 100vw, 45vw" /></div></div></section>
    <section className="heritage-end"><div className="wrap"><div><span className="section-kicker">CERITA BERLANJUT</span><h2>Temukan kisahnya sekarang.</h2><p>Tonton video, dengarkan narasi, dan baca halaman buku yang mengikuti cerita.</p></div><Link className="button button-primary" href="/galeri">Masuk galeri cerita <span aria-hidden="true"><ArrowIcon /></span></Link></div></section>
  </main>;
}
