import type { Metadata } from 'next';
import { defaultLocale, localeInfo, locales, localizePath, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { site } from '@/content/site';

interface PageMeta {
  locale: Locale;
  /** Locale-neutral path, e.g. `/about`. */
  path: string;
  /** Page title without the site suffix; omit for the home page. */
  title?: string;
  description?: string;
  image?: { src: string; width: number; height: number; alt: string };
  noindex?: boolean;
}

/** Absolute URL of a locale-neutral path in a locale. */
export const absoluteUrl = (path: string, locale: Locale) => `${site.url}${localizePath(path, locale)}`;

export function alternates(path: string): NonNullable<Metadata['alternates']>['languages'] {
  return {
    ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(path, l)])),
    'x-default': absoluteUrl(path, defaultLocale),
  };
}

export function buildMetadata({ locale, path, title, description, image, noindex }: PageMeta): Metadata {
  const t = getMessages(locale);
  const fullTitle = title ? `${title} – ${site.name}` : t.meta.homeTitle;
  const desc = description ?? t.meta.description;
  const url = absoluteUrl(path, locale);
  const ogImage = image ?? { src: site.logo, width: 1080, height: 1080, alt: site.name };

  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: noindex ? undefined : { canonical: url, languages: alternates(path) },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: fullTitle,
      description: desc,
      url,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
      images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc, images: [ogImage.src] },
  };
}
