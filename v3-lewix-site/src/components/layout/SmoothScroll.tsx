'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis smooth scroll, driven off the GSAP ticker so ScrollTrigger stays in
 * sync with it. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Lenis owns the scroll target, so window.scrollTo gets reverted on the next
    // frame. Expose the instance in dev so tooling can jump to an exact offset.
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    }

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
