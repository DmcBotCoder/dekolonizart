'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import { isReducedMotion, reducedMotionServerSnapshot, setReducedMotion, subscribeNever } from '@/lib/motion/state';
import styles from './SiteFooter.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterLabels {
  heading: string;
  emailLabel: string;
  send: string;
  thanks: string;
  errEmpty: string;
  errInvalid: string;
}

/**
 * Newsletter sign-up. Like the reference it only validates: no mailing
 * service is connected yet (see the privacy policy), nothing is sent.
 */
export function NewsletterForm({ labels }: { labels: NewsletterLabels }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(false);
    const email = value.trim();
    if (!email) setError(labels.errEmpty);
    else if (!EMAIL.test(email)) setError(labels.errInvalid);
    else {
      setError('');
      setDone(true);
      setValue('');
      return;
    }
    document.getElementById('nl-email')?.focus();
  };

  return (
    <>
      <h2 id="f-news">{labels.heading}</h2>
      <form className={styles.news} aria-labelledby="f-news" noValidate onSubmit={submit}>
        <label className="sr-only" htmlFor="nl-email">
          {labels.emailLabel}
        </label>
        <input
          id="nl-email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'nl-err' : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="btn" type="submit">
          {labels.send}
        </button>
      </form>
      {error && (
        <p id="nl-err" className={styles.err}>
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
      <p className={styles.ok} role="status">
        {done ? labels.thanks : ''}
      </p>
    </>
  );
}

export function MotionToggle({ label, on, off }: { label: string; on: string; off: string }) {
  const reduced = useSyncExternalStore(subscribeNever, isReducedMotion, reducedMotionServerSnapshot);

  return (
    <button className={styles.motionToggle} type="button" aria-pressed={reduced} onClick={() => setReducedMotion(!reduced)}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
      <span aria-hidden="true">: {reduced ? on : off}</span>
    </button>
  );
}
