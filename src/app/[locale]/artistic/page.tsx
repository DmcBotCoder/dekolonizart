import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LightboxTrigger } from '@/components/ui/LightboxTrigger';
import { Magnet } from '@/components/ui/Magnet';
import { PageHero } from '@/components/ui/PageHero';
import { PosterText } from '@/components/ui/PosterText';
import { Term } from '@/components/ui/Term';
import { resolvePoster, workshopBand, workshops } from '@/content/media';
import { offerImages } from '@/content/offers';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { parallax, reveal, tilt } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import s from '@/styles/spotlight.module.css';
import styles from './artistic.module.css';

const PATH = '/artistic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    path: PATH,
    title: t.meta.titles.artistic,
    description: t.artistic.intro,
    image: { ...workshopBand, alt: t.artistic.bandAlt },
  });
}

export default async function ArtisticPage() {
  const { locale, t } = await getI18n();
  const a = t.artistic;
  const l = (href: string) => localizePath(href, locale);
  const term = (id: string, label: string) => (
    <Term id={id} locale={locale} explained={t.common.explained}>
      {label}
    </Term>
  );
  const tg = resolvePoster(t, 'theaterGeschichte');
  const youth = a.youth;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.artistic}
        eyebrow={a.eyebrow}
        title="MeMo"
        intro={a.intro}
        image={offerImages.workshops}
      />

      <section className="section">
        <div className={`container ${styles.two}`}>
          <h2 {...reveal()}>{a.h2}</h2>
          <div>
            <p className={styles.lead} {...reveal()}>
              {term('memo', 'MeMo')}
              {a.leadA}
              {term('participatory', a.leadTerm)}
              {a.leadB}
            </p>
            <p {...reveal(0.05)}>{a.p1}</p>
            <p {...reveal(0.1)}>
              {a.p2a}
              <em>
                {term('duala-manga-bell', 'Douala Manga Bell')}
                {a.p2b}
              </em>
              {a.p2c}
            </p>
          </div>
        </div>
      </section>

      <figure className={styles.band}>
        <div className={styles.bandFrame}>
          <Image src={workshopBand.src} alt={a.bandAlt} width={workshopBand.width} height={workshopBand.height} sizes="100vw" {...parallax(12)} />
        </div>
        <figcaption className="container" {...reveal()}>
          <span>{t.workshops.doha.title}</span> {a.bandPlace}
        </figcaption>
      </figure>

      <section className="section section--sand">
        <div className="container grid grid--3">
          {a.cards.map((card, i) => (
            <div key={card.h} className={`card ${styles.card}`} {...reveal(i * 0.08)}>
              <h3>{card.h}</h3>
              <p>{card.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow" {...reveal()}>
            {a.pastEyebrow}
          </span>
          <h2 {...reveal(0.05)}>{a.pastH}</h2>
          <div className={styles.workshops}>
            {workshops.map((workshop, i) => {
              const w = t.workshops[workshop.id];
              return (
                <article key={workshop.id} className={`${styles.ws} ${i % 2 ? styles.flip : ''}`}>
                  <div className={styles.wsFrame} {...reveal({ y: 60 })}>
                    <Image
                      src={workshop.image.src}
                      alt={w.alt}
                      width={workshop.image.width}
                      height={workshop.image.height}
                      sizes="(min-width: 900px) 690px, 92vw"
                      {...parallax(8)}
                    />
                  </div>
                  <div className={styles.wsText}>
                    <span className={styles.place} {...reveal()}>
                      {w.place}
                    </span>
                    <h3 {...reveal(0.05)}>{w.title}</h3>
                    <p {...reveal(0.1)}>{w.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Theater & Geschichte – MeMo workshop for young people ---------- */}
      <section id="youth" className="section section--dark">
        <div className={`container ${s.spotlight} ${s.flip}`}>
          <div className={s.posterCol}>
            <LightboxTrigger
              image={tg}
              className={s.poster}
              aria-label={format(t.common.enlargePoster, { title: 'Theater & Geschichte' })}
              {...reveal({ y: 80 })}
              {...tilt()}
            >
              <Image src={tg.src} alt={tg.alt} width={tg.width} height={tg.height} sizes="(min-width: 900px) 460px, 92vw" />
              <span className={s.zoomHint} aria-hidden="true">
                ＋ {t.common.zoom}
              </span>
            </LightboxTrigger>
            <PosterText poster="theaterGeschichte" locale={locale} t={t.posterText} />
          </div>
          <div>
            <span className="eyebrow" {...reveal()}>
              {youth.eyebrow}
            </span>
            <h2 {...reveal(0.05)}>
              <span lang={locale === 'de' ? undefined : 'de'}>{youth.h2}</span>
              {youth.h2Translation && (
                <>
                  <br />
                  <small className={s.tr}>{youth.h2Translation}</small>
                </>
              )}
            </h2>
            <p className={s.lead} {...reveal(0.1)}>
              {youth.lead}
            </p>
            <ul className={s.list} {...reveal(0.15)}>
              {youth.facts.map((fact) => (
                <li key={fact.strong}>
                  <strong>{fact.strong}</strong>
                  <span>{fact.span}</span>
                </li>
              ))}
            </ul>
            <div className={s.actions} {...reveal(0.2)}>
              <Magnet>
                <Link href={l('/contact')} className="btn btn--light">
                  {youth.cta}
                  <span className="sr-only">{youth.ctaSr}</span>
                </Link>
              </Magnet>
            </div>
            <p className={s.credit} {...reveal(0.25)}>
              {youth.credit}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--rust">
        <div className={`container ${styles.cta}`}>
          <div>
            <h2 {...reveal()}>{a.ctaH}</h2>
            <p>{a.ctaP}</p>
          </div>
          <Magnet>
            <Link href={l('/contact')} className="btn btn--light">
              {a.ctaBtn}
            </Link>
          </Magnet>
        </div>
      </section>
    </>
  );
}
