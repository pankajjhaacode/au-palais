import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { assets } from '../config/assets.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useMotionScale } from '../app/motion.js';
import { Eyebrow, Img, Link, Reveal } from './primitives.jsx';

/** The closing statement and enquiry call to action. */
export function FinalInvitation() {
  const ref = useRef(null);
  const { t } = useSite();
  const scale = useMotionScale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1 - 0.18 * scale, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [`${-10 * scale}%`, '0%']);

  return (
    <section ref={ref} id="finale" className="finale on-image" aria-labelledby="finale-title">
      <div className="finale__media" aria-hidden="true">
        <m.div className="hero-media__inner" style={{ y: imageY }}>
          <Img asset={assets.closing} />
        </m.div>
        <div className="hero__scrim finale__scrim" />
      </div>
      <div className="container finale__inner">
        <Eyebrow>{t.finale.eyebrow}</Eyebrow>
        <m.h2 id="finale-title" className="display finale__title" style={{ scale: titleScale }}>
          <span>{t.finale.title[0]}</span>
          <em>{t.finale.title[1]}</em>
        </m.h2>
        <Reveal className="finale__foot">
          <p className="lead">{t.finale.body}</p>
          <Link className="btn btn--on-image btn--large" to="contact">
            {t.finale.cta}
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
