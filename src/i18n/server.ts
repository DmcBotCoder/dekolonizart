import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { isLocale, type Locale } from './config';
import { getMessages, type Messages } from './messages';

/** Current locale from the `[locale]` root segment (Server Components only). */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getI18n(): Promise<{ locale: Locale; t: Messages }> {
  const locale = await getLocale();
  return { locale, t: getMessages(locale) };
}
