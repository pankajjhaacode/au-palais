import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';

export function Footer() {
  const { t, paths, locale } = useSite();
  const { brand, contact, identity } = venue;
  const address = [identity.officialName, identity.streetAddress, [identity.postalCode, identity.city].filter(Boolean).join(' ')]
    .filter(Boolean);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <p className="footer__tagline lead">{t.footer.tagline}</p>

        <nav aria-label="Footer">
          <ul className="footer__list">
            {t.nav.links.map((link) => (
              <li key={link.href}>
                <a className="link" href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <address className="footer__list">
          {address.map((line) => (
            <span key={line}>{line}</span>
          ))}
          {contact.email && <a className="link" href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.phone && <a className="link" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
          {contact.instagram && (
            <a className="link" href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          )}
        </address>

        <ul className="footer__list">
          {['en', 'fr'].map((code) => (
            <li key={code}>
              <a className="link" href={paths[code]} hrefLang={code} lang={code} aria-current={code === locale ? 'true' : undefined}>
                {code === 'en' ? 'English' : 'Français'}
              </a>
            </li>
          ))}
        </ul>

        <div className="footer__fine micro">
          <p>© {brand.wordmark}. {t.footer.rights}</p>
          {brand.isConcept && <p>{t.footer.conceptNote}</p>}
          <p>{t.footer.photoCredit}</p>
        </div>
      </div>

      <p className="footer__mark display" aria-hidden="true">{brand.wordmark}</p>
    </footer>
  );
}
