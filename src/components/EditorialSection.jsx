import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { assets } from '../config/assets.config.js';
import { isKnown, venue } from '../config/venue.config.js';
import { localize, useSite } from '../app/SiteContext.jsx';
import { useMotionScale, useTheme } from '../theme/ThemeContext.jsx';
import { ConceptTag, Eyebrow, Img, MaskReveal, Reveal } from './primitives.jsx';

/** Section 2 — the venue as architecture. */
export function EditorialSection() {
  const ref = useRef(null);
  const { t, locale } = useSite();
  const { showDemoChrome } = useTheme();
  const scale = useMotionScale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  // The oversized heading settles into place as the section arrives.
  const headingScale = useTransform(scrollYProgress, [0, 1], [1 + 0.14 * scale, 1]);
  const headingX = useTransform(scrollYProgress, [0, 1], [`${-6 * scale}vw`, '0vw']);
  const features = venue.architecturalFeatures;

  return (
    <section ref={ref} id="venue" className="section venue" aria-labelledby="venue-title">
      <div className="container venue__grid">
        <Eyebrow index="01">{t.venue.eyebrow}</Eyebrow>

        <m.h2 id="venue-title" className="display venue__title" style={{ scale: headingScale, x: headingX }}>
          <span>{t.venue.title[0]}</span>
          <span className="venue__title-indent">{t.venue.title[1]}</span>
        </m.h2>

        <figure className="venue__figure">
          <MaskReveal className="frame">
            <Img asset={assets.venue} sizes="(min-width: 900px) 62vw, 100vw" />
          </MaskReveal>
          {showDemoChrome && assets.venue.placeholder && (
            <figcaption className="venue__note">
              <ConceptTag>Placeholder — replace with the venue’s own photography</ConceptTag>
            </figcaption>
          )}
        </figure>

        <div className="venue__copy">
          <Reveal as="p" className="lead">{t.venue.lead}</Reveal>
          <Reveal as="p" delay={0.1} className="body-copy">{t.venue.body}</Reveal>
          {isKnown(features) && (
            <Reveal delay={0.2} className="venue__features">
              <h3 className="micro">{t.venue.featuresTitle}</h3>
              <ul>
                {features.map((f) => (
                  <li key={localize(f, 'en')}>{localize(f, locale)}</li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
