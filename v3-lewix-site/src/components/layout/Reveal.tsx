'use client';

import { useEffect } from 'react';

/**
 * Scroll-in reveals for any route.
 *
 * PageReveal is GSAP-based and, more importantly, keys its hero stagger off the
 * loader — which only exists on the home page. Mounting it elsewhere would set
 * `[data-hero-rise]` to opacity 0 and wait forever for a signal that never
 * comes. This is the route-agnostic version: no GSAP, no loader dependency.
 *
 * Elements opt in with `data-reveal`. Everything is authored visible and only
 * hidden here, once JS has confirmed it can animate them back — if this never
 * runs, the page still reads.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!els.length) return;

    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // Stagger siblings that come into view together, so a row of cards
          // resolves in sequence rather than as one block.
          const delay = Number(el.dataset.revealDelay ?? 0);
          el.style.transitionDelay = `${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
