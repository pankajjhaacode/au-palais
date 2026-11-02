import { assets } from '../config/assets.config.js';
import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { ConceptTag, Eyebrow, Img, MaskReveal, Reveal } from './primitives.jsx';

/** Section 3 — the venue's spaces, shown only once confirmed. */
export function ExperienceCards() {
  const { t, showUnverified } = useSite();
  const { showDemoChrome } = useTheme();

  const items = Object.entries(venue.spaces).filter(([, cfg]) => cfg.verified || showUnverified);
  if (items.length === 0) return null;

  return (
    <section id="spaces" className="section experiences" aria-labelledby="experiences-title">
      <div className="container">
        <header className="experiences__head">
          <Eyebrow index="02">{t.spaces.eyebrow}</Eyebrow>
          <Reveal as="h2" id="experiences-title" className="display experiences__title">
            {t.spaces.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="lead experiences__intro">
            {t.spaces.intro}
          </Reveal>
        </header>

        <ol className="experiences__list">
          {items.map(([key, cfg], i) => (
            <li key={key} className={`exp exp--${i % 5}`}>
              <figure className="exp__figure frame">
                <MaskReveal from={i % 2 ? 'right' : 'left'}>
                  <Img asset={assets.spaces[key]} />
                </MaskReveal>
              </figure>
              <Reveal className="exp__text" delay={0.15}>
                <span className="exp__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="exp__title">{t.spaces.items[key].title}</h3>
                <p className="body-copy">{t.spaces.items[key].text}</p>
                {showDemoChrome && !cfg.verified && <ConceptTag>Concept · confirm with venue</ConceptTag>}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
