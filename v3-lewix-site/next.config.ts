import type { NextConfig } from 'next';

// Note: Turbopack logs a benign workspace-root warning because LewixWeb2 (the
// parent) has its own lockfile for the v1/v2 Vite builds. Pinning
// `turbopack.root` via node:path/__dirname breaks config evaluation here, so
// the warning is left in place rather than worked around badly.
const nextConfig: NextConfig = {};

export default nextConfig;
