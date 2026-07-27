'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { subscribeLoad } from '@/lib/loadProgress';

/**
 * Two jobs:
 *
 *  1. Stagger the hero in when the loading panel starts retracting, so the
 *     first screen resolves instead of appearing all at once.
 *  2. Give every section below the fold a scroll-triggered rise, so the rest of
 *     the page doesn't pop either.
 *
 * Elements opt in with `data-rise`. Everything is authored visible in the
 * markup and only hidden here, once JS has confirmed it can animate — if this
 * component never runs, the page still reads correctly.
 */
export function PageReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const hero = gsap.utils.toArray<HTMLElement>('[data-hero-rise]');
    const sections = gsap.utils.toArray<HTMLElement>('[data-rise]');

    // Hide up front, in the same tick, to avoid a flash of final layout.
    gsap.set(hero, { opacity: 0, y: 22 });
    gsap.set(sections, { opacity: 0, y: 28 });

    const triggers: ScrollTrigger[] = [];

    // Sections rise as they scroll in — independent of the loader.
    sections.forEach((el) => {
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        paused: true,
      });
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => tween.play(),
        })
      );
    });

    const unsubscribe = subscribeLoad(({ revealing }) => {
      if (!revealing) return;
      gsap.to(hero, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        // The loading panel has already cleared and held a beat of black by
        // now. This offset lets the mountain start assembling first, so the
        // copy rises onto an establishing shot rather than racing it.
        delay: 0.3,
      });
      // Layout is final by now; make sure triggers measured against the
      // pre-reveal state get recalculated.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      unsubscribe();
      triggers.forEach((t) => t.kill());
      gsap.set([...hero, ...sections], { clearProps: 'opacity,transform' });
    };
  }, []);

  return null;
}
