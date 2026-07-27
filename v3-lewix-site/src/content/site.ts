/**
 * Global site content — nav, footer, hero, marquee, stats, contact details, metadata.
 *
 * Lifted verbatim from the previous Lewix site (`~/Desktop/dev/lewix-ai`):
 *   - src/app/layout.tsx                              → metadata (title, description, keywords, OG)
 *   - src/components/layout/Navbar.tsx                → `links`, wordmark
 *   - src/components/layout/Footer.tsx                → `navLinks`, email, wordmark, bottom metadata
 *   - src/components/sections/home/Hero.tsx           → est. line, wordmark, tagline, CTAs, service tags
 *   - src/components/sections/home/MarqueeStrip.tsx   → `items`
 *   - src/components/sections/home/Numbers.tsx        → `stats`
 *   - src/components/sections/home/HomeCTA.tsx        → closing CTA copy
 *   - src/app/contact/page.tsx                        → email, WhatsApp numbers, location, social,
 *                                                       form labels/placeholders, budget ranges
 *   - src/app/work/page.tsx                           → the "Coming Soon" work page copy
 *
 * Copy is preserved EXACTLY as written. Do not rewrite or "polish" it.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface WhatsAppContact {
  /** Person the number belongs to. */
  name: string;
  /** Display formatting as shown on the old site. */
  display: string;
  /** Digits only, for wa.me links. */
  number: string;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Brand + metadata                                                    */
/* ------------------------------------------------------------------ */

export const site = {
  name: "LEWIX",
  /**
   * The registered entity, not the trading brand. The ported copy had this as
   * "Lewix.ai" everywhere, which is the brand; the company is Lewix AI Sdn Bhd
   * and that is what the copyright line has to name.
   *
   * "Lewix.ai" is still correct in running prose (see about.ts) — it is only
   * legal notices that need the full entity.
   */
  legalName: "Lewix AI Sdn Bhd",
  wordmark: "LEWIX",
  /** Rendered under the giant wordmark in the hero. */
  wordmarkSuffix: ".AI",
  url: "https://lewix.ai",
  /** Hero top metadata line. */
  established: "(Est. 2026, Malaysia)",
  /** Footer metadata. */
  engineeredIn: "Engineered in Malaysia",
  /** Footer copyright; the year is rendered dynamically. */
  copyrightHolder: "Lewix AI Sdn Bhd",
} as const;

export const metadata = {
  title: "LEWIX · We Engineer Systems That Run Businesses",
  description:
    "Lewix.ai builds production-grade systems, ERPs, and web applications for businesses that need to move fast.",
  keywords: ["software engineering", "ERP", "web development", "AI", "systems"],
  openGraph: {
    title: "LEWIX · We Engineer Systems That Run Businesses",
    description:
      "Production-grade systems for businesses that need to move fast.",
    url: "https://lewix.ai",
    siteName: "LEWIX",
    type: "website",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

/** Navbar links (desktop pill nav + mobile overlay). Identical set used in the footer. */
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavItem[];

/** Footer link row — same five nav links, plus the email pushed to the right. */
export const footerLinks = navItems;

export const footerEmail = {
  label: "hello@lewix.ai",
  href: "mailto:hello@lewix.ai",
} as const;

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  /**
   * Hero kicker. Taken from the official brand board
   * (`public/brand/lewix-brand-preview.jpg`) — sharper and more specific than
   * the studio-boilerplate line it replaced.
   */
  kicker: "A small team that ships big systems",
  /**
   * Retired from the hero in favour of `kicker`, but kept: it's real marketing
   * copy and still reads well as body text in the About section.
   * Rendered uppercase with hard line breaks on the original site.
   */
  tagline:
    "We align strategy, design, and engineering into production-grade systems. Your vision, executed with precision and shipped to production.",
  ctas: [
    { label: "Get in Touch", href: "/contact" },
    { label: "View Work", href: "/work" },
  ],
  /** Bottom-of-hero service tags, separated by "/" in the original. */
  // Drives both the hero floor and the loading screen. "Logistics" is dropped
  // here only — it's still a full service in `services` and a case-study
  // category, just not one of the headline tags.
  serviceTags: ["Systems", "Web Apps", "AI"],
} as const;

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */

// No project tallies here. The band names capabilities, not volume.
export const marqueeItems = [
  "Systems In Production",
  "Full-Stack Engineering",
  "AI Integration",
  "Real Business Solutions",
  "24/7 Uptime",
  "End-to-End Delivery",
] as const;

/* ------------------------------------------------------------------ */
/* Stats / numbers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Animated counters from the old site. NOT rendered anywhere in v3 — kept only
 * so the ported content set stays complete.
 *
 * "10+ Production Systems" was removed on request: the site does not publish a
 * project tally. If these ever get rendered, don't reintroduce one.
 *
 * TODO: "7+ Active Clients" is the same signal in different clothing, so it
 * probably shouldn't ship either. TODO: "3+ Years Shipping" contradicts the
 * hero's "(Est. 2026, Malaysia)"; confirm which is right.
 */
export const stats = [
  { value: 7, suffix: "+", label: "Active Clients" },
  { value: 3, suffix: "+", label: "Years Shipping" },
  { value: 99.99, suffix: "%", label: "Uptime" },
] as const satisfies readonly Stat[];

/* ------------------------------------------------------------------ */
/* Home closing CTA                                                    */
/* ------------------------------------------------------------------ */

export const homeCta = {
  /** Rendered as two lines, the second in the accent colour. */
  headingLine1: "Let's build",
  headingLine2Accent: "something real.",
  body: "Tell us about your project. We move fast and ship production-ready.",
  ctaLabel: "Get in Touch",
  ctaHref: "/contact",
} as const;

/* ------------------------------------------------------------------ */
/* Selected work section (home)                                        */
/* ------------------------------------------------------------------ */

export const featuredWorkCopy = {
  eyebrow: "Selected Work",
  heading: "Projects that ship",
  viewAllLabel: "View all projects",
  viewAllHref: "/work",
} as const;

/* ------------------------------------------------------------------ */
/* Work index page                                                     */
/* ------------------------------------------------------------------ */

/**
 * TODO: the old /work index was a placeholder — it never listed the case studies,
 * even though all six existed at /work/[slug]. Kept here for reference only.
 */
export const workPagePlaceholder = {
  eyebrow: "Our Work",
  heading: "Coming Soon",
  body: "We're preparing our case studies. In the meantime, get in touch to learn about what we've built.",
  ctaLabel: "Get in Touch",
  ctaHref: "/contact",
} as const;

/** Copy from the individual case study page shell. */
export const caseStudyPageCopy = {
  backLabel: "All Projects",
  backHref: "/work",
  challengeHeading: "The Challenge",
  solutionHeading: "The Solution",
  capabilitiesHeading: "What It Does",
  ctaLabel: "Start a Similar Project",
  ctaHref: "/contact",
  notFoundHeading: "Project not found",
  notFoundLinkLabel: "Back to work",
} as const;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  eyebrow: "Get in Touch",
  /**
   * Was "Let's build / together" over "Tell us about your project." Both are
   * true of literally any studio, so the closing section asked for nothing and
   * promised nothing. It now names the symptom a client would recognise and
   * says what they get back, including the possibility of a no.
   */
  headline: "Tell us what's costing you hours.",
  intro:
    "We'll come back with what it takes to build, what it takes to run, and whether we're the right people for it.",
  /** Kept from the old copy; the only concrete commitment on the page. */
  responseTime: "Replies within 24 hours",
  /**
   * The two numbers below are founders' personal lines, which is unusual enough
   * to be worth saying out loud rather than leaving as an unexplained list.
   */
  directNote: "Both numbers reach a founder, not a sales desk.",
  email: {
    label: "hello@lewix.ai",
    href: "mailto:hello@lewix.ai",
  },
  whatsapp: [
    {
      name: "Lewis",
      display: "+60 10-280 8533",
      number: "60102808533",
      href: "https://wa.me/60102808533",
    },
    {
      name: "Noel",
      display: "+60 12-381 2500",
      number: "60123812500",
      href: "https://wa.me/60123812500",
    },
  ],
  location: "Malaysia",
  social: [
    // TODO: LinkedIn href was "#" on the old site — real URL still needed.
    { label: "LinkedIn", href: "#" },
  ],
} as const;

/**
 * Contact form fields as they appeared on the old site.
 * TODO: the original form had NO submit handler, no action, and no validation —
 * "Send Message" did nothing. Wire this up on the new site.
 */
export const contactForm = {
  fields: [
    { name: "name", label: "Name", type: "text", placeholder: "Your name" },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your@email.com",
    },
    {
      name: "company",
      label: "Company",
      type: "text",
      placeholder: "Company name",
    },
    {
      name: "budget",
      label: "Budget Range",
      type: "select",
      placeholder: "Select a range",
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Tell us about your project...",
    },
  ],
  budgetRanges: [
    { value: "", label: "Select a range" },
    { value: "5k-10k", label: "RM 5,000 - RM 10,000" },
    { value: "10k-25k", label: "RM 10,000 - RM 25,000" },
    { value: "25k-50k", label: "RM 25,000 - RM 50,000" },
    { value: "50k+", label: "RM 50,000+" },
  ],
  submitLabel: "Send Message",
} as const;

/**
 * Prompt for the first message, shown at the foot of the Contact section.
 *
 * Replaced a "Capabilities" list of the four `services` titles. That list sat
 * one screen below the Work filter bar, which only offers the categories with
 * case studies behind them (Systems & ERP, Logistics) — so the page advertised
 * four capabilities and evidenced two. It was also the wrong question to answer
 * at the point where someone has decided to write.
 *
 * These three are the answers Discovery needs first, so a message containing
 * them can be replied to properly instead of with more questions.
 */
export const contactBrief = [
  {
    num: "01",
    title: "The problem",
    description: "What's breaking, and roughly what it costs you in a week.",
  },
  {
    num: "02",
    title: "What you run today",
    description:
      "Accounting software, spreadsheets, WhatsApp groups. Whatever the business is currently held together with.",
  },
  {
    num: "03",
    title: "Timing",
    description: "When it needs to be live, and what's driving that date.",
  },
] as const;

/** Section labels used on the contact info card. */
export const contactLabels = {
  email: "Email",
  whatsapp: "WhatsApp",
  location: "Location",
  social: "Social",
} as const;
