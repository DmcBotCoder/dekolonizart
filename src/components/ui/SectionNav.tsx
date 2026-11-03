'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import styles from './SectionNav.module.css';

interface SectionNavProps {
  title: string;
  items: { href: string; label: string; lang?: string; current: boolean }[];
}

/**
 * Contextual navigation between related pages ("In this section").
 * Desktop: sticky sidebar. Mobile: an in-flow disclosure – the list takes
 * real vertical space when opened and the content below moves down.
 */
export function SectionNav({ title, items }: SectionNavProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <nav className={styles.nav} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <svg className={styles.chev} width="12" height="12" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div id={`${id}-list`} className={`${styles.panel} ${open ? styles.open : ''}`}>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={item.current ? styles.current : undefined}
                aria-current={item.current ? 'page' : undefined}
                lang={item.lang}
              >
                <span className={styles.marker} aria-hidden="true">
                  ›
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
