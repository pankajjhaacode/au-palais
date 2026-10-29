import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { venue } from '../config/venue.config.js';
import { useSite } from '../app/SiteContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { emptyEnquiry, submitEnquiry, validateEnquiry } from '../services/enquiry.js';

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function Field({ id, label, hint, error, optional, children }) {
  const { t } = useSite();
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> ({t.enquiry.fields.optional})</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="field__hint">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}

function EnquiryForm({ onDone }) {
  const { t, locale } = useSite();
  const { demo } = useTheme();
  const f = t.enquiry.fields;
  const [values, setValues] = useState(emptyEnquiry);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const summaryRef = useRef(null);
  const today = todayISO();

  const set = (key) => (e) => {
    const next = { ...values, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    setValues(next);
    if (submitted) setErrors(validateEnquiry(next, today));
  };

  const describe = (key, hint = false) =>
    [hint && `${key}-hint`, errors[key] && `${key}-error`].filter(Boolean).join(' ') || undefined;
  const err = (key) => errors[key] && t.enquiry.errors[errors[key]];

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validateEnquiry(values, today);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('sending');
    try {
      await submitEnquiry(values, { demo, locale });
      onDone(values.names.trim().split(/\s|&/)[0]);
    } catch (error) {
      console.warn(error);
      setStatus('error');
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form className="enquiry__form" onSubmit={onSubmit} noValidate>
      {submitted && errorCount > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="enquiry__summary" role="alert">
          <p>{t.enquiry.errors.summary(errorCount)}</p>
          <ul>
            {Object.entries(errors).map(([key, code]) => (
              <li key={key}>
                <a href={`#${key}`}>{t.enquiry.errors[code]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field id="names" label={f.names} hint={f.namesHint} error={err('names')}>
        <input id="names" name="names" autoComplete="name" value={values.names} onChange={set('names')}
          aria-invalid={!!errors.names} aria-describedby={describe('names', true)} required />
      </Field>

      <div className="field-row">
        <Field id="email" label={f.email} error={err('email')}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email}
            onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={describe('email')} required />
        </Field>
        <Field id="phone" label={f.phone} optional error={err('phone')}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')}
            aria-invalid={!!errors.phone} aria-describedby={describe('phone')} />
        </Field>
      </div>

      <div className="field-row">
        <Field id="date" label={f.date} error={err('date')}>
          <input id="date" name="date" type="date" min={today} lang={locale} value={values.date} onChange={set('date')}
            aria-invalid={!!errors.date} aria-describedby={describe('date')} />
        </Field>
        <Field id="timeframe" label={f.timeframe} optional>
          <input id="timeframe" name="timeframe" placeholder={f.timeframePlaceholder} value={values.timeframe}
            onChange={set('timeframe')} />
        </Field>
      </div>

      <div className="field-row">
        <Field id="guests" label={f.guests} error={err('guests')}>
          <input id="guests" name="guests" type="number" inputMode="numeric" min="1" max="2000" step="1"
            value={values.guests} onChange={set('guests')} aria-invalid={!!errors.guests} aria-describedby={describe('guests')} required />
        </Field>
        <Field id="type" label={f.type} error={err('type')}>
          <select id="type" name="type" value={values.type} onChange={set('type')} aria-invalid={!!errors.type}
            aria-describedby={describe('type')} required>
            {Object.entries(f.typeOptions).map(([value, label]) => (
              <option key={value} value={value} disabled={value === ''}>{label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label={f.message} optional>
        <textarea id="message" name="message" rows={4} maxLength={4000} value={values.message} onChange={set('message')} />
      </Field>

      <div className={`field field--check${errors.consent ? ' field--error' : ''}`}>
        <input id="consent" name="consent" type="checkbox" checked={values.consent} onChange={set('consent')}
          aria-invalid={!!errors.consent} aria-describedby={describe('consent')} required />
        <label htmlFor="consent">
          {f.consent}{' '}
          {venue.contact.privacyPolicyUrl && (
            <a className="link" href={venue.contact.privacyPolicyUrl} target="_blank" rel="noopener noreferrer">{f.privacy}</a>
          )}
        </label>
        {errors.consent && <p id="consent-error" className="field__error">{err('consent')}</p>}
      </div>

      {status === 'error' && <p className="enquiry__submit-error" role="alert">{t.enquiry.errors.submit}</p>}

      <div className="enquiry__actions">
        <button type="submit" className="btn btn--primary btn--large" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Loader2 className="spin" size={18} aria-hidden="true" /> {t.enquiry.sending}
            </>
          ) : (
            t.enquiry.submit
          )}
        </button>
        {demo && <p className="micro enquiry__demo-note">{t.enquiry.demoNote}</p>}
      </div>
    </form>
  );
}

/** Enquiry dialog, opened from the navigation, hero/menus and the final call to action. */
export function WeddingInquiry() {
  const { t, enquiryOpen, closeEnquiry } = useSite();
  const dialogRef = useRef(null);
  const [doneName, setDoneName] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (enquiryOpen && !dialog.open) {
      setDoneName(null);
      dialog.showModal();
    }
    if (!enquiryOpen && dialog.open) dialog.close();
  }, [enquiryOpen]);

  return (
    <dialog ref={dialogRef} className="enquiry" aria-labelledby="enquiry-title" onClose={closeEnquiry}>
      <div className="enquiry__panel">
        <button type="button" className="icon-btn enquiry__close" onClick={closeEnquiry} aria-label={t.a11y.close}>
          <X size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>

        {doneName === null ? (
          <>
            <h2 id="enquiry-title" className="display enquiry__title">{t.enquiry.title}</h2>
            <p className="body-copy enquiry__intro">{t.enquiry.intro}</p>
            {enquiryOpen && <EnquiryForm onDone={(name) => setDoneName(name)} />}
          </>
        ) : (
          <div className="enquiry__success" role="status">
            <span className="enquiry__check" aria-hidden="true"><Check size={28} strokeWidth={1.25} /></span>
            <h2 id="enquiry-title" className="display enquiry__title">{t.enquiry.success.title}</h2>
            <p className="lead">{t.enquiry.success.body(doneName)}</p>
            <button type="button" className="btn btn--primary" onClick={closeEnquiry} autoFocus>
              {t.enquiry.success.close}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
