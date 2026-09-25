"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { audioFor, bookFor, coverFor, videoFor, type Story } from "@/lib/stories";

type Cue = { time: number; page: number };
type VideoFailure = {
  reason: string;
  code: number | null;
  message: string;
  networkState: number;
  readyState: number;
  source: string;
};
const mediaErrorLabels: Record<number, string> = {
  1: "Pemutaran dibatalkan",
  2: "Gangguan jaringan",
  3: "Video tidak dapat didekode",
  4: "Sumber atau format video tidak didukung",
};
function describeVideoFailure(video: HTMLVideoElement, reason: string, cause?: unknown): VideoFailure {
  return {
    reason,
    code: video.error?.code ?? null,
    message: video.error?.message || (cause instanceof Error ? `${cause.name}: ${cause.message}` : "Tidak ada pesan tambahan dari peramban."),
    networkState: video.networkState,
    readyState: video.readyState,
    source: video.currentSrc || video.src,
  };
}
function pageAt(cues: Cue[], seconds: number) {
  let left = 0, right = cues.length - 1;
  while (left < right) { const middle = Math.ceil((left + right) / 2); if (cues[middle].time <= seconds) left = middle; else right = middle - 1; }
  return cues[left]?.page || 1;
}
function formatTime(seconds: number) { return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`; }

export function StoryExperience({ story, pageCount, cues }: { story: Story; pageCount: number; cues: Cue[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState(0);
  const [source, setSource] = useState<"video" | "audio">("video");
  const [manualPage, setManualPage] = useState<number | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoRetrying, setVideoRetrying] = useState(false);
  const [videoFailure, setVideoFailure] = useState<VideoFailure | null>(null);
  const [showVideoError, setShowVideoError] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const page = manualPage ?? pageAt(cues, position);
  const pageImage = `/media/pages/${story.slug}/page-${String(page).padStart(3, "0")}.jpg`;

  useEffect(() => () => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
  }, []);

  function finishVideoRetry(failed: boolean, reason = "Video gagal dimuat.", cause?: unknown) {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    retryTimeoutRef.current = null;
    setVideoRetrying(false);
    setVideoFailed(failed);
    setVideoFailure(failed && videoRef.current ? describeVideoFailure(videoRef.current, reason, cause) : null);
    if (!failed) setShowVideoError(false);
  }

  function retryVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    setVideoFailed(false);
    setVideoRetrying(true);
    setVideoFailure(null);
    setShowVideoError(false);
    video.load();
    retryTimeoutRef.current = setTimeout(() => {
      if (video.paused) finishVideoRetry(true, "Video belum mulai setelah 15 detik.");
    }, 15000);
    void video.play().then(() => finishVideoRetry(false)).catch((error: unknown) => finishVideoRetry(true, "Pemutaran ditolak oleh peramban.", error));
  }

  function videoPlay() { audioRef.current?.pause(); setSource("video"); setPosition(videoRef.current?.currentTime || 0); }
  function audioPlay() { videoRef.current?.pause(); setSource("audio"); setPosition(audioRef.current?.currentTime || 0); }
  function changePage(next: number) { setManualPage(Math.min(Math.max(next, 1), pageCount)); }

  return <div className="story-experience">
    <div className="experience-heading"><div><span className="section-kicker">01 / TONTON CERITA</span><h2>Video buku audio</h2></div><p>Video utama dengan narasi dan halaman cerita.</p></div>
    <div className="video-frame"><video ref={videoRef} controls playsInline preload="metadata" poster={coverFor(story)} src={videoFor(story)} onPlay={videoPlay} onPlaying={() => finishVideoRetry(false)} onError={() => finishVideoRetry(true, "Peramban gagal memuat atau memutar video.")} onTimeUpdate={(event) => { if (source === "video") setPosition(event.currentTarget.currentTime); }} onSeeked={(event) => { audioRef.current?.pause(); setSource("video"); setPosition(event.currentTarget.currentTime); }} aria-label={`Video cerita ${story.title}`}>Peramban Anda tidak mendukung pemutaran video.</video></div>
    <div className="media-direct-link">{videoFailed && <span role="status">Video tidak berhasil dimuat di pemutar ini.</span>}{videoRetrying && <span role="status">Sedang mencoba memuat video…</span>}{videoFailed && <button className="media-retry-button" type="button" onClick={retryVideo}>Coba lagi</button>}{videoFailed && <button className="media-error-button" type="button" onClick={() => setShowVideoError((visible) => !visible)} aria-expanded={showVideoError} aria-controls="video-error-details">{showVideoError ? "Tutup error" : "Lihat error"}</button>}<a href={videoFor(story)} target="_blank" rel="noopener noreferrer">Buka video langsung <ArrowIcon direction="right" /></a></div>
    {videoFailed && videoFailure && <div className="video-error-details" id="video-error-details" role="region" aria-label="Rincian kesalahan video" hidden={!showVideoError}><strong>Rincian error video</strong><p>{videoFailure.reason}</p><dl><div><dt>Kode</dt><dd>{videoFailure.code === null ? "Tidak tersedia" : `${videoFailure.code} — ${mediaErrorLabels[videoFailure.code] || "Kesalahan tidak dikenal"}`}</dd></div><div><dt>Pesan peramban</dt><dd>{videoFailure.message}</dd></div><div><dt>Status jaringan / pemutar</dt><dd>{videoFailure.networkState} / {videoFailure.readyState}</dd></div><div><dt>Sumber video</dt><dd>{videoFailure.source}</dd></div></dl></div>}
    <div className="experience-lower"><section className="experience-audio" aria-label="Versi audio saja"><span className="section-kicker">02 / DENGARKAN SAJA</span><h2>Versi audio</h2><p>Ingin fokus mendengar? Putar audio tanpa gambar. Video akan berhenti otomatis.</p><audio ref={audioRef} controls preload="metadata" src={audioFor(story)} onPlay={audioPlay} onError={() => setAudioFailed(true)} onTimeUpdate={(event) => { if (source === "audio") setPosition(event.currentTarget.currentTime); }} onSeeked={(event) => { videoRef.current?.pause(); setSource("audio"); setPosition(event.currentTarget.currentTime); }} aria-label={`Audio cerita ${story.title}`} /><div className="media-direct-link">{audioFailed && <span role="status">Audio tidak berhasil dimuat di pemutar ini.</span>}<a href={audioFor(story)} target="_blank" rel="noopener noreferrer">Buka audio langsung <ArrowIcon direction="right" /></a></div><div className="audio-source-note">Halaman buku mengikuti {source === "video" ? "video" : "audio"} pada {formatTime(position)}.</div></section>
      <section className="experience-book" aria-label="Buku PDF yang mengikuti narasi"><div className="book-live-heading"><div><span className="section-kicker">03 / BACA BUKU</span><h2>Halaman PDF</h2></div><span className="page-indicator">{page} / {pageCount}</span></div><div className="book-page-image"><Image src={pageImage} alt={`Halaman ${page} dari buku ${story.title}`} width={1300} height={900} sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="book-page-controls"><button type="button" onClick={() => changePage(page - 1)} disabled={page <= 1} aria-label="Halaman sebelumnya"><ArrowIcon direction="left" /></button><span>Halaman {page}</span><button type="button" onClick={() => changePage(page + 1)} disabled={page >= pageCount} aria-label="Halaman berikutnya"><ArrowIcon direction="right" /></button></div><div className="book-follow-actions"><button type="button" className={manualPage === null ? "follow-button active" : "follow-button"} onClick={() => setManualPage(null)} aria-pressed={manualPage === null}>◎ Ikuti narasi</button><a className="book-link" href={bookFor(story)} target="_blank" rel="noopener noreferrer">Buka PDF lengkap <ArrowIcon /></a></div><p className="book-sync-note">Halaman berganti mengikuti waktu video atau audio. Anda juga bisa membuka halaman lain secara manual.</p></section></div>
  </div>;
}
