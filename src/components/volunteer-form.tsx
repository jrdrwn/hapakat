"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import { useState, type FormEvent } from "react";

export function VolunteerForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending"); setMessage("");
    try { const response = await fetch("/api/sukarelawan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Pendaftaran belum terkirim."); form.reset(); setStatus("success"); setMessage(data.message); }
    catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Pendaftaran belum terkirim."); }
  }
  return <form className="contribution-form" onSubmit={submit} aria-busy={status === "sending"}><div className="form-row"><label>Nama lengkap<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Nama lengkapmu" /></label><label>Alamat email<input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="nama@contoh.com" /></label></div><label>Peran yang diminati<select name="role" required defaultValue=""><option value="" disabled>Pilih peran</option><option>Penutur atau narator</option><option>Penulis cerita</option><option>Ilustrator</option><option>Penyunting</option><option>Lainnya</option></select></label><label>Ceritakan sedikit tentang dirimu<textarea name="message" required minLength={20} maxLength={1000} rows={5} placeholder="Bahasa yang kamu kuasai, pengalaman, atau ide kontribusimu..." /><span className="field-hint">Kontak dan pesanmu hanya terlihat di halaman pengelolaan.</span></label><div className="form-submit"><button type="submit" className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Mengirim..." : "Daftar sukarelawan"} <span aria-hidden="true"><ArrowIcon /></span></button>{message && <p className={`form-message ${status}`} role="status">{message}</p>}</div></form>;
}
