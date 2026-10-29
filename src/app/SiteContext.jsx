import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getContent } from '../content/homepage.content.js';

const SiteContext = createContext(null);

export const localePath = (locale) => (locale === 'en' ? '/' : `/${locale}/`);

export function SiteProvider({ locale, demo, children }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const t = getContent(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [locale, t]);

  const value = useMemo(
    () => ({
      locale,
      t,
      // Concept (unverified) content is visible only in demo mode, clearly marked.
      showUnverified: demo,
      paths: { en: localePath('en'), fr: localePath('fr') },
      enquiryOpen,
      openEnquiry: () => setEnquiryOpen(true),
      closeEnquiry: () => setEnquiryOpen(false),
    }),
    [locale, t, demo, enquiryOpen],
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
