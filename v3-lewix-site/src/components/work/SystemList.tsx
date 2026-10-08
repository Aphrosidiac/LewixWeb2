'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { caseStudies, categoryLabels, type CaseStudyCategory } from '@/content';
import { Flow, StatusTag } from './Flow';

type Filter = 'all' | CaseStudyCategory;

/**
 * The client systems, as filterable rows. Shared by the home page's Work
 * section and /work so the two can never list different things.
 *
 * Each row names the system, the kind of business it runs and its status.
 * Hovering opens the row's flow, the one-line answer to "what does it
 * actually do all day". The client is never shown: see caseStudies.ts.
 */
export function SystemList() {
  const [filter, setFilter] = useState<Filter>('all');

  // Only offer filters that match something; an empty filter reads as broken.
  const available = useMemo(() => {
    const present = new Set(caseStudies.map((c) => c.category));
    return (Object.keys(categoryLabels) as CaseStudyCategory[]).filter((c) => present.has(c));
  }, []);

  const shown = useMemo(
    () => (filter === 'all' ? caseStudies : caseStudies.filter((c) => c.category === filter)),
    [filter]
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
        {(['all', ...available] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`eyebrow transition-colors ${filter === f ? 'text-accent' : 'hover:text-fg'}`}
          >
            {f === 'all' ? 'All' : categoryLabels[f]}
          </button>
        ))}
      </div>

      <ul className="border-t border-line">
        {shown.map((study) => (
          <li key={study.slug}>
            <Link
              href={`/work/${study.slug}`}
              className="work-row group block border-b border-line py-7 outline-none transition-colors hover:bg-bg-raised/70 focus-visible:bg-bg-raised/70 sm:px-4"
            >
              <div className="grid items-baseline gap-x-6 gap-y-2 sm:grid-cols-12">
                <span className="font-display font-semibold text-sm text-fg-faint sm:col-span-1">
                  {String(caseStudies.indexOf(study) + 1).padStart(2, '0')}
                </span>
                <span className="font-display font-semibold text-3xl leading-tight text-fg transition-colors group-hover:text-accent sm:col-span-4">
                  {study.title}
                </span>
                <span className="text-sm leading-relaxed text-fg-muted sm:col-span-5">
                  {study.shortDescription}
                  <span className="mt-2 block eyebrow">{study.sector}</span>
                </span>
                <span className="flex items-center justify-between gap-4 sm:col-span-2 sm:justify-end">
                  <StatusTag status={study.status} />
                  <span
                    aria-hidden="true"
                    className="text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    →
                  </span>
                </span>
              </div>
              <div className="work-row-flow">
                <div>
                  <div className="pt-6 sm:grid sm:grid-cols-12 sm:gap-x-6">
                    <div className="sm:col-span-11 sm:col-start-2">
                      <Flow steps={study.flow} compact />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
