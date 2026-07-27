import type { Metadata } from 'next';
import { ProjectBrief } from '@/components/contact/ProjectBrief';
import { Reveal } from '@/components/layout/Reveal';
import { HeadlineReveal } from '@/components/contact/HeadlineReveal';
import { LocalTime } from '@/components/layout/LocalTime';
import { contactPage, faqs } from '@/content/contactPage';
import { contact, metadata as siteMeta, site } from '@/content';

export const metadata: Metadata = {
  title: `Start a project · ${siteMeta.openGraph.siteName}`,
  description: contactPage.intro,
};

/**
 * Dedicated /contact route, structured after trionn.com/contact: a light hero,
 * a dark band carrying the multi-step brief under an ambient edge glow, a
 * details band split into columns under a hairline, and a LIGHT questions band
 * with the heading left and the accordion right.
 *
 * The last one matters — the first pass put questions on a dark full-width
 * stack, which lost both the contrast flip and the two-column rhythm that make
 * the reference read as a designed page rather than a list.
 *
 * Every band is opaque: the ASCII canvas is fixed behind every route, and
 * translucent bands over a glyph field would be unreadable.
 */
export default function ContactPage() {
  return (
    <main>
      <Reveal />

      {/* `data-light-surface` tells SiteHeader to invert. Without it the white
          pill and white-outlined toggle sit on a light band and disappear. */}
      {/*
        Sticky, so the dark band below slides up over it instead of the two
        meeting at a hard cut. This is the reference's pinned hero, done without
        a scroll library — the hero holds, the next band covers it.
      */}
      <section
        data-light-surface
        className="sticky top-0 z-0 flex min-h-[70svh] flex-col justify-center bg-[#d2d2d2] px-6 pt-36 pb-24 text-[#0a0a0c] sm:px-10 sm:pt-44 sm:pb-28"
      >
        {/*
          Aligned to the page gutter and dropped below the header band. At the
          section's literal corners the top-left mark landed a few pixels from
          the fixed wordmark and the two read as one cluttered object; the top
          marks now clear the bar, and all four line up with the content edge.
        */}
        {[
          'left-6 top-24 sm:left-10',
          'right-6 top-24 sm:right-10',
          'left-6 bottom-8 sm:left-10',
          'right-6 bottom-8 sm:right-10',
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute ${pos} h-2.5 w-2.5 text-[#0a0a0c]/30`}
            style={{
              backgroundImage:
                'linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)',
              backgroundSize: '100% 1px, 1px 100%',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}

        <div className="mx-auto w-full max-w-6xl">
          <p
            data-reveal
            className="text-[10.5px] font-medium tracking-[0.2em] text-[#0a0a0c]/50 uppercase"
          >
            {contactPage.eyebrow}
          </p>
          <h1 className="mt-8 max-w-4xl font-display font-semibold text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            <HeadlineReveal text={contactPage.headline} delay={120} />
          </h1>
          <p
            data-reveal
            data-reveal-delay="180"
            className="mt-10 max-w-xl text-sm leading-relaxed text-[#0a0a0c]/70 sm:text-base"
          >
            {contactPage.intro}
          </p>
        </div>
      </section>

      {/* z-10 puts the rest of the page above the pinned hero. */}
      <div className="relative z-10">
        <ProjectBrief />

      <section className="bg-bg px-6 pb-28 sm:px-10 sm:pb-36">
        <div className="mx-auto w-full max-w-6xl">
          {/* Hairline with a mark centred on it, as the reference divides its
              lower bands. */}
          <div className="relative h-px w-full bg-line">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 text-fg-faint"
              style={{
                backgroundImage:
                  'linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)',
                backgroundSize: '100% 1px, 1px 100%',
                backgroundPosition: 'center, center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          <div className="grid gap-16 pt-24 sm:grid-cols-12 sm:pt-32">
            <div data-reveal className="sm:col-span-4">
              <h2 className="font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
                Direct
              </h2>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-fg-muted">
                {contact.directNote}
              </p>
              <dl className="mt-8 space-y-3">
                {contact.whatsapp.map((w) => (
                  <div key={w.number} className="flex gap-4 text-sm">
                    <dt className="w-14 shrink-0 text-fg-faint">{w.name}</dt>
                    <dd>
                      <a
                        href={w.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-fg transition-colors hover:text-accent"
                      >
                        {w.display}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div data-reveal data-reveal-delay="90" className="sm:col-span-3">
              <h2 className="font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
                Where
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-fg-muted">{site.engineeredIn}</p>
              <p className="mt-2 text-sm text-fg-faint tabular-nums">
                <LocalTime /> MYT
              </p>
            </div>

            <div data-reveal data-reveal-delay="180" className="sm:col-span-5 sm:pt-3">
              <a
                href={contact.email.href}
                className="font-display font-semibold text-2xl text-fg transition-colors hover:text-accent sm:text-3xl"
              >
                {contact.email.label}
              </a>
              <p className="mt-3 text-sm text-fg-faint">Or use the brief above.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The contrast flip. Light band, heading left, accordion right. */}
      <section
        data-light-surface
        className="bg-[#f1f1ef] px-6 py-28 text-[#0a0a0c] sm:px-10 sm:py-36"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-14 sm:grid-cols-12">
          <div data-reveal className="sm:col-span-5">
            <h2 className="font-display font-semibold text-5xl leading-none tracking-tight sm:text-7xl">
              Questions
            </h2>
            <p className="mt-8 max-w-[16rem] text-sm leading-relaxed text-[#0a0a0c]/55">
              What people usually ask before we start.
            </p>
          </div>

          {/* Native details/summary: keyboard-operable, findable by in-page
              search, and works before JS. The reference builds custom
              accordions and loses all three. */}
          <div data-reveal data-reveal-delay="120" className="sm:col-span-7">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-[#0a0a0c]/12 py-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 font-display font-semibold text-xl leading-snug transition-colors hover:text-accent sm:text-2xl">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-base text-[#0a0a0c]/40 transition-transform duration-300 group-open:rotate-180"
                  >
                    ↓
                  </span>
                </summary>
                <p className="mt-4 max-w-xl pr-10 text-sm leading-relaxed text-[#0a0a0c]/60">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
        </section>
      </div>
    </main>
  );
}
