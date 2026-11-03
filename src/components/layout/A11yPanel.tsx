'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import {
  defaultA11ySettings,
  getA11yServerSnapshot,
  getA11ySnapshot,
  isDefaultA11y,
  subscribeA11y,
  updateA11ySettings,
  type A11yToggle,
  type TextSize,
} from '@/lib/a11y-settings';
import { isReducedMotion, reducedMotionServerSnapshot, setReducedMotion, subscribeNever } from '@/lib/motion/state';
import styles from './A11yPanel.module.css';

const SIZES: TextSize[] = [100, 125, 150];
const SIZE_GLYPH: Record<TextSize, string> = { 100: '1rem', 125: '1.2rem', 150: '1.4rem' };
const TOGGLES: A11yToggle[] = ['contrast', 'readableFont', 'spacing', 'underline'];

export function A11yPanel({ locale, t }: { locale: Locale; t: Messages['a11y'] }) {
  const [open, setOpen] = useState(false);
  // Settings were applied before first paint by the boot script; read them without a hydration mismatch.
  const settings = useSyncExternalStore(subscribeA11y, getA11ySnapshot, getA11yServerSnapshot);
  const reduced = useSyncExternalStore(subscribeNever, isReducedMotion, reducedMotionServerSnapshot);
  const [said, setSaid] = useState('');
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  const update = updateA11ySettings;

  const announce = (text: string) => {
    setSaid('');
    requestAnimationFrame(() => setSaid(text));
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('input, button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) close(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const custom = !isDefaultA11y(settings) || reduced;

  return (
    <div className={styles.a11y}>
      <button
        ref={button}
        type="button"
        className={styles.btn}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path
            d="M4 8.5c2.7.8 5.3 1.2 8 1.2s5.3-.4 8-1.2M12 9.7v4.6m0 0-3 6.2m3-6.2 3 6.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.label}>{t.button}</span>
        {custom && <span className={styles.badge} aria-hidden="true" />}
        {custom && <span className="sr-only">{t.custom}</span>}
      </button>

      <section
        id="a11y-panel"
        ref={panel}
        className={styles.panel}
        aria-labelledby="a11y-title"
        hidden={!open}
        data-a11y-panel=""
        data-lenis-prevent=""
      >
        <h2 id="a11y-title">{t.title}</h2>
        <p className={styles.hint}>{t.hint}</p>

        <fieldset>
          <legend>{t.textSize}</legend>
          <div className={styles.seg}>
            {SIZES.map((size) => (
              <label key={size} className={settings.textSize === size ? styles.on : undefined}>
                <input
                  type="radio"
                  name="a11y-size"
                  value={size}
                  checked={settings.textSize === size}
                  onChange={() => {
                    update({ ...settings, textSize: size });
                    announce(t.sizeSaid.replace('{n}', String(size)));
                  }}
                />
                <span style={{ fontSize: SIZE_GLYPH[size] }} aria-hidden="true">
                  A
                </span>
                <span className="sr-only">{size} %</span>
                <span className={styles.pct} aria-hidden="true">
                  {size}%
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <ul className={styles.switches}>
          {TOGGLES.map((key) => (
            <li key={key}>
              <button
                type="button"
                role="switch"
                aria-checked={settings[key]}
                onClick={() => {
                  const value = !settings[key];
                  update({ ...settings, [key]: value });
                  announce(`${t[key].label} ${value ? t.on : t.off}`);
                }}
              >
                <span className={styles.track} aria-hidden="true">
                  <i />
                </span>
                <span>
                  <strong>{t[key].label}</strong>
                  <small>{t[key].desc}</small>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" role="switch" aria-checked={reduced} onClick={() => setReducedMotion(!reduced)}>
              <span className={styles.track} aria-hidden="true">
                <i />
              </span>
              <span>
                <strong>{t.motion.label}</strong>
                <small>{t.motion.desc}</small>
              </span>
            </button>
          </li>
        </ul>

        <ul className={styles.more}>
          {(
            [
              ['/easy-read', t.easy],
              ['/glossary', t.glossary],
              ['/accessibility', t.statement],
            ] as const
          ).map(([href, label]) => (
            <li key={href}>
              <Link href={localizePath(href, locale)} onClick={() => close(false)}>
                {label} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              update({ ...defaultA11ySettings });
              announce(t.resetSaid);
              if (reduced) setReducedMotion(false);
            }}
          >
            {t.reset}
          </button>
          <button type="button" className={styles.done} onClick={() => close()}>
            {t.close}
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {said}
        </p>
      </section>
    </div>
  );
}
