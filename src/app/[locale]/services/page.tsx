import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/ui/FaqList';
import { Magnet } from '@/components/ui/Magnet';
import { PageHero } from '@/components/ui/PageHero';
import { resolveOffers } from '@/content/offers';
import { localizePath } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import photo from '@/styles/photo-card.module.css';
import styles from './services.module.css';

const PATH = '/services';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.services, description: t.services.intro });
}

export default async function ServicesPage() {
  const { locale, t } = await getI18n();
  const s = t.services;
  const l = (href: string) => localizePath(href, locale);

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.services}
        eyebrow={s.eyebrow}
        title={s.title}
        intro={s.intro}
      />

      <section className="section" aria-labelledby="svc-h">
        <h2 id="svc-h" className="sr-only">
          {s.listH}
        </h2>
        <div className="container grid grid--3">
          {resolveOffers(t).map((offer, i) => (
            <article key={offer.id} className={`card ${photo.card}`} {...reveal(i * 0.08)}>
              <Image
                className={photo.img}
                src={offer.image.src}
                alt=""
                fill
                sizes="(min-width: 900px) 380px, 92vw"
                style={{ objectPosition: offer.image.position }}
              />
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              <Link href={l(offer.href)} className="link-arrow">
                {s.visit}
                <span className="sr-only">{offer.title}</span> <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <span className="eyebrow" {...reveal()}>
            {s.faqEyebrow}
          </span>
          <h2 {...reveal()}>{s.faqH}</h2>
          <FaqList items={t.faq} {...reveal(0.1)} />
        </div>
      </section>

      <section className="section section--rust">
        <div className={`container ${styles.cta}`}>
          <h2 {...reveal()}>{s.ctaH}</h2>
          <Magnet>
            <Link href={l('/contact')} className="btn btn--light">
              {s.ctaBtn}
            </Link>
          </Magnet>
        </div>
      </section>
    </>
  );
}
