import { useEffect, useRef, useState } from 'react';
import { Menu, Palette, X } from 'lucide-react';
import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';

const IMAGE_HEROES = new Set(['immersive', 'experimental']);

function LanguageSwitch({ className = '' }) {
  const { locale, paths, t } = useSite();
  return (
    <nav className={`lang ${className}`} aria-label={t.a11y.language}>
      {['en', 'fr'].map((code, i) => (
        <span key={code}>
          {i > 0 && <span className="lang__sep" aria-hidden="true">/</span>}
          <a href={paths[code]} hrefLang={code} lang={code} aria-current={code === locale ? 'true' : undefined}>
            {code.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  );
}

export function Navigation() {
  const { t, openEnquiry } = useSite();
  const { theme, showDemoChrome, setStudioOpen } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Over an image hero the transparent header uses light "on image" ink.
  const overImage = theme.layout.header === 'transparent' && !scrolled && IMAGE_HEROES.has(theme.layout.hero);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="nav" data-scrolled={scrolled} data-over-image={overImage}>
      <div className="nav__inner">
        <a className="nav__brand" href="#top">
          {venue.brand.wordmark}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {t.nav.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <LanguageSwitch className="nav__lang" />
          {showDemoChrome && (
            <button type="button" className="icon-btn" onClick={() => setStudioOpen(true)} aria-label={t.a11y.openStudio} title={t.a11y.openStudio}>
              <Palette size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>
          )}
          <button type="button" className="btn btn--nav" onClick={openEnquiry}>
            {t.nav.cta}
          </button>
          <button type="button" className="icon-btn nav__menu-btn" onClick={openMenu} aria-label={t.a11y.menu}>
            <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog ref={menuRef} className="menu" aria-label={t.a11y.menu}>
        <div className="menu__top">
          <span className="nav__brand">{venue.brand.wordmark}</span>
          <button type="button" className="icon-btn" onClick={closeMenu} aria-label={t.a11y.close}>
            <X size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <nav className="menu__links" aria-label="Mobile">
          {t.nav.links.map((link, i) => (
            <a key={link.href} href={link.href} onClick={closeMenu} style={{ '--i': i }}>
              <span className="menu__num">0{i + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="menu__bottom">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              closeMenu();
              openEnquiry();
            }}
          >
            {t.nav.cta}
          </button>
          <LanguageSwitch />
        </div>
      </dialog>
    </header>
  );
}
