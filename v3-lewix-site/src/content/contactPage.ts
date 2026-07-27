/**
 * /contact page content.
 *
 * Structure follows trionn.com/contact: a light hero band that inverts against
 * the dark site, a multi-step brief rather than one long form, a direct-contact
 * block, and an accordion of questions.
 *
 * Everything asserted here is grounded in content that already exists in this
 * repo — `process`, `principles` and the About story. Nothing about pricing,
 * NDAs, contract terms or current availability appears, because none of that is
 * established anywhere and inventing company policy on a contact page is how
 * you end up committing the business to something it never agreed to.
 */

export interface BriefField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  required?: boolean;
  /** `select` only. */
  options?: readonly string[];
}

export interface BriefStep {
  num: string;
  title: string;
  intro: string;
  fields: readonly BriefField[];
}

export const contactPage = {
  eyebrow: 'Start a project',
  headline: 'Let’s find out what it takes.',
  // The counter runs 01/04 (three steps plus the review), so "three short
  // steps" flatly contradicted the number on screen two scrolls down.
  intro:
    'Three steps, then a review. You end up with a written brief you can send by email or WhatsApp, and a copy of it for yourself.',
} as const;

/**
 * The three steps mirror `contactBrief` on the home page, so someone who read
 * the "Before you write" block arrives already knowing what will be asked.
 */
// Annotated rather than `as const satisfies`: const-narrowing gives each field
// its own literal type, so `required` only exists on the members that set it
// and reading it off the union fails to compile.
export const briefSteps: readonly BriefStep[] = [
  {
    num: '01',
    title: 'Who you are',
    intro: 'So we know who we’re replying to.',
    fields: [
      { name: 'name', label: 'Name', placeholder: 'Your name', type: 'text', required: true },
      {
        name: 'email',
        label: 'Email',
        placeholder: 'you@company.com',
        type: 'email',
        required: true,
      },
      { name: 'company', label: 'Company', placeholder: 'Business name', type: 'text' },
    ],
  },
  {
    num: '02',
    title: 'What’s breaking',
    intro: 'The more specific the better. Hours lost, orders missed, numbers that don’t reconcile.',
    fields: [
      {
        name: 'problem',
        label: 'The problem',
        placeholder: 'What goes wrong, and roughly what it costs you in a week',
        type: 'textarea',
        required: true,
      },
      {
        name: 'stack',
        label: 'What you run today',
        placeholder: 'Accounting software, spreadsheets, WhatsApp groups, existing systems',
        type: 'text',
      },
    ],
  },
  {
    num: '03',
    title: 'Shape of it',
    intro: 'Rough is fine. This is to work out whether we’re the right people, not to quote you.',
    fields: [
      {
        name: 'timing',
        label: 'Timing',
        placeholder: 'When it needs to be live, and what’s driving that date',
        type: 'text',
      },
      {
        name: 'budget',
        label: 'Budget range',
        placeholder: 'Select a range',
        type: 'select',
        options: [
          'Not sure yet',
          'RM 5,000 – RM 10,000',
          'RM 10,000 – RM 25,000',
          'RM 25,000 – RM 50,000',
          'RM 50,000+',
        ],
      },
    ],
  },
];

/**
 * Answers are drawn from `process`, `principles` and the About story so the page
 * can't drift from what the rest of the site says.
 *
 * TODO: pricing model, NDAs and current availability are the three questions
 * prospects ask most, and all three need a decision from Lewix before they can
 * be answered here.
 */
export const faqs = [
  {
    q: 'What do you actually build?',
    a: 'The operational software a business runs on: inventory, invoicing, dispatch, production scheduling. The systems that stop the company when they stop. Not marketing sites.',
  },
  {
    q: 'How does a project start?',
    a: 'Discovery first, where we learn how the business actually operates. Then architecture — schema, API structure, user flows — before any interface gets built, so there are no surprises during the build.',
  },
  {
    q: 'Will it work with the software we already use?',
    a: 'That’s usually the point. Where the books are already in SQL Account, the system reads from there directly rather than asking anyone to type the same figure twice.',
  },
  {
    q: 'Where does it run?',
    a: 'On infrastructure we manage ourselves, not a platform we’d have to file a ticket with when something needs fixing. SSL, monitoring and backups are part of the deployment, not an add-on.',
  },
  {
    q: 'What happens after launch?',
    a: 'Launch is the start. Systems get second versions, new modules and audits as the business changes, and we’re still in the codebase long after handover.',
  },
  {
    q: 'What don’t you take on?',
    a: 'Work where nothing is measurably broken. If there isn’t a real operational cost to fix, we’re the wrong people and we’ll say so early.',
  },
] as const;
