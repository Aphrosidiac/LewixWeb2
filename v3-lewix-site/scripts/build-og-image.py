#!/usr/bin/env python3
"""
Generates the Open Graph / Twitter card image at src/app/opengraph-image.png.

Run by hand, not at build time. The output is committed, so the deploy has no
network dependency and no build step that can fail on the droplet:

    python3 scripts/build-og-image.py

Fonts are the two brand faces (Figtree for the headline, Urbanist for body,
per LewixSocials/03-Quick-Reference/brand-cheatsheet.md). Both are variable
Google Fonts; the script fetches them to a temp dir rather than vendoring
80KB of font binary into the repo for a script that runs once a year.

The card is deliberately plain: wordmark, tagline, gradient rule, url. A
share card is read at thumbnail size in a chat window, so anything smaller
than about 28px of type is decoration, not information.
"""

import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

# 1200x630 is the size every scraper crops to. Anything else gets letterboxed.
W, H = 1200, 630

# From the brand cheatsheet.
DEEP_NIGHT = (9, 9, 12)
DEEP_PURPLE = (129, 81, 223)
HORIZON_BLUE = (104, 128, 242)
CYBER_BLUE = (103, 225, 249)
FG = (245, 245, 247)
FG_MUTED = (150, 150, 160)

FONTS = {
    "figtree": "https://github.com/google/fonts/raw/main/ofl/figtree/Figtree%5Bwght%5D.ttf",
    "urbanist": "https://github.com/google/fonts/raw/main/ofl/urbanist/Urbanist%5Bwght%5D.ttf",
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDMARK = os.path.join(ROOT, "public", "brand", "lewix-wordmark-on-dark-2400w.png")
OUT = os.path.join(ROOT, "src", "app", "opengraph-image.png")
OUT_TWITTER = os.path.join(ROOT, "src", "app", "twitter-image.png")


def fetch_fonts(tmp):
    paths = {}
    for name, url in FONTS.items():
        dest = os.path.join(tmp, f"{name}.ttf")
        subprocess.run(["curl", "-sL", "-o", dest, url], check=True)
        if not os.path.getsize(dest):
            sys.exit(f"font download failed: {name}")
        paths[name] = dest
    return paths


def weighted(path, size, weight):
    """Variable fonts default to their lightest axis value; set it explicitly."""
    font = ImageFont.truetype(path, size)
    font.set_variation_by_axes([weight])
    return font


def gradient_rule(width, height):
    """The purple to blue to cyan ramp from the logomark, as a flat bar."""
    bar = Image.new("RGB", (width, 1))
    px = bar.load()
    stops = [(0.0, DEEP_PURPLE), (0.5, HORIZON_BLUE), (1.0, CYBER_BLUE)]
    for x in range(width):
        t = x / max(width - 1, 1)
        for i in range(len(stops) - 1):
            t0, c0 = stops[i]
            t1, c1 = stops[i + 1]
            if t0 <= t <= t1:
                local = (t - t0) / (t1 - t0)
                px[x, 0] = tuple(
                    round(c0[c] + (c1[c] - c0[c]) * local) for c in range(3)
                )
                break
    return bar.resize((width, height), Image.NEAREST)


def main():
    with tempfile.TemporaryDirectory() as tmp:
        fonts = fetch_fonts(tmp)

        card = Image.new("RGB", (W, H), DEEP_NIGHT)
        draw = ImageDraw.Draw(card)

        margin = 84

        # Wordmark, scaled to a fixed width so the lockup lands the same way
        # regardless of what the source asset's dimensions happen to be.
        mark = Image.open(WORDMARK).convert("RGBA")
        target_w = 420
        mark = mark.resize(
            (target_w, round(mark.height * target_w / mark.width)), Image.LANCZOS
        )
        card.paste(mark, (margin, margin), mark)

        y = margin + mark.height + 76

        # Tagline. The locked line from bio-copy.md.
        headline = weighted(fonts["figtree"], 68, 700)
        draw.text((margin, y), "Transcending the Industry", font=headline, fill=FG)
        y += 96

        body = weighted(fonts["urbanist"], 31, 400)
        for line in [
            "Custom ERPs, logistics platforms and AI agents",
            "for Malaysian businesses. Production, not prototypes.",
        ]:
            draw.text((margin, y), line, font=body, fill=FG_MUTED)
            y += 44

        # Gradient rule above the footer line, full bleed to the right margin.
        rule_y = H - margin - 58
        card.paste(gradient_rule(W - margin * 2, 3), (margin, rule_y))

        foot = weighted(fonts["urbanist"], 26, 500)
        draw.text((margin, rule_y + 22), "lewix.ai", font=foot, fill=FG)

        foot_right = weighted(fonts["urbanist"], 26, 400)
        right_text = "Kuala Lumpur, Malaysia"
        rw = draw.textlength(right_text, font=foot_right)
        draw.text((W - margin - rw, rule_y + 22), right_text, font=foot_right, fill=FG_MUTED)

        card.save(OUT, "PNG", optimize=True)
        card.save(OUT_TWITTER, "PNG", optimize=True)
        for path in (OUT, OUT_TWITTER):
            print(f"wrote {path} ({os.path.getsize(path) // 1024}KB)")


if __name__ == "__main__":
    main()
