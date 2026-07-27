/**
 * Founding team.
 *
 * NOTE: the previous Lewix site had no team section. Roles and bios below are
 * NOT sourced from any existing content and are left empty rather than
 * invented.
 *
 * TODO: confirm each person's title and a short bio before this ships.
 */

/**
 * Each card reserves a 1:1 square slot that can hold either a photograph or a small
 * ASCII-rendered 3D model in the same treatment as the mountain. The slot keeps
 * its ratio whether or not media exists, so the grid never collapses while
 * assets are outstanding.
 */
export type TeamMedia =
  | { kind: 'photo'; src: string; alt?: string }
  | { kind: 'model'; src: string };

export interface TeamMember {
  name: string;
  /** TODO: unconfirmed — no source for titles existed. */
  role?: string;
  /** TODO: bios still to be written. */
  bio?: string;
  /** Omit while undecided; the slot renders an empty frame at the same size. */
  media?: TeamMedia;
}

export const teamCopy = {
  eyebrow: 'Team',
  heading: 'Who builds it',
  /** Shown while the roster is still incomplete. */
  pendingNote: 'Full team details coming soon.',
} as const;

export const team: readonly TeamMember[] = [
  { name: 'Lewis', media: { kind: 'model', src: '/models/team/lewis.glb' } },
  { name: 'Noel', media: { kind: 'model', src: '/models/team/noel.glb' } },
  { name: 'Fakhrul', media: { kind: 'model', src: '/models/team/fakhrul.glb' } },
];
