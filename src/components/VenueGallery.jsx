import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { assets } from '../config/assets.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useMotionScale } from '../theme/ThemeContext.jsx';
import { EASE, Eyebrow, Img, Reveal } from './primitives.jsx';

const images = assets.gallery;
const SWIPE_THRESHOLD = 50;
const CLOSE_MS = 280;

function Lightbox({ index, onIndex, onClose }) {
  const { t, locale } = useSite();
  const scale = useMotionScale();
  const dialogRef = useRef(null);
  const [direction, setDirection] = useState(0);
  const [closing, setClosing] = useState(false);
  const pointerStart = useRef(null);
  const asset = images[index];

  const go = useCallback(
    (step) => {
      setDirection(step);
      onIndex((index + step + images.length) % images.length);
    },
    [index, onIndex],
  );

  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      onClose();
    }, CLOSE_MS);
  }, [onClose]);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  return (
    <dialog
      ref={dialogRef}
      className={`lightbox${closing ? ' is-closing' : ''}`}
      aria-label={t.a11y.imageOf(index + 1, images.length)}
      onKeyDown={onKeyDown}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onPointerDown={(e) => (pointerStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (pointerStart.current === null) return;
        const dx = e.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="lightbox__stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.figure
            key={index}
            className="lightbox__figure"
            custom={direction}
            initial={{ opacity: 0, x: 60 * direction * scale }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 * direction * scale }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Img asset={asset} sizes="100vw" priority />
            <figcaption>{asset.alt[locale] ?? asset.alt.en}</figcaption>
          </m.figure>
        </AnimatePresence>
      </div>

      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite">
          {String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(images.length).padStart(2, '0')}
        </p>
        <div className="lightbox__controls">
          <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={t.a11y.previous}>
            <ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={t.a11y.next}>
            <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" onClick={requestClose} aria-label={t.a11y.close} autoFocus>
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>
  );
}

/** Section 4 — the emotional gallery. */
export function VenueGallery() {
  const { t } = useSite();
  const [open, setOpen] = useState(null);
  const triggerRefs = useRef([]);

  const close = () => {
    triggerRefs.current[open]?.focus();
    setOpen(null);
  };

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <header className="gallery__head">
          <Eyebrow index="03">{t.gallery.eyebrow}</Eyebrow>
          <Reveal as="h2" id="gallery-title" className="display gallery__title">
            {t.gallery.title}
          </Reveal>
          <p className="micro gallery__hint">{t.gallery.hint}</p>
        </header>

        <ul className="gallery__grid">
          {images.map((asset, i) => (
            <Reveal as="li" key={asset.src} className={`gallery__item gallery__item--${i}`} delay={(i % 3) * 0.08}>
              <button
                type="button"
                ref={(el) => (triggerRefs.current[i] = el)}
                className="gallery__btn frame"
                onClick={() => setOpen(i)}
              >
                <Img asset={asset} sizes="(min-width: 900px) 40vw, 90vw" maxWidth={1440} />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {open !== null && <Lightbox index={open} onIndex={setOpen} onClose={close} />}
    </section>
  );
}
