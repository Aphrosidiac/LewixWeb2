import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { caseStudies, getCaseStudy, caseStudyPageCopy } from '@/content';
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
    // Leading with the client and the system type rather than just the
    // product name: "Girpack" alone means nothing in a search result, and
    // these four titles were otherwise near-identical to each other.
    title: `${study.title}: ${study.type} for ${study.client}`,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: `${study.title} · ${study.type}`,
      description: study.description,
      url: `/work/${study.slug}`,
      type: 'article',
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="px-6 pt-32 pb-24 sm:px-10">
      {/*
        CreativeWork plus BreadcrumbList. The breadcrumb matters more than it
        looks: these pages are three levels deep with no /work index above
        them, so without it a search result shows the bare URL path instead of
        a Home > Work > Girpack trail.
      */}
      <JsonLd data={caseStudySchema(study.slug)} />
      <article className="mx-auto w-full max-w-4xl">
        <Link href="/#work" className="eyebrow transition-colors hover:text-accent">
          &larr; {caseStudyPageCopy.backLabel}
        </Link>

        <header className="mt-10">
          <p className="eyebrow">{study.type}</p>
          <h1 className="mt-4 font-display font-semibold text-5xl leading-none text-fg sm:text-7xl">
            {study.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted">
            {study.description}
          </p>
        </header>

        <div className="rule mt-12" />

        <section className="mt-12">
          <h2 className="eyebrow text-accent">{caseStudyPageCopy.challengeHeading}</h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">{study.challenge}</p>
        </section>

        <section className="mt-12">
          <h2 className="eyebrow text-accent">{caseStudyPageCopy.solutionHeading}</h2>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">{study.solution}</p>
        </section>

        {/* Was a row of framework names. A business owner reading a case study
            does not care what it was built with — they care what it does. */}
        <section className="mt-12">
          <h2 className="eyebrow text-accent">{caseStudyPageCopy.capabilitiesHeading}</h2>
          <ul className="mt-5 grid gap-px border-t border-line sm:grid-cols-2">
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

        <div className="rule mt-16" />

        <Link
          href="/#contact"
          className="mt-10 inline-block font-display font-semibold text-3xl text-fg transition-colors hover:text-accent"
        >
          {caseStudyPageCopy.ctaLabel} &rarr;
        </Link>
      </article>
    </main>
  );
}
