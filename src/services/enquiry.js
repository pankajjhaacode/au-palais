/**
 * Enquiry submission boundary.
 *
 * - Demo mode: simulated submission, nothing leaves the browser.
 * - Production: POSTs JSON to VITE_ENQUIRY_ENDPOINT (your API / CRM webhook / form backend).
 *   If no endpoint is configured, submission fails loudly instead of silently dropping leads.
 */
const ENDPOINT = import.meta.env?.VITE_ENQUIRY_ENDPOINT;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{6,20}$/;

export const emptyEnquiry = {
  names: '',
  email: '',
  phone: '',
  date: '',
  timeframe: '',
  guests: '',
  type: '',
  message: '',
  consent: false,
};

/** Returns { field: errorKey } for invalid fields. `today` is YYYY-MM-DD. */
export function validateEnquiry(values, today) {
  const errors = {};
  if (values.names.trim().length < 2) errors.names = 'names';
  if (!EMAIL.test(values.email.trim())) errors.email = 'email';
  if (values.phone.trim() && !PHONE.test(values.phone.trim())) errors.phone = 'phone';
  if (!values.date && !values.timeframe.trim()) errors.date = 'when';
  else if (values.date && values.date < today) errors.date = 'dateFuture';
  const guests = Number(values.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 2000) errors.guests = 'guests';
  if (!values.type) errors.type = 'type';
  if (!values.consent) errors.consent = 'consent';
  return errors;
}

export async function submitEnquiry(values, { demo, locale }) {
  const payload = {
    ...values,
    names: values.names.trim(),
    email: values.email.trim(),
    guests: Number(values.guests),
    message: values.message.trim().slice(0, 4000),
    locale,
    submittedAt: new Date().toISOString(),
  };

  if (demo) {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return { ok: true, simulated: true };
  }

  if (!ENDPOINT) throw new Error('Enquiry endpoint not configured (set VITE_ENQUIRY_ENDPOINT).');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Enquiry failed with status ${res.status}`);
  return { ok: true, simulated: false };
}
