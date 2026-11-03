import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { DatenschutzDocument } from '@/content/legal/Datenschutz';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildMetadata } from '@/lib/seo';

const PATH = '/datenschutz';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: PATH, title: getMessages(locale).meta.titles.datenschutz });
}

export default async function DatenschutzPage() {
  const { locale, t } = await getI18n();
  return (
    <LegalPage
      locale={locale}
      t={t}
      path={PATH}
      current={t.meta.titles.datenschutz}
      eyebrow={t.legal.datenschutzEyebrow}
      title={'Datenschutz­erklärung'}
    >
      <DatenschutzDocument />
    </LegalPage>
  );
}
