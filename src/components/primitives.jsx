import { m } from 'framer-motion';
import { imageSources } from '../config/assets.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useMotionScale } from '../theme/ThemeContext.jsx';

export const EASE = [0.22, 1, 0.36, 1];

export function Img({ asset, sizes = '100vw', priority = false, maxWidth, className = '' }) {
  const { locale } = useSite();
  const { src, srcSet } = imageSources(asset, maxWidth);
  return (
    <img
      className={`img ${className}`}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
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

/** Fades content in once when it enters the viewport. Visible without JS via the <noscript> rule. */
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

export function ConceptTag({ children }) {
  return <span className="concept-tag">{children}</span>;
}
