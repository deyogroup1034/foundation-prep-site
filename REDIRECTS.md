# REDIRECTS — foundationprep.com WordPress → Astro

Every URL in the WordPress export (`source/foundationpreparatoryacademy.WordPress.2026-09-02.xml`),
plus the taxonomy and author archives WordPress generated, resolved against the rules in
`vercel.json`. Nothing is left unmapped.

| Disposition | URLs |
|---|---|
| **200** — built 1:1 in the new site | 23 |
| **301** — permanent redirect | 245 |
| **Unmapped** | 0 |
| **Total** | 268 |

`vercel.json` carries **261 redirect rules**; wildcards collapse the long tails
(`/team/*`, `/layouts/*`, `/category/*`, attachment pages under demo parents) so the rule count
stays well under the URL count.

`"trailingSlash": false` means every WordPress URL — all of which ended in `/` — 308s to the
slash-less form first, then follows any rule below.

---

## 200 — pages built 1:1

Slugs preserved exactly, including `/2025-26-calendar` (whose label says 2025-27; see
`docs/INVENTORY.md` §5.1) and `/contacts` (plural, as WordPress had it).

| URL | Page |
|---|---|
| `/` | Home New Alternative |
| `/2025-26-calendar` | 2025-27 Calendars |
| `/about-us` | About Us |
| `/academics-elementary` | Academics |
| `/academics-primary` | Academics |
| `/academics-secondary` | Academics |
| `/admission-policies` | Admission Policies |
| `/application-process` | Application Process |
| `/co-curricular-activities` | Co-Curricular Activities |
| `/contacts` | Contacts |
| `/falcon-athletics` | Falcon Athletics |
| `/family-ministry` | Family Ministry |
| `/faq` | FAQ |
| `/high-school-guidance-resources` | High School Guidance Resources |
| `/leadership` | Leadership |
| `/privacy-policy` | Privacy Policy |
| `/services/accreditation` | Accreditation |
| `/services/flexible-schedule` | Flexible Schedule |
| `/student-activities` | Student Activities |
| `/testimonials` | Testimonials |
| `/tuition-fees` | Tuition & Fees |
| `/vision-mission-crest-statement-of-faith` | Vision & Mission |
| `/what-is-umsi-naums` | What is UMSI/NAUMS |

---

## 301 — redirects

### Pages (32)

Greenville theme demo pages that were never removed after the 2017 install, plus the superseded calendar pages and the WordPress-generated `/sitemap` (which enumerated all the demo pages).

| URL | → |
|---|---|
| `/about-1` | `/` |
| `/about-2` | `/` |
| `/about-alter` | `/` |
| `/admission` | `/` |
| `/calendar` | `/2025-26-calendar` |
| `/chess-2` | `/` |
| `/chess-4` | `/` |
| `/chess-6` | `/` |
| `/classic-1` | `/` |
| `/classic-2` | `/` |
| `/classic-3` | `/` |
| `/cobbles` | `/` |
| `/community` | `/` |
| `/grid` | `/` |
| `/home-1` | `/` |
| `/home-2` | `/` |
| `/home-3` | `/` |
| `/home-alternative` | `/` |
| `/home-boxed` | `/` |
| `/https-foundationprep-com-2024-25-calendar` | `/2025-26-calendar` |
| `/masonry` | `/` |
| `/portfolio-2` | `/` |
| `/portfolio-3` | `/` |
| `/portfolio-4` | `/` |
| `/privacy-policy-1` | `/` |
| `/programs` | `/` |
| `/programs-alternative` | `/` |
| `/prospectus` | `/` |
| `/service-plus` | `/` |
| `/shortcodes` | `/` |
| `/sitemap` | `/` |
| `/typography` | `/` |

### Blog posts (theme demo) (16)

All 16 are lorem ipsum under plausible-looking titles. There is no blog in the new site.

| URL | → |
|---|---|
| `/10-minutes-with-college-counselor` | `/` |
| `/150` | `/` |
| `/a-beginners-complete-guide-to-art-class` | `/` |
| `/art-class-video` | `/` |
| `/choosing-a-computer-or-electronic-device-for-your-child` | `/` |
| `/empowering-student-accountability` | `/` |
| `/getting-to-the-bottom-of-global-readiness` | `/` |
| `/how-to-find-a-college-that-fits-you` | `/` |
| `/international-school-trips-worth-the-hassle` | `/` |
| `/making-every-student-ready-for-the-world` | `/` |
| `/optimum-nutrition-for-the-school-day` | `/` |
| `/school-choice-checklist` | `/` |
| `/summer-2017-spotlight-traditional-day-camp` | `/` |
| `/the-right-high-school-myth-versus-reality` | `/` |
| `/top-admissions-questions` | `/` |
| `/winter-concert-photos-and-videos` | `/` |

### cpt_services (13)

Seven of these existed only as home-page tiles pointing at a real page — those keep their destination. The other 13 are theme demo. `/services/flexible-schedule` and `/services/accreditation` are real pages and are **not** redirected.

| URL | → |
|---|---|
| `/services/after-school` | `/` |
| `/services/art-classes` | `/` |
| `/services/dance-club` | `/` |
| `/services/dramatic-arts` | `/` |
| `/services/football` | `/` |
| `/services/horse-club` | `/` |
| `/services/junior-high` | `/` |
| `/services/library-club` | `/` |
| `/services/music-class` | `/` |
| `/services/sixth-form` | `/` |
| `/services/summer-camp` | `/` |
| `/services/tennis` | `/` |
| `/services/upper-elementary` | `/` |

### cpt_team (3)

Greenville demo staff (Simpsons voice actors). `/leadership` is the honest destination.

| URL | → |
|---|---|
| `/team/christopher-collins` | `/leadership` |
| `/team/nancy-cartwright` | `/leadership` |
| `/team/pamela-hayden` | `/leadership` |

### cpt_testimonials (4)

`fpa-parent` is real but renders inline on the home page and `/testimonials`, so it is markup rather than a route.

| URL | → |
|---|---|
| `/testimonials/cynthia-jefferson` | `/testimonials` |
| `/testimonials/dzfghfxghnjxgf` | `/testimonials` |
| `/testimonials/fpa-parent` | `/testimonials` |
| `/testimonials/lisa-dowen` | `/testimonials` |

### cpt_layouts (12)

Theme header/footer/section parts WordPress exposed publicly. The four that matter became components.

| URL | → |
|---|---|
| `/layouts/295` | `/` |
| `/layouts/building-our-community` | `/` |
| `/layouts/building-our-community-alternative` | `/` |
| `/layouts/community-life` | `/` |
| `/layouts/footer-standard` | `/` |
| `/layouts/header-alternative` | `/` |
| `/layouts/header-fullwidth` | `/` |
| `/layouts/header-fullwidth-simple` | `/` |
| `/layouts/header-new-alternative` | `/` |
| `/layouts/header-simple` | `/` |
| `/layouts/our-video` | `/` |
| `/layouts/welcome-to-greenville-2` | `/` |

### Taxonomy & author archives (8)

Generated by WordPress for the demo posts.

| URL | → |
|---|---|
| `/author/staging_fpa` | `/` |
| `/services_group/education` | `/` |
| `/services_group/friday` | `/` |
| `/services_group/monday` | `/` |
| `/services_group/programs` | `/` |
| `/services_group/wednesday` | `/` |
| `/services_group/welcome` | `/` |
| `/testimonials_group/parent-testimonials` | `/testimonials` |

### Attachment pages (157)

WordPress created a page per upload. The nine PDF attachment pages redirect to the PDF itself (served from `/public` under its original filename); the 153 image attachment pages go to the home page. **Image *files* are not redirected** — they are served from `/public/wp-content/uploads/...` at their original paths, so existing image URLs and hotlinks keep resolving.

**PDF attachment pages → the file**

| URL | → |
|---|---|
| `/2023-2024-academic-calendar` | `/2023-2024-Academic-Calendar.pdf` |
| `/2023-2024-academic-calendar-2` | `/2023-2024-Academic-Calendar-1.pdf` |
| `/2025-2026-fpa-academic-calendar` | `/2025-2026-fpa-academic-calendar.pdf` |
| `/2025-26-calendar/fpa-calendar_2022-2023` | `/FPA-Calendar_2022-2023.pdf` |
| `/2026-2027-academic-calendar` | `/2026-2027-academic-calendar.pdf` |
| `/calendar/fpa-calendar_2021-2022-revised` | `/FPA-Calendar_2021-2022-Revised.pdf` |
| `/fpa-24-25-academic-calendar` | `/fpa-24-25-academic-calendar.pdf` |
| `/https-foundationprep-com-2024-25-calendar/24-25-academic-calendar` | `/24-25-academic-calendar.pdf` |
| `/tuition-fees-summary-26-27` | `/tuition-fees-summary-26-27.pdf` |

**Image attachment pages → `/`** (148 URLs, covered by per-slug rules and by the
`/{demo-parent}/:path*` wildcards.)

---

## Redirects that already existed on WordPress

These were live redirects on the old site, not export URLs, and are preserved:

| URL | → |
|---|---|
| `/2023-24-calendar` | `/2025-26-calendar` |
| `/2024-25-calendar` | `/2025-26-calendar` |

## Conventional aliases

| URL | → |
|---|---|
| `/sitemap.xml` | `/sitemap-index.xml` (emitted by `@astrojs/sitemap`) |

## Infrastructure paths

`/wp-json/*`, `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/feed`, `/comments/feed` and
`/{slug}/feed` all 301 to `/` — WordPress endpoints that no longer exist but still attract
crawler and bot traffic.
