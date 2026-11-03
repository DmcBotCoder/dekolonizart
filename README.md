# DekolonizArt – website (version 1)

Coded rebuild of the DekolonizArt website. Design and behaviour follow the OnPoint
prototype; content comes from the WordPress site. See `docs/RECONSTRUCTION_PLAN.md`
for the audit summary and `docs/COMPLETION_REPORT.md` for status and open items.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript ·
CSS Modules + design tokens · GSAP (ScrollTrigger, SplitText) + Lenis for motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages pre-rendered)
npm run start
npm run lint
npm test           # unit tests (Node's built-in test runner, no extra packages)
```

Set `NEXT_PUBLIC_SITE_URL` (defaults to `https://dekolonizart.com`) – it is used for
canonical URLs, hreflang, Open Graph and the sitemap. Deploy on a Node host or
Vercel: the locale proxy and image optimisation need a server.

## Languages

| URL | Language |
| --- | --- |
| `/about` | English (default, unprefixed) |
| `/de/about` | German |
| `/fr/about` | French |

- `src/proxy.ts` rewrites unprefixed URLs to the English route and redirects `/en/…` away.
- All UI copy lives in `src/i18n/messages/{en,de,fr}.ts`. `de` and `fr` are typed
  against `en`, so a missing translation is a type error.
- The language switcher keeps the current page and hash. A first visit to `/` goes
  to the saved or browser language (same as the prototype).
- Old WordPress URLs are redirected in `next.config.ts`.

## Where content lives

| What | File |
| --- | --- |
| Translated copy (all pages) | `src/i18n/messages/*.ts` |
| Navigation tree | `src/content/navigation.ts` |
| Productions (event pages) | `src/content/productions.ts` + `messages.shows` |
| Ticket links (Vibetix) | `booking` of each production in `src/content/productions.ts` |
| Intro videos (YouTube) | `introVideo` of each production in `src/content/productions.ts` |
| Agenda / dates | `src/content/agenda.ts` + `messages.events` |
| "All events" page (`/events`, with search) | built from the agenda and the productions in `src/content/events.ts`; category per production (`category`) or agenda entry |
| Artists (`/artists#slug`) | `src/content/artists.ts` |
| Team | `src/content/team.ts` |
| Posters, workshop photos, partners | `src/content/media.ts` |
| Hero image of a production page | `heroImages` in `src/content/media.ts`, chosen per production with `heroImage` |
| Photos of the three services (cards on Home and Services, hero of Theater / Artistic / Movement & dance) | `offerImages` in `src/content/offers.ts` |
| Closing portrait before the footer (home) | `closingPortrait` in `src/content/media.ts` |
| Easy-read pages (one per language) | `src/content/easy-read.ts` |
| Impressum / Datenschutz (German) | `src/content/legal/` – fill the `TODO:` values in `data.ts` |
| Contact e-mail, socials, venue | `src/content/site.ts` |

### Read More

Long texts (production plot, artist biographies) are cut where the editor puts
`<!--more-->`. Everything after the marker is hidden behind "Read More" and stays in
the normal page flow. Move the marker to change the break point.

### Booking (Vibetix)

Every booking button ("Book now", "Book your seat", "Reserve your seat", the date rows
and the menu card) leads to the production's booking page `/events/<slug>/booking`.
That page sends visitors on to the link in `booking.url`:

```ts
booking: { provider: 'vibetix', url: 'https://…the event’s Vibetix link…', enabled: true },
```

While `url` is `null` (or `enabled` is `false`) the booking page says online booking is
not available and offers reservation by e-mail – it never links to a guessed address.

### Intro video (YouTube)

```ts
introVideo: { provider: 'youtube', url: 'https://www.youtube.com/watch?v=…' },
```

Any normal YouTube link works (watch, youtu.be, shorts, embed); a link that is not a
YouTube video stops the build with an error. The video is shown on the production page
between the plot and the cast, starts muted and loops (browsers only allow muted
autoplay); the player's own controls pause, resume and unmute it. Visitors who reduce
motion get it paused. Without `introVideo` the section is left out.

### Adding a production

1. Add an entry to `productions` in `src/content/productions.ts` (stable `slug`,
   `booking` – `url: null` until the Vibetix link exists – optional `introVideo`).
2. Add `shows['<slug>']` (date, title, teaser) to all three message files.
3. Optional: add dates to `agenda.ts`, cast to `cast`, a poster to `media.ts`.

The pages `/events/<slug>` and `/events/<slug>/booking`, the "In this section" entry,
the cards on Theater and Movement & Dance, and the sitemap pick it up automatically.

## Motion

Server components mark elements with data attributes (`src/lib/motion/attrs.ts`):
`reveal()`, `split()`, `parallax()`, `tilt()`. `PageTransition` applies them after
each navigation (`src/lib/motion/directives.ts`). Page-specific timelines live next to
their page (`HomeMotion.tsx`, `TeamGrid.tsx`, `NotFoundView.tsx`). Everything is
skipped when the visitor reduces motion (OS setting or the in-site switch).

## Assets

`scripts/migrate-assets.mjs` downloads the images and the Movement font from the
WordPress media library and writes optimised (and, where noted, cropped) copies to
`public/` and `src/fonts/`. Pass target paths to migrate only those files, e.g.
`node scripts/migrate-assets.mjs img/media/offer-movement.webp`.
# dekolonizart
