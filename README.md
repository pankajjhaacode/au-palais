# The Art of Forever — wedding venue homepage demo

Client-side React app (Vite, Framer Motion, Lucide). "The Art of Forever" is a working concept name, not the venue's confirmed name.

## Run

```bash
pnpm install
pnpm dev            # http://localhost:5173  (EN)  ·  /fr/  (FR) — theme studio ON
pnpm test           # theme validation, contrast and enquiry validation checks
```

## Theme studio (demo mode)

Click the **Customize** button (bottom-right) or the palette icon in the navigation.
It has 6 palettes, a custom colour editor with contrast warnings, 4 typography pairings, hero layouts (immersive / split / typography-led / experimental scroll), corner radius, image treatment, motion, header and spacing. It can also reset, randomize, save named presets, export and import JSON, and copy a share link (`#theme=…`).
"Preview customer site" hides the demo controls; the small pill at bottom-left brings them back.

Demo mode is on in `pnpm dev` and in `pnpm build:demo`. A normal `pnpm build` is the customer-facing site, with no studio and no unverified content.

## Build & deploy

```bash
pnpm build          # public site  → dist/
pnpm build:demo     # client presentation build (studio enabled) → dist/
pnpm preview
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, S3). Configure an SPA fallback so `/fr/` serves `index.html`.

## Where things live

| What | File |
|---|---|
| Venue identity & **verified** facts (null = hidden) | `src/config/venue.config.js` |
| Images, alt text, focal points | `src/config/assets.config.js` |
| Theme presets, typography, production theme | `src/config/themes.config.js` (`productionThemeId`) |
| All EN / FR copy | `src/content/homepage.content.js` |
| Enquiry submission | `src/services/enquiry.js` |

## Before going live

- **Photography:** every image is an Unsplash placeholder showing wedding moments, not the venue. Replace them in `assets.config.js` and set `placeholder: false`.
- **Facts:** fill `venue.config.js` from the owner's information. Experiences and details stay hidden publicly until `verified` / non-null.
- **Enquiries:** set `VITE_ENQUIRY_ENDPOINT` (API, CRM webhook or form backend). Without it, the public form shows an error instead of silently losing leads; demo mode only simulates submission.
- **SEO:** this is a client-rendered SPA, so crawlers that don't run JavaScript see only the static `<title>`/description in `index.html`. For local SEO, add pre-rendering (e.g. `vite-plugin-ssg`) or SSR later.
