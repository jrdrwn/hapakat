"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { InfiniteRows } from "@/components/infinite-rows";

export type PublishedFeedback = {
  id: string;
  name: string;
  message: string;
  context: string;
  photo: string | null;
};

function FeedbackAvatar({ name, photo }: Pick<PublishedFeedback, "name" | "photo">) {
  const [failed, setFailed] = useState(false);
  return <span className="feedback-avatar" aria-hidden="true">
    {photo && !failed
      ? <Image src={photo} alt="" width={48} height={48} loading="lazy" unoptimized referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      : name.trim().charAt(0).toUpperCase()}
  </span>;
}

export function FeedbackList({ entries }: { entries: PublishedFeedback[] }) {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PublishedFeedback | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rows: [PublishedFeedback[], PublishedFeedback[]] = [
    entries.filter((_, index) => index % 2 === 0),
    entries.filter((_, index) => index % 2 === 1),
  ];

  function readMore(entry: PublishedFeedback, compact: boolean, duplicate: boolean) {
    const threshold = compact ? 120 : 300;
    if (entry.message.length <= threshold) return null;
    return <button className="feedback-readmore" type="button" tabIndex={duplicate ? -1 : undefined} onClick={() => {
      setSelected(entry);
      dialogRef.current?.showModal();
    }}>Baca selengkapnya</button>;
  }

  function card(entry: PublishedFeedback, compact: boolean, duplicate = false) {
    return <article className={compact ? "feedback-card feedback-card-marquee" : "feedback-card feedback-card-full"} key={entry.id}>
      <span className="feedback-quote" aria-hidden="true">“</span>
      <p>{entry.message}</p>
      {readMore(entry, compact, duplicate)}
      <footer className="feedback-card-footer">
        <FeedbackAvatar name={entry.name} photo={entry.photo} />
        <span className="feedback-person"><strong>{entry.name}</strong><small>{entry.context}</small></span>
      </footer>
    </article>;
  }

  return <div className="feedback-collection">
    {entries.length ? <>
      <InfiniteRows
        rows={[rows[0].map((entry) => card(entry, true)), rows[1].map((entry) => card(entry, true))]}
        duplicateRows={[rows[0].map((entry) => card(entry, true, true)), rows[1].map((entry) => card(entry, true, true))]}
        className="feedback-marquee"
        secondsPerItem={5.8}
      />
      <details className="marquee-details wrap">
        <summary>Baca semua {entries.length} kesan <span aria-hidden="true">↗</span></summary>
        <div className="feedback-full-list">{entries.slice((page - 1) * pageSize, page * pageSize).map((entry) => card(entry, false))}</div>
        <nav className="feedback-pagination" aria-label="Halaman kesan">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Sebelumnya</button>
          <span>Halaman {page} dari {Math.ceil(entries.length / pageSize)}</span>
          <button type="button" disabled={page >= Math.ceil(entries.length / pageSize)} onClick={() => setPage((current) => Math.min(Math.ceil(entries.length / pageSize), current + 1))}>Berikutnya</button>
        </nav>
      </details>
    </> : <div className="feedback-empty"><span aria-hidden="true">✳</span><h3>Belum ada kesan yang dibagikan.</h3><p>Ceritakan pengalaman pertamamu bersama Hapakat.</p></div>}
    <dialog className="feedback-dialog" ref={dialogRef} onClose={() => setSelected(null)}>
      {selected && <div className="feedback-dialog-content">
        <div className="feedback-dialog-heading"><span className="section-kicker">KESAN PENDENGAR</span><button type="button" aria-label="Tutup kesan" onClick={() => dialogRef.current?.close()}>×</button></div>
        <span className="feedback-quote" aria-hidden="true">“</span>
        <p>{selected.message}</p>
        <footer className="feedback-card-footer"><FeedbackAvatar name={selected.name} photo={selected.photo} /><span className="feedback-person"><strong>{selected.name}</strong><small>{selected.context}</small></span></footer>
      </div>}
    </dialog>
  </div>;
}
