import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useMotionScale } from '../app/motion.js';
import { useSite } from '../app/SiteContext.jsx';
import { Img, Link } from './primitives.jsx';

/** `decorative` renders a hidden visual copy for the layered effect; the <h1> stays the only heading. */
function Headline({ hero, lineStyles = [], decorative = false }) {
  const Tag = decorative ? 'div' : 'h1';
  return (
    <Tag {...(decorative ? { 'aria-hidden': true } : { id: 'hero-title' })} className="display hero-title">
      {hero.lines.map((line, i) => (
        <m.span key={line} className={`hero-title__line hero-title__line--${i}`} style={{ '--i': i, ...lineStyles[i] }}>
          <span className="hero-title__mask">
            <span className="hero-title__text">{line}</span>
          </span>
        </m.span>
      ))}
      <m.span className="hero-title__coda" style={{ '--i': 2, ...lineStyles[2] }}>
        <span className="hero-title__mask">
          <span className="hero-title__text">{hero.coda}</span>
        </span>
      </m.span>
    </Tag>
  );
}

function HeroActions({ hero, ctaTo }) {
  const { t } = useSite();
  const label = (
    <>
      {hero.cta}
      <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
    </>
  );
  return (
    <div className="hero__foot">
      {ctaTo ? (
        <Link className="btn btn--on-image" to={ctaTo}>{label}</Link>
      ) : (
        <a className="btn btn--on-image" href="#content">{label}</a>
      )}
      <a className="scroll-cue" href="#content" aria-label={t.a11y.scroll}>
        <span className="scroll-cue__track" aria-hidden="true">
          <span className="scroll-cue__dot" />
        </span>
      </a>
    </div>
  );
}

/** The photograph opens from a framed window to full bleed as the visitor scrolls. */
export function HeroExperience({ content: hero, image, ctaTo }) {
  const ref = useRef(null);
  const scale = useMotionScale();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const clipPath = useTransform(p, [0, 0.6], ['inset(16% 26% 16% 26% round 28px)', 'inset(0% 0% 0% 0% round 0px)']);
  const imageScale = useTransform(p, [0, 1], [1 + 0.18 * scale, 1]);
  const scrim = useTransform(p, [0, 0.9], [0.3, 0.6]);
  const labelOpacity = useTransform(p, [0.2, 0.4], [1, 0]);
  const leftX = useTransform(p, [0, 0.7], ['0vw', `${-14 * scale}vw`]);
  const rightX = useTransform(p, [0, 0.7], ['0vw', `${14 * scale}vw`]);
  const codaOpacity = useTransform(p, [0.45, 0.75], [0, 1]);
  const footOpacity = useTransform(p, [0.55, 0.85], [0, 1]);

  const animated = scale > 0;
  const lineStyles = animated ? [{ x: leftX }, { x: rightX }, { opacity: codaOpacity }] : [];

  return (
    <div id="top" className="hero-shell">
      <section ref={ref} className={`hero hero--exp${animated ? ' is-animated' : ''}`} aria-labelledby="hero-title">
        <div className="hero-exp__sticky">
          <Headline hero={hero} lineStyles={lineStyles} />

          <m.div className="hero-exp__media" style={animated ? { clipPath } : undefined}>
            <m.div className="hero-media__inner" style={animated ? { scale: imageScale } : undefined}>
              <Img asset={image} priority />
            </m.div>
            <m.div className="hero__scrim" style={animated ? { opacity: scrim } : { opacity: 0.6 }} aria-hidden="true" />
            {/* Same headline in white, clipped with the photo: ink outside the window, white inside it. */}
            <Headline hero={hero} lineStyles={lineStyles} decorative />
          </m.div>

          {/* These sit on the bare page, so they fade out before the photo reaches them. */}
          {animated && (
            <m.div className="hero-exp__labels" style={{ opacity: labelOpacity }}>
              <p className="hero-exp__corner hero-exp__corner--tl">{hero.meta[2]}</p>
              <p className="hero-exp__corner hero-exp__corner--tr">{hero.meta[0]}</p>
              <p className="hero-exp__corner hero-exp__corner--bl">{hero.meta[1]}</p>
              <p className="vertical-label" aria-hidden="true">{hero.vertical}</p>
            </m.div>
          )}

          <m.div className="hero-exp__foot on-image" style={animated ? { opacity: footOpacity } : undefined}>
            <p className="hero__caption">{hero.caption}</p>
            <HeroActions hero={hero} ctaTo={ctaTo} />
          </m.div>
        </div>
      </section>
    </div>
  );
}
