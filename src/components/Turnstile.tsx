import { useCallback, useEffect, useRef, useState } from 'react';

/* Cloudflare Turnstile widget (fleet-standard bot protection for forms).

   Why this exists rather than dropping a `.cf-turnstile` div and letting
   api.js auto-render: LeadForm is a `client:visible` React island, so the
   implicit render races hydration. api.js scans for `.cf-turnstile` once on
   load and injects into the div; React then hydrates and reconciles that same
   div, wiping the injected widget. The result was a form that showed the
   widget only if you looked in the window before hydration, and shipped no
   token at all after — which the server-side gate then rejected.

   Loading with ?render=explicit disables the auto-scan entirely, and the
   widget is rendered from an effect into a ref'd container that React itself
   mounted empty. React has no children to reconcile there, so nothing gets
   wiped, and the order is deterministic.

   Renders nothing until PUBLIC_TURNSTILE_SITE_KEY is configured — the same
   ship-ahead pattern as the analytics beacon. The companion server-side check
   lives in /api/contact (TURNSTILE_SECRET_KEY); tokens are verified against
   siteverify there, never in the browser.

   Tokens live 300s and are single-use, so the widget reports its state upward
   (`onStatus`) as well as its token: a form that posts a stale or absent token
   is rejected by the gate with nothing for the visitor to re-tick, which loses
   the lead silently. Expiry and load failure are both surfaced. */

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** api.js is small; if it hasn't run by now it's blocked or the network is out. */
const SCRIPT_TIMEOUT_MS = 15_000;

/** 'pending' = no usable token yet, 'ready' = token in hand, 'failed' = unrecoverable. */
export type TurnstileStatus = 'pending' | 'ready' | 'failed';

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action?: string;
      theme?: 'light' | 'dark' | 'auto';
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'timeout-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/* The id of the widget this page rendered, so reset() targets it explicitly
   rather than relying on the implicit "last rendered widget" default. */
let widgetId: string | undefined;

export function turnstileConfigured(): boolean {
  return Boolean(SITE_KEY);
}

/** Reset the page's widget (after a submit consumes or invalidates the token). */
export function resetTurnstile(): void {
  try {
    window.turnstile?.reset(widgetId);
  } catch {
    // Widget not rendered — nothing to reset.
  }
}

export function Turnstile({
  onToken,
  onStatus,
}: {
  onToken: (token: string | null) => void;
  onStatus?: (status: TurnstileStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const [failed, setFailed] = useState(false);

  /* Keep the callbacks in refs: the effect below must run once per mount, not
     re-run (and re-attach listeners) whenever the parent re-renders. */
  const onTokenRef = useRef(onToken);
  const onStatusRef = useRef(onStatus);
  onTokenRef.current = onToken;
  onStatusRef.current = onStatus;

  const fail = useCallback(() => {
    setFailed(true);
    onTokenRef.current(null);
    onStatusRef.current?.('failed');
  }, []);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || rendered.current || !containerRef.current || !window.turnstile) return;
    rendered.current = true;
    widgetId = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action: 'contact',
      theme: 'light',
      callback: (token) => {
        setFailed(false);
        onTokenRef.current(token);
        onStatusRef.current?.('ready');
      },
      /* A token is only good for 300s. Cloudflare's `refresh-expired`/
         `refresh-timeout` default to "auto" and mint a replacement on their
         own, so don't reset here or the widget refreshes twice. Just drop the
         dead token and report 'pending'; the form holds any submit landing in
         that gap instead of posting a null token the gate would reject. */
      'expired-callback': () => {
        onTokenRef.current(null);
        onStatusRef.current?.('pending');
      },
      'timeout-callback': () => {
        onTokenRef.current(null);
        onStatusRef.current?.('pending');
      },
      'error-callback': () => fail(),
    });
  }, [fail]);

  useEffect(() => {
    if (!SITE_KEY) return;
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Load the API script once; re-mounts reuse it.
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderWidget);
    // Blocked by an extension, a filter list, or a dead network: say so rather
    // than leaving an empty box and a submit that can never pass the gate.
    script.addEventListener('error', fail);
    const watchdog = window.setTimeout(() => {
      if (!rendered.current) fail();
    }, SCRIPT_TIMEOUT_MS);

    return () => {
      window.clearTimeout(watchdog);
      script?.removeEventListener('load', renderWidget);
      script?.removeEventListener('error', fail);
    };
  }, [renderWidget, fail]);

  if (!SITE_KEY) return null;

  return (
    <div>
      {/* cf-turnstile is a marker only (fleet scanner + convention); api.js is
          loaded with ?render=explicit, so no implicit auto-render happens. */}
      <div ref={containerRef} className="cf-turnstile" />
      {failed && (
        <p className="mt-1.5 text-[13px] text-[#b3261e]">
          The security check couldn&rsquo;t load. Please refresh and try again.
        </p>
      )}
    </div>
  );
}
