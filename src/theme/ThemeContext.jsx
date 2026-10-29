import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultThemeId, productionThemeId, typographyOptions } from '../config/themes.config.js';
import { clonePreset, decodeTheme, sanitizeTheme } from './themeUtils.js';
import { themeStorage } from './themeStorage.js';

const SPACING = {
  compact: 'clamp(4rem, 8vw, 6.5rem)',
  editorial: 'clamp(6rem, 12vw, 10rem)',
  expansive: 'clamp(7.5rem, 17vw, 15rem)',
};
const RADIUS = { sharp: '0px', subtle: '4px', rounded: '20px' };
const DISPLAY_SCALE = { editorial: 1, contemporary: 0.94, fashion: 0.9, architectural: 0.74 };

/** Theme → CSS custom properties applied to <html>. */
export function themeToVars(theme) {
  const c = theme.colors;
  const type = typographyOptions[theme.typography];
  return {
    '--color-bg': c.background,
    '--color-surface': c.surface,
    '--color-text': c.text,
    '--color-muted': c.muted,
    '--color-accent': c.accent,
    '--color-button-bg': c.buttonBackground,
    '--color-button-text': c.buttonText,
    '--color-border': c.border,
    '--font-display': type.display,
    '--font-body': type.body,
    '--display-weight': String(type.displayWeight),
    '--display-case': type.displayCase,
    '--display-tracking': type.displayTracking,
    '--display-leading': String(type.displayLeading),
    '--display-scale': String(DISPLAY_SCALE[theme.typography]),
    '--radius': RADIUS[theme.layout.radius],
    '--radius-control': theme.layout.radius === 'rounded' ? '999px' : RADIUS[theme.layout.radius],
    '--section-spacing': SPACING[theme.layout.spacing],
  };
}

export function themeToAttrs(theme) {
  return {
    'data-radius': theme.layout.radius,
    'data-image': theme.layout.imageTreatment,
    'data-motion': theme.motion,
    'data-header': theme.layout.header,
    'data-spacing': theme.layout.spacing,
  };
}


function applyToDocument(theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(themeToVars(theme))) root.style.setProperty(key, value);
  for (const [key, value] of Object.entries(themeToAttrs(theme))) root.setAttribute(key, value);
}

const ThemeContext = createContext(null);

function restoreTheme(demo) {
  const fallback = clonePreset(demo ? defaultThemeId : productionThemeId);
  if (!demo) return fallback;
  // Share link first, then the last session.
  const match = window.location.hash.match(/theme=([\w-]+)/);
  const restored = (match && decodeTheme(match[1])) ?? themeStorage.loadCurrent();
  return restored ? sanitizeTheme(restored, fallback) : fallback;
}

export function ThemeProvider({ demo, children }) {
  const fallback = useMemo(() => clonePreset(demo ? defaultThemeId : productionThemeId), [demo]);
  const [theme, setThemeState] = useState(() => restoreTheme(demo));
  const [studioOpen, setStudioOpen] = useState(false);
  const [customerPreview, setCustomerPreview] = useState(false);
  const transitionTimer = useRef();

  useEffect(() => {
    applyToDocument(theme);
    if (demo) themeStorage.saveCurrent(theme);
  }, [theme, demo]);

  const setTheme = useCallback((next) => {
    // Briefly enable colour transitions so palette switches feel continuous without
    // paying for transitions on every interaction.
    const root = document.documentElement;
    root.classList.add('theme-transition');
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => root.classList.remove('theme-transition'), 700);
    setThemeState((prev) => sanitizeTheme(typeof next === 'function' ? next(prev) : next, fallback));
  }, [fallback]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      reset: () => setTheme(clonePreset(defaultThemeId)),
      demo,
      showDemoChrome: demo && !customerPreview,
      studioOpen,
      setStudioOpen,
      customerPreview,
      setCustomerPreview,
    }),
    [theme, setTheme, demo, studioOpen, customerPreview],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Motion distance multiplier from the theme's motion intensity. */
export function useMotionScale() {
  const { theme } = useTheme();
  return { subtle: 0.45, expressive: 1, reduced: 0 }[theme.motion];
}
