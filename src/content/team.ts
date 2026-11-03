import type { Messages } from '@/i18n/messages';
import type { ImageAsset } from './media';

type RoleKey = keyof Messages['team']['roles'];

interface TeamMember {
  name: string;
  role: RoleKey;
  photo?: ImageAsset & { position?: string };
}

/**
 * Team page. Names, roles and order as on WordPress and the OnPoint build.
 * NOTE: apart from Ngako Keuni, the portraits are the stock images that came
 * with the WordPress template ("Team-member-N.jpg") – see the completion report.
 */
export const team: TeamMember[] = [
  {
    name: 'Ngako Keuni',
    role: 'founder',
    photo: { src: '/img/team/ngako-keuni.webp', width: 1920, height: 1280, position: '63% 30%' },
  },
  { name: 'Athanasios Karakantas', role: 'composer' },
  { name: 'Shila', role: 'brand', photo: { src: '/img/team/shila.jpg', width: 407, height: 495 } },
  { name: 'Sophie', role: 'social', photo: { src: '/img/team/sophie.jpg', width: 407, height: 495 } },
  { name: 'Ben', role: 'production', photo: { src: '/img/team/ben.jpg', width: 407, height: 495 } },
  { name: 'Kuti', role: 'influencer', photo: { src: '/img/team/kuti.jpg', width: 407, height: 495 } },
  { name: 'Edmond', role: 'influencer', photo: { src: '/img/team/edmond.jpg', width: 407, height: 495 } },
  { name: 'Alicia', role: 'ppc', photo: { src: '/img/team/alicia.jpg', width: 407, height: 495 } },
];

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}
