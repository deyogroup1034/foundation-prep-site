import { Resend } from 'resend';

// Instantiated lazily inside sendEmail: the Resend constructor throws when no
// API key is available, and this module must stay importable with email
// unconfigured.
let resend: Resend | null = null;

// Default sender: the fleet's already-verified mail.deyone.com sending
// domain (the same one Fabstone uses), not Resend's onboarding sandbox — so
// email works the moment RESEND_API_KEY is set, with no separate DNS
// verification step for foundationprep.com. "notifications@" rather than
// "noreply@" because the footer tells the school to reply (replies route to
// the visitor's address via replyTo, not to this sender). Override via
// RESEND_FROM_EMAIL once/if the school wants mail sent from their own domain
// instead.
const DEFAULT_FROM = import.meta.env.RESEND_FROM_EMAIL ?? 'Your Website <notifications@mail.deyone.com>';

export type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string | string[];
};

/** Thin wrapper around the Resend client; reports a typed error when the
 * API key isn't configured yet instead of throwing. */
export async function sendEmail({ to, subject, html, text, from = DEFAULT_FROM, replyTo }: SendEmailParams) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      data: null,
      error: {
        name: 'missing_api_key' as const,
        message: 'RESEND_API_KEY is not configured',
      },
    };
  }
  resend ??= new Resend(apiKey);
  return resend.emails.send({ from, to, subject, html, text, replyTo });
}
