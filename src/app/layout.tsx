import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Hapakat — Cerita rakyat dalam suara bahasa daerah", template: "%s | Hapakat" },
  description: "Dengarkan buku audio cerita rakyat Kalimantan Tengah dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
