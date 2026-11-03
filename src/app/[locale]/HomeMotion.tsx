'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText } from '@/lib/motion/gsap';
import { getLenis, hasFinePointer, introDone, isReducedMotion } from '@/lib/motion/state';
import styles from './home.module.css';

const sel = (name: keyof typeof styles) => `.${styles[name]}`;

/**
 * Home page choreography, ported from the reference's default ("bold")
 * intro and scroll scenes. Content is server-rendered; this only animates it.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || isReducedMotion()) return;
    const q = gsap.utils.selector(el);
    let alive = true;
    let ctx: gsap.Context | null = null;
    const cleanups: (() => void)[] = [];

    gsap.set(q(`${sel('heroGrid')}, ${sel('watermark')}, ${sel('scrollCue')}`), { autoAlpha: 0 });

    Promise.all([document.fonts.ready, introDone]).then(() => {
      if (!alive) return;
      gsap.set(q(`${sel('heroGrid')}, ${sel('watermark')}, ${sel('scrollCue')}`), { autoAlpha: 1 });
      const random = gsap.utils.random;

      ctx = gsap.context(() => {
        /* ---------- Intro ---------- */
        const h1 = new SplitText(q(`${sel('hero')} h1`), { type: 'words,chars' });
        gsap.set(h1.chars, { willChange: 'transform, opacity' });
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from(sel('heroBlob'), { scale: 0, duration: 1.6 }, 0)
          .from(sel('heroLogoWrap'), { scale: 0.15, rotation: -200, autoAlpha: 0, duration: 1.8, ease: 'elastic.out(1, 0.55)' }, 0.05)
          .from(
            h1.chars,
            {
              x: () => random(-600, 600),
              y: () => random(-400, 400),
              rotation: () => random(-220, 220),
              scale: () => random(0, 3),
              autoAlpha: 0,
              duration: 1.5,
              stagger: { each: 0.012, from: 'random' },
            },
            0.1,
          )
          .from(`${sel('hero')} .eyebrow`, { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power4.inOut' }, 0.7)
          .from(`${sel('hero')} .magnet`, { scale: 0, rotation: -15, duration: 1, ease: 'back.out(2.6)', stagger: 0.1 }, 1)
          .from(sel('watermark'), { xPercent: 70, skewX: -35, autoAlpha: 0, duration: 2.2 }, 0.25)
          .from(sel('scrollCue'), { autoAlpha: 0, y: -16, duration: 0.8 }, 1.4);

        /* ---------- Pinned hero scene ---------- */
        const scene = gsap.timeline({
          defaults: { ease: 'power2.in' },
          scrollTrigger: { trigger: sel('hero'), start: 'top top', end: '+=110%', scrub: 1, pin: true, anticipatePin: 1, pinType: 'transform' },
        });
        scene
          .to(
            h1.words,
            {
              yPercent: () => random(-420, -160),
              x: () => random(-260, 260),
              rotation: () => random(-70, 70),
              autoAlpha: 0,
              stagger: { each: 0.04, from: 'random' },
            },
            0,
          )
          .to(`${sel('hero')} .eyebrow, ${sel('hero')} ${sel('heroActions')}, ${sel('scrollCue')}`, { y: -80, opacity: 0, stagger: 0.05 }, 0)
          .to(sel('heroLogoParallax'), { scale: 3.2, rotation: 18, yPercent: 10, ease: 'power3.in' }, 0)
          .to(sel('watermarkTrack'), { xPercent: -45, ease: 'none' }, 0)
          .to(sel('heroTint'), { opacity: 1, ease: 'none' }, 0.55);

        intro.eventCallback('onComplete', () => {
          gsap.set(h1.chars, { clearProps: 'willChange' });
          const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200));
          idle(() => {
            if (scene.scrollTrigger?.progress === 0) scene.progress(0.001).progress(0);
          });
        });

        /* ---------- Manifest ---------- */
        const manifest = new SplitText(q(`${sel('words')} > span`), { type: 'chars', aria: 'none' });
        gsap.from(manifest.chars, {
          rotationX: -100,
          yPercent: 60,
          transformOrigin: '50% 50% -40px',
          autoAlpha: 0,
          stagger: { each: 0.02 },
          ease: 'power3.out',
          scrollTrigger: { trigger: sel('manifest'), start: 'top 85%', end: 'center 50%', scrub: 1 },
        });
        gsap.fromTo(
          sel('words'),
          { scale: 0.85 },
          { scale: 1.05, ease: 'none', scrollTrigger: { trigger: sel('manifest'), start: 'top bottom', end: 'bottom top', scrub: true } },
        );

        /* ---------- Logo follows the mouse ---------- */
        if (hasFinePointer()) {
          const x = gsap.quickTo(sel('heroLogoMouse'), 'x', { duration: 1.2, ease: 'power3' });
          const y = gsap.quickTo(sel('heroLogoMouse'), 'y', { duration: 1.2, ease: 'power3' });
          const r = gsap.quickTo(sel('heroLogoMouse'), 'rotation', { duration: 1.4, ease: 'power3' });
          const onMove = (event: MouseEvent) => {
            const dx = event.clientX / window.innerWidth - 0.5;
            const dy = event.clientY / window.innerHeight - 0.5;
            x(dx * 36 * 1.8);
            y(dy * 28 * 1.8);
            r(dx * 5 * 1.8);
          };
          window.addEventListener('mousemove', onMove, { passive: true });
          cleanups.push(() => window.removeEventListener('mousemove', onMove));
        }

        /* ---------- Ticker (plays while visible, reacts to scroll velocity) ---------- */
        const loop = gsap.to(sel('track'), { xPercent: -50, duration: 40, ease: 'none', repeat: -1, paused: true });
        const tickerTrigger = ScrollTrigger.create({
          trigger: sel('ticker'),
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => loop.play(),
          onEnterBack: () => loop.play(),
          onLeave: () => loop.pause(),
          onLeaveBack: () => loop.pause(),
          onRefresh: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        if (tickerTrigger.isActive) loop.play();
        const lenis = getLenis();
        if (lenis) {
          const speed = { v: 1 };
          const setSpeed = gsap.quickTo(speed, 'v', { duration: 0.35, ease: 'power2.out', onUpdate: () => void loop.timeScale(speed.v) });
          const setSkew = gsap.quickTo(q(sel('track'))[0], 'skewX', { duration: 0.45, ease: 'power2.out' });
          const settle = gsap.delayedCall(0.12, () => {
            setSpeed(1);
            setSkew(0);
          }).pause();
          const onScroll = ({ velocity }: { velocity: number }) => {
            if (!loop.isActive()) return;
            const v = gsap.utils.clamp(-12, 12, (velocity / 6) * 2);
            setSpeed(1 + Math.abs(v));
            setSkew(-v * 1.2);
            settle.restart(true);
          };
          lenis.on('scroll', onScroll);
          cleanups.push(() => lenis.off('scroll', onScroll));
        }

        /* ---------- Featured poster ---------- */
        const factor = window.innerWidth < 900 ? 0.4 : 1;
        const drift = gsap.fromTo(
          sel('posterWrap'),
          { rotation: -9 * factor, yPercent: 18 * factor },
          {
            rotation: 4 * factor,
            yPercent: -12 * factor,
            ease: 'none',
            scrollTrigger: { trigger: sel('featured'), start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        const posterCol = q(sel('posterCol'))[0] as HTMLElement | undefined;
        if (posterCol) {
          const onFocusIn = () => {
            drift.scrollTrigger?.disable(false);
            gsap.to(sel('posterWrap'), {
              rotation: 0,
              yPercent: 0,
              duration: 0.3,
              overwrite: false,
              onComplete: () => posterCol.querySelector(':focus')?.scrollIntoView({ block: 'nearest' }),
            });
          };
          const onFocusOut = (event: FocusEvent) => {
            if (!posterCol.contains(event.relatedTarget as Node | null)) drift.scrollTrigger?.enable();
          };
          posterCol.addEventListener('focusin', onFocusIn);
          posterCol.addEventListener('focusout', onFocusOut);
          cleanups.push(() => {
            posterCol.removeEventListener('focusin', onFocusIn);
            posterCol.removeEventListener('focusout', onFocusOut);
          });
        }
        gsap.fromTo(
          sel('stamp'),
          { scale: 0, rotation: -40 },
          { scale: 1, rotation: 12, ease: 'back.out(2)', duration: 0.9, scrollTrigger: { trigger: sel('featured'), start: 'top 60%', once: true } },
        );

        /* ---------- Offers & partners ---------- */
        // The cards' CSS hover transition would fight the tween – suspend it until the entrance is done.
        gsap.set(sel('offer'), { transition: 'none' });
        gsap.from(sel('offer'), {
          y: 140,
          rotation: (i: number) => [-6, 0, 6][i % 3],
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: sel('offers'), start: 'top 85%', once: true },
          onComplete: () => gsap.set(sel('offer'), { clearProps: 'transition' }),
        });
        gsap.set(`${sel('partners')} img`, { transition: 'none' });
        gsap.from(`${sel('partners')} img`, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sel('partners'), start: 'top 90%', once: true },
          onComplete: () => gsap.set(`${sel('partners')} img`, { clearProps: 'transition' }),
        });
      }, el);

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
      getLenis()?.start();
    };
  }, []);

  return (
    <div ref={root} className={styles.home}>
      {children}
    </div>
  );
}
