'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react';
import type { ResolvedNavItem } from '@/content/navigation';
import { localizePath, splitLocale, type Locale } from '@/i18n/config';
import { gsap } from '@/lib/motion/gsap';
import { getLenis, isReducedMotion, lockScroll, setBackgroundInert } from '@/lib/motion/state';
import { Magnet } from '@/components/ui/Magnet';
import styles from './SiteHeader.module.css';

export interface HeaderLabels {
  homeLink: string;
  mainNav: string;
  mobileNav: string;
  submenu: string;
  menu: string;
  close: string;
  donation: string;
  newTab: string;
}

interface SiteHeaderProps {
  locale: Locale;
  nav: ResolvedNavItem[];
  labels: HeaderLabels;
  socials: readonly { label: string; href: string }[];
  email: string;
}

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

export function SiteHeader({ locale, nav, labels, socials, email }: SiteHeaderProps) {
  const { path } = splitLocale(usePathname());
  const l = (href: string) => localizePath(href, locale);

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDrop, setOpenDrop] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<number | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const overlay = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const state = useRef({ mobileOpen, openDrop });
  useEffect(() => {
    state.current = { mobileOpen, openDrop };
  });

  const isCurrent = (item: ResolvedNavItem) =>
    path === item.href || !!item.children?.some((child) => child.href === path);

  /* ---------- Dropdowns ---------- */
  const openNow = (index: number) => {
    clearTimeout(closeTimer.current);
    setOpenDrop(index);
  };
  const closeSoon = (delay = 160) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDrop(null), delay);
  };
  const onItemBlur = (event: FocusEvent<HTMLLIElement>, index: number) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null) && state.current.openDrop === index) {
      setOpenDrop(null);
    }
  };

  /* ---------- Close everything on navigation (state adjusted during render) ---------- */
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpenDrop(null);
    setMobileOpen(false);
    setMobileSub(null);
    setHidden(false);
  }

  /* ---------- Hide on scroll down, show on scroll up ---------- */
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = getLenis()?.scroll ?? window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) < 2) return;
      if (!state.current.mobileOpen && state.current.openDrop === null) setHidden(y > 220 && y > last);
      last = y;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const { openDrop: drop, mobileOpen: open } = state.current;
      if (drop !== null) {
        document.querySelector<HTMLElement>(`[aria-controls="drop-${drop}"]`)?.focus();
        setOpenDrop(null);
      }
      if (open) {
        setMobileOpen(false);
        burger.current?.focus();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      clearTimeout(closeTimer.current);
    };
  }, []);

  /* ---------- Mobile overlay (clip-path circle from the burger) ---------- */
  const buildTimeline = useCallback(() => {
    const el = overlay.current;
    if (!el || isReducedMotion()) return null;
    const q = gsap.utils.selector(el);
    return gsap
      .timeline({ paused: true })
      .set(el, { visibility: 'visible' })
      .fromTo(
        el,
        { clipPath: 'circle(0% at calc(100% - 40px) 40px)' },
        { clipPath: 'circle(150% at calc(100% - 40px) 40px)', duration: 0.9, ease: 'expo.inOut' },
      )
      .from(q(`.${styles.mItem}`), { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, '-=0.4')
      .from(q(`.${styles.mFoot} > *`), { y: 20, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '-=0.5');
  }, []);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    lockScroll(mobileOpen);
    setBackgroundInert(mobileOpen, burger.current);
    timeline.current ??= buildTimeline();
    if (mobileOpen) {
      timeline.current?.timeScale(1).play();
      requestAnimationFrame(() => overlay.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true }));
    } else {
      if (overlay.current?.contains(document.activeElement)) burger.current?.focus();
      timeline.current?.timeScale(1.6).reverse();
    }
  }, [mobileOpen, buildTimeline]);

  useEffect(
    () => () => {
      timeline.current?.kill();
      setBackgroundInert(false);
      lockScroll(false);
    },
    [],
  );

  const tab = mobileOpen ? 0 : -1;

  return (
    <>
      <header
        data-site-header=""
        className={cx(styles.header, hidden && styles.hidden, scrolled && styles.scrolled, mobileOpen && styles.isOpen)}
        onFocus={() => setHidden(false)}
      >
        <div className={cx('container', styles.bar)}>
          <Link href={l('/')} className={styles.brand} aria-label={labels.homeLink}>
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative mark that the preloader animates into */}
            <img src="/img/logo.png" alt="" width={52} height={52} data-brand-mark="" />
            <span>
              Dekoloniz<b>Art</b>
            </span>
          </Link>

          <nav className={styles.desk} aria-label={labels.mainNav}>
            <ul className={styles.menu}>
              {nav.map((item, index) => {
                const open = openDrop === index;
                return (
                  <li
                    key={item.href}
                    className={cx(styles.menuItem, open && styles.open, isCurrent(item) && styles.current)}
                    onMouseEnter={item.children ? () => openNow(index) : undefined}
                    onMouseLeave={item.children ? () => closeSoon() : undefined}
                    onBlur={(event) => onItemBlur(event, index)}
                  >
                    <Link href={l(item.href)} className={styles.menuLink} aria-current={path === item.href ? 'page' : undefined}>
                      <span className={styles.roll} data-text={item.label}>
                        <span>{item.label}</span>
                      </span>
                    </Link>
                    {item.children && (
                      <>
                        <button
                          type="button"
                          className={styles.chev}
                          aria-expanded={open}
                          aria-controls={`drop-${index}`}
                          aria-label={labels.submenu.replace('{label}', item.label)}
                          onClick={() => setOpenDrop(open ? null : index)}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                            <path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                        <div id={`drop-${index}`} className={styles.drop} aria-hidden={!open}>
                          <div className={styles.dropInner}>
                            <ul className={styles.dropList}>
                              {item.children.map((child, i) => (
                                <li key={child.href} style={{ '--i': i } as CSSProperties}>
                                  <Link
                                    href={l(child.href)}
                                    className={cx(styles.dropLink, path === child.href && styles.active)}
                                    tabIndex={open ? 0 : -1}
                                    aria-current={path === child.href ? 'page' : undefined}
                                  >
                                    <span className={styles.idx} aria-hidden="true">
                                      {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className={styles.txt}>
                                      <strong>{child.label}</strong>
                                      <small>{child.text}</small>
                                    </span>
                                    <span className={styles.arrow} aria-hidden="true">
                                      →
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {item.feature && (
                              <Link href={l(item.feature.href)} className={styles.feature} tabIndex={open ? 0 : -1}>
                                <span className={styles.fKicker}>{item.feature.kicker}</span>
                                <span className={styles.fTitle}>{item.feature.title}</span>
                                <span className={styles.fText}>{item.feature.text}</span>
                                <span className={styles.fCta}>
                                  {item.feature.cta} <i aria-hidden="true">→</i>
                                </span>
                                <span className={styles.fClip} aria-hidden="true">
                                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
                                  <img src="/img/logo.png" alt="" className={styles.fMark} />
                                </span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            <Magnet padding={30} strength={5}>
              <Link href={l('/#support')} className={cx('btn', styles.donate)}>
                <span className={styles.heart} aria-hidden="true">
                  ♥
                </span>{' '}
                {labels.donation}
              </Link>
            </Magnet>
          </nav>

          <button
            ref={burger}
            type="button"
            className={cx(styles.burger, mobileOpen && styles.x)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className={styles.burgerLabel}>{mobileOpen ? labels.close : labels.menu}</span>
            <span className={styles.lines} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block of this fixed overlay. */}
      <div
        id="mobile-menu"
        ref={overlay}
        className={cx(styles.mOverlay, mobileOpen && styles.overlayOpen)}
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        aria-hidden={!mobileOpen}
        data-lenis-prevent=""
      >
        <nav className={styles.mNav} aria-label={labels.mobileNav}>
          <ul>
            {nav.map((item, index) => (
              <li key={item.href} className={styles.mRow}>
                <div className={styles.mItem}>
                  <Link
                    href={l(item.href)}
                    className={cx(styles.mLink, path === item.href && styles.active)}
                    tabIndex={tab}
                    aria-current={path === item.href ? 'page' : undefined}
                  >
                    <span className={styles.mNum} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      className={cx(styles.mToggle, mobileSub === index && styles.on)}
                      aria-expanded={mobileSub === index}
                      aria-label={labels.submenu.replace('{label}', item.label)}
                      tabIndex={tab}
                      onClick={() => setMobileSub(mobileSub === index ? null : index)}
                    >
                      <span />
                    </button>
                  )}
                </div>
                {item.children && (
                  <div className={cx(styles.mSub, mobileSub === index && styles.on)}>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={l(child.href)} tabIndex={mobileOpen && mobileSub === index ? 0 : -1}>
                            {child.label} <small>{child.text}</small>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className={styles.mFoot}>
            <Link href={l('/#support')} className="btn btn--light" tabIndex={tab}>
              <span aria-hidden="true">♥ </span>
              {labels.donation}
            </Link>
            <a href={`mailto:${email}`} tabIndex={tab}>
              {email}
            </a>
            <ul className={styles.mSocial}>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener" tabIndex={tab}>
                    {social.label}
                    <span className="sr-only">{labels.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
