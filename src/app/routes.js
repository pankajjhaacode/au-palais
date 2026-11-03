/** Page keys and their paths. French pages use the same paths under /fr. */
const PATHS = {
  home: '/',
  venue: '/venue',
  spaces: '/spaces',
  day: '/your-day',
  gallery: '/gallery',
  faq: '/faq',
  contact: '/contact',
  legal: '/legal',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  accessibility: '/accessibility',
};

export const PAGE_KEYS = Object.keys(PATHS);
export const LOCALES = ['en', 'fr'];

export function parsePath(pathname) {
  const fr = /^\/fr(\/|$)/.test(pathname);
  const rest = (fr ? pathname.slice(3) : pathname).replace(/\/+$/, '') || '/';
  const page = PAGE_KEYS.find((key) => PATHS[key] === rest) ?? 'notFound';
  return { locale: fr ? 'fr' : 'en', page };
}

export function pagePath(locale, page) {
  const path = PATHS[page] ?? '/';
  if (locale === 'en') return path;
  return path === '/' ? '/fr' : `/fr${path}`;
}
