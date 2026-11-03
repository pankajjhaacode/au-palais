/**
 * Per-page head data. The build uses it to write a real HTML file for each page,
 * so crawlers and link previews get the right tags without running JavaScript.
 * The running app uses it to keep the head correct when moving between pages.
 */
import { assets } from '../config/assets.config.js';
import { venue } from '../config/venue.config.js';
import { getContent } from '../content/homepage.content.js';
import { LOCALES, PAGE_KEYS, pagePath } from './routes.js';

const OG_LOCALE = { en: 'en_GB', fr: 'fr_FR' };

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Only confirmed facts are published as structured data. */
function venueSchema(url, siteUrl, description) {
  const { identity, contact, brand } = venue;
  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: brand.wordmark,
    url,
    description,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: identity.city,
      addressCountry: identity.country,
      ...(identity.streetAddress && { streetAddress: identity.streetAddress }),
      ...(identity.postalCode && { postalCode: identity.postalCode }),
    },
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.instagram && { sameAs: [contact.instagram] }),
  };
}

function breadcrumbSchema(homeUrl, homeName, url, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: homeUrl },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
}

export function seoData(locale, page, siteUrl) {
  const t = getContent(locale);
  const { title, description } = t.pages[page];
  const notFound = page === 'notFound';
  const url = `${siteUrl}${pagePath(locale, page)}`;
  const homeUrl = `${siteUrl}${pagePath(locale, 'home')}`;
  const name = title.split(' — ')[0];
  const alternate = (code) => `${siteUrl}${pagePath(code, page)}`;
  return {
    locale,
    title,
    description,
    url,
    notFound,
    robots: notFound ? 'noindex' : 'index, follow, max-image-preview:large',
    ogLocale: OG_LOCALE[locale],
    image: `${siteUrl}/og-image.jpg`,
    imageAlt: assets.heroes.home.alt[locale],
    alternates: LOCALES.map((code) => [code, alternate(code)]).concat([['x-default', alternate('en')]]),
    heroImage: assets.heroes[page]?.src,
    schema: page === 'home' ? venueSchema(url, siteUrl, description) : breadcrumbSchema(homeUrl, venue.brand.wordmark, url, name),
  };
}

/** Head tags for one static page. */
export function headHtml(data) {
  const e = escapeHtml;
  return [
    `<title>${e(data.title)}</title>`,
    `<meta name="description" content="${e(data.description)}" />`,
    `<meta name="robots" content="${data.robots}" />`,
    ...(data.notFound
      ? []
      : [
          `<link rel="canonical" href="${e(data.url)}" />`,
          ...data.alternates.map(([code, href]) => `<link rel="alternate" hreflang="${code}" href="${e(href)}" />`),
        ]),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${e(venue.brand.wordmark)}" />`,
    `<meta property="og:title" content="${e(data.title)}" />`,
    `<meta property="og:description" content="${e(data.description)}" />`,
    `<meta property="og:url" content="${e(data.url)}" />`,
    `<meta property="og:locale" content="${data.ogLocale}" />`,
    `<meta property="og:image" content="${e(data.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${e(data.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(data.title)}" />`,
    `<meta name="twitter:description" content="${e(data.description)}" />`,
    `<meta name="twitter:image" content="${e(data.image)}" />`,
    ...(data.heroImage ? [`<link rel="preload" as="image" href="${e(data.heroImage)}" />`] : []),
    `<script type="application/ld+json">${JSON.stringify(data.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

/** Fallback for visitors and crawlers without JavaScript. */
export function noscriptHtml(data) {
  const t = getContent(data.locale);
  const links = t.nav.links
    .map((link) => `<a href="${pagePath(data.locale, link.page)}">${escapeHtml(link.label)}</a>`)
    .join(' · ');
  return `<noscript><h1>${escapeHtml(data.title)}</h1><p>${escapeHtml(data.description)}</p><nav>${links}</nav></noscript>`;
}

/** Every indexable URL, with its language alternates. */
export function sitemapXml(siteUrl) {
  const urls = LOCALES.flatMap((locale) =>
    PAGE_KEYS.map((page) => {
      const { url, alternates } = seoData(locale, page, siteUrl);
      const links = alternates
        .map(([code, href]) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${escapeHtml(href)}" />`)
        .join('\n');
      return `  <url>\n    <loc>${escapeHtml(url)}</loc>\n${links}\n  </url>`;
    }),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

/** Keeps the head correct after in-app navigation. */
export function updateHead(locale, page, siteUrl) {
  const data = seoData(locale, page, siteUrl);
  const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value);
  document.title = data.title;
  set('meta[name="description"]', 'content', data.description);
  set('meta[name="robots"]', 'content', data.robots);
  set('meta[property="og:title"]', 'content', data.title);
  set('meta[property="og:description"]', 'content', data.description);
  set('meta[property="og:url"]', 'content', data.url);
  set('meta[name="twitter:title"]', 'content', data.title);
  set('meta[name="twitter:description"]', 'content', data.description);
  set('link[rel="canonical"]', 'href', data.url);
  for (const [code, href] of data.alternates) set(`link[hreflang="${code}"]`, 'href', href);
  const schema = document.head.querySelector('script[type="application/ld+json"]');
  if (schema) schema.textContent = JSON.stringify(data.schema);
}
