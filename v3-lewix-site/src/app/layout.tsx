import type { Metadata } from 'next';
import { Figtree, Urbanist } from 'next/font/google';
import './globals.css';

import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { metadata as siteMeta } from '@/content';

// Brand typefaces. Both are variable fonts, so omitting `weight` loads the full
// axis and lets the design use any weight without extra requests.

/** Body, UI, labels. */
const figtree = Figtree({
  variable: '--font-sans-stack',
  subsets: ['latin'],
  display: 'swap',
});

/** Display: section titles, headings, the numerals. Geometric construction
 *  matches the LEWIX wordmark. */
const urbanist = Urbanist({
  variable: '--font-display-stack',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${figtree.variable} ${urbanist.variable}`}>
      {/*
        Only genuinely global chrome lives here.

        AsciiMountain, TeamModels, LoadingScreen and PageReveal used to mount on
        every route, which meant /contact and the case-study pages sat behind the
        loading screen waiting on a 27MB model — for a mountain those pages hide
        behind opaque bands anyway, plus a second WebGL context and ~10MB of team
        models with nothing to render into. They now mount in the home page,
        which is the only route with `data-rise`, `data-team-slot`, or anything
        for the field to sit behind.
      */}
      <body className="min-h-screen">
        <SmoothScroll />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
