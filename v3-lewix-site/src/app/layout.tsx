import type { Metadata, Viewport } from 'next';
import { Figtree, Urbanist } from 'next/font/google';
import './globals.css';

import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { metadata as siteMeta, site } from '@/content';
import { JsonLd, organizationSchema, webSiteSchema } from '@/lib/schema';

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

/**
 * Everything URL-shaped below is relative and resolved against
 * `metadataBase`. Without it, Next throws at build time on the first relative
 * `alternates.canonical`, and og:image would emit a path a scraper cannot
 * fetch.
 *
 * The site previously emitted only `<title>` and `<meta name="description">`.
 * No canonical, no og:*, no twitter:*, no robots directive. Shares rendered
 * as bare links, and Cloudflare's per-hostname variants of the same page had
 * nothing telling Google which one was the original.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: siteMeta.title,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  keywords: [...siteMeta.keywords],
  applicationName: site.name,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  // www.lewix.ai and lewix.ai both resolve. This names the apex as the one
  // that counts, on every route rather than just this one.
  alternates: { canonical: '/' },
  openGraph: {
    type: siteMeta.openGraph.type,
    url: '/',
    siteName: siteMeta.openGraph.siteName,
    title: siteMeta.openGraph.title,
    description: siteMeta.openGraph.description,
    locale: siteMeta.openGraph.locale,
  },
  twitter: {
    // No @handle: LewixSocials records that X was deliberately skipped, so
    // there is no account to credit. The card still renders without one, and
    // Slack, WhatsApp, iMessage and LinkedIn all read these tags too.
    card: 'summary_large_image',
    title: siteMeta.openGraph.title,
    description: siteMeta.openGraph.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Uncapped, so Google may show a full snippet and a large thumbnail
      // instead of defaulting to a conservative crop.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

/**
 * Separate export because Next moved `themeColor` and `viewport` out of
 * `metadata` — leaving them in the metadata object is a build-time warning
 * and the tags never render.
 *
 * Deep Night, so mobile browser chrome matches the page instead of flashing
 * white above a black site.
 */
export const viewport: Viewport = {
  themeColor: '#09090c',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // en-MY, not en. The market is Malaysia and every case study is a
    // Malaysian business, so the regional subtag is accurate and is one more
    // signal tying the site to the country it sells in.
    <html lang="en-MY" className={`${figtree.variable} ${urbanist.variable}`}>
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
        {/*
          Organization and WebSite ride on every route, because a crawler that
          lands on a case study should be able to resolve the publisher
          without having to fetch the home page first. Route-specific graphs
          (FAQ, case study, breadcrumbs) are emitted by the routes themselves
          and reference the organization by @id rather than restating it.

          In the body rather than the head on purpose: this is where Next
          documents JSON-LD, and it keeps the graph inside the RSC payload so
          it survives client navigation.
        */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />

        <SmoothScroll />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
