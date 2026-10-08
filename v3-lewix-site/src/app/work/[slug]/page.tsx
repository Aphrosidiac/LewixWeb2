import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { shareCard } from '@/lib/shareCard';

import {
  adjacentCaseStudies,
  caseStudies,
  caseStudyPageCopy,
  getCaseStudy,
} from '@/content';
import { Flow, StatusTag } from '@/components/work/Flow';
import { JsonLd, caseStudySchema } from '@/lib/schema';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

// Next 16: params is a Promise — synchronous access was removed in this major.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  // Explicitly noindex the miss rather than returning `{}`. Without this the
  // 404 inherits the root layout's `index: true` and its canonical of `/`,
  // which points every bad /work/* URL at the home page.
  if (!study) return { title: 'Project not found', robots: { index: false, follow: false } };

  return {
    // The brand suffix comes from the root layout's `title.template` now.
    //
    // `study.title` is the system, not the client, so this reads
    // "Packaging Supplies MIS: Pricing and order management · LEWIX" — which is
    // what someone actually searches for. The client name used to be appended
    // here; it came out with the rest of the rename, since a title is the most
    // visible surface on the site and the one place the old naming would have
    // survived the change.
    // Was `${title}: ${type}`, which ran to 86 characters with the suffix and
    // got cut mid-phrase in results. The type still leads the description
    // and the share card.
    title: `${study.title} · Case study`,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}` },
    ...shareCard({
      title: `${study.title} · ${study.type}`,
      description: study.description,
      url: `/work/${study.slug}`,
      type: 'article',
    }),
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const { prev, next } = adjacentCaseStudies(study.slug);

  return (
    <main id="main" className="px-6 pt-32 pb-24 sm:px-10 sm:pt-40">
      {/*
        CreativeWork plus BreadcrumbList. The breadcrumb matters more than it
        looks: without it a search result shows the bare URL path instead of
        a Home > Work > system trail.
      */}
      <JsonLd data={caseStudySchema(study.slug)} />
      <article className="mx-auto w-full max-w-6xl">
        <Link href="/work" className="eyebrow inline-block py-2 transition-colors hover:text-accent">
          &larr; {caseStudyPageCopy.backLabel}
        </Link>

        <header className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow">{study.type}</p>
            <h1 className="mt-5 font-display font-semibold text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl">
              {study.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {study.description}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-end border-t border-line pt-6 text-sm lg:col-span-4 lg:grid-cols-1">
            <div>
              <dt className="eyebrow">{caseStudyPageCopy.sectorLabel}</dt>
              <dd className="mt-2 text-fg">{study.sector}</dd>
            </div>
            <div>
              <dt className="eyebrow">{caseStudyPageCopy.statusLabel}</dt>
              <dd className="mt-2">
                <StatusTag status={study.status} />
              </dd>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <dt className="eyebrow">{caseStudyPageCopy.clientLabel}</dt>
              <dd className="mt-2 text-fg-muted">{caseStudyPageCopy.clientValue}</dd>
            </div>
          </dl>
        </header>

        <section className="mt-20">
          <h2 className="eyebrow mb-6 text-accent">{caseStudyPageCopy.flowHeading}</h2>
          <Flow steps={study.flow} />
        </section>

        {study.numbers && study.numbers.length > 0 && (
          <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {study.numbers.map((n) => (
              <div key={n.label} className="bg-bg-raised p-8">
                <p className="font-display font-semibold text-5xl leading-none text-fg sm:text-6xl">
                  {n.value}
                </p>
                <p className="mt-4 text-sm text-fg-muted">{n.label}</p>
              </div>
            ))}
          </section>
        )}

        <div className="rule mt-20" />

        <section className="mt-14 grid gap-6 lg:grid-cols-12">
          <h2 className="eyebrow text-accent lg:col-span-3">{caseStudyPageCopy.challengeHeading}</h2>
          <p className="text-lg leading-relaxed text-fg-muted lg:col-span-8">{study.challenge}</p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-12">
          <h2 className="eyebrow text-accent lg:col-span-3">{caseStudyPageCopy.solutionHeading}</h2>
          <p className="text-lg leading-relaxed text-fg-muted lg:col-span-8">{study.solution}</p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-12">
          <h2 className="eyebrow text-accent lg:col-span-3">{caseStudyPageCopy.capabilitiesHeading}</h2>
          <ul className="grid gap-px border-t border-line sm:grid-cols-2 lg:col-span-9">
            {study.capabilities.map((c: string) => (
              <li
                key={c}
                className="flex gap-4 border-b border-line py-4 text-sm text-fg-muted sm:pr-8"
              >
                <span aria-hidden="true" className="text-accent">
                  /
                </span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 rounded-3xl border border-line bg-bg-raised p-8 sm:p-12">
          <p className="eyebrow">{caseStudyPageCopy.ctaEyebrow}</p>
          <Link
            href="/contact"
            className="mt-4 inline-block font-display font-semibold text-4xl leading-tight text-fg transition-colors hover:text-accent sm:text-5xl"
          >
            {caseStudyPageCopy.ctaLabel}{' '}&rarr;
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
            {caseStudyPageCopy.ctaBody}
          </p>
        </section>

        <nav
          aria-label="More systems"
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
        >
          {[
            { label: caseStudyPageCopy.prevLabel, study: prev, align: '' },
            { label: caseStudyPageCopy.nextLabel, study: next, align: 'sm:text-right' },
          ].map(({ label, study: s, align }) => (
            <Link
              key={label}
              href={`/work/${s.slug}`}
              className={`group bg-bg p-6 transition-colors hover:bg-bg-raised sm:p-8 ${align}`}
            >
              <span className="eyebrow">{label}</span>
              <span className="mt-3 block font-display font-semibold text-2xl text-fg transition-colors group-hover:text-accent">
                {s.title}
              </span>
              <span className="mt-1 block text-sm text-fg-muted">{s.sector}</span>
            </Link>
          ))}
        </nav>
      </article>
    </main>
  );
}
