import { PendingSubmit } from "@/components/pending-submit";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { login } from "./actions";

export const metadata: Metadata = { title: "Masuk Pengelola", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ error?: string }> };
export default async function AdminLogin({ searchParams }: Props) {
  if (await isAdmin()) redirect("/kelola");
  const { error } = await searchParams;
  return <main className="admin-login-page"><div className="admin-login-card"><div className="section-kicker">PENGELOLA HAPAKAT</div><h1>Selamat datang<br /><em>kembali.</em></h1><p>Masuk untuk melihat pendaftaran sukarelawan dan mengelola cerita pendengar.</p><form action={login} className="contribution-form"><label>Kata sandi pengelola<input type="password" name="password" autoComplete="current-password" required placeholder="Masukkan kata sandi" /></label>{error && <p className="form-message error" role="alert">Kata sandi belum benar.</p>}<PendingSubmit label="Masuk" pendingLabel="Memeriksa..." className="button button-primary" arrow /></form></div></main>;
}
