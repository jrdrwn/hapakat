import "server-only";
import { join } from "node:path";

const base = join(process.cwd(), "data", "AUDIOBOOK CERITA DAERAH");
const sources: Record<string, string[]> = {
  "tulak-nyasap": ["Tulak Nyasap.mp4"],
  "tandik-bagagasa": ["Tandik Bagagasa.mp4"],
  "lomba-balanjaan": ["Lomba Balanjaan .mp4"],
  "dombi-je-bahalap-atei": ["Gelombang 2", "Video", "Dombi je Bahalap Atei.mp4"],
  "hi-nisa-pannai-ikamit": ["Gelombang 2", "Video", "Hi Nisa Pannai Ikamit.mp4"],
  "lanting-bara-batang-pisang": ["Gelombang 2", "Video", "Lanting Bara Batang Pisang.mp4"],
  "odon-tuntang-tingang": ["Gelombang 2", "Video", "Odon tuntang Tingang.mp4"],
  "pipet-purun": ["Gelombang 2", "Video", "Pipet Purun Rumbun tuntang Rimbun (1).mp4"],
  "pulau-borneoku": ["Gelombang 2", "Video", "Pulau Borneoku je Tatau Haliai_.mp4"],
};

export function videoFileFor(slug: string) {
  const parts = sources[slug];
  return parts ? join(base, ...parts) : null;
}
