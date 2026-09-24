"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Utama" },
  { href: "/galeri", label: "Galeri Cerita" },
  { href: "/panduan", label: "Panduan" },
  { href: "/cerita-pendengar", label: "Cerita Pendengar" },
  { href: "/sukarelawan", label: "Sukarelawan" },
  { href: "/jejak", label: "Jejak Hapakat" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path === "/old") return null;
  return <header className="site-header"><div className="header-inner wrap">
    <Link className="brand" href="/" aria-label="Hapakat, kembali ke utama" onClick={() => setOpen(false)}><Image src="/media/logo-hapakat.png" width={175} height={48} alt="Hapakat" priority /></Link>
    <nav className={`nav ${open ? "nav-open" : ""}`} aria-label="Navigasi utama">{links.map(({ href, label }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={path === href || (href === "/galeri" && path.startsWith("/galeri/")) ? "page" : undefined}>{label}</Link>)}</nav>
    <Link className="header-cta" href="/galeri">Mulai menonton <span aria-hidden="true"><ArrowIcon /></span></Link>
    <button className="menu-toggle" type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
  </div></header>;
}

export function SiteFooter() {
  const path = usePathname();
  if (path === "/old") return null;
  return <footer className="footer">
    <div className="footer-sigil" aria-hidden="true"><span /><span /><span /></div>
    <div className="wrap footer-top">
      <div className="footer-identity">
        <Link className="footer-brand" href="/" aria-label="Hapakat, kembali ke utama"><Image src="/media/logo-hapakat.png" alt="" width={190} height={55} /></Link>
        <p className="footer-statement">Cerita tetap hidup<br /><em>saat kita mendengarnya.</em></p>
        <p className="footer-description">Ruang untuk menonton, mendengar, dan membaca cerita rakyat dalam bahasa daerah Kalimantan Tengah.</p>
        <div className="footer-languages" aria-label="Bahasa dalam koleksi Hapakat"><span>Dayak Ngaju</span><span>Maanyan</span><span>Bakumpay</span></div>
      </div>
      <nav className="footer-nav" aria-label="Jelajahi Hapakat">
        <h2>Jelajahi</h2>
        <Link href="/galeri">Galeri cerita</Link>
        <Link href="/panduan">Panduan</Link>
        <Link href="/cerita-pendengar">Cerita pendengar</Link>
        <Link href="/jejak">Jejak Hapakat</Link>
      </nav>
      <nav className="footer-nav" aria-label="Tentang dan kontribusi">
        <h2>Ikut merawat</h2>
        <Link href="/sukarelawan">Jadi sukarelawan</Link>
        <Link href="/cerita-pendengar#bagikan">Bagikan cerita</Link>
        <Link href="/tentang">Tentang Hapakat</Link>
        <Link href="/kelola">Kelola</Link>
      </nav>
      <div className="footer-invite">
        <span className="footer-invite-mark" aria-hidden="true">✦</span>
        <span className="footer-invite-kicker">MULAI MENDENGAR</span>
        <p>Satu cerita bisa membuka banyak percakapan.</p>
        <Link href="/galeri" aria-label="Pilih cerita di galeri">Pilih cerita <ArrowIcon direction="right" /></Link>
      </div>
    </div>
    <div className="wrap footer-bottom">
      <span>© {new Date().getFullYear()} Hapakat</span>
      <span>Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah</span>
      <a href="#top">Kembali ke atas <ArrowIcon direction="right" /></a>
    </div>
  </footer>;
}
