import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, PAGE_KEYS } from './routes.js';
import { headHtml, seoData, sitemapXml } from './seo.js';

const SITE = 'https://example.test';

test('every page has unique, reasonably sized title and description', () => {
  for (const locale of LOCALES) {
    const seen = new Set();
    for (const page of PAGE_KEYS) {
      const { title, description } = seoData(locale, page, SITE);
      assert.ok(title.length <= 70, `${locale}/${page} title: ${title.length}`);
      assert.ok(description.length >= 20 && description.length <= 170, `${locale}/${page} description: ${description.length}`);
      assert.ok(!seen.has(title), `${locale}/${page} duplicate title`);
      seen.add(title);
    }
  }
});

test('head has canonical, hreflang and structured data', () => {
  const html = headHtml(seoData('fr', 'gallery', SITE));
  assert.match(html, /rel="canonical" href="https:\/\/example\.test\/fr\/gallery"/);
  assert.match(html, /hreflang="en" href="https:\/\/example\.test\/gallery"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/example\.test\/gallery"/);
  assert.match(html, /BreadcrumbList/);
  assert.match(headHtml(seoData('en', 'home', SITE)), /EventVenue/);
});

test('the not-found page is not indexable and not in the sitemap', () => {
  const html = headHtml(seoData('en', 'notFound', SITE));
  assert.match(html, /content="noindex"/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.equal((sitemapXml(SITE).match(/<loc>/g) ?? []).length, LOCALES.length * PAGE_KEYS.length);
  assert.doesNotMatch(sitemapXml(SITE), /notFound/);
});
