import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/ui/PageHero';
import { ReadMore } from '@/components/ui/ReadMore';
import { artists } from '@/content/artists';
import { initials } from '@/content/team';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';
import styles from './artists.module.css';

const PATH = '/artists';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.artists, description: t.artists.eyebrow });
}

export default async function ArtistsPage() {
  const { locale, t } = await getI18n();

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t, [{ href: '/theater', label: t.nav.theater.label }])}
        current={t.meta.titles.artists}
        eyebrow={t.artists.eyebrow}
        title={t.artists.title}
      />
      <section className="section">
        <div className={`container ${styles.list}`}>
          {artists.map((artist) => {
            const bioLang = artist.bio && artist.bio.lang !== locale ? artist.bio.lang : undefined;
            return (
              // Stable slug anchors: /artists#ngako-keuni (never list positions).
              <article key={artist.slug} id={artist.slug} className={styles.artist} tabIndex={-1} aria-labelledby={`${artist.slug}-name`}>
                <div className={styles.frame} {...reveal({ y: 60 })}>
                  {artist.photo ? (
                    <Image
                      src={artist.photo.src}
                      alt={format(t.team.portraitOf, { name: artist.name })}
                      width={artist.photo.width}
                      height={artist.photo.height}
                      sizes="(min-width: 1180px) 460px, (min-width: 900px) 38vw, 92vw"
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
                <div>
                  <span className={styles.role} {...reveal()}>
                    {t.artists.roles[artist.role]}
                  </span>
                  <h2 id={`${artist.slug}-name`} className={styles.name} {...reveal(0.05)}>
                    {artist.name}
                    {artist.location && ` · ${artist.location}`}
                  </h2>
                  {artist.bio && (
                    <div className={styles.bio} {...reveal(0.1)}>
                      {bioLang && <p className={styles.langNote}>{t.common.onlyGerman}</p>}
                      <ReadMore
                        blocks={artist.bio.paragraphs.map((text) => ({ kind: 'p' as const, text }))}
                        lang={bioLang}
                        labels={{ more: t.common.readMore, less: t.common.readLess }}
                      />
                    </div>
                  )}
                  {artist.website && (
                    <p className={styles.website} {...reveal(0.15)}>
                      <a href={artist.website} className="link-arrow" target="_blank" rel="noopener">
                        {format(t.artists.website, { name: artist.name.split(' ')[0] })}
                        <span className="sr-only">{t.common.newTab}</span> <span aria-hidden="true">→</span>
                      </a>
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
