/** Upload prepared videos once, then save only their public delivery URLs in Git. */
import { openAsBlob, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const key = process.env.IMAGEKIT_PRIVATE_KEY;
const folder = process.env.IMAGEKIT_UPLOAD_FOLDER;
if (!key || !folder) throw new Error("IMAGEKIT_PRIVATE_KEY and IMAGEKIT_UPLOAD_FOLDER are required");

const root = process.cwd();
const manifestPath = join(root, "src", "data", "video-urls.json");
let urls = {};
try { urls = JSON.parse(readFileSync(manifestPath, "utf8")); } catch { /* First upload. */ }

const slugs = [
  "tulak-nyasap", "tandik-bagagasa", "lomba-balanjaan",
  "dombi-je-bahalap-atei", "hi-nisa-pannai-ikamit", "lanting-bara-batang-pisang",
  "odon-tuntang-tingang", "pipet-purun", "pulau-borneoku",
];
const authorization = `Basic ${Buffer.from(`${key}:`).toString("base64")}`;

for (const slug of slugs) {
  if (urls[slug]) { console.log(`skip ${slug}`); continue; }
  const file = await openAsBlob(join(root, "tmp", "imagekit-videos", `${slug}.mp4`), { type: "video/mp4" });
  const data = new FormData();
  data.set("file", file, `${slug}.mp4`);
  data.set("fileName", `${slug}.mp4`);
  data.set("folder", folder);
  data.set("useUniqueFileName", "false");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST", headers: { authorization }, body: data,
  });
  const result = await response.json();
  if (!response.ok || typeof result.url !== "string") throw new Error(`ImageKit upload failed for ${slug}: ${response.status} ${result.message || "unknown error"}`);
  urls[slug] = result.url;
  writeFileSync(manifestPath, `${JSON.stringify(urls, null, 2)}\n`);
  console.log(`uploaded ${slug}: ${(file.size / 1048576).toFixed(1)} MB`);
}
