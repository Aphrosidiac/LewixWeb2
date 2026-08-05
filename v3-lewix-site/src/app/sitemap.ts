import type { MetadataRoute } from 'next';

import { caseStudies, site } from '@/content';

/**
 * lewix.ai/sitemap.xml — previously a 404.
 *
 * Six URLs, so this is not about crawl budget. It is about the case studies:
 * nothing on the site links to /work/[slug] except the home page carousel,
 * which renders its links inside a client component, and there is no /work
 * index page for them to sit under. A sitemap is the only unconditional path
 * a crawler has to all four.
 *
 * `lastModified` is deliberately absent. Next would happily stamp build time
 * on every entry, which tells Google the whole site changed every deploy;
 * after the second or third false alarm it stops treating the field as
 * meaningful. Better to omit it than to lie in it.
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
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
