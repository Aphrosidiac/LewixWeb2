/**
 * Services + process content.
 *
 * Lifted verbatim from the previous Lewix site (`~/Desktop/dev/lewix-ai`):
 *   - src/app/services/page.tsx                    → `services`, `process`, page hero copy
 *   - src/components/sections/home/Services.tsx    → `services` (short home-page
 *                                                     variants: num + shorter description)
 *
 * Copy is preserved EXACTLY as written. Do not rewrite or "polish" it.
 */

export interface Service {
  /** Zero-padded index used as a visual label, e.g. "01". */
  num: string;
  title: string;
  /** Full description, from the /services page. */
  description: string;
  /** Shorter description used on the home page services list. */
  shortDescription: string;
  features: readonly string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const services = [
  {
    num: "01",
    title: "Systems & ERPs",
    description:
      "Complete business management systems built from scratch. Inventory, invoicing, CRM, production tracking, audit logs. Everything your operation needs in one place.",
    shortDescription:
      "End-to-end business management: inventory, invoicing, CRM, production, and everything your operation needs.",
    features: [
      "Inventory Management",
      "Invoice & Payment Tracking",
      "Customer CRM",
      "Production Boards",
      "Audit Logging",
      "Role-Based Access",
    ],
  },
  {
    num: "02",
    title: "Web Applications",
    description:
      "High-performance web applications that scale with your business. Dashboards, portals, marketplaces, and SaaS platforms engineered for speed and reliability.",
    shortDescription:
      "Dashboards, portals, marketplaces, and SaaS platforms engineered for speed and scale.",
    features: [
      "Admin Dashboards",
      "Client Portals",
      "Real-Time Data",
      "API Integrations",
      "Multi-Tenant Architecture",
      "Performance Optimized",
    ],
  },
  {
    num: "03",
    title: "AI Integration",
    description:
      "Intelligent features powered by AI, embedded directly into your existing systems. Not AI for the sake of AI, but practical intelligence that saves time.",
    shortDescription:
      "Chatbots, automation, document processing, and smart workflows embedded into your systems.",
    features: [
      "AI Chat Assistants",
      "Document Processing",
      "Smart Workflows",
      "Content Generation",
      "Data Analysis",
      "Voice & TTS",
    ],
  },
  {
    num: "04",
    title: "Logistics & Delivery",
    description:
      "Complete delivery and distribution platforms. Order management, driver tracking, route optimization, kitchen display systems, and fleet management.",
    shortDescription:
      "Order management, driver tracking, route optimization, and fleet management in real-time.",
    features: [
      "Order Management",
      "Driver Mobile Apps",
      "Real-Time Tracking",
      "Route Optimization",
      "Kitchen Display",
      "Proof of Delivery",
    ],
  },
] as const satisfies readonly Service[];

export const process = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We learn your business inside out. What works, what doesn't, what keeps you up at night.",
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "We design the system first: database schema, API structure, user flows. No surprises during build.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We code. Fast, focused sprints with daily progress. You see working software within the first week.",
  },
  {
    step: "04",
    title: "Deploy",
    description:
      "Your system goes live on production infrastructure. SSL, monitoring, backups, all handled.",
  },
  {
    step: "05",
    title: "Support",
    // Opened with "We don't disappear after launch", which is now the whole
    // point of principle 02 in about.ts. Same claim, two places; this one keeps
    // the mechanics and drops the slogan.
    description:
      "Ongoing maintenance, feature additions, and system evolution as the business changes.",
  },
] as const satisfies readonly ProcessStep[];

/** Section headings / intro copy from the /services page and the home services block. */
export const servicesCopy = {
  page: {
    eyebrow: "Services",
    heading: "What we build",
    intro:
      "We specialize in production-grade systems for businesses that need to move fast and ship reliably.",
    ctaLabel: "Start a Project",
    ctaHref: "/contact",
  },
  processSection: {
    eyebrow: "Process",
    heading: "How we work",
  },
  homeSection: {
    eyebrow: "What We Build",
    heading: "Engineered for real business",
  },
} as const;
