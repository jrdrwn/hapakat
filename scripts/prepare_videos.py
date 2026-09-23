"""Create web-sized MP4 copies of the nine source videos for ImageKit delivery."""

from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "AUDIOBOOK CERITA DAERAH"
OUTPUT = ROOT / "tmp" / "imagekit-videos"
VIDEOS = {
    "tulak-nyasap": SOURCE / "Tulak Nyasap.mp4",
    "tandik-bagagasa": SOURCE / "Tandik Bagagasa.mp4",
    "lomba-balanjaan": SOURCE / "Lomba Balanjaan .mp4",
    "dombi-je-bahalap-atei": SOURCE / "Gelombang 2" / "Video" / "Dombi je Bahalap Atei.mp4",
    "hi-nisa-pannai-ikamit": SOURCE / "Gelombang 2" / "Video" / "Hi Nisa Pannai Ikamit.mp4",
    "lanting-bara-batang-pisang": SOURCE / "Gelombang 2" / "Video" / "Lanting Bara Batang Pisang.mp4",
    "odon-tuntang-tingang": SOURCE / "Gelombang 2" / "Video" / "Odon tuntang Tingang.mp4",
    "pipet-purun": SOURCE / "Gelombang 2" / "Video" / "Pipet Purun Rumbun tuntang Rimbun (1).mp4",
    "pulau-borneoku": SOURCE / "Gelombang 2" / "Video" / "Pulau Borneoku je Tatau Haliai_.mp4",
}

OUTPUT.mkdir(parents=True, exist_ok=True)
for slug, source in VIDEOS.items():
    target = OUTPUT / f"{slug}.mp4"
    if target.exists() and target.stat().st_size > 0:
        print(f"skip {slug}: {target.stat().st_size / 1048576:.1f} MB", flush=True)
        continue
    print(f"encoding {slug}", flush=True)
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-vf", r"scale=trunc(min(960\,iw)/2)*2:-2,fps=24",
        "-c:v", "libx264", "-preset", "medium", "-crf", "27", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(target),
    ], check=True)
    print(f"ready {slug}: {target.stat().st_size / 1048576:.1f} MB", flush=True)
