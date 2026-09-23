import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { coverFor, type Story } from "@/lib/stories";

export function StoryCard({ story, index = 0 }: { story: Story; index?: number }) {
  const href = `/galeri/${story.slug}`;

  return <article className="story-card">
    <Link className="cover-button" href={href} aria-label={`Buka cerita ${story.title}`}>
      <Image src={coverFor(story)} alt={`Sampul buku ${story.title}`} width={440} height={310} sizes="(max-width: 560px) 50vw, (max-width: 800px) 45vw, 30vw" loading={index > 2 ? "lazy" : "eager"} />
      <span className="cover-play"><ArrowIcon /></span>
    </Link>
    <div className="story-card-body">
      <div className="card-meta"><span>{story.language}</span><span>{story.wave}</span></div>
      <h3><Link href={href}>{story.title}</Link></h3>
      <p>{story.subtitle}</p>
      <div className="card-footer">
        <span>Oleh <strong>{story.author}</strong></span>
        <Link href={href} aria-label={`Buka ${story.title}`}><ArrowIcon /></Link>
      </div>
    </div>
  </article>;
}
