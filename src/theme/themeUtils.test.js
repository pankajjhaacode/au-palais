import { test } from 'node:test';
import assert from 'node:assert/strict';
import { themePresets } from '../config/themes.config.js';
import { contrastRatio, contrastReport, decodeTheme, encodeTheme, randomTheme, sanitizeTheme } from './themeUtils.js';

const fallback = themePresets.noirEditorial;

test('sanitizeTheme rejects malformed and hostile values', () => {
  const out = sanitizeTheme(
    { name: 'X', colors: { background: 'red;}body{display:none', text: '#abcdef' }, layout: { hero: 'nope' }, typography: '__proto__' },
    fallback,
  );
  assert.equal(out.colors.background, fallback.colors.background);
  assert.equal(out.colors.text, '#ABCDEF');
  assert.equal(out.layout.hero, fallback.layout.hero);
  assert.equal(out.typography, fallback.typography);
  assert.deepEqual(sanitizeTheme(null, fallback), fallback);
});

test('contrast ratio matches WCAG reference values', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#FFFFFF')), 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
});

test('every preset passes its own contrast checks', () => {
  for (const [id, preset] of Object.entries(themePresets)) {
    for (const row of contrastReport(preset.colors)) assert.ok(row.pass, `${id}: ${row.label} ${row.ratio}`);
  }
});

test('share encoding round-trips unicode names', () => {
  const theme = { ...fallback, name: 'Thème été ✦' };
  assert.deepEqual(decodeTheme(encodeTheme(theme)), theme);
  assert.equal(decodeTheme('%%%'), null);
});

test('randomTheme always produces a valid theme', () => {
  for (let i = 0; i < 50; i++) {
    const t = randomTheme();
    assert.deepEqual(sanitizeTheme(t, fallback), t);
  }
});
