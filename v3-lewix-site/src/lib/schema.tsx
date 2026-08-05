/**
 * JSON-LD structured data.
 *
 * The site shipped with none of this. Structured data is what lets a search
 * engine treat "LEWIX" as a company with a country, a founding date and a
 * registration number rather than as an unfamiliar string on a page, and it
 * is disproportionately load-bearing for AI answer engines, which lean on
 * explicit machine-readable facts far harder than Google's ten blue links
 * ever did.
 *
 * Everything below is derived from `src/content` rather than retyped, so the
 * schema cannot drift away from what the page actually says. Nothing here
 * asserts a fact the site does not already state in prose.
 *
 * Deliberately NOT used: `LocalBusiness` and its `ProfessionalService`
 * subtype. Both expect a street address and opening hours, and LEWIX
 * publishes neither. Claiming a storefront that does not exist is the kind
 * of thing that gets rich results revoked, so this stays on `Organization`.
 */

import { caseStudies, contact, registration, site, socialProfiles } from '@/content';
import { faqs } from '@/content/contactPage';

/** Stable node ids, so separate blocks can reference one another by @id. */
const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

/**
 * `<` is the only character that can break out of a `<script>` block, and
 * `JSON.stringify` does not escape it. Every emitter runs through here.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * The company itself. Referenced by @id from the website, the case studies
 * and the FAQ block, so the graph has one organization node rather than four
 * copies that a parser has to guess are the same entity.
 */
export function organizationSchema() {
  const sameAs = Object.values(socialProfiles).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/lewix-logomark-gradient-512.png`,
    image: `${site.url}/opengraph-image`,
    // The locked LinkedIn About opening. Answer engines quote this field
    // directly when asked "what is LEWIX", so it is the positioning line
    // rather than a keyword list.
    description:
      "We build the systems real businesses run on: logistics platforms tracking deliveries in real time, ERPs handling live inventory, AI agents that don't sleep. Not demos. Not prototypes. Production.",
    slogan: 'Transcending the Industry',
    foundingDate: registration.foundingDate,
    email: contact.email.label,
    // Only include profiles that have a real URL. See the TODO on
    // `socialProfiles` — this array is the single strongest entity signal
    // available and is currently empty.
    ...(sameAs.length > 0 ? { sameAs } : {}),
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'Malaysia Company Registration No.',
        value: registration.companyNo,
      },
      {
        '@type': 'PropertyValue',
        name: 'Malaysia Company Registration No. (old format)',
        value: registration.oldFormat,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: registration.addressLocality,
      addressCountry: registration.addressCountry,
    },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    // Both numbers reach a founder, which the contact section says in prose.
    contactPoint: contact.whatsapp.map((person) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      name: person.name,
      telephone: `+${person.number}`,
      email: contact.email.label,
      areaServed: 'MY',
      availableLanguage: ['en', 'ms'],
    })),
    founder: contact.whatsapp.map((person) => ({
      '@type': 'Person',
      name: person.name,
    })),
    // Plain-language capability list. These are the phrases a business owner
    // would use, matching the standing rule in caseStudies.ts.
    knowsAbout: [
      'Custom ERP systems',
      'Inventory and stock management software',
      'Logistics and delivery dispatch systems',
      'Invoicing and order management',
      'Production scheduling',
      'SQL Account integration',
      'AI agents for business operations',
    ],
    makesOffer: {
      '@type': 'Offer',
      name: 'Custom business system development',
      priceSpecification: {
        '@type': 'PriceSpecification',
        // The published floor, from `pricing.amount`. Marked as a minimum so
        // it cannot be read as a typical project price.
        minPrice: 8000,
        priceCurrency: 'MYR',
      },
    },
  };
}

/** The site as a thing, distinct from the company that publishes it. */
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: 'en-MY',
    publisher: { '@id': ORG_ID },
  };
}

/**
 * The seven questions from the contact page.
 *
 * This is the single highest-value block on the site for AI search: the
 * answers are already written as complete, self-contained statements, which
 * is exactly the shape an answer engine can lift. "What does it cost?"
 * answering with a real number is something almost no competitor in this
 * market publishes at all.
 */
export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${site.url}/contact#faq`,
    publisher: { '@id': ORG_ID },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/**
 * A case study page. `Article` would over-claim (these are not journalism and
 * have no author or publish date), so each one is a `CreativeWork` about the
 * system, with the client named as the thing it was produced for.
 */
export function caseStudySchema(slug: string) {
  const study = caseStudies.find((entry) => entry.slug === slug);
  if (!study) return null;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${site.url}/work/${study.slug}#case-study`,
        name: `${study.title}: ${study.type}`,
        headline: study.title,
        description: study.description,
        url: `${site.url}/work/${study.slug}`,
        inLanguage: 'en-MY',
        creator: { '@id': ORG_ID },
        about: {
          '@type': 'Organization',
          name: study.client,
        },
        keywords: study.capabilities.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${site.url}/work/${study.slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${site.url}/#work`,
          },
          { '@type': 'ListItem', position: 3, name: study.title },
        ],
      },
    ],
  };
}

/**
 * Renders a `<script type="application/ld+json">`. React strips unknown props
 * from script tags and will not render a JSON body as a child, so
 * `dangerouslySetInnerHTML` is the supported route; `serializeJsonLd` is what
 * makes it safe.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
