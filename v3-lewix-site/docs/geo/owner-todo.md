# Owner to-do: lewix.ai GEO / AEO

## Decisions

- [ ] **Founders in schema.** The Organization lists Lewis and Noel as founders; Fakhrul's LinkedIn
      says Co-Founder and Director. Confirm the list and the three roles, and the Team section
      loses its "coming soon" line at the same time.
- [ ] **Training crawlers.** GPTBot, ClaudeBot, CCBot and Google-Extended are currently allowed.
      That is the right default for a company that wants to be known to models; say so if not.
- [ ] **Public repo.** Aphrosidiac/LewixWeb2 is public and its history holds client names and
      logos from before 2026-10-09. Make it private.
- [ ] **Deploy** this pass (pushed to GitHub first).

## Settings only you can change

- [ ] Cloudflare → Scrape Shield → Email Address Obfuscation: off for lewix.ai. It rewrites
      hello@lewix.ai so AI fetchers cannot read it.
- [ ] Google Search Console and Bing Webmaster Tools: verify lewix.ai, submit /sitemap.xml, and
      give access so later waves can read queries (BWT's AI grounding queries especially).

## To measure (no API keys here)

- [ ] Either add keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, PERPLEXITY_API_KEY,
      SERPAPI_API_KEY) or fill `visibility/manual-2026-10-09/manual.csv` from logged-out sessions,
      20 to 30 prompts per engine is enough for a first read.
- [ ] Name 5 to 15 competitors you lose deals to, with domains. Until then share of voice is
      measured against nobody.

## Needs a source before it can go on the site

- [ ] [NEEDS SOURCE] Any outcome figure for a client system (hours saved, errors cut, orders per
      day). The case pages carry only figures the repositories show.
- [ ] [NEEDS SOURCE] Typical project range above the RM 8,000 floor, if you want to publish one.
