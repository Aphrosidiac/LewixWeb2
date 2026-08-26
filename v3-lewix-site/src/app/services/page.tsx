import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/layout/Reveal';
import { metadata as siteMeta, pricing, process, services, servicesCopy } from '@/content';

/**
 * /services
 *
 * The fourth of the four routes an evaluating agent guessed at and did not
 * find, alongside /work, /about and /pricing. The copy has been sitting in
 * `src/content/services.ts` since the port, rendered nowhere but the home
 * page's short-description variants.
 *
 * This page carries the FULL descriptions plus the feature lists, which the
 * home page deliberately does not. That is the difference between the two and
 * the reason both can exist: the home section is a summary that has to fit a
 * scroll stage, this is the reference.
 *
 * The five-stage process lives here rather than on /about. It was on /about
 * first and is moved in the same commit that adds this page: `servicesCopy`
 * has a `processSection` heading written for this page, the previous site put
 * it here, and rendering the same five paragraphs on two routes is exactly
 * what the content files keep warning against.
 */
export const metadata: Metadata = {
  title: 'Services',
  description: `${servicesCopy.page.intro} Systems and ERPs, web applications, AI integration, logistics and delivery. Projects start at ${pricing.amount}.`,
  alternates: { canonical: '/services' },
  openGraph: {
    title: `Services · ${siteMeta.openGraph.siteName}`,
    description: servicesCopy.page.intro,
    url: '/services',
    type: 'website',
  },
};

export default function ServicesPage() {
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
            {servicesCopy.page.eyebrow}
          </p>

          <h1
            data-reveal
            data-reveal-delay="60"
            className="mt-8 max-w-4xl font-display font-semibold text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {servicesCopy.page.heading}
          </h1>

          <p
            data-reveal
            data-reveal-delay="120"
            className="mt-10 max-w-xl text-base leading-relaxed text-[#0a0a0c]/60"
          >
            {servicesCopy.page.intro}
          </p>
        </div>
      </section>

      {/* One band per service. Full description left, the feature list right,
          so the list reads as evidence for the paragraph rather than a
          separate claim. */}
      <section className="bg-bg px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto w-full max-w-6xl">
          {services.map((service, i) => (
            <div
              key={service.num}
              data-reveal
              data-reveal-delay={`${Math.min(i, 3) * 60}`}
              className="grid gap-x-10 gap-y-6 border-b border-line py-12 sm:grid-cols-12 sm:py-16"
            >
              <div className="sm:col-span-5">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {service.num}
                </span>
                <h2 className="mt-4 font-display font-semibold text-3xl leading-none tracking-tight text-fg sm:text-4xl">
                  {service.title}
                </h2>
              </div>

              <div className="sm:col-span-4">
                <p className="text-sm leading-relaxed text-fg-muted sm:text-base">
                  {service.description}
                </p>
              </div>

              <ul className="sm:col-span-3">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-b border-line py-2.5 text-xs text-fg-faint last:border-b-0"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        data-light-surface
        className="bg-[#f1f1ef] px-6 py-28 text-[#0a0a0c] sm:px-10 sm:py-36"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div data-reveal className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0a0a0c]/45">
              {servicesCopy.processSection.eyebrow}
            </p>
            <h2 className="mt-6 font-display font-semibold text-4xl leading-none tracking-tight sm:text-6xl">
              {servicesCopy.processSection.heading}
            </h2>
          </div>

          <ol className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((step, i) => (
              <li key={step.step} data-reveal data-reveal-delay={`${Math.min(i, 3) * 60}`}>
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display font-semibold text-xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0a0a0c]/60">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg px-6 py-28 sm:px-10 sm:py-36">
        <div data-reveal className="mx-auto w-full max-w-3xl">
          <h2 className="font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
            {servicesCopy.page.ctaLabel}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
            {pricing.note} Projects start at {pricing.amount}.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={servicesCopy.page.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              {servicesCopy.page.ctaLabel}
            </Link>
            <Link href="/work" className="text-sm text-fg-muted transition-colors hover:text-accent">
              See what that looks like built
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
