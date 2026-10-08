import Link from 'next/link';
import { Section } from './Section';
import { SystemList } from '@/components/work/SystemList';
import { ProductCards } from '@/components/work/ProductCards';
import { workIndexCopy } from '@/content';

/**
 * Home page Work section: the client systems, then the products Lewix runs
 * itself. Client systems are named by what they are; the businesses behind
 * them never appear (see src/content/caseStudies.ts).
 */
export function Work() {
  return (
    <Section id="work" num="03" title="Work">
      <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-fg-muted">
        Factories, warehouses, fleets, workshops and shops. Each system is built to replace whatever
        the business was holding itself together with. Our clients stay confidential, so we name
        the system and never the business.
      </p>

      <SystemList />

      <div className="mt-28 sm:mt-36">
        <div className="mb-12 grid gap-6 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="eyebrow">{workIndexCopy.productsEyebrow}</p>
            <h3 className="mt-4 font-display font-semibold text-4xl leading-none tracking-tight text-fg sm:text-5xl">
              {workIndexCopy.productsHeading}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-fg-muted sm:col-span-5 sm:col-start-8 sm:self-end">
            {workIndexCopy.productsIntroSingle}
          </p>
        </div>
        <ProductCards only={['smoothsail']} />
        <div className="mt-12 text-center">
          <Link href="/work" className="eyebrow inline-block py-2 transition-colors hover:text-accent">
            All work &rarr;
          </Link>
        </div>
      </div>
    </Section>
  );
}
