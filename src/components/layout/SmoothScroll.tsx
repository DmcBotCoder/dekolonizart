'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { applyA11yClasses, getA11ySnapshot } from '@/lib/a11y-settings';
import { isReducedMotion, setLenis, shouldSkipIntro } from '@/lib/motion/state';

/**
 * Lenis smooth scrolling driven by the GSAP ticker (reference settings),
 * plus the keyboard-focus safety net: focusing an element completes any
 * entrance animation still hiding it.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Re-assert the preference classes the boot script set (a client re-render of <html> can drop them).
    const html = document.documentElement;
    html.classList.toggle('reduce-motion', isReducedMotion());
    if (shouldSkipIntro()) html.classList.add('skip-intro');
    applyA11yClasses(getA11ySnapshot());

    const onFocusIn = (event: FocusEvent) => {
      for (let node = event.target as HTMLElement | null; node && node !== document.body; node = node.parentElement) {
        gsap.getTweensOf(node).forEach((tween) => {
          const trigger = tween.scrollTrigger;
          if (trigger && !trigger.vars.scrub && tween.progress() < 1) tween.progress(1);
        });
      }
    };
    document.addEventListener('focusin', onFocusIn);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true });

    if (isReducedMotion()) {
      return () => document.removeEventListener('focusin', onFocusIn);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      prevent: (node) => node.closest?.('[data-lenis-prevent]') != null,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
