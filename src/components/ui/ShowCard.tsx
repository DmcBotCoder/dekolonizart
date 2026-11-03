import Link from 'next/link';
import styles from './ShowCard.module.css';

interface ShowCardProps {
  when: string;
  /** Category tag shown next to the date ("All events" page). */
  tag?: string;
  title: string;
  titleLang?: string;
  /** Line under the title, e.g. which performance of a production. */
  subtitle?: string;
  text: string;
  bookHref: string;
  infoHref: string;
  labels: { book: string; info: string };
  attrs?: Record<`data-${string}`, string>;
}

/** Event card ("Upcoming events", "All events"): date, title, teaser, primary + information buttons. */
export function ShowCard({ when, tag, title, titleLang, subtitle, text, bookHref, infoHref, labels, attrs }: ShowCardProps) {
  return (
    <article className={styles.show} {...attrs}>
      {tag ? (
        <div className={styles.meta}>
          <span className={styles.when}>{when}</span>
          <span className={styles.tag}>{tag}</span>
        </div>
      ) : (
        <span className={styles.when}>{when}</span>
      )}
      <h3 lang={titleLang}>{title}</h3>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      <p>{text}</p>
      <div className={styles.actions}>
        <Link href={bookHref} className="btn">
          {labels.book}
          <span className="sr-only">: {title}</span>
        </Link>
        <Link href={infoHref} className="btn btn--ghost">
          {labels.info}
          <span className="sr-only">: {title}</span>
        </Link>
      </div>
    </article>
  );
}
