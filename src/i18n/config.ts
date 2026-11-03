/**
 * Locale configuration and URL helpers. Safe to import from server and
 * client code.
 *
 * URL scheme (matches the reference): English is unprefixed, the other
 * locales are prefixed – `/about`, `/de/about`, `/fr/about`.
 */
export const locales = ['en', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Storage key for the visitor's explicit language choice (same as the reference). */
export const LOCALE_STORAGE_KEY = 'dk-locale';

export const localeInfo: Record<Locale, { short: string; name: string; og: string }> = {
  en: { short: 'EN', name: 'English', og: 'en_GB' },
  de: { short: 'DE', name: 'Deutsch', og: 'de_DE' },
  fr: { short: 'FR', name: 'Français', og: 'fr_FR' },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

const PREFIX = /^\/(de|fr|en)(?=\/|$|#|\?)/;

/** Splits a pathname into its locale and the locale-neutral path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const match = pathname.match(PREFIX);
  const locale = match && isLocale(match[1]) ? match[1] : defaultLocale;
  let path = match ? pathname.slice(match[0].length) : pathname;
  if (!path.startsWith('/')) path = `/${path}`;
  return { locale, path };
}

/**
 * Builds the URL of a locale-neutral path (e.g. `/about#values`) for a locale.
 * Hash and query are preserved.
 */
export function localizePath(path: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  const [, pathname = '/', rest = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (locale === defaultLocale) return `${clean}${rest}`;
  return `/${locale}${clean === '/' ? '' : clean}${rest}`;
}
