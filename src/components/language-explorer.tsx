"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { useMemo, useState } from "react";
import { stories } from "@/lib/stories";

const filters = ["Semua", "Dayak Ngaju", "Maanyan", "Bakumpay"] as const;

export function LanguageExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Semua");
  const [search, setSearch] = useState("");
  const visible = useMemo(() => stories.filter((story) => {
    const term = search.trim().toLocaleLowerCase("id");
    return (filter === "Semua" || story.language === filter) && (!term || `${story.title} ${story.subtitle} ${story.language}`.toLocaleLowerCase("id").includes(term));
  }), [filter, search]);

  return <div className="language-explorer">
    <div className="language-explorer-head"><div><span className="section-kicker">KAMUS MINI HAPAKAT</span><h3>Ungkapan dari judul cerita</h3></div><span>{visible.length} ungkapan</span></div>
    <p className="language-explorer-intro">Cari padanan bahasa Indonesia dari judul buku dwibahasa. Pilih ungkapan untuk membuka ceritanya.</p>
    <label className="language-search"><span className="sr-only">Cari ungkapan</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari kata atau judul..." /></label>
    <div className="language-filters" role="group" aria-label="Saring bahasa">{filters.map((item) => <button key={item} type="button" className={filter === item ? "language-filter active" : "language-filter"} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="language-results">{visible.length ? visible.map((story) => <Link href={`/galeri/${story.slug}`} className="language-result" key={story.slug}><span className="language-result-copy"><small>{story.language}</small><strong>{story.title}</strong><span>{story.subtitle}</span></span><b aria-hidden="true"><ArrowIcon /></b></Link>) : <p className="language-empty">Tidak ada ungkapan yang cocok. Coba kata atau bahasa lain.</p>}</div>
    <p className="language-disclaimer">Kumpulan ini memakai padanan judul dari buku cerita Hapakat; belum merupakan kamus bahasa daerah lengkap.</p>
  </div>;
}
