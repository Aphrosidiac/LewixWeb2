# LEWIX brand assets

Consolidated from `~/Documents/LEWIX/LOGO`. Renamed by **what each file is for**,
because the original names didn't distinguish the mono variants from the ones that
keep the gradient (`-WHITE` and `-FOR DARK BACKGROUND` are different files).

## Brand gradient

Sampled from the logomark, top to bottom:

| stop | hex |
|---|---|
| cyan (top) | `#67E1F9` |
| blue (mid) | `#6880F2` |
| purple (bottom) | `#8151DF` |

```css
background: linear-gradient(180deg, #67E1F9 0%, #6880F2 55%, #8151DF 100%);
```

## Wordmark — full "LEWIX" lockup (8000 × 1276, ratio 6.27:1)

| file | what it is | use when |
|---|---|---|
| `lewix-wordmark-on-dark.png` | white letters + **gradient I** | **primary for this site** — any dark background |
| `lewix-wordmark-on-light.png` | black letters + **gradient I** | light backgrounds, invoices, light docs |
| `lewix-wordmark-mono-white.png` | entirely white, no gradient | over photos, video, or the brand gradient itself |
| `lewix-wordmark-mono-black.png` | entirely black, no gradient | single-colour print, faxes, stamps, embroidery |
| `lewix-wordmark-on-dark-1200w.png` | 1200px wide derivative | **what the site loads at small sizes** (header, hero) — the 8000px original is far too heavy |
| `lewix-wordmark-on-dark-2400w.png` | 2400px wide derivative | the footer sign-off, which spans the full content width; 1200w is visibly soft there on a 2x display |
| `lewix-wordmark-vector.pdf` | vector source | print, scaling beyond 1200px, converting to SVG |

## Logomark — the standalone stepped glyph (2228 × 4167, ratio 1:1.87)

This is the same shape that replaces the "I" in the wordmark.

| file | what it is | use when |
|---|---|---|
| `lewix-logomark-gradient.png` | full cyan→purple gradient | favicons, avatars, app icons, loaders |
| `lewix-logomark-mono-white.png` | solid white | over the brand gradient or busy imagery |
| `lewix-logomark-mono-black.png` | solid black | light backgrounds, single-colour contexts |
| `lewix-logomark-gradient-512.png` | 512px derivative | web/app icon use |
| `lewix-logomark-mono-white-512.png` | 512px derivative | small UI marks |
| `lewix-logomark-vector.pdf` | vector source | print, converting to SVG |

## Source files (not for web delivery)

| file | notes |
|---|---|
| `lewix-logo-master.ai` | Illustrator master. Editable original. |
| `lewix-brand-preview.jpg` | 8000×4500 brand board. Reference only — 1.6MB, never link it from a page. |

## Notes

- **No SVG exists yet.** The PDFs are the vector source; converting them to SVG would
  give crisp, tiny, recolourable marks and is worth doing before launch.
- The tagline on the brand board — *"A small team that ships big systems"* — is
  stronger and more specific than the current site's hero line. Worth considering.
- Nothing here is referenced from `public/` automatically; files in `public/` are
  served but not bundled, so the large source files cost nothing unless requested.
