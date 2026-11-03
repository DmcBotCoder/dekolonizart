import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { site } from '@/content/site';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import styles from './contact.module.css';

const PATH = '/contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.contact, description: t.contact.title });
}

export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const c = t.contact;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.contact}
        eyebrow={c.eyebrow}
        title={c.title}
      />
      <section className="section">
        <div className={`container ${styles.contacts}`}>
          {[c.artistic, c.production].map((department, i) => (
            <div key={department} className={styles.dept} {...reveal(i * 0.1)}>
              <h2 className={styles.deptH}>{department}</h2>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
