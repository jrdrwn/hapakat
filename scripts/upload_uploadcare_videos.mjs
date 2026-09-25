/** Upload prepared MP4 files to Uploadcare and save their public fallback URLs. */
import { openAsBlob, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;
if (!publicKey) throw new Error("UPLOADCARE_PUBLIC_KEY is required");

const root = process.cwd();
const manifestPath = join(root, "src", "data", "video-fallback-urls.json");
const urls = JSON.parse(readFileSync(manifestPath, "utf8"));
const slugs = [
  "tulak-nyasap", "tandik-bagagasa", "lomba-balanjaan",
  "dombi-je-bahalap-atei", "hi-nisa-pannai-ikamit", "lanting-bara-batang-pisang",
  "odon-tuntang-tingang", "pipet-purun", "pulau-borneoku",
];

for (const slug of slugs) {
  if (urls[slug]) { console.log(`skip ${slug}`); continue; }
  const file = await openAsBlob(join(root, "tmp", "imagekit-videos", `${slug}.mp4`), { type: "video/mp4" });
  const data = new FormData();
  data.set("UPLOADCARE_PUB_KEY", publicKey);
  data.set("UPLOADCARE_STORE", "1");
  data.set("file", file, `${slug}.mp4`);
  const response = await fetch("https://upload.uploadcare.com/base/", { method: "POST", body: data });
  const result = await response.json();
  if (!response.ok || typeof result.file !== "string") throw new Error(`Uploadcare upload failed for ${slug}: ${response.status}`);
  urls[slug] = `https://ucarecdn.com/${result.file}/`;
  writeFileSync(manifestPath, `${JSON.stringify(urls, null, 2)}\n`);
  console.log(`uploaded ${slug}: ${(file.size / 1048576).toFixed(1)} MB`);
}
