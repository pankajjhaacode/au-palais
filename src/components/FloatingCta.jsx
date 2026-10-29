import { useEffect, useState } from 'react';
import { useSite } from '../app/SiteContext.jsx';

/** Mobile-only enquiry shortcut: visible between the hero and the final invitation. */
export function FloatingCta() {
  const { t, openEnquiry } = useSite();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = { top: true, finale: false };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) seen[entry.target.id] = entry.isIntersecting;
      setVisible(!seen.top && !seen.finale);
    });
    ['top', 'finale'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      className="floating-cta btn btn--primary"
      data-visible={visible}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={openEnquiry}
    >
      {t.floatingCta}
    </button>
  );
}
