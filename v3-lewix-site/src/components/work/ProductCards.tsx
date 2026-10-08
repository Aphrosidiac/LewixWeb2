import Image from 'next/image';
import { products, type Product } from '@/content';

/**
 * Lewix's own products, each a real capture of the live site, framed in a
 * browser window on a plate rather than run full bleed. The frame says "this
 * is a website you can open", which a bare screenshot does not.
 */
export function ProductCards({ only }: { only?: readonly string[] }) {
  const shown = only ? products.filter((p) => only.includes(p.slug)) : products;

  // A single product gets the full width: a third-width card alone on a row
  // reads as two missing neighbours.
  if (shown.length === 1) return <ProductFeature p={shown[0]} />;

  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {shown.map((p) => (
        <li key={p.slug}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            className="group flex h-full flex-col rounded-3xl border border-line bg-bg-raised/80 p-3 outline-none transition-colors hover:border-fg-faint focus-visible:border-accent"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-[#f4f4f5]">
              <div className="flex items-center gap-3 border-b border-black/5 bg-white px-3 py-2">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                </span>
                <span className="mx-auto truncate rounded-full bg-black/[0.04] px-3 py-0.5 text-[11px] text-black/50">
                  {p.host}
                </span>
                <span aria-hidden="true" className="w-8" />
              </div>
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={`${p.name}, the live product at ${p.host}`}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-3 pt-6 pb-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display font-semibold text-2xl text-fg transition-colors group-hover:text-accent">
                  {p.name}
                </h3>
                <span className="eyebrow transition-colors group-hover:text-accent">Open ↗</span>
              </div>
              <p className="mt-2 text-sm text-fg">{p.line}</p>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">{p.description}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-3 text-xs text-fg-muted">
                    <span aria-hidden="true" className="text-accent">
                      /
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function BrowserFrame({ p, sizes }: { p: Product; sizes: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#f4f4f5]">
      <div className="flex items-center gap-3 border-b border-black/5 bg-white px-3 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-black/10" />
          <span className="h-2 w-2 rounded-full bg-black/10" />
          <span className="h-2 w-2 rounded-full bg-black/10" />
        </span>
        <span className="mx-auto truncate rounded-full bg-black/[0.04] px-3 py-0.5 text-[11px] text-black/50">
          {p.host}
        </span>
        <span aria-hidden="true" className="w-8" />
      </div>
      <Image
        src={p.image}
        alt={`${p.name}, the live product at ${p.host}`}
        width={p.width}
        height={p.height}
        sizes={sizes}
        className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ProductFeature({ p }: { p: Product }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener"
      className="group grid gap-8 rounded-3xl border border-line bg-bg-raised/80 p-3 outline-none transition-colors hover:border-fg-faint focus-visible:border-accent lg:grid-cols-12 lg:items-center lg:gap-12"
    >
      <div className="lg:col-span-7">
        <BrowserFrame p={p} sizes="(min-width: 1024px) 640px, 100vw" />
      </div>
      <div className="px-3 pb-4 lg:col-span-5 lg:px-0 lg:pr-8 lg:pb-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display font-semibold text-3xl text-fg transition-colors group-hover:text-accent sm:text-4xl">
            {p.name}
          </h3>
          <span className="eyebrow transition-colors group-hover:text-accent">Open ↗</span>
        </div>
        <p className="mt-3 text-base text-fg">{p.line}</p>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted">{p.description}</p>
        <ul className="mt-6 space-y-2 border-t border-line pt-5">
          {p.points.map((point) => (
            <li key={point} className="flex gap-3 text-xs text-fg-muted">
              <span aria-hidden="true" className="text-accent">
                /
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
