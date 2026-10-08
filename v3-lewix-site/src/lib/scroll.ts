import type Lenis from 'lenis';

/**
 * One owner for "the page must not scroll right now" and for programmatic
 * scrolling.
 *
 * `body { overflow: hidden }` alone does not stop the page: Lenis drives the
 * wheel itself and only honours overflow on <html>, so the page scrolled
 * behind the open menu and behind the loading screen. Locks are counted, so the
 * loader and the menu can overlap without one unlocking the other.
 *
 * Lenis also owns the scroll target, so a bare `window.scrollTo` is reverted on
 * its next frame. `scrollToTarget` goes through Lenis when it is running.
 */
let lenis: Lenis | null = null;
let locks = 0;

/**
 * Whether the latest navigation was Back/Forward. Those should land where the
 * visitor was, not on the URL's #hash: a Back to /#team after scrolling down to
 * Work used to snap up to Team.
 */
let popped = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    popped = true;
  });
}

export function consumePopNavigation() {
  const was = popped;
  popped = false;
  return was;
}

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && locks > 0) instance.stop();
}

export function lockScroll() {
  locks += 1;
  document.body.style.overflow = 'hidden';
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.body.style.overflow = '';
  lenis?.start();
}

export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true });
  } else if (typeof target === 'number') {
    window.scrollTo(0, target);
  } else {
    target.scrollIntoView();
  }
}

/** Scrolls to the element named by `location.hash`. False when there is none. */
export function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  scrollToTarget(el);
  return true;
}
