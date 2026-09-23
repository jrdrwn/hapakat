"use client";

import { useMemo, useState } from "react";
import { StoryCard } from "@/components/story-card";
import { languages, stories } from "@/lib/stories";

export function GalleryExplorer() {
  const [language, setLanguage] = useState<(typeof languages)[number]>("Semua bahasa");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("terbaru");
  const results = useMemo(() => {
    const filtered = stories.filter((story) => (language === "Semua bahasa" || story.language === language) && `${story.title} ${story.subtitle} ${story.author} ${story.theme}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));
    return sort === "judul" ? [...filtered].sort((a, b) => a.title.localeCompare(b.title, "id")) : filtered;
  }, [language, query, sort]);

  return <><div className="gallery-controls"><div className="filters" role="group" aria-label="Saring berdasarkan bahasa">{languages.map((item) => <button type="button" className={language === item ? "filter active" : "filter"} key={item} aria-pressed={language === item} onClick={() => setLanguage(item)}>{item}</button>)}</div><div className="gallery-search-row"><label className="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul, penulis, atau tema..." aria-label="Cari cerita" /></label><label className="sort-box"><span>Urutkan</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="terbaru">Koleksi</option><option value="judul">Judul A–Z</option></select></label></div></div><div className="result-count" aria-live="polite">Menampilkan {results.length} dari {stories.length} cerita</div><div className="story-grid">{results.map((story, index) => <StoryCard key={story.slug} story={story} index={index} />)}</div>{results.length === 0 && <div className="empty-state"><h2>Belum ada cerita yang cocok.</h2><p>Coba bahasa atau kata kunci lain.</p><button type="button" onClick={() => { setLanguage("Semua bahasa"); setQuery(""); }}>Tampilkan semua cerita</button></div>}</>;
}
