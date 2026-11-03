import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ImageAsset } from '@/content/media';
import { reveal, split } from '@/lib/motion/attrs';
import styles from './PageHero.module.css';

export interface Crumb {
  href: string;
  label: string;
}

interface PageHeroProps {
  breadcrumbLabel: string;
  /** Ancestors (already localized hrefs). The current page is appended from `current`. */
  crumbs: Crumb[];
  current: string;
  eyebrow: ReactNode;
  title: ReactNode;
  /** Accessible name for the split heading when `title` is not plain text. */
  titleLang?: string;
  intro?: ReactNode;
  /** The reference animates eyebrow and intro on most pages but not on the long-form documents. */
  animateMeta?: boolean;
  /** Decorative image on the right (production pages); `position` is its CSS object-position. */
  image?: ImageAsset & { position?: string };
}

/** Dark page header used by every inner page: breadcrumbs, eyebrow, split h1, intro – optionally with an image. */
export function PageHero({ breadcrumbLabel, crumbs, current, eyebrow, title, titleLang, intro, animateMeta = true, image }: PageHeroProps) {
  const content = (
    <>
      <nav className={styles.crumbs} aria-label={breadcrumbLabel}>
        <ol>
          {crumbs.map((crumb) => (
            <li key={crumb.href}>
              <Link href={crumb.href}>{crumb.label}</Link>
            </li>
          ))}
          <li>
            <span aria-current="page">{current}</span>
          </li>
        </ol>
      </nav>
      <span className="eyebrow" {...(animateMeta ? reveal({ y: 16 }) : {})}>
        {eyebrow}
      </span>
      <h1 lang={titleLang} {...split()}>
        {title}
      </h1>
      {intro && <p {...(animateMeta ? reveal(0.5) : {})}>{intro}</p>}
    </>
  );

  if (!image) {
    return (
      <section className="page-hero">
        <div className="container">{content}</div>
      </section>
    );
  }

  return (
    <section className={`page-hero ${styles.withImage}`}>
      <div className="container">
        <div className={styles.text}>{content}</div>
      </div>
      <div className={styles.media}>
        <Image src={image.src} alt="" fill sizes="(min-width: 900px) 40vw, 100vw" priority style={{ objectPosition: image.position }} />
      </div>
    </section>
  );
}
