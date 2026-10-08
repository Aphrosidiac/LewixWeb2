/**
 * Case study content.
 *
 * Refreshed 2026-10-09 from the project repositories and the sourced facts
 * dossier compiled on 2026-10-06. Standing rules for this file:
 *
 *  1. NO CLIENT, EVER. A system is described in full (what it does, how work
 *     moves through it, what it connects to) but the business it runs is never
 *     named or hinted at: no company or brand names, domains, subdomains,
 *     logos, locations or screenshots. That applies to code comments, file
 *     names and commit messages too, because this repository is public.
 *     `scripts/confidential-scan.sh` enforces it against a git-ignored term
 *     list; run it before every commit and every deploy.
 *  2. NO TECHNICAL JARGON. The reader is a business owner, not an engineer.
 *     Every entry says what was going wrong and what the system does about it,
 *     in the words the business would use.
 *  3. Only claim what the repository shows. Anything uncertain is left out
 *     rather than softened, and `status` says plainly whether a system is in
 *     production, live as a demo, or still being built.
 *  4. Brand copy rules: no em dashes, and no tallies of our own projects.
 *     Figures about a system's scale (`numbers`) are fine; "ten systems" is not.
 */

export type CaseStudyCategory = "industry" | "supply" | "trade" | "services";

export type CaseStudyStatus = "In production" | "Going live" | "Live demo" | "In build";

export interface CaseStudy {
  /** URL segment: /work/[slug] */
  slug: string;
  /** The system, in industry terms. Never the client's brand. */
  title: string;
  /**
   * Kicker shown above the title, and the second half of the page title.
   * Must not restate `title`: name what the system actually does.
   */
  type: string;
  category: CaseStudyCategory;
  /** The kind of business it runs, generic enough to identify nobody. */
  sector: string;
  status: CaseStudyStatus;
  description: string;
  /** What was going wrong before. */
  challenge: string;
  /** What the system does about it. */
  solution: string;
  /** What it does, in plain terms. */
  capabilities: readonly string[];
  /** How one piece of work moves through the system, start to finish. */
  flow: readonly string[];
  /** Measured, sourced figures only. Invented numbers are worse than none. */
  numbers?: readonly { value: string; label: string }[];
  /** Condensed one-liner used on the work index. */
  shortDescription: string;
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "label-printing-erp",
    title: "Label Printing ERP",
    type: "Orders, artwork, tooling and production",
    category: "industry",
    sector: "Label printing",
    status: "In production",
    description:
      "A print and label manufacturer's whole operation, from purchase order to delivery note, where artwork, moulds and machines are checked before a job is allowed to start.",
    challenge:
      "A label job depends on two things being ready at once: the material, and the tooling. The artwork has to be approved, the printing plates and cutting moulds have to exist, and the order has to fit what the presses can physically run. That was tracked across people, folders and memory, so jobs started before they were ready and stopped halfway through.",
    solution:
      "Every job now carries a readiness gate: it cannot start until both the stock and the tooling are confirmed. Orders come in by hand or straight from a customer's purchase order, which is read automatically. Purchasing drafts its own orders when stock runs low, and production runs from one queue. Artwork has its own track, from structured brief to versioned design that locks once the customer approves it, then on to the mould maker and back. At order entry the system checks the job against what each press, die cutter and slitter can actually do. A rule-driven assistant moves work between sales, purchasing, inventory and production, and a separate one answers questions about the numbers without being able to change them.",
    capabilities: [
      "Sales orders, including purchase orders read automatically",
      "Readiness gate on stock and tooling",
      "Purchase orders drafted when stock runs low",
      "One production queue",
      "Versioned artwork, locked on approval",
      "Approval proofs, colour touch-up and mould tracking",
      "Machine capability check at order entry",
      "Quality certificates with sampling plans",
      "Delivery notes and invoices",
      "Multi-currency documents and tax exemption rules",
      "Ageing and sales reports",
      "Assistant that moves work between departments",
      "Read-only assistant for questions about the business",
      "Access control per page",
    ],
    flow: ["Sales order", "Readiness check", "Purchasing", "Inventory", "Production", "Delivery & invoice"],
    numbers: [
      { value: "125", label: "customer companies on day one" },
      { value: "363", label: "contacts migrated at go-live" },
    ],
    shortDescription: "Orders, artwork, tooling and production for a label manufacturer.",
  },
  {
    slug: "racking-quotation-engine",
    title: "Racking Quotation Engine",
    type: "Layout drawing to 3D model, materials list and quote",
    category: "industry",
    sector: "Industrial storage",
    status: "Live demo",
    description:
      "Upload the racking layout drawing you already make. Get back a walkable 3D warehouse, an exact list of materials and a priced quotation, all from the same drawing.",
    challenge:
      "An industrial storage supplier draws every warehouse layout in CAD before quoting it. Turning that drawing into a materials list and a price was done again by hand, counting uprights and beams off the page, and a customer had to read a technical drawing to picture what they were buying.",
    solution:
      "The system reads the layout drawing directly, both its lines and its text, with no guessing involved in the measurements. It writes a plain description of the layout that a person can check and correct for each drawing. One step builds both the 3D model and the price from that description, so the picture the customer sees and the quote they sign can never disagree. The 3D view includes forklifts and staircases and a guided walk that follows the route marked on the drawing.",
    capabilities: [
      "Reads the CAD layout drawing as uploaded",
      "Layout summary a person can check and correct",
      "Exact materials list",
      "Priced quotation document",
      "Walkable 3D warehouse",
      "Forklifts and staircases in the model",
      "Guided walkthrough along the marked route",
    ],
    flow: ["Layout drawing", "Read lines and text", "Checked layout", "3D model & materials", "Quotation"],
    shortDescription: "Turns a racking layout drawing into a 3D model, a materials list and a quote.",
  },
  {
    slug: "flexible-packaging-mes",
    title: "Flexible Packaging MES",
    type: "Production route, lot tracing and shop-floor tablets",
    category: "industry",
    sector: "Packaging manufacturing",
    status: "In production",
    description:
      "A manufacturing system for printed laminated film, replacing paper job cards and spreadsheets that never agreed with each other.",
    challenge:
      "Production ran on paper and on spreadsheets kept separately by each department. Nobody could say with confidence which roll went into which order, costs were estimated after the fact, and the office learned what the floor had done only when the paperwork came back.",
    solution:
      "Every job follows the factory's real route: printing, lamination, slitting and packing, with extrusion where it applies, and steps cannot be skipped. A reusable specification holds how a product is made, and each sales order is an instance of it, so costing and ink estimates come from the same source. Planners work at a desk with fast search; operators log work per machine and scan lots on tablets at the line. The accounting package stays the order book, and delivery orders record what actually left the building, partial deliveries included.",
    capabilities: [
      "Production route enforced step by step",
      "Reusable product specifications",
      "Costing and ink estimation",
      "Lot tracing from roll to order",
      "Desk interface for sales and planning",
      "Tablet interface for machine operators",
      "Per-machine production logging",
      "Partial deliveries recorded as they happen",
      "Works alongside the existing accounting package",
    ],
    flow: ["Printing", "Lamination", "Slitting", "Packing", "Delivery"],
    shortDescription: "Production route, lot tracing and shop-floor tablets for a film packaging plant.",
  },
  {
    slug: "produce-supply-delivery",
    title: "Produce Supply & Delivery",
    type: "Storefront, packing floor and driver runs",
    category: "supply",
    sector: "Fresh produce",
    status: "In production",
    description:
      "Order-to-delivery system for a vegetable supplier: customers order online, the warehouse packs to a live board, and drivers deliver the same day.",
    challenge:
      "Orders arrived by phone and WhatsApp through the morning and were rewritten by hand for the packing floor. Every customer had their own agreed prices, so quoting depended on who picked up the call. Produce does not keep: anything mis-picked, missed or delivered late was money thrown away that day.",
    solution:
      "Customers order from their own price list on a storefront, and the order lands straight on the warehouse packing board with nothing re-typed. Drivers get the day's stops on their phone and confirm each delivery as it happens, so the office knows what actually went out. Shelf life is tracked, so short-dated stock is flagged for clearance before it becomes a write-off. Staff and customers can also order and check stock over WhatsApp, the daily boards move forward on their own schedule, and invoices and stock stay in step with the accounting system the business already runs.",
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
    flow: ["Order", "Packing board", "Routing", "Driver run", "Invoice"],
    shortDescription: "Online ordering, warehouse packing and same-day delivery for a produce supplier.",
  },
  {
    slug: "distribution-fleet",
    title: "Distribution & Fleet",
    type: "Route assignment and proof of delivery",
    category: "supply",
    sector: "Distribution",
    status: "In production",
    description:
      "Turns a day's orders into driver runs by area, and proves every drop was made.",
    challenge:
      "Work was divided between drivers by hand every morning. Once a van left the yard the office lost sight of it: what had been delivered, what was refused, and what money was still sitting on the road all had to be reconciled afterwards from paper.",
    solution:
      "Orders are grouped by delivery area and handed to drivers automatically, with areas rotating by weekday, and the office gets route sheets and a map for the day. Drivers work from their own portal, verify pickups, confirm deliveries as they go and capture proof at the door for the office to review. Money still outstanding is tracked against each drop rather than on paper, dispatch notices go out over WhatsApp, and existing order spreadsheets can be imported instead of re-keyed.",
    capabilities: [
      "Orders grouped by delivery area",
      "Automatic assignment to drivers",
      "Delivery areas rotating by weekday",
      "Route sheets and a live delivery map",
      "Driver portal",
      "Pickup verification and delivery confirmation",
      "Proof of delivery, with office review",
      "Outstanding balance tracked per drop",
      "Fleet and driver records",
      "Dispatch notifications over WhatsApp",
      "Spreadsheet import for existing orders",
    ],
    flow: ["Orders", "Grouped by area", "Driver assigned", "Delivered with proof", "Office review"],
    shortDescription: "Area-based distribution, driver runs and proof of delivery.",
  },
  {
    slug: "workshop-management",
    title: "Workshop Management",
    type: "Jobs, parts, invoicing and service history",
    category: "services",
    sector: "Automotive service",
    status: "In production",
    description:
      "Workshop management for a multi-branch car service business: jobs, parts, invoicing and customer history in one system.",
    challenge:
      "Service history lived in books and WhatsApp threads, so a returning customer's past work was hard to find and easy to lose. Parts were not tracked against the jobs that used them, and putting on more foremen produced more paperwork rather than more cars out of the door.",
    solution:
      "Every job is recorded against the vehicle and the customer, so the next visit starts with the full history instead of a phone call. Parts come off stock as they are used, tyres are tracked down to their manufacture codes, and purchase orders and suppliers are handled in the same place. Quotations, invoices and receipts are generated from the work recorded, each with its own clear status, rather than retyped. Managers can see what each staff member completed, which customers owe money, and what stock is running low, across branches.",
    capabilities: [
      "Job intake with full service history",
      "Vehicle and customer records",
      "Stock tracked against the jobs that use it",
      "Tyre tracking by manufacture code",
      "Purchase orders and supplier records",
      "Quotations, invoices and receipts with clear status",
      "Debtor and payment tracking",
      "Staff performance and audit trail",
      "Branch dashboards",
    ],
    flow: ["Job intake", "Parts from stock", "Quotation", "Invoice", "Receipt"],
    numbers: [
      { value: "13,900", label: "catalogue items brought across" },
      { value: "71", label: "brands in the catalogue" },
    ],
    shortDescription: "Jobs, parts, invoicing and customer history for a car workshop.",
  },
  {
    slug: "consumer-goods-commerce",
    title: "Consumer Goods Commerce & Warehouse",
    type: "Creator sales, online store and a scanner warehouse",
    category: "trade",
    sector: "Consumer goods",
    status: "Going live",
    description:
      "Orders, stock, creator group-buys and a warehouse that runs on phone scanners, replacing the subscription commerce software a consumer brand had outgrown.",
    challenge:
      "Much of the brand's selling happened through creators running group-buys, which its commerce software had no idea how to handle. Every creator's version of a product became another product, stock stopped adding up, and the warehouse picked and packed from printed lists.",
    solution:
      "Every pack that can be sold is one product, and a creator is a tag on the sale rather than a copy of the catalogue. Shoppers buy through a creator's own link or through the open store, in English, Malay or Chinese, and pay by online banking or card. The warehouse runs on phone scanners: orders are picked in waves, scanned as they are packed, handed over on courier manifests and counted by bin. Sales post to the accounting system with a nightly check that the two agree, and connections to the major marketplaces are built and tested.",
    capabilities: [
      "One product per real pack",
      "Creator sales tagged, not duplicated",
      "Creator link storefront and an open store",
      "English, Malay and Chinese",
      "Online banking and card payments",
      "Wave picking and scan-to-pack",
      "Courier manifests",
      "Stock counts by bin on a phone",
      "Nightly reconciliation with accounting",
      "Marketplace connections",
    ],
    flow: ["Creator link or store", "Payment", "Pick wave", "Scan and pack", "Courier", "Accounting"],
    shortDescription: "Creator group-buys, an online store and a scanner warehouse for a consumer brand.",
  },
  {
    slug: "packaging-supplies-mis",
    title: "Packaging Supplies MIS",
    type: "Pricing and order management",
    category: "trade",
    sector: "Packaging trade",
    status: "In production",
    description:
      "Pricing, costing and order tracking for a packaging supplies trading company, replacing the spreadsheets that decided what every customer paid.",
    challenge:
      "Prices lived in spreadsheets only a couple of people fully understood. When a supplier's cost moved, the selling price did not always follow, so margin leaked quietly and nobody noticed until much later. Once an order was placed, no one outside the office could say what stage it had reached.",
    solution:
      "Every product's cost, supplier and selling price now sits in one place. Prices are worked out by a rule set per product rather than by hand, so when a cost changes the price moves with it and the old price stays on record. Orders run along a visible track (quotation, pricing approval, purchasing, packing, delivery) so anyone can see where a job is and who last touched it. Salespeople only see their own area. Costs and stock levels are read automatically from the accounting system the company already uses, so the same figure is never typed twice.",
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
    flow: ["Quotation", "Pricing approval", "Purchasing", "Packing", "Delivery"],
    shortDescription: "Pricing, costing and order tracking for a packaging supplies trader.",
  },
  {
    slug: "furniture-retail-back-office",
    title: "Furniture Retail Back Office",
    type: "Quotations, deliveries and WhatsApp assistants",
    category: "trade",
    sector: "Furniture retail",
    status: "In build",
    description:
      "Quotations, delivery planning and three assistants for a furniture retailer: one on WhatsApp, one on the website, and one for staff.",
    challenge:
      "Quotations were written with the discount habits of the accounting team, which no off-the-shelf tool understood. Deliveries were arranged by phone around whoever had a lorry free, and the same customer questions about stock and catalogues came in on WhatsApp all day.",
    solution:
      "Quotations and invoices understand the discount expressions the team already writes, number themselves without clashes and print as clean documents, with customers, products and documents kept in step with the accounting system. Every order becomes a delivery job booked into a time window, on the company's own lorry or a carrier, with run sheets for the day. A WhatsApp assistant answers from the real catalogue and hands the conversation to a person when it should. A website assistant answers only from what is published, and a staff assistant prepares changes as cards that a person approves before anything happens.",
    capabilities: [
      "Quotations that understand house discount rules",
      "Invoices and documents numbered without clashes",
      "Two-way sync with the accounting system",
      "Delivery jobs booked into time windows",
      "Own lorry or third-party carrier",
      "Daily run sheets",
      "WhatsApp assistant that hands off to staff",
      "Website assistant limited to published content",
      "Staff assistant that proposes changes for approval",
      "Per-page permissions and an audit log",
    ],
    flow: ["Quotation", "Invoice", "Delivery job", "Booked window", "Run sheet"],
    shortDescription: "Quotations, delivery windows and AI assistants for a furniture retailer.",
  },
  {
    slug: "pet-retail-platform",
    title: "Multi-Branch Pet Retail",
    type: "Till, online store, grooming and boarding on one record",
    category: "trade",
    sector: "Pet retail",
    status: "Live demo",
    description:
      "One platform for a pet retailer with several branches, where the till, the online store, the customer app and grooming and boarding stays all share the same records.",
    challenge:
      "The shop tills and the web store were separate products that did not know about each other. A customer who bought online was a stranger at the counter, stock was counted twice, and grooming and boarding were booked somewhere else again.",
    solution:
      "The platform is built around the pet rather than the sale. The till, the online store, the customer app and grooming and boarding stays all read and write the same records, so every branch sees the same customer, the same pet and the same stock. The back office runs all branches from one place, and marketplace channels connect to the same catalogue.",
    capabilities: [
      "Customer and pet records at the centre",
      "Branch tills",
      "Online store",
      "Customer app",
      "Grooming and boarding bookings",
      "One back office for every branch",
      "Marketplace channels",
    ],
    flow: ["Till or online", "Customer & pet record", "Stock", "Grooming & boarding", "Back office"],
    shortDescription: "Till, online store, customer app, grooming and boarding for a multi-branch pet retailer.",
  },
];

/**
 * The /work index.
 *
 * Rule 1 from the file header applies to every line rendered from here: the
 * systems are named, the clients are not.
 */
export const workIndexCopy = {
  eyebrow: "Work",
  headingLine1: "Systems running",
  headingLine2Accent: "in production",
  intro:
    "Factories, warehouses, fleets, workshops and shops. Each one is the software the business now runs on, not a pilot that was handed over and left. Clients stay confidential, so the systems are named and the businesses are not.",
  countLabel: "client systems",
  productsEyebrow: "Our own products",
  productsHeading: "Software we run ourselves",
  productsIntro:
    "The same team, building for itself. These are public, so you can open them and look around.",
  productsIntroSingle:
    "The same team, building for itself. It is public, so you can open it and look around.",
  ctaHeading: "Something here look familiar?",
  ctaBody:
    "If one of these reads like your operation, the conversation starts the same way it did for them.",
  ctaLabel: "Start a project",
  ctaHref: "/contact",
} as const;

/** Display labels for `CaseStudyCategory`, so the union never leaks to a page. */
export const categoryLabels: Record<CaseStudyCategory, string> = {
  industry: "Manufacturing & industry",
  supply: "Supply & logistics",
  trade: "Trade & retail",
  services: "Services",
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Previous and next systems in display order, wrapping at the ends. */
export function adjacentCaseStudies(slug: string) {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const n = caseStudies.length;
  return {
    prev: caseStudies[(i - 1 + n) % n],
    next: caseStudies[(i + 1) % n],
  };
}
