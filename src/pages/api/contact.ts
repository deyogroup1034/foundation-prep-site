import type { APIRoute } from 'astro';
import { isTestSubmission, postLeadToDeyoDash } from '@/lib/deyo';
import { sendEmail } from '@/lib/email';
import { verifyTurnstile } from '@/lib/turnstile-verify';
import { BIZ } from '@/data/site';

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
  /** Turnstile token; present in the form data once the widget has rendered
   * and completed (implicit render via the cf-turnstile div in LeadForm). */
  'cf-turnstile-response'?: string;
  /** Deyo Dash synthetic form-delivery test marker (shared fleet secret). */
  deyo_test?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

  // Synthetic form-delivery test (Deyo Dash monitoring). The marker must
  // match the fleet shared secret, so nothing external can reach this path.
  // It runs the same validation, then routes straight to the webhook flagged
  // `test: true` (recorded as a form_delivery health result, never a lead).
  if (isTestSubmission(body.deyo_test)) {
    const delivered = await postLeadToDeyoDash({
      name,
      email,
      detail: { phone: body.phone, message },
      test: true,
    });
    return json({ ok: delivered, deyo_test: delivered ? 'delivered' : 'webhook-failed' }, delivered ? 200 : 502);
  }

  // Fleet-standard bot gate: verify the Turnstile token server-side before
  // accepting the lead. Enforced only once TURNSTILE_SECRET_KEY is
  // configured, so the form keeps working (honeypot-only) in the meantime.
  const human = await verifyTurnstile(body['cf-turnstile-response'], clientAddress ?? null);
  if (!human) {
    return json({ ok: false, error: 'Could not verify that you are human. Please try again.' }, 422);
  }

  // Always in the function logs, whatever the delivery channels do.
  console.log('New contact form submission:', { name, email, phone: body.phone, message });

  // Lead delivery, two channels: email to the school (Resend — activates
  // once RESEND_API_KEY is set) and the Deyo Dash webhook for monitoring and
  // reporting. Either alone counts as delivered. The live WordPress form
  // notified info@foundationprep.com, subject "Information Request" — same
  // destination and subject here via BIZ.email.
  const footer =
    'This notification was sent automatically by the website contact form. ' +
    "To respond, reply to this email (it goes to the visitor's address) or call them directly.";
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${body.phone ?? ''}`,
    '',
    message || '(no message)',
    '',
    '—',
    footer,
  ].join('\n');
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(body.phone ?? '')}</p>
    <hr />
    <p>${escapeHtml(message || '(no message)').replace(/\n/g, '<br />')}</p>
    <hr />
    <p style="color:#666;font-size:12px">${footer}</p>
  `;

  const emailResult = await sendEmail({
    to: import.meta.env.CONTACT_TO_EMAIL ?? BIZ.email,
    replyTo: email,
    subject: `[Website] Information Request — ${name}`,
    text,
    html,
  });
  const emailConfigured = emailResult.error?.name !== 'missing_api_key';
  const emailOk = emailConfigured && !emailResult.error;
  if (emailConfigured && emailResult.error) {
    console.error('Resend error:', emailResult.error);
  }

  const webhookOk = await postLeadToDeyoDash({
    name,
    email,
    detail: { phone: body.phone, message },
  });

  // Pre-launch (email unconfigured) the log + webhook are the record, so the
  // visitor still gets a success. Once email is live, only fail the visitor
  // when NO channel delivered — never lose a lead silently.
  if (emailConfigured && !emailOk && !webhookOk) {
    return json(
      { ok: false, error: `We couldn't send your message right now. Please call ${BIZ.phone} and we'll help right away.` },
      500,
    );
  }

  return json({ ok: true });
};
