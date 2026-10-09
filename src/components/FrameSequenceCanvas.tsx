"use client";
import { useEffect, useRef } from "react";
import { sequence } from "@/config/assets";
import { project } from "@/config/project";
import { FrameCache } from "@/lib/frame-cache";
export function FrameSequenceCanvas({
  container,
  onReady,
}: {
  container: React.RefObject<HTMLElement | null>;
  onReady: (ready: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(onReady);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = container.current;
    if (!canvas || !section || !sequence.available) return;
    let cancelled = false;
    let cleanup = () => {};
    const initialHash = window.location.hash;
    let interacted = false;
    const markInteraction = () => {
      interacted = true;
    };
    const interactionEvents = [
      "wheel", "touchstart", "pointerdown", "keydown",
    ] as const;
    interactionEvents.forEach((event) =>
      window.addEventListener(event, markInteraction, { passive: true }),
    );
    // The browser resolves fragments before the asynchronous pin adds its space.
    // Align once after layout settles, without overriding a visitor's navigation.
    const alignInitialFragment = () => {
      if (
        cancelled || interacted || !initialHash ||
        window.location.hash !== initialHash
      ) return;
      let id: string;
      try {
        id = decodeURIComponent(initialHash.slice(1));
      } catch {
        return;
      }
      document.getElementById(id)?.scrollIntoView({
        behavior: "instant", block: "start",
      });
    };
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add(
          {
            mobile: "(max-width: 760px)",
            desktop: "(min-width: 761px)",
            reduced: "(prefers-reduced-motion: reduce)",
            short: "(max-height: 759px)",
          },
          (context) => {
            const { mobile, reduced, short } = context.conditions!;
            if (reduced || typeof createImageBitmap === "undefined")
              return;
            const variant = mobile ? sequence.mobile : sequence.desktop;
            if (!variant) return;
            const ctx = canvas.getContext("2d", { alpha: false });
            if (!ctx) return;
            let raf = 0;
            let lastIndex = -1;
            let shown = false;
            let width = 0;
            let height = 0;
            const paint = () => {
              raf = 0;
              // A decode can complete between native scroll and GSAP's ticker.
              // Read the current position before choosing a bitmap so a sudden
              // reversal cannot paint against the visitor's latest movement.
              const progress = Math.max(0, Math.min(1,
                (window.scrollY - trigger.start) / (trigger.end - trigger.start),
              ));
              cache.request(Math.round(progress * (variant.count - 1)));
              const { image, index } = cache.closest();
              if (!image) return;
              if (!width || !height) return;
              const resized = canvas.width !== width || canvas.height !== height;
              if (index === lastIndex && !resized) return;
              // Resizing clears a canvas. Resize and redraw in the same paint,
              // only when a decoded image is available; never expose a blank.
              if (resized) {
                canvas.width = width;
                canvas.height = height;
              }
              lastIndex = index;
              ctx.fillStyle = "#111820";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              const scale = Math.min(
                canvas.width / image.width,
                canvas.height / image.height,
              );
              const w = image.width * scale,
                h = image.height * scale;
              ctx.drawImage(
                image,
                (canvas.width - w) / 2,
                (canvas.height - h) / 2,
                w,
                h,
              );
              canvas.dataset.frame = String(index);
              canvas.dataset.cacheSize = String(cache.size);
              cache.markDisplayed(index);
              if (!shown) {
                shown = true;
                readyRef.current(true);
              }
            };
            const schedule = () => {
              if (!raf) raf = requestAnimationFrame(paint);
            };
            const cache = new FrameCache(
              variant.base,
              variant.count,
              mobile
                ? project.sequence.mobileCache
                : project.sequence.desktopCache,
              schedule,
            );
            const resize = () => {
              const rect = canvas.getBoundingClientRect();
              const dpr = Math.min(
                window.devicePixelRatio || 1,
                mobile ? 1.5 : 2,
              );
              // Avoid allocating pixels beyond the source's useful resolution.
              width = Math.min(variant.width, Math.round(rect.width * dpr));
              height = rect.width ? Math.round(rect.height * width / rect.width) : 0;
              schedule();
            };
            const observer = new ResizeObserver(resize);
            observer.observe(canvas);
            resize();
            cache.request(0);
            const media = section.querySelector<HTMLElement>(".hero-media")!;
            const trigger = ScrollTrigger.create({
              trigger: mobile ? media : section,
              start: mobile ? "top 82px" : "top top",
              end: () =>
                `+=${(window.innerHeight * (mobile ? project.sequence.mobileScrollVh : project.sequence.desktopScrollVh)) / 100}`,
              pin: mobile ? media : !short,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                cache.request(Math.round(self.progress * (variant.count - 1)));
                schedule();
                section.style.setProperty("--progress", String(self.progress));
                section.style.setProperty(
                  "--copy-opacity",
                  String(Math.max(0.15, 1 - self.progress * 3)),
                );
                const stage = Math.min(4, Math.floor(self.progress * 5));
                section.dataset.stage = String(stage);
              },
            });
            return () => {
              trigger.kill();
              observer.disconnect();
              cache.dispose();
              cancelAnimationFrame(raf);
              section.style.removeProperty("--copy-opacity");
              section.style.removeProperty("--progress");
              section.dataset.stage = "0";
              readyRef.current(false);
            };
          },
        );
        cleanup = () => mm.revert();
        void document.fonts.ready.then(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          requestAnimationFrame(alignInitialFragment);
        });
      },
    );
    return () => {
      cancelled = true;
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, markInteraction),
      );
      cleanup();
    };
  }, [container]);
  return (
    <canvas
      ref={canvasRef}
      className="sequence-canvas"
      aria-hidden="true"
      data-testid="sequence-canvas"
    />
  );
}
