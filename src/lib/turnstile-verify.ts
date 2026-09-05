/**
 * Server-side Turnstile verification (Cloudflare siteverify), used by the
 * contact API route. Enforced only once TURNSTILE_SECRET_KEY is configured,
 * so the form keeps working (honeypot-only) while the widget is being set up.
 */
import { env } from './env';

export async function verifyTurnstile(token: string | null | undefined, ip?: string | null): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true; // not configured yet — widget isn't rendered either
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) {
      console.error('turnstile siteverify HTTP', res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) console.warn('turnstile rejected:', data['error-codes']);
    return Boolean(data.success);
  } catch (err) {
    console.error('turnstile siteverify failed:', err);
    return false;
  }
}
