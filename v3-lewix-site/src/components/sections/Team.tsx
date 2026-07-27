import { Section } from './Section';
import { TeamCard } from './TeamCard';
import { team, teamCopy } from '@/content/team';

export function Team() {
  return (
    <Section id="team" num="03" title="Founding Team">
      {/* gap-px over a line-coloured background draws the dividers, so the row
          reads as one unit rather than three detached cards. */}
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </ul>

      <p className="eyebrow mt-8">{teamCopy.pendingNote}</p>
    </Section>
  );
}
