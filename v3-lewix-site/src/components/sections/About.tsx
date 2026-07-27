import { Section } from './Section';
import { manifesto, principles, story, marqueeItems } from '@/content';

export function About() {
  return (
    <Section id="about" num="01" title="About">
      <div className="grid gap-14 sm:grid-cols-12">
        <div className="sm:col-span-7">
          <p className="font-display font-semibold text-2xl leading-snug text-fg sm:text-3xl">{manifesto}</p>
        </div>

        <div className="space-y-5 sm:col-span-5">
          <p className="eyebrow">Ethos</p>
          {story.map((para) => (
            <p key={para.slice(0, 32)} className="text-sm leading-relaxed text-fg-muted">
              {para}
            </p>
          ))}
        </div>
      </div>

      <ul className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p) => (
          <li key={p.num} className="bg-bg p-6 transition-colors hover:bg-bg-raised">
            <span className="eyebrow text-accent">{p.num}</span>
            <h3 className="mt-4 font-display font-semibold text-2xl text-fg">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{p.description}</p>
          </li>
        ))}
      </ul>

      <Marquee />
    </Section>
  );
}

/** Continuous ticker, as on dragonfly's "GLOBAL SINCE DAY 1" band. */
function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="mt-20 overflow-hidden border-y border-line py-5">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="eyebrow flex items-center gap-10">
            {item}
            {/* Slash, not an em dash: matches the hero's service-tag separator
                and keeps em dashes off the page entirely. */}
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
