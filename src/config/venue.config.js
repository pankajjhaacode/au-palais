/**
 * Single source of truth for brand identity and VERIFIED venue facts.
 *
 * Rule: a value is `null` until confirmed by the venue owner.
 * Null facts are hidden on the site.
 * Never fill a field with a guess.
 */
export const venue = {
  brand: {
    // Client-approved site name. Legal identity lives in `legal` below.
    wordmark: 'Crystal Gold',
  },

  site: {
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
  },

  // Required by French law on /legal. Null values render as "to be completed".
  legal: {
    companyName: null,
    legalForm: null,
    siret: null,
    publicationDirector: null,
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

  // Spaces shown in the client's supplied imagery. Only `verified: true` entries appear publicly.
  spaces: {
    ceremony: { verified: true },
    staircase: { verified: true },
    ballroom: { verified: true },
    mezzanine: { verified: true },
    tables: { verified: true },
  },

  // Features visible in the client's supplied imagery.
  architecturalFeatures: [
    { en: 'Curved grand staircase', fr: 'Grand escalier courbe' },
    { en: 'Mezzanine gallery', fr: 'Mezzanine en galerie' },
    { en: 'Crystal chandeliers', fr: 'Lustres de cristal' },
    { en: 'Skylights', fr: 'Puits de lumière' },
    { en: 'Panelled and mirrored walls', fr: 'Boiseries et miroirs' },
    { en: 'Raised stage', fr: 'Scène surélevée' },
  ],
};

export const isKnown = (value) =>
  value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0);
