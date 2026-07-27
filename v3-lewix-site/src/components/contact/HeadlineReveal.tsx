'use client';

import { useEffect, useState } from 'react';

/**
 * Word-by-word mask reveal for a headline.
 *
 * Each word sits in a clipping box with the glyphs starting fully below it, so
 * the line wipes up into place. A fade alone at this size reads as nothing
 * happening at all, which is exactly what the page was doing before.
 *
 * Splitting on words rather than characters keeps the text selectable, keeps it
 * in the accessibility tree as one string, and doesn't explode a long heading
 * into a hundred animated nodes.
 */
export function HeadlineReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** ms before the first word starts. */
  delay?: number;
}) {
  // The animating class is applied only after mount, never on the server.
  //
  // Previously the mask class shipped in the SSR HTML with the animation merely
  // paused. `mask-rise` uses fill-mode `both`, so a paused animation holds its
  // `from` state — translateY(110%), fully clipped. With JS disabled or a failed
  // hydration the headline was permanently invisible. Authoring it visible and
  // opting in to motion afterwards is the only safe order.
  const [go, setGo] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const words = text.split(' ');

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          // The clipping box. `pb`/`-mb` give descenders room so the mask
          // doesn't shave the tail off a "y" or a "g".
          className={`inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em] ${
            go ? 'mask-rise' : ''
          }`}
        >
          <span style={go ? { animationDelay: `${delay + i * 65}ms` } : undefined}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  );
}
