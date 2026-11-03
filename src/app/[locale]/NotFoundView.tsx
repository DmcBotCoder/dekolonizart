'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Magnet } from '@/components/ui/Magnet';
import { gsap, SplitText } from '@/lib/motion/gsap';
import { hasFinePointer, introDone, isReducedMotion } from '@/lib/motion/state';
import styles from './not-found.module.css';

interface NotFoundViewProps {
  title: string;
  text: string;
  requested: string;
  links: { href: string; label: string; text: string }[];
  homeHref: string;
  homeLabel: string;
}

/** "Lost in history" 404 with the reference's bouncing digits and the logo as the zero. */
export function NotFoundView({ title, text, requested, links, homeHref, homeLabel }: NotFoundViewProps) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = root.current;
    if (!el || isReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    let alive = true;
    let removeMove = () => {};
    Promise.all([document.fonts.ready, introDone]).then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        const words = new SplitText(`.${styles.title}`, { type: 'words' });
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from(`.${styles.digit}`, {
            yPercent: -160,
            rotation: (i: number) => [-25, 12, 30][i],
            autoAlpha: 0,
            duration: 1.4,
            stagger: 0.12,
            ease: 'bounce.out',
          })
          .from(`.${styles.logo}`, { scale: 0, rotation: -180, duration: 1.4, ease: 'elastic.out(1, 0.5)' }, 0.5)
          .from(words.words, { yPercent: 100, autoAlpha: 0, duration: 0.9, stagger: 0.05 }, 0.8)
          .from(`.${styles.text}, .${styles.path}`, { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, 1)
          .from(`.${styles.links} li`, { y: 30, opacity: 0, duration: 0.8, stagger: 0.07 }, 1.1);
        gsap.to(`.${styles.logo} img`, { rotation: 6, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        if (hasFinePointer()) {
          const movers = gsap.utils.toArray<HTMLElement>(`.${styles.digit}`).map((digit) => gsap.quickTo(digit, 'x', { duration: 1, ease: 'power3' }));
          const onMove = (event: MouseEvent) => {
            const dx = event.clientX / window.innerWidth - 0.5;
            movers.forEach((move, i) => move(dx * (i - 1) * 30));
          };
          window.addEventListener('mousemove', onMove, { passive: true });
          removeMove = () => window.removeEventListener('mousemove', onMove);
        }
      }, el);
    });
    return () => {
      alive = false;
      removeMove();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className={styles.nf}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.digits} aria-hidden="true">
          <span className={styles.digit}>4</span>
          <span className={`${styles.digit} ${styles.zero}`}>
            <span className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative, animated */}
              <img src="/img/logo.png" alt="" />
            </span>
          </span>
          <span className={styles.digit}>4</span>
        </div>
        <h1 className={styles.title} tabIndex={-1}>
          {title}
        </h1>
        <p className={styles.text}>{text}</p>
        <p className={styles.path}>
          {requested} <code>{pathname}</code>
        </p>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <strong>{link.label}</strong>
                <small>{link.text}</small>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Magnet>
          <Link href={homeHref} className="btn">
            {homeLabel}
          </Link>
        </Magnet>
      </div>
    </section>
  );
}
