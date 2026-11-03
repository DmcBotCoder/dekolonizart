import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaqList } from '@/components/ui/FaqList';
import { LightboxTrigger } from '@/components/ui/LightboxTrigger';
import { Magnet } from '@/components/ui/Magnet';
import { PageHero } from '@/components/ui/PageHero';
import { resolvePoster } from '@/content/media';
import { bookingPath, getProduction, productionPath, productions, resolveBooking } from '@/content/productions';
import { site } from '@/content/site';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal, tilt } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import s from '@/styles/spotlight.module.css';
import { ProductionFacts } from '../ProductionFacts';
import styles from './booking.module.css';

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
  return buildMetadata({
    locale,
    path: bookingPath(production.slug),
    title: format(t.booking.pageTitle, { title: production.shortTitle }),
    description: t.shows[production.slug].text,
    image: production.image ? resolvePoster(t, production.image.key) : undefined,
  });
}

/**
 * Booking page of a production – the destination of every booking button.
 * With a configured ticket link it hands over to the provider (Vibetix);
 * without one it says so and offers reservation by e-mail.
 */
export default async function BookingPage({ params }: Props) {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) notFound();

  const { locale, t } = await getI18n();
  const b = t.booking;
  const show = t.shows[production.slug];
  const titleLang = production.titleLang && production.titleLang !== locale ? production.titleLang : undefined;
  const poster = production.image?.kind === 'poster' ? resolvePoster(t, production.image.key) : undefined;
  const online = resolveBooking(production);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(format(b.emailSubject, { title: production.shortTitle }))}`;
  const [beforeEmail, afterEmail] = b.byEmail.split('{email}');

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(bookingPath(production.slug), locale, t, [
          { href: '/theater', label: t.nav.theater.label },
          { href: productionPath(production.slug), label: production.shortTitle },
        ])}
        current={b.eyebrow}
        eyebrow={b.eyebrow}
        title={production.shortTitle}
        titleLang={titleLang}
      />

      <section className="section">
        <div className={poster ? `container ${s.spotlight}` : 'container'}>
          {poster && (
            <div className={s.posterCol}>
              <LightboxTrigger
                image={poster}
                className={s.poster}
                aria-label={format(t.common.enlargePoster, { title: production.shortTitle })}
                {...reveal({ y: 80 })}
                {...tilt()}
              >
                <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} sizes="(min-width: 900px) 460px, 92vw" priority />
                <span className={s.zoomHint} aria-hidden="true">
                  ＋ {t.common.zoom}
                </span>
              </LightboxTrigger>
            </div>
          )}
          <div className={poster ? undefined : styles.single}>
            <h2 {...reveal()}>{b.title}</h2>
            <ProductionFacts production={production} t={t} attrs={reveal(0.05)} />
            {online ? (
              <div className={styles.panel} {...reveal(0.1)}>
                <p>{format(b.provider, { provider: online.provider })}</p>
                <div className={s.actions}>
                  <Magnet>
                    <a className="btn" href={online.url} target="_blank" rel="noopener">
                      {b.continue}
                      <span className="sr-only">
                        : {show.title} {t.common.newTab}
                      </span>
                    </a>
                  </Magnet>
                </div>
              </div>
            ) : (
              <div className={styles.panel} {...reveal(0.1)}>
                <p className={styles.status}>{b.unavailable}</p>
                <p>
                  {beforeEmail}
                  <a className={styles.mail} href={mailto}>
                    {site.email}
                  </a>
                  {afterEmail}
                </p>
                <div className={s.actions}>
                  <Magnet>
                    <a className="btn" href={mailto}>
                      {b.emailCta}
                    </a>
                  </Magnet>
                </div>
              </div>
            )}
            <Link href={localizePath(productionPath(production.slug), locale)} className="link-arrow" {...reveal(0.15)}>
              {t.showCard.info}
              <span className="sr-only">: {show.title}</span> <span aria-hidden="true">→</span>
            </Link>
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
