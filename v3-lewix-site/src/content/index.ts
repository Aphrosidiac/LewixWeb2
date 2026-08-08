/**
 * Content barrel.
 *
 * All content in this directory was lifted from the previous Lewix site
 * (`~/Desktop/dev/lewix-ai`), where it lived hardcoded at the top of page and
 * section components. Each module notes its original source file path.
 *
 * These are pure data modules — no React, no JSX, no next/* imports.
 */

export type { CaseStudy, CaseStudyCategory } from "./caseStudies";
export {
  caseStudies,
  featuredCaseStudySlugs,
  getCaseStudy,
} from "./caseStudies";

export type { Service, ProcessStep } from "./services";
export { services, process, servicesCopy } from "./services";

export type { Partner } from "./partners";
export { partners, partnersCopy } from "./partners";

export type { Principle } from "./about";
export {
  aboutHero,
  story,
  manifesto,
  principlesCopy,
  principles,
} from "./about";

export type { NavItem, Stat, WhatsAppContact } from "./site";
export {
  site,
  metadata,
  socialProfiles,
  registration,
  navItems,
  footerLinks,
  footerEmail,
  hero,
  marqueeItems,
  stats,
  homeCta,
  featuredWorkCopy,
  workPagePlaceholder,
  caseStudyPageCopy,
  contact,
  contactBrief,
  contactForm,
  contactLabels,
  pricing,
} from "./site";
