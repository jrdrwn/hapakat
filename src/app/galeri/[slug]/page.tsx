import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryExperience } from "@/components/story-experience";
import { StoryCard } from "@/components/story-card";
import cueData from "@/data/book-cues.json";
import { stories, storyBySlug } from "@/lib/stories";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = storyBySlug((await params).slug);
  return story ? { title: story.title, description: `Tonton ${story.title}, dengarkan audionya, dan baca PDF dalam bahasa ${story.language}.` } : { title: "Cerita tidak ditemukan" };
}

export default async function StoryPage({ params }: Props) {
  const story = storyBySlug((await params).slug);
  if (!story) notFound();
  const book = cueData[story.slug as keyof typeof cueData];
  const related = stories.filter((item) => item.slug !== story.slug && item.language === story.language).slice(0, 3);

  return <main>
    <section className="story-detail-hero"><div className="wrap">
      <nav className="breadcrumbs" aria-label="Jejak halaman"><Link href="/">Utama</Link><span>›</span><Link href="/galeri">Galeri Cerita</Link><span>›</span><span>{story.title}</span></nav>
      <div className="detail-intro"><div><div className="section-kicker">{story.wave.toUpperCase()} / {story.theme.toUpperCase()}</div><h1>{story.title}</h1><p className="detail-subtitle">{story.subtitle}</p></div><div className="detail-intro-side"><p>Tonton cerita rakyat Kalimantan Tengah, dengarkan narasinya, dan baca halaman buku yang mengikuti waktu pemutaran.</p><div className="detail-meta"><div><span>BAHASA</span><strong>{story.language}</strong></div><div><span>PENULIS</span><strong>{story.author}</strong></div></div></div></div>
    </div></section>
    <section className="experience-section"><div className="wrap"><StoryExperience story={story} pageCount={book.pageCount} cues={book.cues} /></div></section>
    {related.length > 0 && <section className="related-section section-pad"><div className="wrap"><div className="section-heading"><div><div className="section-kicker">LANJUT MENONTON</div><h2>Masih dalam bahasa <em>{story.language}.</em></h2></div><Link href="/galeri" className="text-link dark">Lihat semua cerita <span aria-hidden="true">→</span></Link></div><div className="story-grid">{related.map((item, index) => <StoryCard key={item.slug} story={item} index={index} />)}</div></div></section>}
  </main>;
}
