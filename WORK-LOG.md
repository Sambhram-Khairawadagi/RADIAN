# RADIAN project work log

Work completed through **9 October 2026 (Asia/Calcutta)**.

Repository: https://github.com/Sambhram-Khairawadagi/RADIAN

## Website implementation

- Built a responsive Next.js App Router website using React, TypeScript and the established charcoal, ivory and gold visual identity.
- Added the cinematic hero, project overview, architectural story, B/G/1–5 floor explorer, specifications, interiors, amenities, location, developer, enquiry form and footer.
- Added keyboard-accessible floor selection, floor-to-enquiry transfer, responsive navigation, reduced-motion support, privacy notice, metadata, sitemap and preview indexing controls.
- Organized and copied the supplied logos, building images, interiors and original architectural video into the asset structure. Originals were preserved; optimized assets and frame manifests are included for deployment.

## Visual and functional audit — completed 8 October 2026

- Inspected all 11 page sections across desktop, tablet, phone and landscape sizes, with 55 section checks and overflow checks from 360 to 1920 px.
- Fixed direct section links being displaced by asynchronous hero pin setup.
- Fixed Back to top returning to the end of the pinned animation instead of the beginning.
- Added natural-scrolling static hero fallback for screens below 760 px tall and correct portrait/landscape cleanup and restoration.
- Checked image loading, runtime errors, form validation, mobile menu focus, floor navigation and automated desktop/phone accessibility.

## Cinematic hero optimization — completed 8 October 2026

- Used the supplied 10.01-second film for true scroll-controlled forward/reverse playback: 180 desktop frames and 90 mobile frames.
- Added direction-aware predictive loading, cancellation of distant downloads, exact-frame settling after rapid reversals and bounded decoded caches (18 desktop / 12 mobile).
- Prevented stale responses from drawing against the scroll direction, protected the displayed bitmap and resized/repainted the canvas together to avoid blank flashes.
- Added a cooldown for missing frames and retained the poster/last valid image while loading.
- Regenerated mobile frames at 640×360, reducing total mobile sequence bytes from 3,993,050 to 2,802,590 (29.8%). Active encoding paths include extraction settings in their hash.
- Controlled delayed-loading tests reduced 95th-percentile frame lag from 12 to 7 frames desktop and 9 to 5 phone, with zero wrong-direction draws in the final samples.
- Local production measurements showed 2-frame desktop / 1-frame phone lag at the 95th percentile, with 4× phone CPU throttling. These are local browser measurements, not guarantees for physical devices or deployed networks.

See `docs/HERO-OPTIMIZATION.md`, `docs/SCROLL-ANIMATION.md` and the saved profile reports for methods and limitations.

## Branding and approved content corrections

- Added the supplied Property Basket logo to a responsive footer credit: **Website design, maintenance & marketing by Property Basket**.
- Updated total units to **28** in both the overview and specifications.
- Temporarily changed built-up area to 3,000 sq ft at the user's request, then restored it on **9 October 2026** to the original **1,12,918 sq ft**. The unit count remains 28.
- Both displayed statistics now read shared project configuration, avoiding inconsistent duplicate values.
- Confirmed the footer at 1440, 390 and 360 px; checked both final statistics in the running website.

## Validation

- Final complete hero/site regression suite: **28 tests passed** on 8 October 2026.
- Lint, TypeScript checks and production builds passed during implementation and hero refinement.
- Production audits found no runtime/console errors, missing requested media or horizontal overflow at the tested sizes.
- The later branding and factual text edits were checked in the running website. GitHub handoff includes a fresh production build and lint check.
- No real enquiry email has been sent. Successful-delivery UI coverage uses a mocked API; unconfigured delivery truthfully reports that the enquiry was not sent.

## GitHub / Vercel handoff — 9 October 2026

- Prepared the project at repository root for a Next.js import into Vercel, including the dependency lockfile, generated media and manifests.
- Excluded dependencies, build output, local environment files, test-run output, scratch files and superseded animation frames from Git.
- Included `.env.example` with empty service credentials, asset documentation, deployment instructions and this work log.
- The user will deploy from GitHub. No Vercel deployment or domain change is part of this handoff.

## Remaining launch items

- Supply approved floor plans; the two source files are still empty and the website shows plans as available on request.
- Configure the deployment origin, Resend email delivery and Upstash rate limiting using Vercel environment variables; perform an authorized delivery test.
- Confirm the RERA number, elevator count, exact map pin and other outstanding owner details in `docs/FACTS-TO-CONFIRM.md`.
- Review final privacy/consent wording and enable indexing only after launch approval.
- Physical-device, Safari and deployed-network performance remain unverified.

See `docs/DEPLOYMENT.md` and `docs/PRODUCTION-READINESS.md` for the deployment checklist.

## Mobile playback and marketing update — 9 October 2026

- Fixed mobile animation being disabled below 760 px viewport height. Phones now pin only the building image with explicit pin spacing; hero text flows naturally, and the next section stays below the animation.
- Short landscape viewports play the sequence without pinning a hero taller than the screen. Reduced-motion preferences retain the static poster.
- Highlighted RERA REGISTERED in the hero and specifications. Registration remains owner-reported; the registration number is still awaited and is not fabricated.
- Added the user-approved hero message: Invest ₹3 crore. Rental potential up to ₹2.4 lakh per month. The user explicitly confirmed the monthly period. The adjoining note identifies it as an indicative owner-provided projection, subject to leasing and final terms, without guaranteed returns.
- Checked every section at phone/tablet sizes and added five touch-emulation regression cases (320×568, 375×667, 430×932, 768×1024 and 1024×768) for forward/reverse frames, visible playback, pin spacing, overflow and runtime errors.
- Preserved 28 units, 1,12,918 sq ft built-up area, Property Basket credit and established visual identity.

## Complete architectural redesign — 9 October 2026

- Implemented the user's approved graphite/porcelain/champagne direction across the complete website, with emerald RERA accents and Space Grotesk/Manrope typography.
- Added a lightweight metallic, shallow-extrusion RADIAN text wordmark with restrained desktop scroll perspective and a static mobile/reduced-motion treatment.
- Reworked hero hierarchy and primary enquiry action, floating glass navigation, project facts, architectural story, integrated floor explorer, specifications, swipe/keyboard interior gallery, amenities, location, developer, form and footer styling.
- Added selected-floor context to the enquiry form and a mobile enquiry control that hides around the hero, form, footer and open navigation.
- Fixed narrow-screen grid sizing and heading overflow introduced by the stronger typography; refined the hero for laptop-height screens and resized the mobile animation stage.
- Retained 28 units, 1,12,918 sq ft, user-approved investment/rental figures, RERA disclosures and Property Basket branding.
- Final verification: 36 browser tests passed (51.1 seconds), TypeScript production compilation/build and lint passed, 55 section checks clear, and production smoke checks passed on desktop, phone and landscape.
- See `docs/DESIGN-SYSTEM.md` and the refreshed screenshots and reports for implementation and testing details.
