# GEO / AEO / SEO audit — https://lewix.ai

Run 2026-10-09 01:21 · 16 pages sampled of 96 in sitemaps · raw HTML only (no JavaScript)

Scores are a triage aid for ordering work, not a KPI. The KPI is measured citation/mention rate (ai_visibility.py).

| Area | Score |
|---|---|
| AI crawler access | 100 |
| Rendering (raw HTML) | 100 |
| Indexability & canonicals | 100 |
| Structured data & entity | 57 |
| Content extractability (AEO) | 96 |
| Trust & E-E-A-T signals | 96 |
| Delivery & performance | 94 |
| Agent operability | 100 |
| International | 100 |
| **Overall** | **79** |

Overall is capped at 49 while any critical finding exists and at 79 while any high finding exists.

## AI crawler access (robots.txt, path `/`)

| Crawler | Purpose | Named in robots.txt | Allowed | Deciding rule |
|---|---|---|---|---|
| Googlebot | search | no | ✅ | `Allow: /` |
| Google-Extended | control | no | ✅ | `Allow: /` |
| Bingbot | search | no | ✅ | `Allow: /` |
| OAI-SearchBot | search | no | ✅ | `Allow: /` |
| ChatGPT-User | user | no | ✅ | `Allow: /` |
| GPTBot | training | no | ✅ | `Allow: /` |
| Claude-SearchBot | search | no | ✅ | `Allow: /` |
| Claude-User | user | no | ✅ | `Allow: /` |
| ClaudeBot | training | no | ✅ | `Allow: /` |
| PerplexityBot | search | no | ✅ | `Allow: /` |
| Perplexity-User | user | no | ✅ | `Allow: /` |
| Applebot | search | no | ✅ | `Allow: /` |
| Applebot-Extended | control | no | ✅ | `Allow: /` |
| meta-webindexer | search | no | ✅ | `Allow: /` |

robots.txt is only the first gate: a CDN/WAF can still 403 these bots. Run `bot_access.py`.

## Findings

### HIGH

- **[Structured data & entity]** Offer is missing required 'price' — 16 page(s): https://lewix.ai, https://lewix.ai/contact, https://lewix.ai/about …
- **[Structured data & entity]** Offer is missing required 'priceCurrency' — 16 page(s): https://lewix.ai, https://lewix.ai/contact, https://lewix.ai/about …
- **[Delivery & performance]** Server response 20111 ms; AI user-fetchers work under tight timeouts — 5 page(s): https://lewix.ai/work/label-printing-erp, https://lewix.ai/work/racking-quotation-engine, https://lewix.ai/work/workshop-management …
  - Fix: Cache HTML at the edge / SSG

### MEDIUM

- **[Content extractability (AEO)]** 1 run(s) of text split into single-character elements — text extractors read 'S M O O T H' — 2 page(s): https://lewix.ai, https://lewix.ai/contact
  - Fix: Keep real words in the server HTML; split letters at runtime in JS (after load) for the animation

### LOW

- **[Structured data & entity]** WebSite could add: alternateName — 16 page(s): https://lewix.ai, https://lewix.ai/contact, https://lewix.ai/about …
- **[Trust & E-E-A-T signals]** Email address hidden from crawlers by Cloudflare Email Obfuscation — live AI fetchers can't read the contact email — 16 page(s): https://lewix.ai, https://lewix.ai/contact, https://lewix.ai/about …
  - Fix: Turn off Email Obfuscation (Scrape Shield) or also show the address as plain text on the Contact/About page
- **[Content extractability (AEO)]** Missing og:title/og:image (link previews in chat apps and some AI surfaces use them) — 15 page(s): https://lewix.ai/contact, https://lewix.ai/about, https://lewix.ai/services …
- **[Content extractability (AEO)]** Title is 86 chars; Google truncates/rewrites past ~60 — 7 page(s): https://lewix.ai/work/racking-quotation-engine, https://lewix.ai/work/flexible-packaging-mes, https://lewix.ai/work/produce-supply-delivery …
- **[Structured data & entity]** No BreadcrumbList — 5 page(s): https://lewix.ai/contact, https://lewix.ai/about, https://lewix.ai/services …
- **[Trust & E-E-A-T signals]** No Privacy policy page linked from the sampled pages — trust pages are how engines and people verify who is behind a site — 1 page(s): https://lewix.ai
- **[Content extractability (AEO)]** No question-phrased headings; answer engines match sub-queries to headings — 1 page(s): https://lewix.ai
  - Fix: Phrase key H2/H3s as the questions buyers ask
- **[Content extractability (AEO)]** Title is only 13 chars: 'About · LEWIX' — 1 page(s): https://lewix.ai/about
- **[Content extractability (AEO)]** Title is only 12 chars: 'Work · LEWIX' — 1 page(s): https://lewix.ai/work

## Pages

| URL | Type | Status | Words | H2/H3 | Schema | Q-heads | Author | Dates | Issues |
|---|---|---|---|---|---|---|---|---|---|
| https://lewix.ai | home | 200 | 1038 | 15 | Organization, WebSite | 0 | ✓ |  | 6 |
| https://lewix.ai/contact | contact | 200 | 341 | 4 | FAQPage, Organization, WebSite | 1 | ✓ |  | 7 |
| https://lewix.ai/about | about | 200 | 484 | 5 | Organization, WebSite | 2 | ✓ |  | 7 |
| https://lewix.ai/services | service | 200 | 314 | 11 | Organization, WebSite | 1 | ✓ |  | 6 |
| https://lewix.ai/work | page | 200 | 594 | 5 | Organization, WebSite | 1 | ✓ |  | 7 |
| https://lewix.ai/work/label-printing-erp | page | 200 | 355 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 6 |
| https://lewix.ai/work/racking-quotation-engine | page | 200 | 256 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 7 |
| https://lewix.ai/work/flexible-packaging-mes | page | 200 | 258 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 6 |
| https://lewix.ai/work/produce-supply-delivery | page | 200 | 276 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 6 |
| https://lewix.ai/work/distribution-fleet | page | 200 | 262 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 5 |
| https://lewix.ai/work/workshop-management | page | 200 | 277 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 7 |
| https://lewix.ai/work/consumer-goods-commerce | page | 200 | 272 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 7 |
| https://lewix.ai/work/packaging-supplies-mis | page | 200 | 270 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 5 |
| https://lewix.ai/work/furniture-retail-back-office | page | 200 | 281 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 6 |
| https://lewix.ai/work/pet-retail-platform | page | 200 | 213 | 4 | BreadcrumbList, CreativeWork, Organization, WebSite | 2 | ✓ |  | 6 |
| https://lewix.ai/privacy | utility | 200 | 595 | 7 | Organization, WebSite | 2 | ✓ | ✓ | 7 |

## Site facts

- home_final: `"https://lewix.ai"`
- http_redirect: `{"status_chain": [301], "final": "https://lewix.ai/"}`
- alt_host: `{"host": "www.lewix.ai", "status": 200, "final": "https://lewix.ai", "error": ""}`
- soft404_status: `404`
- markdown_negotiation: `false`
- llms.txt: `{"status": 200, "content_type": "text/plain; charset=utf-8", "bytes": 8827, "h1": true, "links": 22}`
- llms-full.txt: `{"status": 404, "content_type": "text/html; charset=utf-8", "bytes": 27025}`
- sitemap_url_count: `96`

## Not measured here

- JavaScript-rendered content → `node scripts/render_diff.mjs <url>`
- CDN/WAF blocking of AI bots → `python3 scripts/bot_access.py <url>`
- Core Web Vitals field data → PageSpeed Insights / CrUX (references/seo-foundations.md)
- What AI engines actually say about the brand → `python3 scripts/ai_visibility.py`
- Off-site authority (mentions, reviews, Wikipedia/Wikidata, Reddit, YouTube) → references/offsite-authority.md
