# RADIAN validation report

Validated 8 October 2026 on this Windows workspace, Node 22.19.0, Next.js 16.4.0 / React 19.3.0, using Playwright Chromium 156.

## Results

| Check | Result |
| --- | --- |
| TypeScript strict check | Passed (`npm run typecheck`) |
| ESLint | Passed without warnings (`npm run lint`) |
| Production build | Passed; home, privacy, icon, sitemap and robots generated; enquiry endpoint remains server-rendered |
| Playwright suite | 28 passed, 45.0 seconds on final complete run |
| Automated accessibility | Zero violations in tested WCAG 2 A/AA and 2.1 A/AA rules at desktop and phone widths |
| Runtime dependency audit | Zero known vulnerabilities reported by `npm audit --omit=dev` |
| Source integrity | All 10 copied images/video matched original SHA-256 hashes |
| Real email delivery | Not tested; no credentials supplied, no external message sent |

Browser coverage: supplied image loading, no page runtime errors, scroll forward/rest/reverse, cache bounds, mobile delivery variant, missing-frame fallback, keyboard floor selection, floor-to-enquiry transfer, client validation, unconfigured submission error, a mocked success UI, server validation/honeypot/consent/body-size/origin rejection, mobile menu/Escape/focus, reduced motion without hydration errors, metadata/privacy/indexing, and overflow checks at 360, 375, 390, 430, 768, 1024, 1440 and 1920 px.

The valid unconfigured form/API test received HTTP 503 with an explicit not-sent message. The success test mocks the API and proves UI handling only. Real Resend delivery, Redis service connectivity/limits and inbox receipt require production credentials and an authorized integration test.

## Visual review

### Cinematic hero refinement

The hero player now uses direction-aware predictive loading, cancels obsolete downloads, settles rapid reversals on the exact frame, and atomically resizes/repaints the canvas. Mobile frame payload fell 29.8% to 2,802,590 bytes while retaining 90 frames. Four new regression tests passed for delayed/out-of-order frames, rapid seek cancellation, visible-canvas resize pixels and missing-frame retry cooldown. Full measurements, limitations and implementation notes are in `HERO-OPTIMIZATION.md` and `hero-profile-*.json`. Final lint, TypeScript compilation and production build passed.

### Complete section audit and fixes — 8 October 2026

Reviewed all 11 sections: hero, introduction, architecture, floor explorer, specifications, interiors, amenities, location, developer, contact and footer. Automated section checks cover 1440×900, 768×900, 390×900, 360×900 and 844×390; full section screenshots at desktop, tablet and phone widths are in `section-audit/`. Screenshots hide the fixed header and development overlay solely during capture to avoid overlapping section captures. Header/mobile-menu behavior is tested separately.

No broken rendered images, failed asset requests, runtime/console errors, or horizontal overflow were found in these 55 section checks. Expected development warnings concern reduced motion and lazy images detected as LCP when the audit programmatically scrolls to lower sections; these are not failed image loads. See `section-audit/report.json`.

Production smoke checks at 1440×900, 390×844 and 844×390 also passed fragment navigation, back to top, section image decoding and overflow checks with zero console/runtime errors or failed requests. All 551 media files returned HTTP 200, including the 280 current files and 271 unused files from the previous encoding whose cleanup was blocked by automatic review. Production screenshots and `production-report.json` are in `section-audit/`. Reproduce with `node scripts/audit-production.mjs` while a production server is running at port 3001; `AUDIT_URL` can override the address.

Fixed three confirmed behaviors without changing the palette, typography, imagery, section order or visual identity:

- Direct fragment links could become displaced when asynchronous animation pin spacing was inserted. Initial fragments now align after fonts and scroll layout settle, unless the visitor has already interacted.
- Back to top targeted the pinned hero and could return to the end of the sequence. A stable anchor before the pin now returns to document position zero and frame zero.
- Short/landscape viewports pinned a hero taller than the screen. Below 760 px height, the existing poster uses natural scrolling, with animation and cache cleanup when rotating and restoration in a taller viewport.

New regression coverage checks direct links and actual top position at 1440×900, 390×667 and 844×390, portrait/landscape rotation, and actual mobile-menu destination position below the sticky header. Existing overflow coverage also checks widths through 1920 px. The two zero-byte floor-plan sources remain unavailable, with honest on-request UI rather than broken image elements.

Inspected desktop and mobile hero, floor explorer and interior screenshots. Corrected secondary text contrast, a reduced-motion hydration mismatch and a narrow-phone footer overflow found during testing. Final production screenshots are in `docs/previews/`.

## Local performance sample

Single initial-viewport samples against a local production build; not Lighthouse scores, deployed field data or measurements on a physical phone. Browser contexts began with cold caches; local server/image caches may be warm. Network/CPU settings were configured through browser emulation and are approximate.

| Profile | FCP | LCP | Observed CLS | Reported initial resource transfer |
| --- | ---: | ---: | ---: | ---: |
| 1440×960, no throttling | 272 ms | 576 ms | 0 | 1,178,410 bytes |
| 390×844, configured 4× CPU / 1.6 Mbps / 150 ms network emulation | 1,208 ms | 1,208 ms | 0 | 630,519 bytes |

No browser runtime errors or horizontal overflow occurred in these samples. Raw observations and limitations are in `docs/performance-sample.json`. Reproduce with `node scripts/measure-preview.mjs` after starting a production server at port 3001 (or set `PERFORMANCE_URL`). Physical device, Safari, real mobile network, deployed caching, and full Core Web Vitals testing remain required before launch. These samples do not measure INP.

## Dependency and deployment limitations

The full dependency audit reports five high-severity development-tool findings in the Next ESLint / fast-glob / micromatch / braces chain. The registry's suggested automated fix would downgrade to an incompatible Next ESLint configuration. No forced downgrade or hidden suppression was applied; monitor the upstream compatible fix. The production dependency audit is clean.

No public site was deployed. Two floor-plan files are still empty, the RERA number and several owner-provided details remain unconfirmed, and lead delivery is unconfigured. Search indexing is disabled by default. See `PRODUCTION-READINESS.md` and `FACTS-TO-CONFIRM.md`.

## Mobile and tablet follow-up — 9 October 2026

Final complete browser suite: **33 passed in 47.4 seconds**. Includes five new touch-emulation cases for phone/tablet forward and reverse animation, image visibility, mobile pin spacing, every-section overflow and runtime errors. The original navigation, floor, form, reduced-motion and accessibility checks also pass. Fresh section audit: 55 checks, no broken images, request failures, runtime errors or horizontal overflow. Production build (including TypeScript) and lint passed. RERA and investment copy were updated as recorded in WORK-LOG.md. Physical devices and Safari remain unverified.

## Full visual redesign — 9 October 2026

Superseding validation: **36 tests passed in 51.1 seconds**. New checks cover gallery buttons/keyboard/image loading, selected-floor context and mobile enquiry visibility. Production build, strict TypeScript compilation and lint passed. All 55 section audit checks are clear; offscreen slides inside the intentionally clipped gallery are checked through dedicated gallery tests. Production smoke checks passed at desktop, phone and landscape sizes. See DESIGN-SYSTEM.md for the full design and validation record.
