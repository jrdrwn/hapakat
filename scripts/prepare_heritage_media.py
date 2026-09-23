"""Create small, web-ready copies of the curated photos in data/."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "heritage"
SOURCES = {
    "hero-performance": "Latar Web/DSC08926.jpg",
    "gallery-performance": "Latar Web/DSC07314.jpg",
    "artisan": "Latar Web/DSC07696.jpg",
    "parade": "Latar Web/DSC04896.jpg",
    "campus-outreach": "DOKUMENTASI IMPLEMENTASI KRIDA/PKKMB FKIP/97dfa514-31b2-41f4-b0c6-0e32eff07d3c.jpg",
    "kotawaringin-class": "DOKUMENTASI IMPLEMENTASI KRIDA/SD KOTAWARINGIN BARAT/58a8fda7-5e81-49b0-86e7-0ff368156982.jpg",
    "sd-percobaan": "DOKUMENTASI IMPLEMENTASI KRIDA/SD PERCOBAAN/IMG_6038.JPG",
    "sungai-melawen": "DOKUMENTASI IMPLEMENTASI KRIDA/SDN 1 Sungai Melawen/IMG_6198.PNG",
    "skh-palangka-raya": "DOKUMENTASI IMPLEMENTASI KRIDA/SKH NEGERI 1 PALANGKA RAYA/IMG_5393.JPG",
    "smk-maharati": "DOKUMENTASI IMPLEMENTASI KRIDA/SMK Maharati/199bbae0-a9a5-40c5-8abb-214e055af248.jpg",
    "hapakat-lama-utama": "Screenshots Hapakat/Screenshot (1082).png",
    "hapakat-lama-galeri": "Screenshots Hapakat/Screenshot (1088).png",
    "hapakat-lama-sukarelawan": "Screenshots Hapakat/Screenshot (1089).png",
    "hapakat-lama-tentang": "Screenshots Hapakat/Screenshot (1161).png",
    "volunteer-poster-2025": "Elemen/Poster (3).png",
}

OUT.mkdir(parents=True, exist_ok=True)
for name, relative in SOURCES.items():
    with Image.open(ROOT / "data" / relative) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        image.thumbnail((1800, 1350), Image.Resampling.LANCZOS)
        target = OUT / f"{name}.webp"
        image.save(target, "WEBP", quality=80, method=6)
        print(f"{name}: {image.width}x{image.height}, {target.stat().st_size // 1024} KB")

# The historical language map is a screenshot. Remove only the browser frame.
with Image.open(ROOT / "data" / "Elemen" / "Screenshot (1076).png") as source:
    image = source.convert("RGB").crop((0, 30, 1850, 1050))
    image.thumbnail((1800, 1350), Image.Resampling.LANCZOS)
    image.save(OUT / "language-map.webp", "WEBP", quality=82, method=6)

# Keep transparency for the logo variants and the ornamental H.
for name, source in {
    "logo-tagline": "Elemen/Logo HAPAKAT (4).png",
    "ornament-h": "Elemen/Salinan dari Logo HAPAKAT.png",
}.items():
    with Image.open(ROOT / "data" / source) as image:
        image.save(OUT / f"{name}.webp", "WEBP", quality=90, method=6)
