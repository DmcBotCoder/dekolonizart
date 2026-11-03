import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Term } from '@/components/ui/Term';
import { getI18n, getLocale } from '@/i18n/server';
import { getMessages } from '@/i18n/messages';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import styles from './about.module.css';

const PATH = '/about';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.about, description: t.about.intro });
}

export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const a = t.about;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.about}
        eyebrow={a.eyebrow}
        title="DekolonizArt"
        intro={a.intro}
      />

      <section className="section">
        <div className={`container ${styles.two}`}>
          <h2 {...reveal()}>
            {a.h2[0]}
            <br />
            {a.h2[1]}
          </h2>
          <div>
            <p className={styles.lead}>
              {a.leadA}
              <Term id="african-perspectives" locale={locale} explained={t.common.explained}>
                {a.leadTerm}
              </Term>
              {a.leadB}
            </p>
            <p>{a.p1}</p>
            <p>{a.p2}</p>
            <p>
              <strong>{a.strong}</strong>
            </p>
            <p className={styles.sig}>
              {a.sig}
              <br />
              <span>Ngako Keuni</span>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container grid grid--2">
          {a.cards.map((card, i) => (
            <div key={card.h} className="card" {...reveal((i % 2) * 0.08)}>
              <h3>{card.h}</h3>
              {card.p.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <h2 className="eyebrow" {...reveal()}>
            {a.valuesH}
          </h2>
          <div className={`grid grid--2 ${styles.values}`}>
            {t.values.map((value, i) => (
              <div key={value.id} {...reveal(i * 0.08)}>
                <h3>{value.title}</h3>
                {value.id === 'ubuntu' && (
                  <p className="target">
                    <Term id="ubuntu" locale={locale} explained={t.common.explained}>
                      {a.ubuntuLink}
                    </Term>
                  </p>
                )}
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
