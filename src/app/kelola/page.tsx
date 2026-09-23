import { PendingSubmit } from "@/components/pending-submit";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { listFeedback, listListenerStories, listVolunteers } from "@/lib/db";
import { storyBySlug } from "@/lib/stories";
import { deleteFeedback, deleteListenerStory, logout } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pengelolaan", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/kelola/masuk");
  const [stories, volunteers, feedback] = await Promise.all([listListenerStories(), listVolunteers(), listFeedback()]);
  return <main className="admin-page"><div className="wrap">
    <div className="admin-heading"><div><div className="section-kicker">RUANG PENGELOLA</div><h1>Suara yang <em>terkumpul.</em></h1><p>Lihat kisah pendengar, umpan balik, dan pendaftaran sukarelawan yang tersimpan di situs ini.</p></div><form action={logout}><PendingSubmit label="Keluar" pendingLabel="Keluar..." className="admin-logout" /></form></div>
    <div className="admin-stats"><div><strong>{stories.length}</strong><span>Cerita pendengar</span></div><div><strong>{feedback.length}</strong><span>Umpan balik</span></div><div><strong>{volunteers.length}</strong><span>Pendaftar sukarelawan</span></div></div>
    <section className="admin-panel"><div className="admin-panel-title"><h2>Cerita pendengar</h2><span>{stories.length} cerita</span></div>{stories.length ? <div className="admin-list">{stories.map((story) => <article className="admin-item" key={story.id}><div><span className="admin-date">{story.language} · {story.created_at.slice(0, 10)}</span><h3>{story.title}</h3><p>Oleh {story.name}</p><p className="admin-story-preview">{story.story}</p></div><form action={deleteListenerStory}><input type="hidden" name="id" value={story.id} /><PendingSubmit label="Hapus" pendingLabel="Menghapus..." className="admin-delete" ariaLabel={`Hapus ${story.title}`} /></form></article>)}</div> : <p className="admin-empty">Belum ada cerita yang dikirim.</p>}</section>
    <section className="admin-panel"><div className="admin-panel-title"><h2>Umpan balik</h2><span>{feedback.length} kesan</span></div>{feedback.length ? <div className="admin-list">{feedback.map((entry) => <article className="admin-item" key={entry.id}><div><span className="admin-date">{entry.story_slug ? storyBySlug(entry.story_slug)?.title || "Cerita Hapakat" : "Hapakat"} · {entry.created_at.slice(0, 10)}</span><h3>{entry.name}</h3><p className="admin-story-preview">{entry.message}</p></div><form action={deleteFeedback}><input type="hidden" name="id" value={entry.id} /><PendingSubmit label="Hapus" pendingLabel="Menghapus..." className="admin-delete" ariaLabel={`Hapus kesan ${entry.name}`} /></form></article>)}</div> : <p className="admin-empty">Belum ada kesan yang dikirim.</p>}</section>
    <section className="admin-panel"><div className="admin-panel-title"><h2>Sukarelawan</h2><span>{volunteers.length} pendaftar</span></div>{volunteers.length ? <div className="admin-list">{volunteers.map((person) => <article className="admin-item" key={person.id}><div><span className="admin-date">{person.role} · {person.created_at.slice(0, 10)}</span><h3>{person.name}</h3><a href={`mailto:${person.email}`}>{person.email}</a><p className="admin-story-preview">{person.message}</p></div></article>)}</div> : <p className="admin-empty">Belum ada pendaftaran sukarelawan.</p>}</section>
  </div></main>;
}
