/**
 * Geometry of the empty scroll run between the hero and About.
 *
 * dragonfly.xyz reserves roughly a viewport of scroll there in which no copy
 * enters or leaves — the only thing that happens is the 3D shot. Its insect
 * flies at the camera, fills the frame, passes, and the screen sits briefly on
 * near-black before "01 ABOUT" arrives.
 *
 * This module holds the numbers shared by the two halves of that effect: the
 * spacer that creates the scroll distance, and the camera rig that consumes it.
 * Keeping them here is the only thing stopping the two from drifting apart.
 */

/** The hero is exactly one viewport tall. */
export const HERO_VH = 1;

/**
 * Height of the spacer, in viewports.
 *
 * Note this is not the length of the shot. A spacer occupying document rows
 * [1, 1 + STAGE_VH] only has the screen entirely to itself while scrollY is in
 * [1, STAGE_VH] — About's header crosses the bottom edge a full viewport before
 * you finish scrolling past the spacer. So the usable run is STAGE_VH - 1, and
 * a spacer of one-and-a-bit viewports (the intuitive choice) buys almost no
 * empty screen at all.
 *
 * So the shot runs over STAGE_VH - 1 viewports of scroll, and that figure is
 * what sets its pace. Raise it to slow the camera down, not the keyframe times
 * — those are proportions of the run, and stay put.
 */
export const STAGE_VH = 3.2;

/** Scroll offset, in viewports, at which the shot ends and About starts to
 *  enter from the bottom. */
export const STAGE_END_VH = STAGE_VH;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** 0 → 1 across the stage. A pure function of scrollY, so scrolling back up
 *  replays the shot in exact reverse with no state to unwind. */
export function stageProgress(scrollY: number, vh: number) {
  return clamp01((scrollY - vh * HERO_VH) / (vh * (STAGE_END_VH - HERO_VH)));
}

export type Keyframes = readonly (readonly [t: number, value: number])[];

/**
 * Piecewise smoothstep through `keys`, which must be sorted by t and span the
 * whole 0–1 range. Easing every segment individually means each keyframe is a
 * moment of rest, which is what makes the shot read as a sequence of held
 * framings rather than one continuous drift.
 */
export function track(t: number, keys: Keyframes) {
  const last = keys[keys.length - 1];
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= last[0]) return last[1];

  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    if (t > t1) continue;
    const [t0, v0] = keys[i - 1];
    return v0 + (v1 - v0) * smoothstep((t - t0) / (t1 - t0));
  }
  return last[1];
}
