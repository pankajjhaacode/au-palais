import { assets } from '../config/assets.config.js';
import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { DetailsSection } from '../components/DetailsSection.jsx';
import { EditorialSection } from '../components/EditorialSection.jsx';
import { FinalInvitation } from '../components/FinalInvitation.jsx';
import { HeroExperience } from '../components/HeroExperience.jsx';
import { Eyebrow, Link, Reveal } from '../components/primitives.jsx';
import { SceneList } from '../components/SceneList.jsx';
import { VenueGallery } from '../components/VenueGallery.jsx';
import { WeddingInquiry } from '../components/WeddingInquiry.jsx';

function useSpaces() {
  const { t } = useSite();
  return Object.entries(venue.spaces)
    .filter(([, cfg]) => cfg.verified)
    .map(([key]) => ({ key, image: assets.spaces[key], ...t.spaces.items[key] }));
}

/** Builds SceneList items from matching copy and image maps. */
const toItems = (copy, images) => Object.keys(copy).map((key) => ({ key, image: images[key], ...copy[key] }));

function Home() {
  const { t } = useSite();
  const spaces = useSpaces();
  return (
    <>
      <HeroExperience content={t.hero} image={assets.heroes.home} ctaTo="venue" />
      <div id="content">
        <EditorialSection index="01" more />
        <SceneList
          index="02"
          eyebrow={t.spaces.eyebrow}
          title={t.spaces.title}
          intro={t.spaces.intro}
          items={spaces.slice(0, 3)}
          more={{ to: 'spaces', label: t.spaces.more }}
        />
        <VenueGallery index="03" limit={6} />
        <FinalInvitation />
      </div>
    </>
  );
}

function VenuePage() {
  const { t } = useSite();
  const copy = t.venuePage;
  return (
    <>
      <HeroExperience content={copy.hero} image={assets.heroes.venue} />
      <div id="content">
        <EditorialSection index="01" image={assets.venueFigure} />
        <SceneList index="02" {...copy.details} items={toItems(copy.details.items, assets.venueDetails)} />
        <FinalInvitation />
      </div>
    </>
  );
}

function SpacesPage() {
  const { t } = useSite();
  const spaces = useSpaces();
  return (
    <>
      <HeroExperience content={t.spacesPage.hero} image={assets.heroes.spaces} />
      <div id="content">
        <SceneList index="01" eyebrow={t.spaces.eyebrow} title={t.spaces.title} intro={t.spaces.intro} items={spaces} />
        <FinalInvitation />
      </div>
    </>
  );
}

function DayPage() {
  const { t } = useSite();
  const copy = t.dayPage;
  return (
    <>
      <HeroExperience content={copy.hero} image={assets.heroes.day} />
      <div id="content">
        <SceneList index="01" {...copy.steps} items={toItems(copy.steps.items, assets.day)} />
        <FinalInvitation />
      </div>
    </>
  );
}

function GalleryPage() {
  const { t } = useSite();
  return (
    <>
      <HeroExperience content={t.galleryPage.hero} image={assets.heroes.gallery} />
      <div id="content">
        <VenueGallery index="01" title={t.galleryPage.title} />
        <FinalInvitation />
      </div>
    </>
  );
}

function FaqList({ items }) {
  return items.map((item) => (
    <details key={item.q} className="faq">
      <summary>{item.q}</summary>
      <p className="body-copy">{item.a}</p>
    </details>
  ));
}

function FaqPage() {
  const { t } = useSite();
  const copy = t.faqPage;
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <h1 className="display legal__title">{copy.heading}</h1>
        <p className="lead">{copy.intro}</p>
        <div className="faq-list"><FaqList items={copy.items} /></div>
        <Link className="btn btn--primary" to="contact">{copy.cta}</Link>
      </div>
    </section>
  );
}

function ContactPage() {
  const { t } = useSite();
  const copy = t.contactPage;
  return (
    <>
      <HeroExperience content={copy.hero} image={assets.heroes.contact} />
      <div id="content">
        <section className="section" aria-labelledby="enquiry-title">
          <div className="container contact__grid">
            <aside className="contact__aside">
              <Eyebrow>{copy.faqTitle}</Eyebrow>
              <FaqList items={t.faqPage.items.slice(0, 3)} />
              <Link className="link page-more" to="faq">{copy.faqMore}</Link>
            </aside>
            <WeddingInquiry />
          </div>
        </section>
        <DetailsSection />
      </div>
    </>
  );
}

function TextPage({ name }) {
  const { t } = useSite();
  const copy = t[name];
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <h1 className="display legal__title">{copy.heading}</h1>
        {copy.sections.map((section) => (
          <div key={section.h} className="legal__block">
            <h2 className="legal__h">{section.h}</h2>
            {section.p.map((line) => (
              <p key={line} className="body-copy">{line}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function NotFoundPage() {
  const { t } = useSite();
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <Reveal as="h1" className="display legal__title">{t.notFoundPage.heading}</Reveal>
        <p className="lead">{t.notFoundPage.body}</p>
        <Link className="btn btn--primary" to="home">{t.notFoundPage.cta}</Link>
      </div>
    </section>
  );
}

export const PAGES = {
  home: Home,
  venue: VenuePage,
  spaces: SpacesPage,
  day: DayPage,
  gallery: GalleryPage,
  contact: ContactPage,
  faq: FaqPage,
  legal: () => <TextPage name="legalPage" />,
  privacy: () => <TextPage name="privacyPage" />,
  terms: () => <TextPage name="termsPage" />,
  cookies: () => <TextPage name="cookiesPage" />,
  accessibility: () => <TextPage name="accessibilityPage" />,
  notFound: NotFoundPage,
};
