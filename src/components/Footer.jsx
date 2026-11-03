import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { Link, Logo } from './primitives.jsx';

export function Footer() {
  const { t, paths, locale } = useSite();
  const { brand, contact, identity } = venue;
  const address = [identity.officialName, identity.streetAddress, [identity.postalCode, identity.city].filter(Boolean).join(' ')]
    .filter(Boolean);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline lead">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.explore}>
          <p className="micro footer__heading">{t.footer.explore}</p>
          <ul className="footer__list">
            {t.nav.links.map((link) => (
              <li key={link.page}>
                <Link className="link" to={link.page}>{link.label}</Link>
              </li>
            ))}
            <li><Link className="link" to="faq">{t.footer.faq}</Link></li>
            <li><Link className="link" to="contact">{t.footer.contact}</Link></li>
          </ul>
        </nav>

        <nav aria-label={t.footer.legalHeading}>
          <p className="micro footer__heading">{t.footer.legalHeading}</p>
          <ul className="footer__list">
            <li><Link className="link" to="legal">{t.footer.legal}</Link></li>
            <li><Link className="link" to="privacy">{t.footer.privacy}</Link></li>
            <li><Link className="link" to="terms">{t.footer.terms}</Link></li>
            <li><Link className="link" to="cookies">{t.footer.cookies}</Link></li>
            <li><Link className="link" to="accessibility">{t.footer.accessibility}</Link></li>
          </ul>
        </nav>

        <div>
          <p className="micro footer__heading">{t.footer.contact}</p>
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
          <ul className="footer__list footer__lang">
            {['en', 'fr'].map((code) => (
              <li key={code}>
                <a className="link" href={paths[code]} hrefLang={code} lang={code} aria-current={code === locale ? 'true' : undefined}>
                  {code === 'en' ? 'English' : 'Français'}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__fine micro">
          <p>© {brand.wordmark}. {t.footer.rights}</p>
          <p>{t.footer.photoCredit}</p>
        </div>
      </div>

      <p className="footer__mark display" aria-hidden="true">{brand.wordmark}</p>
    </footer>
  );
}
