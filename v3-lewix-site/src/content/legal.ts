/**
 * Privacy policy content.
 *
 * Written 2026-08-26, from what the site ACTUALLY does rather than from a
 * template. That distinction is the whole reason this file reads the way it
 * does, and it is worth stating plainly for whoever edits it next:
 *
 *  - The project brief on /contact is sent, on the visitor's Send, to
 *    /api/brief, which emails it to us through Resend. The site keeps no copy:
 *    no database row, nothing logged but whether delivery failed. If sending
 *    fails, the visitor sends it themselves by email or WhatsApp.
 *    (Changed 2026-10-09; before that it was mailto-only.)
 *  - The site's own code runs no analytics. Cloudflare, which sits in front
 *    of the origin, injects its Web Analytics beacon (cookieless, aggregate);
 *    the notice says so rather than claiming "no analytics". (Corrected
 *    2026-10-09: the earlier text said there was none, which was untrue.)
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
  updated: '2026-10-09',
  updatedDisplay: '9 October 2026',
} as const;

export const privacyCopy = {
  eyebrow: 'Privacy',
  heading: 'What we collect',
  intro:
    'Short, because there is not much to describe. No cookies, no advertising trackers, and the contact form sends us only what you write in it, when you press Send.',
} as const;

export interface PrivacySection {
  heading: string;
  body: readonly string[];
  /** Set on the Bahasa Malaysia section so screen readers switch voice. */
  lang?: string;
}

export const privacySections: readonly PrivacySection[] = [
  {
    heading: 'Who we are',
    body: [
      'Lewix AI Sdn Bhd (company no. 202601027756, old format 1689852-D), trading as LEWIX, Kuala Lumpur, Malaysia. We are the data user responsible for the personal data described here. The contact for anything on this page is hello@lewix.ai.',
    ],
  },
  {
    heading: 'The short version',
    body: [
      'Nothing on this site sets a cookie or writes to your browser storage, and there is no advertising pixel. Cloudflare, which delivers the site, counts page views and load times in aggregate through its Web Analytics script. It sets no cookies and is not used to identify you.',
      'We hold personal data only when you send it to us yourself, through the project brief, by email or by WhatsApp, and only for as long as the enquiry or the engagement needs it.',
    ],
  },
  {
    heading: 'The project brief',
    body: [
      'Your answers stay in the page while you fill in the brief on the contact page. Nothing reaches us until you press Send on the last step. Then what you wrote (your name, email, company and answers) is emailed to our inbox. This site does not keep a copy of it.',
      'If you close the tab before sending, the answers are gone and we never saw them. If the brief cannot be sent from the page, nothing leaves your browser and you can send it yourself by email or WhatsApp instead.',
    ],
  },
  {
    heading: 'Why we use it, and whether you have to give it',
    body: [
      'We use what you send to reply to you, to work out whether and how we can help, to prepare a proposal, to do the work you ask for, and to keep the business and tax records the law requires. We do not add you to a mailing list, and we do not sell, rent or share it with anyone for marketing.',
      'Giving us any of it is your choice. A name and a way to reply are the only things we need to answer you; without them we cannot.',
    ],
  },
  {
    heading: 'When you contact us',
    body: [
      'Email to hello@lewix.ai and messages to either WhatsApp number reach us directly. What we hold is whatever you chose to include: usually a name, a company, a way to reply, and a description of the problem. A WhatsApp message also passes through WhatsApp, which Meta operates under its own terms.',
      'We keep enquiries while they are live and for as long as we may reasonably need them afterwards, such as for an ongoing engagement or an existing client relationship.',
    ],
  },
  {
    heading: 'Server and network logs',
    body: [
      'This site is served from our own infrastructure and reaches you through Cloudflare, which sits in front of it as our content delivery and security provider. Both keep the ordinary request logs any web server keeps: the IP address, the browser user agent, the page requested and the time.',
      'Those logs exist so the site can be kept online and abuse can be identified. They are not joined to anything else, not used to build a profile, and not used for advertising.',
    ],
  },
  {
    heading: 'Who else sees it',
    body: [
      'Cloudflare, which delivers the site and runs the aggregate analytics described above. Resend, which delivers the project brief from this site to our inbox. Our email provider, which hosts the inbox. WhatsApp, if you write to us there. Each processes data under its own terms as our service provider. That is the complete list: no advertising networks and no data brokers.',
      'Some of these providers store data outside Malaysia. We use them only for the purposes above.',
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
  {
    heading: 'Ringkasan dalam Bahasa Malaysia',
    lang: 'ms-MY',
    body: [
      'Lewix AI Sdn Bhd (no. syarikat 202601027756, format lama 1689852-D), berdagang sebagai LEWIX, Kuala Lumpur, ialah pengguna data yang bertanggungjawab atas data peribadi di halaman ini.',
      'Laman ini tidak memasang cookie dan tiada piksel pengiklanan. Cloudflare, yang menghantar laman ini, mengira jumlah lawatan secara agregat tanpa cookie dan tanpa mengenal pasti anda.',
      'Kami hanya menyimpan data peribadi yang anda hantar sendiri melalui borang projek, emel atau WhatsApp: biasanya nama, syarikat, cara untuk membalas dan penerangan masalah anda. Data ini digunakan untuk membalas pertanyaan, menyediakan cadangan, menjalankan kerja yang diminta dan menyimpan rekod perniagaan yang diwajibkan undang-undang. Memberikan data adalah pilihan anda, tetapi tanpa nama dan cara untuk membalas, kami tidak dapat menjawab.',
      'Data anda tidak dijual atau dikongsi untuk pemasaran. Ia hanya diproses oleh penyedia perkhidmatan kami (Cloudflare, Resend, penyedia emel kami dan WhatsApp), sebahagiannya di luar Malaysia.',
      'Di bawah Akta Perlindungan Data Peribadi 2010, anda boleh meminta akses, pembetulan atau pemadaman data anda, dan menarik balik persetujuan. Hubungi hello@lewix.ai. Jika terdapat percanggahan, versi Bahasa Inggeris di atas terpakai.',
    ],
  },
] as const;
