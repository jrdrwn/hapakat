import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { stories } from "@/lib/stories";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/galeri", "/cerita-pendengar", "/sukarelawan", "/jejak", "/tentang", "/old"];
  return [
    ...pages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path === "/galeri" ? .9 : .6,
    })),
    ...stories.map((story) => ({
      url: new URL(`/galeri/${story.slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: .8,
    })),
  ];
}
