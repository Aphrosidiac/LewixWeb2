'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// `next/dynamic({ ssr: false })` isn't allowed inside a Server Component
// (page.tsx isn't 'use client') — this client boundary is what makes the
// code-split legal there.
const Panel = dynamic(() => import('./AsciiDebugPanel').then((m) => m.AsciiDebugPanel), {
  ssr: false,
});

/**
 * Gate for the ascii tuning panel.
 *
 * The `?mtn=1` check has to live HERE, above the dynamic component, not inside
 * it. `next/dynamic` fetches its chunk when the component renders, so a panel
 * that renders unconditionally and then returns null on a missing flag has
 * already paid for itself: measured against a production build, leva's chunk
 * (68KB transferred, 204KB parsed) was fetched 469ms into every visitor's page
 * load, flag or no flag. Rendering `<Panel />` only once the flag is confirmed
 * is what actually keeps it off the normal path.
 *
 * The panel keeps its own identical check. That one is now redundant, and it
 * stays that way deliberately — it costs nothing and it means a future caller
 * that renders the panel directly can't quietly reintroduce this.
 */
export function AsciiDebugPanel() {
  const [enabled, setEnabled] = useState(false);

  // In an effect rather than during render: `window` doesn't exist server-side,
  // and reading it during render would desync the hydrated markup.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('mtn')) setEnabled(true);
  }, []);

  if (!enabled) return null;
  return <Panel />;
}
