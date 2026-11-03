import type { MetadataRoute } from 'next';
import { bookingPath, productionPath, productions } from '@/content/productions';
import { locales } from '@/i18n/config';
import { absoluteUrl, alternates } from '@/lib/seo';

const PAGES = [
  '/',
  '/about',
  '/history',
  '/the-team',
  '/services',
  '/theater',
  '/artistic',
  '/movement-dance',
  '/events',
  '/artists',
  '/contact',
  '/glossary',
  '/easy-read',
  '/accessibility',
  '/impressum',
  '/datenschutz',
  ...productions.flatMap((production) => [productionPath(production.slug), bookingPath(production.slug)]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(path, locale),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
      alternates: { languages: alternates(path) as Record<string, string> },
    })),
  );
}
