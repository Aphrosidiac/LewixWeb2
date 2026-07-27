'use client';

import { useEffect, useState } from 'react';

const ZONE = 'Asia/Kuala_Lumpur';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * Wall clock where the work happens.
 *
 * Rendered empty on the server and filled after mount: the server's clock is
 * not the reader's, and committing to a time during SSR guarantees a hydration
 * mismatch on the first paint. The reserved width stops the footer reflowing
 * when it appears.
 */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    // Aligned to the next minute boundary, then every minute, so the digits
    // change when the minute does rather than up to 59s late.
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? '     '}
    </span>
  );
}
