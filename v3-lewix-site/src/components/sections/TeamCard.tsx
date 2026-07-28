import Image from 'next/image';
import type { TeamMember } from '@/content/team';

/**
 * One founder card.
 *
 * The media slot is always rendered square whether or not there's anything in
 * it, so the row holds its shape while assets are outstanding. It accepts a
 * photograph or an ASCII-rendered model without the surrounding layout
 * changing.
 *
 * Framing borrows the loading screen's registration marks, so the two moments
 * read as the same design language. Hover colours the marks and nothing else —
 * deliberately restrained.
 */
export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <li className="group relative bg-bg p-5 sm:p-6">
      {['left-2.5 top-2.5', 'right-2.5 top-2.5', 'left-2.5 bottom-2.5', 'right-2.5 bottom-2.5'].map(
        (pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={`absolute ${pos} h-1.5 w-1.5 text-fg-faint/50 transition-colors duration-500 group-hover:text-accent`}
            style={{
              backgroundImage:
                'linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)',
              backgroundSize: '100% 1px, 1px 100%',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )
      )}

      {/*
        No fill and no border on the media slot.

        It used to carry `bg-[#0a0a0c]` and `border border-line` against a
        `#050505` page, which drew a visible lighter square around each model —
        the ascii figure reads as sitting in a box rather than on the page. The
        registration marks above already frame the card, so the box was doing
        the same job twice and losing the float.

        Photographs keep their own edges by being opaque, and the pending-asset
        placeholder carries its own hatch, so neither needed the frame either.
      */}
      <div className="aspect-square w-full overflow-hidden">
        <MediaSlot member={member} />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display font-semibold text-2xl text-fg sm:text-3xl">{member.name}</h3>
        <span className="eyebrow shrink-0">{num}</span>
      </div>

      <p className="eyebrow mt-1.5">{member.role ?? '—'}</p>

      {member.bio && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{member.bio}</p>}
    </li>
  );
}

function MediaSlot({ member }: { member: TeamMember }) {
  const { media, name } = member;

  if (media?.kind === 'photo') {
    return (
      <Image
        src={media.src}
        alt={media.alt ?? name}
        width={800}
        height={800}
        className="h-full w-full object-cover"
      />
    );
  }

  if (media?.kind === 'model') {
    // Left empty on purpose. TeamModels renders every model through one shared
    // WebGL context and paints into this element's screen rect, so there's
    // nothing to draw here — it only needs to exist and be measurable.
    return <div data-team-slot={media.src} className="h-full w-full" aria-hidden="true" />;
  }

  // Nothing supplied yet — hold the space with a faint diagonal field rather
  // than an empty box, so the row reads as intentional while assets are pending.
  return (
    <div
      aria-hidden="true"
      className="h-full w-full opacity-[0.14]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, var(--color-fg-faint) 0 1px, transparent 1px 9px)',
      }}
    />
  );
}
