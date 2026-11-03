'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { splitLocale } from '@/i18n/config';
import { applyDirectives } from '@/lib/motion/directives';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { getLenis, isReducedMotion, scrollToTarget } from '@/lib/motion/state';

function focusTarget(hash: string | null) {
  const target = (hash && document.querySelector<HTMLElement>(hash)) || document.querySelector<HTMLElement>('#main h1') || document.getElementById('main');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/**
 * Out-in page transition (fade up 24px, as in the reference), scroll reset,
 * hash scrolling with header offset, focus management and the declarative
 * animations for each page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapper = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  /* Intercept internal link clicks to play the leave animation before navigating. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor || !anchor.href || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Language switch changes the root layout: let the browser do a full load.
      if (splitLocale(url.pathname).locale !== splitLocale(window.location.pathname).locale) return;

      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        if (!url.hash) return;
        event.preventDefault();
        window.history.pushState(null, '', url.hash);
        scrollToTarget(url.hash);
        focusTarget(url.hash);
        return;
      }

      event.preventDefault();
      const href = `${url.pathname}${url.search}${url.hash}`;
      const el = wrapper.current;
      if (!el || isReducedMotion()) {
        router.push(href, { scroll: false });
        return;
      }
      getLenis()?.stop();
      gsap.to(el, {
        autoAlpha: 0,
        y: -24,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => router.push(href, { scroll: false }),
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  /* Enter: reset scroll, fade in, apply page animations, restore focus. */
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const hash = window.location.hash || null;
    const first = firstLoad.current;
    firstLoad.current = false;
    const reduced = isReducedMotion();

    if (!first) {
      scrollToTarget(0, { immediate: true });
      window.scrollTo(0, 0);
      getLenis()?.start();
    }

    const cleanup = applyDirectives(el);

    const afterEnter = () => {
      ScrollTrigger.refresh();
      if (hash) scrollToTarget(hash);
      if (!first) focusTarget(hash);
    };

    if (first || reduced) {
      gsap.set(el, { clearProps: 'opacity,visibility,transform' });
      if (first && hash) {
        // Deep link: wait for layout (fonts, images above the fold) before jumping.
        document.fonts.ready.then(() => requestAnimationFrame(afterEnter));
      } else if (!first) {
        requestAnimationFrame(afterEnter);
      }
    } else {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity,visibility', onComplete: afterEnter },
      );
    }

    return cleanup;
  }, [pathname]);

  return <div ref={wrapper}>{children}</div>;
}
