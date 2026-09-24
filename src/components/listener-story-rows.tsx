import Link from "next/link";
import { InfiniteRows } from "@/components/infinite-rows";
import type { ListenerStory } from "@/lib/db";

const storyIdeas = [
  ["Bahasa pertama yang kamu dengar", "Kata atau ungkapan dari rumah yang masih kamu ingat."],
  ["Cerita dari orang tua", "Kisah yang pernah diceritakan keluarga sebelum tidur."],
  ["Kenangan di kampung halaman", "Tempat dan peristiwa yang ingin kamu simpan dalam tulisan."],
  ["Dongeng yang hampir terlupa", "Cerita rakyat yang masih hidup dalam ingatanmu."],
  ["Suara dari pasar atau sungai", "Percakapan sehari-hari yang terasa khas daerahmu."],
  ["Satu kata, banyak ingatan", "Sebuah kata daerah dan kisah di baliknya."],
  ["Tradisi yang kamu rindukan", "Kebiasaan keluarga yang ingin dikenal generasi berikutnya."],
  ["Cerita berikutnya darimu", "Tuliskan kisahmu dan biarkan orang lain ikut mendengarnya."],
] as const;

type StoryCard = { id: string; language: string; title: string; preview: string; author: string; idea?: boolean };

export function ListenerStoryRows({ entries }: { entries: ListenerStory[] }) {
  const cards: StoryCard[] = entries.slice(0, 12).map((entry) => ({
    id: entry.id,
    language: entry.language,
    title: entry.title,
    preview: entry.story.replace(/\s+/g, " "),
    author: entry.name,
  }));
  for (const [index, [title, preview]] of storyIdeas.entries()) {
    if (cards.length >= 8) break;
    cards.push({ id: `idea-${index}`, language: "IDE CERITA", title, preview, author: "Cerita berikutnya bisa darimu", idea: true });
  }
  const rows: [StoryCard[], StoryCard[]] = [
    cards.filter((_, index) => index % 2 === 0),
    cards.filter((_, index) => index % 2 === 1),
  ];
  const renderCard = (card: StoryCard) => <article className={`listener-story-card listener-story-card-marquee${card.idea ? " is-idea" : ""}`} key={card.id}>
    <div className="listener-story-top"><span>{card.language}</span><span>{card.idea ? "✦" : "DARI PENDENGAR"}</span></div>
    <h3>{card.title}</h3>
    <p>{card.preview}</p>
    <div className="listener-story-author">{card.idea ? card.author : <>Diceritakan oleh <strong>{card.author}</strong></>}</div>
  </article>;

  return <>
    <InfiniteRows rows={[rows[0].map(renderCard), rows[1].map(renderCard)]} className="story-marquee" />
    <div className="wrap">
      {entries.length ? <details className="marquee-details">
        <summary>Baca semua {entries.length} cerita pendengar <span aria-hidden="true">↗</span></summary>
        <div className="listener-story-grid">{entries.map((entry) => <article className="listener-story-card" key={entry.id}>
          <div className="listener-story-top"><span>{entry.language}</span><time dateTime={`${entry.created_at}Z`}>{new Date(`${entry.created_at}Z`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</time></div>
          <h3>{entry.title}</h3>
          <p>{entry.story}</p>
          <div className="listener-story-author">Diceritakan oleh <strong>{entry.name}</strong></div>
        </article>)}</div>
      </details> : <p className="listener-story-more">Belum ada cerita pendengar yang dibagikan. <Link href="#bagikan">Jadilah yang pertama menulis cerita →</Link></p>}
    </div>
  </>;
}
