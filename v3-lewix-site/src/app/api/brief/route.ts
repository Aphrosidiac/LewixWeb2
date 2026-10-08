/**
 * POST /api/brief: the project brief on /contact, delivered.
 *
 * Ported from ffdev.studio's `functions/api/brief.js` (same Resend account and
 * key). The brief is emailed to the team through Resend; if that fails, the
 * visitor is told and offered email/WhatsApp instead, so a brief is never lost
 * silently.
 *
 * Settings (server env, e.g. `.env.production.local` next to package.json;
 * locally `.env.local`, both git-ignored):
 *   RESEND_API_KEY  secret, Resend key with "Sending access"
 *   BRIEF_TO        optional, default hello@lewix.ai
 *   BRIEF_FROM      optional, default brief@ffdev.studio. The sender must be on
 *                   a domain verified in that Resend account; lewix.ai is not
 *                   (yet), ffdev.studio is.
 *
 * Never logged: what the visitor wrote. Logs carry that delivery failed and
 * the HTTP status, nothing else.
 */

const MAX = { name: 120, email: 200, company: 160, problem: 6000, stack: 1000, timing: 300, budget: 80 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Brief = {
  name: string;
  email: string;
  company: string;
  problem: string;
  stack: string;
  timing: string;
  budget: string;
  page: string;
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
const str = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(request: Request) {
  // Same-site only: the form is the one caller. A missing Origin is allowed,
  // because some privacy tools strip it.
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) return json({ ok: false, error: 'origin' }, 403);

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  if (!raw || typeof raw !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  if (raw._gotcha) return json({ ok: true }); // honeypot: a bot filled the hidden field

  const d: Brief = {
    name: str(raw.name, MAX.name),
    email: str(raw.email, MAX.email).toLowerCase(),
    company: str(raw.company, MAX.company),
    problem: str(raw.problem, MAX.problem),
    stack: str(raw.stack, MAX.stack),
    timing: str(raw.timing, MAX.timing),
    budget: str(raw.budget, MAX.budget),
    page: str(raw.page, 300),
  };
  const fields: Record<string, string> = {};
  if (!d.name) fields.name = 'Please add your name.';
  if (!EMAIL_RE.test(d.email)) fields.email = 'Please add an email address that works.';
  if (!d.problem) fields.problem = 'Please describe the problem.';
  if (Object.keys(fields).length) return json({ ok: false, error: 'invalid', fields }, 422);

  try {
    if (!(await sendEmail(d))) return json({ ok: false, error: 'undelivered' }, 502);
  } catch (e) {
    console.error(`brief: email failed: ${e instanceof Error ? e.message : e}`);
    return json({ ok: false, error: 'undelivered' }, 502);
  }
  return json({ ok: true });
}

const ROWS: Array<[string, keyof Brief]> = [
  ['Name', 'name'],
  ['Email', 'email'],
  ['Company', 'company'],
  ['Running today', 'stack'],
  ['Timing', 'timing'],
  ['Budget', 'budget'],
];

function briefText(d: Brief) {
  const lines = ROWS.filter(([, k]) => d[k]).map(([label, k]) => `${label}: ${d[k]}`);
  lines.push('', 'The problem:', d.problem);
  return lines.join('\n');
}

/** Resolves true when sent, false when not configured; throws when Resend refuses it. */
async function sendEmail(d: Brief) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.BRIEF_FROM || 'brief@ffdev.studio';
  const to = process.env.BRIEF_TO || 'hello@lewix.ai';
  const where = d.page || 'lewix.ai/contact';

  const text = `${briefText(d)}\n\n--\nSent from the project brief on ${where}. Reply to this email to answer ${d.name}.`;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#777;vertical-align:top">${k}</td><td style="padding:4px 0">${v}</td></tr>`;
  const html = `<div style="font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;max-width:620px">
<table style="border-collapse:collapse;margin-bottom:18px">${ROWS.filter(([, k]) => d[k])
    .map(([label, k]) =>
      row(label, k === 'email' ? `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>` : esc(d[k]))
    )
    .join('')}</table>
<p style="margin:0 0 4px;color:#777;font-size:13px">The problem</p>
<p style="white-space:pre-wrap;margin:0 0 18px">${esc(d.problem)}</p>
<p style="margin:24px 0 0;font-size:12px;color:#999">Sent from the project brief on ${esc(where)}. Reply to answer ${esc(d.name)}.</p></div>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: `LEWIX brief <${from}>`,
      to: [to],
      reply_to: d.email,
      subject: `New project: ${d.company || d.name}`,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!r.ok) {
    const b = (await r.json().catch(() => ({}))) as { name?: string };
    throw new Error(`HTTP ${r.status} ${b.name ?? ''}`);
  }
  return true;
}
