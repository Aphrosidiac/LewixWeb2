import { Section } from './Section';

/**
 * Dragonfly's 02 is a filterable research library. Lewix has no published
 * writing yet, so this ships as an honest empty state rather than filler —
 * the layout and filter row are here and ready for the first posts.
 */
export function Writing() {
  return (
    <Section id="writing" num="02" title="Writing">
      <div className="grid gap-14 sm:grid-cols-12">
        <div className="sm:col-span-5">
          <p className="eyebrow">Field notes</p>
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            Build logs, architecture decisions, and post-mortems from systems running in
            production. Written by the people who shipped them.
          </p>
        </div>

        <div className="sm:col-span-7">
          <div className="border border-line p-10 text-center">
            <p className="font-display font-semibold text-3xl text-fg">First posts in progress</p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              We&rsquo;d rather publish nothing than publish filler. Check back shortly.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
