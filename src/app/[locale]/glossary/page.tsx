import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './glossary.module.css';

const PATH = '/glossary';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.glossary, description: t.glossary.intro });
}

export default async function GlossaryPage() {
  const { locale, t } = await getI18n();
  const g = t.glossary;
  const lang = (value?: string) => (value && value !== locale ? value : undefined);

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.glossary}
        eyebrow={g.eyebrow}
        title={g.title}
        intro={g.intro}
        animateMeta={false}
      />
      <section className="section">
        <div className="container legal-doc">
          {/* Same-page anchors are scrolled (with header offset) and focused by the page transition layer. */}
          <nav className="toc" aria-label={g.toc}>
            <ol>
              {g.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} lang={lang(item.lang)}>
                    {item.term}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <dl className={styles.gloss}>
            {g.items.map((item) => (
              <div key={item.id} id={item.id} className={styles.entry} tabIndex={-1}>
                <dt lang={lang(item.lang)}>
                  <dfn>{item.term}</dfn>
                </dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
