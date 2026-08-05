import type { MetadataRoute } from 'next';

import { site } from '@/content';

/**
 * lewix.ai/robots.txt
 *
 * The origin never served one. What is live today is generated entirely by
 * Cloudflare's managed robots.txt feature, which is why it carries a
 * `Content-Signal` header and a block of AI-crawler `Disallow` rules that
 * exist in no file in this repo.
 *
 * That managed block is fine and is left alone: it disallows training
 * crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider and
 * friends) while leaving every retrieval crawler allowed, so Perplexity,
 * ChatGPT Search, Claude's web search, Bing/Copilot and Google's AI Overviews
 * can all still reach and cite the site. Whether to also allow the training
 * crawlers is a Cloudflare dashboard decision, not a code one, and is not
 * something this file can or should override.
 *
 * What the managed block does NOT do is point anyone at the sitemap. That is
 * the entire reason this file exists. Cloudflare appends its managed content
 * to whatever the origin returns, so the `Sitemap:` line below survives.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
