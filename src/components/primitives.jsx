import { m } from 'framer-motion';
import { venue } from '../config/venue.config.js';
import { pagePath } from '../app/routes.js';
import { useSite } from '../app/SiteContext.jsx';
import { useMotionScale } from '../app/motion.js';

export const EASE = [0.22, 1, 0.36, 1];

/** Internal link: a real anchor, so new-tab and modified clicks keep working. */
export function Link({ to, onClick, children, ...rest }) {
  const { locale, page, navigate } = useSite();
  return (
    <a
      {...rest}
      href={pagePath(locale, to)}
      aria-current={page === to ? 'page' : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

/** The Crystal Gold logo: chandelier beside the wordmark, or the full stacked logo for larger spaces. */
export function Logo({ stacked = false }) {
  if (stacked) {
    return <img className="logo-stacked" src="/logo-stacked.png" width="560" height="346" alt={venue.brand.wordmark} />;
  }
  return (
    <span className="logo">
      <img className="logo-emblem" src="/logo-emblem.png" width="165" height="192" alt="" />
      <span className="logo__word">{venue.brand.wordmark}</span>
    </span>
  );
}

export function Img({ asset, priority = false, className = '' }) {
  const { locale } = useSite();
  return (
    <img
      className={`img ${className}`}
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={asset.alt[locale] ?? asset.alt.en}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // Lowercase so React 18 passes it through untouched.
      {...(priority ? { fetchpriority: 'high' } : {})}
      style={{ '--focal': asset.focal, '--focal-m': asset.focalMobile }}
    />
  );
}

/** Fades content in once when it enters the viewport. */
export function Reveal({ as = 'div', delay = 0, distance = 28, className, children, ...rest }) {
  const scale = useMotionScale();
  const Tag = m[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: distance * scale }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Image wrapper revealed with a clipping mask, the signature transition of the site. */
export function MaskReveal({ className = '', from = 'bottom', children }) {
  const scale = useMotionScale();
  const hidden = { bottom: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' }[from];
  return (
    <m.div
      data-reveal=""
      className={`mask ${className}`}
      initial={scale ? { clipPath: hidden } : { opacity: 0 }}
      whileInView={scale ? { clipPath: 'inset(0% 0% 0% 0%)' } : { opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.4 * Math.max(scale, 0.5), ease: EASE }}
    >
      {children}
    </m.div>
  );
}

export function Eyebrow({ children, index }) {
  return (
    <p className="eyebrow">
      {index && <span className="eyebrow__index">{index}</span>}
      {children}
    </p>
  );
}

