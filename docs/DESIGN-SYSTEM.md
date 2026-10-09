# RADIAN visual system — 9 October 2026

## Identity

- Obsidian `#101214`: cinematic surfaces, navigation and footer.
- Graphite `#23272B`: layered dark surfaces.
- Warm porcelain `#F4F2ED`: readable content and light surfaces.
- Brushed champagne `#C8AD7F`: primary actions, floor selection and wordmark edges.
- Soft steel `#AAB2BA`: secondary text on dark surfaces.
- Deep emerald `#185C46`: registration accents on light surfaces.

Space Grotesk replaces decorative serif display typography. Manrope remains the body/interface family. Fonts are self-hosted through Next.js font optimization. The supplied logos retain their colors.

## Dimensional wordmark

The RADIAN heading uses real text with a metallic gradient face, shallow layered shadow/extrusion and subtle perspective tied to existing scroll progress. It is a CSS dimensional treatment, not a WebGL model or bitmap. Mobile keeps the same lightweight appearance with no perspective animation; reduced motion also disables this movement. The heading exposes one accessible RADIAN name.

## Components

- Compact floating navigation with translucent dark surface, restrained blur and champagne enquiry action.
- Clear hero hierarchy: dimensional brand, registration indicator, investment and monthly rental figures, one primary enquiry action and a secondary building-explorer link.
- A contained architectural stage sized for laptops and phones, retaining native-scroll frame playback and its decoded-cache bounds.
- Structured facts panel, alternating porcelain/dark sections, shorter typographic hierarchy, unified surface/border/radius treatments.
- A single floor-explorer card combines the supplied architectural visual, selected-level label, keyboard tabs, schematic indicator and enquiry action. It does not claim surveyed image-to-floor mapping.
- Interior gallery with native horizontal scrolling/swiping, snap alignment, previous/next buttons, keyboard arrows and position feedback. The gallery's clipped offscreen cards are intentionally excluded from generic page-overflow diagnostics; navigation/loading is tested separately.
- Contextual enquiry heading reflects the selected floor. Mobile enquiry control hides while the hero, enquiry form or footer is visible, and while navigation is open.
- Existing validation, delivery states, disclosures, project facts and Property Basket credit remain.

## Source map

`src/app/modern.css` is the redesign layer loaded after the original base layout. `layout.tsx` configures fonts. Component behavior is in `HeroScrollExperience`, `InteriorGallery`, `BuildingExplorer`, `EnquiryForm` and `MobileEnquiry`.

## Validation

The complete suite passed **36 tests in 51.1 seconds**, including new gallery navigation/image loading, selected-floor enquiry context and mobile enquiry visibility tests. Strict TypeScript compilation, production build and lint passed. All 55 section checks at desktop, tablet, phone and landscape sizes reported no escaped content outside intentional scroll containers, no horizontal overflow, no broken images and no runtime errors. Automated desktop/phone accessibility scans passed the tested rules.

Production checks passed at 1440×900, 390×844 and 844×390 with no console/runtime errors or failed media requests. Screenshots are in `docs/section-audit/`; `hero-profile-redesign-production.json` records the updated local animation measurement. Physical phones, Safari and deployed-network performance remain unverified. Real enquiry delivery still requires configured services.
