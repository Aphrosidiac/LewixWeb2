/**
 * The /about page.
 *
 * Deliberately NOT the home page's About section rewritten. That section
 * (`about.ts`) is the persuasive one: the manifesto, the story, the four
 * principles. Repeating it here would put the same paragraphs on two URLs and
 * give a crawler two candidates for the same content, which helps neither.
 *
 * This page answers a different question, and it is the question an answer
 * engine asks before it will recommend anybody: is this a real company, what
 * exactly do they do, and how would working with them go. So it leads with the
 * registered entity, states the engagement in order, and then says plainly who
 * the work is not for. The last part is the useful half. Every agency page
 * claims to be right for everyone, which makes all of them useless for
 * choosing.
 *
 * House style: no em dashes, and no project tallies.
 */

export const aboutPageCopy = {
  eyebrow: 'About',
  headingLine1: 'The company behind',
  headingLine2Accent: 'the systems',
  intro:
    'The plain version: who we are, what we build, how a project actually runs, and who we are not the right people for.',
} as const;

/**
 * Opening paragraphs. Overlap with `story` in about.ts is limited to the one
 * sentence that defines the work, which has to be here because this is the
 * page that gets quoted.
 */
export const aboutIntro = [
  'Lewix AI Sdn Bhd, trading as LEWIX, is a software company in Kuala Lumpur. We build the operational software a business runs on: inventory, invoicing, dispatch, production scheduling. The systems that stop the company when they stop.',
  'That work is currently live in car workshops, vegetable supply, food delivery and label printing. Each system is written around how the business already works rather than asking the business to change to suit it, which in practice usually means reading directly from the accounting package the books already live in.',
  'We run all of it on infrastructure we manage ourselves. When something needs fixing at two in the morning, there is no ticket queue between us and the server.',
] as const;

export const factsCopy = {
  heading: 'On the record',
  note: 'The registration is public and checkable at the Companies Commission of Malaysia.',
} as const;

export interface AboutFact {
  label: string;
  value: string;
  /** Rendered as a link when present. */
  href?: string;
}

export const engagementCopy = {
  heading: 'How a project runs',
  note: 'Five stages, in this order. Discovery is not a formality: it is where we find out whether there is a system worth building at all.',
} as const;

export interface AboutList {
  heading: string;
  note: string;
  items: readonly string[];
}

export const rightFor: AboutList = {
  heading: 'Right for',
  note: 'Where we do our best work.',
  items: [
    'Something in the operation is measurably broken. Hours lost re-keying the same figure, orders missed, numbers that will not reconcile.',
    'The business already runs real volume and the tools have stopped keeping up: spreadsheets, WhatsApp groups, an accounting package doing a job it was never designed for.',
    'You want the new system to read from what you already use rather than replace all of it at once.',
    'You expect to keep changing it. Most of our work happens after the first launch, not before it.',
  ],
} as const;

export const notRightFor: AboutList = {
  heading: 'Not right for',
  note: 'We would rather say this now than three weeks into a call.',
  items: [
    'Nothing is measurably broken. If there is no operational cost to fix, we are the wrong people and we will say so early.',
    'A marketing site or a brochure. That is real work, and it is not the work we do.',
    'A budget below the starting price. Projects start at RM 8,000, and a range opening under it is one we would only have to turn down.',
    'A finished specification to implement without discovery. If the thinking is already done, you want a contractor, and we would be an expensive one.',
  ],
} as const;

export const aboutCta = {
  heading: 'Still sounds like us?',
  body: 'Tell us what is costing you hours. You will get back what it takes to build, what it takes to run, and whether we are the right people for it.',
  label: 'Start a project',
  href: '/contact',
} as const;
