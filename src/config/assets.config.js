/**
 * Central image registry — the venue's own imagery, cropped from the client's supplied
 * boards into /public/images/venue. Some are design visualisations of the project.
 *
 * focal: CSS object-position for desktop / mobile crops.
 */
const img = (name, { alt, width, height, focal = '50% 50%', focalMobile }) => ({
  src: `/images/venue/${name}.jpg`,
  width,
  height,
  alt,
  focal,
  focalMobile: focalMobile ?? focal,
});

const hall = img('hall', {
  width: 1316, height: 592, focal: '50% 45%', focalMobile: '18% 40%',
  alt: {
    en: 'The ceremony hall under tiered crystal and gold chandeliers, draped ceiling and a raised stage',
    fr: 'La salle de cérémonie sous des lustres de cristal et d’or, plafond drapé et scène surélevée',
  },
});
const staircase = img('staircase', {
  width: 1316, height: 592, focal: '45% 50%', focalMobile: '22% 50%',
  alt: {
    en: 'The curved grand staircase dressed in white flowers, rising to the mezzanine',
    fr: 'Le grand escalier courbe paré de fleurs blanches, montant vers la mezzanine',
  },
});
const staircaseWide = img('staircase-wide', {
  width: 1232, height: 446, focal: '35% 50%',
  alt: {
    en: 'Staircase and mezzanine above a hall of candlelit round tables',
    fr: 'Escalier et mezzanine au-dessus d’une salle de tables rondes à la bougie',
  },
});
const hallWide = img('hall-wide', {
  width: 1232, height: 446,
  alt: {
    en: 'The full width of the hall: panelled walls, mirrors and the stage at its centre',
    fr: 'Toute la largeur de la salle : boiseries, miroirs et la scène en son centre',
  },
});
const ballroom = img('ballroom', {
  width: 1272, height: 462,
  alt: {
    en: 'Guests gathering in the ballroom beneath a crystal chandelier and skylights',
    fr: 'Les invités réunis dans la salle de bal sous un lustre de cristal et des puits de lumière',
  },
});
const mezzaninePhoto = img('mezzanine-photo', {
  width: 1272, height: 462, focal: '40% 50%',
  alt: {
    en: 'The staircase and wrought-iron mezzanine above tables glowing with fairy lights',
    fr: 'L’escalier et la mezzanine en fer forgé au-dessus de tables illuminées de guirlandes',
  },
});
const stage = img('stage', {
  width: 560, height: 592, focal: '50% 40%',
  alt: {
    en: 'The raised stage between mirrored panels, flanked by white floral columns',
    fr: 'La scène surélevée entre des panneaux miroirs, encadrée de colonnes florales blanches',
  },
});
const mezzanine = img('mezzanine', {
  width: 616, height: 592,
  alt: {
    en: 'The mezzanine gallery and mirrored panelling above dressed tables',
    fr: 'La mezzanine en galerie et les boiseries à miroirs au-dessus des tables dressées',
  },
});
const florals = img('florals', {
  width: 640, height: 470, focal: '40% 50%',
  alt: {
    en: 'Cascades of white roses and candles along the foot of the staircase',
    fr: 'Cascades de roses blanches et de bougies au pied de l’escalier',
  },
});
const chandelier = img('chandelier', {
  width: 460, height: 330,
  alt: {
    en: 'Tiered crystal and gold chandeliers suspended between draped silk',
    fr: 'Lustres étagés de cristal et d’or suspendus entre des drapés de soie',
  },
});
const tables = img('tables', {
  width: 456, height: 590,
  alt: {
    en: 'Round tables with gold chairs, candles and tall white florals',
    fr: 'Tables rondes, chaises dorées, bougies et grandes compositions blanches',
  },
});

export const assets = {
  hero: staircase,
  venue: hall,
  closing: mezzaninePhoto,
  spaces: { ceremony: stage, staircase: florals, ballroom, mezzanine, tables },
  gallery: [staircaseWide, chandelier, stage, hallWide, florals, mezzanine, ballroom, mezzaninePhoto],
};
