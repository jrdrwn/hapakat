import { addVolunteer } from "@/lib/db";

export const runtime = "nodejs";
const roles = new Set(["Penutur atau narator", "Penulis cerita", "Ilustrator", "Penyunting", "Lainnya"]);
function field(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max + 1) : ""; }

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 8000) return Response.json({ error: "Kiriman terlalu panjang." }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return Response.json({ error: "Data tidak terbaca." }, { status: 400 }); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "Format data tidak sesuai." }, { status: 400 });
  const name = field(data.name, 80), email = field(data.email, 200), role = field(data.role, 50), message = field(data.message, 1000);
  if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !roles.has(role) || message.length < 20 || message.length > 1000) return Response.json({ error: "Periksa kembali nama, email, peran, dan pesan. Pesan perlu sedikitnya 20 karakter." }, { status: 400 });
  const id = await addVolunteer({ name, email, role, message });
  return Response.json({ id, message: "Pendaftaran berhasil dikirim." }, { status: 201 });
}
