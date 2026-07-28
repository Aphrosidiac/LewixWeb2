import * as THREE from 'three';

// Glyph atlas built to the same spec dragonfly.xyz uses: a 1024x1024 canvas
// divided into a fixed 16x16 grid of 64px cells, each character drawn centred
// in its cell. The ascii shader indexes into this grid by luminance.
const ATLAS_SIZE = 1024;
const GRID = 16;
const CELL = ATLAS_SIZE / GRID; // 64

/**
 * Empty margin kept inside every cell, in atlas pixels.
 *
 * The shader samples the atlas with LinearFilter and heavy minification (a
 * 64px tile drawn into a ~6px screen cell), so a glyph whose ink runs right to
 * the tile edge can still pick up its neighbour through filter taps. Two pixels
 * of guaranteed emptiness kills that.
 */
const CELL_PADDING = 2;

/**
 * Menlo first, deliberately: it is what macOS resolves the generic `monospace`
 * keyword to, so the atlas keeps rendering exactly as it does on the machine
 * this look was signed off on. The rest are explicit fallbacks rather than
 * leaving the choice to the OS.
 */
const FONT_STACK =
  'Menlo, Consolas, "DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace';

export interface AtlasOptions {
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
}

export class CharacterAtlas {
  readonly grid = GRID;
  readonly texture: THREE.CanvasTexture;

  private characters: string;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(characters: string, { fontSize = 72, fontFamily = FONT_STACK }: AtlasOptions = {}) {
    this.characters = characters;

    const canvas = document.createElement('canvas');
    canvas.width = ATLAS_SIZE;
    canvas.height = ATLAS_SIZE;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('CharacterAtlas: could not acquire a 2D context');
    this.ctx = ctx;

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    // Must repeat, not clamp: the shader's charUV lands one full tile below the
    // target row (y - 1.0) and relies on wrapping to land back on it. With
    // ClampToEdge the whole thing renders blank, with no console error.
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;

    this.draw({ fontSize, fontFamily });
  }

  /**
   * Draws every glyph so its ink is measured, scaled and clipped to its own
   * cell.
   *
   * The previous version set `72px monospace` into 64px cells and trusted the
   * result. Whether a 72px glyph actually fits 64px is a property of the font,
   * and `monospace` is a generic keyword each OS resolves differently — Menlo
   * on macOS, Courier New or Consolas on Windows. Where the substituted face
   * ran larger, ink spilled past the tile; because the texture is
   * RepeatWrapping, that spill landed in adjacent tiles, including the BLANK
   * entries at charset indices 0, 2, 7, 8 and 15. Those blanks are what punch
   * the holes through the terrain, so filling them turned the mountain into a
   * solid mass with no black in it at all — which is exactly how it rendered on
   * Windows while looking correct on macOS.
   *
   * Two independent guarantees now:
   *
   *  1. A single UNIFORM scale, computed from the largest ink box across the
   *     whole charset, brings every glyph inside the cell. Uniform is the point
   *     — scaling glyphs individually would equalise their ink coverage and
   *     flatten the brightness ramp the shader selects on.
   *  2. A per-cell clip, so nothing can cross a tile boundary even if a font
   *     reports metrics that disagree with what it rasterises.
   */
  draw({ characters, fontSize = 72, fontFamily = FONT_STACK }: AtlasOptions = {}) {
    const { ctx } = this;
    if (characters) this.characters = characters;

    ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const chars = this.characters.split('');

    // Pass 1 — measure at the requested size and find the largest ink box.
    ctx.font = `${fontSize}px ${fontFamily}`;
    let maxInk = 0;
    for (const char of chars) {
      const m = ctx.measureText(char);
      const w = (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
      const h = (m.actualBoundingBoxAscent ?? 0) + (m.actualBoundingBoxDescent ?? 0);
      maxInk = Math.max(maxInk, w, h);
    }

    // Only ever shrink. If the font already fits, the atlas is byte-identical
    // to the old one, so nothing changes on the platform this was tuned against.
    const budget = CELL - CELL_PADDING * 2;
    const scale = maxInk > 0 ? Math.min(1, budget / maxInk) : 1;
    ctx.font = `${fontSize * scale}px ${fontFamily}`;

    // Pass 2 — draw each glyph centred on its own ink box, clipped to its cell.
    chars.forEach((char, i) => {
      const cellX = (i % GRID) * CELL;
      const cellY = Math.floor(i / GRID) * CELL;

      ctx.save();
      ctx.beginPath();
      ctx.rect(cellX, cellY, CELL, CELL);
      ctx.clip();

      const m = ctx.measureText(char);
      const left = m.actualBoundingBoxLeft ?? 0;
      const right = m.actualBoundingBoxRight ?? 0;
      const ascent = m.actualBoundingBoxAscent ?? 0;
      const descent = m.actualBoundingBoxDescent ?? 0;

      // Centre on the ink, not on the advance width or the baseline. Advance
      // width includes side bearings, which differ between faces and would
      // shift glyphs off-centre by a different amount per platform.
      const x = cellX + CELL / 2 - (left + right) / 2 + left;
      const y = cellY + CELL / 2 + (ascent + descent) / 2 - descent;

      ctx.fillText(char, x, y);
      ctx.restore();
    });

    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}
