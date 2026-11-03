import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getContent } from '../content/homepage.content.js';
import { pagePath, parsePath } from './routes.js';
import { updateHead } from './seo.js';

const SiteContext = createContext(null);

export function SiteProvider({ locale, children }) {
  const [page, setPage] = useState(() => parsePath(window.location.pathname).page);
  const t = getContent(locale);

  useEffect(() => {
    const onPopState = () => setPage(parsePath(window.location.pathname).page);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    updateHead(locale, page, import.meta.env.VITE_SITE_URL);
  }, [locale, page]);

  const navigate = useCallback(
    (to) => {
      window.history.pushState(null, '', pagePath(locale, to));
      setPage(to);
      window.scrollTo({ top: 0, behavior: 'instant' });
      // <main> remounts per page, so focus it after the commit.
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      t,
      page,
      navigate,
      // Language links keep the visitor on the same page.
      paths: { en: pagePath('en', page), fr: pagePath('fr', page) },
    }),
    [locale, t, page, navigate],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

/** Resolve a config value that may be localised ({ en, fr }) or plain. */
export const localize = (value, locale) =>
  value && typeof value === 'object' && !Array.isArray(value) && ('en' in value || 'fr' in value)
    ? value[locale] ?? value.en
    : value;
