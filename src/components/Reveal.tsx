"use client";
import { useEffect } from "react";
export function Reveal() {
  useEffect(() => {
    let dispose = () => {};
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            });
          });
        });
        dispose = () => mm.revert();
      },
    );
    return () => {
      cancelled = true;
      dispose();
    };
  }, []);
  return null;
}
