import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { EventList } from '@/components/ui/EventList';
import { LightboxTrigger } from '@/components/ui/LightboxTrigger';
import { Magnet } from '@/components/ui/Magnet';
import { PosterText } from '@/components/ui/PosterText';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Term } from '@/components/ui/Term';
import { resolveAgenda } from '@/content/agenda';
import { getArtist } from '@/content/artists';
import { closingPortrait, partners, resolvePoster } from '@/content/media';
import { resolveOffers } from '@/content/offers';
import { bookingPath, featuredProduction, getProduction, productionPath } from '@/content/productions';
import { localizePath } from '@/i18n/config';
import { format } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { reveal, tilt } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import photo from '@/styles/photo-card.module.css';
import { HomeMotion } from './HomeMotion';
import styles from './home.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: await getLocale(), path: '/' });
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const h = t.home;
  const f = t.featured;
  const l = (href: string) => localizePath(href, locale);
  const poster = resolvePoster(t, 'saveTheDate');
  const lightboxImage = { src: poster.src, alt: poster.alt, width: poster.width, height: poster.height };

  // Featured production credits come from the production's cast.
  const production = getProduction(featuredProduction);
  const credit = (kind: 'author' | 'composer') => getArtist(production?.cast.find((c) => c.credit === kind)?.artist ?? '')?.name;

  return (
    <HomeMotion>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <span className={styles.heroTint} aria-hidden="true" />
        <span className={styles.watermarkTrack} aria-hidden="true">
          <span className={styles.watermark}>{h.watermark}</span>
        </span>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <span className="eyebrow">{h.eyebrow}</span>
            <h1>
              {h.h1a} <em>{h.h1b}</em>
            </h1>
            <div className={styles.heroActions}>
              <Magnet>
                <Link href={l('/services')} className="btn">
                  {h.ctaOffers}
                </Link>
              </Magnet>
              <Magnet>
                <Link href={l('/about')} className="btn btn--ghost">
                  {h.ctaAbout}
                </Link>
              </Magnet>
            </div>
          </div>
          <div className={styles.heroLogoParallax}>
            <span className={styles.heroBlob} aria-hidden="true" />
            <div className={styles.heroLogoMouse}>
              <div className={styles.heroLogoWrap}>
                {/* Plain <img> on purpose: like the reference, the box keeps the 520px height attribute
                    while the width follows the column (Next's <Image> warns about that combination). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.heroLogo} src="/img/logo.png" alt="" width={520} height={520} fetchPriority="high" />
              </div>
            </div>
          </div>
        </div>
        <span className={styles.scrollCue} aria-hidden="true">
          <span />
          {h.scroll}
        </span>
      </section>

      {/* ---------- Intro ---------- */}
      <section className="section">
        <div className={`container ${styles.intro}`}>
          <h2 {...reveal()}>{h.introH}</h2>
          <div>
            <ScrollReveal className={`scroll-reveal ${styles.lead}`} text={h.lead} />
            <p {...reveal()}>
              {h.p1a}
              <Term id="decolonial" locale={locale} explained={t.common.explained}>
                {h.p1term}
              </Term>
              {h.p1b}
            </p>
            <p {...reveal(0.1)}>{h.p2}</p>
            <Link href={l('/history')} className="link-arrow" {...reveal(0.2)}>
              {h.history} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Manifest ---------- */}
      <section className={`${styles.manifest} section--rust`} aria-labelledby="manifest-text">
        <div className="container">
          <p id="manifest-text" className="sr-only">
            {h.manifestSr}
          </p>
          <span className={styles.small} aria-hidden="true" {...reveal()}>
            {h.manifestSmall}
          </span>
          <p className={styles.words} aria-hidden="true">
            {h.manifestWords.map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </p>
        </div>
      </section>

      {/* ---------- Ticker ---------- */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>{h.ticker} ✶</span>
          ))}
        </div>
      </div>

      {/* ---------- Featured production ---------- */}
      <section className="section section--sand">
        <div className={`container ${styles.featured}`}>
          <div className={styles.posterCol}>
            <div className={styles.posterWrap}>
              <LightboxTrigger
                image={lightboxImage}
                className={styles.poster}
                aria-label={format(t.common.enlargePoster, { title: `${f.title} ${f.subtitle}` })}
                {...reveal({ y: 80 })}
                {...tilt()}
              >
                <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} sizes="(min-width: 900px) 440px, 78vw" />
                <span className={styles.zoomHint} aria-hidden="true">
                  ＋ {t.common.zoom}
                </span>
              </LightboxTrigger>
              <span className={styles.stamp} aria-hidden="true">
                {h.stamp[0]}
                <br />
                {h.stamp[1]}
              </span>
            </div>
            <PosterText poster="saveTheDate" locale={locale} t={t.posterText} />
          </div>
          <div>
            <span className="eyebrow" {...reveal()}>
              {f.note}
            </span>
            <h2 {...reveal(0.05)}>
              {f.title}
              <br />
              <em lang={locale === 'de' ? undefined : 'de'}>{f.subtitle}</em>
              {f.subtitleTranslation && (
                <>
                  <br />
                  <small className={styles.tr}>{f.subtitleTranslation}</small>
                </>
              )}
            </h2>
            <p className={styles.lead} {...reveal(0.1)}>
              {f.description}
            </p>
            <dl className={styles.facts} {...reveal(0.15)}>
              <div>
                <dt>{f.labels.date}</dt>
                <dd>
                  {f.date} · {f.time}
                </dd>
              </div>
              <div>
                <dt>{f.labels.venue}</dt>
                <dd>
                  {f.venue.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{f.labels.author}</dt>
                <dd>{credit('author')}</dd>
              </div>
              <div>
                <dt>{f.labels.composer}</dt>
                <dd>{credit('composer')}</dd>
              </div>
            </dl>
            <div className={styles.heroActions} {...reveal(0.2)}>
              <Magnet>
                <Link href={l(bookingPath(featuredProduction))} className="btn">
                  {h.book}
                </Link>
              </Magnet>
              <Link href={l(productionPath(featuredProduction))} className="btn btn--ghost">
                {t.showCard.info}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Offers ---------- */}
      <section className={`section ${styles.offersSection}`}>
        <div className="container">
          <span className="eyebrow" {...reveal()}>
            {h.offersEyebrow}
          </span>
          <h2 {...reveal(0.05)}>{h.offersH}</h2>
          <div className={`grid grid--3 ${styles.offers}`}>
            {resolveOffers(t).map((offer, i) => (
              <Link key={offer.id} href={l(offer.href)} className={`card ${photo.card} ${styles.offer}`}>
                <Image
                  className={photo.img}
                  src={offer.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 380px, 92vw"
                  style={{ objectPosition: offer.image.position }}
                />
                <span className={styles.num}>0{i + 1}</span>
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
                <span className="link-arrow">
                  {h.discover} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What's on ---------- */}
      <section className="section section--dark">
        <div className="container">
          <div className={styles.head} {...reveal()}>
            <h2>{h.whatsOn}</h2>
            <Link href={l('/events')} className="link-arrow">
              {h.viewAll} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <EventList
            items={resolveAgenda(t).map((item) => ({ ...item, href: l(item.href) }))}
            linkLabel={t.common.knowMore}
            srJoin={t.common.about}
          />
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      <section className="section">
        <div className="container">
          <span className={`eyebrow ${styles.center}`} {...reveal()}>
            {h.partners}
          </span>
          <div className={styles.partners}>
            {partners.map((partner) => (
              <a key={partner.name} href={partner.href} target="_blank" rel="noopener">
                <Image
                  src={partner.logo.src}
                  alt={partner.name}
                  lang={'lang' in partner ? partner.lang : undefined}
                  width={220}
                  height={220}
                  sizes="200px"
                />
                <span className="sr-only">{t.common.newTab}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Join our community ---------- */}
      <section className="section section--sand">
        <div className={`container ${styles.support}`}>
          <div>
            <h2 {...reveal()}>{h.supportH1}</h2>
          </div>
          <div>
            <p {...reveal()}>{h.support1}</p>
            <div className={styles.heroActions} {...reveal(0.1)}>
              <Magnet>
                <Link href={l('/contact')} className="btn">
                  {h.join}
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Support: portrait fading into the footer (as on the WordPress home page) ---------- */}
      <section id="support" className={styles.closing} aria-labelledby="support-h">
        <div className={styles.closingMedia} aria-hidden="true">
          <Image className={styles.closingImg} src={closingPortrait.src} alt="" fill sizes="100vw" />
        </div>
        <div className={`container ${styles.closingInner}`}>
          <h2 id="support-h" className={styles.closingLabel} {...reveal()}>
            <span aria-hidden="true">|| </span>
            {h.supportH2.replace(/^\|\|\s*/, '')}
          </h2>
          <div className={styles.closingBody}>
            <p {...reveal(0.1)}>{h.support2}</p>
            <div {...reveal(0.2)}>
              <Magnet>
                <Link href={l('/contact')} className={`btn ${styles.closingBtn}`}>
                  {h.donate}
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </section>
    </HomeMotion>
  );
}
