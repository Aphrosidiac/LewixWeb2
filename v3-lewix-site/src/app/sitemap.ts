import type { MetadataRoute } from 'next';

import { caseStudies, site } from '@/content';

/**
 * lewix.ai/sitemap.xml — previously a 404.
 *
 * Still small, so this is not about crawl budget. It is about the case
 * studies: nothing on the site links to /work/[slug] except the home page
 * carousel, which renders its links inside a client component, and there is
 * no /work index page for them to sit under. A sitemap is the only
 * unconditional path a crawler has to all four.
 *
 * `lastModified` is deliberately absent. Next would happily stamp build time
 * on every entry, which tells Google the whole site changed every deploy;
 * after the second or third false alarm it stops treating the field as
 * meaningful. Better to omit it than to lie in it.
 *
 * The Horizon entry is the blog's front door, not its contents. Horizon is a
 * separate application at /horizon with its own sitemap listing every story,
 * and that sitemap is declared in `robots.ts`. Listing one URL here links the
 * blog from the domain's own sitemap without duplicating thirty of its URLs
 * into a file this app would then have to keep in step.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}/contact`,
      changeFrequency: 'monthly',
      // The conversion page and the only route with FAQ schema on it.
      priority: 0.9,
    },
    {
      url: `${site.url}/about`,
      changeFrequency: 'monthly',
      // The page an answer engine reads to decide the company is real.
      priority: 0.8,
    },
    {
      url: `${site.url}/services`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      // The index the case studies never had. See `workIndexCopy`.
      url: `${site.url}/work`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/horizon`,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${site.url}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
