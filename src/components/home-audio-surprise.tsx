"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { ScrambleText } from "@/components/scramble-text";
import { audioFor, coverFor, stories, type Story } from "@/lib/stories";

export function HomeAudioSurprise() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selected, setSelected] = useState<Story | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    setError("");
    setLoading(true);
    try { await audio.play(); }
    catch { setLoading(false); setError("Audio belum bisa diputar. Coba sekali lagi."); }
  }

  function surprise() {
    const choices = stories.filter((story) => story.slug !== selected?.slug);
    const next = choices[Math.floor(Math.random() * choices.length)];
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = audioFor(next);
    audio.currentTime = 0;
    setSelected(next);
    void play();
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else audio.pause();
  }

  return <div className="home-audio-surprise">
    <audio ref={audioRef} preload="none" onPlaying={() => { setPlaying(true); setLoading(false); }} onWaiting={() => setLoading(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setLoading(false); setPlaying(false); setError("Audio tidak tersedia saat ini."); }} />
    <div className="surprise-intro"><span className={`surprise-sound-mark ${playing ? "is-playing" : ""}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 10v4M7.5 6v12M12 3v18M16.5 7v10M21 10v4" /></svg></span><div><strong><ScrambleText delay={900} text="Psst, ada suara tersembunyi." /></strong><span><ScrambleText delay={1000} text="Dengarkan satu cerita pilihan acak." /></span></div></div>
    <button className="surprise-random" type="button" onClick={surprise}><ScrambleText delay={1050} text={selected ? "Acak lagi" : "Putar cerita acak"} /><ArrowIcon direction="right" /></button>
    {selected && <div className="surprise-result" aria-live="polite"><Image src={coverFor(selected)} alt="" width={76} height={54} /><div className="surprise-story"><span><ScrambleText text={selected.language} /></span><strong><ScrambleText text={selected.title} /></strong><Link href={`/galeri/${selected.slug}`}><ScrambleText text="Buka cerita lengkap" /> <ArrowIcon /></Link></div><button className="surprise-play" type="button" onClick={toggle} aria-label={playing ? `Jeda audio ${selected.title}` : `Putar audio ${selected.title}`} disabled={loading}>{loading ? <span className="surprise-spinner" /> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{playing ? <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></> : <path d="M7 4.8a1 1 0 0 1 1.55-.84l11 7.2a1 1 0 0 1 0 1.68l-11 7.2A1 1 0 0 1 7 19.2V4.8Z" />}</svg>}</button></div>}
    {error && <p className="surprise-error" role="status">{error}</p>}
  </div>;
}
