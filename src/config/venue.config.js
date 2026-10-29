/**
 * Single source of truth for brand identity and VERIFIED venue facts.
 *
 * Rule: a value is `null` until confirmed by the venue owner.
 * Null facts are hidden on the public site and shown as "to confirm" in demo mode.
 * Never fill a field with a guess.
 */
export const venue = {
  brand: {
    // Temporary creative concept name, not the venue's confirmed name.
    wordmark: 'The Art of Forever',
    shortMark: 'AoF',
    isConcept: true,
  },

  site: {
    // Used for canonical URLs, sitemap and Open Graph. Override with SITE_URL at runtime.
    url: 'https://www.example.com',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    // Google Maps reference supplied by the client; could not be resolved automatically.
    mapsReference: 'https://maps.app.goo.gl/2WEXAyZutxWTiTba6',
  },

  // Official identity — fill from the venue owner's documents.
  identity: {
    officialName: null,
    streetAddress: null,
    postalCode: null,
    city: 'Paris',
    country: 'FR',
    geo: null, // { lat: 48.8, lng: 2.3 }
  },

  contact: {
    email: null,
    phone: null,
    instagram: null,
    privacyPolicyUrl: null,
  },

  // Each fact: value is null until verified. Values may be localised { en, fr }.
  facts: {
    capacitySeated: null,
    capacityStanding: null,
    spaces: null,
    services: null,
    accessibility: null,
    location: null,
    amenities: null,
    openingSeason: null,
  },

  // Celebration formats the venue may host. Only `verified: true` entries appear publicly.
  experiences: {
    ceremony: { verified: false },
    reception: { verified: false },
    dinner: { verified: false },
    party: { verified: false },
    styling: { verified: false },
  },

  // Distinctive architectural features, e.g. [{ en: 'Double-height hall', fr: 'Salle à double hauteur' }]
  architecturalFeatures: [],
};

export const isKnown = (value) =>
  value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0);
