import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { StoryCard } from "@/components/story-card";
import { HomeAudioSurprise } from "@/components/home-audio-surprise";
import { ScrambleText } from "@/components/scramble-text";
import { coverFor, stories } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("/", "Cerita rakyat Kalimantan Tengah", "Tonton dan dengarkan buku audio cerita rakyat dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay."),
  title: { absolute: "Hapakat — Cerita rakyat dalam suara bahasa daerah" },
};

export default function Home() {
  const featured = stories[0];
  return <main>
    <section className="hero home-hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-atmosphere" aria-hidden="true">
        <span className="hero-atmosphere-ring hero-atmosphere-ring-one" />
        <span className="hero-atmosphere-ring hero-atmosphere-ring-two" />
        <span className="hero-atmosphere-dots" />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /><ScrambleText text="SUARA KALIMANTAN TENGAH" /></div>
          <h1>
            <span className="hero-title-line"><span className="hero-title-word"><ScrambleText text="Setiap" onEnter={false} /></span>{" "}<span className="hero-title-word"><ScrambleText text="cerita" onEnter={false} /></span>{" "}<span className="hero-title-word"><ScrambleText text="punya" onEnter={false} /></span>{" "}<span className="hero-title-word"><em>suara.</em></span></span>{" "}
            <span className="hero-title-line"><span className="hero-title-word"><ScrambleText text="Setiap" onEnter={false} /></span>{" "}<span className="hero-title-word"><ScrambleText text="suara" onEnter={false} /></span>{" "}<span className="hero-title-word"><ScrambleText text="menjaga" onEnter={false} /></span>{" "}<span className="hero-title-word"><em>bahasa.</em></span></span>
          </h1>
          <p><ScrambleText block delay={450} text="Tonton dan dengarkan cerita rakyat dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay. Baca halaman buku yang mengikuti narasinya." /></p>
          <div className="hero-actions"><Link className="button button-primary" href={`/galeri/${featured.slug}`}><ScrambleText delay={700} text="Tonton cerita pilihan" /><span aria-hidden="true"><ArrowIcon /></span></Link><Link className="text-link" href="/galeri"><ScrambleText delay={800} text="Lihat semua cerita" /><span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div>
          <HomeAudioSurprise />
          <div className="hero-stats" aria-label="Koleksi Hapakat"><div><strong><ScrambleText text="09" /></strong><span><ScrambleText text="video cerita" /></span></div><div><strong><ScrambleText text="03" /></strong><span><ScrambleText text="bahasa daerah" /></span></div><div><strong><ScrambleText text="02" /></strong><span><ScrambleText text="gelombang cerita" /></span></div></div>
        </div>
        <Link href={`/galeri/${featured.slug}`} className="hero-art hero-feature" aria-label={`Buka ${featured.title}`}>
          <Image className="hero-cultural-photo" src="/media/heritage/hero-performance.webp" alt="Pertunjukan seni budaya Kalimantan Tengah" fill priority sizes="(max-width: 800px) 100vw, 45vw" />
          <span className="hero-art-ring hero-art-ring-one" aria-hidden="true" />
          <span className="hero-art-ring hero-art-ring-two" aria-hidden="true" />
          <span className="hero-cover-halo" aria-hidden="true" />
          <div className="hero-card hero-card-front"><Image src={coverFor(featured)} alt={`Sampul ${featured.title}`} width={440} height={310} sizes="(max-width: 800px) 50vw, 25vw" priority /></div>
          <span className="hero-sound-panel" aria-hidden="true">
            <span className="hero-sound-label">SUARA DARI KALIMANTAN TENGAH</span>
            <span className="hero-sound-languages"><span>DAYAK NGAJU</span><span>MAANYAN</span><span>BAKUMPAY</span></span>
            <span className="hero-wave-bars">{Array.from({ length: 17 }, (_, index) => <i key={index} />)}</span>
          </span>
          <span className="hero-sticker">TONTON<br />CERITA<br /><b><ArrowIcon /></b></span>
          <div className="hero-caption"><ScrambleText text={`CERITA PILIHAN · ${featured.language.toUpperCase()}`} /></div>
        </Link>
      </div>
    </section>
    <section className="home-intro"><div className="wrap intro-grid" data-reveal><span className="section-kicker">MULAI DARI SINI</span><p>Satu tempat untuk mendengar, membaca, dan membagikan cerita yang tumbuh bersama bahasa daerah Kalimantan Tengah.</p><Link href="/panduan" className="text-link dark">Lihat panduan <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div></section>
    <section className="catalog-section section-pad"><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">01 / GALERI CERITA</div><h2>Kisah yang menunggu<br /><em>untuk didengar.</em></h2></div><Link className="text-link dark" href="/galeri">Jelajahi seluruh galeri <span aria-hidden="true"><ArrowIcon direction="right" /></span></Link></div><div className="story-grid">{stories.slice(0, 3).map((story) => <StoryCard key={story.slug} story={story} />)}</div></div></section>
    <section className="home-paths"><div className="wrap paths-grid"><Link href="/cerita-pendengar" className="path-card path-orange" data-reveal><span>02 / CERITA PENDENGAR</span><h2>Punya cerita<br />untuk dibagikan?</h2><p>Tuliskan kisah yang dekat dengan rumah dan bahasamu.</p><b aria-hidden="true"><ArrowIcon /></b></Link><Link href="/sukarelawan" className="path-card path-dark" data-reveal><span>03 / SUKARELAWAN</span><h2>Jadi bagian dari<br />suara Hapakat.</h2><p>Berkolaborasi sebagai penutur, penulis, ilustrator, atau penyunting.</p><b aria-hidden="true"><ArrowIcon /></b></Link></div></section>
    <section className="home-documentation"><div className="wrap home-documentation-grid" data-reveal><div className="home-documentation-image"><Image src="/media/heritage/kotawaringin-class.webp" alt="Kegiatan pengenalan cerita Hapakat di kelas, Kotawaringin Barat" width={900} height={680} sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="home-documentation-copy"><div className="section-kicker">04 / JEJAK HAPAKAT</div><h2>Cerita bertemu<br /><em>pendengarnya.</em></h2><p>Lihat dokumentasi pengenalan Hapakat di sekolah dan komunitas, serta tampilan laman pada masa awalnya.</p><Link className="button button-primary" href="/jejak">Lihat jejak kegiatan <span aria-hidden="true"><ArrowIcon /></span></Link></div></div></section>
  </main>;
}
