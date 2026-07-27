'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { CharacterAtlas } from './CharacterAtlas';
import { quadVertex, detailMeshVertex, detailMeshFragment, asciiFragment } from './asciiShaders';
import { team } from '@/content/team';

/**
 * A MONOTONIC density ramp — light to heavy, with a blank only at index 0.
 *
 * The hero deliberately uses dragonfly's own set, `" * _<>,  ./O#SF +"`, which
 * hides spaces at indices 2, 7, 8 and 15. On a huge, finely-tessellated mountain
 * those gaps read as pleasant organic scatter. On a small low-poly object they
 * are holes: a flat facet has a near-constant normal, so the whole facet maps to
 * a single index, and if that index is a space the entire face vanishes. With
 * indices 7 and 8 both blank, any luminance around 0.47–0.60 punches a
 * facet-shaped void straight through the model.
 */
const CHARSET = ' .,_<>/*+OSF#';
const CHAR_LIMIT = 13;

/**
 * Glyph columns across a card — held CONSTANT, so the picture is identical at
 * every card size and only the glyphs themselves scale.
 *
 * A fixed *cell size* (the obvious approach) does the opposite: a 335px card
 * gets ~112 columns and a 500px card ~167, so the same model reads chunky on a
 * small screen and sparse on a large one. Anything tuned at one width is then
 * wrong at every other width.
 */
const CELLS_ACROSS = 112;

/**
 * Per-model framing. These models have wildly different proportions — a long
 * katana, a compact brain, a sprawling dragon — so a single automatic fit can't
 * make them read at a consistent size. `zoom` < 1 pushes in.
 */
/**
 * The single biggest factor in legibility turned out to be NEGATIVE SPACE.
 * Framed tight, each model fills the card edge to edge and you read interior
 * texture instead of a shape — everything looks like noise. Pulled back so the
 * whole silhouette sits inside the frame, they resolve immediately. zoom > 1
 * pulls back.
 */
const VIEW: Record<string, { zoom: number; yaw: number; pitch: number; roll: number }> = {
  // Serpentine dragon, ~56 long x 25 tall x 40 deep — it already lies along X,
  // so yaw 0 looks straight down its length and gives the profile.
  'lewis.glb': { zoom: 1.02, yaw: 0.0, pitch: 0.04, roll: 0 },
  // Brain reads best near head-on, where both hemispheres and the stem show.
  'noel.glb': { zoom: 0.95, yaw: 0.0, pitch: 0.05, roll: 0 },
  // Katana ships lying flat along X. `roll` stands it upright; `yaw` then turns
  // the blade's flat toward camera — edge-on it's two hairlines (blade + saya)
  // with almost no surface to sample.
  'fakhrul.glb': { zoom: 0.95, yaw: Math.PI / 2, pitch: 0.05, roll: Math.PI / 2 },
};

const DEFAULT_VIEW = { zoom: 0.9, yaw: 0, pitch: 0.1, roll: 0 };

/**
 * Renders every team model through a SINGLE WebGL context.
 *
 * One canvas is pinned over the viewport; each frame we look up each card's
 * slot element, then set the scissor + viewport to that element's screen rect
 * and draw that model's ascii pass into it. Everything outside the scissor
 * regions stays transparent, so the canvas is invisible except inside the
 * cards.
 *
 * The alternative — a renderer per card — would burn three extra WebGL contexts
 * (browsers cap out around 16, and the mountain already holds one) and
 * duplicate the glyph atlas and render target three times over.
 */
export function TeamModels() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const models = team.filter((m) => m.media?.kind === 'model');
    if (models.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);

    const atlas = new CharacterAtlas(CHARSET, { fontSize: 72 });

    // One render target, reused for every card in turn.
    const rt = new THREE.WebGLRenderTarget(512, 512, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const asciiUniforms = {
      tDiffuse: { value: rt.texture },
      tMouseTrail: { value: null },
      uCharactersTexture: { value: atlas.texture },
      uResolution: { value: new THREE.Vector2(512, 512) },
      uGranularity: { value: 3 },
      uCharactersLimit: { value: CHAR_LIMIT },
      uFillPixels: { value: false },
      uOutProgress: { value: 0 },
      uOpacity: { value: 1 },
      uOverwriteColor: { value: true },
      uGreyscale: { value: true },
      uInvert: { value: false },
      uMatrix: { value: false },
      uNoise: { value: false },
      uSmear: { value: 0 },
      uColor: { value: new THREE.Color('#eeeeee') },
      uAccentColor: { value: new THREE.Color('#6880f2') },
      uBackground: { value: new THREE.Color(0, 0, 0) },
      uTime: { value: 0 },
      uBrightness: { value: 0 },
      uBuild: { value: 1 },
      uDilate: { value: 1.0 },
    };

    const asciiMaterial = new THREE.ShaderMaterial({
      vertexShader: quadVertex,
      fragmentShader: asciiFragment,
      uniforms: asciiUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const asciiScene = new THREE.Scene();
    const asciiCamera = new THREE.Camera();
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), asciiMaterial);
    asciiScene.add(quad);

    // A trail texture is required by the shader but unused here; 1x1 black.
    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    blank.needsUpdate = true;
    asciiUniforms.tMouseTrail.value = blank as unknown as null;

    interface Entry {
      src: string;
      cfg: { zoom: number; yaw: number; pitch: number; roll: number };
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      pivot: THREE.Group;
      material: THREE.ShaderMaterial;
      radius: number;
      loaded: boolean;
    }

    const entries: Entry[] = models.map((m) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
      const pivot = new THREE.Group();
      scene.add(pivot);

      const material = new THREE.ShaderMaterial({
        vertexShader: detailMeshVertex,
        fragmentShader: detailMeshFragment,
        uniforms: {
          uNormalMap: { value: null },
          uHasNormalMap: { value: false },
          uNormalMapScale: { value: 2.2 },
          uRemapColor: { value: new THREE.Color(1, 1, 1) },
          uLightDir: { value: new THREE.Vector3(-0.5, 0.4, 2) },
          uFlatShading: { value: 0 },
          // Pushed up from 0.55/0.5. These subjects are far more intricate than
          // the mountain, so at a low luminance band most cells resolve to the
          // sparse end of the ramp and the form reads as scattered specks.
          uBrightness: { value: 0.95 },
          uNormalStrength: { value: 0.75 },
          // Fully visible: the wipe is the hero's entrance, not these.
          uReveal: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      const src = (m.media as { src: string }).src;
      return {
        src,
        cfg: { ...(VIEW[src.split('/').pop() ?? ''] ?? DEFAULT_VIEW) },
        scene,
        camera,
        pivot,
        material,
        radius: 1,
        loaded: false,
      };
    });

    let disposed = false;
    const loader = new GLTFLoader();

    entries.forEach((entry) => {
      const cfg = entry.cfg;
      loader.load(
        entry.src,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;

          // Grab the normal map before swapping materials — it carries all the
          // surface relief these low-poly shells rely on.
          let normalMap: THREE.Texture | null = null;
          model.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            const src = mesh.material as THREE.MeshStandardMaterial;
            if (!normalMap && src?.normalMap) normalMap = src.normalMap;
          });
          if (normalMap) {
            entry.material.uniforms.uNormalMap.value = normalMap;
            entry.material.uniforms.uHasNormalMap.value = true;
          }

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = entry.material;
          });

          // Orient FIRST, then measure. Measuring the unrotated model and
          // rotating afterwards fits the camera to the wrong silhouette.
          model.rotation.z = cfg.roll;
          model.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.sub(center);
          entry.pivot.add(model);

          // Fit to the volume the model actually sweeps while spinning about Y,
          // NOT its bounding sphere. For an elongated model the sphere is vastly
          // bigger than the visible bulk, which pushes the camera back and
          // shrinks the subject to a few specks — which is exactly what the
          // katana was doing.
          const spinRadius = Math.hypot(size.x, size.z) * 0.5;
          const halfHeight = size.y * 0.5;
          entry.radius = Math.max(spinRadius, halfHeight) || 1;

          const vFov = THREE.MathUtils.degToRad(entry.camera.fov);
          const tan = Math.tan(vFov * 0.5);
          // Card is square, so horizontal and vertical fits share the same tan.
          const dist = Math.max(spinRadius / tan, halfHeight / tan) * cfg.zoom;

          entry.camera.near = Math.max(entry.radius * 0.01, 0.001);
          entry.camera.far = entry.radius * 60;
          entry.camera.position.set(0, halfHeight * cfg.pitch * 2, dist);
          entry.camera.lookAt(0, 0, 0);
          entry.camera.updateProjectionMatrix();
          entry.loaded = true;
        },
        undefined,
        (err) => console.error('[TeamModels] failed to load', entry.src, err)
      );
    });

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    // Dev handle: tune framing live instead of reloading per guess.
    //   __team[0].cfg.yaw = 1.2
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __team?: unknown }).__team = entries;
    }

    const clock = new THREE.Clock();
    let raf = 0;

    function animate() {
      const t = clock.getElapsedTime();

      renderer.setScissorTest(false);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.setScissorTest(true);

      const vh = window.innerHeight;
      const vw = window.innerWidth;

      entries.forEach((entry, i) => {
        const el = document.querySelector<HTMLElement>(`[data-team-slot="${entry.src}"]`);
        if (!el || !entry.loaded) return;

        const r = el.getBoundingClientRect();
        // Skip anything scrolled off screen — no point rendering it.
        if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;

        // Oscillate around each model's chosen angle rather than spinning
        // through 360°, so it never sits on a silhouette that reads as nothing
        // (a dragon end-on, a katana edge-on).
        const cfg = VIEW[entry.src.split('/').pop() ?? ''] ?? DEFAULT_VIEW;
        // Continuous 360°. `yaw` is now the starting offset — it still decides
        // which face you see first (and holds that face under reduced-motion),
        // but the model turns all the way through.
        entry.pivot.rotation.y = reduced ? cfg.yaw : cfg.yaw + t * 0.32 + i * 1.9;
        entry.pivot.rotation.x = cfg.pitch;

        // Pass 1: the model, into the shared render target.
        renderer.setScissorTest(false);
        renderer.setRenderTarget(rt);
        renderer.setClearColor(0x000000, 0);
        renderer.clear();
        renderer.render(entry.scene, entry.camera);
        renderer.setRenderTarget(null);
        renderer.setScissorTest(true);

        // Pass 2: the ascii composite, painted into this card's rect.
        // WebGL's origin is bottom-left, hence the flip.
        const y = vh - r.bottom;
        renderer.setViewport(r.left, y, r.width, r.height);
        renderer.setScissor(r.left, y, r.width, r.height);
        asciiUniforms.uResolution.value.set(r.width, r.height);
        // Constant column count regardless of how big the card renders.
        asciiUniforms.uGranularity.value = Math.max(1.5, r.width / CELLS_ACROSS);
        asciiUniforms.uTime.value = t;
        renderer.render(asciiScene, asciiCamera);
      });

      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      entries.forEach((e) => {
        e.material.dispose();
        e.scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.geometry?.dispose();
        });
      });
      blank.dispose();
      rt.dispose();
      atlas.dispose();
      asciiMaterial.dispose();
      quad.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-screen w-screen"
    />
  );
}
