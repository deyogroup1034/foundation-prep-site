# Foundation Preparatory Academy — foundationprep.com

Static Astro rebuild of the WordPress site for Foundation Preparatory Academy, a
K-12 University-Model® Christian school in Lake Jackson, Texas. Built to the Deyo
fleet standard (Astro 5 · Tailwind v4 · `@astrojs/vercel` static).

This is a **faithful port**, not a redesign: the layout, copy, imagery, typography
and colour values reproduce the live site section for section. Design tokens in
`src/styles/global.css` are computed styles read off the live pages, not
approximations.

## Preview

```bash
npm install
npm run dev          # http://localhost:4321
```

`npm run build` writes the static site to `dist/client` and the Vercel output to
`.vercel/output`. To preview exactly what ships (redirects and headers still come
from `vercel.json`, so they won't apply):

```bash
npm run build
npx serve dist/client
```

## Structure

```
src/
  assets/        images pulled from the WordPress uploads export
  components/    Header, Footer, Hero, LeadForm, YouTubeFacade, …
  content/       page copy, converted from the rendered WordPress output
  data/site.ts   business info, nav tree, per-page meta — single source of truth
  layouts/       Layout.astro (head, School JSON-LD, fonts, header/footer)
  pages/         one file per URL; api/contact.ts is the only non-static route
public/
  *.pdf                     the nine calendar/tuition PDFs, original filenames
  wp-content/uploads/...    content images at their original WordPress paths,
                            so old image URLs and hotlinks keep resolving
```

Page copy lives in `src/content/*.html` and is imported with `?raw`. Those
fragments were generated from the *rendered* live pages rather than the WPBakery
shortcodes in the XML — the shortcodes reference plugin state (Slider Revolution,
Gravity Forms) that the export doesn't contain. `docs/INVENTORY.md` records what
came from where.

## What changed from WordPress

Deliberate departures from the live site, all flagged during the inventory pass:

| Change | Why |
|---|---|
| One nav instead of two | The home page and inner pages ran different, drifted menus (different labels, different UMSI link, different ordering). Unified on the home version, keeping the inner header's phone number and Donate button. See `docs/INVENTORY.md` §5.4. |
| Hero is static | Per the brief: slide 1 of the six, same headline, sub-lines and CTA, no transitions. |
| YouTube is a click-to-play facade | The live page loaded the full player on every visit. |
| Meta descriptions authored | The live site ran no SEO plugin — no descriptions, OG tags or JSON-LD existed to carry. Added, plus School JSON-LD. |
| Honeypot + Turnstile | Replaces reCAPTCHA v2. Turnstile activates when the env vars below are set. |
| No cookie banner | The live banner only existed to cover plugin cookies that are gone. |
| Calendar icon fixed | The inner header linked to `/2023-24-calendar/`, two years stale, alive only via a redirect. Now points at `/2025-26-calendar`. |
| Logo links home | The home-page logo was wrapped in `<a href="#">`. |
| Phone in the footer | It appeared in the header and on `/contacts` but never in the footer. Added alongside the address and email. |
| Dynamic copyright | The footer hard-coded "© 2026". |
| Demo content dropped | 29 Greenville theme demo pages, 16 lorem-ipsum posts, 13 demo services and 3 demo staff pages, all 301'd. See `REDIRECTS.md`. |

## Environment variables

Neither is required to build or run; the form degrades gracefully without them.

| Variable | Purpose |
|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Renders the Turnstile widget on the contact form. Unset → honeypot only. |
| `TURNSTILE_SECRET_KEY` | Server-side verification in `src/pages/api/contact.ts`. Unset → verification skipped. |

## Deployed

| | |
|---|---|
| Repo | https://github.com/deyogroup1034/foundation-prep-site (public) |
| Vercel | `deyo-group` / `foundation-prep-site` (`prj_UienHOujEy8AMFzkCdsRdsAnmj7l`) |
| Staging URL | https://foundation-prep-site.vercel.app |
| Deyo Dash | site `4c21d566-e01f-4d6e-928f-f9395bc3cf88`, client `3d570c97-f017-4da1-8784-88526cb9b67f`, status **review** |

Pushes to `main` deploy automatically. Vercel Authentication is on for
`all_except_custom_domains`, matching the rest of the fleet — the branch and
per-deployment URLs need a login, the clean production alias above does not.

The staging alias is crawlable, but **every canonical and `og:url` points at
`https://foundationprep.com`**, so the pre-launch copy can't outrank or duplicate
the school's live site.

Verified on the deployment: all 23 pages 200; trailing-slash 308s; demo pages,
posts, `/team/*`, `/services/*`, `/services_group/*`, `/category/*` and
`/wp-json/*` all redirecting; `/calendar` and `/2023-24-calendar` →
`/2025-26-calendar`; PDF attachment pages → their PDFs; sitemap, robots,
favicons, PDFs and `/wp-content/uploads/...` all serving; all five security
headers present; uploads served `immutable`; and `/api/contact` running as a
serverless function (200 valid, 422 invalid).

## Launch checklist

- [ ] **Lead delivery** — `src/pages/api/contact.ts` logs to the console behind a
      `PLACEHOLDER` comment. Wire it to the Deyo Dash intake webhook and add the
      synthetic form-delivery marker so Dash form monitoring can verify the chain.
      WordPress sent these to `info@foundationprep.com`, subject "Information Request".
- [ ] **Turnstile** — the Deyo Dash env already holds a fleet Turnstile pair. Either
      add `foundation-prep-site.vercel.app` + `foundationprep.com` to that widget's
      allowed hostnames and reuse it, or mint a site-specific pair. Then set
      `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel. Until then
      the form runs on the honeypot alone.
- [ ] **Analytics** — Vercel Web Analytics is enabled via the adapter. The
      Cloudflare beacon placeholder is at the bottom of `src/layouts/Layout.astro`.
- [x] **Register in Deyo Dash** — done; status is `review`. Flip to `active` at launch.
- [ ] **Domain flip** — `astro.config.mjs` already sets
      `site: 'https://foundationprep.com'`. Point DNS at Vercel, then confirm the
      redirects in `REDIRECTS.md` resolve against the live origin.
- [ ] **Content decisions for the school** (see `docs/INVENTORY.md` §5):
      - `/2025-26-calendar` — the slug says 2025-26, the page covers 2025-27.
        Preserved as-is; renaming it means another redirect.
      - `/about-us` and `/what-is-umsi-naums` carry **identical copy**. The nav
        item labelled "What is UMSI/NAUMS" points at `naumsinc.org`, so the local
        page is orphaned. Either differentiate it or fold it into `/about-us`.
      - Four calendar PDFs (2021-22 through 2023-24) are shipped but linked from
        nowhere; `2023-2024-Academic-Calendar.pdf` and `-1.pdf` are duplicates.
      - `/tuition-fees` is a bare PDF embed with no HTML summary.

## Accessibility: inherited contrast failures

These are the **live site's colour values, reproduced faithfully**. They were not
introduced by the port, and none were changed, because doing so would alter the
brand palette — that's the school's call. Measured against WCAG 2.1 AA:

| Pair | Ratio | Needs | Where |
|---|---|---|---|
| White on hero gold `#EBC306` | **1.70:1** | 4.5:1 | "Request Information" button |
| White on teal `#59BABE` | 2.28:1 | 4.5:1 | Contact card on `/contacts` |
| Leaf green `#6AA84F` on white | 2.87:1 | 4.5:1 | "Read More" link in the home testimonial |
| White on Donate green `#619935` | 3.43:1 | 4.5:1 | "Donate Now" button |
| White on brand green `#169F49` | 3.45:1 | 4.5:1 | Main nav links |
| `#747C84` on white | 4.23:1 | 4.5:1 | Home tile labels, `h6` |

The hero button is the one worth acting on first — at 1.70:1 the label is close to
unreadable for many users. Minimal fixes that keep the palette recognisable:
darken the gold to about `#8A7203` for white text, or keep the gold and switch the
label to near-black. The nav and Donate greens clear AA at 18px+; bumping those
labels one step, or darkening the greens ~15%, closes the gap.

## Known dependency advisories

`npm audit` reports advisories in `astro`, `sharp` and `path-to-regexp` whose only
fix is Astro 7, a breaking upgrade away from the Astro 5 fleet baseline. Held at
Astro 5 deliberately; this is a fleet-wide upgrade decision, not a per-site one.
The `define:vars` XSS advisory does not apply — the directive isn't used here.

## Source material

`source/` holds the WordPress XML export and the 321 MB uploads archive. It is
gitignored — local reference only.
