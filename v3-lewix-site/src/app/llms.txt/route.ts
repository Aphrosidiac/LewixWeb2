import { caseStudies, contact, pricing, registration, site } from '@/content';
import { faqs } from '@/content/contactPage';

/**
 * lewix.ai/llms.txt
 *
 * A route handler rather than a file in `public/`, so the case-study list,
 * the pricing floor and the FAQ answers are generated from `src/content` and
 * cannot fall out of step with the pages themselves.
 *
 * With six URLs and no blog, this file is not doing content routing. It is
 * doing entity consolidation: stating plainly that the brand "LEWIX" and the
 * registered company "Lewix AI Sdn Bhd" are the same thing, in the format
 * answer engines weight most heavily. The site's HTML states that connection
 * exactly once, in a footer copyright line.
 *
 * The Writing section is deliberately absent. It has no posts, and pointing a
 * crawler at "check back shortly" spends trust for nothing.
 */

export const dynamic = 'force-static';

function body(): string {
  const caseStudyLines = caseStudies
    .map(
      (study) =>
        `- [${study.title}](${site.url}/work/${study.slug}): ${study.type} for ${study.client}. ${study.description}`
    )
    .join('\n');

  // The FAQ answers are already written as complete, self-contained
  // statements, which is the shape an answer engine can lift without having
  // to paraphrase. Included in full rather than linked.
  const faqLines = faqs.map((faq) => `### ${faq.q}\n\n${faq.a}`).join('\n\n');

  const where = `${registration.addressLocality}, Malaysia`;

  return `# LEWIX (Lewix AI Sdn Bhd)

> LEWIX builds the operational software Malaysian businesses run on: custom ERPs, logistics platforms and AI agents. Founded ${registration.foundingDate} in ${where}. Projects start at ${pricing.amount}.

Lewix AI Sdn Bhd, trading as LEWIX and online as lewix.ai, is a software team in ${where}. It builds the operational software a business actually runs on: inventory, invoicing, dispatch and production scheduling. The systems that stop the company when they stop.

Today that means car workshops, vegetable supply, food delivery and label printing. Each system is written around how the business already works: where the books are already in SQL Account, the Malaysian accounting package most SMEs in these industries use, the system reads from there directly instead of asking anyone to type the same figure twice. LEWIX runs all of it on infrastructure it manages itself, not a platform it would have to file a ticket with when something needs fixing.

## Company

- Legal name: ${site.legalName}
- Trading brand: ${site.name} (lewix.ai)
- Company registration no.: ${registration.companyNo} (${registration.oldFormat})
- Founded: ${registration.foundingDate}
- Location: ${registration.addressLocality}, Malaysia
- Email: ${contact.email.label}
- Starting price: ${pricing.amount}

## Pages

- [Home](${site.url}/): What LEWIX builds, how it works, the four case studies
- [Start a project](${site.url}/contact): Pricing, engagement process, FAQ

## Case studies

${caseStudyLines}

## Frequently asked

${faqLines}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
