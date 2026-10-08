import type { CaseStudyStatus } from '@/content';

/**
 * How one piece of work moves through a system, drawn as a row of steps.
 *
 * `compact` is the strip that opens under a row on the work index; the full
 * version is the numbered pipeline on a case page, which stacks vertically on
 * a phone rather than scrolling sideways.
 */
export function Flow({ steps, compact = false }: { steps: readonly string[]; compact?: boolean }) {
  if (compact) {
    return (
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="How work moves through it">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span className="rounded-full border border-line bg-bg/60 px-3 py-1 text-xs text-fg-muted">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="text-xs text-fg-faint">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:auto-cols-fr sm:grid-flow-col"
      aria-label="How work moves through it"
    >
      {steps.map((step, i) => (
        <li key={step} className="relative flex items-baseline gap-4 bg-bg-raised px-5 py-4 sm:min-h-36 sm:flex-col sm:items-start sm:gap-6 sm:py-5">
          <span className="w-6 shrink-0 font-display font-semibold text-sm text-accent sm:w-auto">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-sm leading-snug text-fg">{step}</span>
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute right-3 bottom-4 hidden text-fg-faint sm:block"
            >
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * Production status, as text with a dot. Only systems actually in production
 * get the live pulse; colour never carries the meaning alone.
 */
export function StatusTag({ status }: { status: CaseStudyStatus }) {
  const live = status === 'In production';
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-fg-muted">
      <span
        aria-hidden="true"
        className={
          live
            ? 'pulse-dot h-1.5 w-1.5 rounded-full bg-accent'
            : 'h-1.5 w-1.5 rounded-full border border-fg-faint'
        }
      />
      {status}
    </span>
  );
}
