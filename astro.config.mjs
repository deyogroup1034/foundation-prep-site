// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },

  // Canonical + OG URLs and the sitemap all derive from this. It must match
  // wherever the site is CURRENTLY reachable, not the eventual domain — the
  // WordPress site still holds foundationprep.com today, so pointing `site`
  // there made canonical/og:image/sitemap resolve against a host serving a
  // completely different (and 404ing) build. At the DNS-cutover launch step,
  // flip this to 'https://foundationprep.com' and update the matching
  // `Sitemap:` line in public/robots.txt in the same commit.
  site: 'https://foundation-prep-site.vercel.app',

  // Static by default. Only the contact API route opts into on-demand
  // rendering with `export const prerender = false`.
  output: 'static',

  // The Vercel adapter emits /about-us/index.html and serves /about-us without
  // a slash; vercel.json also sets "trailingSlash": false so the WordPress
  // URLs (every one of which had a trailing slash) 308 to the clean form.
  trailingSlash: 'never',

  adapter: vercel({ webAnalytics: { enabled: true } }),

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
