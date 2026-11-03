import type { Messages } from '@/i18n/messages';
import { posters, type ImageAsset } from './media';

/**
 * Photos of the three service areas – the images of the WordPress home page
 * (decorative, so no alt text). Used as card backgrounds (home, Services) and
 * as the hero image of each service page. `position` is the CSS object-position.
 */
export const offerImages = {
  performance: { ...posters.melilla, position: '50% 50%' },
  workshops: { src: '/img/media/offer-workshops.webp', width: 1200, height: 638, position: '35% 50%' },
  movement: { src: '/img/media/offer-movement.webp', width: 1024, height: 576, position: '50% 50%' },
} satisfies Record<keyof Messages['offers'], ImageAsset & { position: string }>;

/** The three service areas (home "Our Offers", services page, footer). */
export const offers = [
  { id: 'performance', href: '/theater', image: offerImages.performance },
  { id: 'workshops', href: '/artistic', image: offerImages.workshops },
  { id: 'movement', href: '/movement-dance', image: offerImages.movement },
] as const satisfies readonly { id: keyof Messages['offers']; href: string; image: ImageAsset }[];

export function resolveOffers(t: Messages) {
  return offers.map((offer) => ({ ...offer, ...t.offers[offer.id] }));
}
