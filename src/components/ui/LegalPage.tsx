import type { ReactNode } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import type { Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { buildCrumbs } from '@/lib/breadcrumbs';

interface LegalPageProps {
  locale: Locale;
  t: Messages;
  path: string;
  current: string;
  eyebrow: string;
  /** German document title. */
  title: string;
  children: ReactNode;
}

/** Shell for the German-only legal documents (with a notice in the other languages). */
export function LegalPage({ locale, t, path, current, eyebrow, title, children }: LegalPageProps) {
  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(path, locale, t)}
        current={current}
        eyebrow={eyebrow}
        title={title}
        titleLang={locale === 'de' ? undefined : 'de'}
        animateMeta={false}
      />
      <section className="section">
        <div className="container legal-doc">
          {locale !== 'de' && (
            <p className="legal-lang" role="note">
              {t.common.legalGermanOnly}
            </p>
          )}
          {children}
        </div>
      </section>
    </>
  );
}
