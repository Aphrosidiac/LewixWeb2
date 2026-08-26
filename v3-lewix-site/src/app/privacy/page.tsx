import type { Metadata } from 'next';
import { Reveal } from '@/components/layout/Reveal';
import { contact, privacyCopy, privacyMeta, privacySections, site } from '@/content';

/**
 * /privacy
 *
 * The site had none, which for a page carrying a contact form and two personal
 * WhatsApp numbers is a gap rather than an omission. It is also one of the
 * three pages an answer engine checks before it will treat a company as real.
 *
 * The copy is in `src/content/legal.ts` and is written from what this codebase
 * actually does. Read the note at the top of that file before editing either.
 *
 * Structurally this is the quiet end of the design system: one light band, one
 * column, no sticky hero and no ambient glow. A privacy policy that arrives
 * with choreography is a privacy policy nobody trusts.
 */
export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What LEWIX collects, which is almost nothing. No analytics, no cookies, and a contact form that sends nothing to us on its own.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: `Privacy · ${site.name}`,
    description:
      'No analytics, no cookies, no tracking. What we hold is what you email us, and for how long.',
    url: '/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <main>
      <Reveal />

      {/* `data-light-surface` inverts SiteHeader; without it the white pill
          disappears into the band. Opaque, like every band on the site: the
          ASCII canvas is fixed behind every route. */}
      <section
        data-light-surface
        className="bg-[#f1f1ef] px-6 pt-36 pb-24 text-[#0a0a0c] sm:px-10 sm:pt-44 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0a0a0c]/45"
          >
            {privacyCopy.eyebrow}
          </p>

          <h1
            data-reveal
            data-reveal-delay="60"
            className="mt-8 font-display font-semibold text-5xl leading-[0.95] tracking-tight sm:text-7xl"
          >
            {privacyCopy.heading}
          </h1>

          <p
            data-reveal
            data-reveal-delay="120"
            className="mt-8 max-w-xl text-base leading-relaxed text-[#0a0a0c]/60"
          >
            {privacyCopy.intro}
          </p>

          <p
            data-reveal
            data-reveal-delay="180"
            className="mt-10 border-t border-[#0a0a0c]/12 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0a0a0c]/40"
          >
            Last updated {privacyMeta.updatedDisplay}
          </p>
        </div>
      </section>

      <section className="bg-bg px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto w-full max-w-3xl">
          {privacySections.map((section, i) => (
            <div
              key={section.heading}
              data-reveal
              data-reveal-delay={i === 0 ? undefined : '60'}
              className="border-t border-line py-12 first:border-t-0 first:pt-0"
            >
              <h2 className="font-display font-semibold text-2xl leading-snug tracking-tight text-fg sm:text-3xl">
                {section.heading}
              </h2>
              {section.body.map((para) => (
                <p key={para} className="mt-5 text-base leading-relaxed text-fg-muted">
                  {para}
                </p>
              ))}
            </div>
          ))}

          <div data-reveal className="border-t border-line pt-12">
            <p className="text-base leading-relaxed text-fg-muted">
              Questions about any of this, or a request under the section above, go to{' '}
              <a
                href={contact.email.href}
                className="text-fg underline decoration-fg-faint underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {contact.email.label}
              </a>
              .
            </p>
            <p className="mt-4 text-sm text-fg-faint">
              {site.legalName}, {site.url.replace('https://', '')}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
