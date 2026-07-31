import Image from 'next/image';
import { Section } from './Section';
import { LocalTime } from '@/components/layout/LocalTime';
import { contact, contactBrief, pricing, site, process as processSteps } from '@/content';

// Numbers match the section headers and the header's counter, so the footer
// speaks the same index language as the rest of the page.
const FOOTER_LINKS = [
  { id: 'about', num: '01', label: 'About' },
  { id: 'writing', num: '02', label: 'Writing' },
  { id: 'team', num: '03', label: 'Founding Team' },
  { id: 'work', num: '04', label: 'Work' },
] as const;

/**
 * Closing section.
 *
 * Previously a heading, one line of copy, and a four-row contact table, with
 * most of the left column empty. It read as a footer that had been given a
 * section number.
 *
 * It now does three jobs a closing section should do: make the primary action
 * unmissable (the address is the largest thing on the screen), answer "what
 * happens if I write" without making anyone hunt for a services page, and end
 * the page on the mark rather than trailing off.
 */
export function Contact() {
  return (
    <Section id="contact" num="05" title="Contact">
      <div className="max-w-3xl">
        <h3 className="font-display font-semibold text-4xl leading-[1.05] tracking-tight text-fg sm:text-6xl">
          {contact.headline}
        </h3>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
          {contact.intro}
        </p>

        {/*
          The starting price, above the fold of the section and before the
          address rather than buried in an FAQ.

          It sits here because it does the same job as the headline: it tells
          someone whether to keep reading. A figure only findable on a
          question-and-answer page is one most people leave without, which is
          the situation every competitor withholding a number is already in.

          The rule and the accent set it apart from the intro copy without
          making it a banner — it should read as a stated fact, not a promotion.
        */}
        <div className="mt-10 border-t border-line pt-6">
          <p className="eyebrow">{pricing.eyebrow}</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display font-semibold text-3xl tracking-tight text-accent sm:text-4xl">
              From {pricing.amount}
            </span>
            <span className="eyebrow">{pricing.label}</span>
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">{pricing.note}</p>
        </div>
      </div>

      <div className="mt-16 grid gap-14 sm:mt-20 sm:grid-cols-12 sm:gap-10">
        <div className="sm:col-span-7">
          <EmailPlate />

          <p className="eyebrow mt-14">Or message us directly</p>
          <ul className="mt-4 border-t border-line">
            {contact.whatsapp.map((w) => (
              <li key={w.number}>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-baseline justify-between gap-6 border-b border-line py-4 transition-colors hover:border-accent/60"
                >
                  <span className="eyebrow transition-colors group-hover:text-accent">{w.name}</span>
                  <span className="flex items-baseline gap-3 font-sans text-sm text-fg">
                    {w.display}
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-fg-faint">{contact.directNote}</p>
        </div>

        {/* Answers the question the address raises. Pulled from the same
            `process` data the old site's services page used, so this stays in
            step with whatever that says. */}
        <div className="sm:col-span-5">
          <p className="eyebrow">What happens next</p>
          <ol className="mt-4 border-t border-line">
            {processSteps.map((step) => (
              <li key={step.step} className="flex gap-5 border-b border-line py-4">
                <span className="eyebrow shrink-0 pt-0.5 text-accent">{step.step}</span>
                <span>
                  <span className="block font-display font-semibold text-lg leading-none text-fg">
                    {step.title}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-fg-muted">
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Was a "Capabilities" list of service titles: no information, and one
          screen below a Work filter bar that can only evidence two of the four.
          This asks for the three things Discovery needs first instead. */}
      <div className="mt-20">
        <p className="eyebrow">Before you write</p>
        <ul className="mt-4 grid border-t border-line sm:grid-cols-3">
          {contactBrief.map((item) => (
            <li
              key={item.num}
              className="border-b border-line py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
            >
              <span className="eyebrow text-accent">{item.num}</span>
              <span className="mt-2 block font-display font-semibold text-xl leading-tight text-fg">
                {item.title}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-fg-muted">
                {item.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </Section>
  );
}

/**
 * The primary action. Framed with the registration marks used by the loading
 * screen and the team cards, so the one thing we most want clicked is also the
 * one thing carrying the site's own bracket.
 */
function EmailPlate() {
  return (
    <a
      href={contact.email.href}
      className="group relative block border border-line p-6 transition-colors hover:border-accent/50 sm:p-8"
    >
      {['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute ${pos} h-1.5 w-1.5 text-fg-faint/50 transition-colors duration-500 group-hover:text-accent`}
          style={{
            backgroundImage:
              'linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)',
            backgroundSize: '100% 1px, 1px 100%',
            backgroundPosition: 'center, center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}

      <span className="eyebrow">Start here</span>
      {/* Sized to fill its column rather than to a type scale: this is the one
          element on the page allowed to compete with the section title. */}
      <span className="mt-3 block font-display font-semibold text-[clamp(1.6rem,4.4vw,3.1rem)] leading-none tracking-tight text-fg transition-colors group-hover:text-accent">
        {contact.email.label}
      </span>
      {/* Arrow pushed to the far edge rather than trailing the response time,
          which read as if it belonged to that sentence. */}
      <span className="mt-5 flex items-center justify-between gap-3 text-xs text-fg-faint">
        {contact.responseTime}
        <Arrow />
      </span>
    </a>
  );
}

/** Nudges right on hover of the enclosing `group`. */
function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block translate-x-0 text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
    >
      ↗
    </span>
  );
}

/**
 * Real footer rather than a copyright line. The wordmark repeats the hero at
 * the far end of the scroll, which is what closes the loop on a single-page
 * site, and it doubles as the back-to-top control.
 *
 * The glyph field is ramped back up to FOOTER_OPACITY behind all of this. That
 * works for the upper footer, where the terrain still reads as a ridge against
 * black, but by the bottom of the viewport it is an even carpet of glyphs at
 * the same luminance as small grey type — "Back to top" was disappearing into
 * it completely, and a text-shadow can't separate type from a background it
 * matches on every side. Hence the scrim below.
 */
function SiteFooter() {
  return (
    // One rule, one band. The copyright used to sit under a second border-t,
    // which made the block read as two stacked footers.
    <footer className="text-legible relative mt-24 border-t border-line pt-12 sm:mt-32">
      {/*
        Bottom-weighted scrim. Transparent where the mountain is worth seeing,
        near-opaque where the type sits. Dropping the canvas opacity instead
        would have quietened the whole return, which is the part worth keeping.
        Pulled wider than the content so it doesn't end in a visible edge.

        Stops matter here. A plain from-transparent/via-70/to-bg ramp reached
        70% by the midpoint, and 30% of a field already at FOOTER_OPACITY is
        nothing — it erased the mountain from the whole footer, which is the
        opposite of the point. Held clear through the nav, and the boxed
        back-to-top does the legibility work the scrim no longer has to.

        The overhang must equal `Section`'s bottom padding EXACTLY — py-24 (6rem)
        / sm:py-32 (8rem). Less and the last strip of page shows the field at
        full FOOTER_OPACITY against a scrimmed footer, which reads as a hard
        edged band. More and the page grows: an absolutely positioned box still
        extends the scroll container's overflow, so an overhang deeper than the
        padding adds that many pixels of dead black to the end of the document.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-50vw] top-0 bottom-[-6rem] -z-10 bg-gradient-to-b from-transparent from-10% via-bg/45 via-45% to-bg to-88% sm:bottom-[-8rem]"
      />

      <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
        <p className="eyebrow max-w-[16rem] leading-relaxed">
          &copy; {new Date().getFullYear()} {site.copyrightHolder}
        </p>

        <div className="flex flex-col gap-2 sm:items-end">
          <nav className="flex flex-col gap-2 sm:items-end" aria-label="Sections">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="group eyebrow flex items-baseline gap-3 transition-colors hover:text-accent sm:justify-end"
              >
                <span className="text-fg-faint/50 transition-colors group-hover:text-accent">
                  {l.num}
                </span>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Was eyebrow-sized, i.e. visually identical to "Writing". It is the
              most valuable link down here and now reads like it. */}
          <a
            href={contact.email.href}
            className="mt-6 font-display font-semibold text-xl text-fg transition-colors hover:text-accent sm:text-2xl"
          >
            {contact.email.label}
          </a>

          {/* `contact.location` is also "Malaysia", so pairing the two here
              would just say it twice. The clock earns its place instead: it is
              the one line on the page that isn't identical on every visit.
              Dimmer than the nav — it is the least important thing here. */}
          <p className="eyebrow mt-8 flex items-baseline gap-2 text-fg-faint/60">
            {site.engineeredIn}
            <span aria-hidden="true" className="text-fg-faint/40">/</span>
            <LocalTime /> MYT
          </p>
        </div>
      </div>

      {/*
        The sign-off: large enough to read as the end of the page rather than a
        logo parked in a corner, but short of the full content width, which was
        overbearing. 2400w source so `next/image` has headroom for 2x displays.
      */}
      <a
        href="#top"
        className="group mt-16 flex flex-col items-start gap-6 sm:mt-20"
        aria-label={`${site.wordmark}, back to top`}
      >
        <Image
          src="/brand/lewix-wordmark-on-dark-2400w.png"
          alt={site.wordmark}
          width={2400}
          height={383}
          sizes="(max-width: 640px) 82vw, 34rem"
          className="h-auto w-[min(82vw,34rem)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        />
        {/* Boxed rather than bare: over a glyph field, a border is what makes
            this read as a control instead of more texture. */}
        <span className="eyebrow flex items-center gap-3 border border-line px-4 py-2.5 transition-colors group-hover:border-accent group-hover:text-accent">
          Back to top
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            ↑
          </span>
        </span>
      </a>
    </footer>
  );
}
