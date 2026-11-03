'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LOCALE_STORAGE_KEY, localeInfo, locales, localizePath, splitLocale, type Locale } from '@/i18n/config';
import { SKIP_INTRO_KEY } from '@/lib/motion/state';
import styles from './NoticeBar.module.css';

/**
 * EN / DE / FR switch. Keeps the current page and hash, remembers the choice
 * (so a later visit to "/" honours it) and skips the intro on the reload that
 * a change of root layout causes.
 */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const { path } = splitLocale(usePathname());
  const [hash, setHash] = useState('');

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [path]);

  const remember = (code: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
      if (code !== current) sessionStorage.setItem(SKIP_INTRO_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <nav className={styles.lang} aria-label={label}>
      <ul>
        {locales.map((code) => (
          <li key={code}>
            {/* Plain <a>: switching language swaps the root layout, so this is a full document load. */}
            <a
              href={localizePath(path + hash, code)}
              lang={code}
              hrefLang={code}
              aria-current={code === current ? 'true' : undefined}
              className={code === current ? styles.on : undefined}
              onClick={() => remember(code)}
            >
              <span aria-hidden="true">{localeInfo[code].short}</span>
              <span className="sr-only">{localeInfo[code].name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
