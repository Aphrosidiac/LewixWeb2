/**
 * About / company story content.
 *
 * Originally lifted verbatim from the previous Lewix site
 * (`~/Desktop/dev/lewix-ai`): `src/app/about/page.tsx` for the story
 * paragraphs, `src/components/sections/home/Manifesto.tsx` for the manifesto.
 *
 * The manifesto, story and principle bodies have since been rewritten. The
 * ported copy said the same thing twice in one screen ("no templates" in the
 * manifesto, "not templates" in the story, both visible at once) and principle
 * 02 argued against its own title. Everything here is now written to be read
 * together, because the About section puts all of it on screen at once.
 *
 * The four principles are meant to be four *different* points. Anything the
 * manifesto or the story already says is not a principle. That's why 03 talks
 * about handoffs rather than "we run every layer" (the story says that), and
 * why the SQL Account integration lives in the story rather than a card.
 *
 * Two standing rules for this file:
 *   - No em dashes. Use a colon, a comma, or a full stop.
 *   - Do not state how many projects or systems Lewix has built. The industries
 *     are named, the tally is not. Same rule in site.ts.
 */

export interface Principle {
  num: string;
  title: string;
  description: string;
}

/**
 * The about page headline was rendered with a line break and an accented span:
 *   "A small team that" / "ships <accent>big systems</accent>"
 */
export const aboutHero = {
  eyebrow: "About Us",
  headingLine1: "A small team that",
  headingLine2Prefix: "ships ",
  headingLine2Accent: "big systems",
} as const;

/** The two-column company story on /about. Paragraph order matters. */
export const story = [
  "Lewix.ai builds the operational software a business actually runs on: inventory, invoicing, dispatch, production scheduling. The systems that stop the company when they stop.",
  "Today that means car workshops, vegetable supply, food delivery and label printing. Each system is written around how the business already works: where the books are already in SQL Account, it reads from there directly instead of asking anyone to type the same figure twice.",
  "All of it runs on infrastructure we manage ourselves, not a platform we'd have to file a ticket with when something needs fixing.",
] as const;

/** The full-width scroll-revealed manifesto statement on the home page. */
export const manifesto =
  "Most software gets demoed. Ours gets used, every day, by people whose work stops when it breaks. That's a different standard, and it's the one we build to.";

export const principlesCopy = {
  eyebrow: "How We Work",
  heading: "Our principles",
} as const;

export const principles = [
  {
    // "Don't Just Pitch", not "Don't Pitch": the original read as a claim never
    // to sell, printed on a sales page. The concession makes it legible.
    //
    // This card absorbed the old 02, "Built To Stay Up". Both were promising
    // that what you get is real working software (one denying a document, the
    // other denying a prototype), and the manifesto above the row says it a
    // third time. One card carries it now; "or a prototype" is what's left of
    // the merge.
    num: "01",
    title: "Ship, Don't Just Pitch",
    description:
      "The deliverable is a running system, not a document or a prototype. We build it, deploy it, and hand over the keys.",
  },
  {
    // The slot freed by the merge. Nothing on the page said what happens after
    // launch, which is where most of the actual work has gone: second and third
    // versions, audits, new modules years on. It's also the clearest line
    // between this and hiring a freelancer.
    num: "02",
    title: "Launch Is The Start",
    description:
      "Systems get second versions, new modules, and audits as the business changes. We're still in the codebase long after handover.",
  },
  {
    // Narrowed to the handoff point. The wider "we run every layer" claim was
    // already made by the Ethos paragraph sitting directly above this row.
    num: "03",
    title: "Own the Stack",
    description:
      "One team writes the schema, the screens and the deploy script. Nothing gets lost in a handoff, because there isn't one.",
  },
  {
    num: "04",
    title: "Real Problems Only",
    description:
      "We take on work where something is measurably broken: hours lost, orders missed, numbers that don't reconcile.",
  },
] as const satisfies readonly Principle[];
