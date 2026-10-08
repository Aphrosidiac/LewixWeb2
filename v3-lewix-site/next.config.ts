import type { NextConfig } from 'next';

// Note: Turbopack logs a benign workspace-root warning because LewixWeb2 (the
// parent) has its own lockfile for the v1/v2 Vite builds. Pinning
// `turbopack.root` via node:path/__dirname breaks config evaluation here, so
// the warning is left in place rather than worked around badly.
/**
 * Content-Security-Policy. Written against what the pages actually load:
 *  - script: own chunks plus Next's inline hydration scripts ('unsafe-inline';
 *    a nonce would force every page dynamic), Cloudflare's injected beacon,
 *    and 'wasm-unsafe-eval' for the meshopt decoder that unpacks the models.
 *    Dev adds 'unsafe-eval' for React Refresh.
 *  - img / connect: blob: and data: because GLTFLoader decodes embedded model
 *    textures through blob URLs.
 *  - connect: same origin covers /api/brief and Cloudflare's /cdn-cgi/rum.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${
    process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
  } https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' blob: data: https://cloudflareinsights.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  // `x-powered-by: Next.js` told every scanner which framework to try first.
  poweredByHeader: false,
  // Next blocks cross-origin requests to the dev server by default (HMR
  // websocket, RSC payloads, etc. all 401 with a bare "Unauthorized" for any
  // Host other than localhost). Needed for the temporary Cloudflare quick
  // tunnel used to compare the ascii mountain across machines — the
  // subdomain is random per tunnel run, so this is a wildcard rather than
  // one pinned hostname. Dev-only; has no effect on `next build`/`next start`.
  allowedDevOrigins: ['*.trycloudflare.com'],

  async redirects() {
    return [
      {
        /*
          www.lewix.ai and lewix.ai both answered 200 with byte-identical
          content and no canonical tag between them, which is the textbook
          shape of a site competing against itself: every link to the www
          host built authority for a hostname nobody promotes.

          The canonical tags added in `app/layout.tsx` declare a preference,
          but a canonical is a hint. A 301 is not, so both ship.

          Apex wins because that is what the brand collateral, the email
          domain and every case study link already use.
        */
        source: '/:path*',
        has: [{ type: 'host', value: 'www.lewix.ai' }],
        destination: 'https://lewix.ai/:path*',
        permanent: true,
      },
      {
        // Buyers and agents guess /pricing. The answer (a published floor and
        // what drives cost) lives on /contact, so send them there rather than
        // build a thin second page that competes with it.
        source: '/pricing',
        destination: '/contact',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        /*
          The models (mountain-v2 1.5MB, team models 1.7MB, after the
          2026-10-09 compression; 35MB before) were being served with
          `cache-control: public, max-age=0`. Every repeat visitor
          revalidated ~35MB. Static chunks under /_next/static already get a
          year and `immutable`; these were the one class of large asset that
          did not.

          Safe to mark immutable because these are content assets with fixed
          names that are replaced by a new filename when the model changes,
          not by editing the file in place. If a model is ever overwritten
          under the same name, bump the name.
        */
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        /*
          Baseline security headers. The site shipped with none of these: no
          HSTS, no nosniff, no referrer policy, no framing protection.

          The CSP (see `csp` above) was left out at first for fear of
          breaking the WebGL hero. It is now written against what the pages
          actually load and was checked for violations on every route.
        */
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            // No `interest-cohort`: FLoC is dead and Chrome logs an
            // "Unrecognized feature" warning for it, which is noise in a
            // console that is otherwise clean.
            value: 'camera=(), microphone=(), geolocation=()',
          },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
