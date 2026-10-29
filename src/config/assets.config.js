/**
 * Central image registry.
 *
 * Every image is a PLACEHOLDER (Unsplash licence) until replaced with the venue's own photography.
 * None of these depict the actual venue — they show wedding moments, not architecture,
 * so nothing misrepresents the building. To replace: set `src` to a local file in /public/images
 * (or a CDN URL), update `width`/`height`, `alt` and `focal`, and set `placeholder: false`.
 *
 * focal: CSS object-position for desktop / mobile crops.
 */
const unsplash = (id) => `https://images.unsplash.com/photo-${id}`;

const img = (id, { alt, width, height, focal = '50% 50%', focalMobile, credit }) => ({
  src: unsplash(id),
  remote: 'unsplash',
  width,
  height,
  alt,
  focal,
  focalMobile: focalMobile ?? focal,
  credit,
  placeholder: true,
});

export const assets = {
  hero: img('1519741497674-611481863552', {
    width: 3000,
    height: 2000,
    focal: '58% 40%',
    focalMobile: '64% 40%',
    alt: {
      en: 'A couple embracing in warm evening light, the bride holding her bouquet',
      fr: 'Un couple enlacé dans la lumière chaude du soir, la mariée tenant son bouquet',
    },
  }),
  venue: img('1464047736614-af63643285bf', {
    width: 3000,
    height: 2000,
    focal: '50% 50%',
    alt: {
      en: 'Soft out-of-focus string lights glowing in the evening',
      fr: 'Guirlandes lumineuses floues brillant dans la soirée',
    },
  }),
  closing: img('1478146059778-26028b07395a', {
    width: 3000,
    height: 2000,
    focal: '50% 60%',
    alt: {
      en: 'A candlelit table set with flowers and a wedding cake',
      fr: 'Une table éclairée à la bougie, dressée de fleurs et d’un gâteau de mariage',
    },
  }),
  experiences: {
    ceremony: img('1550005809-91ad75fb315f', {
      width: 2400,
      height: 3000,
      focal: '50% 55%',
      alt: { en: 'Bride and groom side by side, she holds a soft pastel bouquet', fr: 'Les mariés côte à côte, elle tient un bouquet pastel' },
    }),
    reception: img('1527529482837-4698179dc6ce', {
      width: 3000,
      height: 2000,
      focal: '50% 50%',
      alt: { en: 'Guests raising glasses at a long table under warm lights', fr: 'Des invités lèvent leur verre autour d’une longue table' },
    }),
    dinner: img('1414235077428-338989a2e8c0', {
      width: 3000,
      height: 2000,
      focal: '45% 60%',
      alt: { en: 'A plated dinner course served at an elegant table', fr: 'Un plat dressé servi sur une table élégante' },
    }),
    party: img('1519671482749-fd09be7ccebf', {
      width: 3000,
      height: 2000,
      focal: '50% 40%',
      alt: { en: 'Friends clinking wine glasses in celebration', fr: 'Des amis trinquent pour célébrer' },
    }),
    styling: img('1487530811176-3780de880c2d', {
      width: 2400,
      height: 3000,
      focal: '50% 50%',
      alt: { en: 'A lush bouquet of roses, peonies and eucalyptus', fr: 'Un bouquet généreux de roses, pivoines et eucalyptus' },
    }),
  },
  gallery: [
    img('1460978812857-470ed1c77af0', {
      width: 3000, height: 2000, focal: '50% 40%',
      alt: { en: 'Black and white portrait of a couple kissing beneath a flowing veil', fr: 'Portrait noir et blanc d’un couple s’embrassant sous un voile' },
    }),
    img('1465495976277-4387d4b0b4c6', {
      width: 3000, height: 2000, focal: '50% 50%',
      alt: { en: 'Close-up of two hands with wedding rings resting on a bouquet', fr: 'Gros plan de deux mains portant des alliances sur un bouquet' },
    }),
    img('1525258946800-98cfd641d0de', {
      width: 2000, height: 3000, focal: '50% 50%',
      alt: { en: 'A bride holding a bouquet of peach roses against a lace dress', fr: 'Une mariée tenant un bouquet de roses pêche contre sa robe en dentelle' },
    }),
    img('1520854221256-17451cc331bf', {
      width: 3000, height: 2000, focal: '50% 50%',
      alt: { en: 'A couple reaching for each other’s hands, their shadows on the ground', fr: 'Un couple se tendant la main, leurs ombres au sol' },
    }),
    img('1515934751635-c81c6bc9a2d8', {
      width: 3000, height: 2000, focal: '50% 50%',
      alt: { en: 'Two wedding rings resting on pale pink peonies', fr: 'Deux alliances posées sur des pivoines rose pâle' },
    }),
    img('1583939003579-730e3918a45a', {
      width: 2000, height: 3000, focal: '50% 40%',
      alt: { en: 'Newlyweds laughing as guests celebrate around them', fr: 'Les jeunes mariés rient entourés de leurs invités' },
    }),
    img('1519225421980-715cb0215aed', {
      width: 3000, height: 2000, focal: '50% 50%',
      alt: { en: 'A long dining table dressed with linen and wildflowers', fr: 'Une longue table dressée de lin et de fleurs des champs' },
    }),
    img('1546032996-6dfacbacbf3f', {
      width: 2000, height: 3000, focal: '50% 35%',
      alt: { en: 'A couple wrapped together in a flowing veil', fr: 'Un couple enveloppé dans un voile léger' },
    }),
  ],
};

export const RESPONSIVE_WIDTHS = [480, 768, 1080, 1440, 1920, 2560];

/** Builds src/srcSet for an asset. Unsplash serves AVIF/WebP via auto=format. */
export function imageSources(asset, maxWidth = 2560) {
  if (asset.remote !== 'unsplash') return { src: asset.src, srcSet: undefined };
  const widths = RESPONSIVE_WIDTHS.filter((w) => w <= maxWidth);
  const url = (w) => `${asset.src}?auto=format&fit=crop&q=72&w=${w}`;
  return {
    src: url(Math.min(1440, maxWidth)),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
  };
}
