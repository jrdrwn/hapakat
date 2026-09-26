/** Upload the compact Gelombang 1 PDF books to ImageKit or Uploadcare. */
import { existsSync, openAsBlob, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const provider = process.argv[2];
if (provider !== "imagekit" && provider !== "uploadcare") throw new Error("Use imagekit or uploadcare");
const key = provider === "imagekit" ? process.env.IMAGEKIT_PRIVATE_KEY : process.env.UPLOADCARE_PUBLIC_KEY;
if (!key) throw new Error(`A ${provider} upload key is required`);

const root = process.cwd();
const manifestPath = join(root, "src", "data", provider === "imagekit" ? "book-urls.json" : "book-fallback-urls.json");
const urls = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const slugs = ["gunter-hi-undrang", "tingang-tuntang-tanteluhe"];

for (const slug of slugs) {
  if (urls[slug]) { console.log(`skip ${slug}`); continue; }
  const file = await openAsBlob(join(root, "public", "media", "books", `${slug}.pdf`), { type: "application/pdf" });
  const data = new FormData();
  let response;
  if (provider === "imagekit") {
    data.set("file", file, `${slug}.pdf`);
    data.set("fileName", `${slug}.pdf`);
    data.set("folder", `${process.env.IMAGEKIT_UPLOAD_FOLDER || "/hapakat"}/books`);
    data.set("useUniqueFileName", "false");
    const authorization = `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
    response = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", headers: { authorization }, body: data });
  } else {
    data.set("UPLOADCARE_PUB_KEY", key);
    data.set("UPLOADCARE_STORE", "1");
    data.set("file", file, `${slug}.pdf`);
    response = await fetch("https://upload.uploadcare.com/base/", { method: "POST", body: data });
  }
  const result = await response.json();
  const url = provider === "imagekit" ? result.url : result.file && `https://ucarecdn.com/${result.file}/`;
  if (!response.ok || typeof url !== "string") throw new Error(`${provider} book upload failed for ${slug}: ${response.status}`);
  urls[slug] = url;
  writeFileSync(manifestPath, `${JSON.stringify(urls, null, 2)}\n`);
  console.log(`uploaded ${slug} to ${provider}: ${(file.size / 1048576).toFixed(1)} MB`);
}
