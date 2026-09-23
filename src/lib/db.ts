import "server-only";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { neon } from "@neondatabase/serverless";

export type ListenerStory = { id: string; name: string; title: string; language: string; story: string; created_at: string };
export type Volunteer = { id: string; name: string; email: string; role: string; message: string; created_at: string };
export type Feedback = { id: string; name: string; story_slug: string; message: string; created_at: string };

let localDatabase: DatabaseSync | undefined;
let remoteSchema: Promise<void> | undefined;

function localDb() {
  if (process.env.VERCEL) throw new Error("DATABASE_URL harus tersedia di Vercel; SQLite lokal tidak dapat dipakai untuk data persisten.");
  if (localDatabase) return localDatabase;
  const path = process.env.HAPAKAT_DB_PATH || join(process.cwd(), "storage", "hapakat.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path);
  database.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS listener_stories (id TEXT PRIMARY KEY, name TEXT NOT NULL, title TEXT NOT NULL, language TEXT NOT NULL, story TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS volunteers (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, name TEXT NOT NULL, story_slug TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
  `);
  localDatabase = database;
  return database;
}

function remoteDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  if (!remoteSchema) {
    remoteSchema = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS listener_stories (id TEXT PRIMARY KEY, name TEXT NOT NULL, title TEXT NOT NULL, language TEXT NOT NULL, story TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await sql`CREATE TABLE IF NOT EXISTS volunteers (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      await sql`CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, name TEXT NOT NULL, story_slug TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    })().catch((error) => { remoteSchema = undefined; throw error; });
  }
  return { sql, ready: remoteSchema };
}

export async function listListenerStories(): Promise<ListenerStory[]> {
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    return await remote.sql`SELECT id, name, title, language, story, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM listener_stories ORDER BY created_at DESC, id DESC` as ListenerStory[];
  }
  return localDb().prepare("SELECT id, name, title, language, story, created_at FROM listener_stories ORDER BY created_at DESC, rowid DESC").all() as ListenerStory[];
}

export async function addListenerStory(input: Omit<ListenerStory, "id" | "created_at">) {
  const id = randomUUID();
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    await remote.sql`INSERT INTO listener_stories (id, name, title, language, story) VALUES (${id}, ${input.name}, ${input.title}, ${input.language}, ${input.story})`;
  } else localDb().prepare("INSERT INTO listener_stories (id, name, title, language, story) VALUES (?, ?, ?, ?, ?)").run(id, input.name, input.title, input.language, input.story);
  return id;
}

export async function removeListenerStory(id: string) {
  const remote = remoteDb();
  if (remote) { await remote.ready; await remote.sql`DELETE FROM listener_stories WHERE id = ${id}`; }
  else localDb().prepare("DELETE FROM listener_stories WHERE id = ?").run(id);
}

export async function listVolunteers(): Promise<Volunteer[]> {
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    return await remote.sql`SELECT id, name, email, role, message, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM volunteers ORDER BY created_at DESC, id DESC` as Volunteer[];
  }
  return localDb().prepare("SELECT id, name, email, role, message, created_at FROM volunteers ORDER BY created_at DESC, rowid DESC").all() as Volunteer[];
}

export async function addVolunteer(input: Omit<Volunteer, "id" | "created_at">) {
  const id = randomUUID();
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    await remote.sql`INSERT INTO volunteers (id, name, email, role, message) VALUES (${id}, ${input.name}, ${input.email}, ${input.role}, ${input.message})`;
  } else localDb().prepare("INSERT INTO volunteers (id, name, email, role, message) VALUES (?, ?, ?, ?, ?)").run(id, input.name, input.email, input.role, input.message);
  return id;
}

export async function listFeedback(): Promise<Feedback[]> {
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    return await remote.sql`SELECT id, name, story_slug, message, to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM feedback ORDER BY created_at DESC, id DESC` as Feedback[];
  }
  return localDb().prepare("SELECT id, name, story_slug, message, created_at FROM feedback ORDER BY created_at DESC, rowid DESC").all() as Feedback[];
}

export async function addFeedback(input: Omit<Feedback, "id" | "created_at">) {
  const id = randomUUID();
  const remote = remoteDb();
  if (remote) {
    await remote.ready;
    await remote.sql`INSERT INTO feedback (id, name, story_slug, message) VALUES (${id}, ${input.name}, ${input.story_slug}, ${input.message})`;
  } else localDb().prepare("INSERT INTO feedback (id, name, story_slug, message) VALUES (?, ?, ?, ?)").run(id, input.name, input.story_slug, input.message);
  return id;
}

export async function removeFeedback(id: string) {
  const remote = remoteDb();
  if (remote) { await remote.ready; await remote.sql`DELETE FROM feedback WHERE id = ${id}`; }
  else localDb().prepare("DELETE FROM feedback WHERE id = ?").run(id);
}
