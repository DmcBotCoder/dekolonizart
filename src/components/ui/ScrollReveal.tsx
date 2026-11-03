'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { isReducedMotion } from '@/lib/motion/state';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  text: string;
  className?: string;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  end?: string;
}

/** Paragraph whose words light up (and un-blur) as it scrolls through the viewport. */
export function ScrollReveal({ text, className, baseOpacity = 0.2, baseRotation = 2, blurStrength = 4, end = 'bottom 70%' }: ScrollRevealProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const parts = text.split(/(\s+)/);

  useEffect(() => {
    const el = root.current;
    if (!el || isReducedMotion()) return;
    const blur =
      blurStrength > 0 &&
      window.matchMedia('(pointer: fine) and (min-width: 900px)').matches &&
      (navigator.hardwareConcurrency || 8) >= 4;
    const from = blur ? { opacity: baseOpacity, filter: `blur(${blurStrength}px)` } : { opacity: baseOpacity };
    const to = blur ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 1 };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotation: baseRotation, transformOrigin: '0% 50%' },
        { rotation: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end, scrub: true } },
      );
      gsap.fromTo(`.${styles.word}`, from, {
        ...to,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end,
          scrub: true,
          onToggle: (self) => el.classList.toggle(styles.animating, self.isActive),
          onLeave: () => el.classList.add(styles.revealed),
        },
      });
    }, el);
    return () => ctx.revert();
  }, [text, baseOpacity, baseRotation, blurStrength, end]);

  return (
    <p ref={root} className={className}>
      {parts.map((part, i) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={i} className={styles.word}>
            {part}
          </span>
        ),
      )}
    </p>
  );
}
