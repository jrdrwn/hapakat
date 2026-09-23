export default function Loading() {
  return <main className="admin-page" aria-busy="true" aria-label="Memuat halaman pengelolaan"><div className="wrap"><div className="skeleton-line skeleton-title" /><div className="skeleton-line skeleton-copy" /><div className="admin-stats skeleton-grid">{[0, 1, 2].map((item) => <div className="skeleton-card" key={item}><div className="skeleton-line skeleton-heading" /><div className="skeleton-line skeleton-short" /></div>)}</div></div></main>;
}
