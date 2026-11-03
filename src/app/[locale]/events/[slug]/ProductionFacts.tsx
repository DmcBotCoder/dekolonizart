import type { Production } from '@/content/productions';
import { venue } from '@/content/site';
import type { Messages } from '@/i18n/messages';
import s from '@/styles/spotlight.module.css';
import styles from './production.module.css';

interface ProductionFactsProps {
  production: Production;
  t: Messages;
  credits?: { author?: string; composer?: string };
  attrs?: Record<`data-${string}`, string>;
}

/** Date, venue (with map link) and optional credits – shared by the information and booking pages. */
export function ProductionFacts({ production, t, credits = {}, attrs }: ProductionFactsProps) {
  const labels = t.featured.labels;
  return (
    <dl className={s.facts} {...attrs}>
      <div>
        <dt>{labels.date}</dt>
        <dd>{t.shows[production.slug].when}</dd>
      </div>
      {production.atCurrentVenue && (
        <div>
          <dt>{labels.venue}</dt>
          <dd>
            {venue.name}
            <br />
            {venue.street}, {venue.city}
            <br />
            {venue.place}
            <br />
            <a className={styles.mapLink} href={venue.mapUrl} target="_blank" rel="noopener">
              {t.common.showOnMap}
              <span className="sr-only">{t.common.newTab}</span>
            </a>
          </dd>
        </div>
      )}
      {credits.author && (
        <div>
          <dt>{labels.author}</dt>
          <dd>{credits.author}</dd>
        </div>
      )}
      {credits.composer && (
        <div>
          <dt>{labels.composer}</dt>
          <dd>{credits.composer}</dd>
        </div>
      )}
    </dl>
  );
}
