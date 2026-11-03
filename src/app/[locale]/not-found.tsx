import type { Metadata } from 'next';
import { localizePath } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { NotFoundView } from './NotFoundView';

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale());
  return { title: { absolute: `${t.meta.titles.notFound} – DekolonizArt` } };
}

const TARGETS = ['/', '/theater', '/artistic', '/contact'];

export default async function NotFound() {
  const { locale, t } = await getI18n();
  const nf = t.notFound;

  return (
    <NotFoundView
      title={nf.title}
      text={nf.text}
      requested={nf.requested}
      links={nf.links.map((link, i) => ({ ...link, href: localizePath(TARGETS[i], locale) }))}
      homeHref={localizePath('/', locale)}
      homeLabel={nf.home}
    />
  );
}
