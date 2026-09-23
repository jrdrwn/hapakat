import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Hapakat",
  title: { default: "Hapakat — Cerita rakyat dalam suara bahasa daerah", template: "%s | Hapakat" },
  description: "Dengarkan buku audio cerita rakyat Kalimantan Tengah dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Hapakat",
    title: "Hapakat — Cerita rakyat dalam suara bahasa daerah",
    description: "Tonton, dengarkan, dan baca cerita rakyat Kalimantan Tengah dalam bahasa daerah.",
    images: [{ url: "/media/social/hapakat.jpg", width: 1200, height: 630, alt: "Hapakat, cerita rakyat Kalimantan Tengah dalam buku audio" }],
  },
  twitter: { card: "summary_large_image", images: ["/media/social/hapakat.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="id"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
