'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { isReducedMotion, lockScroll, markIntroDone, setBackgroundInert, shouldSkipIntro } from '@/lib/motion/state';
import styles from './Preloader.module.css';

const COLUMNS = 6;
const PRELOAD = ['/img/logo.png', '/img/partners/conservatoire.png', '/img/partners/casa.png'];

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

interface PreloaderProps {
  loading: string;
  skip: string;
  words: string[];
}

/**
 * Intro shown on every full page load (the reference's "bold" intro).
 * Rendered on the server so it covers the page before hydration; hidden by
 * CSS when motion is reduced or the intro was skipped (language switch).
 */
export function Preloader({ loading, skip, words }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el || isReducedMotion() || shouldSkipIntro()) {
      markIntroDone();
      setVisible(false);
      return;
    }

    el.style.animation = 'none'; // the script is running: cancel the CSS failsafe
    lockScroll(true);
    setBackgroundInert(true);
    const brand = document.querySelector<HTMLElement>('[data-brand-mark]');
    if (brand) gsap.set(brand, { autoAlpha: 0 });

    let finished = false;
    const release = () => {
      if (brand) gsap.set(brand, { autoAlpha: 1 });
      lockScroll(false);
      setBackgroundInert(false);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      ctx.revert();
      release();
      markIntroDone();
      setVisible(false);
      document.getElementById('main')?.focus({ preventScroll: true });
    };
    finishRef.current = finish;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);

    const q = gsap.utils.selector(el);
    const fill = q(`.${styles.fill}`)[0] as HTMLElement;
    const setBar = gsap.quickSetter(q(`.${styles.bar} i`)[0], 'scaleX');
    const progress = { v: 0 };
    let shown = -1;
    const render = () => {
      const value = Math.round(progress.v);
      if (value !== shown && count.current) {
        count.current.textContent = String(value);
        shown = value;
      }
      fill.style.clipPath = `inset(${100 - progress.v}% 0 0 0)`;
      setBar(progress.v / 100);
    };

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from(q(`.${styles.ghost}`), { scale: 0.6, autoAlpha: 0, rotation: -25, duration: 1.2, ease: 'expo.out' })
        .from(q(`.${styles.count}`), { yPercent: 100, duration: 1, ease: 'expo.out' }, 0.1)
        .from(q(`.${styles.meta} > *`), { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.2);

      const loop = gsap.timeline({ repeat: -1 });
      q(`.${styles.word}`).forEach((word) => {
        loop
          .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' })
          .to(word, { yPercent: -110, duration: 0.4, ease: 'expo.in' }, '+=0.35');
      });
    }, el);

    const toEighty = new Promise<void>((resolve) =>
      ctx.add(() => gsap.to(progress, { v: 85, duration: 2, ease: 'power2.inOut', onUpdate: render, onComplete: resolve })),
    );

    Promise.all([document.fonts.ready, ...PRELOAD.map(preloadImage), toEighty]).then(async () => {
      if (finished) return;
      await new Promise<void>((resolve) =>
        ctx.add(() => gsap.to(progress, { v: 100, duration: 0.6, ease: 'power3.out', onUpdate: render, onComplete: resolve })),
      );
      if (finished) return;
      ctx.add(() => {
        const logo = q(`.${styles.logo}`)[0];
        const from = logo.getBoundingClientRect();
        const to = brand?.getBoundingClientRect();
        const exit = gsap.timeline({
          onComplete: () => {
            finished = true;
            release();
            setVisible(false);
          },
        });
        exit
          .to(logo, { scale: 1.12, duration: 0.25, ease: 'power2.out' })
          .to(logo, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
          .to(q(`.${styles.count}, .${styles.meta}, .${styles.bar}`), {
            yPercent: 120,
            autoAlpha: 0,
            duration: 0.6,
            ease: 'expo.in',
            stagger: 0.05,
          }, '<')
          .to(q(`.${styles.ghost}`), { autoAlpha: 0, duration: 0.3 }, '<')
          .to(q(`.${styles.colA}`), { yPercent: -100, duration: 1, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } }, '-=0.1')
          .to(q(`.${styles.colB}`), { yPercent: -100, duration: 1, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } }, '-=0.75')
          .call(markIntroDone, undefined, '-=0.6');
        if (to && to.width) {
          exit.to(
            logo,
            {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              scale: to.width / from.width,
              rotation: 360,
              duration: 1.3,
              ease: 'expo.inOut',
            },
            1,
          );
        } else {
          exit.to(logo, { scale: 0, autoAlpha: 0, duration: 0.8, ease: 'expo.in' }, 1);
        }
      });
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      ctx.revert();
      if (!finished) release();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={root} className={styles.preloader} role="status" aria-label={loading} data-preloader="">
      <span className="sr-only">{loading}</span>
      <div className={styles.cols} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={`b${i}`} className={`${styles.col} ${styles.colB}`} />
        ))}
      </div>
      <div className={styles.cols} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span key={`a${i}`} className={`${styles.col} ${styles.colA}`} />
        ))}
      </div>
      <div className={styles.logo} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- animated decorative mark */}
        <img className={styles.ghost} src="/img/logo.png" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element -- animated decorative mark */}
        <img className={styles.fill} src="/img/logo.png" alt="" />
      </div>
      <div className={styles.meta} aria-hidden="true">
        <span className={styles.brand}>
          Dekoloniz<b>Art</b>
        </span>
        <span className={styles.words}>
          {words.map((word) => (
            <span key={word} className={styles.word}>
              {word}
            </span>
          ))}
        </span>
      </div>
      <div className={styles.countWrap} aria-hidden="true">
        <span className={styles.count}>
          <span ref={count} className={styles.num}>
            0
          </span>
          <sup>%</sup>
        </span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <i />
      </div>
      <button type="button" className={styles.skipIntro} onClick={() => finishRef.current()}>
        {skip} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
