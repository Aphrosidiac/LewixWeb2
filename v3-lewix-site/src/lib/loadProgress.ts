/**
 * Tiny pub/sub bridging the WebGL scene and the loading screen.
 *
 * The mountain GLB is ~27MB, so the counter reports real bytes from
 * GLTFLoader's onProgress rather than a fake timer. `ready` fires only after the
 * model is parsed AND one frame has actually rendered — exiting on parse alone
 * leaves a black flash between the loader panel and the first painted frame.
 */

type Listener = (state: LoadState) => void;

export interface LoadState {
  /** 0..1, real download progress where the server reports a length. */
  progress: number;
  /** True once the scene has parsed and painted at least one frame. */
  ready: boolean;
  /**
   * Fires when the loading screen begins its exit. Everything that should
   * animate in — the mountain building up, the hero copy — keys off this, so
   * nothing starts while it's still hidden behind the panel.
   */
  revealing: boolean;
}

const state: LoadState = { progress: 0, ready: false, revealing: false };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l({ ...state }));
}

export function setLoadProgress(value: number) {
  // Never let it go backwards — progress events can arrive out of order.
  const next = Math.min(1, Math.max(0, value));
  if (next > state.progress) {
    state.progress = next;
    emit();
  }
}

export function setLoadReady() {
  if (state.ready) return;
  state.progress = 1;
  state.ready = true;
  emit();
}

export function startReveal() {
  if (state.revealing) return;
  state.revealing = true;
  emit();
}

export function subscribeLoad(listener: Listener): () => void {
  listeners.add(listener);
  listener({ ...state });
  return () => listeners.delete(listener);
}

export function getLoadState(): LoadState {
  return { ...state };
}
