import { Section } from './Section';
import { TeamCard } from './TeamCard';
import { team } from '@/content/team';

export function Team() {
  return (
    <Section id="team" num="02" title="Founding Team">
      {/* gap-px over a line-coloured background draws the dividers, so the row
          reads as one unit rather than three detached cards. */}
      {/* Three across from sm: at two columns the third card sat alone next to
          an empty grey cell. */}
      <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {team.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </ul>
    </Section>
  );
}
