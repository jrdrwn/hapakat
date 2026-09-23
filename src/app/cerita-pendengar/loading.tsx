export default function Loading() {
  return <main aria-busy="true" aria-label="Memuat cerita pendengar">
    <section className="page-hero listener-page-hero"><div className="wrap"><div className="section-kicker">CERITA PENDENGAR / HAPAKAT</div><h1>Cerita hidup saat<br /><em>kita membagikannya.</em></h1><p>Menyiapkan kisah dan kesan terbaru dari pendengar…</p></div></section>
    <section className="section-pad listener-list-section"><div className="wrap"><div className="skeleton-line skeleton-title" /><div className="skeleton-line skeleton-copy" /><div className="listener-story-grid skeleton-grid">{[0, 1, 2].map((item) => <div className="skeleton-card" key={item}><div className="skeleton-line skeleton-label" /><div className="skeleton-line skeleton-heading" /><div className="skeleton-line" /><div className="skeleton-line skeleton-short" /></div>)}</div></div></section>
  </main>;
}
