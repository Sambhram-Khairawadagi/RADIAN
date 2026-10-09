# Scroll-controlled building film

Source: `assets/animations/radian-scroll.mp4`, copied byte-for-byte from the supplied Desktop MP4. Duration: 10.01 seconds. The original was preserved.

## Extraction

`npm run frames:extract` runs FFmpeg using argument arrays, detects duration, hashes the source and writes WebP frames plus `src/config/sequence.generated.json`. Set `FFMPEG_PATH` if needed.

| Variant | Frames | Width | Total encoded bytes |
| --- | ---: | ---: | ---: |
| Desktop | 180 | 1440 px | 22,833,768 |
| Mobile | 90 | 640 px | 2,802,590 |

Aspect ratio is preserved. A compressed 960 px MP4 is generated for standalone review; the site does not autoplay it or represent it as the sequence.

## Playback

`HeroScrollExperience` supplies the poster/text. `FrameSequenceCanvas` dynamically imports GSAP/ScrollTrigger. Native scroll maps to `round(progress * (frameCount - 1))`, with 400vh desktop / 220vh mobile pin distance configurable in `project.ts`. Upward scrolling requests earlier frames. No time-based playback or perpetual render loop advances the film.

Five progress labels are editorial markers at 20% intervals; actual camera/cloud/unfolding timing comes entirely from the supplied film. No synthetic geometry is added.

The cache retains at most 18 desktop / 12 mobile ImageBitmaps and runs at most three loads/decodes concurrently. It predicts a bounded look-ahead from scroll velocity and observed load duration, retains a reverse buffer, cancels distant requests, and closes faraway bitmaps while protecting the displayed image. Approximate decoded-frame memory caps are 18 × 1440 × 810 × 4 bytes desktop and 12 × 640 × 360 × 4 mobile, plus in-flight images, poster, canvas and browser overhead. HTTP encoded caching is separate. The entire sequence is not decoded into memory.

Drawing runs only when the available image or canvas dimensions change. It reads the latest native scroll position before selecting a bitmap, accepts only a frame between the displayed and target positions, and filters stale completions against the direction of travel. An exact target can always settle, including after rapid reversals. Missing frames retain a valid displayed image and have a five-second retry cooldown. The server-rendered poster prevents blank first paint. Canvas uses containment without stretching or additional cropping; source-video cropping cannot be recovered.

ResizeObserver schedules canvas dimension changes with DPR capped at 2 desktop / 1.5 mobile and width capped at source resolution. Resizing and repainting happen in one animation-frame callback, only when a decoded bitmap is available. React readiness changes only on the first successful draw and player disposal. ScrollTrigger refreshes after fonts and viewport changes. Media queries re-create the player at the breakpoint. Cleanup closes bitmaps and cancels requests, observers and triggers.

## Fallbacks

- Reduced motion: static supplied poster, no pinning or sequence requests.
- Viewports below 760 px tall: static poster with natural scrolling, preventing a taller hero from trapping content outside the viewport. Rotation back to a taller viewport restores the player and its bounded cache.
- Missing video/manifest: supplied architectural still, no sequence pin.
- No ImageBitmap support: static poster without frame pinning.
- Individual missing frames: nearest decoded frame remains visible.
- JavaScript unavailable: server-rendered content/images/contact links remain, while interactions require JavaScript.

Prepared sequences are included, so they still work when local FFmpeg is unavailable. If no sequence can be prepared, set `available:false` and use a static image while arranging conversion. The generated MP4 is a review file; no video fallback is falsely described as frame-exact scrubbing.

The home fragment is a stable anchor before the pinned element. Initial section fragments are aligned after fonts and pin layout settle; wheel, touch, pointer or keyboard interaction cancels this one-time alignment so it does not override visitor navigation.

Browser checks assert forward/reverse indices, rest stability, cache caps, mobile requests, missing-frame resilience, reduced motion, direct section links, return-to-top positioning and viewport rotation. Physical phone/network testing remains a launch task.
