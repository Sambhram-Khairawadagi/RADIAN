# RADIAN asset directory

Real assets were found in `C:\Users\sambh\Desktop\radian-website`. Desktop originals were left untouched. Exact copies replaced only the empty placeholders in this project's `assets` directory.

| Supplied filename | Project source path |
| --- | --- |
| Isometric Modern Office Campus at Dusk.png | assets/building/building-aerial.png |
| Radian by V Venturez_ Golden-Hour Cityscape.png | assets/building/building-front.png |
| Exploded Radian Office Tower at Sunset.png | assets/building/building-unfolded.png |
| Twilight Radian Office Complex.png | assets/building/building-side-angle.png |
| Ultra-Modern Corporate Lobby at Twilight.png | assets/interiors/entrance-lobby.png |
| Luxury Office Interior with City Views.png | assets/interiors/open-office.png |
| Luxury Conference Room at Golden Hour.png | assets/interiors/conference-room.png |
| V Venturez Corporate Logo (1).png | assets/branding/v-venturez-logo.png |
| Property Basket Logo with Shopping Cart Icon.png | assets/branding/property-basket-logo.png |
| 5d91990d-7d3a-4907-9b50-7d87b18946cf.mp4 | assets/animations/radian-scroll.mp4 |

`assets/provenance.json` preserves filename mapping; `docs/asset-audit.json` records validity and size. Alternative exploded views and duplicate `(1)` copies remain in the Desktop directory.

## Missing floor plans

`assets/floor-plans/floor-plan-01.png` and `floor-plan-02.png` are still zero-byte placeholders, not usable media. Older plans in a separate earlier project described six office floors and were not imported into this B+G+5 brief. Supply approved current plans and their exact level assignments.

## Replacing assets

1. Put the approved original into `assets/`, retaining your original elsewhere.
2. Update `assets/source-map.json` if the filename changes.
3. Run `npm run assets:prepare` and rebuild.

The script checks readability, respects image orientation, scales down without enlargement, and writes content-hashed WebP copies to `public/media/images`. It generates `src/config/assets.generated.json`. Invalid media becomes a null entry with a graceful text fallback. Nine optimized images total approximately 2.43 MB before Next.js responsive optimization.

Set each floor's `planKey` in `src/config/project.ts` only after confirming the assignment. Property Basket's supplied logo is displayed in the footer with the user-confirmed website design, maintenance and marketing credit configured in `partnerRole`.

All renderings are disclosed as artist's impressions. Rendered floor counts, labels, landscaping and context do not replace approved plans. See `docs/SCROLL-ANIMATION.md` for animation preparation.
