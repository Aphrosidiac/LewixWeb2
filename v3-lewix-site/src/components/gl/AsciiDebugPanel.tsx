'use client';

import { useEffect, useRef, useState } from 'react';
import { useControls, Leva, button } from 'leva';
import type * as THREE from 'three';

/**
 * Shape of the `window.__mtn` debug handle AsciiMountain exposes behind
 * `?mtn=1`. Only the pieces this panel actually drives.
 */
interface MtnHandle {
  asciiUniforms: {
    uGranularity: { value: number };
    uCharactersLimit: { value: number };
    uInvert: { value: boolean };
    uGreyscale: { value: boolean };
    uFillPixels: { value: boolean };
    uOverwriteColor: { value: boolean };
    uMatrix: { value: boolean };
    uNoise: { value: boolean };
    uBrightness: { value: number };
    uOpacity: { value: number };
    uSmear: { value: number };
    uDilate: { value: number };
    uColor: { value: THREE.Color };
    uBackground: { value: THREE.Color };
    uAccentColor: { value: THREE.Color };
  };
  atlas: {
    draw: (opts: { characters?: string; fontSize?: number; fontFamily?: string }) => void;
  };
}

const DEFAULT_CHARACTERS = ' * _<>,  ./O#SF +';
const DEFAULT_FONT_STACK =
  'Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace';

const FONT_PRESETS = {
  'System stack (current)': DEFAULT_FONT_STACK,
  'JetBrains Mono': '"JetBrains Mono", monospace',
  'IBM Plex Mono': '"IBM Plex Mono", monospace',
  'Space Mono': '"Space Mono", monospace',
  'Menlo only': 'Menlo, monospace',
  'Consolas only': 'Consolas, monospace',
  'Generic monospace (dragonfly.xyz default)': 'monospace',
};

/**
 * Single source of truth for "shipped defaults," reused both as each
 * folder's initial schema value and as the reset button's payload — so the
 * two can never quietly drift apart.
 *
 * These are not a guess derived from local source — they're what's actually
 * running on lewix.ai. Verified twice, both on 2026-08-02: (1) pulled live
 * off the deployed site itself via `window.__mtn.asciiUniforms` at
 * lewix.ai/?mtn=1, which covers every value below except the three glyph
 * ones (fontFamily/fontSize/characters aren't stored back on the CharacterAtlas
 * instance, so they aren't introspectable at runtime); (2) confirmed those
 * three, plus a second read of everything else, via SSH against the actual
 * deployed source at commit 6206aad
 * (`ssh dreamgarage-do "cd /home/lewix-web/v3-lewix-site && git log -1"`).
 *
 * If a future deploy changes any of AsciiMountain.tsx's `asciiUniforms`
 * initial values, CharacterAtlas's `FONT_STACK`, or AsciiMountain's
 * `CHARSET`/`FONT_SIZE`, these four objects need updating to match — there's
 * no way to keep them live-synced automatically, since this panel can't
 * reach across origins into a deployed site's JS state on its own.
 */
const SHADER_DEFAULTS = {
  granularity: 6,
  charactersLimit: 16,
  brightness: 0,
  opacity: 1,
  invert: false,
  greyscale: true,
  fillPixels: false,
  overwriteColor: true,
};
const MOTION_DEFAULTS = { matrix: false, noise: false, smear: 0, dilate: 0 };
const COLOR_DEFAULTS = { color: '#eeeeee', background: '#000000', accentColor: '#6880f2' };
const GLYPH_DEFAULTS = {
  characters: DEFAULT_CHARACTERS,
  fontSize: 72,
  fontFamily: DEFAULT_FONT_STACK,
};

/**
 * Live tuning panel for the hero's ascii shader — the in-site equivalent of
 * darkroom.engineering's Aniso tool, wired directly to THIS site's own
 * uniforms and atlas instead of a standalone demo fed a static model.
 *
 * Gated on the same `?mtn=1` query flag as the `__mtn` debug hook it drives,
 * so it's reachable on any deployment (including production) without being
 * shipped to normal visitors — `AsciiDebugPanel` itself is dynamically
 * imported with `ssr: false` from page.tsx, so leva's bundle is never
 * downloaded unless the flag is present.
 */
export function AsciiDebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const mtnRef = useRef<MtnHandle | null>(null);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('mtn')) return;
    setEnabled(true);

    let raf = 0;
    const poll = () => {
      const mtn = (window as unknown as { __mtn?: MtnHandle }).__mtn;
      if (mtn?.asciiUniforms && mtn.atlas) {
        mtnRef.current = mtn;
        setReady(true);
        return;
      }
      raf = requestAnimationFrame(poll);
    };
    poll();
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!enabled || !ready) return null;
  return <PanelInner mtnRef={mtnRef} />;
}

function PanelInner({ mtnRef }: { mtnRef: React.RefObject<MtnHandle | null> }) {
  // Function-form schemas, so useControls returns a `set` we can call from
  // the reset button — the plain-object form used previously only returns
  // values, with no way to push a value back into the panel programmatically.
  const [shader, setShader] = useControls('Shader', () => ({
    granularity: { value: SHADER_DEFAULTS.granularity, min: 1, max: 32, step: 0.5 },
    charactersLimit: { value: SHADER_DEFAULTS.charactersLimit, min: 2, max: 16, step: 1 },
    brightness: { value: SHADER_DEFAULTS.brightness, min: -0.5, max: 0.5, step: 0.01 },
    opacity: { value: SHADER_DEFAULTS.opacity, min: 0, max: 1, step: 0.01 },
    invert: SHADER_DEFAULTS.invert,
    greyscale: SHADER_DEFAULTS.greyscale,
    fillPixels: SHADER_DEFAULTS.fillPixels,
    overwriteColor: SHADER_DEFAULTS.overwriteColor,
  }));

  const [motion, setMotion] = useControls('Motion', () => ({
    matrix: MOTION_DEFAULTS.matrix,
    noise: MOTION_DEFAULTS.noise,
    smear: { value: MOTION_DEFAULTS.smear, min: 0, max: 1, step: 0.01 },
    dilate: { value: MOTION_DEFAULTS.dilate, min: 0, max: 4, step: 0.1 },
  }));

  const [color, setColor] = useControls('Color', () => ({
    color: COLOR_DEFAULTS.color,
    background: COLOR_DEFAULTS.background,
    accentColor: COLOR_DEFAULTS.accentColor,
  }));

  const [glyph, setGlyph] = useControls('Glyph atlas', () => ({
    characters: { value: GLYPH_DEFAULTS.characters },
    fontSize: { value: GLYPH_DEFAULTS.fontSize, min: 12, max: 200, step: 1 },
    fontFamily: { value: GLYPH_DEFAULTS.fontFamily, options: FONT_PRESETS },
  }));

  useControls({
    'Reset to shipped defaults': button(() => {
      // Push through Leva's own `set`, not a direct atlas.draw()/uniform
      // write — that's what makes the widgets themselves (sliders, swatches,
      // the font dropdown) snap back too, not just the render. The effects
      // below pick up the resulting value changes and propagate them to the
      // uniforms/atlas the same way any manual edit would.
      setShader(SHADER_DEFAULTS);
      setMotion(MOTION_DEFAULTS);
      setColor(COLOR_DEFAULTS);
      setGlyph(GLYPH_DEFAULTS);
    }),
  });

  // Cheap per-frame uniforms — just number/bool/color writes, applied every
  // render. No atlas redraw involved, so this is fine to run on every change.
  useEffect(() => {
    const mtn = mtnRef.current;
    if (!mtn) return;
    const u = mtn.asciiUniforms;

    u.uGranularity.value = shader.granularity;
    u.uCharactersLimit.value = shader.charactersLimit;
    u.uBrightness.value = shader.brightness;
    u.uOpacity.value = shader.opacity;
    u.uInvert.value = shader.invert;
    u.uGreyscale.value = shader.greyscale;
    u.uFillPixels.value = shader.fillPixels;
    u.uOverwriteColor.value = shader.overwriteColor;

    u.uMatrix.value = motion.matrix;
    u.uNoise.value = motion.noise;
    u.uSmear.value = motion.smear;
    u.uDilate.value = motion.dilate;

    u.uColor.value.set(color.color);
    u.uBackground.value.set(color.background);
    u.uAccentColor.value.set(color.accentColor);
  });

  // Atlas redraw is comparatively expensive (canvas fillText pass + a
  // getImageData ink-coverage measurement per glyph) — only re-run it when
  // the three inputs that actually feed CharacterAtlas.draw() change.
  useEffect(() => {
    mtnRef.current?.atlas.draw({
      characters: glyph.characters,
      fontSize: glyph.fontSize,
      fontFamily: glyph.fontFamily,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glyph.characters, glyph.fontSize, glyph.fontFamily]);

  return <Leva titleBar={{ title: 'ASCII TUNING (?mtn=1)' }} collapsed={false} />;
}
