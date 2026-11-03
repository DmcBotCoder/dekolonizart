'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { introDone, isReducedMotion } from '@/lib/motion/state';
import styles from './team.module.css';

/** Team grid entrance: each portrait wipes up, zooms out and its caption follows (reference timings). */
export function TeamGrid({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || isReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    let alive = true;
    introDone.then(() => {
      if (!alive) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(`.${styles.member}`).forEach((member, i) => {
          const scrollTrigger = { trigger: member, start: 'top 88%', once: true };
          const delay = (i % 4) * 0.1;
          gsap.from(member.querySelector(`.${styles.frame}`), {
            clipPath: 'inset(100% 0 0 0)',
            duration: 1.3,
            delay,
            ease: 'expo.inOut',
            scrollTrigger,
          });
          const photo = member.querySelector(`.${styles.photo}`);
          // Suspend the hover transition while GSAP drives the transform.
          gsap.set(photo, { transition: 'none' });
          gsap.from(photo, {
            scale: 1.35,
            duration: 1.8,
            delay,
            ease: 'expo.out',
            scrollTrigger,
            onComplete: () => gsap.set(photo, { clearProps: 'transition' }),
          });
          gsap.from(member.querySelectorAll(`.${styles.info} > *`), {
            y: 24,
            opacity: 0,
            duration: 0.9,
            delay: delay + 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger,
          });
        });
      }, el);
    });
    return () => {
      alive = false;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={grid} className={`container ${styles.team}`}>
      {children}
    </div>
  );
}
