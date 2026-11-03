import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EventList } from '@/components/ui/EventList';
import { FaqList } from '@/components/ui/FaqList';
import { LightboxTrigger } from '@/components/ui/LightboxTrigger';
import { Magnet } from '@/components/ui/Magnet';
import { PageHero } from '@/components/ui/PageHero';
import { ReadMore } from '@/components/ui/ReadMore';
import { SectionNav } from '@/components/ui/SectionNav';
import { YouTubeVideo } from '@/components/ui/YouTubeVideo';
import { resolveAgenda } from '@/content/agenda';
import { getArtist } from '@/content/artists';
import { heroImages, resolvePoster } from '@/content/media';
import { bookingPath, getProduction, productionPath, productions } from '@/content/productions';
import { initials } from '@/content/team';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal, tilt } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import { youTubeId } from '@/lib/youtube';
import s from '@/styles/spotlight.module.css';
import { ProductionFacts } from './ProductionFacts';
import styles from './production.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return productions.map((production) => ({ slug: production.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) return {};
  const locale = await getLocale();
  const t = getMessages(locale);
  const image = production.image ? resolvePoster(t, production.image.key) : undefined;
  return buildMetadata({
    locale,
    path: productionPath(production.slug),
    title: production.shortTitle,
    description: t.shows[production.slug].text,
    image,
  });
}

export default async function ProductionPage({ params }: Props) {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) notFound();

  const { locale, t } = await getI18n();
  const l = (href: string) => localizePath(href, locale);
  const show = t.shows[production.slug];
  const titleLang = production.titleLang && production.titleLang !== locale ? production.titleLang : undefined;
  const image = production.image ? resolvePoster(t, production.image.key) : undefined;
  const heroImage = production.heroImage ? heroImages[production.heroImage] : undefined;
  // A photo already shown in the hero is not repeated in the page body.
  const bodyPhoto = image && production.image?.kind === 'photo' && image.src !== heroImage?.src;
  const dates = resolveAgenda(t, production.slug);
  const cast = production.cast.flatMap((entry) => {
    const artist = getArtist(entry.artist);
    return artist ? [{ ...entry, artist }] : [];
  });
  const creditName = (kind: 'author' | 'composer') => cast.find((c) => c.credit === kind)?.artist.name;
  const plotLang = production.plot && production.plot.lang !== locale ? production.plot.lang : undefined;
  const introVideoId = production.introVideo ? youTubeId(production.introVideo.url) : undefined;
  const booking = l(bookingPath(production.slug));

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(productionPath(production.slug), locale, t, [{ href: '/theater', label: t.nav.theater.label }])}
        current={production.shortTitle}
        eyebrow={show.when}
        title={production.shortTitle}
        titleLang={titleLang}
        intro={show.text}
        image={heroImage}
      />

      <section className="section">
        <div className={`container ${styles.layout}`}>
          <SectionNav
            title={t.common.inThisSection}
            items={productions.map((p) => ({
              href: l(productionPath(p.slug)),
              label: p.shortTitle,
              lang: p.titleLang && p.titleLang !== locale ? p.titleLang : undefined,
              current: p.slug === production.slug,
            }))}
          />

          <div className={styles.body}>
            {/* ---------- Media + key facts ---------- */}
            <div className={image?.width && production.image?.kind === 'poster' ? s.spotlight : undefined}>
              {image && production.image?.kind === 'poster' && (
                <div className={s.posterCol}>
                  <LightboxTrigger
                    image={image}
                    className={s.poster}
                    aria-label={format(t.common.enlargePoster, { title: production.shortTitle })}
                    {...reveal({ y: 80 })}
                    {...tilt()}
                  >
                    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 900px) 360px, 92vw" priority />
                    <span className={s.zoomHint} aria-hidden="true">
                      ＋ {t.common.zoom}
                    </span>
                  </LightboxTrigger>
                </div>
              )}
              {image && bodyPhoto && (
                <figure className={styles.photo} {...reveal({ y: 60 })}>
                  <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1180px) 876px, 92vw" priority />
                </figure>
              )}
              <div>
                {production.subtitle ? (
                  <h2 {...reveal()}>
                    <span lang={titleLang}>{production.shortTitle}</span>&nbsp;–
                    <br />
                    <em className={s.accent} lang={titleLang}>
                      {production.subtitle}
                    </em>
                    {'subtitleTranslation' in show && show.subtitleTranslation && (
                      <>
                        <br />
                        <small className={s.tr}>{show.subtitleTranslation}</small>
                      </>
                    )}
                  </h2>
                ) : (
                  <h2 lang={titleLang} {...reveal()}>
                    {show.title}
                  </h2>
                )}
                <ProductionFacts
                  production={production}
                  t={t}
                  credits={{ author: creditName('author'), composer: creditName('composer') }}
                  attrs={reveal(0.1)}
                />
                <div className={s.actions} {...reveal(0.15)}>
                  <Magnet>
                    <Link href={booking} className="btn">
                      {t.showCard.book}
                      <span className="sr-only">: {show.title}</span>
                    </Link>
                  </Magnet>
                </div>
              </div>
            </div>

            {/* ---------- Plot (Read More) ---------- */}
            {production.plot && (
              <div className={styles.plot} {...reveal()}>
                <h2>{t.production.plotH}</h2>
                {plotLang && <p className={styles.langNote}>{t.common.onlyEnglish}</p>}
                <ReadMore blocks={production.plot.blocks} lang={plotLang} labels={{ more: t.common.readMore, less: t.common.readLess }} />
              </div>
            )}

            {/* ---------- Intro video (after the plot, before the cast) ---------- */}
            {introVideoId && (
              <div {...reveal()}>
                <h2>{t.production.introH}</h2>
                <YouTubeVideo
                  id={introVideoId}
                  title={format(t.production.introVideo, { title: production.shortTitle })}
                  fallbackLabel={t.production.watchOnYouTube}
                />
              </div>
            )}

            {/* ---------- Cast ---------- */}
            {cast.length > 0 && (
              <div>
                <h2 {...reveal()}>{t.production.castH}</h2>
                <ul className={styles.cast}>
                  {cast.map(({ artist }, i) => (
                    <li key={artist.slug} {...reveal(i * 0.08)}>
                      <Link href={l(`/artists#${artist.slug}`)} className={styles.castLink}>
                        <div className={styles.castFrame}>
                          {artist.photo ? (
                            <Image
                              src={artist.photo.src}
                              alt=""
                              width={artist.photo.width}
                              height={artist.photo.height}
                              sizes="(min-width: 900px) 220px, 45vw"
                            />
                          ) : (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                              <img src="/img/logo.png" alt="" className={styles.mark} />
                              <span className={styles.initials} aria-hidden="true">
                                {initials(artist.name)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className={styles.castInfo}>
                          <h3>{artist.name}</h3>
                          <p>{t.artists.roles[artist.role]}</p>
                          <span className={styles.more}>
                            {t.production.castLink} <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---------- Dates ---------- */}
            <div id="dates">
              <h2 {...reveal()}>{t.production.datesH}</h2>
              {dates.length > 0 ? (
                <EventList
                  items={dates.map((item) => ({ ...item, href: booking }))}
                  linkLabel={t.showCard.book}
                  srJoin=":"
                />
              ) : (
                <p className={styles.tba} {...reveal()}>
                  {t.production.datesTba}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <p className="eyebrow" {...reveal()}>
            {t.theater.bookEyebrow}
          </p>
          <h2 {...reveal()}>{t.theater.bookH}</h2>
          <FaqList items={t.bookingFaq} {...reveal(0.1)} />
        </div>
      </section>
    </>
  );
}
