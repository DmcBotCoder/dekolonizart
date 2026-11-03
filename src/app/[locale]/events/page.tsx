import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { resolveEvents } from '@/content/events';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { EventSearch } from './EventSearch';

const PATH = '/events';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.events, description: t.allEvents.title });
}

/** All events – theatre, workshops, movement & dance – with a search field. */
export default async function EventsPage() {
  const { locale, t } = await getI18n();
  const e = t.allEvents;

  return (
    <>
      <PageHero
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.events}
        eyebrow={e.eyebrow}
        title={e.title}
      />
      <section className="section">
        <div className="container">
          <EventSearch
            events={resolveEvents(t, locale)}
            labels={{
              search: e.searchLabel,
              placeholder: e.searchPlaceholder,
              count: e.count,
              countOne: e.countOne,
              noResults: e.noResults,
              reset: e.reset,
            }}
          />
        </div>
      </section>
    </>
  );
}
