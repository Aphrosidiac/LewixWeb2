import Image from 'next/image';
import { site, hero } from '@/content';
import { HeroExit } from '@/components/layout/HeroExit';

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col px-6 pt-28 pb-10 sm:px-10">
      <HeroExit />
      {/* Everything the hero draws lives inside this one wrapper so HeroExit can
          drift the whole lockup out with a single transform. */}
      <div data-hero-parallax className="flex flex-1 flex-col justify-between">
      <p data-hero-rise className="eyebrow">{site.established}</p>

      {/* The ASCII mountain renders behind this; the wordmark sits over it the
          way dragonfly's DRAGONFLY lockup sits over its insect. */}
      {/* Vertically centred, left-aligned. The mountain starts panned right so
          it fills the space beside this rather than sitting under it. */}
      <div className="pointer-events-none flex flex-1 flex-col justify-center">
        {/*
          The h1 stays screen-reader-only, because the visible lockup is the
          wordmark image and putting a sentence there would break the design.
          But it no longer says just "LEWIX".

          A one-word h1 tells a crawler nothing about what the page is for,
          and this is the only h1 on the site's most important URL: every
          other heading here is a section label ("About", "Work", "Contact").
          `sr-only` clips the element rather than hiding it, so the text is
          still counted; `alt=""` on the wordmark below is correct precisely
          because this line now carries the meaning.
        */}
        <h1 className="sr-only">{hero.h1}</h1>
        {/* Sized so the mountain stays the hero. Wider share on small screens,
            where a percentage-only cap would render it tiny. */}
        <Image
          data-hero-rise
          src="/brand/lewix-wordmark-on-dark-1200w.png"
          alt=""
          width={1200}
          height={191}
          priority
          className="h-auto w-full max-w-[72vw] sm:max-w-[min(46vw,34rem)]"
        />
        {/* Deliberately narrower than the lockup so the two don't read as one
            block. No backdrop panel — a text shadow carries legibility over the
            glyph field instead. */}
        <p data-hero-rise className="text-legible mt-7 max-w-[52vw] font-sans text-xs leading-relaxed tracking-[0.12em] text-fg uppercase sm:max-w-[min(28vw,20rem)] sm:text-sm">
          {hero.kicker}
        </p>
      </div>

      <div data-hero-rise className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {hero.serviceTags.map((tag, i) => (
          <span key={tag} className="eyebrow">
            {tag}
            {i < hero.serviceTags.length - 1 && <span className="pl-4 text-fg-faint/50">/</span>}
          </span>
        ))}
      </div>
      </div>
    </section>
  );
}
