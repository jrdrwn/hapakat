import videoUrls from "@/data/video-urls.json";
import fallbackVideoUrls from "@/data/video-fallback-urls.json";
import bookUrls from "@/data/book-urls.json";
import fallbackBookUrls from "@/data/book-fallback-urls.json";

export type Story = {
  slug: string;
  title: string;
  subtitle: string;
  language: "Dayak Ngaju" | "Maanyan" | "Bakumpay";
  author: string;
  wave: "Gelombang 1" | "Gelombang 2";
  theme: string;
};

export const stories: Story[] = [
  { slug: "tulak-nyasap", title: "Tulak Nyasap", subtitle: "Pergi Berkebun", language: "Maanyan", author: "Desy Apriati", wave: "Gelombang 1", theme: "Alam & keseharian" },
  { slug: "tandik-bagagasa", title: "Tandik Bagagasa", subtitle: "Tarian Bagagasa", language: "Bakumpay", author: "Andheny Purwasih", wave: "Gelombang 1", theme: "Seni & tradisi" },
  { slug: "lomba-balanjaan", title: "Lomba Balanjaan Mensei", subtitle: "Lomba Mendayung", language: "Bakumpay", author: "Robet Domelo", wave: "Gelombang 1", theme: "Petualangan" },
  { slug: "gunter-hi-undrang", title: "Gunter hi Undrang", subtitle: "Gunter si Udang", language: "Maanyan", author: "Nurhalisa", wave: "Gelombang 1", theme: "Satwa & alam" },
  { slug: "tingang-tuntang-tanteluhe", title: "Tingang tuntang Tanteluhe", subtitle: "Tingang dan Telurnya", language: "Dayak Ngaju", author: "Ahmad Sya'roni", wave: "Gelombang 1", theme: "Satwa & alam" },
  { slug: "dombi-je-bahalap-atei", title: "Dombi je Bahalap Atei", subtitle: "Dombi yang Baik Hati", language: "Dayak Ngaju", author: "Arie", wave: "Gelombang 2", theme: "Persahabatan" },
  { slug: "hi-nisa-pannai-ikamit", title: "Hi Nisa Pannai Ikamit", subtitle: "Nisa Pandai Menjahit", language: "Maanyan", author: "Masnatiati", wave: "Gelombang 2", theme: "Keterampilan" },
  { slug: "lanting-bara-batang-pisang", title: "Lanting Bara Batang Pisang", subtitle: "Rakit dari Batang Pisang", language: "Dayak Ngaju", author: "Ahmad Fakhri", wave: "Gelombang 2", theme: "Alam & kreativitas" },
  { slug: "odon-tuntang-tingang", title: "Odon tuntang Tingang", subtitle: "Odon dan Rangkong Badak", language: "Dayak Ngaju", author: "Harry Wahyudi", wave: "Gelombang 2", theme: "Satwa & alam" },
  { slug: "pipet-purun", title: "Pipet Purun Rumbun tuntang Rimbun", subtitle: "Sedotan Purun Rumbun dan Rimbun", language: "Dayak Ngaju", author: "Mia Cisadani", wave: "Gelombang 2", theme: "Alam & kreativitas" },
  { slug: "pulau-borneoku", title: "Pulau Borneoku je Tatau Haliai", subtitle: "Pulau Borneoku yang Kaya Raya", language: "Dayak Ngaju", author: "Valentina", wave: "Gelombang 2", theme: "Tanah Borneo" },
];

export const languages = ["Semua bahasa", "Dayak Ngaju", "Maanyan", "Bakumpay"] as const;
export function storyBySlug(slug: string) { return stories.find((story) => story.slug === slug); }
export function coverFor(story: Story) { return `/media/covers/${story.slug}.jpg`; }
export function audioFor(story: Story) { return `/media/audio/${story.slug}.mp3`; }
export function bookFor(story: Story) { return bookUrls[story.slug as keyof typeof bookUrls] ?? `/media/books/${story.slug}.pdf`; }
export function fallbackBookFor(story: Story) { return fallbackBookUrls[story.slug as keyof typeof fallbackBookUrls] ?? null; }
export function videoFor(story: Story) {
  if (process.env.NODE_ENV === "production") return videoUrls[story.slug as keyof typeof videoUrls] ?? `/api/video/${story.slug}`;
  return `/api/video/${story.slug}`;
}
export function fallbackVideoFor(story: Story) {
  return fallbackVideoUrls[story.slug as keyof typeof fallbackVideoUrls] ?? null;
}
