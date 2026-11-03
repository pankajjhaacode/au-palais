import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LOCALES, PAGE_KEYS, pagePath } from './src/app/routes.js';
import { headHtml, noscriptHtml, seoData, sitemapXml } from './src/app/seo.js';

// SITE_URL sets the public address. On Vercel it falls back to the project's production domain.
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5173')
).replace(/\/+$/, '');

function fillTemplate(template, locale, page) {
  const data = seoData(locale, page, SITE_URL);
  return template
    .replace('<html lang="en">', `<html lang="${locale}">`)
    .replace('<!--seo-head-->', headHtml(data))
    .replace('<!--seo-noscript-->', noscriptHtml(data));
}

/** Writes one HTML file per page and locale, plus 404.html, sitemap.xml and robots.txt. */
function staticPages() {
  let outDir = 'dist';
  return {
    name: 'static-pages',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => (ctx.server ? fillTemplate(html, 'en', 'home') : html),
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf8');
      const write = (path, content) => {
        const file = join(outDir, path);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, content);
      };
      for (const locale of LOCALES) {
        for (const page of PAGE_KEYS) {
          write(join(pagePath(locale, page), 'index.html'), fillTemplate(template, locale, page));
        }
      }
      write('404.html', fillTemplate(template, 'en', 'notFound'));
      write('sitemap.xml', sitemapXml(SITE_URL));
      write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
    },
  };
}

export default defineConfig({
  plugins: [react(), staticPages()],
  define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(SITE_URL) },
  build: { target: 'es2020' },
});
