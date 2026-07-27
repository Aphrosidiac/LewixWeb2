import * as THREE from 'three';
import { quadVertex, trailFragment } from './asciiShaders';

const TRAIL_LENGTH = 40;

// Ring buffer of recent cursor positions in UV space, rendered as fading
// circles into a render target that the ascii pass samples.
export class MouseTrail {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly points: THREE.Vector2[];
  private readonly strength: Float32Array;
  private readonly material: THREE.ShaderMaterial;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.Camera;
  private readonly renderTarget: THREE.WebGLRenderTarget;

  private velocity = 0;
  private lastUv = new THREE.Vector2(0.5, 0.5);
  private lastMoveTime = 0;

  constructor(renderer: THREE.WebGLRenderer, size = 512) {
    this.renderer = renderer;
    this.points = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(-10, -10));
    this.strength = new Float32Array(TRAIL_LENGTH);
    this.lastMoveTime = performance.now();

    this.renderTarget = new THREE.WebGLRenderTarget(size, size, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    this.material = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: trailFragment,
      // Write the trail value straight into the target. Alpha-blending here
      // would store trail*velocity, too weak to clear the step(0.1, ...) gate
      // in the ascii pass, and the accent colour would never appear.
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTrail: { value: this.points },
        uTrailStrength: { value: this.strength },
        uVelocity: { value: 0 },
      },
    });

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
  }

  push(uv: THREE.Vector2) {
    const now = performance.now();
    const dt = Math.max(now - this.lastMoveTime, 1);
    const dist = uv.distanceTo(this.lastUv);

    // Scaled so ordinary cursor movement lands near 1.0, which gives the trail
    // circles (radius = velocity * 0.025) a usable size.
    this.velocity = THREE.MathUtils.clamp((dist / dt) * 2000, 0, 2);
    this.lastMoveTime = now;
    this.lastUv.copy(uv);

    this.points.pop();
    this.points.unshift(uv.clone());

    for (let i = this.strength.length - 1; i > 0; i--) {
      this.strength[i] = this.strength[i - 1];
    }
    this.strength[0] = 1;
  }

  update() {
    this.velocity *= 0.94;
    for (let i = 0; i < this.strength.length; i++) this.strength[i] *= 0.96;
    this.material.uniforms.uVelocity.value = this.velocity;

    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
  }

  get texture(): THREE.Texture {
    return this.renderTarget.texture;
  }

  dispose() {
    this.renderTarget.dispose();
    this.material.dispose();
  }
}
