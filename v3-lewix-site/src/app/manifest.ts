import type { MetadataRoute } from 'next';

import { metadata as siteMeta, site } from '@/content';

/**
 * Web app manifest. Previously a 404.
 *
 * Not a ranking factor and this site is not a PWA, so it stays minimal. It is
 * here for the two things it does earn: a proper name and icon when someone
 * adds lewix.ai to a phone home screen, and a declared brand background so
 * the launch splash is Deep Night rather than white.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.legalName}`,
    short_name: site.name,
    description: siteMeta.description,
    start_url: '/',
    display: 'standalone',
    // Deep Night and Horizon Blue, from the brand cheatsheet.
    background_color: '#09090c',
    theme_color: '#6880f2',
    lang: 'en-MY',
    icons: [
      {
        src: '/brand/lewix-logomark-gradient-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
