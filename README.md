# RADIAN by V Venturez

A complete Next.js architectural landing page using the supplied Radian imagery and scroll-controlled building animation. Prepared for Vercel; no public deployment or external enquiry transmission was performed.

## Run locally

Requires Node.js 22.12+ and npm. The lockfile pins the tested dependency tree.

```powershell
git clone https://github.com/Sambhram-Khairawadagi/RADIAN.git
cd RADIAN
npm ci
npm run dev
```

Open http://localhost:3000. Prepared media is included; FFmpeg is not needed just to run the site. `Start-Radian.cmd` is a Windows launcher. If a preview is already running, use its browser tab rather than launching a duplicate.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

## Included

- Obsidian/porcelain architecture-led page with brushed-champagne accents, emerald registration indicators, Space Grotesk / Manrope through Next.js font optimization, and a lightweight dimensional RADIAN wordmark.
- Responsive sticky navigation and keyboard-accessible mobile menu.
- Floating translucent navigation, a touch/keyboard interior gallery, integrated floor selection and contextual enquiry form, plus a mobile enquiry bar that hides around the hero, form, footer and open navigation.
- Canvas animation controlled by native scroll and GSAP ScrollTrigger; desktop/mobile variants, reverse scroll, bounded decoding, reduced-motion still image.
- Overview, architectural story, B/G/1–5 explorer, specifications, three supplied interior visualizations, seven listed amenities, approximate location links, developer section, contact and footer.
- Floor-specific enquiry selection, React Hook Form + shared Zod validation, inline errors and truthful delivery states.
- Server-side Resend email adapter, same-origin checks, honeypot, timing checks, request-size limits, and production shared rate limiting via Upstash REST. No unconfigured database/Supabase dependency.
- Privacy notice, SEO/Open Graph setup, factual Place structured data, sitemap and robots route. Preview indexing is off by default.

## File guide

| File/directory | Purpose |
| --- | --- |
| src/app/page.tsx | Composes the independent sections |
| src/app/globals.css | Palette, typography, responsive layouts and focus styles |
| src/components/ | Independent header, hero, explorer and page sections |
| src/config/project.ts | Typed facts, confirmation notes, levels, navigation and sequence limits |
| assets/source-map.json | Editable source image manifest |
| src/config/assets.generated.json | Generated image paths and dimensions |
| src/config/sequence.generated.json | Generated desktop/mobile frame manifest |
| src/lib/frame-cache.ts | Bounded bitmap fetch/decode cache |
| src/app/api/enquiry/route.ts | Server-side validation and delivery |
| src/lib/enquiry-schema.ts | Shared form schema |
| src/lib/rate-limit.ts | Development limiter / production Redis limiter |
| scripts/ | Repeatable image/frame preparation |
| public/media/ | Web-ready media |
| tests/site.spec.ts | Browser and HTTP regression checks |
| docs/ | Animation, deployment, readiness, factual verification and QA |

## Assets

Original Desktop assets were preserved. See `README-ASSETS.md` for exact mappings. Two floor plans remain empty; the site offers them on request rather than fabricating data. The footer displays the supplied Property Basket logo and the confirmed website design, maintenance and marketing credit.

Current project facts: **28 total units** and **1,12,918 sq ft built-up area**. See `WORK-LOG.md` for the work completed through 9 October 2026, and `docs/DEPLOYMENT.md` for Vercel setup. Import this repository with the root directory set to `.` and the Next.js framework preset. Prepared media is committed, so deployment does not require FFmpeg.

```sh
npm run assets:prepare
npm run frames:extract
```

Only frame regeneration needs FFmpeg. The animation is a real image sequence from the supplied 10.01-second video, not a reconstructed 3D scene. See `docs/SCROLL-ANIMATION.md`.

## Enquiry configuration

Copy `.env.example` to `.env.local` and configure the intended services. Never commit live keys. Without credentials, the handler returns 503 and the form says delivery is unavailable; direct call/email alternatives remain usable. Current local delivery is deliberately unconfigured.

Production requires a trusted `NEXT_PUBLIC_SITE_URL`, Resend credentials/sender/recipient, and shared rate-limit credentials. Set these in Vercel and rebuild. Success means the provider accepted delivery, not proof of inbox receipt. A live owner-authorized delivery test remains required.

## Browser tests

```sh
npx playwright install chromium
npm test
```

Tests cover forward/reverse playback, bounded cache, keyboard floor selection, enquiry integration, validation, unavailable backend, a clearly mocked success response, API rejection cases, mobile menu, reduced motion, missing frames, SEO, eight viewport widths and automated WCAG A/AA checks. They do not replace physical device or production inbox tests.

## Publishing

Follow `docs/DEPLOYMENT.md` and `docs/PRODUCTION-READINESS.md`. Keep `NEXT_PUBLIC_LAUNCH_APPROVED=false` until content/integrations are approved. This is an indexing control, not access protection; use Vercel deployment protection for private previews.

Official facts were checked on 8 October 2026 at https://vventurez.com/v-venturez-radian/. See `docs/FACTS-TO-CONFIRM.md`.
