"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const photos = [
  { src: "/media/heritage/kotawaringin-class.webp", place: "SD Kotawaringin Barat", title: "Cerita hadir di ruang kelas", group: "Sekolah" },
  { src: "/media/heritage/sd-percobaan.webp", place: "SD Percobaan", title: "Mendengar bersama", group: "Sekolah" },
  { src: "/media/heritage/sungai-melawen.webp", place: "SDN 1 Sungai Melawen", title: "Belajar lewat buku audio", group: "Sekolah" },
  { src: "/media/heritage/skh-palangka-raya.webp", place: "SKH Negeri 1 Palangka Raya", title: "Cerita untuk semua", group: "Sekolah" },
  { src: "/media/heritage/smk-maharati.webp", place: "SMK Maharati", title: "Mengenal cerita daerah", group: "Sekolah" },
  { src: "/media/heritage/campus-outreach.webp", place: "PKKMB FKIP", title: "Memperkenalkan Hapakat", group: "Komunitas" },
] as const;

export function HeritageGallery() {
  const [filter, setFilter] = useState("Semua");
  const [selected, setSelected] = useState<(typeof photos)[number] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [selected]);
  const visible = filter === "Semua" ? photos : photos.filter((photo) => photo.group === filter);

  return <>
    <div className="heritage-filters" role="group" aria-label="Saring dokumentasi">{["Semua", "Sekolah", "Komunitas"].map((item) => <button key={item} type="button" aria-pressed={filter === item} className={filter === item ? "heritage-filter active" : "heritage-filter"} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="heritage-gallery-grid">{visible.map((photo) => <button className="heritage-photo-card" data-reveal type="button" key={photo.src} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(photo); }} aria-label={`Perbesar foto: ${photo.title}, ${photo.place}`}><span className="heritage-photo-image"><Image src={photo.src} alt={`${photo.title} di ${photo.place}`} fill sizes="(max-width: 650px) 100vw, (max-width: 950px) 50vw, 33vw" /></span><span className="heritage-photo-info"><span>{photo.place}</span><strong>{photo.title}</strong><b aria-hidden="true"><ArrowIcon /></b></span></button>)}</div>
    {selected && createPortal(<div className="heritage-lightbox" role="dialog" aria-modal="true" aria-label={`${selected.title}, ${selected.place}`} onClick={() => setSelected(null)}><button ref={closeRef} className="heritage-lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Tutup foto">×</button><div className="heritage-lightbox-content" onClick={(event) => event.stopPropagation()}><div className="heritage-lightbox-image"><Image src={selected.src} alt={`${selected.title} di ${selected.place}`} fill sizes="95vw" /></div><p><strong>{selected.title}</strong><span>{selected.place}</span></p></div></div>, document.body)}
  </>;
}
