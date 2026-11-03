import type { Messages } from '@/i18n/messages';
import { bookingPath, featuredProduction } from './productions';

type NavKey = keyof Messages['nav'];

interface NavNode {
  id: NavKey;
  href: string;
  children?: { id: NavKey; href: string }[];
  /** Highlight card shown inside the dropdown. */
  feature?: { href: string };
}

/** Main navigation (locale-neutral paths). Labels come from `messages.nav`. */
export const mainNav: NavNode[] = [
  { id: 'home', href: '/' },
  {
    id: 'about',
    href: '/about',
    children: [
      { id: 'aboutUs', href: '/about' },
      { id: 'history', href: '/history' },
      { id: 'team', href: '/the-team' },
    ],
    feature: { href: '/about' },
  },
  {
    id: 'services',
    href: '/services',
    children: [
      { id: 'theater', href: '/theater' },
      { id: 'artistic', href: '/artistic' },
      { id: 'movement', href: '/movement-dance' },
    ],
    // "Book your seat" card for the featured production → its booking page.
    feature: { href: bookingPath(featuredProduction) },
  },
  { id: 'contact', href: '/contact' },
];

export interface ResolvedNavItem {
  href: string;
  label: string;
  children?: { href: string; label: string; text: string }[];
  feature?: { href: string; kicker: string; title: string; text: string; cta: string };
}

/** Attaches the localized labels to the navigation tree. */
export function resolveNav(t: Messages): ResolvedNavItem[] {
  return mainNav.map((node) => {
    const entry = t.nav[node.id] as { label: string; feature?: Omit<NonNullable<ResolvedNavItem['feature']>, 'href'> };
    return {
      href: node.href,
      label: entry.label,
      children: node.children?.map((child) => {
        const c = t.nav[child.id] as { label: string; text: string };
        return { href: child.href, label: c.label, text: c.text };
      }),
      feature: node.feature && entry.feature ? { href: node.feature.href, ...entry.feature } : undefined,
    };
  });
}

/** Parent menu entry of a page, used for breadcrumbs (mirrors the reference logic). */
export function findNavParent(path: string): { id: NavKey; href: string } | undefined {
  return mainNav.find((node) => node.href !== path && node.children?.some((child) => child.href === path));
}
