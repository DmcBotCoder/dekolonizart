import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import styles from './history.module.css';

const PATH = '/history';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.history, description: t.history.intro });
}

export default async function HistoryPage() {
  const { locale, t } = await getI18n();
  const h = t.history;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.history}
        eyebrow={h.eyebrow}
        title={h.title}
        intro={h.intro}
      />
      <section className="section">
        <h2 className="sr-only">{h.timelineH}</h2>
        <div className={`container ${styles.timeline}`}>
          {h.items.map((item) => (
            <div key={item.year} className={styles.item} {...reveal()}>
              <span className={styles.year}>{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
