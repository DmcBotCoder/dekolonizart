import Link from 'next/link';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { socials } from '@/content/site';
import { MotionToggle, NewsletterForm } from './FooterControls';
import styles from './SiteFooter.module.css';

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  const f = t.footer;
  const l = (href: string) => localizePath(href, locale);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.cols}`}>
        <div>
          <p className={styles.claim}>
            {f.claim.map((line, i) => (
              <span key={line}>
                {line}
                {i < f.claim.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <nav aria-labelledby="f-nav">
          <h2 id="f-nav">{f.navigate}</h2>
          <ul>
            <li>
              <Link href={l('/about')}>{f.about}</Link>
            </li>
            <li>
              <Link href={l('/services')}>{f.faqs}</Link>
            </li>
            <li>
              <Link href={l('/contact')}>{f.contact}</Link>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="f-offers">
          <h2 id="f-offers">{f.offers}</h2>
          <ul>
            <li>
              <Link href={l('/theater')}>{f.performances}</Link>
            </li>
            <li>
              <Link href={l('/artistic')}>{f.workshops}</Link>
            </li>
            <li>
              <Link href={l('/movement-dance')}>{f.dance}</Link>
            </li>
          </ul>
        </nav>
        <div>
          <NewsletterForm
            labels={{
              heading: f.newsletter,
              emailLabel: f.emailLabel,
              send: f.send,
              thanks: f.thanks,
              errEmpty: f.errEmpty,
              errInvalid: f.errInvalid,
            }}
          />
          <h2 className={styles.follow}>{f.follow}</h2>
          <ul className={styles.social}>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener">
                  {social.label}
                  <span className="sr-only">{t.common.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        <span>
          © {year} DekolonizArt – {f.rights}
        </span>
        <span className={styles.legalLinks}>
          <Link href={l('/impressum')}>{f.impressum}</Link>
          <Link href={l('/datenschutz')}>{f.datenschutz}</Link>
          <Link href={l('/accessibility')}>{f.accessibility}</Link>
          <Link href={l('/easy-read')}>{f.easy}</Link>
          <MotionToggle label={f.reduceMotion} on={t.a11y.on} off={t.a11y.off} />
        </span>
      </div>
    </footer>
  );
}
