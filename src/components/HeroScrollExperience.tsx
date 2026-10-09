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
      <div className="hero-title-row">
        <h1 id="hero-title" className="metal-wordmark" aria-label="RADIAN">
          <span className="wordmark-depth" aria-hidden="true">RADIAN</span>
          <span className="wordmark-face" aria-hidden="true">RADIAN</span>
        </h1>
        <p className="hero-signature">BY V VENTUREZ<span>A new perspective<br />on commercial space.</span></p>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="rera-badge">RERA REGISTERED</div>
          <h2 className="hero-investment-title">Invest <span>₹3 crore.</span></h2>
          <p className="hero-description">
            Rental potential up to <strong>₹2.4 lakh<span>/month</span></strong>
          </p>
          <p className="hero-investment-note">Indicative, owner-provided projection. Subject to leasing and final terms; returns are not guaranteed.</p>
          <div className="hero-actions">
            <a className="button button-light" href="#contact">Explore your investment <ArrowDown size={16} /></a>
            <a className="text-link" href="#explore">Explore the building ↗</a>
          </div>
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
            <span>THE ARCHITECTURE / IN MOTION</span><span>Scroll to unfold ↓</span>
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
