"use client";
import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { assets, sequence } from "@/config/assets";
const FrameSequenceCanvas = dynamic(
  () => import("./FrameSequenceCanvas").then((m) => m.FrameSequenceCanvas),
  { ssr: false },
);
export function HeroScrollExperience() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const markReady = useCallback((value: boolean) => setReady(value), []);
  const poster = sequence.poster || assets.aerial?.src || assets.front?.src;
  return (
    <section
      ref={ref}
      className={`hero ${ready ? "sequence-ready" : ""}`}
      aria-labelledby="hero-title"
      data-stage="0"
    >
      <div className="hero-topline">
        <span>COMMERCIAL / IT PARK</span>
        <span>BOMMASANDRA, BENGALURU</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">RADIAN BY V VENTUREZ</p>
          <h1 id="hero-title">
            A Landmark
            <br />
            for the
            <br />
            <em>Extraordinary.</em>
          </h1>
          <p className="hero-description">
            A new perspective on commercial spaces in Bommasandra, Bengaluru.
          </p>
          <a className="button button-light" href="#explore">
            Explore the building <ArrowDown size={16} />
          </a>
        </div>
        <div
          className="hero-media"
          role="img"
          aria-label="Scroll-controlled architectural film showing the supplied Radian building visualization"
        >
          {poster && (
            <Image
              src={poster}
              alt="Artist's impression of Radian from the supplied architectural animation"
              fill
              priority
              sizes="(max-width:760px) 100vw, 65vw"
              className="hero-poster"
            />
          )}
          {sequence.available && (
            <FrameSequenceCanvas container={ref} onReady={markReady} />
          )}
          <span className="hero-image-caption">
            AN ARCHITECTURAL PERSPECTIVE
          </span>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#overview" className="scroll-hint">
          <span className="scroll-line" />
          Scroll to explore
        </a>
        <div className="hero-stages" aria-hidden="true">
          {[
            "A new perspective",
            "Closer to the architecture",
            "Every angle, considered",
            "An unfolding vision",
            "The complete picture",
          ].map((s, i) => (
            <span key={s} data-step={i}>
              0{i + 1} / {s}
            </span>
          ))}
        </div>
        <span className="hero-note">Artist&apos;s impression</span>
      </div>
      <div className="hero-progress" aria-hidden="true" />
    </section>
  );
}
