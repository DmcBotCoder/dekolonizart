'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { getLenis, hasFinePointer, isReducedMotion } from '@/lib/motion/state';

interface MagnetEntry {
  el: HTMLElement;
  padding: number;
  strength: number;
  xTo: (value: number) => void;
  yTo: (value: number) => void;
  visible: boolean;
  active: boolean;
  rect: DOMRect | null;
}

/* One shared pointer listener for every magnet on the page (same approach as the reference). */
const entries = new Set<MagnetEntry>();
let pointer: { x: number; y: number } | null = null;
let frame = 0;
let measure = true;
let observer: IntersectionObserver | null = null;

function update() {
  frame = 0;
  if (!pointer) return;
  const visible = [...entries].filter((entry) => entry.visible);
  if (measure) {
    visible.forEach((entry) => (entry.rect = entry.el.getBoundingClientRect()));
    measure = false;
  }
  for (const entry of visible) {
    const rect = entry.rect;
    if (!rect) continue;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const inside =
      Math.abs(cx - pointer.x) < rect.width / 2 + entry.padding && Math.abs(cy - pointer.y) < rect.height / 2 + entry.padding;
    if (inside) {
      entry.xTo((pointer.x - cx) / entry.strength);
      entry.yTo((pointer.y - cy) / entry.strength);
      entry.active = true;
    } else if (entry.active) {
      entry.xTo(0);
      entry.yTo(0);
      entry.active = false;
    }
  }
}

const schedule = () => {
  frame ||= requestAnimationFrame(update);
};
const onPointerMove = (event: PointerEvent) => {
  pointer = { x: event.clientX, y: event.clientY };
  schedule();
};
const onLayoutChange = () => {
  measure = true;
  schedule();
};

function register(entry: MagnetEntry) {
  if (!entries.size) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onLayoutChange, { passive: true });
    window.addEventListener('scroll', onLayoutChange, { passive: true });
    getLenis()?.on('scroll', onLayoutChange);
    observer = new IntersectionObserver(
      (records) =>
        records.forEach((record) => {
          const match = [...entries].find((e) => e.el === record.target);
          if (match) {
            match.visible = record.isIntersecting;
            measure = true;
          }
        }),
      { rootMargin: '120px' },
    );
  }
  entries.add(entry);
  observer?.observe(entry.el);
}

function unregister(entry: MagnetEntry) {
  observer?.unobserve(entry.el);
  entries.delete(entry);
  if (!entries.size) {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', onLayoutChange);
    window.removeEventListener('scroll', onLayoutChange);
    getLenis()?.off('scroll', onLayoutChange);
    observer?.disconnect();
    observer = null;
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

/** Wraps a button/link so it is pulled towards the pointer (fine pointers only, not with reduced motion). */
export function Magnet({ children, padding = 60, strength = 4, className }: MagnetProps) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !hasFinePointer() || !root.current || !inner.current) return;
    const target = inner.current;
    const entry: MagnetEntry = {
      el: root.current,
      padding,
      strength,
      xTo: gsap.quickTo(target, 'x', { duration: 0.6, ease: 'power3.out' }),
      yTo: gsap.quickTo(target, 'y', { duration: 0.6, ease: 'power3.out' }),
      visible: false,
      active: false,
      rect: null,
    };
    register(entry);
    return () => {
      unregister(entry);
      gsap.killTweensOf(target);
    };
  }, [padding, strength]);

  return (
    <div ref={root} className={className ? `magnet ${className}` : 'magnet'} style={{ display: 'inline-block', position: 'relative' }}>
      <div ref={inner} className="magnet-inner" style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
