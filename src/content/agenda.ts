import type { Messages } from '@/i18n/messages';
import type { EventCategory, ProductionSlug } from './productions';

/**
 * Dated agenda entries ("What's on", production dates, Theater "Upcoming events",
 * "All events"). Date labels and titles are translated in `messages.events`.
 * Entries that are not a production carry their own `category`.
 * Event cards show the occurrence title ("Public theatre reading") with the
 * production underneath, unless `cardTitle: 'production'` asks for the
 * production's full title (the production's own run).
 */
export const agenda = [
  { id: 'reading', href: '/theater', production: 'douala-manga-bell' },
  { id: 'performance', href: '/theater', production: 'douala-manga-bell', cardTitle: 'production' },
  // Theater & Geschichte belongs to the MeMo workshops (Artistic page).
  { id: 'youth', href: '/artistic#youth', category: 'workshop' },
] as const satisfies readonly {
  id: keyof Messages['events'];
  href: string;
  production?: ProductionSlug;
  category?: EventCategory;
  cardTitle?: 'production';
}[];

export interface AgendaItem {
  id: string;
  href: string;
  date: string;
  title: string;
}

export function resolveAgenda(t: Messages, production?: ProductionSlug): AgendaItem[] {
  return agenda
    .filter((entry) => !production || ('production' in entry && entry.production === production))
    .map((entry) => ({ id: entry.id, href: entry.href, ...t.events[entry.id] }));
}
