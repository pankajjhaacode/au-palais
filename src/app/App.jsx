import { lazy, Suspense, useEffect, useState } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { EyeOff, Palette } from 'lucide-react';
import { SiteProvider, useSite } from './SiteContext.jsx';
import { ThemeProvider, useTheme } from '../theme/ThemeContext.jsx';
import { Navigation } from '../components/Navigation.jsx';
import { HeroExperience } from '../components/HeroExperience.jsx';
import { EditorialSection } from '../components/EditorialSection.jsx';
import { ExperienceCards } from '../components/ExperienceCards.jsx';
import { VenueGallery } from '../components/VenueGallery.jsx';
import { DetailsSection } from '../components/DetailsSection.jsx';
import { FinalInvitation } from '../components/FinalInvitation.jsx';
import { Footer } from '../components/Footer.jsx';
import { WeddingInquiry } from '../components/WeddingInquiry.jsx';
import { FloatingCta } from '../components/FloatingCta.jsx';

// Demo-only tooling is split out of the public bundle and loaded on first open.
const ThemeStudio = lazy(() => import('../components/theme-studio/ThemeStudio.jsx'));

function DemoChrome() {
  const { demo, studioOpen, setStudioOpen, customerPreview, setCustomerPreview } = useTheme();
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (studioOpen) setRequested(true);
  }, [studioOpen]);

  if (!demo) return null;
  return (
    <>
      {requested && (
        <Suspense fallback={null}>
          <ThemeStudio />
        </Suspense>
      )}
      {!customerPreview && !studioOpen && (
        <button type="button" className="studio-fab" onClick={() => setStudioOpen(true)}>
          <Palette size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Customize</span>
        </button>
      )}
      {customerPreview && (
        <button type="button" className="preview-exit" onClick={() => setCustomerPreview(false)}>
          <EyeOff size={14} aria-hidden="true" /> Exit customer preview
        </button>
      )}
    </>
  );
}

function Page() {
  const { t } = useSite();
  const { theme } = useTheme();
  return (
    <MotionConfig reducedMotion={theme.motion === 'reduced' ? 'always' : 'user'}>
      <a className="skip-link" href="#main">{t.a11y.skip}</a>
      <Navigation />
      <main id="main">
        <HeroExperience />
        <EditorialSection />
        <ExperienceCards />
        <VenueGallery />
        <DetailsSection />
        <FinalInvitation />
      </main>
      <Footer />
      <FloatingCta />
      <WeddingInquiry />
      <DemoChrome />
    </MotionConfig>
  );
}

export function App({ locale, demo }) {
  return (
    <SiteProvider locale={locale} demo={demo}>
      <ThemeProvider demo={demo}>
        <LazyMotion features={domAnimation} strict>
          <Page />
        </LazyMotion>
      </ThemeProvider>
    </SiteProvider>
  );
}
