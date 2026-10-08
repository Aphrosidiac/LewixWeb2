import type { Metadata } from 'next';
import { shareCard } from '@/lib/shareCard';
import { JsonLd, breadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import { Reveal } from '@/components/layout/Reveal';
import { SystemList } from '@/components/work/SystemList';
import { ProductCards } from '@/components/work/ProductCards';
import { metadata as siteMeta, workIndexCopy } from '@/content';

/**
 * /work: every client system, then the products Lewix runs itself.
 *
 * The list is the same component as the home page's Work section, so the two
 * can never disagree. Client names are absent by rule: see the header of
 * `src/content/caseStudies.ts`.
 */
export const metadata: Metadata = {
  title: 'Work: custom systems in production',
  description: `Production systems built by ${siteMeta.openGraph.siteName} for manufacturers, distributors, workshops and retailers in Malaysia, plus the products we run ourselves.`,
  alternates: { canonical: '/work' },
  ...shareCard({
    title: `Work · ${siteMeta.openGraph.siteName}`,
    description: workIndexCopy.intro,
    url: '/work',
    type: 'website',
  }),
};

export default function WorkPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema('Work', '/work')} />
      <Reveal />

      <section
        data-light-surface
        className="bg-[#d2d2d2] px-6 pt-36 pb-24 text-[#0a0a0c] sm:px-10 sm:pt-44 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            data-reveal
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0a0a0c]/45"
          >
            {workIndexCopy.eyebrow}
          </p>

          <h1
            data-reveal
            data-reveal-delay="60"
            className="mt-8 max-w-4xl font-display font-semibold text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {workIndexCopy.headingLine1}{' '}
            <span className="text-accent">{workIndexCopy.headingLine2Accent}</span>
          </h1>

          <p
            data-reveal
            data-reveal-delay="120"
            className="mt-10 max-w-xl text-base leading-relaxed text-[#0a0a0c]/60"
          >
            {workIndexCopy.intro}
          </p>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <p data-reveal className="eyebrow mb-10">
            {workIndexCopy.countLabel}
          </p>
          <div data-reveal>
            <SystemList />
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 sm:px-10 sm:pb-36">
        <div className="mx-auto w-full max-w-6xl">
          <div data-reveal className="mb-12 grid gap-6 border-t border-line pt-16 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="eyebrow">{workIndexCopy.productsEyebrow}</p>
              <h2 className="mt-4 font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
                {workIndexCopy.productsHeading}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted sm:col-span-5 sm:col-start-8 sm:self-end">
              {workIndexCopy.productsIntro}
            </p>
          </div>
          <div data-reveal>
            <ProductCards />
          </div>
        </div>
      </section>

      <section
        data-light-surface
        className="bg-[#f1f1ef] px-6 py-28 text-[#0a0a0c] sm:px-10 sm:py-36"
      >
        <div data-reveal className="mx-auto w-full max-w-3xl">
          <h2 className="font-display font-semibold text-4xl leading-none tracking-tight sm:text-5xl">
            {workIndexCopy.ctaHeading}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0a0a0c]/60">
            {workIndexCopy.ctaBody}
          </p>
          <Link
            href={workIndexCopy.ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#0a0a0c] px-6 py-3 text-sm font-medium text-[#f1f1ef] transition-opacity hover:opacity-85"
          >
            {workIndexCopy.ctaLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
