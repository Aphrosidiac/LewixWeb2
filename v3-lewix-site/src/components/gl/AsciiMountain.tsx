'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { CharacterAtlas } from './CharacterAtlas';
import { MouseTrail } from './MouseTrail';
import { quadVertex, meshVertex, meshFragment, asciiFragment } from './asciiShaders';
import { setLoadProgress, setLoadReady, startReveal, subscribeLoad } from '@/lib/loadProgress';
import { STAGE_END_VH, clamp01, smoothstep, stageProgress, track } from '@/lib/scrollStage';

/**
 * dragonfly.xyz's own preset, verbatim. The blanks are load-bearing.
 *
 *   ' * _<>,  ./O#SF +'
 *    ^   ^     ^^    ^     blank glyphs at indices 0, 2, 7, 8, 15
 *
 * The shader picks a glyph by luminance (`floor(gray * (uCharactersLimit-1))`),
 * so those blanks aren't only at the dark end of the ramp — they sit part-way
 * up it. Any cell landing on one renders nothing, which is what punches the
 * holes through the middle of the terrain. That negative space IS the look.
 * Replacing the charset with a monotonic dark-to-light ramp closes the holes
 * and turns the mountain into a solid mass.
 */
const CHARSET = ' * _<>,  ./O#SF +';
const CHAR_LIMIT = 16;
const FONT_SIZE = 72;

/**
 * Ascii cell size in CSS pixels. Flat and unscaled, exactly as dragonfly ships
 * it (`uGranularity: 6`, confirmed from their production bundle) and paired
 * with the shader's `division = uResolution / uGranularity`.
 *
 * DO NOT make this adaptive. A previous attempt derived it from the model's
 * projected width to hold a constant CELL COUNT across aspect ratios, on the
 * theory that a wide flat terrain plus a bounding-sphere camera fit made the
 * subject's on-screen size drift. The arithmetic was right and the result was
 * wrong, because it optimised the wrong quantity:
 *
 *   constant cell COUNT  =>  cell SIZE grows with window width
 *                            (6.0px at 1374 wide, ~7.7px at ~1900)
 *
 * and a larger cell draws a larger glyph, which fills more of its own cell.
 * Past roughly 6px the characters stop reading as separate marks and merge
 * into a solid grey mass — the exact opposite of the sparse, legible grain
 * that makes this look right.
 *
 * What has to stay constant is the GRAIN: glyph size, weight, and the amount
 * of black between characters. That is a constant cell size, i.e. this. The
 * number of cells spanning the mountain does vary with the window, and that
 * is fine and correct — it is what "more of the same texture" looks like on a
 * bigger screen, rather than "the same texture, scaled up".
 */
const GRANULARITY = 6;

/**
 * Ascii cells the mountain should span at rest, enforced by camera distance
 * rather than by cell size.
 *
 * The holes through the terrain come from blank glyphs sitting part-way up the
 * brightness ramp (see CHARSET) — a cell whose luminance lands there draws
 * nothing. Whether a cell lands there depends on how much terrain that cell
 * covers: sample finer and you resolve more micro-relief in the surface
 * normals, luminance spreads out of the blank mid-tone band, and the holes
 * fill in.
 *
 * `refit()` sizes the camera so the model keeps a constant FRACTION of the
 * viewport, which means a wider window makes it physically larger on screen and
 * spans it with more cells. Measured: ~190 cells across at ~1390px wide, ~256
 * at ~1920 — same code, same 6px cell, and the second one closes into a solid
 * mass.
 *
 * Fixing this by growing the cell was the wrong lever and looked worse: it
 * changes the grain, which is the one thing that must not move. Holding the
 * model's on-screen SIZE instead keeps both — same 6px grain, same cell count
 * over the terrain, same holes — at the cost of the mountain occupying less of
 * a very large screen. That trade is exactly what dragonfly gets from its fixed
 * camera distance.
 *
 * 190 is measured off the framing that was signed off, so this is a no-op at
 * that size and only ever pulls the camera back on larger viewports.
 */
const TARGET_CELLS_ACROSS = 190;

/** Canvas opacity once the field is only a backdrop behind section copy. */
const BACKDROP_OPACITY = 0.16;
/** ...and at the very bottom, where the footer has room to share the frame. */
const FOOTER_OPACITY = 0.45;

/**
 * Fixed full-viewport ASCII render of the mountain, sitting behind the page
 * content. Scroll progress orbits the camera; the cursor drives a trail that
 * tints glyphs along detected edges.
 */
// Brand blue from the logomark gradient. The cursor trail tints edge glyphs with
// this, so it needs to be the real brand colour, not dragonfly's orange.
export function AsciiMountain({ accent = '#6880f2' }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let modelRadius = 1;
    let modelHeight = 1;
    let fitDistance = 3;
    const lookTarget = new THREE.Vector3();
    /** Ground position of the highest vertex. The model is centred on its
     *  bounding box, but the summit sits well off that centre, so anything that
     *  wants to move *around the mountain* has to pivot here instead. */
    const summit = new THREE.Vector3();
    const focus = new THREE.Vector3();
    // Reused each frame so the loop stays allocation-free.
    const viewDir = new THREE.Vector3();
    const rightAxis = new THREE.Vector3();

    const meshUniforms = {
      uRemapColor: { value: new THREE.Color(1, 1, 1) },
      uLightDir: { value: new THREE.Vector3(-0.5, 0.2, 2) },
      uFlatShading: { value: 0 },
      uBrightness: { value: 0.5 },
      uNormalStrength: { value: 0.5 },
      uReveal: { value: 1 },
    };

    const meshMaterial = new THREE.ShaderMaterial({
      vertexShader: meshVertex,
      fragmentShader: meshFragment,
      uniforms: meshUniforms,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const sceneRT = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    const mouseTrail = new MouseTrail(renderer);
    const atlas = new CharacterAtlas(CHARSET, { fontSize: FONT_SIZE });

    const asciiUniforms = {
      tDiffuse: { value: sceneRT.texture },
      tMouseTrail: { value: mouseTrail.texture },
      uCharactersTexture: { value: atlas.texture },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      // Placeholder until refit() runs post-load with the model's real
      // on-screen size — matches what refit() converges to at 1512×810.
      uGranularity: { value: GRANULARITY },
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
      uAccentColor: { value: new THREE.Color(accent) },
      uBackground: { value: new THREE.Color(0, 0, 0) },
      uTime: { value: 0 },
      uBrightness: { value: 0 },
      uBuild: { value: 0 },
      uDilate: { value: 0 },
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

    function refit() {
      const vFov = THREE.MathUtils.degToRad(camera.fov);

      // Aspect floored at 1 for the WIDTH fit only.
      //
      // The terrain is 1000 units wide and ~324 tall. Fitting its full width
      // into a portrait viewport shoves the camera back hard — measured 1953
      // at 409x802, against 1237 on desktop — which leaves the mountain tiny,
      // spans it with only ~109 cells instead of 190, and stops the on-screen
      // size cap below from ever engaging. Coarser cells cover more terrain
      // each, luminance stops landing in the blank mid-tone band, and the holes
      // vanish. Same root cause as the desktop case, approached from the other
      // side.
      //
      // Desktop already crops the terrain horizontally rather than fitting it,
      // so doing the same on narrow screens is consistent, not a special case.
      // With this floor a portrait viewport lands on exactly the same 190 cells
      // as desktop, and landscape is untouched (aspect is already >= 1 there).
      const fitAspect = Math.max(camera.aspect, 1);

      const fitH = modelRadius / Math.sin(vFov * 0.5);
      const fitW = modelRadius / Math.sin(Math.atan(Math.tan(vFov * 0.5) * fitAspect));
      fitDistance = Math.max(fitH, fitW) * 0.62;

      // Floor the distance so the model never spans more than
      // TARGET_CELLS_ACROSS ascii cells. Derived from
      //   onScreenPx = modelWidth * viewportH / (2 * d * tan(vFov/2))
      // solved for d at onScreenPx = TARGET_CELLS_ACROSS * GRANULARITY. Note it
      // falls out as a function of viewport HEIGHT only — widening a window
      // genuinely shouldn't change how big the subject is, and that is the
      // property the old aspect-driven fit was quietly breaking.
      const targetPx = TARGET_CELLS_ACROSS * GRANULARITY;
      const capDistance =
        (modelRadius * 2 * window.innerHeight) / (2 * Math.tan(vFov * 0.5) * targetPx);

      // max(), never min(): this only ever pulls the camera back on large
      // viewports. Small and narrow ones keep whatever the bounding-sphere fit
      // already gave them, so nothing below the reference size shifts.
      fitDistance = Math.max(fitDistance, capDistance);
    }

    let disposed = false;
    let modelReady = false;
    let readySignalled = false;

    const loader = new GLTFLoader();
    loader.load(
      '/models/mountain.glb',
      (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) (child as THREE.Mesh).material = meshMaterial;
      });

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      modelRadius = Math.max(size.x, size.y, size.z) * 0.5;
      modelHeight = size.y;

      model.position.sub(center);
      modelGroup.add(model);
      modelGroup.updateMatrixWorld(true);

      // Locate the summit once, in world space. Every vertex, but only on load.
      const vertex = new THREE.Vector3();
      let highest = -Infinity;
      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const positions = mesh.geometry.getAttribute('position');
        for (let i = 0; i < positions.count; i++) {
          vertex.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
          if (vertex.y > highest) {
            highest = vertex.y;
            summit.copy(vertex);
          }
        }
      });

      camera.near = Math.max(modelRadius * 0.01, 0.01);
      camera.far = modelRadius * 40;
      camera.updateProjectionMatrix();
      refit();
        modelReady = true;
      },
      (event) => {
        // Only meaningful when the server sends a length; otherwise hold at 0
        // and let the loading screen fall back to its indeterminate ramp.
        if (event.lengthComputable && event.total > 0) {
          setLoadProgress(event.loaded / event.total);
        }
      },
      (err) => {
        console.error('[AsciiMountain] failed to load model', err);
        // Don't strand the loader on the screen forever if the model 404s.
        setLoadReady();
      }
    );

    // --- input ---
    const pointerUv = new THREE.Vector2(0.5, 0.5);
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);

    function onPointerMove(e: PointerEvent) {
      pointerUv.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      mouseTrail.push(pointerUv);
      pointerTarget.set(pointerUv.x * 2 - 1, pointerUv.y * 2 - 1);
    }

    /**
     * Scroll choreography, in three phases:
     *
     *  intro (0 → INTRO_VH viewports)  the mountain starts zoomed in and pushed
     *      right, filling the space beside the hero lockup, then pans to centre
     *      and zooms out to its resting framing.
     *  stage (1 → STAGE_END_VH)        the empty run below the hero. See STAGE.
     *  orbit (after that)              rotate and dolly with scroll, carrying on
     *      from wherever the stage left the camera.
     *
     * Everything below is a pure function of scrollY, so scrolling back up
     * replays the whole thing exactly in reverse with no extra state.
     */
    const INTRO_VH = 0.6; // viewports the intro takes to resolve
    const INTRO_ZOOM = 0.52; // start distance as a fraction of the resting one
    const INTRO_PAN = 0.42; // start offset sideways, in model radii

    /**
     * The stage shot: a summit approach.
     *
     * dragonfly's insect can fly at the lens; a mountain can't, so the camera
     * moves instead. It drops off the wide establishing framing, dives at the
     * massif until the slopes overrun the frame, crests the summit and pitches
     * up into empty sky — which is where the near-black beat comes from, the
     * same pause dragonfly lands on — then falls back and settles wide again
     * for About.
     *
     * Five keyframes, all sharing the same t so they stay in step:
     *   0.00  establishing, identical to the resting hero framing
     *   0.38  close pass — the face overruns the frame, summit grazing the top
     *   0.55  cresting — above the summit but still looking at it, so it sinks
     *         out of frame instead of cutting
     *   0.72  over the top, looking at nothing
     *   0.82  pitching back down — the summit re-enters from above rather than
     *         growing out of a dot in the middle of the frame
     *   1.00  the About establishing shot
     *
     * `dist` is a multiple of the fitted distance; `camY` and `lookY` are
     * multiples of the model's height. `focus` blends the pivot from the
     * bounding-box centre (which is what the wide framings want) to the summit
     * (which is the only sane pivot once the camera is in among the slopes).
     *
     * The close-pass numbers are held against a measured height profile of the
     * terrain around the summit: at these radii the ground never rises above
     * ~40, so the camera stays in open air the whole way.
     */
    const STAGE = {
      dist: [
        [0, 1],
        [0.38, 0.24],
        [0.55, 0.19],
        [0.72, 0.15],
        [0.82, 0.36],
        [1, 0.92],
      ],
      camY: [
        [0, 0.1],
        [0.38, 0.1],
        [0.55, 0.55],
        [0.72, 0.88],
        [0.82, 0.62],
        [1, 0.34],
      ],
      lookY: [
        [0, 0.18],
        [0.38, 0.24],
        [0.55, 0.42],
        [0.72, 1.45],
        [0.82, 0.35],
        [1, 0.2],
      ],
      angle: [
        [0, 0],
        [0.38, 0.42],
        [0.55, 0.55],
        [0.72, 0.72],
        [0.82, 0.85],
        [1, 1.05],
      ],
      focus: [
        [0, 0],
        [0.28, 1],
        [0.82, 1],
        [1, 0],
      ],
    } satisfies Record<string, [number, number][]>;

    // Live handle for tuning the shot against a real viewport. Mutating the
    // arrays takes effect on the next frame.
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __mtn: unknown }).__mtn = {
        STAGE,
        camera,
        scene,
        modelGroup,
        THREE,
        get fit() {
          return fitDistance;
        },
        get height() {
          return modelHeight;
        },
        get radius() {
          return modelRadius;
        },
        get granularity() {
          return asciiUniforms.uGranularity.value;
        },
        get build() {
          return asciiUniforms.uBuild.value;
        },
        get resolution() {
          return asciiUniforms.uResolution.value.toArray();
        },
        get dpr() {
          return renderer.getPixelRatio();
        },
        // rAF never fires at all in this automation-driven tab — confirmed:
        // document.hidden stays true even after a CDP-dispatched click reports
        // hasFocus true, and a canvas left to the normal animate() loop here
        // painted zero frames (solid black, not merely stale). Flipping the
        // load-state flags alone doesn't help, because nothing ever calls
        // renderer.render() to go with them. Calling animate() directly forces
        // one real pass through the exact same code the rAF loop runs —
        // camera, uniforms, both render targets — with no separate rendering
        // path to drift out of sync with production.
        forceReady() {
          asciiUniforms.uBuild.value = 1;
          setLoadReady();
          startReveal();
          animate();
        },
      };
    }

    let scrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    function onScroll() {
      scrollY = window.scrollY;
      scrollVelocity = scrollY - lastScrollY;
      lastScrollY = scrollY;
    }

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // CSS pixels, deliberately NOT multiplied by devicePixelRatio.
      //
      // This target only feeds the ascii pass, which samples roughly one texel
      // per cell. Rendering the terrain at 2x on a Retina display resolves far
      // more micro-relief in the surface normals, which spreads luminance out
      // of the blank mid-tone band the holes depend on — so the same code lost
      // its holes on a dpr-2 Mac while looking correct on a dpr-1 Windows
      // machine. Measured: identical viewport, identical atlas scale of 1, only
      // dpr differing.
      //
      // The visible canvas still renders at full device resolution, so glyph
      // edges stay crisp. Only the luminance source is normalised. Also removes
      // a 4x fragment cost on Retina.
      sceneRT.setSize(w, h);
      asciiUniforms.uResolution.value.set(w, h);
      refit();
    }

    // The build-up only starts once the loading panel begins retracting —
    // running it underneath the panel would waste the whole animation.
    let buildStart = 0;
    const BUILD_MS = 1600;
    const unsubscribeReveal = subscribeLoad(({ revealing }) => {
      if (revealing && buildStart === 0) buildStart = performance.now();
    });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // --- loop ---
    const clock = new THREE.Clock();
    let raf = 0;

    function animate() {
      const dt = clock.getDelta();

      // uReveal 1 -> 0 wipes the mesh in. It must reach 0: `visible =
      // step(uReveal, revealMask)` discards everything but perfectly
      // upward-facing normals while this sits at 1.
      meshUniforms.uReveal.value = THREE.MathUtils.damp(meshUniforms.uReveal.value, 0, 1.4, dt);

      const vh = window.innerHeight;
      const maxScroll = Math.max(document.documentElement.scrollHeight - vh, 1);
      const introEnd = vh * INTRO_VH;
      const stageEnd = vh * STAGE_END_VH;

      // Phase 1: intro, smoothstepped so it eases at both ends.
      const introEase = smoothstep(clamp01(scrollY / introEnd));

      // Phase 2: the stage shot.
      const stageT = stageProgress(scrollY, vh);

      // Phase 3: orbit, mapped across whatever scroll remains below the stage.
      const orbitT = clamp01((scrollY - stageEnd) / Math.max(maxScroll - stageEnd, 1));

      // The stage tracks resolve to the old resting values at t=0, so the intro
      // and the idle stretch between the two are unaffected by any of this.
      const angle = track(stageT, STAGE.angle) + orbitT * Math.PI;
      const restingDist = fitDistance * track(stageT, STAGE.dist) * (1 - orbitT * 0.14);
      const dist = restingDist * THREE.MathUtils.lerp(INTRO_ZOOM, 1, introEase);

      const focusT = track(stageT, STAGE.focus);
      focus.set(summit.x * focusT, 0, summit.z * focusT);

      camera.position.x = focus.x + Math.sin(angle) * dist;
      camera.position.z = focus.z + Math.cos(angle) * dist;
      camera.position.y = modelHeight * (track(stageT, STAGE.camY) + orbitT * 0.16);
      lookTarget.set(focus.x, modelHeight * track(stageT, STAGE.lookY), focus.z);

      // Slide the subject sideways by panning camera and target together along
      // the camera's own right axis, so it holds up once the orbit has rotated.
      //
      // Dropped entirely on narrow screens. The pan exists to clear the desktop
      // hero lockup, which sits in the left half — but the mobile hero is
      // full-width and stacked, so there is no side channel to clear. Applying
      // it there just shoves the mountain into the bottom-right corner and
      // crops most of it away, which is exactly how mobile was rendering.
      const introPan = window.innerWidth < 640 ? 0 : INTRO_PAN;
      const pan = THREE.MathUtils.lerp(introPan, 0, introEase) * modelRadius;
      if (pan !== 0) {
        viewDir.subVectors(lookTarget, camera.position).normalize();
        rightAxis.crossVectors(viewDir, camera.up).normalize();
        camera.position.addScaledVector(rightAxis, -pan);
        lookTarget.addScaledVector(rightAxis, -pan);
      }

      camera.lookAt(lookTarget);

      if (!prefersReduced) {
        pointerCurrent.lerp(pointerTarget, 1 - Math.pow(0.001, dt));
        modelGroup.rotation.y = pointerCurrent.x * 0.15;
        modelGroup.rotation.x = -pointerCurrent.y * 0.08;

        const smearTarget = THREE.MathUtils.clamp(Math.abs(scrollVelocity) * 0.004, 0, 0.35);
        asciiUniforms.uSmear.value = THREE.MathUtils.damp(
          asciiUniforms.uSmear.value,
          smearTarget,
          6,
          dt
        );
        scrollVelocity *= 0.8;
      }

      asciiUniforms.uTime.value = clock.elapsedTime;

      // Linear build so every band of the range gets equal screen time, with a
      // slight ease-out at the tail so the last glyphs settle rather than snap.
      if (buildStart > 0 && asciiUniforms.uBuild.value < 1) {
        const t = Math.min((performance.now() - buildStart) / BUILD_MS, 1);
        asciiUniforms.uBuild.value = prefersReduced ? 1 : 1 - Math.pow(1 - t, 1.6);
      }

      // Full strength for the whole hero and stage — the shot is the only thing
      // on screen there, so anything less wastes it. It drops back once About's
      // copy is arriving, and from then on the field is a backdrop.
      const fadeT = clamp01((scrollY - (stageEnd - vh * 0.12)) / (vh * 0.55));
      const backdrop = THREE.MathUtils.lerp(1, BACKDROP_OPACITY, smoothstep(fadeT));

      // ...and comes back up over the last screen, so the footer sign-off sits
      // on the landscape the hero opened on rather than on a dark plate. Ramped
      // against distance from the bottom of the document, which is stable while
      // sections above are still revealing and changing the page height.
      const distanceToEnd = maxScroll - scrollY;
      const returnT = clamp01(1 - distanceToEnd / (vh * 0.9));
      const opacity = THREE.MathUtils.lerp(backdrop, FOOTER_OPACITY, smoothstep(returnT));

      canvas!.style.opacity = String(Math.max(backdrop, opacity));

      mouseTrail.update();

      renderer.setRenderTarget(sceneRT);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(asciiScene, asciiCamera);

      // Signal ready only once a frame containing the model has actually been
      // painted. Firing on parse alone hands over to a still-black canvas.
      if (modelReady && !readySignalled) {
        readySignalled = true;
        setLoadReady();
      }

      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      unsubscribeReveal();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      mouseTrail.dispose();
      atlas.dispose();
      sceneRT.dispose();
      asciiMaterial.dispose();
      meshMaterial.dispose();
      quad.geometry.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry?.dispose();
      });
      renderer.dispose();
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
    />
  );
}
