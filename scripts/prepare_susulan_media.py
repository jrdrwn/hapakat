"""Build compact books, covers, and audio for the two Gelombang 1 stories.

Run after prepare_story_media.py has rendered their pages.
"""

from pathlib import Path
import subprocess

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
VIDEOS = ROOT / "data" / "Gelombang 1 Susulan" / "Video"
SOURCES = {
    "gunter-hi-undrang": VIDEOS / "Gunter hi Undrang.mp4",
    "tingang-tuntang-tanteluhe": VIDEOS / "Tingang tuntang Tenteluhe.mp4",
}

for slug, video in SOURCES.items():
    pages = sorted((MEDIA / "pages" / slug).glob("page-*.jpg"))
    if not pages:
        raise FileNotFoundError(f"Rendered pages are missing for {slug}")

    cover = MEDIA / "covers" / f"{slug}.jpg"
    with Image.open(pages[0]) as source:
        image = source.convert("RGB")
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        image.save(cover, "JPEG", quality=84, optimize=True, progressive=True)

    book = MEDIA / "books" / f"{slug}.pdf"
    images = []
    try:
        for page in pages:
            with Image.open(page) as source:
                images.append(source.convert("RGB"))
        images[0].save(book, "PDF", save_all=True, append_images=images[1:], resolution=110, title=slug)
    finally:
        for image in images:
            image.close()

    audio = MEDIA / "audio" / f"{slug}.mp3"
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video),
        "-vn", "-c:a", "libmp3lame", "-b:a", "56k", "-ar", "22050", "-ac", "1", str(audio),
    ], check=True)
    print(f"{slug}: {len(pages)} pages, book {book.stat().st_size / 1048576:.1f} MB, audio {audio.stat().st_size / 1048576:.1f} MB", flush=True)
