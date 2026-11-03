/**
 * Data attributes picked up by the motion runtime – the React equivalent of
 * the reference's `v-reveal`, `v-split`, `v-parallax` and `v-tilt`
 * directives. Usable from Server Components (plain attributes, no JS).
 */
type Attrs = Record<`data-${string}`, string>;

/** Fade + rise when scrolled into view. A number is shorthand for `{ delay }`. */
export function reveal(options: number | { y?: number; delay?: number; duration?: number } = {}): Attrs {
  const { y, delay, duration } = typeof options === 'number' ? { delay: options, y: undefined, duration: undefined } : options;
  const attrs: Attrs = { 'data-reveal': '' };
  if (y !== undefined) attrs['data-reveal-y'] = String(y);
  if (delay !== undefined) attrs['data-reveal-delay'] = String(delay);
  if (duration !== undefined) attrs['data-reveal-duration'] = String(duration);
  return attrs;
}

/** Masked word-by-word heading reveal (page heroes). */
export const split = (delay?: number): Attrs => (delay === undefined ? { 'data-split': '' } : { 'data-split': String(delay) });

/** Scroll-linked vertical drift inside an overflow-hidden frame. */
export const parallax = (amount = 10): Attrs => ({ 'data-parallax': String(amount) });

/** 3D tilt that follows the pointer. */
export const tilt = (amount = 8): Attrs => ({ 'data-tilt': String(amount) });
