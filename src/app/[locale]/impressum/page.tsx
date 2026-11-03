import type { Metadata } from 'next';
import { LegalPage } from '@/components/ui/LegalPage';
import { ImpressumDocument } from '@/content/legal/Impressum';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildMetadata } from '@/lib/seo';

const PATH = '/impressum';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ locale, path: PATH, title: getMessages(locale).meta.titles.impressum });
}

export default async function ImpressumPage() {
  const { locale, t } = await getI18n();
  return (
    <LegalPage locale={locale} t={t} path={PATH} current={t.meta.titles.impressum} eyebrow={t.legal.impressumEyebrow} title="Impressum">
      <ImpressumDocument />
    </LegalPage>
  );
}
