/**
 * Case study content.
 *
 * Rewritten from the actual project repositories on 2026-07-28 — not from the
 * old lewix-ai marketing copy, and not from memory:
 *   - ~/Desktop/dev/Girpack           (README.md, STATUS.md)
 *   - ~/Desktop/dev/HarvestGrow       (README.md)
 *   - ~/Desktop/dev/ShudaLogisticsV2  (README.md, frontend routes)
 *   - ~/Desktop/dev/DreamGarage       (README.md, frontend routes)
 *
 * Two standing rules for this file:
 *
 *  1. NO TECHNICAL JARGON. The reader is a business owner, not an engineer.
 *     Frameworks, databases and hosting mean nothing to them. Every entry says
 *     what was going wrong and what the system does about it, in the words the
 *     client would use. `capabilities` replaced the old `tech` stack list for
 *     exactly this reason.
 *  2. Only claim what the repository actually shows. Girpack's own STATUS.md
 *     records nine features previously marked "fixed and verified" that did not
 *     exist in the codebase — that habit must not reach the marketing site.
 *     Anything uncertain is left out rather than softened.
 *  3. `title` names the SYSTEM, not the client. "Girpack" tells a stranger
 *     nothing; "Packaging Supplies MIS" tells them whether this is their
 *     problem. The client names moved to the Trusted By band on the home page,
 *     where four logos do that job better than four headings did. `client` is
 *     still recorded here because the schema credits it, but it must not come
 *     back into a title, a heading or the llms.txt line.
 */

export type CaseStudyCategory = "erp" | "logistics" | "web-app" | "ai";

export interface CaseStudy {
  /** URL segment: /work/[slug] */
  slug: string;
  /**
   * The system, in industry terms. Never the client's brand name — see rule 3
   * in the file header.
   */
  title: string;
  /**
   * The client / business the system was built for.
   *
   * Data only. Credited in the CreativeWork schema and used to keep these
   * entries traceable back to a real repository, but deliberately not rendered
   * as a heading or a page title anywhere.
   */
  client: string;
  /**
   * Kicker shown above the title, and the second half of the page title.
   *
   * Must not restate `title`. Since titles became system names, this is the
   * line that has to add the detail: "Workshop Management" paired with a `type`
   * of "Workshop management" produced the page title "Workshop Management:
   * Workshop management". Name what the system actually does instead.
   */
  type: string;
  category: CaseStudyCategory;
  /** Not recorded anywhere reliable — left undefined rather than invented. */
  year?: number;
  description: string;
  /** What was going wrong before. */
  challenge: string;
  /** What the system does about it. */
  solution: string;
  /** What it does, in plain terms. Replaces the old stack list. */
  capabilities: readonly string[];
  /** Condensed one-liner used on the work index. */
  shortDescription?: string;
  /** Placeholder swatch used by the old carousel cards. */
  accentColor?: string;
  /** Real screenshots still pending. */
  images: readonly string[];
  /**
   * TODO: no results or metrics copy exists anywhere. Populate once real numbers
   * are confirmed with each client — invented figures are worse than none.
   */
  results?: readonly { label: string; value: string }[];
}

// Annotated rather than `as const satisfies`: const-narrowing collapses
// `category` to only the values currently present ("erp" | "logistics"), so any
// code filtering over the full CaseStudyCategory union stops type-checking.
export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "packaging-supplies-mis",
    title: "Packaging Supplies MIS",
    client: "Gir Pack Trading",
    type: "Pricing and order management",
    category: "erp",
    description:
      "Pricing, costing and order tracking for a packaging supplies trading company — replacing the spreadsheets that decided what every customer paid.",
    challenge:
      "Prices lived in spreadsheets only a couple of people fully understood. When a supplier's cost moved, the selling price didn't always follow, so margin leaked quietly and nobody noticed until much later. Once an order was placed, no one outside the office could say what stage it had reached.",
    solution:
      "Every product's cost, supplier and selling price now sits in one place. Prices are worked out by a rule set per product rather than by hand, so when a cost changes the price moves with it and the old price stays on record. Orders run along a visible track — quotation, pricing approval, purchasing, packing, delivery — so anyone can see where a job is and who last touched it. Salespeople only see their own area. Costs and stock levels are read automatically from the accounting system the company already uses, so the same figure is never typed twice.",
    capabilities: [
      "Cost and price tracking per product",
      "Automatic pricing rules, with manual override",
      "Supplier price comparison",
      "Full price history",
      "Order pipeline with approval stages",
      "Packing and delivery scheduling",
      "Sales-area access control",
      "Public product catalogue for enquiries",
      "Reads cost and stock from the accounting system",
    ],
    shortDescription: "Pricing, costing and order tracking for a packaging supplies trader.",
    accentColor: "#818CF8",
    images: [],
  },
  {
    slug: "produce-supply-delivery",
    title: "Produce Supply & Delivery",
    client: "HarvestGrow Veg Sdn Bhd",
    type: "Storefront, packing floor and driver runs",
    category: "erp",
    description:
      "Order-to-delivery system for a vegetable supplier: customers order online, the warehouse packs to a live board, and drivers deliver the same day.",
    challenge:
      "Orders arrived by phone and WhatsApp through the morning and were rewritten by hand for the packing floor. Every customer had their own agreed prices, so quoting depended on who picked up the call. Produce doesn't keep — anything mis-picked, missed or delivered late was money thrown away that day.",
    solution:
      "Customers order from their own price list on a storefront, and the order lands straight on the warehouse packing board with nothing re-typed. Drivers get the day's stops on their phone and confirm each delivery as it happens, so the office knows what actually went out. Shelf life is tracked, so short-dated stock is flagged for clearance before it becomes a write-off. Staff and customers can also order and check stock over WhatsApp, and invoices and stock stay in step with the accounting system the business already runs.",
    capabilities: [
      "Customer ordering storefront",
      "Per-customer and per-group pricing",
      "Live packing board for the warehouse floor",
      "Same-day delivery routing",
      "Driver app with delivery confirmation",
      "Shelf-life and daily clearance tracking",
      "Low-stock and daily price alerts",
      "Purchase and sales invoicing",
      "Ordering and stock checks over WhatsApp",
      "Two-way sync with the accounting system",
    ],
    shortDescription:
      "Online ordering, warehouse packing and same-day delivery for a produce supplier.",
    accentColor: "#818CF8",
    images: [],
  },
  {
    slug: "distribution-fleet",
    title: "Distribution & Fleet",
    client: "Shuda Logistics",
    type: "Route assignment and proof of delivery",
    category: "logistics",
    description:
      "Turns a day's orders into driver runs by area, and proves every drop was made.",
    challenge:
      "Work was divided between drivers by hand every morning. Once a van left the yard the office lost sight of it — what had been delivered, what was refused, and what money was still sitting on the road all had to be reconciled afterwards from paper.",
    solution:
      "Orders are grouped by delivery area and handed to drivers automatically, with route sheets and a map for the day. Drivers work from their own portal, confirm pickups and deliveries as they go, and capture proof at the door for the office to review. Money still outstanding is tracked against each drop rather than on paper, and existing order spreadsheets can be imported instead of re-keyed.",
    capabilities: [
      "Orders grouped by delivery area",
      "Automatic assignment to drivers",
      "Route sheets and a live delivery map",
      "Driver portal",
      "Pickup verification and delivery confirmation",
      "Proof of delivery, with office review",
      "Outstanding balance tracked per drop",
      "Fleet and driver records",
      "Dispatch notifications over WhatsApp",
      "Spreadsheet import for existing orders",
    ],
    shortDescription: "Area-based distribution, driver runs and proof of delivery.",
    accentColor: "#818CF8",
    images: [],
  },
  {
    slug: "workshop-management",
    title: "Workshop Management",
    client: "Dream Garage (M) Sdn Bhd",
    type: "Jobs, parts, invoicing and service history",
    category: "erp",
    description:
      "Workshop management for a car service business: jobs, parts, invoicing and customer history in one system.",
    challenge:
      "Service history lived in books and WhatsApp threads, so a returning customer's past work was hard to find and easy to lose. Parts weren't tracked against the jobs that used them, and putting on more foremen produced more paperwork rather than more cars out of the door.",
    solution:
      "Every job is recorded against the vehicle and the customer, so the next visit starts with the full history instead of a phone call. Parts come off stock as they're used, with purchase orders and suppliers handled in the same place. Invoices and job documents are generated from the work recorded rather than retyped. Managers can see what each staff member completed, which customers owe money, and what stock is running low, across branches.",
    capabilities: [
      "Job intake with full service history",
      "Vehicle and customer records",
      "Stock tracked against the jobs that use it",
      "Purchase orders and supplier records",
      "Invoicing and job document generation",
      "Debtor and payment tracking",
      "Staff performance and audit trail",
      "Branch dashboards",
      "Public company website",
    ],
    shortDescription: "Jobs, parts, invoicing and customer history for a car workshop.",
    accentColor: "#818CF8",
    images: [],
  },
];

/** Display order on the work index. */
export const featuredCaseStudySlugs = [
  "packaging-supplies-mis",
  "produce-supply-delivery",
  "distribution-fleet",
  "workshop-management",
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
