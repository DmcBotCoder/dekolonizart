import Link from 'next/link';
import type { ReactNode } from 'react';
import { localizePath, type Locale } from '@/i18n/config';
import styles from './Term.module.css';

interface TermProps {
  id: string;
  locale: Locale;
  explained: string;
  children: ReactNode;
}

/** Inline link from a technical word to its glossary entry. */
export function Term({ id, locale, explained, children }: TermProps) {
  return (
    <Link href={localizePath(`/glossary#${id}`, locale)} className={styles.term}>
      {children}
      <span className="sr-only">{explained}</span>
    </Link>
  );
}
