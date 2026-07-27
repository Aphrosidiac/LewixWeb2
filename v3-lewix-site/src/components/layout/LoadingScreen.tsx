'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { subscribeLoad, startReveal } from '@/lib/loadProgress';
import { hero } from '@/content';
import { MARK_PATH, MARK_VIEWBOX } from '@/components/brand/logomark';

/** Horizontal bands the mark's fill is split into. More = finer venetian edge. */
const BANDS = 26;
const VB_W = MARK_VIEWBOX.width;
const VB_H = MARK_VIEWBOX.height;

/** Height of one odometer digit, px. */
const REEL_H = 14;

/** Floor on how long the counter takes to travel 000 -> 100, ms. */
const MIN_COUNT_MS = 1400;

/** Shortest time the loader stays up, so a warm cache doesn't just flash it. */
const MIN_VISIBLE_MS = 1750;
/** Panel expansion, measured off TRIONN's exit. */
const EXIT_MS = 560;
/** Beat of black after the panel covers, before anything transitions in. */
const REVEAL_HOLD_MS = 340;

export function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bandsRef = useRef<SVGGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const borderRef = useRef<SVGRectElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Rendered on the server too, so the light screen is up on first paint
  // rather than flashing the dark page first.
  const [gone, setGone] = useState(false);
  // The frame SVG's viewBox is kept equal to its pixel size. A stretched
  // viewBox breaks the dash maths: dash lengths resolve in user space while
  // non-scaling-stroke paints in device space, so the border stops short.
  const [frame, setFrame] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setFrame({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mountedAt = performance.now();

    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Counter is driven off a tweened value, not raw progress, so it climbs
    // smoothly instead of jumping as chunks land.
    const shown = { v: 0 };
    let realProgress = 0;
    let ready = false;
    let lastTick = performance.now();

    /**
     * Drives the odometer and the perimeter draw off the same smoothed value,
     * so the number and the border always agree.
     *
     * Each reel is positioned with a fractional index, not a rounded one — that
     * continuous offset is what makes the digits roll like a scoreboard rather
     * than snap.
     */
    const render = () => {
      const value = shown.v * 100; // 0..100

      // Real odometer behaviour: a wheel sits on a whole digit and only rolls
      // during the final unit before the wheel below it wraps. Giving every
      // wheel a continuous position (value/10, value/100) parks the tens and
      // hundreds permanently between two digits, which reads as broken.
      const ones = value % 10;
      const tens = (Math.floor(value / 10) % 10) + Math.max(0, ones - 9);
      const hundreds = Math.floor(value / 100) + Math.max(0, (value % 100) - 99);

      const positions = [hundreds, tens, ones];

      positions.forEach((p, i) => {
        const el = reelRefs.current[i];
        if (el) el.style.transform = `translate3d(0, ${-p * REEL_H}px, 0)`;
      });

      // dashoffset 1 -> 0 traces the rect clockwise from its top-left corner.
      if (borderRef.current) {
        borderRef.current.style.strokeDashoffset = String(1 - shown.v);
      }
    };

    const tl = gsap.timeline();

    if (!reduced) {
      // Registration marks, then the box, then the banded fill.
      tl.fromTo(
        '[data-reg]',
        { opacity: 0, scale: 2.4 },
        { opacity: 1, scale: 1, duration: 0.34, ease: 'power2.out', stagger: 0.03 }
      )
        .fromTo(
          boxRef.current,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' },
          '-=0.18'
        )
        .fromTo(
          '[data-ghost]',
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'none' },
          '-=0.28'
        )
        // The venetian wipe: each band scales out from the left, staggered
        // bottom-to-top. Adjacent bands sitting at different progress is what
        // produces the striped leading edge.
        .fromTo(
          bandsRef.current?.children ? Array.from(bandsRef.current.children) : [],
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.5,
            ease: 'power2.inOut',
            stagger: { each: 0.022, from: 'end' },
            // Drop the mask the moment the fill is complete. 26 rects meeting
            // edge-to-edge leave a faint seam on every boundary from mask
            // antialiasing; once the wipe is done the mask has no job left, and
            // removing it renders the mark perfectly clean.
            onComplete: () => fillRef.current?.removeAttribute('mask'),
          },
          '-=0.1'
        )
        // Absolute position, not a relative offset. Chained off the band wipe
        // this landed at ~1.14s and finished ~30ms before the loader exits —
        // a progress counter nobody could actually watch count. It belongs on
        // screen from the start, alongside the frame.
        .fromTo(
          '[data-meta]',
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.05 },
          0.12
        );
    } else {
      gsap.set(bandsRef.current?.children ? Array.from(bandsRef.current.children) : [], {
        scaleX: 1,
      });
      gsap.set(['[data-reg]', '[data-ghost]', '[data-meta]', boxRef.current], { opacity: 1 });
      fillRef.current?.removeAttribute('mask');
    }

    let exited = false;
    // Arrow, not a hoisted `function` — a declaration wouldn't inherit the
    // non-null narrowing of `panel` from the guard above.
    // ?loader=hold freezes it on screen for tuning; ?loader=slow stretches the
    // hold so the sequence can be watched without throttling the network.
    const mode = new URLSearchParams(window.location.search).get('loader');
    const minVisible = mode === 'slow' ? 9000 : MIN_VISIBLE_MS;

    const tryExit = () => {
      if (exited || mode === 'hold') return;
      const waited = performance.now() - mountedAt;
      if (!ready || waited < minVisible) return;
      exited = true;

      const held = { t: 0 };
      gsap.timeline().to(held, {
        t: 1,
        duration: reduced ? 0.001 : EXIT_MS / 1000,
        // Measured off TRIONN's brightness curve during the panel expand.
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        onStart: () => {
          panel.style.opacity = '1';
        },
        onUpdate: () => {
          // Grow a centred rectangle out to the full viewport. clip-path keeps
          // it GPU-friendly and, unlike scaling, doesn't distort.
          const p = held.t;
          const bw = boxRef.current?.getBoundingClientRect();
          const startW = bw ? bw.width : 220;
          const startH = bw ? bw.height : 220;
          const insetX = ((window.innerWidth - startW) / 2) * (1 - p);
          const insetY = ((window.innerHeight - startH) / 2) * (1 - p);
          panel.style.clipPath = `inset(${insetY}px ${insetX}px round ${2 * (1 - p)}px)`;
        },
        onComplete: () => {
          document.body.style.overflow = '';
          setGone(true);

          // The panel now covers everything, and beneath it the hero is still
          // hidden and the mountain still unbuilt — so the screen is genuinely
          // black. Hold that beat, then let everything transition in from
          // nothing. Starting the reveal any earlier plays it behind the panel,
          // where none of it can be seen.
          //
          // Deliberately not cleared on unmount: this component unmounts as
          // part of the very transition it's scheduling.
          window.setTimeout(startReveal, REVEAL_HOLD_MS);
        },
      });

      // Loading UI fades as the panel swallows it, as in the reference.
      gsap.to([boxRef.current, '[data-meta]'], {
        opacity: 0,
        duration: (EXIT_MS / 1000) * 0.55,
        ease: 'power2.in',
      });
    };

    const unsub = subscribeLoad(({ progress, ready: r }) => {
      realProgress = progress;
      ready = r;
      tryExit();
    });

    // Counter ticks toward real progress. If the server gives no length, creep
    // to 90% on a timer so it never sits frozen at 000.
    const ticker = gsap.ticker.add(() => {
      const target = ready ? 1 : Math.max(realProgress, Math.min(0.9, (performance.now() - mountedAt) / 6000));
      // Paced to take ~1.4s to close the gap. On a warm cache `ready` is true
      // almost immediately, and a faster lerp finishes the count before anyone
      // can read it.
      // Rate-limited linear climb, not an exponential lerp. A lerp covers
      // 0->90 in half a second and then crawls the last stretch, which reads as
      // a frozen counter. Capping the rise per millisecond gives a steady,
      // legible count that still never runs ahead of real progress.
      const now = performance.now();
      const dt = Math.min(now - lastTick, 100); // clamp, so a stalled tab doesn't jump
      lastTick = now;

      shown.v = Math.min(target, shown.v + dt / MIN_COUNT_MS);
      render();
    });

    // Must use `minVisible`, not the constant: with ?loader=slow the constant
    // fires this while the hold is still running, tryExit bails, and nothing
    // ever calls it again — the loader hangs indefinitely.
    const minTimer = window.setTimeout(tryExit, minVisible + 30);

    return () => {
      unsub();
      gsap.ticker.remove(ticker as unknown as () => void);
      window.clearTimeout(minTimer);
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  if (gone) return null;

  const bandH = VB_H / BANDS;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#c0c0c0]"
    >
      {/* Mark + its registration frame */}
      <div ref={boxRef} className="relative">
        {[
          '-top-3.5 -left-3.5',
          '-top-3.5 -right-3.5',
          '-bottom-3.5 -left-3.5',
          '-bottom-3.5 -right-3.5',
        ].map((pos) => (
          <span
            key={pos}
            data-reg
            // Bolder, and matching the *filled* border colour rather than
            // sitting between the two states.
            className={`absolute ${pos} h-2.5 w-2.5 text-[#050505]/85`}
            style={{
              backgroundImage:
                'linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)',
              backgroundSize: '100% 1.5px, 1.5px 100%',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}

        {/* Perimeter progress. Two rects: a faint unfilled track, and a darker
            heavier stroke drawn over it. pathLength="1" lets dashoffset be the
            progress value directly, and an SVG rect's path starts at the
            top-left corner and runs clockwise — which is exactly the path the
            fill should trace. */}
        {frame.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${frame.w} ${frame.h}`}
            aria-hidden="true"
          >
            <rect
              x="0.5"
              y="0.5"
              width={frame.w - 1}
              height={frame.h - 1}
              fill="none"
              stroke="#050505"
              strokeOpacity="0.16"
              strokeWidth="1"
            />
            <rect
              ref={borderRef}
              x="0.5"
              y="0.5"
              width={frame.w - 1}
              height={frame.h - 1}
              fill="none"
              stroke="#050505"
              strokeOpacity="0.9"
              strokeWidth="2"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
        )}

        <div className="p-8">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="h-[132px] w-auto sm:h-[168px]"
            role="presentation"
          >
            <defs>
              <linearGradient id="loaderBrand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#67E1F9" />
                <stop offset="0.55" stopColor="#6880F2" />
                <stop offset="1" stopColor="#8151DF" />
              </linearGradient>

              {/* The fill is revealed through these bands. Each scales out from
                  its left edge; staggering them gives the striped edge. */}
              <mask id="loaderBands" maskUnits="userSpaceOnUse">
                <g ref={bandsRef}>
                  {Array.from({ length: BANDS }, (_, i) => (
                    <rect
                      key={i}
                      x="0"
                      // Bands overlap their neighbours by a whole unit on each
                      // side. Butt-jointed rects show a seam mid-wipe because
                      // both edges are antialiased against each other.
                      y={i * bandH - 1}
                      width={VB_W}
                      height={bandH + 2}
                      fill="#fff"
                      shapeRendering="crispEdges"
                      style={{ transformOrigin: `0px ${i * bandH + bandH / 2}px` }}
                    />
                  ))}
                </g>
              </mask>
            </defs>

            {/* Pale ghost of the finished mark, present from the start */}
            <path data-ghost d={MARK_PATH} fill="none" stroke="#050505" strokeOpacity="0.22" strokeWidth="6" />
            {/* Gradient fill, revealed band by band */}
            <path ref={fillRef} d={MARK_PATH} fill="url(#loaderBrand)" mask="url(#loaderBands)" />
          </svg>
        </div>
      </div>

      {/* Service tags + counter */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 pb-10">
        <div className="flex gap-5">
          {hero.serviceTags.map((t) => (
            <span
              key={t}
              data-meta
              className="text-[10px] font-medium tracking-[0.22em] text-[#050505]/55 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
        <div data-meta className="flex" style={{ height: REEL_H }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden" style={{ height: REEL_H }}>
              <div
                ref={(el) => {
                  reelRefs.current[i] = el;
                }}
                className="will-change-transform"
              >
                {/* 0-9 plus a repeated 0, so the wrap from 9 back to 0 lands on
                    an identical glyph and the reset is invisible. */}
                {[...Array(11)].map((_, n) => (
                  <span
                    key={n}
                    className="block text-center text-[12px] leading-none font-semibold tracking-[0.1em] text-[#050505]/80 tabular-nums"
                    style={{ height: REEL_H, lineHeight: `${REEL_H}px`, width: '0.72em' }}
                  >
                    {n % 10}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The incoming dark page, grown out of the mark's box */}
      <div
        ref={panelRef}
        className="pointer-events-none absolute inset-0 bg-bg opacity-0"
        style={{ clipPath: 'inset(50% round 2px)' }}
      />
    </div>
  );
}

