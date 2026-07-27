import type { ReactNode } from 'react';

/**
 * Numbered section shell, mirroring dragonfly's "01 / ABOUT" treatment:
 * a large index numeral above a display-face section word, over a rule.
 */
export function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <header data-rise className="mb-14 sm:mb-20">
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-semibold text-3xl text-accent sm:text-4xl">{num}</span>
            <h2 className="font-display font-semibold text-5xl leading-none tracking-tight text-fg sm:text-7xl">
              {title}
            </h2>
          </div>
          <div className="rule mt-10" />
        </header>
        <div data-rise>{children}</div>
      </div>
    </section>
  );
}
