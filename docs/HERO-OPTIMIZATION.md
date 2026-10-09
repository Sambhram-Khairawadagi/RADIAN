# Cinematic hero optimization — 8 October 2026

The actual supplied ten-second architectural film remains mapped to native scroll. Typography, layout, colors, imagery and section order are preserved. There is no autoplay timer, synthetic frame interpolation or artificial smooth-scroll layer.

## Changes

- Direction-aware predictive loading uses scroll velocity and measured fetch/decode time to prepare useful frames in advance. Three bounded concurrent loads replace the two-slot queue; decoded cache caps remain 18 desktop / 12 mobile.
- Large seeks cancel distant requests. Returning to an aborted request requeues the current target. Unchanged frame targets do not rebuild the queue on every scroll callback.
- Painting reads the latest native scroll position so decode completions between GSAP ticks cannot select a frame for an obsolete direction. Intermediate frames cannot overshoot or move away from the target; the exact requested frame can always settle.
- The displayed bitmap is protected from eviction. Resizing and drawing occur together, without clearing the visible canvas while waiting for a bitmap. Readiness updates no longer run on every painted frame.
- Missing/corrupt frames have a five-second retry cooldown. Previously displayed pixels or the initial poster remain visible.
- Mobile files were regenerated directly from the original video at 640×360, WebP quality 66, preserving 90 frames. Total encoded size is 2,802,590 bytes, down from 3,993,050 (29.8%). Decoded mobile bitmap size falls by 30.6%. Desktop retains 180 frames at 1440×810. Generated paths include the extraction settings in their hash to avoid serving old encodings from cache.
- Reduced motion and short-screen static fallbacks, rotation cleanup, anchor navigation and source-resolution canvas limits remain intact.

## Measurement method

`scripts/profile-hero.mjs` drives four two-second sweeps: 0 → 75% → 15% → 90% → 0. It records the displayed index, desired index, animation-frame interval and decoded cache count. The baseline and refined stress profiles use the same local development server, added 40 ms desktop / 100 ms phone frame-response delay, and a phone viewport of 390×844 at DPR 3 with 4× CPU throttling. Playwright routing disables HTTP caching, making reverse seeks deliberately more demanding. These are single controlled samples, not physical-device or field measurements and not bandwidth-throttled network tests.

Raw baseline/refined results: `hero-profile-before.json` and `hero-profile-after.json`. Local production results with ordinary browser caching: `hero-profile-production.json`. The recorded requestAnimationFrame interval describes browser scheduling, not unique-film-frame FPS. Sparse source frames and cold network delivery can still cause holds; no claim of universal 60 fps is made.

| Controlled stress measurement | Desktop before → after | Phone before → after |
| --- | ---: | ---: |
| 95th-percentile frame-index lag | 12 → 7 | 9 → 5 |
| Wrong-direction draws | 5 → 0 | 4 → 0 |
| Longest hold during movement | 67 → 117 ms | 217 → 267 ms |
| Maximum decoded cache count | 18 → 18 | 12 → 12 |

The longer worst hold under artificial delay is an explicit tradeoff: retain a valid image rather than display a stale completion in the wrong direction. Prediction uses more concurrent useful requests; the profile does not claim lower total request count or zero latency.

The final local production sample had zero wrong-direction draws, 95th-percentile lag of 2 frames desktop / 1 phone, and longest holds of 17 ms desktop / 50 ms phone. Browser animation-frame intervals at the 95th percentile were 16.7 / 16.8 ms. Phone CPU throttling was 4×, but the network was local. Safari, physical devices and deployed mobile networks remain unmeasured.

All 28 browser tests passed on the final full run (45.0 seconds). Lint, strict TypeScript compilation and production build passed. Production smoke checks passed at desktop, phone and landscape sizes with no runtime/console errors or failed media requests.

## Regression coverage

`tests/hero.spec.ts` tests delayed out-of-order arrivals, monotonic forward/reverse seeks, rapid return to cancelled downloads, exact endpoint settling, missing-frame cooldown and canvas pixels during repeated resizing. The existing site suite covers rest stability, cache caps, mobile source selection, missing-frame fallback, reduced motion, rotation and fragment navigation.

The original source video is untouched. Older generated frames remain unreferenced in the local public directory because automatic review blocked their cleanup; the active manifest points exclusively to the new encoding.
