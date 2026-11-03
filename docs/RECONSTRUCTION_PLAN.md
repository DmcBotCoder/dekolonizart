# DekolonizArt – reconstruction plan

Sources: **design/UX** = OnPoint build (`dekolonizart.onpoint-digital.io`, a Vue 3 + Vite SPA), **content** = WordPress (`dekolonizart.com`).
The OnPoint build was audited at source level (compiled CSS, all three message catalogs, route chunks, GSAP timelines), so values below are taken from it, not estimated.

## 1. Routes

| Route (EN, unprefixed) | DE / FR | Source |
| --- | --- | --- |
| `/` | `/de`, `/fr` | OnPoint |
| `/about`, `/history`, `/the-team` | prefixed | OnPoint |
| `/services`, `/theater`, `/artistic`, `/movement-dance` | prefixed | OnPoint |
| `/contact` | prefixed | OnPoint |
| `/glossary`, `/easy-read`, `/accessibility` | prefixed | OnPoint |
| `/impressum`, `/datenschutz` (German content only) | prefixed | OnPoint |
| `/events/[slug]` (douala-manga-bell, the-tragedy-of-melilla, tam-tam) | prefixed | **WordPress** (synopsis/plot, cast, dates, "In this section") styled with OnPoint patterns |
| `/artists` (anchors per artist) | prefixed | **WordPress** ("event actors page") |
| 404 | localized | OnPoint |

Legacy WordPress URLs (e.g. `/douala-manga-bell-synopsis/`, `/de/ueber/`, `/fr/histoire/`) are permanently redirected in `next.config.ts`.

## 2. Reusable components

Layout: `NoticeBar` (language switcher + accessibility panel), `SiteHeader` (pill menu with roll-hover, mega dropdowns with feature card, magnet donation button, burger), `MobileMenu` (circle clip-path overlay, accordion submenus), `SiteFooter`, `Preloader`, `PageTransition`, `RouteAnnouncer`, `SkipLink`.
UI: `PageHero` + `Breadcrumbs`, `Magnet`, `FaqList`, `ShowCard`, `EventList`, `PosterButton` + `Lightbox`, `PosterText`, `Term` (glossary link), `ScrollReveal`, `ReadMore`, `SectionNav` ("In this section"), `TeamCard`, `RichText`.

## 3. Layout system

`.container` = `min(1180px, 100% - 32px)`; sections `padding: clamp(56px, 9vw, 120px) 0`; section variants: default cream, `--sand`, `--dark` (earth), `--rust`; `.grid--2/3/4` from 760px; header bar 78px min-height; `scroll-padding-top: 130px`.

## 4. Typography

Display: **Movement** (local, `MovementV.ttf`), weight 400, line-height 1.1. Body: **Source Sans 3** 200/400/600/700 (self-hosted via `next/font`). Body 1.125rem / 1.6.
h1 `clamp(2.6rem, 7vw, 5.5rem)`, h2 `clamp(2rem, 4.5vw, 3.4rem)`, h3 `clamp(1.4rem, 2.4vw, 1.9rem)`; eyebrow .8rem / 600 / .18em uppercase.

## 5. Tokens

`--rust #9a3a1e`, `--rust-text #7f2d16`, `--rust-dark #7a2c15`, `--accent-on-dark #e7b49f`, `--earth #3d2c2b`, `--ink #1f1716`, `--cream #f6efe9`, `--sand #ece0d6`, `--muted #54443f`, `--white #fff`, `--radius 4px`, `--max 1180px`, ease `cubic-bezier(.22,1,.36,1)`.

## 6. Breakpoints (from the reference CSS)

400, 480, 520, 560, 600, 700, 760, 800, 860, 900, 980/981 (desktop nav ↔ burger). Verified at 1440, 1280, 1024, 768, 430, 390, 375.

## 7. Multilingual architecture

`app/[locale]/…` (root layout per locale, `next/root-params`), `proxy.ts` rewrites unprefixed paths to `en` and redirects `/en/*` to the unprefixed URL. Dictionaries in `src/i18n/messages/{en,de,fr}.ts`, typed from English. Switcher keeps path + hash. First visit to `/` honours the saved choice (`localStorage dk-locale`) or browser language, like the reference. hreflang + canonical per page, sitemap with alternates.

## 8. Content model

`src/content/*`: navigation, socials, offers, agenda, productions (events), artists, team, partners, posters, workshops, legal data, easy-read pages, legal documents. Copy lives in the dictionaries; structure and media in `content/`.

## 9. JavaScript interactions

Preloader (counter + logo fly-in), home hero (char explosion, pinned scroll scene, watermark, mouse parallax), manifest chars, ticker with scroll-velocity skew, poster parallax/tilt, stamp, magnet buttons, reveal / split / parallax / tilt "directives", Lenis smooth scroll, header hide-on-scroll, dropdowns, mobile overlay, accessibility panel (persisted), lightbox, contact form validation → `mailto:`, newsletter validation, FAQ `<details>`, Read More, mobile section nav, page transitions + focus management. All motion is disabled by `prefers-reduced-motion` or the in-site toggle.

## 10. Assets

Migrated from the WordPress media library by `scripts/migrate-assets.mjs` (logo, partner logos, posters, workshop photos, team photos, artist portrait, production images, Movement font).
