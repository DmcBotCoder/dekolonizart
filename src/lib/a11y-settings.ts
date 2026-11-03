/** Accessibility settings persisted on the visitor's device (same key and shape as the reference). */
export const A11Y_STORAGE_KEY = 'dk-a11y';

export type TextSize = 100 | 125 | 150;

export interface A11ySettings {
  textSize: TextSize;
  contrast: boolean;
  readableFont: boolean;
  spacing: boolean;
  underline: boolean;
}

export type A11yToggle = Exclude<keyof A11ySettings, 'textSize'>;

export const defaultA11ySettings: A11ySettings = {
  textSize: 100,
  contrast: false,
  readableFont: false,
  spacing: false,
  underline: false,
};

export function readA11ySettings(): A11ySettings {
  try {
    return { ...defaultA11ySettings, ...JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) || '{}') };
  } catch {
    return { ...defaultA11ySettings };
  }
}

/** Mirrors the settings as classes on <html>. */
export function applyA11yClasses(settings: A11ySettings) {
  const list = document.documentElement.classList;
  list.remove('a11y-text-125', 'a11y-text-150');
  if (settings.textSize === 125) list.add('a11y-text-125');
  if (settings.textSize === 150) list.add('a11y-text-150');
  list.toggle('a11y-contrast', settings.contrast);
  list.toggle('a11y-readable-font', settings.readableFont);
  list.toggle('a11y-spacing', settings.spacing);
  list.toggle('a11y-underline', settings.underline);
}

/** Applies the settings and stores them. */
export function applyA11ySettings(settings: A11ySettings) {
  applyA11yClasses(settings);
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable */
  }
  // Layout changes size – let scroll-driven animations re-measure.
  window.dispatchEvent(new Event('resize'));
}

export const isDefaultA11y = (settings: A11ySettings) =>
  (Object.keys(defaultA11ySettings) as (keyof A11ySettings)[]).every((key) => settings[key] === defaultA11ySettings[key]);

/* ---------- Store for React (useSyncExternalStore) ---------- */

const listeners = new Set<() => void>();
let snapshot: A11ySettings | null = null;

export function subscribeA11y(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getA11ySnapshot = () => (snapshot ??= readA11ySettings());
export const getA11yServerSnapshot = () => defaultA11ySettings;

export function updateA11ySettings(next: A11ySettings) {
  snapshot = next;
  applyA11ySettings(next);
  listeners.forEach((listener) => listener());
}
