import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSite } from '../app/SiteContext.jsx';
import { Link, Logo } from './primitives.jsx';

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
  const { t } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="nav__inner">
        <Link className="nav__brand" to="home">
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {t.nav.links.map((link) => (
            <Link key={link.page} to={link.page}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav__tools">
          <LanguageSwitch className="nav__lang" />
          <Link className="btn btn--nav" to="contact">
            {t.nav.cta}
          </Link>
          <button type="button" className="icon-btn nav__menu-btn" onClick={openMenu} aria-label={t.a11y.menu}>
            <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog ref={menuRef} className="menu" aria-label={t.a11y.menu}>
        <div className="menu__top">
          <span className="nav__brand"><Logo /></span>
          <button type="button" className="icon-btn" onClick={closeMenu} aria-label={t.a11y.close}>
            <X size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <nav className="menu__links" aria-label="Mobile">
          {t.nav.links.map((link, i) => (
            <Link key={link.page} to={link.page} onClick={closeMenu} style={{ '--i': i }}>
              <span className="menu__num">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="menu__bottom">
          <Link className="btn btn--primary" to="contact" onClick={closeMenu}>
            {t.nav.cta}
          </Link>
          <LanguageSwitch />
        </div>
      </dialog>
    </header>
  );
}
