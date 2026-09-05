import { useState, type FormEvent } from 'react';
import { Turnstile, resetTurnstile, turnstileConfigured, type TurnstileStatus } from './Turnstile';

/**
 * "Get in Touch" — a faithful port of Gravity Forms form 1 as it renders on
 * the live site: Name / Email / Phone required, Message optional, placeholders
 * carrying the labels (the live form hides them visually).
 *
 * Spam protection: honeypot + Cloudflare Turnstile. The live form used
 * reCAPTCHA v2; Turnstile is the fleet standard and avoids the Google
 * cookie. Turnstile only renders once PUBLIC_TURNSTILE_SITE_KEY is set.
 */
type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>('pending');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The widget renders explicitly (see Turnstile.tsx), so its token
        // lives in React state rather than a hidden input FormData would pick
        // up. Key name matches what the server route reads.
        body: JSON.stringify({ ...data, 'cf-turnstile-response': turnstileToken }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      // Turnstile tokens are single-use: the submit above consumed this one
      // whether or not it succeeded. Without a reset the retry re-sends the
      // spent token and siteverify rejects it as timeout-or-duplicate, so
      // every attempt after the first fails no matter what the visitor does.
      if (turnstileConfigured()) {
        resetTurnstile();
        setTurnstileToken(null);
        setTurnstileStatus('pending');
      }
    }
  }

  if (status === 'sent') {
    return (
      <p
        role="status"
        className="rounded border border-[color:var(--color-brand)] bg-[color:var(--color-brand)]/5 px-5 py-4 text-[15px] text-[color:var(--color-body)]"
      >
        Thank you for your message. It has been sent.
      </p>
    );
  }

  // Live styling: #F2F3F6 fill, no border, 1.7em/2.1em padding and a full
  // pill radius on the single-line inputs (the textarea keeps square-ish ends).
  const base =
    'w-full border-0 bg-[color:var(--color-band-alt)] px-[2.1em] py-[1.7em] font-[family-name:var(--font-body)] text-[14px] text-[color:var(--color-body)] outline-none transition-shadow placeholder:text-[#8d949b] focus:ring-2 focus:ring-[color:var(--color-brand)]';
  const field = `${base} rounded-full`;
  const area = `${base} rounded-[28px] resize-y`;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
        <div>
          <label htmlFor="lf-name" className="sr-only">
            Name (required)
          </label>
          <input id="lf-name" name="name" type="text" required autoComplete="name" placeholder="Your Name*" className={field} />
        </div>
        <div>
          <label htmlFor="lf-email" className="sr-only">
            Email (required)
          </label>
          <input id="lf-email" name="email" type="email" required autoComplete="email" placeholder="Your Email*" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="lf-phone" className="sr-only">
          Phone (required)
        </label>
        <input id="lf-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Your Contact Number*" className={field} />
      </div>

      <div>
        <label htmlFor="lf-message" className="sr-only">
          Message
        </label>
        <textarea id="lf-message" name="message" rows={compact ? 5 : 7} placeholder="Your Message" className={area} />
      </div>

      {/* Honeypot — visually hidden and skipped by keyboard/screen readers.
          Any value means a bot filled it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="lf-company">Company</label>
        <input id="lf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile onToken={setTurnstileToken} onStatus={setTurnstileStatus} />

      {status === 'error' && (
        <p role="alert" className="text-[14px] text-[#b3261e]">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === 'sending' || (turnstileConfigured() && turnstileStatus !== 'ready')}
          className="rounded-full bg-[color:var(--color-brand)] px-11 py-[18px] font-[family-name:var(--font-head)] text-[13px] font-medium uppercase tracking-[0.5px] text-white transition-colors hover:bg-[color:var(--color-brand-dark)] disabled:opacity-60"
        >
          {status === 'sending'
            ? 'Sending…'
            : turnstileConfigured() && turnstileStatus === 'pending'
              ? 'Checking…'
              : 'Submit'}
        </button>
      </div>
    </form>
  );
}
