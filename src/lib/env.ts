/**
 * Server-side environment reader.
 *
 * Two things this exists to get right, both of which bit us in production:
 *
 * 1. `process.env`, not `import.meta.env`. Vite statically inlines
 *    `import.meta.env.X` at BUILD time, so a value changed in the Vercel
 *    dashboard silently keeps the old build's value until the next rebuild.
 *    `process.env` reads at request time and matches the rest of the fleet
 *    (hole-in-one-site, marketing-spectrum-site, fabstone-design).
 *    Client-side code is the exception — PUBLIC_* vars in React components
 *    must stay on `import.meta.env` precisely because they need inlining.
 *
 * 2. Empty string counts as unset. Vercel stores a variable added-but-blank
 *    as "", and `"" ?? fallback` evaluates to "" — not the fallback. That
 *    shipped an empty `from` address to Resend, which rejects the send, so
 *    notification email failed while the visitor still saw success (the Deyo
 *    Dash webhook succeeded and masked it). Treat blank as absent.
 */
export function env(name: string): string | undefined {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return undefined;
  const trimmed = String(raw).trim();
  return trimmed === '' ? undefined : trimmed;
}

/** `env(name)` with a default applied when the variable is unset or blank. */
export function envOr(name: string, fallback: string): string {
  return env(name) ?? fallback;
}

/** First non-blank variable among `names`, else undefined. */
export function envAny(...names: string[]): string | undefined {
  for (const name of names) {
    const value = env(name);
    if (value !== undefined) return value;
  }
  return undefined;
}
