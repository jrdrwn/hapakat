"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ListenerForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setStatus("sending"); setMessage("");
    try { const response = await fetch("/api/cerita-pendengar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Cerita belum terkirim."); form.reset(); setStatus("success"); setMessage(data.message); router.refresh(); }
    catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Cerita belum terkirim."); }
  }
  return <form className="contribution-form" onSubmit={submit} aria-busy={status === "sending"}><div className="form-row"><label>Nama panggilan<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Namamu" /></label><label>Bahasa cerita<select name="language" required defaultValue=""><option value="" disabled>Pilih bahasa</option><option>Dayak Ngaju</option><option>Maanyan</option><option>Bakumpay</option><option>Bahasa lainnya</option></select></label></div><label>Judul cerita<input name="title" required minLength={5} maxLength={120} placeholder="Beri cerita ini judul" /></label><label>Cerita yang ingin dibagikan<textarea name="story" required minLength={40} maxLength={3000} rows={7} placeholder="Tuliskan kisah, kenangan, atau cerita dari daerahmu..." /><span className="field-hint">40–3.000 karakter. Cerita dan nama panggilanmu akan tampil untuk umum.</span></label><div className="form-submit"><button type="submit" className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Mengirim..." : "Bagikan cerita"} <span aria-hidden="true"><ArrowIcon /></span></button>{message && <p className={`form-message ${status}`} role="status">{message}</p>}</div></form>;
}
