import type { NextConfig } from 'next';

// Note: Turbopack logs a benign workspace-root warning because LewixWeb2 (the
// parent) has its own lockfile for the v1/v2 Vite builds. Pinning
// `turbopack.root` via node:path/__dirname breaks config evaluation here, so
// the warning is left in place rather than worked around badly.
const nextConfig: NextConfig = {
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

      /*
        Case studies were renamed from the client's brand to the system they
        are ("girpack" -> "packaging-supplies-mis"), because the old slugs
        named companies a stranger has never heard of. These four URLs were in
        the sitemap and have been crawled, so they 301 rather than 404.

        Permanent, and cheap to keep: four static rules with no runtime cost.
      */
      { source: '/work/girpack', destination: '/work/packaging-supplies-mis', permanent: true },
      { source: '/work/harvestgrow', destination: '/work/produce-supply-delivery', permanent: true },
      { source: '/work/shuda-logistics', destination: '/work/distribution-fleet', permanent: true },
      { source: '/work/dream-garage', destination: '/work/workshop-management', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        /*
          The hero's mountain.glb is 26MB and the three team models add
          another 8.8MB, and every one of them was being served with
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
        source: '/draco/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        /*
          Baseline security headers. The site shipped with none of these: no
          HSTS, no nosniff, no referrer policy, no framing protection.

          Deliberately no full Content-Security-Policy here. A meaningful CSP
          for this site has to account for the WebGL pipeline, next/font and
          Next's inline hydration scripts, and a CSP written blind is the
          kind of change that half-breaks a hero nobody notices until a
          different platform loads it. `frame-ancestors` is the one directive
          that carries real protection with no such risk, so it ships alone.
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
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
