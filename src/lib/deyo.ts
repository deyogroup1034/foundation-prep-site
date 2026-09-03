/**
 * Deyo Dash fleet integration — the standard form-handler contract.
 *
 * Every real form submission is reported to Deyo Dash's lead-ingest endpoint
 * (best-effort: a webhook failure never breaks the visitor's submission).
 * Synthetic monitoring submissions carry a `deyo_test` marker that must match
 * the shared secret; they run the same pipeline but are flagged so they never
 * count as leads and never reach the school.
 *
 * Env (Vercel project settings): LEAD_INGEST_SECRET, DEYO_SITE_ID, DEYO_DASH_URL.
 * This site's DEYO_SITE_ID is its row id in Dash's `sites` table
 * (4c21d566-e01f-4d6e-928f-f9395bc3cf88 as of registration) — not secret,
 * safe to paste directly into Vercel.
 */

const DASH_URL = import.meta.env.DEYO_DASH_URL ?? 'https://deyo-dash.deyogroup.workers.dev';

export type LeadPayload = {
  name?: string;
  email?: string;
  detail?: Record<string, unknown>;
  test?: boolean;
};

/** True when a submission carries the valid test marker (shared secret). */
export function isTestSubmission(marker: unknown): boolean {
  const secret = import.meta.env.LEAD_INGEST_SECRET;
  return Boolean(secret && typeof marker === 'string' && marker === secret);
}

/** Report a submission to Deyo Dash. Returns whether the webhook landed. */
export async function postLeadToDeyoDash(payload: LeadPayload): Promise<boolean> {
  const secret = import.meta.env.LEAD_INGEST_SECRET;
  const siteId = import.meta.env.DEYO_SITE_ID;
  if (!secret || !siteId) {
    console.warn('Deyo lead webhook skipped — LEAD_INGEST_SECRET/DEYO_SITE_ID not set');
    return false;
  }
  try {
    const res = await fetch(`${DASH_URL}/api/leads`, {
      method: 'POST',
      // Never follow redirects: a stale/misconfigured ingest that bounces to a
      // login page must read as failure, not as a 200 from the login HTML.
      redirect: 'manual',
      headers: {
        'content-type': 'application/json',
        'x-deyo-forms-secret': secret,
      },
      body: JSON.stringify({
        site_id: siteId,
        source: 'form',
        name: payload.name,
        email: payload.email,
        detail: payload.detail ?? {},
        test: payload.test ?? false,
      }),
    });
    if (!res.ok) {
      console.error('Deyo lead webhook rejected:', res.status);
      return false;
    }
    // Require the ingest's own JSON ack — a 200 from anything else doesn't count.
    const ack = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!ack?.ok) console.error('Deyo lead webhook: 200 but no ok ack');
    return Boolean(ack?.ok);
  } catch (err) {
    console.error('Deyo lead webhook failed:', err);
    return false;
  }
}
