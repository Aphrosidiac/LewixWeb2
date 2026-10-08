/**
 * Lewix's own products, shown in the Work section and on /work.
 *
 * Unlike the client systems these are ours to name, link and screenshot. Every
 * image in `public/products/` is a real capture of the live product. Copy
 * rules match the rest of the site: plain words, no em dashes.
 *
 * Products that started as functional recreations of a commercial tool are
 * described by what they do, never by what they were modelled on.
 */

export interface Product {
  slug: string;
  name: string;
  /** One line under the name. */
  line: string;
  description: string;
  points: readonly string[];
  url: string;
  /** Host shown in the browser frame around the capture. */
  host: string;
  image: string;
  /** Pixel size of `image`, for layout without shift. */
  width: number;
  height: number;
}

export const products: readonly Product[] = [
  {
    slug: "smoothsail",
    name: "SmoothSail",
    line: "An online store builder for Malaysian sellers.",
    description:
      "Every seller gets a storefront on their own address, with the payment methods Malaysians actually use, delivery zones, cash on delivery and one place to run orders and stock. An assistant drafts store changes that the seller reviews, applies or undoes.",
    points: [
      "A store per seller, on their own domain",
      "Malaysian payments and cash on delivery",
      "Payment and fulfilment tracked separately",
      "Stock shared safely across channels",
    ],
    url: "https://smoothsail.my",
    host: "smoothsail.my",
    image: "/products/smoothsail.webp",
    width: 1440,
    height: 810,
  },
  {
    slug: "planforge",
    name: "PlanForge",
    line: "Ask for 230 m², get 230 m².",
    description:
      "A floor plan generator that solves the layout as a set of constraints, so the rooms add up to exactly the area you asked for. The result is an editable plan, a 3D model and a walkthrough, and it can read a PDF of drawings you already have.",
    points: [
      "Exact areas, by construction",
      "Editable plan",
      "3D model and walkthrough",
      "Imports existing PDF drawings",
    ],
    url: "https://planforge.lewix.ai",
    host: "planforge.lewix.ai",
    image: "/products/planforge.webp",
    width: 1440,
    height: 900,
  },
  {
    slug: "wireup",
    name: "WireUp",
    line: "Practice system design on a canvas.",
    description:
      "Pick a real interview prompt, drag components onto a canvas, wire up an architecture and get instant feedback on what is missing. No code required.",
    points: [
      "Drag-and-drop architecture canvas",
      "Real interview-style problems",
      "Instant, rule-based grading",
    ],
    url: "https://wireup.lewix.ai",
    host: "wireup.lewix.ai",
    image: "/products/wireup.webp",
    width: 1440,
    height: 900,
  },
];
