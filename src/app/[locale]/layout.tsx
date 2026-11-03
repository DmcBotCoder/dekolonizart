import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { A11yPanel } from '@/components/layout/A11yPanel';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import noticeStyles from '@/components/layout/NoticeBar.module.css';
import { PageTransition } from '@/components/layout/PageTransition';
import { Preloader } from '@/components/layout/Preloader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Lightbox } from '@/components/ui/Lightbox';
import { resolveNav } from '@/content/navigation';
import { site, socials } from '@/content/site';
import { locales } from '@/i18n/config';
import { getI18n } from '@/i18n/server';
import { bootScript } from '@/lib/boot-script';

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '400', '600', '700'],
  display: 'swap',
  variable: '--font-source-sans',
  // Keep the reference's fallback chain (system-ui) for glyphs the font lacks, e.g. ♥ and ✶.
  adjustFontFallback: false,
});

const movement = localFont({
  src: '../../fonts/MovementV.ttf',
  display: 'swap',
  variable: '--font-movement',
  adjustFontFallback: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  icons: { icon: '/img/logo.png', apple: '/img/logo.png' },
};

export const viewport: Viewport = {
  themeColor: '#9a3a1e',
};

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <html lang={locale} className={`${sourceSans.variable} ${movement.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{'[data-preloader]{display:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <a className={noticeStyles.skip} href="#main" data-skip-link="">
          {t.common.skip}
        </a>
        <aside className={noticeStyles.notice} aria-label={t.common.noticeLabel} data-notice="">
          <div className={`container ${noticeStyles.inner}`}>
            <div className={noticeStyles.tools}>
              <LanguageSwitcher current={locale} label={t.common.language} />
              <A11yPanel locale={locale} t={t.a11y} />
            </div>
          </div>
        </aside>
        <SiteHeader
          locale={locale}
          nav={resolveNav(t)}
          socials={socials}
          email={site.email}
          labels={{
            homeLink: t.common.homeLink,
            mainNav: t.common.mainNav,
            mobileNav: t.common.mobileNav,
            submenu: t.common.submenu,
            menu: t.common.menu,
            close: t.common.close,
            donation: t.common.donation,
            newTab: t.common.newTab,
          }}
        />
        <SmoothScroll />
        <Preloader loading={t.preloader.loading} skip={t.preloader.skip} words={t.preloader.words} />
        <main id="main" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter locale={locale} t={t} />
        <Lightbox label={t.common.poster} closeLabel={t.common.closePoster} />
      </body>
    </html>
  );
}
