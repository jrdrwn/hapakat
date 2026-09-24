import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/feedback-form";
import { FeedbackList, type PublishedFeedback } from "@/components/feedback-list";
import { ListenerForm } from "@/components/listener-form";
import { ListenerStoryRows } from "@/components/listener-story-rows";
import { CulturalMotif } from "@/components/cultural-motif";
import approvedFeedback from "@/data/approved-feedback.json";
import { listFeedback, listListenerStories } from "@/lib/db";
import { storyBySlug } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata("/cerita-pendengar", "Cerita Pendengar", "Jelajahi pilihan cerita daerah dan bagikan kisah atau kesanmu di Hapakat.");

const startingPoints = [
  { slug: "tulak-nyasap", note: "Kenali ungkapan Maanyan untuk pergi berkebun lewat video, narasi audio, dan buku yang dapat dibaca langsung." },
  { slug: "lomba-balanjaan", note: "Mulai dari padanan Bakumpay untuk lomba mendayung, lalu ikuti cerita dalam tiga format yang tersedia." },
  { slug: "dombi-je-bahalap-atei", note: "Dengarkan judul Dayak Ngaju yang berarti Dombi yang Baik Hati dan temukan kata-kata daerah di dalam ceritanya." },
].map(({ slug, note }) => ({ story: storyBySlug(slug)!, note }));

export default async function ListenerPage() {
  const [entries, feedback] = await Promise.all([listListenerStories(), listFeedback()]);
  // Spreadsheet responses in this snapshot have explicit "Ya" publication consent.
  const sheetFeedback: PublishedFeedback[] = approvedFeedback.map((entry) => ({ ...entry, context: "Pendengar Hapakat" }));
  const liveFeedback: PublishedFeedback[] = feedback.map((entry) => ({ id: entry.id, name: entry.name, message: entry.message, context: entry.story_slug ? `Tentang ${storyBySlug(entry.story_slug)?.title || "cerita Hapakat"}` : "Pendengar Hapakat", photo: null }));
  const publishedFeedback = [...sheetFeedback.slice(0, 6), ...liveFeedback, ...sheetFeedback.slice(6)];
  return <main>
    <section className="page-hero listener-page-hero"><div className="wrap"><div className="section-kicker">CERITA PENDENGAR / HAPAKAT</div><h1>Cerita hidup saat<br /><em>kita membagikannya.</em></h1><p>Punya kisah dari rumah, keluarga, atau daerahmu? Tulis dan biarkan orang lain ikut mengenal bahasa serta ingatan di dalamnya.</p><a className="button button-primary" href="#bagikan">Bagikan ceritamu <span aria-hidden="true"><ArrowIcon /></span></a></div></section>
    <section className="section-pad listener-curated-section section-with-motif"><CulturalMotif side="right" pattern="woven" /><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">PILIHAN DARI KOLEKSI</div><h2>Mulai mendengar <em>dari sini.</em></h2></div><p>Tiga cerita pembuka dari katalog Hapakat. Pilihan ini disusun oleh tim situs dan bukan kiriman pendengar.</p></div><div className="listener-curated-grid">{startingPoints.map(({ story, note }) => <article className="listener-curated-card" data-reveal key={story.slug}><div className="listener-story-top"><span>{story.language}</span><span>{story.wave}</span></div><h3>{story.title}</h3><p className="listener-curated-subtitle">{story.subtitle}</p><p>{note}</p><Link href={`/galeri/${story.slug}`}>Buka cerita <ArrowIcon /></Link></article>)}</div></div></section>
    <section className="section-pad listener-list-section"><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">SUARA DARI PENDENGAR</div><h2>Cerita dari <em>kita semua.</em></h2></div><p>Kisah yang dibagikan pengunjung Hapakat. Satu cerita kecil dapat membuka percakapan tentang bahasa dan tempat asal kita.</p></div></div><ListenerStoryRows entries={entries} /></section>
    <section className="form-section section-pad" id="bagikan"><div className="wrap form-layout"><div className="form-intro"><div className="section-kicker">TAMBAHKAN SUARAMU</div><h2>Bagikan kisah yang<br /><em>ingin kamu jaga.</em></h2><p>Kamu bisa menulis cerita rakyat yang kamu dengar, kenangan tentang bahasa ibu, atau pengalaman bersama budaya daerah.</p><div className="form-side-note"><span>✦</span><p>Gunakan nama panggilan jika ingin menjaga privasi. Cerita yang dikirim langsung tampil di halaman ini.</p></div></div><ListenerForm /></div></section>
    <section className="feedback-section section-pad"><div className="wrap"><div className="section-heading" data-reveal><div><div className="section-kicker">APA KATA MEREKA</div><h2>Kesan setelah<br /><em>mendengar cerita.</em></h2></div><p>Bagikan pengalamanmu menjelajahi Hapakat atau menonton salah satu cerita daerah.</p></div></div><FeedbackList entries={publishedFeedback} /><div className="wrap"><div className="feedback-form-side"><div><div className="section-kicker">UMPAN BALIK HAPAKAT</div><h3>Suaramu membantu cerita terus berkembang.</h3></div><FeedbackForm /></div></div></section>
  </main>;
}
