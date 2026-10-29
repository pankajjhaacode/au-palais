import { ArrowUpRight } from 'lucide-react';
import { isKnown, venue } from '../config/venue.config.js';
import { localize, useSite } from '../app/SiteContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { Eyebrow, Reveal } from './primitives.jsx';

function formatValue(value, locale) {
  const v = localize(value, locale);
  if (typeof v === 'number') return new Intl.NumberFormat(locale).format(v);
  if (Array.isArray(v)) return v.map((item) => localize(item, locale)).join(' · ');
  return v;
}

/** Section 5 — verified practical facts. Unknown facts are never invented. */
export function DetailsSection() {
  const { t, locale } = useSite();
  const { showDemoChrome } = useTheme();
  const { facts, contact, site } = venue;

  // Public: only confirmed facts. Demo: unconfirmed facts are listed as a checklist for the owner.
  const rows = Object.keys(t.details.labels)
    .filter((key) => isKnown(facts[key]) || showDemoChrome)
    .map((key) => ({ key, known: isKnown(facts[key]), value: formatValue(facts[key], locale) }));

  const contactRows = [
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
  ].filter(Boolean);

  return (
    <section id="approach" className="section details inverse" aria-labelledby="details-title">
      <div className="container details__grid">
        <header className="details__head">
          <Eyebrow index="04">{t.details.eyebrow}</Eyebrow>
          <Reveal as="h2" id="details-title" className="display details__title">
            {t.details.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="body-copy details__intro">
            {t.details.intro}
          </Reveal>
        </header>

        <div className="details__body">
          {rows.length > 0 ? (
            <dl className="facts">
              {rows.map((row, i) => (
                <Reveal key={row.key} className={`fact${row.known ? '' : ' fact--pending'}`} delay={(i % 2) * 0.06}>
                  <dt className="micro">{t.details.labels[row.key]}</dt>
                  <dd>{row.known ? row.value : t.details.toConfirm}</dd>
                </Reveal>
              ))}
            </dl>
          ) : (
            <p className="body-copy">{t.details.empty}</p>
          )}

          <div className="details__contact">
            <p className="micro">{t.details.contact}</p>
            <ul>
              {contactRows.map((row) => (
                <li key={row.href}>
                  <a className="link" href={row.href}>
                    {row.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="link" href={site.mapsReference} target="_blank" rel="noopener noreferrer">
                  {venue.identity.city} — Google Maps
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
