import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * Replaces Next's default 404, which carries its own light/dark stylesheet:
 * on a light-mode device it painted the page white under a header styled for a
 * dark site, so the wordmark and both pills disappeared.
 */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[80svh] items-center px-6 pt-32 pb-24 sm:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-6 font-display font-semibold text-5xl leading-[1.05] tracking-tight text-fg sm:text-7xl">
          Nothing lives here.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
          The page may have moved, or the link was mistyped. Everything we have built is on the
          work page, and the contact page reaches the people who built it.
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0c] transition-colors hover:bg-accent hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/work"
            className="rounded-full border border-line px-6 py-3 text-sm text-fg transition-colors hover:border-fg"
          >
            Case studies
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-line px-6 py-3 text-sm text-fg transition-colors hover:border-fg"
          >
            Start a project
          </Link>
        </div>
      </div>
    </main>
  );
}
