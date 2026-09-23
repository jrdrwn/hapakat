import type { NextConfig } from "next";
import videoUrls from "./src/data/video-urls.json";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.VERCEL !== "1") return [];
    return Object.entries(videoUrls).map(([slug, destination]) => ({
      source: `/api/video/${slug}`,
      destination,
    }));
  },
};

export default nextConfig;
