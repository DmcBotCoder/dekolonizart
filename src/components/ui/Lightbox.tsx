'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { isReducedMotion, lockScroll, setBackgroundInert } from '@/lib/motion/state';
import styles from './Lightbox.module.css';

export interface LightboxImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const EVENT = 'dk:lightbox';

/** Opens the site-wide poster lightbox. */
export function openLightbox(image: LightboxImage) {
  window.dispatchEvent(new CustomEvent<LightboxImage>(EVENT, { detail: image }));
}

/** Single lightbox dialog mounted once in the layout. */
export function Lightbox({ label, closeLabel }: { label: string; closeLabel: string }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const onOpen = (event: Event) => {
      opener.current = document.activeElement;
      setImage((event as CustomEvent<LightboxImage>).detail);
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  const close = () => {
    const el = root.current;
    if (!el || isReducedMotion()) {
      setImage(null);
      return;
    }
    gsap
      .timeline({ onComplete: () => setImage(null) })
      .to(el.querySelector('img'), { scale: 0.92, autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
      .to(el, { autoAlpha: 0, duration: 0.25 }, '-=0.1');
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    if (!image) return;
    lockScroll(true);
    setBackgroundInert(true);
    closeButton.current?.focus();
    const el = root.current;
    if (el && !isReducedMotion()) {
      gsap
        .timeline()
        .from(el, { autoAlpha: 0, duration: 0.3 })
        .from(el.querySelector('img'), { scale: 0.85, y: 40, autoAlpha: 0, duration: 0.7, ease: 'expo.out' }, '-=0.1');
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        // Only one focusable control: keep focus inside the dialog.
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      setBackgroundInert(false);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [image]);

  if (!image) return null;

  return (
    <div
      ref={root}
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- full-size poster at its natural resolution */}
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
      <button ref={closeButton} type="button" className={styles.close} aria-label={closeLabel} onClick={close}>
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
