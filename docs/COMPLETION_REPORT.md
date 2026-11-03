# Completion report – version 1

Status: phases 1–10 done for every page that exists in the references. Build, type-check and lint pass.
Open items are mostly **content decisions** (section 7) and **legal data** (section 8).

## Update – 3 Nov 2026: booking, intro video, contact

- **Booking:** every booking button (event cards on Theater and Movement & Dance, "Reserve your seat" on Theater, "Book your seat" on Home and in the Services menu card, "Book now" and the date rows on production pages) now leads to the production's booking page `/events/<slug>/booking` (EN/DE/FR). None of them points to `/contact` any more. The booking page hands over to the Vibetix link set in `booking.url` (`src/content/productions.ts`).
- **Vibetix links missing for all three productions** (Douala Manga Bell, The Tragedy of Melilla, Tam Tam): `url: null`. Until a link is added, the booking page says online booking is not available and offers reservation by e-mail (the method the booking FAQ already describes). Vibetix is therefore **not integrated yet**; the hand-over was only tested locally with a dummy link that was removed.
- **"View poster" removed** from Home, Theater and the production pages; the poster itself still opens the lightbox. In its place: "About the theatre" (existing card wording) → production page.
- **Intro video:** optional `introVideo` per production, shown between plot and cast; inline YouTube player (privacy-enhanced youtube-nocookie domain, no extra script), muted autoplay + loop, pause/resume/unmute through the player controls, paused for visitors who reduce motion, section omitted when no video is set. **Configured:** Douala Manga Bell (`youtu.be/tccCwcyiRk4`, 4:3 – shown with side bars in the 16:9 frame) and Tam Tam (`youtu.be/4y-sGFMKQxQ`). **Missing:** The Tragedy of Melilla.
- **Contact page:** form removed; the two department e-mail addresses are shown centred. Contact-form strings, the form component and its styles were deleted; the accessibility statement and privacy policy no longer mention a contact form.
- **Intro videos and legal texts:** the accessibility statement now lists the videos (YouTube's automatic captions only – English for Douala Manga Bell, French for Tam Tam). The privacy policy has a new section 6 on YouTube embeds; its legal basis is a highlighted `TODO`: the player loads and autoplays without prior consent, which German data-protection authorities usually do not accept – needs legal review (a click-to-load consent would rule out autoplay).
- **Before Vibetix goes live:** mention ticket sales through Vibetix in the privacy policy (legal review).

## Update – 3 Nov 2026: Theater page events, Theater & Geschichte moved

- **Theater page "Upcoming events"** now lists exactly the theatre events, in this order: Public theatre reading (13 Dec 2026), Rudolf Douala Manga Bell (Sept 2027), The Tragedy of Melilla, Tam Tam – the same entries as the "All events" page (category Theatre), so both always agree.
- **Theater & Geschichte** belongs to the MeMo workshops: its full section (poster, dates, venue, "Sign up now", funding credit) moved from the Theater page to the Artistic page (`/artistic#youth`), replacing the short teaser that only linked back to Theater. All links to it ("What's on", "All events") now go there.
- The Theater page's **"Past & ongoing" list was removed**: without Theater & Geschichte it only repeated the two Douala Manga Bell dates shown in the cards above.

## Update – 3 Nov 2026: "All events" page

- **New page `/events`** (EN/DE/FR, in the sitemap): every event in one list – the dated agenda entries (Douala Manga Bell reading 13 Dec 2026 and performance Sept 2027, Theater & Geschichte every Sat/Sun) followed by the productions without a date (The Tragedy of Melilla, Tam Tam). Each card shows date, category tag (Theatre / Workshop / Movement & dance), title and the same booking/information links as elsewhere (the workshop card: "Sign up now" → Contact, "Know more" → its section on the Artistic page).
- **Search field** filters the cards as you type (name, subtitle, date or category; case and accents ignored, every word must match), with a live result count and a "show all" button when nothing matches.
- Home "View all events" now opens `/events` (it went to the Theater page).
- There is **no movement & dance event** yet; the category exists for future entries. Past MeMo workshops (Spandau, Doha) stay on the Artistic page – they have no dates.

## Update – 3 Nov 2026: service photos, closing portrait

- **Services page:** the three service cards now use the same photos as the home cards (shared style `src/styles/photo-card.module.css`).
- **Theater, Artistic and Movement & dance pages:** the hero shows the photo of that service on the right (same layout as the production pages).
- **Home, before the footer:** full-height portrait of Ngako Keuni (WordPress `2026/08/Ngakoportraitaktuell1-scaled.webp`, already migrated as `img/team/ngako-keuni.webp`), mirrored as on WordPress, darkening into the footer colour (`--ink`) so image and footer read as one surface; the top and both sides are darkened too. As on WordPress it carries the "|| Support DekolonizArt" label, the donation text and a small Donate button (`#support`, target of the header "Donation" buttons – they land with the button on screen). The light section above now only invites people to join the community (no Donate button). Text contrast on the photo measured ≥ 4.5:1 at all widths.

## Update – 3 Nov 2026: offer photos, hero images

- **Home "Our Offers" cards** now have the WordPress home page photos as backgrounds (under a dark gradient so the text keeps its contrast): Performance projects = `2026/06/Screenshot-2025-07-05-170022.webp` (same file as the Melilla photo), Workshops = `2026/06/Screenshot-14.webp` (black video bars cropped), Movement & dance = `2026/08/photo_2026-08-11_17-36-39.webp`.
- **Production page hero** can show an image on the right with a diagonal edge (a band under the text on phones). Douala Manga Bell: the portrait from the WordPress crowdfunding cover (cropped, 557 × 512 px – the only clean source; slightly soft on large retina screens). The Tragedy of Melilla: its stage photo (no longer repeated in the page body). **Tam Tam has no image** – its WordPress page only reuses the Douala Manga Bell cover.

## 1. What was implemented

- **Foundation:** Next.js 16 App Router, TypeScript, design tokens + CSS Modules ported rule-for-rule from the OnPoint CSS, Movement + Source Sans 3 fonts (self-hosted), GSAP/ScrollTrigger/SplitText/Lenis motion layer (same libraries and timings as the reference).
- **Layout:** notice bar (EN/DE/FR switcher, accessibility panel), sticky header (roll-hover pill menu, dropdowns with feature card, magnet donation button, hide on scroll), mobile overlay (circle reveal, accordion submenus, inert background, focus handling), footer (newsletter validation, socials, legal links, reduce-motion toggle), preloader (counter, logo fly-in), page transitions with focus management.
- **Pages (×3 languages):** Home, About, History, The team, Services, Theater, Artistic (MeMo), Movement & dance, Contact, Glossary, Easy read (separate EN/DE/FR texts), Accessibility statement, Impressum, Datenschutz, 404.
- **From WordPress (missing in OnPoint):** production pages `/events/[slug]` (Douala Manga Bell, The Tragedy of Melilla, Tam Tam) with "In this section" navigation, plot with editor-controlled Read More (`<!--more-->`), cast cards → `/artists#slug`, dates, booking FAQ; `/artists` page with stable anchors and Read More biography; partner website links; venue map link; 30 legacy URL redirects.
- **SEO:** localized titles/descriptions, canonical, hreflang (en/de/fr/x-default), Open Graph, `sitemap.xml` with alternates, `robots.txt`, `noindex` on 404.

## 2. Files

`src/app/[locale]/*` (pages), `src/components/layout/*`, `src/components/ui/*`, `src/content/*` (content model), `src/i18n/*` (dictionaries + routing helpers), `src/lib/*` (motion, SEO, a11y settings, boot script), `src/proxy.ts`, `next.config.ts`, `scripts/migrate-assets.mjs`, `docs/`.

## 3. References used

Design, layout, motion: OnPoint build (compiled CSS, Vue templates, GSAP timelines and all three message catalogs were read directly). Content gaps: WordPress REST API and media library.

## 4. Responsive verification

Measured the position/size of every section (and, where they differed, every heading, image, button, list and field) on both sites:

| Width | Result |
| --- | --- |
| 1440 | all 14 inner pages identical (±1 px rounding); home header/hero values identical |
| 1280, 1024, 768 | home + 6 key pages identical (±1 px) |
| 430, 390, 375 | all measured pages identical (±1 px); home hero at 390 pixel-identical |

Header (79 px) and footer heights identical at every width. No horizontal overflow at any width. Mobile menu, submenu accordion, "In this section" disclosure and Read More tested.

## 5. Multilingual state

EN default (unprefixed), DE `/de`, FR `/fr`; all UI and page copy translated (from the OnPoint catalogs). Switcher keeps path + hash and remembers the choice; first visit to `/` follows saved/browser language. Exceptions shown with a notice: legal pages (German only, legally binding), production plot (English only), Ngako Keuni's biography (German only).

## 6. Remaining visual differences (intentional, small)

- Datenschutz is shorter: the Google Fonts section was removed (fonts are self-hosted; the template itself says to drop it).
- Impressum warning box wraps one line more (new file path in the text).
- Production heading uses the Theater-page pattern; production and artist pages are new (no reference design) and are built only from existing OnPoint components and tokens.
- The OnPoint hidden "classic" intro (`?intro=classic`) was not rebuilt; the default intro is.
- Two reference bugs were fixed instead of copied: the hero scroll scene also faded the "Book your seat"/"Donate" buttons further down, and the offer cards could widen the page by 1 px on phones.

## 7. Placeholder / missing content found

- **Team:** apart from Ngako Keuni, the portraits are the stock photos of the WordPress template (`Team-member-N.jpg`); names/roles (e.g. "PPC Campaign manager") look like template data too. OnPoint used a photo of Ngako Keuni for "Sophie" – replaced by WordPress's image for Sophie. Needs real team data.
- **Social links** point to the network home pages (Instagram/Facebook/TikTok/YouTube) in both sources – real profile URLs needed. The artist page's LinkedIn/Twitter/Dribbble icons on WordPress had no links (not migrated).
- **History** page title is "Coming soon" in OnPoint (WordPress page is lorem ipsum).
- **Dates conflict:** OnPoint gives Douala Manga Bell "FRI 12 MAR · 8 PM" and "Sept 2027"; WordPress cards repeat the same text/dates across productions. OnPoint kept – please confirm.
- **The Tragedy of Melilla / Tam Tam:** only a one-line teaser exists; their WordPress pages are copies of the Douala Manga Bell page or contain test text. Pages show what is real; dates "TBA".
- **Cast:** WordPress cast grid is placeholder ("nina – home diy teacher" ×9). Only Ngako Keuni and Athanasios Karakantas are listed. Athanasios has no photo or bio.
- **Ngako Keuni roles** include "Lead role of Tidjame" – Tidjame does not appear in the plot; please confirm. Biography exists only in German; plot only in English.
- **Workshop school:** text says "Borsig School", the photo file is named "Borchert-Schule" – please confirm.
- WordPress-only placeholders not migrated: event dates page (lorem ipsum, "22 December, Hermannstr 17"), customer reviews, "Service & infos" accordion (answers copied from the FAQ), ticket/shop pages.
- **Donation:** "Donate" buttons lead to Contact (as in the reference); no donation provider or bank details exist in either source.
- Newsletter form only validates (no mailing service connected, as the privacy policy states).

## 8. Technical notes / blockers

- The OnPoint server's TLS certificate is issued for another host, so its files could not be downloaded directly; assets were taken from the WordPress media library (same files, matched visually and by dimensions). The OnPoint server also returns a server 404 for deep links such as `/about` (only in-app navigation works).
- **Legal:** Impressum/Datenschutz/Accessibility contain highlighted `TODO` values (legal form, address, representative, phone, register, VAT ID, editorial responsibility, hosting provider, review date, enforcement procedure). Fill `src/content/legal/data.ts` and have the texts legally reviewed. The storage section of the privacy policy was updated to what this build stores (accessibility settings, language choice, one-time intro-skip flag).
- Locale routing and image optimisation need a Node server (Vercel or `next start`), not a static file host.

## 9. Tests

`npm run build` ✓ (67 static pages), `npm test` ✓ (7 unit tests), `tsc --noEmit` ✓, `npm run lint` ✓ (0 problems). Production console: no errors besides the expected 404 status on 404 pages. Functional checks: language switch URLs, first-visit redirect, legacy redirects (308), 404s, keyboard dropdowns (Enter/Tab/Escape), skip link, mobile menu focus/inert/Escape, accessibility panel persistence and reset, reduced motion (no intro, no smooth scroll, all content visible), cast → artist anchor scroll + focus, Read More `aria-expanded`.
Unit tests cover the YouTube link parser and the booking-link resolution (`npm test`); there is no browser test suite yet.

## 10. Recommended next step

Resolve the content items in section 7 (team, socials, dates, cast, translations of plot/bio) and the legal data in section 8; then add an automated check (Playwright + axe) for the flows listed in section 9 before going live.
