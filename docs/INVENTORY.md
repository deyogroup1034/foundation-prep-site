# Foundation Prep — Port Inventory

Source: `source/foundationpreparatoryacademy.WordPress.2026-09-02.xml` (WXR 1.2, 430 items) +
`source/uploads.zip` (321 MB, 3,582 files, extracted to `source/uploads/`) + live-site HTML capture
(26 pages, `scratchpad/live/`).

The site runs the **Greenville — Private School** theme (AncoraThemes) with a `greenville-child`
child theme, WPBakery Page Builder, Slider Revolution, Contact Form 7 **and** Gravity Forms.
Roughly **60% of the export is untouched theme demo content** that was never removed after the
2017 install. Dispositions below separate real FPA content from demo residue.

---

## 1. Page inventory & disposition

### 1a. BUILD — real FPA pages (21 in the brief)

| # | URL | WP ID | Live `<title>` | Notes |
|---|-----|-------|----------------|-------|
| 1 | `/` | 1044 | Foundation Preparatory Academy | slug is `home-new-alternative`; front page |
| 2 | `/about-us` | 1550 | About Us | |
| 3 | `/vision-mission-crest-statement-of-faith` | 1428 | Vision & Mission | title ≠ slug |
| 4 | `/leadership` | 1403 | Leadership | |
| 5 | `/testimonials` | 1153 | Testimonials | |
| 6 | `/faq` | 1388 | FAQ | |
| 7 | `/family-ministry` | 1434 | Family Ministry | |
| 8 | `/academics-primary` | 1486 | Academics | anchors `#kindergarten` `#grade1` `#grade2` |
| 9 | `/academics-elementary` | 1488 | Academics | anchors `#grade3`…`#grade6` |
| 10 | `/academics-secondary` | 1490 | Academics | anchors `#english` `#math` `#socialstudies` `#science` `#electives`; largest page (73 KB of shortcode) |
| 11 | `/co-curricular-activities` | 1439 | Co-Curricular Activities | |
| 12 | `/student-activities` | 1441 | Student Activities | |
| 13 | `/falcon-athletics` | 1664 | Falcon Athletics | duplicated as cpt_services 1689 |
| 14 | `/high-school-guidance-resources` | 1443 | High School Guidance Resources | |
| 15 | `/application-process` | 1448 | Application Process | |
| 16 | `/admission-policies` | 1450 | Admission Policies | |
| 17 | `/tuition-fees` | 1452 | Tuition & Fees | body is *only* a PDF download link |
| 18 | `/2025-26-calendar` | 1608 | 2025-27 Calendars | see staleness §5.1 |
| 19 | `/contacts` | 63 | Contacts | address + phone + email + Gravity Form 1 |
| 20 | `/services/flexible-schedule` | 285 | Flexible Schedule | two YouTube links in body |
| 21 | `/services/accreditation` | 284 | Accreditation | shortest real page (379 chars) |

### 1b. BUILD — real pages the brief did not list (recommend including)

| URL | WP ID | Why | Recommendation |
|-----|-------|-----|----------------|
| `/what-is-umsi-naums` | 1460 | Genuine FPA copy about the University-Model. In `wp-sitemap.xml`, so it is indexed. **Orphaned**: the nav item with this label points at `naumsinc.org` / `umsi.org` instead. | Build it, keep the URL. Decision needed on whether nav should point here or stay external — see Q1. |
| `/privacy-policy` | 1100 | Real published policy (18.5 KB), indexed. Not in any menu. | Build it, link from footer. |

### 1c. REDIRECT — superseded calendar pages

| URL | WP ID | Disposition |
|-----|-------|-------------|
| `/calendar` | 1541 | 301 → `/2025-26-calendar` (holds the 2021-22 PDF) |
| `/https-foundationprep-com-2024-25-calendar` | 1725 | 301 → `/2025-26-calendar` (malformed slug; holds the 24-25 PDF) |
| `/2023-24-calendar` | — | already 301s → `/2025-26-calendar` live; preserve |
| `/2024-25-calendar` | — | already 301s → `/2025-26-calendar` live; preserve |

### 1d. DROP — Greenville theme demo pages (28) → 301 to `/`

`/home-1` `/home-2` `/home-3` `/home-boxed` `/home-alternative` `/home-new-alternative`*
`/about-1` `/about-2` `/about-alter` `/admission` `/prospectus` `/community` `/programs`
`/programs-alternative` `/service-plus` `/privacy-policy-1` `/shortcodes` `/typography`
`/grid` `/masonry` `/cobbles` `/classic-1` `/classic-2` `/classic-3` `/chess-2` `/chess-4`
`/chess-6` `/portfolio-2` `/portfolio-3` `/portfolio-4`

\* `/home-new-alternative` is the front page's own slug — 301 → `/`.

### 1e. DROP — `/sitemap` (WP ID 1099)

Auto-generated page listing **every** page including all the demo ones above. Porting it would
re-expose the demo inventory. Recommend 301 → `/` and rely on `sitemap.xml`. See Q2.

### 1f. DROP — blog posts (16) → 301 to `/`

All 16 are Greenville demo posts dated 2017-02/03, authored by `staging_fpa`, with
**lorem ipsum bodies** ("Ullamcorper odio ante quis…"). Titles read plausibly
("Winter Concert Photos and Videos", "Top Admissions Questions") but there is no real content
behind any of them. No blog exists in the live nav.

`/the-right-high-school-myth-versus-reality` `/a-beginners-complete-guide-to-art-class`
`/how-to-find-a-college-that-fits-you` `/choosing-a-computer-or-electronic-device-for-your-child`
`/winter-concert-photos-and-videos` `/top-admissions-questions` `/school-choice-checklist`
`/international-school-trips-worth-the-hassle` `/10-minutes-with-college-counselor`
`/empowering-student-accountability` `/150` `/art-class-video`
`/getting-to-the-bottom-of-global-readiness` `/making-every-student-ready-for-the-world`
`/summer-2017-spotlight-traditional-day-camp` `/optimum-nutrition-for-the-school-day`

Their taxonomy archives go too: 9 `/category/*`, 7 `/tag/*`, `/author/staging_fpa`.

### 1g. `cpt_services` (22) — split

**Real, keep as pages** (2): `/services/flexible-schedule`, `/services/accreditation` — already in §1a.

**Real, but card-only** (7) — these exist solely as home-page tiles whose click target is another
page. Their `/services/{slug}/` permalinks still resolve on WP and must redirect:

| Permalink | 301 target |
|-----------|-----------|
| `/services/academics` (1120) | `/#homefourth` |
| `/services/primary` (1133) | `/academics-primary` |
| `/services/elementary` (238) | `/academics-elementary` |
| `/services/secondary` (1132) | `/academics-secondary` |
| `/services/family-ministry` (282) | `/family-ministry` |
| `/services/character-development` (283) | `/co-curricular-activities` |
| `/services/falcon-athletics` (1689) | `/falcon-athletics` |

**Demo** (13) → 301 to `/`: `/services/summer-camp` `/services/after-school` `/services/sixth-form`
`/services/junior-high` `/services/upper-elementary` `/services/horse-club` `/services/tennis`
`/services/dance-club` `/services/library-club` `/services/dramatic-arts` `/services/art-classes`
`/services/football` `/services/music-class`

**`services_group` taxonomy** (6) → 301 to `/`: `/services_group/programs` `/services_group/monday`
`/services_group/welcome` `/services_group/wednesday` `/services_group/friday`
`/services_group/education`

### 1h. `cpt_team` (3) → 301 to `/leadership`

`/team/nancy-cartwright` `/team/christopher-collins` `/team/pamela-hayden` — Greenville demo
staff (they are Simpsons voice actors). `/leadership` is the honest destination.

### 1i. `cpt_testimonials` (4) → 301 to `/testimonials`

`/testimonials/fpa-parent` (1137) is real and is rendered inline on the home page — it becomes
markup, not a route. `/testimonials/dzfghfxghnjxgf` `/testimonials/lisa-dowen`
`/testimonials/cynthia-jefferson` are demo. Plus `/testimonials_group/parent-testimonials`.

### 1j. `cpt_layouts` (12) → 301 to `/`

Theme header/footer/section parts that WP exposes publicly at `/layouts/{slug}/`. Two are
consumed by the pages we are building and become components, not routes:
`header-new-alternative` (1043, home header), `header-fullwidth-simple` (20, inner header),
`footer-standard` (11), `building-our-community-alternative` (991, the "The University Model"
band on the home page). The other 8 are demo.

### 1k. Attachment pages (164) → 301

Every upload has a WP attachment page (e.g. `/2025-2026-fpa-academic-calendar/`,
`/admission/application-form/`). 153 images → 301 to `/`; the 9 PDF attachment pages → 301 to
their PDF file (see §2).

---

## 2. Documents found

All 9 PDFs are present in `source/uploads/` — nothing needs downloading. Filenames preserved
verbatim under `/public/`.

| File | Size path | Linked from | Disposition |
|------|-----------|-------------|-------------|
| `2026-2027-academic-calendar.pdf` | `uploads/2026/02/` | `/2025-26-calendar` | **ship** |
| `2025-2026-fpa-academic-calendar.pdf` | `uploads/2025/03/` | `/2025-26-calendar` | **ship** |
| `tuition-fees-summary-26-27.pdf` | `uploads/2025/11/` | `/tuition-fees` | **ship** |
| `24-25-academic-calendar.pdf` | `uploads/2024/06/` | `/https-…-2024-25-calendar` | ship (redirect target) |
| `fpa-24-25-academic-calendar.pdf` | `uploads/2024/06/` | nothing | ship, orphaned duplicate |
| `2023-2024-Academic-Calendar.pdf` | `uploads/2023/06/` | nothing | ship, orphaned |
| `2023-2024-Academic-Calendar-1.pdf` | `uploads/2023/06/` | nothing | ship, byte-dup of the above |
| `FPA-Calendar_2022-2023.pdf` | `uploads/2022/05/` | nothing | ship, orphaned |
| `FPA-Calendar_2021-2022-Revised.pdf` | `uploads/2022/01/` | `/calendar` | ship (redirect target) |

Non-PDF documents: `sample-melody.mp3` and `Application-Form.txt` — both Greenville demo assets
(the .txt is a placeholder, not a real application form). **Not shipped.**

> The brief mentions "tuition sheets, forms". The only tuition document is
> `tuition-fees-summary-26-27.pdf`. **There is no application form PDF anywhere** — applications
> go through ClassReach. See Q4.

---

## 3. Forms found

The brief describes a Gravity Forms "Get in Touch" form. That is correct, but the export contains
**three** form definitions across two plugins:

### 3a. Gravity Forms — Form ID 1, "Get in Touch" ✅ port this

Rendered on `/` and `/contacts`. **Gravity Forms definitions are not included in WXR exports**, so
this was reconstructed from the live DOM:

| Field | Name | Type | Required | Placeholder | Width |
|-------|------|------|----------|-------------|-------|
| Name | `input_1.3` | text | yes | `Your Name*` | half |
| Email | `input_2` | email | yes | `Your Email*` | half |
| Phone | `input_3` | tel | yes | `Your Contact Number*` | full |
| Message | `input_4` | textarea (rows 10) | no | `Your Message` | full |
| CAPTCHA | `input_5` | reCAPTCHA v2 | — | sitekey `6LfWLVosAAAAAM5pygGW4yDws8bnbx1KwOi1zL-U` | full |

Submit button label `Submit`, background `#169f49`. Labels are visually hidden (`hidden_label`);
placeholders carry the labelling. Notification goes to `info@foundationprep.com`.

Port as: Astro form, same four fields + honeypot + POST placeholder for Deyo Dash. The live form
also has **reCAPTCHA v2** — see Q3.

### 3b. Contact Form 7 — ID 787, "Contact Form" ⚠️ present but not rendered

Same four fields (name / email / phone / message). It sits in a home-page row marked
`disable_element="yes"`, so it does not render, and its only other placements are demo pages
(`/home-1` `/home-2` `/home-3` `/home-boxed` `/programs` `/typography`). Notification:
`info@foundationprep.com`, subject "Information Request". **Not ported** — it is a dead duplicate
of 3a.

### 3c. Contact Form 7 — ID 514, "Prospectus" ❌ demo

First/last name, address, country select (USA/Australia), ZIP, phone, email, consent checkbox.
Only on `/prospectus`, a demo page. WP flags a config error on it ("Sender email address does not
belong to the site domain" — `admin@fpa.wordkeeper.net`). **Not ported.**

### 3d. Mailchimp for WP — "My Form" (ID 431) ❌ demo

Email + terms checkbox. No list is configured (`lists: a:0:{}`), so it cannot subscribe anyone.
Not placed on any live page. **Not ported.**

**No application or inquiry form exists** beyond the above. Admissions inquiries route through
Form 1 and the ClassReach external login.

---

## 4. Design capture (in progress)

Confirmed so far from the live HTML/CSS:

**Fonts** — all Google Fonts:
- `Fira Sans` 400/400i/500/500i/600/600i — body and nav, site-wide
- `Courgette` 400 — accent
- `Balthazar` 400 — **inner-page** header wordmark only (25 px)
- `Abril Fatface` 400 — home page only
- `Roboto` 400 — loaded on home, minimal use

**Colors**: brand green `#169f49` (inner header background, Current Students pill, form submit),
hero button `#EBC306` with `#D5B126` hover, section bands `#EFEFEF` and `#F2F3F6`, footer rule
`#404144`, link accent `#6AA84F`, body text `#5D646B`.

**Hero** (Slider Revolution `slider-1`, fullscreen, 1240×830 grid, 6 slides, `rgba(0,0,0,.5)` overlay):

1. `2024/08/fpa-graduation-008-1-2048x1152.jpeg` ← **the static hero image**
2. `2024/08/img_5737-2.jpeg`
3. `2024/08/img_1193-1.jpeg`
4. `2024/08/img_7732-1-2048x1152.jpeg`
5. `2024/08/2nd-4-1.jpeg`
6. `2024/08/img_7084-1-2048x1152.jpeg`

Static layers, all white Fira Sans, shown on slide 1 only:
- `<h1>` "Kingdom Character / Academic Excellence / Generational Impact" — 45px/55, ls −2px, w500, 700px wide
- `<h1>` "Grades K-12" — 25px/35, ls −2px, w500
- `<h1>` "Opened 2014" — 25px/35, ls −2px, w500
- Button "Request Information" → `/contacts` — 15px/22 w500, uppercase, padding 19/35, radius 30px, `#EBC306`

> Note: the brief gives the headline as "Kingdom Character · Academic Excellence · Generational
> Impact". On the live site it is three `<br>`-separated lines, and there are two further text
> layers ("Grades K-12", "Opened 2014") the brief did not mention. Porting all of it as-is.

**Two different headers** — this is the biggest structural surprise. See §5.4.

Desktop + mobile screenshots and full computed-style capture are the next step.

---

## 5. Stale / broken content flags

**5.1 — `/2025-26-calendar/` vs "2025-27 Calendars"** *(the one you predicted)*
The URL says 2025-26; the page title, the nav label, and the body all say 2025-27 and the page
lists **both** the 2025-2026 and the 2026-2027 calendars. The *label* is correct — the **slug** is
the stale part. Preserving the slug as instructed and 301ing the older calendar URLs onto it.

**5.2 — broken calendar icon in the inner header**
The little calendar icon in the inner-page header links to `/2023-24-calendar/`, two academic years
out of date. It currently survives only because WP has a redirect to `/2025-26-calendar/`. Fixing
the link to point straight at `/2025-26-calendar` in the port.

**5.3 — home logo links nowhere**
`<a href="#">` wraps the logo in the home header; on inner pages the same logo correctly links to
`/`. Fixing to `/` on both.

**5.4 — the home nav and the inner nav are different menus**
The home page renders `alternative-menu`; every inner page renders `inner-page-menu`. They have
drifted:

| | Home (`alternative-menu`) | Inner pages (`inner-page-menu`) |
|---|---|---|
| Section label | "Admission**s**" | "Admission" |
| UMSI link | `naumsinc.org` | `umsi.org/about-umsi/` |
| Admissions order | Application → Policies → Tuition | Application → Tuition → Policies |
| Header background | transparent over hero | solid `#169f49` |
| Wordmark | Fira Sans 30px | Balthazar 25px |
| Phone | absent | `(979) 401-3721` |
| Donate Now button | `display:none` | visible → GoFundMe |
| Logo link | `#` (broken) | `/` |

The brief describes the **home** version ("About Us / Programs / Admissions / Support / Contact
Us"). See Q1.

**5.5 — GoFundMe URL carries Facebook tracking**
`?pc=fb_dn_postdonate_r&rcid=…&utm_source=facebook&utm_medium=social&utm_campaign=fb_dn_postdonate_r&fbclid=IwAR0…`
Stripping to the bare campaign URL as instructed:
`https://www.gofundme.com/f/support-the-growth-of-foundation-prep-academy`

**5.6 — orphaned real page**
`/what-is-umsi-naums` has genuine FPA copy and is indexed, but nothing links to it — the menu item
of that name goes to an external site instead.

**5.7 — no SEO metadata exists at all**
No Yoast/RankMath/AIOSEO. Zero `<meta name="description">`, zero OpenGraph, zero Twitter cards,
zero JSON-LD anywhere on the live site. Titles are bare WordPress defaults, giving the home page
the doubled `Foundation Preparatory Academy – Foundation Preparatory Academy`. There is nothing to
"carry" — descriptions and OG data have to be **authored**. See Q5.

**5.8 — `robots.txt` blocks Applebot and every AI crawler**
Including `anthropic-ai`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Bytespider`, `Meta-ExternalAgent`,
and — notably — plain `Applebot`, which blocks Siri/Spotlight indexing. Also a pile of WooCommerce
`Disallow` rules for a store that does not exist. Carrying only the meaningful directives. See Q6.

**5.9 — no analytics**
No GA4, GTM, or any beacon on the live site. Adding the fleet placeholder only.

**5.10 — duplicate/orphaned PDFs**
`2023-2024-Academic-Calendar.pdf` and `-1.pdf` are the same document; four calendar PDFs are linked
from nowhere. Shipping them all to keep old links alive.

---

## 6. Questions

**Q1 — Which nav wins?** The home and inner navs differ (§5.4). Recommend standardising on the
**home** version site-wide (it is the one the brief describes and the newer of the two:
"Admissions", `naumsinc.org`), while keeping the inner header's useful extras — phone number and
visible Donate Now — in the top bar on every page. Confirm.

**Q2 — `/sitemap`?** It is a real indexed URL but enumerates all 30 demo pages. Recommend 301 → `/`
and ship only `sitemap.xml`. Confirm, or say if you want a hand-built HTML sitemap of the 23 real
pages.

**Q3 — Spam protection.** Live form 1 uses reCAPTCHA v2. The brief specifies honeypot only.
Honeypot alone on a public school contact form will take spam. Recommend honeypot **plus**
Cloudflare Turnstile (fleet-standard, no cookie banner implications). Default if you don't reply:
honeypot only, as specified, with Turnstile wired but disabled.

**Q4 — Application form.** `/application-process` describes the process but the only submission
path is ClassReach. Is there an application PDF or inquiry form that should exist and doesn't?

**Q5 — Meta descriptions.** None exist (§5.7). Want me to write descriptions for the 23 pages
(recommended), or ship title-only?

**Q6 — AI crawler blocks.** Live `robots.txt` blocks Applebot + all AI crawlers. Carry those blocks
forward, or drop them? Recommend dropping the plain `Applebot` block (it hurts Siri/Spotlight
discovery) and keeping the AI-training blocks. The WooCommerce rules go either way.

**Q7 — Blog.** Confirming the 16 lorem-ipsum posts are dropped and `/category/*`, `/tag/*`,
`/author/*` all 301 to `/`. No blog in the new site.

**Q8 — Phone number.** `(979) 401-3721` appears in the inner header and on `/contacts` but nowhere
in the footer. Add it to the footer alongside the address and email?

---

## 7. URL totals for `REDIRECTS.md`

| Class | Count | Disposition |
|-------|-------|-------------|
| Real pages built 1:1 | 23 | 200 |
| Calendar pages superseded | 4 | 301 → `/2025-26-calendar` |
| Demo pages | 29 | 301 → `/` |
| `/sitemap` | 1 | 301 → `/` |
| Blog posts | 16 | 301 → `/` |
| Category / tag / author archives | 17 | 301 → `/` |
| `cpt_services` — card-only | 7 | 301 → mapped page |
| `cpt_services` — demo | 13 | 301 → `/` |
| `services_group` taxonomy | 6 | 301 → `/` |
| `cpt_team` | 3 | 301 → `/leadership` |
| `cpt_testimonials` + group | 5 | 301 → `/testimonials` |
| `cpt_layouts` | 12 | 301 → `/` |
| Attachment pages — PDFs | 9 | 301 → the PDF |
| Attachment pages — images | 153 | 301 → `/` |
| **Total export URLs mapped** | **298** | |

Non-1:1 rules (everything except the 23 built pages) go in `vercel.json`; wildcards will collapse
`/services/*`, `/team/*`, `/layouts/*`, `/category/*`, `/tag/*` and the attachment pages into a
handful of rules rather than 298 literal entries.
