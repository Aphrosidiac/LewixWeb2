# GEO / AEO baseline: lewix.ai

Measured 2026-10-09 against the live site at commit 523c2b7. Scope is the company site only
(16 sitemap URLs); `/horizon` is a separate app and out of scope.

## Scores (audit.py, raw HTML, 16 URLs)

| Area | Score |
|---|---|
| AI crawler access | 100 |
| Rendering (raw HTML) | 100 |
| Indexability & canonicals | 100 |
| Structured data & entity | 57 |
| Content extractability | 96 |
| Trust & E-E-A-T | 96 |
| Delivery & performance | 94 |
| Agent operability | 100 |
| International | 100 |
| **Overall** | **79** (capped by high findings) |

Full report: `audit/audit.md`.

## Access (measured)

- robots.txt allows every search, user and training crawler (Googlebot, Bingbot, OAI-SearchBot,
  ChatGPT-User, GPTBot, Claude-SearchBot/User, ClaudeBot, PerplexityBot, Applebot, meta).
- `bot_access.py` on /, /work and a case page: every AI user-agent gets 200 and byte-identical
  content to a browser. No Cloudflare challenge, no UA switching.
- `render_diff.mjs`: 0 to 0.7% of words need JavaScript. Server HTML carries the content.

## Findings at baseline

| Severity | Finding | Status |
|---|---|---|
| High | Offer schema missing `price`/`priceCurrency` (16 pages) | Fixed: AggregateOffer, lowPrice 8000 MYR |
| High | TTFB 20 s on 5 case pages | Not reproduced: 64 fetches incl. 8 parallel all < 0.6 s. Cold start minutes after the 523c2b7 restart |
| Medium | Loader digit reels read as "0123456789" text (home, contact) | Fixed: digits drawn by CSS from `data-digit` |
| Low | og:image / og:site_name / og:locale missing on 15 pages; twitter:* inherited the home tagline | Fixed: `src/lib/shareCard.ts` |
| Low | Case-page titles 86 chars | Fixed: `<System> · Case study` |
| Low | About and Work titles 12 to 13 chars, Services 17 | Fixed |
| Low | No BreadcrumbList on about, services, contact, work | Fixed |
| Low | Home has no link to Privacy | Fixed: footer link |
| Low | WebSite has no alternateName | Fixed: Lewix AI, Lewix.ai |
| Low | Cloudflare Email Obfuscation hides hello@lewix.ai from fetchers | Owner: Cloudflare toggle (owner-todo) |
| Low | Home has no question-phrased headings | Deliberate: numbered section titles are the design; services, about, contact and case pages carry the question headings |
| Info | `/pricing` 404 | Fixed: 308 to /contact, which holds the price |

## Off-site presence (measured, presence.py)

- Common Crawl, last three indexes (2026-30, -34, -39): **0 captures**.
- Wayback Machine: **no captures**.

## AI visibility

**Not measured.** No engine API keys on this machine, and logged-out UI sessions were not run.
A 50-prompt set (`prompts_v1.csv`, EN and BM) and a fill-in sheet for ChatGPT, Perplexity,
Gemini and AI Mode are in `visibility/manual-2026-10-09/`.

## Not measured

Core Web Vitals field data (no CrUX for a site this new), server logs, GSC, Bing Webmaster
Tools, GA4. See owner-todo.md.
