"""Build static 1200x630 social preview images from Hapakat's existing artwork."""

from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "public" / "media"
OUTPUT = MEDIA / "social"
OUTPUT.mkdir(parents=True, exist_ok=True)

FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")
FONT_REGULAR = Path("C:/Windows/Fonts/arial.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default(size=size)


def wrapped_lines(draw: ImageDraw.ImageDraw, text: str, chosen_font, max_width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        candidate = f"{line} {word}".strip()
        if line and draw.textlength(candidate, font=chosen_font) > max_width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def paste_logo(canvas: Image.Image, box: tuple[int, int, int, int]) -> None:
    logo = Image.open(MEDIA / "logo-hapakat.png").convert("RGBA")
    logo.thumbnail((box[2], box[3]), Image.Resampling.LANCZOS)
    canvas.paste(logo, (box[0], box[1]), logo)


def save(canvas: Image.Image, name: str) -> None:
    canvas.convert("RGB").save(OUTPUT / name, "JPEG", quality=88, optimize=True, progressive=True)


hero = Image.open(MEDIA / "heritage" / "hero-performance.webp").convert("RGB")
hero = ImageOps.fit(hero, (1200, 630), method=Image.Resampling.LANCZOS, centering=(.55, .45))
canvas = hero.copy()
overlay = Image.new("RGBA", canvas.size)
pixels = overlay.load()
for x in range(1200):
    alpha = int(243 - 107 * x / 1199)
    for y in range(630):
        pixels[x, y] = (32, 22, 16, alpha)
canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)
draw = ImageDraw.Draw(canvas)
paste_logo(canvas, (62, 45, 300, 112))
draw.text((65, 214), "CERITA RAKYAT KALIMANTAN TENGAH", font=font(22, True), fill="#FFAD57")
draw.text((61, 265), "Setiap cerita punya suara.", font=font(57, True), fill="#FFF9F0")
draw.text((61, 337), "Setiap suara menjaga bahasa.", font=font(51, True), fill="#FFAA51")
draw.rounded_rectangle((63, 506, 590, 508), radius=1, fill="#F79431")
draw.text((64, 530), "DAYAK NGAJU  ·  MAANYAN  ·  BAKUMPAY", font=font(21, True), fill="#FFF0DD")
save(canvas, "hapakat.jpg")

source = (ROOT / "src" / "lib" / "stories.ts").read_text(encoding="utf-8")
stories = [
    {"slug": slug, "title": title, "subtitle": subtitle, "language": language}
    for slug, title, subtitle, language in re.findall(
        r'\{ slug: "([^"]+)", title: "([^"]+)", subtitle: "([^"]+)", language: "([^"]+)"', source
    )
]
if len(stories) != 9:
    raise RuntimeError(f"Expected 9 stories, found {len(stories)}")
for story in stories:
    canvas = Image.new("RGB", (1200, 630), "#251B15")
    draw = ImageDraw.Draw(canvas)
    cover = Image.open(MEDIA / "covers" / f"{story['slug']}.jpg").convert("RGB")
    cover = ImageOps.fit(cover, (630, 444), method=Image.Resampling.LANCZOS)
    canvas.paste(cover, (45, 91))
    draw.rectangle((45, 91, 675, 535), outline="#F6A348", width=5)
    paste_logo(canvas, (720, 43, 245, 95))
    draw.text((722, 169), story["language"].upper(), font=font(22, True), fill="#F6A348")
    title_font = font(47 if len(story["title"]) < 30 else 41, True)
    lines = wrapped_lines(draw, story["title"], title_font, 422)
    y = 218
    for line in lines:
        draw.text((718, y), line, font=title_font, fill="#FFF9F0")
        y += title_font.size * 1.22
    subtitle_font = font(27)
    subtitle_lines = wrapped_lines(draw, story["subtitle"], subtitle_font, 422)
    y = max(y + 16, 417)
    for line in subtitle_lines:
        draw.text((722, y), line, font=subtitle_font, fill="#E4D4C3")
        y += 34
    draw.rectangle((720, 551, 1135, 553), fill="#8E5B38")
    draw.text((722, 569), "TONTON  ·  DENGARKAN  ·  BACA", font=font(18, True), fill="#F6A348")
    save(canvas, f"{story['slug']}.jpg")
print(f"Created {len(stories) + 1} social previews in {OUTPUT}")
