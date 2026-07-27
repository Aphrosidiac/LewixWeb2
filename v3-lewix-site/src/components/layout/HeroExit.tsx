'use client';

import { useEffect } from 'react';
import { clamp01, smoothstep } from '@/lib/scrollStage';

/**
 * Drifts the hero lockup out under scroll instead of letting it simply scroll
 * off — dragonfly's wordmark slides aside and fades while the insect grows
 * behind it, so the screen is already clear by the time the shot takes over.
 *
 * Targets a wrapper rather than the elements PageReveal animates, so the two
 * never write to the same property.
 */
export function HeroExit() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-hero-parallax]');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = -1;

    const tick = () => {
      // Resolved by 0.8 of a viewport, a beat before the stage begins.
      const t = smoothstep(clamp01(window.scrollY / (window.innerHeight * 0.8)));
      if (t !== last) {
        last = t;
        el.style.opacity = String(1 - t);
        el.style.transform = `translate3d(${-t * 70}px, ${-t * 34}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
    };
  }, []);

  return null;
}
