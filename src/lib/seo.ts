import type { Metadata } from "next";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hapakat.vercel.app");

export function pageMetadata(path: string, title: string, description: string, image = "/media/social/hapakat.jpg"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "Hapakat",
      url: path,
      title: `${title} | Hapakat`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: image.includes("/social/hapakat") ? "Hapakat, cerita rakyat Kalimantan Tengah dalam buku audio" : `Sampul cerita ${title} di Hapakat` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hapakat`,
      description,
      images: [image],
    },
  };
}
