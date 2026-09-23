import { addListenerStory, listListenerStories } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const validLanguages = new Set(["Dayak Ngaju", "Maanyan", "Bakumpay", "Bahasa lainnya"]);
function field(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max + 1) : ""; }

export async function GET() { return Response.json({ stories: await listListenerStories() }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 16000) return Response.json({ error: "Kiriman terlalu panjang." }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return Response.json({ error: "Data tidak terbaca." }, { status: 400 }); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "Format data tidak sesuai." }, { status: 400 });
  const name = field(data.name, 80), title = field(data.title, 120), language = field(data.language, 40), story = field(data.story, 3000);
  if (name.length < 2 || name.length > 80 || title.length < 5 || title.length > 120 || !validLanguages.has(language) || story.length < 40 || story.length > 3000) return Response.json({ error: "Periksa kembali nama, judul, bahasa, dan isi cerita. Cerita perlu sedikitnya 40 karakter." }, { status: 400 });
  const id = await addListenerStory({ name, title, language, story });
  return Response.json({ id, message: "Cerita berhasil dibagikan." }, { status: 201 });
}
