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
  return <footer className="footer"><div className="wrap footer-top"><Link href="/"><Image src="/media/logo-hapakat.png" alt="Hapakat" width={180} height={50} /></Link><p>Merawat bahasa lewat cerita.<br />Kalimantan Tengah, Indonesia.</p><div className="footer-links"><Link href="/galeri">Galeri cerita</Link><Link href="/panduan">Panduan penggunaan</Link><Link href="/jejak">Jejak kegiatan</Link><Link href="/sukarelawan">Jadi sukarelawan</Link><Link href="/kelola">Kelola</Link></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Hapakat</span><span>Harmoni Aksi Pelestarian Bahasa Daerah Kalimantan Tengah</span></div></footer>;
}
