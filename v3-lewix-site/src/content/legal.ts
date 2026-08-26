/**
 * Privacy policy content.
 *
 * Written 2026-08-26, from what the site ACTUALLY does rather than from a
 * template. That distinction is the whole reason this file reads the way it
 * does, and it is worth stating plainly for whoever edits it next:
 *
 *  - The project brief on /contact never reaches a server. `ProjectBrief`
 *    holds the answers in React state and the final step opens a `mailto:`
 *    link, so the visitor's own mail client sends the message. There is no
 *    endpoint, no database row, and no submission we could lose.
 *  - There is no analytics of any kind. No gtag, no Plausible, no Clarity.
 *  - Nothing sets a cookie, `localStorage` or `sessionStorage`.
 *
 * A boilerplate policy would have claimed all three, and claiming to collect
 * data you do not collect is its own kind of false statement. If any of those
 * three facts changes, this file has to change in the same commit.
 *
 * House style applies: no em dashes.
 */

export const privacyMeta = {
  /** Shown on the page and used for the `dateModified` in metadata. */
  updated: '2026-08-26',
  updatedDisplay: '26 August 2026',
} as const;

export const privacyCopy = {
  eyebrow: 'Privacy',
  heading: 'What we collect',
  intro:
    'Short, because there is not much to describe. This site runs no analytics, sets no cookies, and its contact form does not send anything to us on its own.',
} as const;

export interface PrivacySection {
  heading: string;
  body: readonly string[];
}

export const privacySections: readonly PrivacySection[] = [
  {
    heading: 'The short version',
    body: [
      'We do not track you. There is no analytics script on this site, no advertising pixel, and nothing that sets a cookie or writes to your browser storage. You can read every page here without leaving us any record beyond an ordinary server log entry.',
      'We hold personal data only when you send it to us yourself, by email or WhatsApp, and only for as long as the enquiry or the engagement needs it.',
    ],
  },
  {
    heading: 'The project brief',
    body: [
      'The multi-step brief on the contact page runs entirely in your browser. Your answers stay in the page while you fill it in, and the final step opens a message in your own email client with those answers already written out.',
      'Nothing is transmitted to us at any point in that process. If you close the tab before sending, the answers are gone and we never saw them. If you do send it, we hold what you wrote in the same way we hold any other email.',
    ],
  },
  {
    heading: 'When you contact us',
    body: [
      'Email to hello@lewix.ai and messages to either WhatsApp number reach us directly. What we hold is whatever you chose to include: usually a name, a company, a way to reply, and a description of the problem.',
      'We keep enquiries while they are live and for as long as we may reasonably need them afterwards, such as for an ongoing engagement or an existing client relationship. We do not add you to a mailing list, and we do not sell, rent or share this information with anyone for marketing.',
    ],
  },
  {
    heading: 'Server and network logs',
    body: [
      'This site is served from our own infrastructure and reaches you through Cloudflare, which sits in front of it as our content delivery and security provider. Both keep the ordinary request logs any web server keeps: the IP address, the browser user agent, the page requested and the time.',
      'Those logs exist so the site can be kept online and abuse can be identified. They are not joined to anything else, not used to build a profile, and not used for advertising. Cloudflare processes them on our behalf under its own terms as our service provider.',
    ],
  },
  {
    heading: 'Who else sees it',
    body: [
      'Cloudflare, as described above. Our email is hosted by a mail provider, in the same way business email always is. That is the complete list. There are no advertising networks, no data brokers, and no third-party embeds on this site.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'Under the Malaysian Personal Data Protection Act 2010 you can ask what personal data we hold about you, ask us to correct it, ask us to delete it, and withdraw any consent you have given. Visitors in the EU and UK are welcome to make the same requests and we will handle them the same way.',
      'Write to hello@lewix.ai. We reply to enquiries within 24 hours and will not ask you to prove anything beyond enough to be sure we are talking to the right person.',
    ],
  },
  {
    heading: 'Changes',
    body: [
      'If what we do changes, this page changes with it, and the date at the top changes too. We do not backdate it.',
    ],
  },
] as const;
