/**
 * Businesses running a LEWIX system in production, shown as a logo band on the
 * home page.
 *
 * This band exists because the Work section stopped naming clients. Case study
 * titles are now system types ("Packaging Supplies MIS"), which tells a
 * stranger whether the work is relevant to them but drops the proof that real
 * companies are behind it. The logos carry that proof instead, which is the
 * job they are actually good at.
 *
 * "Trusted by", not "Certified partners". A certified partner is a company
 * certified BY a vendor (an AWS partner, a Salesforce partner); using the term
 * for clients claims a credential that does not exist. These are customers
 * running the software, and the honest label is the stronger one anyway.
 *
 * ── The assets ──────────────────────────────────────────────────────────────
 * Every logo is a pre-baked WHITE silhouette, generated from the alpha channel
 * of each client's own logo file in its project repository. Three reasons it is
 * baked rather than filtered in CSS:
 *
 *  1. The four sources are mutually hostile. Girpack is black artwork, Shuda is
 *     already white, HarvestGrow is green and brown, Dream Garage is yellow. No
 *     single CSS filter handles that set: `invert` fixes Girpack and destroys
 *     Shuda.
 *  2. Dream Garage's primary logo has an opaque navy background baked into the
 *     raster, so it cannot sit on this page at all. `logo-nav.png` is the only
 *     transparent horizontal variant, and picking that per-logo is a decision
 *     that belongs at build time, not in a class name.
 *  3. Full-colour client logos would be the only saturated thing on an
 *     otherwise entirely monochrome page.
 *
 * They are also OPTICALLY normalised, not scaled to equal height. Equal height
 * is wrong here: Girpack is one bold line of type and reads twice as heavy as
 * Shuda's three-line lockup at the same pixel height. Each logo is scaled on a
 * blend of equal-height and equal-ink-area (t=0.35 between the two), then
 * centred in a canvas of identical height. That last part is what lets the
 * component set ONE css height for all four and get correct relative weight for
 * free — do not "fix" the varying widths, they are the whole point.
 *
 * Regenerating: the source files live in each project repo, listed per entry
 * below. If a client rebrands, re-bake rather than dropping a raw logo in.
 */

export interface Partner {
  /** Company name. Used as the alt text and the marquee's accessible label. */
  name: string;
  src: string;
  /** Intrinsic size of the baked asset. Heights are identical by construction. */
  width: number;
  height: number;
}

export const partners = [
  {
    // ~/Desktop/dev/Girpack/frontend/public/logo.png
    name: "Gir Pack Trading",
    src: "/partners/girpack.png",
    width: 937,
    height: 450,
  },
  {
    // ~/Desktop/dev/HarvestGrow/frontend/public/logo-trimmed.png
    name: "HarvestGrow Veg Sdn Bhd",
    src: "/partners/harvestgrow.png",
    width: 628,
    height: 450,
  },
  {
    // ~/Desktop/dev/ShudaLogisticsV2/frontend/public/logo-white.png
    name: "Shuda Logistics",
    src: "/partners/shuda.png",
    width: 955,
    height: 450,
  },
  {
    // ~/Desktop/dev/DreamGarage/frontend/public/logo-nav.png
    name: "Dream Garage",
    src: "/partners/dreamgarage.png",
    width: 865,
    height: 450,
  },
] as const satisfies readonly Partner[];

export const partnersCopy = {
  eyebrow: "Trusted by",
  /**
   * Sits under the eyebrow. Says what the logos mean, because a logo row on its
   * own is ambiguous: it could be clients, tools, or badges.
   */
  note: "Businesses running a LEWIX system every day.",
} as const;
