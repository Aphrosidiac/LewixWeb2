import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/layout/Reveal';
import { caseStudies, categoryLabels, metadata as siteMeta, workIndexCopy } from '@/content';

/**
 * /work — the index that never existed.
 *
 * All four case studies have lived at /work/[slug] since launch with nothing
 * linking to them but the home page carousel, whose links are rendered from a
 * client component. `sitemap.ts` says as much in its own comment: it was the
 * only unconditional path a crawler had to any of them. This is the second,
 * and the one a person can also use.
 *
 * Rows, not cards. Four items do not need a grid, and a row can carry the
 * category, the system name, what it does and a line of description without
 * any of them competing for the same corner.
 *
 * Client names are absent by rule, not by oversight: `study.client` exists in
 * the data and is deliberately never rendered as a heading or a title. See the
 * header of `src/content/caseStudies.ts`.
 */
export const metadata: Metadata = {
  title: 'Work',
  description: `Four production systems built by ${siteMeta.openGraph.siteName}: packaging supplies, produce supply and delivery, distribution and fleet, and workshop management.`,
  alternates: { canonical: '/work' },
  openGraph: {
    title: `Work · ${siteMeta.openGraph.siteName}`,
    description: workIndexCopy.intro,
    url: '/work',
    type: 'website',
  },
};

export default function WorkPage() {
  return (
    <main>
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

      <section className="bg-bg px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <p
            data-reveal
            className="border-b border-line pb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint"
          >
            {String(caseStudies.length).padStart(2, '0')} {workIndexCopy.countLabel}
          </p>

          <ul>
            {caseStudies.map((study, i) => (
              <li key={study.slug} data-reveal data-reveal-delay={`${Math.min(i, 3) * 60}`}>
                <Link
                  href={`/work/${study.slug}`}
                  className="group grid gap-x-10 gap-y-4 border-b border-line py-10 transition-colors sm:grid-cols-12 sm:py-12"
                >
                  <div className="flex items-baseline gap-5 sm:col-span-4">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-fg-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display font-semibold text-2xl leading-tight tracking-tight text-fg transition-colors group-hover:text-accent sm:text-3xl">
                      {study.title}
                    </h2>
                  </div>

                  <div className="sm:col-span-5">
                    <p className="text-sm leading-relaxed text-fg-muted">
                      {study.shortDescription ?? study.description}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-6 sm:col-span-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint">
                      {categoryLabels[study.category]}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
