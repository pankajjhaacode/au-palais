# Crystal Gold — wedding venue website

Client-side React site (Vite, Framer Motion, Lucide) in English and French.

## Run

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Pages

`/`, `/venue`, `/spaces`, `/your-day`, `/gallery`, `/faq`, `/contact`, `/legal`, `/privacy`, `/terms`, `/cookies`, `/accessibility`, each also under `/fr`. Routes live in `src/app/routes.js` and page composition in `src/pages/Pages.jsx`.

## SEO

The app runs entirely in the browser. At build time, `vite.config.js` also writes an HTML file for each page and language with its own title, description, canonical, hreflang, Open Graph tags and structured data, plus `sitemap.xml`, `robots.txt` and `404.html`. Page head data lives in `src/app/seo.js`.

Set `SITE_URL` in Vercel to the final domain. Without it, the build uses Vercel's production domain.

## Before launch

Set in `src/config/venue.config.js` unless noted:

- **Enquiries:** set `VITE_ENQUIRY_ENDPOINT` in the Vercel project to a URL that accepts a JSON POST. Without it the form shows an error and no enquiry is sent.
- **Legal notice:** `legal` and `identity` hold the company name, form, SIRET, address and publication director. Missing values show as "To be completed" on `/legal`.
- **Legal pages:** `/legal`, `/privacy`, `/terms`, `/cookies` and `/accessibility` were drafted without legal advice.
- **Contact:** `contact.email` and `contact.phone` appear in the footer, on `/contact` and on the legal pages.
- **Facts:** `facts` holds capacity, services and similar. A value appears only once it is set.
- **Legal review:** have those pages checked, including the retention wording.

## Design

The look is fixed: colours and type are tokens in `:root` at the top of `src/styles/global.css`, with rounded corners, muted images, a light header and subtle motion. Motion follows the visitor's reduced-motion setting.

## Imagery

`public/images/venue/` holds crops of the client's supplied boards. They are about 1,300px wide and some are design visualisations. Replace them through `src/config/assets.config.js` when originals are available.

## Hosting

`vercel.json` builds the site. Each page is a real file, so no rewrites are needed, and unknown addresses get `404.html` with a true 404 status.
