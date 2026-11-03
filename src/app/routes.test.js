import test from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, PAGE_KEYS, pagePath, parsePath } from './routes.js';

test('parsePath resolves locale and page', () => {
  assert.deepEqual(parsePath('/'), { locale: 'en', page: 'home' });
  assert.deepEqual(parsePath('/fr'), { locale: 'fr', page: 'home' });
  assert.deepEqual(parsePath('/fr/'), { locale: 'fr', page: 'home' });
  assert.deepEqual(parsePath('/your-day/'), { locale: 'en', page: 'day' });
  assert.deepEqual(parsePath('/fr/contact'), { locale: 'fr', page: 'contact' });
  assert.deepEqual(parsePath('/france'), { locale: 'en', page: 'notFound' });
  assert.deepEqual(parsePath('/constructor'), { locale: 'en', page: 'notFound' });
});

test('pagePath round-trips through parsePath', () => {
  for (const locale of LOCALES) {
    for (const page of PAGE_KEYS) {
      assert.deepEqual(parsePath(pagePath(locale, page)), { locale, page });
    }
  }
});
