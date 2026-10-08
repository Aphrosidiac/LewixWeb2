'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Year } from './Year';
import { contact, site, socialProfiles } from '@/content';

const PAGES = [
  { href: '/work', label: 'Case studies' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'Company' },
  { href: '/contact', label: 'Start a project' },
] as const;

const SOCIALS = [
  { href: socialProfiles.linkedin, label: 'LinkedIn' },
  { href: socialProfiles.instagram, label: 'Instagram' },
  { href: socialProfiles.threads, label: 'Threads' },
  { href: socialProfiles.tiktok, label: 'TikTok' },
].filter((s) => s.href);

const BUILD_YEAR = new Date().getFullYear();

/**
 * Footer for every route except home, which closes on its own large sign-off
 * (`Contact.tsx`). Before this, only the home page had a footer at all: no
 * other page linked to the privacy notice, including the contact page whose
 * form collects personal data.
 */
export function PageFooter() {
  if (usePathname() === '/') return null;

  return (
    <footer className="relative border-t border-line bg-bg px-6 py-14 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <Link href="/" className="inline-block py-1 font-display font-semibold text-lg text-fg">
            {site.wordmark}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            {site.engineeredIn}
          </p>
          <a
            href={contact.email.href}
            className="mt-6 inline-block py-1 text-sm text-fg transition-colors hover:text-accent"
          >
            {contact.email.label}
          </a>
          <ul className="mt-1 space-y-0.5 text-sm text-fg-muted">
            {contact.whatsapp.map((w) => (
              <li key={w.number}>
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block py-1 transition-colors hover:text-accent"
                >
                  WhatsApp {w.name} <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Pages">
          <ul className="space-y-0.5 text-sm">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="inline-block py-1 text-fg-muted transition-colors hover:text-accent"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ul className="space-y-0.5 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener me"
                  className="inline-block py-1 text-fg-muted transition-colors hover:text-accent"
                >
                  {s.label} <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-fg-muted">
        <p>
          &copy; <Year fallback={BUILD_YEAR} /> {site.copyrightHolder}
        </p>
        <Link href="/privacy" className="py-1 transition-colors hover:text-accent">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
