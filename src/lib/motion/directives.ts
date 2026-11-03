import { gsap, ScrollTrigger, SplitText } from './gsap';
import { hasFinePointer, introDone, isReducedMotion } from './state';

const num = (value: string | undefined, fallback: number) => {
  const parsed = value === undefined || value === '' ? NaN : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Applies the declarative animations (`data-reveal`, `data-split`,
 * `data-parallax`, `data-tilt`) inside `scope`. Timings mirror the reference
 * directives exactly. Returns a cleanup function.
 */
export function applyDirectives(scope: HTMLElement): () => void {
  const html = document.documentElement;
  if (isReducedMotion()) {
    html.classList.remove('motion-pending');
    return () => {};
  }

  let cancelled = false;
  const splits: SplitText[] = [];
  const cleanups: (() => void)[] = [];

  const ctx = gsap.context(() => {
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: num(el.dataset.revealY, 40) },
        {
          opacity: 1,
          y: 0,
          duration: num(el.dataset.revealDuration, 1.1),
          delay: num(el.dataset.revealDelay, 0),
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });

    scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = num(el.dataset.parallax, 10);
      gsap.set(el, { scale: 1 + amount / 50 });
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

    scope.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => gsap.set(el, { opacity: 0 }));
  }, scope);

  // Headings split once fonts are ready and the intro has handed over.
  const splitTargets = scope.querySelectorAll<HTMLElement>('[data-split]');
  if (splitTargets.length) {
    Promise.all([document.fonts.ready, introDone]).then(() => {
      if (cancelled) return;
      splitTargets.forEach((el) => {
        if (!el.isConnected) return;
        gsap.set(el, { opacity: 1 });
        const delay = num(el.dataset.split, 0.15);
        splits.push(
          SplitText.create(el, {
            type: 'lines,words',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, { yPercent: 110, rotation: 4, duration: 1.1, stagger: 0.06, delay, ease: 'expo.out' }),
          }),
        );
      });
    });
  }

  if (hasFinePointer()) {
    scope.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
      const amount = num(el.dataset.tilt, 8);
      gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      let rect: DOMRect | null = null;
      const enter = () => (rect = el.getBoundingClientRect());
      const move = (event: PointerEvent) => {
        rect ??= el.getBoundingClientRect();
        ry(((event.clientX - rect.left) / rect.width - 0.5) * amount * 2);
        rx(-((event.clientY - rect.top) / rect.height - 0.5) * amount * 2);
      };
      const leave = () => {
        rect = null;
        rx(0);
        ry(0);
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.killTweensOf(el);
      });
    });
  }

  html.classList.remove('motion-pending');
  ScrollTrigger.refresh();

  return () => {
    cancelled = true;
    splits.forEach((s) => s.revert());
    cleanups.forEach((fn) => fn());
    ctx.revert();
  };
}
