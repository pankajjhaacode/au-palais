import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Copy, Download, Eye, RotateCcw, Shuffle, Trash2, Upload, X } from 'lucide-react';
import { colorFields, layoutOptions, themePresets, typographyOptions } from '../../config/themes.config.js';
import { useTheme } from '../../theme/ThemeContext.jsx';
import { clonePreset, contrastReport, encodeTheme, randomTheme, sanitizeTheme } from '../../theme/themeUtils.js';
import { themeStorage } from '../../theme/themeStorage.js';

const sameColors = (a, b) => Object.keys(colorFields).every((k) => a[k].toUpperCase() === b[k].toUpperCase());

function Section({ title, open = false, children }) {
  return (
    <details className="studio__section" open={open}>
      <summary>{title}</summary>
      <div className="studio__section-body">{children}</div>
    </details>
  );
}

function PaletteSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <ul className="studio__palettes">
      {Object.entries(themePresets).map(([id, preset]) => {
        const active = sameColors(theme.colors, preset.colors);
        return (
          <li key={id}>
            <button
              type="button"
              className="studio__palette"
              aria-pressed={active}
              onClick={() => setTheme(clonePreset(id))}
            >
              <span className="studio__swatches" aria-hidden="true">
                {['background', 'surface', 'accent'].map((k) => (
                  <span key={k} style={{ background: preset.colors[k] }} />
                ))}
              </span>
              <span className="studio__palette-text">
                <span>{preset.name}</span>
                <span className="studio__hex">
                  {preset.colors.background} · {preset.colors.accent}
                </span>
              </span>
              {active && <Check size={16} aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ColorEditor() {
  const { theme, setTheme } = useTheme();
  const report = contrastReport(theme.colors);
  const update = (key, value) => setTheme((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }));

  return (
    <>
      <div className="studio__colors">
        {Object.entries(colorFields).map(([key, label]) => (
          <label key={key} className="studio__color">
            <input type="color" value={theme.colors[key]} onChange={(e) => update(key, e.target.value)} />
            <span>{label}</span>
            <code>{theme.colors[key]}</code>
          </label>
        ))}
      </div>
      <ul className="studio__contrast" aria-label="Contrast checks">
        {report.map((row) => (
          <li key={row.label} data-pass={row.pass}>
            {row.pass ? <Check size={14} aria-hidden="true" /> : <AlertTriangle size={14} aria-hidden="true" />}
            <span>{row.label}</span>
            <span>
              {row.ratio}:1 {row.pass ? '' : `(needs ${row.min}:1)`}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function TypographySelector() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="studio__type" role="radiogroup" aria-label="Typography">
      {Object.entries(typographyOptions).map(([id, opt]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme.typography === id}
          className="studio__type-option"
          onClick={() => setTheme((prev) => ({ ...prev, typography: id }))}
        >
          <span className="studio__type-sample" style={{ fontFamily: opt.display, fontWeight: opt.displayWeight }}>
            Aa
          </span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function Segmented({ label, options, value, onChange }) {
  return (
    <fieldset className="studio__segmented">
      <legend>{label}</legend>
      <div>
        {Object.entries(options).map(([id, text]) => (
          <label key={id}>
            <input type="radio" name={label} value={id} checked={value === id} onChange={() => onChange(id)} />
            <span>{text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LayoutControls() {
  const { theme, setTheme } = useTheme();
  const setLayout = (key) => (v) => setTheme((prev) => ({ ...prev, layout: { ...prev.layout, [key]: v } }));
  return (
    <>
      <Segmented label="Hero layout" options={layoutOptions.hero} value={theme.layout.hero} onChange={setLayout('hero')} />
      <Segmented label="Corner radius" options={layoutOptions.radius} value={theme.layout.radius} onChange={setLayout('radius')} />
      <Segmented label="Image treatment" options={layoutOptions.imageTreatment} value={theme.layout.imageTreatment} onChange={setLayout('imageTreatment')} />
      <Segmented label="Motion" options={layoutOptions.motion} value={theme.motion} onChange={(v) => setTheme((prev) => ({ ...prev, motion: v }))} />
      <Segmented label="Header" options={layoutOptions.header} value={theme.layout.header} onChange={setLayout('header')} />
      <Segmented label="Section spacing" options={layoutOptions.spacing} value={theme.layout.spacing} onChange={setLayout('spacing')} />
    </>
  );
}

function ThemePresets({ notify }) {
  const { theme, setTheme, reset } = useTheme();
  const [saved, setSaved] = useState([]);
  const [name, setName] = useState('');
  const fileRef = useRef(null);

  useEffect(() => setSaved(themeStorage.loadSaved()), []);

  const persist = (list) => {
    setSaved(list);
    if (!themeStorage.saveSaved(list)) notify('Browser storage unavailable — preset kept for this session only.');
  };

  const save = (e) => {
    e.preventDefault();
    const label = name.trim();
    if (!label) return;
    persist([...saved.filter((s) => s.name !== label), { ...theme, name: label }]);
    setName('');
    notify(`Saved “${label}”.`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `${theme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.theme.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 50_000) throw new Error('too large');
      const parsed = JSON.parse(await file.text());
      if (!parsed?.colors) throw new Error('missing colours');
      setTheme(sanitizeTheme(parsed, theme));
      notify(`Imported “${parsed.name ?? file.name}”. Invalid values were replaced.`);
    } catch {
      notify('That file is not a valid theme JSON.');
    }
  };

  const copyShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#theme=${encodeTheme(theme)}`;
    try {
      await navigator.clipboard.writeText(url);
      notify('Share link copied.');
    } catch {
      notify('Clipboard unavailable — link printed below.', url);
    }
  };

  return (
    <>
      <div className="studio__actions">
        <button type="button" className="studio__btn" onClick={reset}><RotateCcw size={15} aria-hidden="true" /> Reset</button>
        <button type="button" className="studio__btn" onClick={() => setTheme(randomTheme())}><Shuffle size={15} aria-hidden="true" /> Randomize</button>
        <button type="button" className="studio__btn" onClick={exportJson}><Download size={15} aria-hidden="true" /> Export JSON</button>
        <button type="button" className="studio__btn" onClick={() => fileRef.current?.click()}><Upload size={15} aria-hidden="true" /> Import JSON</button>
        <button type="button" className="studio__btn" onClick={copyShare}><Copy size={15} aria-hidden="true" /> Copy share link</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
      </div>

      <form className="studio__save" onSubmit={save}>
        <label htmlFor="studio-preset-name">Save current theme as</label>
        <div>
          <input id="studio-preset-name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="e.g. Client favourite" />
          <button type="submit" className="studio__btn">Save</button>
        </div>
      </form>

      {saved.length > 0 && (
        <ul className="studio__saved">
          {saved.map((preset) => (
            <li key={preset.name}>
              <button type="button" className="studio__saved-apply" onClick={() => setTheme(sanitizeTheme(preset, theme))}>
                <span className="studio__swatches" aria-hidden="true">
                  {['background', 'surface', 'accent'].map((k) => (
                    <span key={k} style={{ background: preset.colors?.[k] }} />
                  ))}
                </span>
                {preset.name}
              </button>
              <button
                type="button"
                className="studio__icon"
                aria-label={`Delete ${preset.name}`}
                onClick={() => persist(saved.filter((s) => s.name !== preset.name))}
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ThemeStudio() {
  const { theme, studioOpen, setStudioOpen, setCustomerPreview } = useTheme();
  const panelRef = useRef(null);
  const [message, setMessage] = useState(null);

  const notify = (text, detail) => setMessage({ text, detail });

  useEffect(() => {
    if (!studioOpen) return;
    const opener = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setStudioOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [studioOpen, setStudioOpen]);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(id);
  }, [message]);

  return (
    <aside
      ref={panelRef}
      className="studio"
      data-open={studioOpen}
      role="dialog"
      aria-modal="false"
      aria-labelledby="studio-title"
      aria-hidden={!studioOpen}
      inert={studioOpen ? undefined : ''}
      tabIndex={-1}
    >
      <div className="studio__head">
        <div>
          <p className="studio__kicker">Demo · Theme studio</p>
          <h2 id="studio-title">{theme.name}</h2>
        </div>
        <button type="button" className="studio__icon" onClick={() => setStudioOpen(false)} aria-label="Close theme studio">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="studio__scroll">
        <Section title="Starting palette" open>
          <PaletteSelector />
        </Section>
        <Section title="Custom colours">
          <ColorEditor />
        </Section>
        <Section title="Typography">
          <TypographySelector />
        </Section>
        <Section title="Layout & atmosphere" open>
          <LayoutControls />
        </Section>
        <Section title="Presets & sharing">
          <ThemePresets notify={notify} />
        </Section>
      </div>

      <div className="studio__foot">
        <button
          type="button"
          className="studio__btn studio__btn--primary"
          onClick={() => {
            setStudioOpen(false);
            setCustomerPreview(true);
          }}
        >
          <Eye size={15} aria-hidden="true" /> Preview customer site
        </button>
        <p className="studio__status" role="status">
          {message?.text}
          {message?.detail && <code className="studio__share">{message.detail}</code>}
        </p>
      </div>
    </aside>
  );
}
