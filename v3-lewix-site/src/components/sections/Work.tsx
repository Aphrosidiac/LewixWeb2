'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from './Section';
import { caseStudies, type CaseStudyCategory } from '@/content';

type Filter = 'all' | CaseStudyCategory;

// Only offer filters that actually match something — dragonfly's index shows a
// fixed set, but empty filters read as broken.
const LABELS: Record<Filter, string> = {
  all: 'All',
  erp: 'Systems & ERP',
  logistics: 'Logistics',
  'web-app': 'Web Apps',
  ai: 'AI',
};

export function Work() {
  const [filter, setFilter] = useState<Filter>('all');

  const available = useMemo(() => {
    const present = new Set(caseStudies.map((c) => c.category));
    return (Object.keys(LABELS) as Filter[]).filter(
      (f) => f === 'all' || present.has(f as CaseStudyCategory)
    );
  }, []);

  const shown = useMemo(
    () => (filter === 'all' ? caseStudies : caseStudies.filter((c) => c.category === filter)),
    [filter]
  );

  return (
    <Section id="work" num="04" title="Work">
      {/*
        Named industries have to match the four entries below. This previously
        advertised "bakeries", which no case study evidenced — the bakery system
        is real but has never been written up, so the page was claiming a fourth
        sector on the strength of three.

        Rows are titled by system rather than by client now, so the line also
        has to carry that these are specific real builds and not a service menu.
      */}
      <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-fg-muted">
        Four systems running in production: packaging supply, fresh produce, distribution
        fleets, and car workshops. Each one replaced whatever the business was holding
        itself together with.
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
        {available.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`eyebrow transition-colors ${
              filter === f ? 'text-accent' : 'hover:text-fg'
            }`}
          >
            {LABELS[f]}
          </button>
        ))}
      </div>

      <ul className="border-t border-line">
        {shown.map((study) => (
          <li key={study.slug}>
            <Link
              href={`/work/${study.slug}`}
              className="group grid items-baseline gap-2 border-b border-line py-7 transition-colors hover:bg-bg-raised sm:grid-cols-12 sm:gap-6 sm:px-4"
            >
              <span className="eyebrow sm:col-span-1">{LABELS[study.category]}</span>
              <span className="font-display font-semibold text-3xl text-fg transition-colors group-hover:text-accent sm:col-span-4 sm:text-4xl">
                {study.title}
              </span>
              <span className="text-sm leading-relaxed text-fg-muted sm:col-span-6">
                {study.shortDescription ?? study.description}
              </span>
              <span className="eyebrow text-right transition-colors group-hover:text-accent sm:col-span-1">
                View
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
