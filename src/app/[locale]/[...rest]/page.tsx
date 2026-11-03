import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages } from '@/i18n/messages';
import { getLocale } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale());
  return { title: { absolute: `${t.meta.titles.notFound} – DekolonizArt` } };
}

/** Any unknown path inside a locale renders the localized 404 (`../not-found.tsx`). */
export default function CatchAll() {
  notFound();
}
