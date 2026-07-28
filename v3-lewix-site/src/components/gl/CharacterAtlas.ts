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

/**
 * Mean ink coverage, over the charset's NON-BLANK glyphs, that the atlas is
 * normalised to. Fraction of a cell's pixels carrying ink, averaged.
 *
 * This is the one thing about the atlas that is genuinely platform-dependent,
 * and it is what made the same build read completely differently on two
 * machines. `FONT_STACK` resolves to a different face per OS, and the faces do
 * not carry the same weight. Measured off the live site at an identical
 * 1920-wide dpr-1 viewport, per glyph, as covered-pixel fraction:
 *
 *            *      #      O      S      F      /
 *   Menlo   .178   .281   .260   .229   .195   .130     (macOS)
 *   Consolas.107   .207   .214   .173   .147   .108     (Windows)
 *
 * Menlo runs ~34% heavier across the ramp. The shader draws one glyph per ~6px
 * cell, so that extra ink is the difference between marks that read as separate
 * dots with black between them and marks that touch their neighbours and close
 * into a continuous grey hatch. Same cell size, same cell count, same charset,
 * same dpr — only the weight of the ink differs.
 *
 * Normalising WEIGHT rather than switching to a bundled webfont is deliberate:
 * this number IS the Consolas profile, so on Windows the correction solves to
 * ~1.0 and that render — the one that was signed off — does not move at all.
 * Only platforms that resolve a heavier face are pulled onto it.
 *
 * Note this scales the glyph, not the cell. GRANULARITY stays at 6 and the cell
 * count over the terrain is untouched; the grain keeps its spacing and only the
 * mark inside each cell gets back to the right weight.
 */
const TARGET_MEAN_INK = 0.1166;

/** Ink-coverage alpha above which a pixel counts as inked. */
const INK_ALPHA = 8;

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

    // `willReadFrequently` because the weight normalisation reads every cell
    // back once per pass; without it Chrome keeps the surface on the GPU and
    // each getImageData pays a full readback.
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
    const fitScale = maxInk > 0 ? Math.min(1, budget / maxInk) : 1;
    const fitSize = fontSize * fitScale;

    /**
     * Pass 2 — paint, then pull the glyph weight onto TARGET_MEAN_INK.
     *
     * Ink area goes roughly with the square of the type size, so
     * `sqrt(target / measured)` lands close on the first correction and the
     * loop is only there to absorb the part that isn't quadratic (hinting,
     * stem snapping, the padding). Two or three passes is convergence to well
     * under a pixel; it runs once at startup on a 1024² canvas.
     *
     * Never allowed above `fitSize`: pass 1's guarantee that ink stays inside
     * its own cell has to survive this, or spill lands in the blank tiles
     * through RepeatWrapping and takes the holes with it.
     */
    let size = fitSize;
    let ink = this.paint(chars, size, fontFamily);

    for (let pass = 0; pass < 3 && ink > 0; pass++) {
      const next = Math.min(size * Math.sqrt(TARGET_MEAN_INK / ink), fitSize);
      if (Math.abs(next - size) < 0.2) break;
      size = next;
      ink = this.paint(chars, size, fontFamily);
    }

    this.texture.needsUpdate = true;
  }

  /**
   * Draws the whole charset at `size` and returns the mean ink coverage of its
   * non-blank glyphs, as a fraction of a cell.
   *
   * Blanks are excluded from the average on purpose — they contribute a
   * guaranteed zero, so including them would just scale the measurement by
   * however many blanks the charset happens to carry and make TARGET_MEAN_INK
   * a function of the charset rather than of the font.
   */
  private paint(chars: string[], size: number, fontFamily: string): number {
    const { ctx } = this;

    ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    ctx.font = `${size}px ${fontFamily}`;

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

    let total = 0;
    let counted = 0;

    chars.forEach((char, i) => {
      if (char === ' ') return;
      const cellX = (i % GRID) * CELL;
      const cellY = Math.floor(i / GRID) * CELL;
      const { data } = ctx.getImageData(cellX, cellY, CELL, CELL);

      let inked = 0;
      for (let p = 3; p < data.length; p += 4) if (data[p] > INK_ALPHA) inked++;

      total += inked / (CELL * CELL);
      counted++;
    });

    return counted > 0 ? total / counted : 0;
  }

  dispose() {
    this.texture.dispose();
  }
}
