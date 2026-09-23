import { addFeedback, listFeedback } from "@/lib/db";
import { storyBySlug } from "@/lib/stories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function field(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max + 1) : ""; }

export async function GET() { return Response.json({ feedback: await listFeedback() }, { headers: { "Cache-Control": "no-store" } }); }

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 5000) return Response.json({ error: "Kiriman terlalu panjang." }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return Response.json({ error: "Data tidak terbaca." }, { status: 400 }); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "Format data tidak sesuai." }, { status: 400 });
  const name = field(data.name, 80), story_slug = field(data.story_slug, 80), message = field(data.message, 800);
  if (name.length < 2 || name.length > 80 || message.length < 20 || message.length > 800 || (story_slug && !storyBySlug(story_slug))) return Response.json({ error: "Periksa nama, cerita pilihan, dan kesanmu. Isi sedikitnya 20 karakter." }, { status: 400 });
  const id = await addFeedback({ name, story_slug, message });
  return Response.json({ id, message: "Kesanmu berhasil dibagikan." }, { status: 201 });
}
