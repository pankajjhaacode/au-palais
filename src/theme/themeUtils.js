import { colorFields, layoutOptions, themePresets, typographyOptions } from '../config/themes.config.js';

const HEX = /^#[0-9a-f]{6}$/i;
const LAYOUT_KEYS = ['hero', 'radius', 'imageTreatment', 'header', 'spacing'];

export const clonePreset = (id) => structuredClone(themePresets[id] ?? Object.values(themePresets)[0]);

/**
 * Validates untrusted theme input (imports, share links, storage) against a fallback.
 * Unknown or malformed values are replaced, never passed through to CSS.
 */
export function sanitizeTheme(raw, fallback) {
  if (!raw || typeof raw !== 'object') return structuredClone(fallback);
  const pick = (value, allowed, fb) => (typeof value === 'string' && Object.hasOwn(allowed, value) ? value : fb);

  const colors = {};
  for (const key of Object.keys(colorFields)) {
    const value = raw.colors?.[key];
    colors[key] = typeof value === 'string' && HEX.test(value) ? value.toUpperCase() : fallback.colors[key];
  }

  const layout = {};
  for (const key of LAYOUT_KEYS) layout[key] = pick(raw.layout?.[key], layoutOptions[key], fallback.layout[key]);

  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 60) : fallback.name;

  return {
    name,
    colors,
    typography: pick(raw.typography, typographyOptions, fallback.typography),
    layout,
    motion: pick(raw.motion, layoutOptions.motion, fallback.motion),
  };
}

// WCAG 2.x relative luminance / contrast ratio.
function luminance(hex) {
  const channel = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Pairs worth checking, with the WCAG AA minimum for their typical text size. */
export function contrastReport(colors) {
  const pairs = [
    ['Text on background', colors.text, colors.background, 4.5],
    ['Secondary text on background', colors.muted, colors.background, 4.5],
    ['Text on surface', colors.text, colors.surface, 4.5],
    ['Button label', colors.buttonText, colors.buttonBackground, 4.5],
    ['Accent on background', colors.accent, colors.background, 3],
  ];
  return pairs.map(([label, fg, bg, min]) => {
    const ratio = contrastRatio(fg, bg);
    return { label, ratio: Math.round(ratio * 100) / 100, min, pass: ratio >= min };
  });
}

// Share links: base64url JSON in the URL hash, so nothing is sent to a server.
export function encodeTheme(theme) {
  const bytes = new TextEncoder().encode(JSON.stringify(theme));
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeTheme(encoded) {
  try {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
  } catch {
    return null;
  }
}

/**
 * "Tasteful" randomness: palettes stay intact (they are contrast-checked as a set),
 * only typography and atmosphere are remixed around them.
 */
export function randomTheme(random = Math.random) {
  const choose = (list) => list[Math.floor(random() * list.length)];
  const base = clonePreset(choose(Object.keys(themePresets)));
  const layout = {};
  for (const key of LAYOUT_KEYS) layout[key] = choose(Object.keys(layoutOptions[key]));
  return {
    ...base,
    name: `${base.name} — remix`,
    typography: choose(Object.keys(typographyOptions)),
    layout,
    motion: choose(['subtle', 'expressive']),
  };
}
