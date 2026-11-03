import Link from 'next/link';
import { reveal } from '@/lib/motion/attrs';
import styles from './EventList.module.css';

interface EventListProps {
  items: { id: string; date: string; title: string; href: string }[];
  linkLabel: string;
  /** Word joining the link label and the event title for screen readers ("about"). */
  srJoin: string;
}

/** Agenda rows: date (display font), title, "Know more" link. */
export function EventList({ items, linkLabel, srJoin }: EventListProps) {
  return (
    <ul className={styles.events}>
      {items.map((item, index) => (
        <li key={item.id} {...reveal(index * 0.08)}>
          <span className={styles.date}>{item.date}</span>
          <span className={styles.title}>{item.title}</span>
          <Link href={item.href} className="link-arrow">
            {linkLabel}
            <span className="sr-only">
              {srJoin} {item.title}
            </span>{' '}
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
