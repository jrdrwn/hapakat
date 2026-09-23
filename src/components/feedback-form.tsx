"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { stories } from "@/lib/stories";

export function FeedbackForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("/api/umpan-balik", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kesan belum terkirim.");
      form.reset(); setStatus("success"); setMessage(data.message); router.refresh();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Kesan belum terkirim."); }
  }

  return <form className="contribution-form" onSubmit={submit}><div className="form-row"><label>Nama panggilan<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Namamu" /></label><label>Cerita yang didengar<select name="story_slug" defaultValue=""><option value="">Kesan umum tentang Hapakat</option>{stories.map((story) => <option key={story.slug} value={story.slug}>{story.title}</option>)}</select></label></div><label>Apa kesanmu?<textarea name="message" required minLength={20} maxLength={800} rows={5} placeholder="Ceritakan pengalamanmu menonton, mendengar, atau membaca cerita di Hapakat..." /><span className="field-hint">20–800 karakter. Nama panggilan dan kesanmu akan tampil untuk umum.</span></label><div className="form-submit"><button type="submit" className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Mengirim..." : "Kirim kesan"} <span aria-hidden="true">↗</span></button>{message && <p className={`form-message ${status}`} role="status">{message}</p>}</div></form>;
}
