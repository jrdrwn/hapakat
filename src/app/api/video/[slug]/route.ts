import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { videoFileFor } from "@/lib/video-sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ slug: string }> };

async function streamVideo(request: Request, { params }: Context, headOnly = false) {
  const file = videoFileFor((await params).slug);
  if (!file) return new Response("Video tidak ditemukan.", { status: 404 });
  let size: number;
  try { size = (await stat(file)).size; } catch { return new Response("Berkas video tidak tersedia.", { status: 404 }); }

  const range = request.headers.get("range");
  let start = 0, end = size - 1;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    if (match[1]) { start = Number(match[1]); end = match[2] ? Number(match[2]) : size - 1; }
    else { const suffix = Number(match[2]); start = Math.max(0, size - suffix); }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size || end < 0) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    end = Math.min(end, size - 1);
  }

  const headers = new Headers({
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
    "Cache-Control": "private, max-age=3600",
  });
  if (range) headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  const body = headOnly ? null : Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, { status: range ? 206 : 200, headers });
}

export async function GET(request: Request, context: Context) { return streamVideo(request, context); }
export async function HEAD(request: Request, context: Context) { return streamVideo(request, context, true); }
