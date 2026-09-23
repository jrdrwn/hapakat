"""Render PDF pages and derive page cues by matching frames in the supplied videos.

Requires ffmpeg, pdftoppm, Pillow and NumPy. Run from the repository root.
"""

from __future__ import annotations

import json
import sys
import subprocess
import tempfile
from itertools import groupby
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "data" / "AUDIOBOOK CERITA DAERAH"
OUTPUT = ROOT / "public" / "media" / "pages"
CUES = ROOT / "src" / "data" / "book-cues.json"
SOURCES = {
    "tulak-nyasap": (BASE / "Tulak Nyasap.mp4", BASE / "Gelombang 1" / "MAANYAN" / "Tulak Manyasap.pdf"),
    "tandik-bagagasa": (BASE / "Tandik Bagagasa.mp4", BASE / "Gelombang 1" / "BAKUMPAY" / "Tandik Bagagasa.pdf"),
    "lomba-balanjaan": (BASE / "Lomba Balanjaan .mp4", BASE / "Gelombang 1" / "BAKUMPAY" / "Lomba Balanjaan Mensei.pdf"),
    "dombi-je-bahalap-atei": (BASE / "Gelombang 2" / "Video" / "Dombi je Bahalap Atei.mp4", BASE / "Gelombang 2" / "Dombi je Bahalap Atei" / "Dombi je Bahalap Atei.pdf"),
    "hi-nisa-pannai-ikamit": (BASE / "Gelombang 2" / "Video" / "Hi Nisa Pannai Ikamit.mp4", BASE / "Gelombang 2" / "Hi Nisa Pannai Ikamit" / "hi nisa pannai ikamit.pdf"),
    "lanting-bara-batang-pisang": (BASE / "Gelombang 2" / "Video" / "Lanting Bara Batang Pisang.mp4", BASE / "Gelombang 2" / "Lanting Bara Batang Pisang" / "Lanting Bara Batang Pisang.pdf"),
    "odon-tuntang-tingang": (BASE / "Gelombang 2" / "Video" / "Odon tuntang Tingang.mp4", BASE / "Gelombang 2" / "Odon tuntang Tingang" / "Odon tuntang Tingang (Harry Wahyudi).pdf"),
    "pipet-purun": (BASE / "Gelombang 2" / "Video" / "Pipet Purun Rumbun tuntang Rimbun (1).mp4", BASE / "Gelombang 1" / "Revisi" / "Pipet Purun Rumbun tuntang Rimbun.pdf"),
    "pulau-borneoku": (BASE / "Gelombang 2" / "Video" / "Pulau Borneoku je Tatau Haliai_.mp4", BASE / "Gelombang 2" / "Pulau Borneoku je Tatau Haliai" / "Pulau Borneoku je Tatau Haliai (Valentina).pdf"),
}


def image_vector(path: Path) -> np.ndarray:
    with Image.open(path) as image:
        return np.asarray(image.convert("RGB").resize((96, 68)).filter(ImageFilter.GaussianBlur(1)), dtype=np.float32)


def page_cues(video: Path, pages: list[Path]) -> list[dict[str, int]]:
    with tempfile.TemporaryDirectory(prefix="hapakat-frames-") as scratch:
        prefix = Path(scratch) / "frame-%05d.jpg"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(video), "-vf", "fps=1,scale=240:-2", "-q:v", "5", str(prefix)], check=True)
        frames = sorted(Path(scratch).glob("frame-*.jpg"))
        page_vectors = np.stack([image_vector(page) for page in pages])
        matches: list[int] = []
        for frame in frames:
            vector = image_vector(frame)
            error = np.mean((page_vectors - vector) ** 2, axis=(1, 2, 3))
            matches.append(int(np.argmin(error)) + 1)

    # A crossfade can make one sampled frame resemble the adjacent page.
    for _ in range(2):
        smoothed = matches[:]
        for index in range(1, len(matches) - 1):
            if matches[index - 1] == matches[index + 1] != matches[index]:
                smoothed[index] = matches[index - 1]
        matches = smoothed

    cues: list[dict[str, int]] = []
    second = 0
    for page, run in groupby(matches):
        span = len(list(run))
        cues.append({"time": second, "page": page})
        second += span
    return cues


def ordered_cues(slug: str, cues: list[dict[str, int]], page_count: int) -> list[dict[str, int]]:
    """Discard visual false positives on two books with repeated white layouts.

    Pages in these videos advance in PDF order. Use reliable matches as anchors
    and interpolate a page when the low-resolution matcher misses it entirely.
    """
    starts = {"dombi-je-bahalap-atei": (6, 30), "hi-nisa-pannai-ikamit": (3, 15)}
    if slug not in starts:
        if slug == "pipet-purun":
            return [cue for cue in cues if not (cue["time"] == 5 and cue["page"] == 21)]
        return cues
    start_page, start_time = starts[slug]
    initial = [cue for cue in cues if cue["time"] < start_time and cue["page"] < start_page]
    if slug == "hi-nisa-pannai-ikamit":
        initial = [{"time": 0, "page": 1}, {"time": 11, "page": 2}]
    anchors = initial + [{"time": start_time, "page": start_page}]
    previous_time = start_time
    for page in range(start_page + 1, page_count + 1):
        match = next((cue for cue in cues if cue["page"] == page and cue["time"] > previous_time), None)
        if match:
            anchors.append(match)
            previous_time = match["time"]
    result = []
    for current, following in zip(anchors, anchors[1:]):
        result.append(current)
        missing = following["page"] - current["page"] - 1
        for offset in range(1, missing + 1):
            time = round(current["time"] + (following["time"] - current["time"]) * offset / (missing + 1))
            result.append({"time": time, "page": current["page"] + offset})
    result.append(anchors[-1])
    return result


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    CUES.parent.mkdir(parents=True, exist_ok=True)
    result = {}
    for slug, (video, pdf) in SOURCES.items():
        if not video.is_file() or not pdf.is_file():
            raise FileNotFoundError(f"Missing video or PDF for {slug}")
        directory = OUTPUT / slug
        directory.mkdir(parents=True, exist_ok=True)
        for old in directory.glob("page-*.jpg"):
            old.unlink()
        with tempfile.TemporaryDirectory(prefix="hapakat-pages-") as scratch:
            prefix = Path(scratch) / "page"
            subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=76", "-scale-to", "1300", str(pdf), str(prefix)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            pages = []
            for number, source in enumerate(sorted(Path(scratch).glob("page-*.jpg")), 1):
                target = directory / f"page-{number:03}.jpg"
                target.write_bytes(source.read_bytes())
                pages.append(target)
        cues = ordered_cues(slug, page_cues(video, pages), len(pages))
        result[slug] = {"pageCount": len(pages), "cues": cues}
        print(f"{slug}: {len(pages)} PDF pages, {len(cues)} video page cues", flush=True)
    CUES.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if "--repair-cues" in sys.argv:
        existing = json.loads(CUES.read_text(encoding="utf-8"))
        for slug, entry in existing.items():
            entry["cues"] = ordered_cues(slug, entry["cues"], entry["pageCount"])
        CUES.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    else:
        main()
