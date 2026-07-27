'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LocalTime } from './LocalTime';
import { contact, site } from '@/content';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'writing', label: 'Writing' },
  { id: 'team', label: 'Founding Team' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;

/**
 * Top bar and slide-in menu, following the TRIONN pattern the brief specified:
 * wordmark hard left, a filled primary action and an outlined menu toggle hard
 * right, and a white drawer that comes in from the right edge.
 *
 * Replaces a centred floating pill. That bar sized itself for its fullest
 * possible content, so for the whole hero and scroll stage — before any section
 * is in view — it was a logo and one word with a quarter of the viewport of
 * dead air between them.
 *
 * The drawer inverts to white deliberately: it's the only light surface on the
 * site, so opening it reads as a mode change rather than a panel appearing.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);

  /**
   * The wordmark was hard-coded to `#top`, which is an element that only exists
   * on the home page. Anywhere else it appended a hash and did nothing.
   *
   * On home it stays an anchor, because that's the one that scrolls rather than
   * reloading — a full navigation there would re-download the 27MB model.
   */
  const isHome = usePathname() === '/';

  /**
   * The bar is styled for a dark page. /contact opens on a light band, where a
   * white pill and a white-outlined toggle vanish.
   *
   * Driven off a `data-light-surface` attribute rather than the route, so any
   * light band added later gets the same treatment without touching this file.
   *
   * A direct hit test rather than an IntersectionObserver. The observer version
   * needed a rootMargin cropping the viewport to the bar's strip, and got it
   * wrong twice: `-100%` collapses the root to a zero-height line so nothing
   * ever intersects, and `-90%` reported backwards. "Is this y inside that
   * rect" needs no such translation.
   *
   * Polled on rAF, NOT on a scroll listener. Lenis drives scrolling, and native
   * `scroll` events never reach a window listener here — measured: zero events
   * across a full scroll. A listener would compute once on mount and then stay
   * frozen at whatever the first screen happened to be. The other scroll-linked
   * components in this codebase already work this way.
   */
  useEffect(() => {
    const HEADER_Y = 47; // centre of the bar, matching top-6 + half its height
    let raf = 0;
    let lastY = -1;

    const measure = () => {
      // Topmost element under the bar, not "does any light rect overlap it".
      // The contact hero is sticky, so its rect covers the bar for the whole
      // page even once the dark band has slid up over it — a rect test would
      // leave the header inverted forever. elementsFromPoint respects stacking,
      // so whatever is actually visible there is what decides.
      const stack = document.elementsFromPoint(window.innerWidth / 2, HEADER_Y);
      const behind = stack.find((el) => !el.closest('header') && !el.closest('#site-menu'));
      setOnLight(Boolean(behind?.closest('[data-light-surface]')));
    };

    // Once, synchronously. Landing directly on /contact puts a light band under
    // the bar before a single frame has been requested, and waiting for the
    // first tick paints a white pill on a light hero for that frame.
    measure();

    const tick = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        lastY = y;
        measure();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Over the drawer the bar is always on white, whatever is behind the page.
  const dark = onLight || open;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10">
        <a
          href={isHome ? '#top' : '/'}
          aria-label={isHome ? `${site.wordmark}, back to top` : `${site.wordmark}, home`}
          className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
        >
          {/* Both variants rendered and cross-faded rather than swapping `src`.
              Swapping fetches the other file on first switch, and until it
              arrives the wordmark is the wrong colour for the band it's on —
              i.e. invisible. Two images, one opacity transition, no flash. */}
          <span className="relative block">
            <Image
              src="/brand/lewix-wordmark-on-dark-1200w.png"
              alt={site.wordmark}
              width={1200}
              height={191}
              priority
              className={`h-[15px] w-auto transition-opacity duration-300 ${
                dark ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <Image
              src="/brand/lewix-wordmark-on-light-1200w.png"
              alt=""
              aria-hidden="true"
              width={1200}
              height={191}
              priority
              className={`absolute inset-0 h-[15px] w-auto transition-opacity duration-300 ${
                dark ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
        </a>

        <div className="flex items-center gap-2">
          {/* Primary action, filled. Inverts against the drawer so it stays the
              highest-contrast thing on screen in both modes.

              Goes to the /contact route, not the homepage anchor or a mailto:
              the anchor shows the address, the route walks someone through an
              actual brief. */}
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className={`rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors ${
              dark
                ? 'bg-[#0a0a0c] text-white hover:bg-accent'
                : 'bg-white text-[#0a0a0c] hover:bg-accent hover:text-white'
            }`}
          >
            Let&rsquo;s talk
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`flex items-center gap-3 rounded-full border px-5 py-2.5 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors outline-none ${
              dark
                ? 'border-[#0a0a0c]/20 text-[#0a0a0c] hover:border-[#0a0a0c]'
                : 'border-white/40 text-white hover:border-white'
            }`}
          >
            Menu
            <span aria-hidden="true" className="text-[13px] leading-none">
              {open ? '✕' : '≡'}
            </span>
          </button>
        </div>
      </header>

      {/* Dims the page behind the drawer and closes on click. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      />

      <div
        id="site-menu"
        aria-hidden={!open}
        className={`fixed inset-y-3 right-3 z-40 w-[min(92vw,27rem)] overflow-y-auto rounded-3xl bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-[calc(100%+0.75rem)]'
        }`}
      >
        {/* Top padding clears the header pills, which sit over this panel. */}
        <div className="flex min-h-full flex-col px-8 pt-28 pb-8 sm:px-10">
          <nav aria-label="Sections">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="block font-display text-3xl leading-[1.35] text-[#0a0a0c] transition-colors outline-none hover:text-accent focus-visible:text-accent sm:text-4xl"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-14">
            <p className="text-[10.5px] font-medium tracking-[0.18em] text-[#0a0a0c]/40 uppercase">
              Business enquiry
            </p>
            <dl className="mt-4 space-y-2 text-sm text-[#0a0a0c]">
              <div className="flex gap-5">
                <dt className="w-4 shrink-0 text-[#0a0a0c]/40">E.</dt>
                <dd>
                  <a
                    href={contact.email.href}
                    tabIndex={open ? undefined : -1}
                    className="transition-colors hover:text-accent"
                  >
                    {contact.email.label}
                  </a>
                </dd>
              </div>
              {contact.whatsapp.map((w) => (
                <div key={w.number} className="flex gap-5">
                  <dt className="w-4 shrink-0 text-[#0a0a0c]/40">P.</dt>
                  <dd className="flex gap-3">
                    <a
                      href={w.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      tabIndex={open ? undefined : -1}
                      className="transition-colors hover:text-accent"
                    >
                      {w.display}
                    </a>
                    <span className="text-[#0a0a0c]/40">{w.name}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            The reference has a SOCIAL block here. Ours is deliberately absent:
            the only social entry in `contact` is LinkedIn with href "#", and a
            drawer full of links that go nowhere is worse than one that is
            shorter. Add the real URLs and this block comes back.

            The badge below takes the slot the reference gives its name-story
            link.

            It reads as a status light rather than a caption on purpose. The
            clock is real, and pairing it with "systems awake" is the one place
            the site gets to make its own point back to itself: at 03:00 in
            Malaysia nobody is at a desk, and everything Lewix has shipped is
            still serving. Same claim the marquee and the uptime figure already
            make, just landed at the hour where it means something.
          */}
          <div className="mt-auto pt-14">
            <span className="inline-flex items-center gap-3 rounded-full border border-[#0a0a0c]/15 px-4 py-2.5 text-[10.5px] font-medium tracking-[0.16em] text-[#0a0a0c]/70 uppercase">
              <span
                aria-hidden="true"
                className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span className="tabular-nums">
                <LocalTime /> MYT
              </span>
              <span aria-hidden="true" className="text-[#0a0a0c]/25">
                /
              </span>
              Systems awake
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
