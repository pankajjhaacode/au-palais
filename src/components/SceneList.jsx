import { Eyebrow, Img, Link, MaskReveal, Reveal } from './primitives.jsx';

/** Alternating image-and-text rows. Items: { key, image, title, text }. */
export function SceneList({ index, eyebrow, title, intro, items, more }) {
  return (
    <section className="section experiences" aria-label={title}>
      <div className="container">
        <header className="experiences__head">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <Reveal as="h2" className="display experiences__title">{title}</Reveal>
          <Reveal as="p" delay={0.1} className="lead experiences__intro">{intro}</Reveal>
        </header>

        <ol className="experiences__list">
          {items.map((item, i) => (
            <li key={item.key} className={`exp exp--${i % 5}`}>
              <figure className="exp__figure frame">
                <MaskReveal from={i % 2 ? 'right' : 'left'}>
                  <Img asset={item.image} />
                </MaskReveal>
              </figure>
              <Reveal className="exp__text" delay={0.15}>
                <span className="exp__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="exp__title">{item.title}</h3>
                <p className="body-copy">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {more && <Link className="link page-more" to={more.to}>{more.label}</Link>}
      </div>
    </section>
  );
}
