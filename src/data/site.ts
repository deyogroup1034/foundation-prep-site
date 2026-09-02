/* ============================================================
   SITE DATA — single source of truth shared by .astro sections
   and React islands. Everything here is carried from the live
   WordPress site (captured 2026-09) unless flagged PLACEHOLDER.
   ============================================================ */

export const BIZ = {
  name: 'Foundation Preparatory Academy',
  shortName: 'FPA',
  tagline: 'Kingdom Character with Academic Excellence for Generational Impact',
  address: {
    street: '102 Yaupon St.',
    city: 'Lake Jackson',
    state: 'TX',
    zip: '77566',
  },
  /* The live footer links the address to this Google Maps short link. */
  mapUrl: 'https://goo.gl/maps/hRiEs8rYLSriXiTE6',
  phone: '(979) 401-3721',
  email: 'info@foundationprep.com',
  founded: 2014,
  grades: 'K-12',
  social: {
    facebook: 'https://www.facebook.com/FoundationPreparatoryAcademy/',
    instagram: 'https://www.instagram.com/foundationpreparatoryacademy/',
  },
} as const;

export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;

/* External destinations. The GoFundMe URL is deliberately stripped of the
   Facebook attribution/tracking parameters the WordPress menu carried
   (?pc=fb_dn_postdonate_r&rcid=…&utm_source=facebook&…&fbclid=IwAR0…). */
export const EXTERNAL = {
  classReach: 'https://foundationprep.classreach.com/Login',
  naums: 'https://naumsinc.org/',
  umsiAboutTheUm: 'https://umsi.org/about-umsi/about-the-um/',
  donate: 'https://www.gofundme.com/f/support-the-growth-of-foundation-prep-academy',
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

/* The live main nav, ported level-for-level from the WordPress
   `alternative-menu` (the home-page menu — the newer of the two the site was
   running; see docs/INVENTORY.md §5.4). Anchor targets are preserved exactly
   so the deep links keep working. */
export const NAV: NavItem[] = [
  {
    label: 'About Us',
    href: '/about-us',
    children: [
      { label: 'What is UMSI/NAUMS', href: EXTERNAL.naums, external: true },
      { label: 'Vision & Mission', href: '/vision-mission-crest-statement-of-faith' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    label: 'Programs',
    href: '#',
    children: [
      { label: 'Family Ministry', href: '/family-ministry' },
      {
        label: 'Academics',
        href: '/#homefourth',
        children: [
          {
            label: 'Primary',
            href: '/academics-primary',
            children: [
              { label: 'Kindergarten', href: '/academics-primary#kindergarten' },
              { label: 'Grade 1', href: '/academics-primary#grade1' },
              { label: 'Grade 2', href: '/academics-primary#grade2' },
            ],
          },
          {
            label: 'Elementary',
            href: '/academics-elementary',
            children: [
              { label: 'Grade 3', href: '/academics-elementary#grade3' },
              { label: 'Grade 4', href: '/academics-elementary#grade4' },
              { label: 'Grade 5', href: '/academics-elementary#grade5' },
              { label: 'Grade 6', href: '/academics-elementary#grade6' },
            ],
          },
          {
            label: 'Secondary',
            href: '/academics-secondary',
            children: [
              { label: 'English', href: '/academics-secondary#english' },
              { label: 'Math', href: '/academics-secondary#math' },
              { label: 'Social Studies', href: '/academics-secondary#socialstudies' },
              { label: 'Science', href: '/academics-secondary#science' },
              { label: 'Electives', href: '/academics-secondary#electives' },
            ],
          },
        ],
      },
      { label: 'Co-Curricular Activities', href: '/co-curricular-activities' },
      { label: 'Student Activities', href: '/student-activities' },
      { label: 'Falcon Athletics', href: '/falcon-athletics' },
      { label: 'High School Guidance Resources', href: '/high-school-guidance-resources' },
    ],
  },
  {
    label: 'Admissions',
    href: '#',
    children: [
      { label: 'Application Process', href: '/application-process' },
      { label: 'Admission Policies', href: '/admission-policies' },
      { label: 'Tuition & Fees', href: '/tuition-fees' },
    ],
  },
  {
    label: 'Support',
    href: '#',
    children: [{ label: 'Donate', href: EXTERNAL.donate, external: true }],
  },
  { label: 'Contact Us', href: '/contacts' },
];

/* Header utility menu (WordPress `current-student`). */
export const CURRENT_STUDENTS: NavItem[] = [
  { label: 'ClassReach', href: EXTERNAL.classReach, external: true },
  { label: '2025-27 Calendars', href: '/2025-26-calendar' },
];

/* Footer "Main Information" menu (WordPress `footer-menu`), verbatim. */
export const FOOTER_NAV: [string, string][] = [
  ['Home', '/'],
  ['About School', '/about-us'],
  ['Admission', '/application-process'],
  ['Testimonials', '/testimonials'],
  ['Contacts', '/contacts'],
];

/* ------------------------------------------------------------
   META — the live site runs no SEO plugin, so there were no
   descriptions or OG tags to carry (docs/INVENTORY.md §5.7).
   Titles keep the live "<Page> – Foundation Preparatory Academy"
   pattern; the home page drops the WordPress-doubled version.
   Descriptions are authored from each page's own copy.
   ------------------------------------------------------------ */
const SUFFIX = ' – Foundation Preparatory Academy';

export const META: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Foundation Preparatory Academy | University-Model® School in Lake Jackson, TX',
    description:
      'A K-12 University-Model® Christian school in Lake Jackson, Texas. Kingdom character with academic excellence for generational impact — college-preparatory classroom instruction partnered with caring parenting at home.',
  },
  'about-us': {
    title: 'About Us' + SUFFIX,
    description:
      'University-Model® Schooling blends the best of traditional private school and home school: professional classroom instruction paired with co-teacher parents, on a schedule that mirrors college.',
  },
  'vision-mission': {
    title: 'Vision & Mission' + SUFFIX,
    description:
      'The vision, mission, school crest and Statement of Faith of Foundation Preparatory Academy in Lake Jackson, Texas.',
  },
  leadership: {
    title: 'Leadership' + SUFFIX,
    description:
      'Meet the leadership of Foundation Preparatory Academy — the board and administration guiding our K-12 University-Model® Christian school in Lake Jackson, Texas.',
  },
  testimonials: {
    title: 'Testimonials' + SUFFIX,
    description:
      'What FPA families say about Foundation Preparatory Academy — in their own words.',
  },
  faq: {
    title: 'FAQ' + SUFFIX,
    description:
      'Answers to the questions families ask most about the University-Model® schedule, tuition, admissions and daily life at Foundation Preparatory Academy.',
  },
  'what-is-umsi-naums': {
    title: 'What is UMSI/NAUMS' + SUFFIX,
    description:
      'An introduction to University-Model® Schools International and the National Association of University-Model Schools, and what accreditation through them means for FPA families.',
  },
  'family-ministry': {
    title: 'Family Ministry' + SUFFIX,
    description:
      'Family Ministry at Foundation Preparatory Academy — how FPA comes alongside parents as the primary disciplers of their children.',
  },
  'academics-primary': {
    title: 'Academics: Primary' + SUFFIX,
    description:
      'Primary academics at FPA — Kindergarten through Grade 2 curriculum, on-campus days and at-home satellite classroom work.',
  },
  'academics-elementary': {
    title: 'Academics: Elementary' + SUFFIX,
    description:
      'Elementary academics at FPA — Grade 3 through Grade 6 curriculum across language arts, math, science, social studies and enrichment.',
  },
  'academics-secondary': {
    title: 'Academics: Secondary' + SUFFIX,
    description:
      'Secondary academics at FPA — Grade 7 through Grade 12 course offerings in English, math, social studies, science and electives on a college-preparatory track.',
  },
  'co-curricular-activities': {
    title: 'Co-Curricular Activities' + SUFFIX,
    description:
      'Character development and co-curricular activities that round out an FPA education beyond the classroom.',
  },
  'student-activities': {
    title: 'Student Activities' + SUFFIX,
    description:
      'Student life at Foundation Preparatory Academy — the events, service and traditions that shape the FPA student body.',
  },
  'falcon-athletics': {
    title: 'Falcon Athletics' + SUFFIX,
    description:
      'FPA Falcon Athletics — basketball, volleyball and tennis for Foundation Preparatory Academy students in Lake Jackson, Texas.',
  },
  'high-school-guidance-resources': {
    title: 'High School Guidance Resources' + SUFFIX,
    description:
      'College and career guidance resources for FPA high school students and their parents — planning, testing and the path beyond graduation.',
  },
  'application-process': {
    title: 'Application Process' + SUFFIX,
    description:
      'How to apply to Foundation Preparatory Academy — the step-by-step admissions process for new K-12 families in Lake Jackson, Texas.',
  },
  'admission-policies': {
    title: 'Admission Policies' + SUFFIX,
    description:
      'Admission policies for Foundation Preparatory Academy, including nondiscrimination, enrollment requirements and family expectations.',
  },
  'tuition-fees': {
    title: 'Tuition & Fees' + SUFFIX,
    description:
      'Tuition and fees for Foundation Preparatory Academy — download the current tuition and fees summary for the coming school year.',
  },
  calendar: {
    title: '2025-27 Calendars' + SUFFIX,
    description:
      'Download the Foundation Preparatory Academy academic calendars for the 2025-2026 and 2026-2027 school years.',
  },
  contacts: {
    title: 'Contacts' + SUFFIX,
    description:
      'Contact Foundation Preparatory Academy at 102 Yaupon St., Lake Jackson, TX 77566 — call (979) 401-3721, email info@foundationprep.com, or send us a message.',
  },
  'flexible-schedule': {
    title: 'Flexible Schedule' + SUFFIX,
    description:
      "The University-Model® flexible schedule at FPA — on-campus class days paired with at-home satellite classroom days that give families their time back.",
  },
  accreditation: {
    title: 'Accreditation' + SUFFIX,
    description:
      'Foundation Preparatory Academy accreditation through University-Model® Schools International.',
  },
  'privacy-policy': {
    title: 'Privacy Policy' + SUFFIX,
    description:
      'How Foundation Preparatory Academy collects, uses and protects personal information submitted through this website.',
  },
  404: {
    title: 'Page Not Found' + SUFFIX,
    description: 'The page you were looking for could not be found.',
  },
};
