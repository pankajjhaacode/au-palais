import { assets } from '../config/assets.config.js';
import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { ConceptTag, Eyebrow, Img, MaskReveal, Reveal } from './primitives.jsx';

/** Section 3 — celebration formats, shown only where the venue supports them. */
export function ExperienceCards() {
  const { t, showUnverified } = useSite();
  const { showDemoChrome } = useTheme();

  const items = Object.entries(venue.experiences).filter(([, cfg]) => cfg.verified || showUnverified);
  if (items.length === 0) return null;

  return (
    <section id="experiences" className="section experiences" aria-labelledby="experiences-title">
      <div className="container">
        <header className="experiences__head">
          <Eyebrow index="02">{t.experiences.eyebrow}</Eyebrow>
          <Reveal as="h2" id="experiences-title" className="display experiences__title">
            {t.experiences.title}
          </Reveal>
          <Reveal as="p" delay={0.1} className="lead experiences__intro">
            {t.experiences.intro}
          </Reveal>
        </header>

        <ol className="experiences__list">
          {items.map(([key, cfg], i) => (
            <li key={key} className={`exp exp--${i % 5}`}>
              <figure className="exp__figure frame">
                <MaskReveal from={i % 2 ? 'right' : 'left'}>
                  <Img asset={assets.experiences[key]} sizes="(min-width: 900px) 45vw, 100vw" maxWidth={1920} />
                </MaskReveal>
              </figure>
              <Reveal className="exp__text" delay={0.15}>
                <span className="exp__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="exp__title">{t.experiences.items[key].title}</h3>
                <p className="body-copy">{t.experiences.items[key].text}</p>
                {showDemoChrome && !cfg.verified && <ConceptTag>Concept · confirm with venue</ConceptTag>}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
