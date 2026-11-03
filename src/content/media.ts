import type { Messages } from '@/i18n/messages';

/** Image asset with intrinsic size (used for next/image and layout stability). */
export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

type PosterKey = keyof Messages['posters'];

/** Posters and production images. Alt texts live in `messages.posters`. */
export const posters: Record<PosterKey, ImageAsset> = {
  saveTheDate: { src: '/img/media/poster-save-the-date.jpg', width: 1135, height: 1600 },
  theaterGeschichte: { src: '/img/media/poster-theater-geschichte.jpg', width: 1135, height: 1600 },
  doualaMangaBell: { src: '/img/media/poster-douala-manga-bell.webp', width: 1080, height: 1350 },
  melilla: { src: '/img/media/the-tragedy-of-melilla.webp', width: 1920, height: 896 },
};

/**
 * Images on the right of a production page's hero (decorative, so no alt text).
 * `position` is the CSS object-position of the crop.
 */
export const heroImages = {
  doualaMangaBell: { src: '/img/media/douala-manga-bell-portrait.webp', width: 557, height: 512, position: '55% 12%' },
  melilla: { ...posters.melilla, position: '50% 50%' },
} satisfies Record<string, ImageAsset & { position: string }>;

export function resolvePoster(t: Messages, key: PosterKey) {
  return { ...posters[key], alt: t.posters[key] };
}

/** Portrait of Ngako Keuni that closes the home page and fades into the footer (as on the WordPress home page; decorative). */
export const closingPortrait: ImageAsset = { src: '/img/team/ngako-keuni.webp', width: 1920, height: 1280 };

/** Past MeMo workshops (artistic page). Copy lives in `messages.workshops`. */
export const workshops = [
  { id: 'spandau', image: { src: '/img/media/workshop-spandau.jpg', width: 1800, height: 1350 } },
  { id: 'doha', image: { src: '/img/media/workshop-doha-group.jpg', width: 1800, height: 1200 } },
] as const satisfies readonly { id: keyof Messages['workshops']; image: ImageAsset }[];

export const workshopBand: ImageAsset = { src: '/img/media/workshop-doha-drum.jpg', width: 1800, height: 1200 };

/** Partner logos (home). URLs from the WordPress home page. */
export const partners = [
  {
    name: 'Conservatoire Supérieur de Musique et des Arts',
    href: 'https://conservatoire-sup-musiqart.com/',
    logo: { src: '/img/partners/conservatoire.png', width: 440, height: 440 },
  },
  {
    name: 'Sozial-kulturelle Netzwerke casa e.V.',
    lang: 'de',
    href: 'https://casa-ev.de/',
    logo: { src: '/img/partners/casa.png', width: 440, height: 440 },
  },
] as const;
