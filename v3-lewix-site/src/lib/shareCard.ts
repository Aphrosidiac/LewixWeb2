import type { Metadata } from 'next';
import { metadata as siteMeta } from '@/content';

/**
 * Per-page Open Graph and Twitter tags that keep the site-wide parts.
 *
 * Next replaces a parent's `openGraph` object wholesale when a page sets its
 * own; it does not merge. Every page here set one for its title and
 * description, and in doing so silently dropped og:image, og:site_name and
 * og:locale, while twitter:* stayed inherited from the home page, so a shared
 * /about link carried the home tagline. This rebuilds the full card per page.
 */
const IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'LEWIX: custom ERPs, logistics platforms and AI agents for Malaysian businesses',
};

export function shareCard(og: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      siteName: siteMeta.openGraph.siteName,
      locale: siteMeta.openGraph.locale,
      images: [IMAGE],
      ...og,
      type: og.type ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title,
      description: og.description,
      images: [IMAGE.url],
    },
  };
}
