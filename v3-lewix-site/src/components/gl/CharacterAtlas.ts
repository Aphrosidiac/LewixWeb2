import * as THREE from 'three';

// Glyph atlas built to the same spec dragonfly.xyz uses: a 1024x1024 canvas
// divided into a fixed 16x16 grid of 64px cells, each character drawn centred
// in its cell. The ascii shader indexes into this grid by luminance.
const ATLAS_SIZE = 1024;
const GRID = 16;
const CELL = ATLAS_SIZE / GRID; // 64

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

  constructor(characters: string, { fontSize = 72, fontFamily = 'monospace' }: AtlasOptions = {}) {
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

  draw({ characters, fontSize = 72, fontFamily = 'monospace' }: AtlasOptions = {}) {
    const { ctx } = this;
    if (characters) this.characters = characters;

    ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    ctx.font = `${fontSize}px ${fontFamily}, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    this.characters.split('').forEach((char, i) => {
      const col = i % GRID;
      const row = Math.floor(i / GRID);
      ctx.fillText(char, col * CELL + CELL / 2, row * CELL + CELL / 2);
    });

    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}
