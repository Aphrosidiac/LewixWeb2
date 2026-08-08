import Image from 'next/image';
import { partners, partnersCopy } from '@/content';

/**
 * Client logo band, between Work and Contact.
 *
 * Deliberately NOT a numbered section. The numerals run 01 About, 02 Writing,
 * 03 Founding Team, 04 Work, 05 Contact, and they are echoed in the footer nav
 * and the header counter — this is a proof band that belongs next to Work, not
 * a sixth destination someone would navigate to. It sits between the two as a
 * full-bleed rule-to-rule strip, the same treatment the About marquee gets.
 *
 * Placement is the argument: Work now describes system types rather than named
 * clients, so the logos land immediately after, answering "who actually runs
 * this" at the exact moment the question occurs.
 */

/**
 * Copies of the logo set per half of the track.
 *
 * The four logos are only ~600px wide together. One set would leave most of a
 * desktop viewport empty and the loop would read as a gap sliding past, so the
 * set is repeated until it overruns the widest screen this will meet before the
 * seam comes around. Four covers ~2560px at the desktop item width.
 */
const REPEATS = 4;

export function TrustedBy() {
  const half = Array.from({ length: REPEATS }, () => partners).flat();
  const track = [...half, ...half];

  return (
    <section aria-labelledby="trusted-by-heading" className="relative border-y border-line py-14 sm:py-20">
      <div data-rise className="mx-auto mb-10 w-full max-w-6xl px-6 text-center sm:mb-14 sm:px-10">
        <p id="trusted-by-heading" className="eyebrow">
          {partnersCopy.eyebrow}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{partnersCopy.note}</p>
      </div>

      {/*
        The names, once, for assistive tech. The visual track repeats each logo
        eight times, so it is hidden outright rather than left to a screen reader
        to read "Shuda Logistics" eight times over.
      */}
      <ul className="sr-only">
        {partners.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="partner-band overflow-hidden">
        <div className="partner-track flex w-max items-center">
          {track.map((p, i) => (
            // Spacing is padding on the item, not a flex gap on the track — see
            // the note in globals.css. Do not swap this for `gap-*`.
            <span key={`${p.name}-${i}`} className="flex shrink-0 items-center px-10 sm:px-16">
              <Image
                src={p.src}
                alt=""
                width={p.width}
                height={p.height}
                /*
                  Generous relative to the ~120px render width, because the
                  browser picks a candidate off this and these are line art on
                  black — an under-resolved silhouette goes visibly furry at the
                  edges where a photograph would just soften.
                */
                sizes="(max-width: 640px) 240px, 320px"
                /*
                  One height for all four is correct here and is not laziness:
                  the assets are baked into canvases of identical height with
                  each logo pre-scaled to its own optical weight, so equal CSS
                  height yields unequal, correct visual sizes. See partners.ts.

                  Held under full white so the row reads as supporting evidence
                  rather than competing with the section headings. Brightens on
                  hover, which is reachable because the band pauses on hover.

                  Not dimmer than this: at 55% these went so faint against the
                  near-black page that the logos stopped functioning as proof,
                  which is the only reason they are on the page.
                */
                className="h-10 w-auto opacity-75 transition-opacity duration-300 hover:opacity-100 sm:h-14"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
