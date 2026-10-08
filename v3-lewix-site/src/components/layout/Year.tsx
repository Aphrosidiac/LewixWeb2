'use client';

import { useEffect, useState } from 'react';

/**
 * The current year, for the copyright line. Pages are prerendered, so a
 * server-side `new Date()` froze the year at the last deploy. The build year
 * renders first and the client corrects it after mount.
 */
export function Year({ fallback }: { fallback: number }) {
  const [year, setYear] = useState(fallback);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
