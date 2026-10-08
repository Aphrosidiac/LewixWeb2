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
    // Deep Night for both, matching the viewport `themeColor` in layout.tsx;
    // the two disagreed, so the installed app's chrome was blue and the
    // browser's was black.
    background_color: '#09090c',
    theme_color: '#09090c',
    lang: 'en-MY',
    icons: [
      {
        src: '/brand/lewix-logomark-gradient-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/lewix-logomark-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/brand/lewix-logomark-gradient-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
