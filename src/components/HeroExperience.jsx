import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { assets } from '../config/assets.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useMotionScale, useTheme } from '../theme/ThemeContext.jsx';
import { Img } from './primitives.jsx';

function Headline({ window: imageWindow, lineStyles = [], blend = false }) {
  const { t } = useSite();
  return (
    <h1 id="hero-title" className={`display hero-title${blend ? ' blend-ink' : ''}`}>
      {t.hero.lines.map((line, i) => (
        <m.span key={line} className={`hero-title__line hero-title__line--${i}`} style={{ '--i': i, ...lineStyles[i] }}>
          <span className="hero-title__mask">
            <span className="hero-title__text">{line}</span>
          </span>
          {i === 0 && imageWindow}
        </m.span>
      ))}
      <m.span className="hero-title__coda" style={{ '--i': 2, ...lineStyles[2] }}>
        <span className="hero-title__mask">
          <span className="hero-title__text">{t.hero.coda}</span>
        </span>
      </m.span>
    </h1>
  );
}

function HeroActions({ onImage = false }) {
  const { t } = useSite();
  return (
    <div className="hero__foot">
      <a className={`btn ${onImage ? 'btn--on-image' : 'btn--primary'}`} href="#venue">
        {t.hero.cta}
        <ArrowDownRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </a>
      <a className="scroll-cue" href="#venue" aria-label={t.a11y.scroll}>
        <span className="scroll-cue__track" aria-hidden="true">
          <span className="scroll-cue__dot" />
        </span>
      </a>
    </div>
  );
}

function Meta() {
  const { t } = useSite();
  return (
    <ul className="hero__meta">
      {t.hero.meta.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Full-bleed photograph with slow scroll parallax. */
function ParallaxImage({ targetRef, sizes = '100vw', className = '' }) {
  const scale = useMotionScale();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${16 * scale}%`]);
  return (
    <div className={`hero-media ${className}`}>
      <m.div className="hero-media__inner" style={{ y }}>
        <Img asset={assets.hero} priority sizes={sizes} />
      </m.div>
    </div>
  );
}

function ImmersiveHero() {
  const ref = useRef(null);
  const { t } = useSite();
  return (
    <section ref={ref} className="hero hero--immersive on-image" aria-labelledby="hero-title">
      <ParallaxImage targetRef={ref} />
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__frame">
        <p className="hero__caption">{t.hero.caption}</p>
        <Meta />
        <Headline />
        <HeroActions onImage />
      </div>
    </section>
  );
}

function SplitHero() {
  const ref = useRef(null);
  const { t } = useSite();
  return (
    <section ref={ref} className="hero hero--split" aria-labelledby="hero-title">
      <ParallaxImage targetRef={ref} className="hero-split__media" sizes="(min-width: 900px) 52vw, 100vw" />
      <p className="vertical-label" aria-hidden="true">{t.hero.vertical}</p>
      <div className="hero__frame">
        <p className="hero__caption">{t.hero.caption}</p>
        <Headline blend />
        <HeroActions />
      </div>
    </section>
  );
}

function TypographyHero() {
  const { t } = useSite();
  const imageWindow = (
    <span className="hero-window" aria-hidden="true">
      <Img asset={assets.hero} priority sizes="(min-width: 900px) 30vw, 40vw" maxWidth={1080} />
    </span>
  );
  return (
    <section className="hero hero--type" aria-labelledby="hero-title">
      <div className="hero__frame">
        <Meta />
        <Headline window={imageWindow} />
        <p className="hero__caption">{t.hero.caption}</p>
        <HeroActions />
      </div>
    </section>
  );
}

/** Alternate layout: the photograph opens from a framed window to full bleed as the visitor scrolls. */
function ExperimentalHero() {
  const ref = useRef(null);
  const { t } = useSite();
  const scale = useMotionScale();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const clipPath = useTransform(p, [0, 0.6], ['inset(16% 26% 16% 26%)', 'inset(0% 0% 0% 0%)']);
  const imageScale = useTransform(p, [0, 1], [1.18, 1]);
  const scrim = useTransform(p, [0.3, 0.9], [0, 0.55]);
  const leftX = useTransform(p, [0, 0.7], ['0vw', '-14vw']);
  const rightX = useTransform(p, [0, 0.7], ['0vw', '14vw']);
  const codaOpacity = useTransform(p, [0.45, 0.75], [0, 1]);
  const footOpacity = useTransform(p, [0.55, 0.85], [0, 1]);

  const animated = scale > 0;
  const lineStyles = animated ? [{ x: leftX }, { x: rightX }, { opacity: codaOpacity }] : [];

  return (
    <section ref={ref} className={`hero hero--exp${animated ? ' is-animated' : ''}`} aria-labelledby="hero-title">
      <div className="hero-exp__sticky">
        <m.div className="hero-exp__media" style={animated ? { clipPath } : undefined}>
          <m.div className="hero-media__inner" style={animated ? { scale: imageScale } : undefined}>
            <Img asset={assets.hero} priority sizes="100vw" />
          </m.div>
          <m.div className="hero__scrim" style={animated ? { opacity: scrim } : { opacity: 0.55 }} aria-hidden="true" />
        </m.div>

        <p className="hero-exp__corner hero-exp__corner--tl">{t.hero.meta[2]}</p>
        <p className="hero-exp__corner hero-exp__corner--tr">{t.hero.meta[0]}</p>
        <p className="hero-exp__corner hero-exp__corner--bl">{t.hero.meta[1]}</p>
        <p className="vertical-label" aria-hidden="true">{t.hero.vertical}</p>

        <Headline blend lineStyles={lineStyles} />

        <m.div className="hero-exp__foot on-image" style={animated ? { opacity: footOpacity } : undefined}>
          <p className="hero__caption">{t.hero.caption}</p>
          <HeroActions onImage />
        </m.div>
      </div>
    </section>
  );
}

const LAYOUTS = {
  immersive: ImmersiveHero,
  split: SplitHero,
  typography: TypographyHero,
  experimental: ExperimentalHero,
};

export function HeroExperience() {
  const { theme } = useTheme();
  const Layout = LAYOUTS[theme.layout.hero] ?? ImmersiveHero;
  return (
    <div id="top" className="hero-shell">
      <Layout key={theme.layout.hero} />
    </div>
  );
}
