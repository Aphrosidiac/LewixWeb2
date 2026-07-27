'use client';

import { useEffect, useRef } from 'react';
import { STAGE_VH, clamp01, smoothstep, stageProgress } from '@/lib/scrollStage';

/**
 * The empty scroll run between the hero and About.
 *
 * Structurally this is just height — the spacer exists so there is scroll
 * distance for AsciiMountain's summit approach to play against, with no copy
 * competing for attention. dragonfly leaves the equivalent stretch completely
 * bare.
 *
 * The one thing sitting in it is an ascent readout, which climbs with the
 * camera and clears the screen before the summit so the beat at the top stays
 * genuinely empty. It reuses the loading screen's counter language on purpose:
 * the two are the same idea, an instrument reading out a climb.
 */
export function ScrollStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bar = barRef.current;
    const num = numRef.current;
    if (!wrap || !bar || !num) return;

    let raf = 0;
    let last = -1;

    const tick = () => {
      const t = stageProgress(window.scrollY, window.innerHeight);
      if (t !== last) {
        last = t;

        // In quickly, gone by the crest at 0.55 so the beat over the top stays
        // genuinely empty.
        const fadeIn = smoothstep(clamp01(t / 0.1));
        const fadeOut = smoothstep(clamp01((t - 0.42) / 0.12));
        wrap.style.opacity = String(fadeIn * (1 - fadeOut));

        // Tops out just as the readout clears, so the number reaches 100 at the
        // summit rather than trailing off mid-climb.
        const climb = smoothstep(clamp01(t / 0.5));
        bar.style.transform = `scaleX(${climb})`;
        num.textContent = String(Math.round(climb * 100)).padStart(3, '0');
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="relative" style={{ height: `${STAGE_VH * 100}vh` }}>
      <div
        ref={wrapRef}
        className="text-legible sticky top-0 flex h-screen items-end px-6 pb-10 opacity-0 sm:px-10"
      >
        <div className="flex w-full items-center gap-5">
          <span className="eyebrow shrink-0">Ascent</span>
          <span className="relative h-px flex-1 overflow-hidden bg-line">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left bg-fg-faint"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
          <span ref={numRef} className="eyebrow shrink-0 tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
