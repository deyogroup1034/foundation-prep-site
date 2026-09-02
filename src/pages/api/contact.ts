import type { APIRoute } from 'astro';

// On-demand: this route runs as a Vercel serverless function rather than
// being prerendered. Everything else on the site stays static.
export const prerender = false;

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Honeypot field — humans never see it; a non-empty value means a bot. */
  company?: string;
  /** Turnstile token, present once PUBLIC_TURNSTILE_SITE_KEY is configured. */
  'cf-turnstile-response'?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  // Not configured yet → skip verification rather than reject every lead.
  if (!secret) return true;
  if (!token) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch {
    // A network failure against the verifier shouldn't drop a real inquiry.
    return true;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  // Honeypot tripped → pretend success so the bot learns nothing.
  if (body.company) return json({ ok: true });

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const phoneDigits = (body.phone ?? '').replace(/\D/g, '');
  const message = body.message?.trim() ?? '';

  // Server-side validation mirrors the live Gravity Form: name, email and
  // phone required; message optional.
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phoneDigits.length < 7) {
    return json({ ok: false, error: 'Please provide your name, a valid email, and a phone number.' }, 422);
  }

  if (!(await verifyTurnstile(body['cf-turnstile-response'], clientAddress ?? null))) {
    return json({ ok: false, error: 'Could not verify that you are human. Please try again.' }, 422);
  }

  // PLACEHOLDER — lead delivery is not wired up yet. Next step: POST the lead
  // to the Deyo Dash intake webhook (fleet standard; see hole-in-one-site's
  // src/lib/deyo.ts for the pattern), then add the synthetic form-delivery
  // test marker so Dash's form monitoring can verify the chain. Notifications
  // on the WordPress site went to info@foundationprep.com, subject
  // "Information Request".
  console.log('[lead:placeholder]', { name, email, phone: body.phone, message });

  return json({ ok: true });
};
