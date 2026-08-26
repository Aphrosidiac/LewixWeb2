import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/layout/Reveal';
import {
  aboutCta,
  aboutIntro,
  aboutPageCopy,
  contact,
  engagementCopy,
  factsCopy,
  notRightFor,
  pricing,
  registration,
  rightFor,
  site,
} from '@/content';

/**
 * /about
 *
 * NOT the home page's About section on its own URL. That section sells; this
 * one verifies. See the note at the top of `src/content/aboutPage.ts` for why
 * the two are written to different briefs and must stay that way, or the site
 * ends up with two URLs competing to answer the same query.
 *
 * The "Not right for" column is the point of the page. It is the only part a
 * reader cannot get from any other agency site, and it is what makes the
 * "Right for" column mean something.
 */
export const metadata: Metadata = {
  title: 'About',
  description: `${site.legalName}, trading as ${site.name}: a software company in ${registration.addressLocality} building custom ERPs, logistics platforms and AI agents. How a project runs, and who we are not right for.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About · ${site.name}`,
    description: `Who we are, what we build, how a project runs, and who we are not the right people for. Projects start at ${pricing.amount}.`,
    url: '/about',
    type: 'website',
  },
};

const facts = [
  { label: 'Legal name', value: site.legalName },
  { label: 'Trading brand', value: `${site.name} (lewix.ai)` },
  { label: 'Registration no.', value: `${registration.companyNo} (${registration.oldFormat})` },
  { label: 'Founded', value: registration.foundingDate },
  { label: 'Location', value: `${registration.addressLocality}, Malaysia` },
  { label: 'Starting price', value: pricing.amount },
] as const;

export default function AboutPage() {
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
            {aboutPageCopy.eyebrow}
          </p>

          <h1
            data-reveal
            data-reveal-delay="60"
            className="mt-8 max-w-4xl font-display font-semibold text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {aboutPageCopy.headingLine1}{' '}
            <span className="text-accent">{aboutPageCopy.headingLine2Accent}</span>
          </h1>

          <p
            data-reveal
            data-reveal-delay="120"
            className="mt-10 max-w-xl text-base leading-relaxed text-[#0a0a0c]/60"
          >
            {aboutPageCopy.intro}
          </p>
        </div>
      </section>

      {/* Who we are, then the registration beside it. The facts sit next to the
          prose rather than under it so the checkable half is visible without
          scrolling past the persuasive half. */}
      <section className="bg-bg px-6 py-28 sm:px-10 sm:py-36">
        <div className="mx-auto grid w-full max-w-6xl gap-14 sm:grid-cols-12">
          <div data-reveal className="sm:col-span-7">
            {aboutIntro.map((para) => (
              <p
                key={para}
                className="mb-6 text-base leading-relaxed text-fg-muted last:mb-0 sm:text-lg"
              >
                {para}
              </p>
            ))}
          </div>

          <div data-reveal data-reveal-delay="120" className="sm:col-span-5 sm:pl-6">
            <h2 className="font-display font-semibold text-2xl leading-none tracking-tight text-fg">
              {factsCopy.heading}
            </h2>
            <dl className="mt-8 border-t border-line">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-3.5"
                >
                  <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint">
                    {f.label}
                  </dt>
                  <dd className="text-right text-sm text-fg tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-fg-faint">{factsCopy.note}</p>
          </div>
        </div>
      </section>

      {/*
        How a project runs lives on /services now, not here. It was rendered in
        full on this page first; `servicesCopy` has a heading written for that
        page, the previous site put it there, and the content files are
        explicit that the same paragraphs must not appear on two routes. What
        stays here is the pointer, because "how would this go" is a fair
        question to have while reading an about page.
      */}
      <section className="border-t border-line bg-bg px-6 py-24 sm:px-10 sm:py-28">
        <div data-reveal className="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display font-semibold text-3xl leading-none tracking-tight text-fg sm:text-4xl">
              {engagementCopy.heading}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">{engagementCopy.note}</p>
          </div>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
          >
            All five stages
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* The contrast flip, and the honest half of the page. */}
      <section
        data-light-surface
        className="bg-[#f1f1ef] px-6 py-28 text-[#0a0a0c] sm:px-10 sm:py-36"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-14 sm:grid-cols-2">
          {[rightFor, notRightFor].map((list, i) => (
            <div key={list.heading} data-reveal data-reveal-delay={i === 0 ? undefined : '120'}>
              <h2 className="font-display font-semibold text-3xl leading-none tracking-tight sm:text-4xl">
                {list.heading}
              </h2>
              <p className="mt-4 text-sm text-[#0a0a0c]/50">{list.note}</p>
              <ul className="mt-8 border-t border-[#0a0a0c]/12">
                {list.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-[#0a0a0c]/12 py-5 text-sm leading-relaxed text-[#0a0a0c]/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg px-6 py-28 sm:px-10 sm:py-36">
        <div data-reveal className="mx-auto w-full max-w-3xl">
          <h2 className="font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
            {aboutCta.heading}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">{aboutCta.body}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={aboutCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              {aboutCta.label}
            </Link>
            <a
              href={contact.email.href}
              className="text-sm text-fg-muted transition-colors hover:text-accent"
            >
              {contact.email.label}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
