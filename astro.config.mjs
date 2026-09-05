// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },

  // Canonical + OG URLs and the sitemap all derive from this, so it must match
  // wherever the site is actually reachable. DNS cutover completed 2026-09-05:
  // foundationprep.com now serves this build from Vercel, so this is the
  // production domain again (public/robots.txt's `Sitemap:` line matches).
  site: 'https://foundationprep.com',

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
