import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { RichText } from '@/components/ui/RichText';
import { easyRead, type EasyBlock } from '@/content/easy-read';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './easy.module.css';

const PATH = '/easy-read';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.easy, description: easyRead[locale].intro });
}

function Block({ block, locale }: { block: EasyBlock; locale: Locale }) {
  if ('h2' in block) return <h2>{block.h2}</h2>;
  if ('explain' in block)
    return (
      <p className={styles.explain}>
        <RichText text={block.explain} locale={locale} />
      </p>
    );
  if ('box' in block)
    return (
      <div className={styles.box}>
        {block.box.map((line) => (
          <p key={line}>
            <RichText text={line} locale={locale} />
          </p>
        ))}
      </div>
    );
  if ('big' in block)
    return (
      <p className={styles.big}>
        <RichText text={block.big} locale={locale} />
      </p>
    );
  if ('list' in block)
    return (
      <ul>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  return (
    <p lang={block.lang}>
      <RichText text={block.p} locale={locale} />
    </p>
  );
}

export default async function EasyReadPage() {
  const { locale, t } = await getI18n();
  const page = easyRead[locale];

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.easy}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        animateMeta={false}
      />
      <section className="section">
        <div className={`container ${styles.easy}`}>
          <p className={styles.draft} role="note">
            <RichText text={page.draft} locale={locale} />
          </p>
          {page.blocks.map((block, i) => (
            <Block key={i} block={block} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
