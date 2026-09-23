import Image from "next/image";
import Link from "next/link";
import { coverFor, type Story } from "@/lib/stories";

export function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  return <article className="story-card"><Link className="cover-button" href={`/galeri/${story.slug}`} aria-label={`Buka cerita ${story.title}`}><Image src={coverFor(story)} alt={`Sampul buku ${story.title}`} width={440} height={310} loading={index > 2 ? "lazy" : "eager"} /><span className="cover-play" aria-hidden="true">↗</span></Link><div className="card-meta"><span>{story.language}</span><span>{story.wave}</span></div><h3><Link href={`/galeri/${story.slug}`}>{story.title}</Link></h3><p>{story.subtitle}</p><div className="card-footer"><span>Oleh {story.author}</span><Link href={`/galeri/${story.slug}`} aria-label={`Buka ${story.title}`}>↗</Link></div></article>;
}
