import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoryCard } from "@/components/story-card";
import { HomeAudioSurprise } from "@/components/home-audio-surprise";
import { coverFor, stories } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("/", "Cerita rakyat Kalimantan Tengah", "Tonton dan dengarkan buku audio cerita rakyat dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay."),
  title: { absolute: "Hapakat — Cerita rakyat dalam suara bahasa daerah" },
};

export default function Home() {
  const featured = stories[0];
  return <main>
    <section className="hero home-hero"><div className="hero-glow" aria-hidden="true" /><div className="wrap hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> SUARA KALIMANTAN TENGAH</div><h1>Setiap cerita punya <em>suara.</em><br />Setiap suara menjaga <em>bahasa.</em></h1><p>Tonton dan dengarkan cerita rakyat dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay. Baca halaman buku yang mengikuti narasinya.</p><div className="hero-actions"><Link className="button button-primary" href={`/galeri/${featured.slug}`}>Tonton cerita pilihan <span aria-hidden="true"><ArrowIcon /></span></Link><Link className="text-link" href="/galeri">Lihat semua cerita <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div><HomeAudioSurprise /><div className="hero-stats" aria-label="Koleksi Hapakat"><div><strong>09</strong><span>video cerita</span></div><div><strong>03</strong><span>bahasa daerah</span></div><div><strong>02</strong><span>gelombang cerita</span></div></div></div><Link href={`/galeri/${featured.slug}`} className="hero-art hero-feature" aria-label={`Buka ${featured.title}`}><Image className="hero-cultural-photo" src="/media/heritage/hero-performance.webp" alt="Pertunjukan seni budaya Kalimantan Tengah" fill priority sizes="(max-width: 800px) 100vw, 45vw" /><div className="hero-card hero-card-front"><Image src={coverFor(featured)} alt={`Sampul ${featured.title}`} width={440} height={310} priority /></div><span className="hero-sticker">TONTON<br />CERITA<br /><b><ArrowIcon /></b></span><div className="hero-caption">CERITA PILIHAN · {featured.language.toUpperCase()}</div></Link></div></section>
    <section className="home-intro"><div className="wrap intro-grid"><span className="section-kicker">MULAI DARI SINI</span><p>Satu tempat untuk mendengar, membaca, dan membagikan cerita yang tumbuh bersama bahasa daerah Kalimantan Tengah.</p><Link href="/tentang" className="text-link dark">Kenali Hapakat <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div></section>
    <section className="catalog-section section-pad"><div className="wrap"><div className="section-heading"><div><div className="section-kicker">01 / GALERI CERITA</div><h2>Kisah yang menunggu<br /><em>untuk didengar.</em></h2></div><Link className="text-link dark" href="/galeri">Jelajahi seluruh galeri <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div><div className="story-grid">{stories.slice(0, 3).map((story, index) => <StoryCard key={story.slug} story={story} index={index} />)}</div></div></section>
    <section className="home-paths"><div className="wrap paths-grid"><Link href="/cerita-pendengar" className="path-card path-orange"><span>02 / CERITA PENDENGAR</span><h2>Punya cerita<br />untuk dibagikan?</h2><p>Tuliskan kisah yang dekat dengan rumah dan bahasamu.</p><b aria-hidden="true"><ArrowIcon /></b></Link><Link href="/sukarelawan" className="path-card path-dark"><span>03 / SUKARELAWAN</span><h2>Jadi bagian dari<br />suara Hapakat.</h2><p>Berkolaborasi sebagai penutur, penulis, ilustrator, atau penyunting.</p><b aria-hidden="true"><ArrowIcon /></b></Link></div></section>
    <section className="home-documentation"><div className="wrap home-documentation-grid"><div className="home-documentation-image"><Image src="/media/heritage/kotawaringin-class.webp" alt="Kegiatan pengenalan cerita Hapakat di kelas, Kotawaringin Barat" width={900} height={680} sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="home-documentation-copy"><div className="section-kicker">04 / JEJAK HAPAKAT</div><h2>Cerita bertemu<br /><em>pendengarnya.</em></h2><p>Lihat dokumentasi pengenalan Hapakat di sekolah dan komunitas, serta tampilan laman pada masa awalnya.</p><Link className="button button-primary" href="/jejak">Lihat jejak kegiatan <span aria-hidden="true"><ArrowIcon /></span></Link></div></div></section>
  </main>;
}
