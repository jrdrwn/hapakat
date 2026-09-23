import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hapakat — Cerita rakyat dalam suara bahasa daerah",
  description: "Dengarkan buku audio cerita rakyat Kalimantan Tengah dalam bahasa Dayak Ngaju, Maanyan, dan Bakumpay.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="id"><body>{children}</body></html>;
}
