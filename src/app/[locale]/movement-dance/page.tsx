import type { Metadata } from 'next';
import { FaqList } from '@/components/ui/FaqList';
import { PageHero } from '@/components/ui/PageHero';
import { ShowCard } from '@/components/ui/ShowCard';
import { offerImages } from '@/content/offers';
import { bookingPath, productionPath, productions } from '@/content/productions';
import { localizePath } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { reveal } from '@/lib/motion/attrs';
import { buildMetadata } from '@/lib/seo';

const PATH = '/movement-dance';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.movement, description: t.movement.intro });
}

export default async function MovementDancePage() {
  const { locale, t } = await getI18n();
  const m = t.movement;
  const l = (href: string) => localizePath(href, locale);

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.movement}
        eyebrow={m.eyebrow}
        title={m.title}
        intro={m.intro}
        image={offerImages.movement}
      />
      <section className="section" aria-labelledby="up-h">
        <h2 id="up-h" className="sr-only">
          {m.upcomingH}
        </h2>
        <div className="container grid grid--3">
          {productions.map((production, i) => (
            <ShowCard
              key={production.slug}
              {...t.shows[production.slug]}
              titleLang={production.titleLang !== locale ? production.titleLang : undefined}
              bookHref={l(bookingPath(production.slug))}
              infoHref={l(productionPath(production.slug))}
              labels={t.showCard}
              attrs={reveal(i * 0.1)}
            />
          ))}
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <h2 {...reveal()}>{m.faqH}</h2>
          <FaqList items={t.faq} {...reveal(0.1)} />
        </div>
      </section>
    </>
  );
}
