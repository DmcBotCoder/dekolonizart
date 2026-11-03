import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalValue } from '@/components/ui/LegalValue';
import { PageHero } from '@/components/ui/PageHero';
import { legal } from '@/content/legal/data';
import { localizePath } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';

const PATH = '/accessibility';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.accessibility, description: t.accessibility.intro });
}

export default async function AccessibilityPage() {
  const { locale, t } = await getI18n();
  const a = t.accessibility;
  const l = (href: string) => localizePath(href, locale);

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.accessibility}
        eyebrow={a.eyebrow}
        title={a.title}
        intro={a.intro}
        animateMeta={false}
      />
      <section className="section">
        <div className="container legal-doc">
          <h2>{a.standardH}</h2>
          <p>{a.standard}</p>
          <h2>{a.statusH}</h2>
          <p>{a.status}</p>
          <h3>{a.doneH}</h3>
          <ul>
            {a.done.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="see-also">
            {a.seeAlso} <Link href={l('/glossary')}>{t.a11y.glossary}</Link> · <Link href={l('/easy-read')}>{t.a11y.easy}</Link>
          </p>
          <h3>{a.notYetH}</h3>
          <ul>
            {a.notYet.map((item) => (
              <li key={item.strong}>
                <strong>{item.strong}</strong> {item.text}
              </li>
            ))}
          </ul>
          <h2>{a.testedH}</h2>
          <p>
            {a.testedA}
            <LegalValue value={legal.lastUpdated} />
            {a.testedB}
          </p>
          <h2>{a.feedbackH}</h2>
          <p>{a.feedback}</p>
          <p>
            {a.email} <a href={`mailto:${legal.email}?subject=${encodeURIComponent(a.mailSubject)}`}>{legal.email}</a>
          </p>
          <h2>{a.enforcementH}</h2>
          <p lang="de">
            <LegalValue value={legal.enforcement} />
          </p>
          <p className="legal-meta">
            {a.created} <LegalValue value={legal.lastUpdated} />.
          </p>
        </div>
      </section>
    </>
  );
}
