/**
 * Theme system: colour presets, typography pairings and layout/atmosphere options.
 * Content lives elsewhere — changing a theme never changes copy or structure.
 *
 * `productionThemeId` is the single switch for the customer-facing site.
 */

export const typographyOptions = {
  editorial: {
    label: 'Editorial serif + neutral sans',
    display: "'Cormorant Garamond', 'Times New Roman', serif",
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    displayWeight: 500,
    displayCase: 'uppercase',
    displayTracking: '-0.02em',
    displayLeading: 0.84,
  },
  contemporary: {
    label: 'Contemporary luxury sans',
    display: "'Jost', 'Helvetica Neue', Arial, sans-serif",
    body: "'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif",
    displayWeight: 300,
    displayCase: 'uppercase',
    displayTracking: '-0.01em',
    displayLeading: 0.88,
  },
  fashion: {
    label: 'Fashion serif + minimalist grotesk',
    display: "'Bodoni Moda', Didot, 'Bodoni 72', serif",
    body: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
    displayWeight: 400,
    displayCase: 'uppercase',
    displayTracking: '-0.035em',
    displayLeading: 0.86,
  },
  architectural: {
    label: 'Modern architectural',
    display: "'Syne', 'Arial Black', sans-serif",
    body: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
    displayWeight: 700,
    displayCase: 'uppercase',
    displayTracking: '-0.045em',
    displayLeading: 0.86,
  },
};

// All fonts are SIL Open Font Licence via Google Fonts; browsers only download faces actually used.
export const FONTS_HREF =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500',
    'family=Inter:wght@300;400;500',
    'family=Jost:ital,wght@0,300;0,400;0,500;1,300',
    'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400',
    'family=Manrope:wght@300;400;500',
    'family=Syne:wght@500;700',
    'family=Space+Grotesk:wght@300;400;500',
  ].join('&') +
  '&display=swap';

export const layoutOptions = {
  hero: {
    immersive: 'Immersive full-bleed',
    split: 'Split editorial',
    typography: 'Typography-led',
    experimental: 'Experimental scroll',
  },
  radius: { sharp: 'Sharp', subtle: 'Subtle', rounded: 'Rounded' },
  imageTreatment: { natural: 'Natural colour', muted: 'Muted', monochrome: 'Monochrome' },
  motion: { subtle: 'Subtle', expressive: 'Expressive', reduced: 'Reduced' },
  header: { transparent: 'Transparent', light: 'Light', dark: 'Dark' },
  spacing: { compact: 'Compact', editorial: 'Editorial', expansive: 'Expansive' },
};

export const colorFields = {
  background: 'Primary background',
  surface: 'Surface background',
  text: 'Primary text',
  muted: 'Secondary text',
  accent: 'Accent',
  buttonBackground: 'Button background',
  buttonText: 'Button text',
  border: 'Border',
};

export const themePresets = {
  noirEditorial: {
    name: 'Noir Editorial',
    colors: {
      background: '#171717',
      surface: '#222120',
      text: '#F5F1E9',
      muted: '#B8B2A8',
      accent: '#D8C5A2',
      buttonBackground: '#F5F1E9',
      buttonText: '#171717',
      border: '#3D3934',
    },
    typography: 'editorial',
    layout: { hero: 'immersive', radius: 'sharp', imageTreatment: 'natural', header: 'transparent', spacing: 'expansive' },
    motion: 'expressive',
  },
  ivoryAtelier: {
    name: 'Ivory Atelier',
    colors: {
      background: '#F4F0E8',
      surface: '#EAE3D6',
      text: '#2B2118',
      muted: '#6B5D4F',
      accent: '#806A4B',
      buttonBackground: '#2B2118',
      buttonText: '#F4F0E8',
      border: '#D3C8B6',
    },
    typography: 'editorial',
    layout: { hero: 'split', radius: 'subtle', imageTreatment: 'natural', header: 'transparent', spacing: 'expansive' },
    motion: 'subtle',
  },
  burgundyMuse: {
    name: 'Burgundy Muse',
    colors: {
      background: '#32131F',
      surface: '#43192A',
      text: '#F7E9E4',
      muted: '#D9B3B5',
      accent: '#E5B8B8',
      buttonBackground: '#E5B8B8',
      buttonText: '#32131F',
      border: '#62293C',
    },
    typography: 'fashion',
    layout: { hero: 'typography', radius: 'sharp', imageTreatment: 'natural', header: 'transparent', spacing: 'editorial' },
    motion: 'expressive',
  },
  modernGarden: {
    name: 'Modern Garden',
    colors: {
      background: '#E9ECE3',
      surface: '#DCE1D3',
      text: '#1F2A1C',
      muted: '#4C5946',
      accent: '#52644C',
      buttonBackground: '#2F3E2B',
      buttonText: '#F2F4EE',
      border: '#BFC8B3',
    },
    typography: 'contemporary',
    layout: { hero: 'split', radius: 'rounded', imageTreatment: 'muted', header: 'light', spacing: 'editorial' },
    motion: 'subtle',
  },
  midnightCobalt: {
    name: 'Midnight Cobalt',
    colors: {
      background: '#111C36',
      surface: '#18264A',
      text: '#EEF2FB',
      muted: '#A9B4CF',
      accent: '#A9BFF9',
      buttonBackground: '#A9BFF9',
      buttonText: '#111C36',
      border: '#2C3C68',
    },
    typography: 'architectural',
    layout: { hero: 'experimental', radius: 'subtle', imageTreatment: 'muted', header: 'transparent', spacing: 'expansive' },
    motion: 'expressive',
  },
  avantGarde: {
    name: 'Avant-Garde',
    colors: {
      background: '#0E0E0E',
      surface: '#1A1918',
      text: '#F3F0EA',
      muted: '#A8A39B',
      accent: '#FF4A1C',
      buttonBackground: '#FF4A1C',
      buttonText: '#0E0E0E',
      border: '#34312E',
    },
    typography: 'architectural',
    layout: { hero: 'experimental', radius: 'sharp', imageTreatment: 'monochrome', header: 'transparent', spacing: 'expansive' },
    motion: 'expressive',
  },
};

export const defaultThemeId = 'noirEditorial';

// The theme the public, customer-facing site uses. Change this one value to switch identity.
export const productionThemeId = 'noirEditorial';
