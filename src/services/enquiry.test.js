import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyEnquiry, validateEnquiry } from './enquiry.js';

const valid = {
  ...emptyEnquiry,
  names: 'Camille & Louis',
  email: 'camille@example.fr',
  date: '2027-06-12',
  guests: '120',
  type: 'reception',
  consent: true,
};

test('valid enquiry passes', () => {
  assert.deepEqual(validateEnquiry(valid, '2026-10-29'), {});
});

test('timeframe can replace the date, past dates are rejected', () => {
  assert.deepEqual(validateEnquiry({ ...valid, date: '', timeframe: 'Spring 2027' }, '2026-10-29'), {});
  assert.equal(validateEnquiry({ ...valid, date: '', timeframe: ' ' }, '2026-10-29').date, 'when');
  assert.equal(validateEnquiry({ ...valid, date: '2025-01-01' }, '2026-10-29').date, 'dateFuture');
});

test('flags each invalid field', () => {
  const errors = validateEnquiry({ ...emptyEnquiry, phone: 'abc', guests: '2.5' }, '2026-10-29');
  assert.deepEqual(Object.keys(errors).sort(), ['consent', 'date', 'email', 'guests', 'names', 'phone', 'type']);
});
