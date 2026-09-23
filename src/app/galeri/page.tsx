import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Image from "next/image";
import { GalleryExplorer } from "@/components/gallery-explorer";
import { LanguageExplorer } from "@/components/language-explorer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/galeri", "Galeri Cerita", "Jelajahi sembilan video cerita rakyat Kalimantan Tengah, lengkap dengan audio dan buku PDF.");

export default function GalleryPage() {
  return (
    <main>
      <section className="page-hero gallery-page-hero">
        <div className="wrap">
          <div className="section-kicker">GALERI CERITA / HAPAKAT</div>
          <h1>Temukan kisah.<br /><em>Lihat dan dengarkan.</em></h1>
          <p>Sembilan video cerita dwibahasa dari Kalimantan Tengah. Setiap kisah dilengkapi audio dan halaman PDF yang mengikuti narasi.</p>
          <a className="button button-primary" href="#koleksi">Jelajahi video cerita <span aria-hidden="true"><ArrowIcon /></span></a>
          <div className="page-hero-deco" aria-hidden="true">◌</div>
        </div>
      </section>

      <section className="catalog-section section-pad gallery-main" id="koleksi">
        <div className="wrap"><GalleryExplorer /></div>
      </section>

      <section className="language-section section-pad" id="bahasa-di-balik-cerita">
        <div className="wrap">
          <div className="section-heading" data-reveal>
            <div>
              <div className="section-kicker">BAHASA DI BALIK CERITA</div>
              <h2>Kenali kata.<br /><em>Kenali tempatnya.</em></h2>
            </div>
            <p>Mulai dari judul cerita dwibahasa, lalu lihat keberagaman bahasa di peta Kalimantan Tengah dari materi referensi Hapakat.</p>
          </div>
          <div className="language-layout">
            <div className="language-map-card">
              <div className="language-map-image">
                <Image src="/media/heritage/language-map.webp" alt="Peta bahasa di Provinsi Kalimantan Tengah dari arsip materi Hapakat" fill sizes="(max-width: 850px) 100vw, 45vw" />
              </div>
              <div className="language-map-caption">
                <span>ARSIP PETA BAHASA</span>
                <p>Peta dari materi Hapakat. Legenda menampilkan Dayak Ngaju, Maanyan, Bakumpai, dan bahasa daerah lainnya.</p>
                <a href="/media/heritage/language-map.webp" target="_blank" rel="noopener noreferrer">Buka peta ukuran besar <ArrowIcon /></a>
              </div>
            </div>
            <LanguageExplorer />
          </div>
        </div>
      </section>
    </main>
  );
}
