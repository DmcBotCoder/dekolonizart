'use client';

import { useId, useRef, useState } from 'react';
import { ShowCard } from '@/components/ui/ShowCard';
import type { EventItem } from '@/content/events';
import { matchesQuery } from '@/lib/search';
import styles from './events.module.css';

interface EventSearchProps {
  events: EventItem[];
  labels: {
    search: string;
    placeholder: string;
    count: string;
    countOne: string;
    noResults: string;
    reset: string;
  };
}

/** Search field + the list of event cards it filters (by name, date or category; accents and case ignored). */
export function EventSearch({ events, labels }: EventSearchProps) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const visible = events.filter((event) => matchesQuery(event.search, query));

  const status =
    visible.length === 0
      ? labels.noResults.replace('{q}', query.trim())
      : visible.length === 1
        ? labels.countOne
        : labels.count.replace('{n}', String(visible.length));

  return (
    <>
      <form role="search" className={styles.search} onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={id}>{labels.search}</label>
        <input
          ref={input}
          id={id}
          type="search"
          value={query}
          placeholder={labels.placeholder}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      <p className={styles.status} role="status">
        {status}
      </p>

      {visible.length === 0 ? (
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setQuery('');
            input.current?.focus();
          }}
        >
          {labels.reset}
        </button>
      ) : (
        <ul className={`grid grid--3 ${styles.list}`}>
          {visible.map((event) => (
            <li key={event.id}>
              <ShowCard
                when={event.when}
                tag={event.categoryLabel}
                title={event.title}
                titleLang={event.titleLang}
                subtitle={event.subtitle}
                text={event.text}
                bookHref={event.primary.href}
                infoHref={event.secondary.href}
                labels={{ book: event.primary.label, info: event.secondary.label }}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
