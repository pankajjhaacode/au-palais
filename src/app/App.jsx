import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { SiteProvider, useSite } from './SiteContext.jsx';
import { Navigation } from '../components/Navigation.jsx';
import { Footer } from '../components/Footer.jsx';
import { FloatingCta } from '../components/FloatingCta.jsx';
import { PAGES } from '../pages/Pages.jsx';

function Page() {
  const { t, page } = useSite();
  const Current = PAGES[page];
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">{t.a11y.skip}</a>
      <Navigation />
      {/* Keys must differ between these siblings, or React keeps the old page in the DOM. */}
      <main id="main" tabIndex={-1} key={`main-${page}`}>
        <Current />
      </main>
      <Footer />
      {page !== 'contact' && <FloatingCta key={`cta-${page}`} />}
    </MotionConfig>
  );
}

export function App({ locale }) {
  return (
    <SiteProvider locale={locale}>
      <LazyMotion features={domAnimation} strict>
        <Page />
      </LazyMotion>
    </SiteProvider>
  );
}
