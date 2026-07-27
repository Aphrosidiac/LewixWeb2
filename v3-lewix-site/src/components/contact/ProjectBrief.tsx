'use client';

import { useMemo, useRef, useState } from 'react';
import { briefSteps } from '@/content/contactPage';
import { contact } from '@/content';

type Answers = Record<string, string>;

/**
 * Multi-step brief, laid out after trionn.com/contact.
 *
 * What the earlier pass got wrong, all fixed here:
 *
 *  - Placeholders were doing the job of labels. Once you typed, the field had
 *    no name at all — invisible to a screen reader and to anyone rechecking
 *    their answers. Labels are now persistent and sit above the field.
 *  - Continue was silently disabled until required fields were filled, which
 *    reads as a broken button. It now always works and validates on submit,
 *    marking the offending fields.
 *  - There was no <form>, so Enter did nothing. A three-step form you have to
 *    mouse through is worse than one long one.
 *  - Steps swapped instantly. They now cross-fade.
 *  - The review was a monospace <pre> dump.
 *
 * Nothing is submitted to a server — the site has no backend, and the inherited
 * contact form was a "Send Message" button wired to nothing, which is worse
 * than no form. The answers assemble into a written brief that hands off to
 * whichever channel the sender prefers.
 */
export function ProjectBrief() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [invalid, setInvalid] = useState<string[]>([]);
  const [leaving, setLeaving] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const total = briefSteps.length + 1; // steps plus the review
  const isReview = step >= briefSteps.length;
  const current = briefSteps[Math.min(step, briefSteps.length - 1)];

  const brief = useMemo(() => buildBrief(answers), [answers]);
  const set = (name: string, value: string) => {
    setAnswers((a) => ({ ...a, [name]: value }));
    setInvalid((v) => v.filter((n) => n !== name));
  };

  /** Cross-fade, then swap. Keeps the band from jumping between steps. */
  const goTo = (next: number) => {
    setLeaving(true);
    window.setTimeout(() => {
      setStep(next);
      setInvalid([]);
      setLeaving(false);
      headingRef.current?.focus({ preventScroll: true });
    }, 220);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReview) return;
    const missing = current.fields
      .filter((f) => f.required && !(answers[f.name] ?? '').trim())
      .map((f) => f.name);
    if (missing.length) {
      setInvalid(missing);
      return;
    }
    goTo(step + 1);
  };

  return (
    <div className="relative isolate overflow-hidden bg-bg px-6 py-28 sm:px-10 sm:py-36">
      {/*
        Ambient edge glow. A brand-gradient wash with a large black radial laid
        over the middle, so colour survives only at the perimeter. The reference
        does this in its own orange; ours uses the logomark's cyan/blue/purple.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,#67e1f9_0%,#6880f2_50%,#8151df_100%)] opacity-[0.28]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_78%_68%_at_50%_50%,#050505_0%,#050505_52%,transparent_100%)]"
      />

      <form onSubmit={submit} noValidate className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-8">
          <p className="max-w-[18rem] text-[10.5px] leading-relaxed font-medium tracking-[0.16em] text-fg-muted uppercase">
            {isReview ? 'Everything below is what reaches us.' : current.intro}
          </p>

          <div className="w-40 shrink-0 text-right">
            <p
              aria-live="polite"
              className="flex items-baseline justify-end gap-[0.15em] text-[10.5px] font-medium tracking-[0.16em] text-fg-muted uppercase"
            >
              <span className="sr-only">
                Step {step + 1} of {total}
              </span>
              <Reel value={step + 1} />
              <span aria-hidden="true" className="px-[0.35em]">
                /
              </span>
              <span aria-hidden="true" className="tabular-nums">
                {String(total).padStart(2, '0')}
              </span>
            </p>
            <span className="mt-2 block h-px w-full bg-line">
              <span
                className="block h-px bg-fg transition-[width] duration-500 ease-out"
                style={{ width: `${((step + 1) / total) * 100}%` }}
              />
            </span>
          </div>
        </div>

        {/* `key` re-mounts the body each step, which restarts the `rise-in`
            animations below. Without it the fields swap in place with no motion
            at all, which is what made this band feel dead. */}
        <div
          key={step}
          className={`transition-[opacity,transform] duration-200 ease-out ${
            leaving ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="rise-in mt-16 font-display font-semibold text-4xl leading-[1.05] tracking-tight text-fg outline-none sm:mt-20 sm:text-6xl"
          >
            {isReview ? 'Ready to send.' : current.title}
          </h2>
          <p className="rise-in mt-4 text-sm text-fg-muted" style={{ animationDelay: '80ms' }}>
            {isReview
              ? 'Pick a channel. Nothing leaves your browser until you do.'
              : 'A few details so the reply is worth reading.'}
          </p>

          {!isReview && (
            <div className="mt-14 space-y-7">
              {current.fields.map((f, i) => {
                const bad = invalid.includes(f.name);
                const id = `brief-${f.name}`;
                const box = `w-full rounded-xl border bg-white/[0.025] px-6 text-base text-fg outline-none transition-colors placeholder:text-fg-faint/70 focus:border-accent ${
                  bad ? 'border-red-400/60' : 'border-white/[0.09] hover:border-white/20'
                }`;
                return (
                  <div key={f.name} className="rise-in" style={{ animationDelay: `${160 + i * 90}ms` }}>
                    {/* Persistent label. The placeholder is a hint, not a name. */}
                    <label
                      htmlFor={id}
                      className="mb-3 flex items-baseline gap-2 text-[10.5px] font-medium tracking-[0.18em] text-fg-muted uppercase"
                    >
                      {f.label}
                      {f.required && (
                        <span className="text-accent" aria-hidden="true">
                          required
                        </span>
                      )}
                    </label>

                    {f.type === 'textarea' ? (
                      <textarea
                        id={id}
                        rows={4}
                        required={f.required}
                        aria-invalid={bad}
                        value={answers[f.name] ?? ''}
                        onChange={(e) => set(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className={`${box} resize-none py-5`}
                      />
                    ) : f.type === 'select' ? (
                      <select
                        id={id}
                        value={answers[f.name] ?? ''}
                        onChange={(e) => set(f.name, e.target.value)}
                        className={`${box} h-[68px]`}
                      >
                        <option value="">{f.placeholder}</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        type={f.type}
                        required={f.required}
                        aria-invalid={bad}
                        value={answers[f.name] ?? ''}
                        onChange={(e) => set(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className={`${box} h-[68px]`}
                      />
                    )}

                    {bad && (
                      <p role="alert" className="mt-2 text-xs text-red-400/80">
                        {f.label} is needed before the next step.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isReview && (
            <>
              <dl className="rise-in mt-14 divide-y divide-white/[0.07] rounded-xl border border-white/[0.09] bg-white/[0.025]" style={{ animationDelay: '160ms' }}>
                {reviewRows(answers).map(([label, value]) => (
                  <div key={label} className="flex gap-6 px-6 py-5 sm:gap-10">
                    <dt className="w-32 shrink-0 text-[10.5px] font-medium tracking-[0.18em] text-fg-faint uppercase">
                      {label}
                    </dt>
                    <dd className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="rise-in mt-4 grid gap-4 sm:grid-cols-3" style={{ animationDelay: '260ms' }}>
                <a
                  href={`mailto:${contact.email.label}?subject=${encodeURIComponent(
                    `Project brief — ${answers.company || answers.name || 'new enquiry'}`
                  )}&body=${encodeURIComponent(brief)}`}
                  className="rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-6 text-center text-sm text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  Send by email
                </a>
                {contact.whatsapp.map((w) => (
                  <a
                    key={w.number}
                    href={`https://wa.me/${w.number}?text=${encodeURIComponent(brief)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 py-6 text-center text-sm text-fg transition-colors hover:border-accent hover:text-accent"
                  >
                    WhatsApp {w.name}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-16 flex items-end justify-between gap-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="group text-[10.5px] font-medium tracking-[0.18em] text-fg-muted uppercase transition-colors hover:text-fg"
            >
              <span className="flex items-center gap-3 pb-3">
                <span aria-hidden="true">←</span> Back
              </span>
              <span className="block h-px w-full bg-line transition-colors group-hover:bg-fg" />
            </button>
          ) : (
            <span />
          )}

          {!isReview && (
            // A real submit button, so Enter advances the step.
            <button
              type="submit"
              className="group w-44 text-[10.5px] font-medium tracking-[0.18em] text-fg uppercase"
            >
              <span className="flex items-center justify-between gap-3 pb-3 transition-colors group-hover:text-accent">
                {step === briefSteps.length - 1 ? 'Review' : 'Continue'}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="block h-px w-full bg-fg-faint transition-colors group-hover:bg-accent" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * Two-digit reel. Each column holds 0-9 stacked in a 1em-tall clipping box and
 * slides by whole digits, so the number rolls rather than swapping.
 *
 * Same trick the loading screen's odometer uses. The visible digits are
 * aria-hidden and a plain "Step N of M" sits alongside for screen readers,
 * which would otherwise be read a column of every numeral.
 */
function Reel({ value }: { value: number }) {
  const digits = String(value).padStart(2, '0').split('').map(Number);
  return (
    <span aria-hidden="true" className="flex tabular-nums">
      {digits.map((d, i) => (
        <span key={i} className="inline-block h-[1em] overflow-hidden leading-[1em]">
          <span
            className="block transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateY(${-d * 10}%)` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1em] leading-[1em]">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

const LABELS: Array<[string, string]> = [
  ['Name', 'name'],
  ['Email', 'email'],
  ['Company', 'company'],
  ['Problem', 'problem'],
  ['Running today', 'stack'],
  ['Timing', 'timing'],
  ['Budget', 'budget'],
];

function reviewRows(a: Answers): Array<[string, string]> {
  const rows = LABELS.map(([label, key]) => [label, (a[key] ?? '').trim()] as [string, string]).filter(
    ([, v]) => v
  );
  return rows.length ? rows : [['Nothing yet', 'Go back and fill in a step or two.']];
}

/** Plain text, because it has to survive both a mail client and WhatsApp. */
function buildBrief(a: Answers) {
  return reviewRows(a)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}
