import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/ui/FaqList';
import { LightboxTrigger } from '@/components/ui/LightboxTrigger';
import { Magnet } from '@/components/ui/Magnet';
import { PageHero } from '@/components/ui/PageHero';
import { PosterText } from '@/components/ui/PosterText';
import { ShowCard } from '@/components/ui/ShowCard';
import { Term } from '@/components/ui/Term';
import { getArtist } from '@/content/artists';
import { resolveEvents } from '@/content/events';
import { resolvePoster } from '@/content/media';
import { offerImages } from '@/content/offers';
import { bookingPath, featuredProduction, getProduction, productionPath } from '@/content/productions';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal, tilt } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import s from '@/styles/spotlight.module.css';

const PATH = '/theater';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    path: PATH,
    title: t.meta.titles.theater,
    description: t.theater.title,
    image: { ...resolvePoster(t, 'saveTheDate') },
  });
}

export default async function TheaterPage() {
  const { locale, t } = await getI18n();
  const th = t.theater;
  const f = t.featured;
  const l = (href: string) => localizePath(href, locale);
  const std = resolvePoster(t, 'saveTheDate');
  const dmb = getProduction(featuredProduction);
  const upcoming = resolveEvents(t, locale).filter((event) => event.category === 'theater');
  const credit = (kind: 'author' | 'composer') => getArtist(dmb?.cast.find((c) => c.credit === kind)?.artist ?? '')?.name;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.theater}
        eyebrow={th.eyebrow}
        title={th.title}
        image={offerImages.performance}
      />

      {/* ---------- Save the date: first public reading ---------- */}
      <section className="section">
        <div className={`container ${s.spotlight}`}>
          <div className={s.posterCol}>
            <LightboxTrigger
              image={std}
              className={s.poster}
              aria-label={format(t.common.enlargePoster, { title: `${f.title} ${f.subtitle}` })}
              {...reveal({ y: 80 })}
              {...tilt()}
            >
              <Image src={std.src} alt={std.alt} width={std.width} height={std.height} sizes="(min-width: 900px) 460px, 92vw" priority />
              <span className={s.zoomHint} aria-hidden="true">
                ＋ {t.common.zoom}
              </span>
            </LightboxTrigger>
            <PosterText poster="saveTheDate" locale={locale} t={t.posterText} />
          </div>
          <div>
            <span className="eyebrow" {...reveal()}>
              {th.std.eyebrow}
            </span>
            <h2 {...reveal(0.05)}>
              Douala Manga Bell&nbsp;–
              <br />
              <em className={s.accent} lang={locale === 'de' ? undefined : 'de'}>
                Der König der sein Recht wollte
              </em>
              {f.subtitleTranslation && (
                <>
                  <br />
                  <small className={s.tr}>{f.subtitleTranslation}</small>
                </>
              )}
            </h2>
            <div className={s.date} role="img" aria-label={f.dateLong} {...reveal(0.1)}>
              <span>13</span>
              <i />
              <span>12</span>
              <i />
              <span>26</span>
            </div>
            <dl className={s.facts} {...reveal(0.15)}>
              <div>
                <dt>{f.labels.time}</dt>
                <dd>{f.time}</dd>
              </div>
              <div>
                <dt>{f.labels.venue}</dt>
                <dd>
                  Miriam Makeba Saal
                  <br />
                  Am Sudhaus 2, 12053 Berlin
                  <br />
                  <Term id="global-village" locale={locale} explained={t.common.explained}>
                    Berlin Global Village
                  </Term>
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
            <div className={s.actions} {...reveal(0.2)}>
              <Magnet>
                <Link href={l(bookingPath(featuredProduction))} className="btn">
                  {th.std.reserve}
                </Link>
              </Magnet>
              <Link href={l(productionPath(featuredProduction))} className="btn btn--ghost">
                {t.showCard.info}
              </Link>
            </div>
            <p className={s.credit} {...reveal(0.25)}>
              {th.std.credit}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Upcoming events (theatre only; same list as "All events") ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="eyebrow" {...reveal()}>
            {th.upcomingH}
          </h2>
          <div className="grid grid--3">
            {upcoming.map((event, i) => (
              <ShowCard
                key={event.id}
                when={event.when}
                title={event.title}
                titleLang={event.titleLang}
                subtitle={event.subtitle}
                text={event.text}
                bookHref={event.primary.href}
                infoHref={event.secondary.href}
                labels={{ book: event.primary.label, info: event.secondary.label }}
                attrs={reveal(i * 0.1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Before you book ---------- */}
      <section className="section section--sand">
        <div className="container">
          <p className="eyebrow" {...reveal()}>
            {th.bookEyebrow}
          </p>
          <h2 {...reveal()}>{th.bookH}</h2>
          <FaqList items={t.bookingFaq} {...reveal(0.1)} />
        </div>
      </section>
    </>
  );
}
