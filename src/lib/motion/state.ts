import type Lenis from 'lenis';

/** localStorage key of the in-site "Reduce motion" switch (same key as the reference). */
export const REDUCE_MOTION_KEY = 'dk-reduce-motion';
/** sessionStorage flag: skip the intro on the next hard load (language switch). */
export const SKIP_INTRO_KEY = 'dk-skip-intro';

let reducedCache: boolean | null = null;

/**
 * Motion is disabled when the visitor asked for it: the in-site switch
 * (stored) wins, otherwise the OS setting. Same rule as the boot script,
 * which mirrors it as `html.reduce-motion` before first paint. Computed from
 * the source rather than the class, because a client-side re-render of
 * <html> (e.g. the 404 boundary) can drop classes added by the boot script.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (reducedCache === null) {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(REDUCE_MOTION_KEY);
    } catch {
      /* storage unavailable */
    }
    reducedCache = stored === '1' || (stored !== '0' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  return reducedCache;
}

/**
 * True when the intro must be skipped on this load (language switch). The
 * boot script normally consumes the flag; read it here too in case the boot
 * script did not run for this document.
 */
export function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as { __dkSkipIntro?: boolean };
  if (w.__dkSkipIntro || document.documentElement.classList.contains('skip-intro')) return true;
  try {
    if (sessionStorage.getItem(SKIP_INTRO_KEY)) {
      sessionStorage.removeItem(SKIP_INTRO_KEY);
      w.__dkSkipIntro = true;
    }
  } catch {
    /* storage unavailable */
  }
  return w.__dkSkipIntro === true;
}

export function setReducedMotion(on: boolean) {
  try {
    localStorage.setItem(REDUCE_MOTION_KEY, on ? '1' : '0');
  } catch {
    /* storage unavailable – the reload still applies the OS default */
  }
  location.reload();
}

export const hasFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/* ---------- Intro (preloader) completion ---------- */

let resolveIntro: () => void = () => {};
/** Resolves once the preloader has handed over to the page. */
export const introDone = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});
export function markIntroDone() {
  resolveIntro();
}

/* ---------- Smooth scroll ---------- */

let lenis: Lenis | null = null;
export const getLenis = () => lenis;
export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

/** Scrolls to a selector or position, accounting for the sticky header like the reference. */
export function scrollToTarget(target: string | number, options: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, immediate: options.immediate, force: true });
    return;
  }
  if (typeof target === 'number') window.scrollTo(0, target);
  else document.querySelector(target)?.scrollIntoView();
}

/* ---------- Background inertness (menu, preloader, lightbox) ---------- */

const BACKGROUND = 'header[data-site-header], main, footer, [data-notice], [data-skip-link]';

export function setBackgroundInert(inert: boolean, except?: Element | null) {
  document.querySelectorAll<HTMLElement>(BACKGROUND).forEach((el) => {
    if (except && el.contains(except)) return;
    el.inert = inert;
  });
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('menu-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

/** For `useSyncExternalStore`: the flag only changes through a reload. */
export const subscribeNever = () => () => {};
export const reducedMotionServerSnapshot = () => false;
