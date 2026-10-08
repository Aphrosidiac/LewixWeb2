# GEO / AEO plan: lewix.ai

Order matters: later tiers are worthless while earlier ones fail. Evidence tags refer to the
geo-aeo skill's `references/evidence.md`.

## Done in this pass (2026-10-09)

| Tier | Change | Why | Verified by |
|---|---|---|---|
| P1 | Organization offer as AggregateOffer, lowPrice 8000 MYR | Valid offer, honest "from" price | audit.py: high cleared |
| P1 | WebSite alternateName (Lewix AI, Lewix.ai) | One entity, three spellings in the wild | audit.py |
| P1 | BreadcrumbList on about, services, contact, work | Path context in results | built HTML |
| P2 | Full share card per page (og:image, site name, locale, twitter) | Link previews in chat apps and AI surfaces | built HTML, all 16 pages |
| P2 | Titles: case pages 86 to about 45 chars; thin titles given substance | Titles were cut or empty of meaning | built HTML |
| P2 | Loader and contact counters drawn by CSS | Extractors read "0123456789" first | audit.py: medium cleared |
| P2 | Privacy linked from home | Trust pages reachable from the root | built HTML |
| P3 | /pricing 308 to /contact | The URL buyers and agents guess | curl |
| P0–P3 | Earlier today: ten anonymous client systems with their own pages, products, schema without client names | Coverage of the category and its sub-questions | confidential-scan.sh |

## Next, in order

| Tier | What | Who | Effort |
|---|---|---|---|
| P0 | Turn off Cloudflare Email Obfuscation for lewix.ai | Owner | 1 min |
| P1 | Add Fakhrul to the Organization `founder` list (schema lists Lewis and Noel only) once roles are confirmed, and fill the Team roles on the page | Owner decision, then agent | 15 min |
| P1 | Claim and align profiles: Google Business Profile, Bing Places, LinkedIn company page, using the exact legal name, SSM number and address on /about | Owner | 1 h |
| P3 | One page per buyer problem the case studies prove: manufacturing systems, delivery and fleet systems, SQL Account and AutoCount integration. Each answers its question first, links its case studies. Only claims the work supports | Agent, owner reviews | 1 day |
| P3 | A "custom system vs off-the-shelf ERP" comparison page written from what the projects replaced | Agent, owner reviews | half day |
| P3 | Bahasa Malaysia versions of home, services and contact in colloquial Malaysian BM | Agent, owner reviews | 1 day |
| P5 | Markdown negotiation (`Accept: text/markdown`) for the company pages, as Horizon already does | Agent | 2 h |
| P6 | Off-site: see offsite-plan.md. The site has zero Common Crawl captures and no Wayback history; links from known sites are the bottleneck now, not on-page work | Owner | ongoing |
| P7 | Run the manual sample (visibility/manual-2026-10-09) or add API keys, then re-measure every 3 to 4 weeks on the frozen prompt set | Owner, then agent | 2 h per wave |

## Deliberately not doing

- FAQ schema for rich results: Google no longer shows them for this kind of site. The existing
  FAQPage on /contact stays because it mirrors visible text and costs nothing.
- Treating llms.txt as a lever. It exists, it is accurate, it is not why anyone will be cited.
- City doorway pages (JB, Penang, Selangor). Prompts p046 to p048 measure those queries; a page
  per city with no local presence behind it is a spam pattern.
- Rewriting the home page around question headings. The numbered sections are the design, and
  the question-shaped answers live on /services, /about, /contact and the case pages.
- Naming clients anywhere, including structured data, alt text and llms.txt.

## Intervention log

| Date | Commit | Change |
|---|---|---|
| 2026-10-09 | 703b8ca | Ten anonymous client systems, products, client name removed from schema |
| 2026-10-09 | (this pass) | Share cards, titles, breadcrumbs, offer, alternateName, /pricing, counters |
