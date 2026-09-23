import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/feedback-form";
import { ListenerForm } from "@/components/listener-form";
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
  return <main>
    <section className="page-hero listener-page-hero"><div className="wrap"><div className="section-kicker">CERITA PENDENGAR / HAPAKAT</div><h1>Cerita hidup saat<br /><em>kita membagikannya.</em></h1><p>Punya kisah dari rumah, keluarga, atau daerahmu? Tulis dan biarkan orang lain ikut mengenal bahasa serta ingatan di dalamnya.</p><a className="button button-primary" href="#bagikan">Bagikan ceritamu <span aria-hidden="true"><ArrowIcon /></span></a></div></section>
    <section className="section-pad listener-curated-section"><div className="wrap"><div className="section-heading"><div><div className="section-kicker">PILIHAN DARI KOLEKSI</div><h2>Mulai mendengar <em>dari sini.</em></h2></div><p>Tiga cerita pembuka dari katalog Hapakat. Pilihan ini disusun oleh tim situs dan bukan kiriman pendengar.</p></div><div className="listener-curated-grid">{startingPoints.map(({ story, note }) => <article className="listener-curated-card" key={story.slug}><div className="listener-story-top"><span>{story.language}</span><span>{story.wave}</span></div><h3>{story.title}</h3><p className="listener-curated-subtitle">{story.subtitle}</p><p>{note}</p><Link href={`/galeri/${story.slug}`}>Buka cerita <ArrowIcon /></Link></article>)}</div></div></section>
    <section className="section-pad listener-list-section"><div className="wrap"><div className="section-heading"><div><div className="section-kicker">SUARA DARI PENDENGAR</div><h2>Cerita dari <em>kita semua.</em></h2></div><p>Kisah yang dibagikan pengunjung Hapakat. Satu cerita kecil dapat membuka percakapan tentang bahasa dan tempat asal kita.</p></div>{entries.length ? <div className="listener-story-grid">{entries.map((entry) => <article className="listener-story-card" key={entry.id}><div className="listener-story-top"><span>{entry.language}</span><time dateTime={`${entry.created_at}Z`}>{new Date(`${entry.created_at}Z`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</time></div><h3>{entry.title}</h3><p>{entry.story}</p><div className="listener-story-author">Diceritakan oleh <strong>{entry.name}</strong></div></article>)}</div> : <div className="listener-empty"><span aria-hidden="true">✳</span><h3>Belum ada cerita pendengar.</h3><p>Jadilah yang pertama membagikan kisah dari daerahmu.</p></div>}</div></section>
    <section className="form-section section-pad" id="bagikan"><div className="wrap form-layout"><div className="form-intro"><div className="section-kicker">TAMBAHKAN SUARAMU</div><h2>Bagikan kisah yang<br /><em>ingin kamu jaga.</em></h2><p>Kamu bisa menulis cerita rakyat yang kamu dengar, kenangan tentang bahasa ibu, atau pengalaman bersama budaya daerah.</p><div className="form-side-note"><span>✦</span><p>Gunakan nama panggilan jika ingin menjaga privasi. Cerita yang dikirim langsung tampil di halaman ini.</p></div></div><ListenerForm /></div></section>
    <section className="feedback-section section-pad"><div className="wrap"><div className="section-heading"><div><div className="section-kicker">APA KATA MEREKA</div><h2>Kesan setelah<br /><em>mendengar cerita.</em></h2></div><p>Bagikan pengalamanmu menjelajahi Hapakat atau menonton salah satu cerita daerah.</p></div><div className="feedback-layout"><div className="feedback-list">{feedback.length ? feedback.map((entry) => <article className="feedback-card" key={entry.id}><span className="feedback-quote" aria-hidden="true">“</span><p>{entry.message}</p><div><strong>{entry.name}</strong><span>{entry.story_slug ? `Tentang ${storyBySlug(entry.story_slug)?.title || "cerita Hapakat"}` : "Pendengar Hapakat"}</span></div></article>) : <div className="feedback-empty"><span aria-hidden="true">✳</span><h3>Belum ada kesan yang dibagikan.</h3><p>Ceritakan pengalaman pertamamu bersama Hapakat.</p></div>}</div><div className="feedback-form-side"><div className="section-kicker">UMPAN BALIK HAPAKAT</div><h3>Suaramu membantu cerita terus berkembang.</h3><FeedbackForm /></div></div></div></section>
  </main>;
}
