import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { normalizeForSearch } from '@/lib/search';
import { agenda } from './agenda';
import { bookingPath, productionPath, productions, type EventCategory, type Production, type ProductionSlug } from './productions';

/** One card of the "All events" page – plain data, handed to the client-side search. */
export interface EventItem {
  id: string;
  category: EventCategory;
  categoryLabel: string;
  when: string;
  title: string;
  titleLang?: string;
  subtitle?: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  /** Normalised text the search looks in (names, subtitles, date, category). */
  search: string;
}

/**
 * Every event, in agenda order: the dated entries ("What's on") followed by
 * the productions that have no date yet. Production events link to the same
 * booking and information pages as everywhere else on the site. The Theater
 * page shows the `theater` ones, the "All events" page all of them.
 */
export function resolveEvents(t: Messages, locale: Locale): EventItem[] {
  const l = (href: string) => localizePath(href, locale);
  const otherLang = (lang?: Locale) => (lang && lang !== locale ? lang : undefined);
  const searchable = (...parts: (string | undefined)[]) => normalizeForSearch(parts.filter(Boolean).join(' '));

  /** `occurrence` names one dated performance; without it the card shows the production's full title. */
  const fromProduction = (id: string, production: Production, when: string, occurrence?: { title: string; asSubtitle: boolean }): EventItem => {
    const show = t.shows[production.slug];
    const categoryLabel = t.allEvents.categories[production.category];
    const titledByOccurrence = occurrence && !occurrence.asSubtitle;
    const subtitle = occurrence ? (occurrence.asSubtitle ? occurrence.title : production.shortTitle) : undefined;
    return {
      id,
      category: production.category,
      categoryLabel,
      when,
      title: titledByOccurrence ? occurrence.title : show.title,
      titleLang: titledByOccurrence ? undefined : otherLang(production.titleLang),
      subtitle,
      text: show.text,
      primary: { href: l(bookingPath(production.slug)), label: t.showCard.book },
      secondary: { href: l(productionPath(production.slug)), label: t.showCard.info },
      search: searchable(production.shortTitle, show.title, production.subtitle, occurrence?.title, when, categoryLabel),
    };
  };

  const dated = agenda.flatMap((entry): EventItem[] => {
    const occurrence = t.events[entry.id];
    if ('production' in entry) {
      const production = productions.find((p) => p.slug === entry.production);
      const asSubtitle = 'cardTitle' in entry && entry.cardTitle === 'production';
      return production ? [fromProduction(entry.id, production, occurrence.date, { title: occurrence.title, asSubtitle })] : [];
    }
    // Theater & Geschichte – the youth workshop of MeMo (sign-up, not ticketed).
    const youth = t.artistic.youth;
    const categoryLabel = t.allEvents.categories[entry.category];
    return [
      {
        id: entry.id,
        category: entry.category,
        categoryLabel,
        when: occurrence.date,
        title: youth.h2,
        titleLang: otherLang('de'),
        subtitle: occurrence.title,
        text: youth.lead,
        primary: { href: l('/contact'), label: youth.cta },
        secondary: { href: l(entry.href), label: t.common.knowMore },
        search: searchable(youth.h2, youth.h2Translation, occurrence.title, occurrence.date, categoryLabel),
      },
    ];
  });

  const withDates = new Set<ProductionSlug>(agenda.flatMap((entry) => ('production' in entry ? [entry.production] : [])));
  const undated = productions
    .filter((production) => !withDates.has(production.slug))
    .map((production) => fromProduction(production.slug, production, t.shows[production.slug].when));

  return [...dated, ...undated];
}
