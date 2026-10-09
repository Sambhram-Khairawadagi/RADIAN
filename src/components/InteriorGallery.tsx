"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Media, Impression } from "./Media";
import type { AssetKey } from "@/config/assets";
const interiors: { key: AssetKey; title: string; text: string }[] = [
  {
    key: "lobby",
    title: "The art of arrival.",
    text: "A refined arrival experience shaped by material, light, and architectural clarity.",
  },
  {
    key: "office",
    title: "Space to think bigger.",
    text: "Adaptable environments imagined for modern collaboration and productivity.",
  },
  {
    key: "conference",
    title: "Room for possibility.",
    text: "A considered setting for leadership, discussion, and decision-making.",
  },
];
export function InteriorGallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const go = (index: number) => {
    const rail = gallery.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (rail && card) rail.scrollTo({ left: card.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return (
    <section id="interiors" className="section interiors">
      <div className="section-kicker">
        <span>05 / INTERIOR EXPERIENCE</span>
        <span>AN INSIDE PERSPECTIVE</span>
      </div>
      <div className="gallery-heading" data-reveal>
        <h2>
          Extraordinary,
          <br />
          <em>from within.</em>
        </h2>
        <p>
          A vision of the spaces where
          <br />
          your next chapter could begin.
        </p>
      </div>
      <div className="gallery-toolbar">
        <span>SPACES FOR WHAT’S NEXT</span>
        <div className="gallery-buttons">
          <span aria-live="polite">0{active + 1} / 03</span>
          <button type="button" aria-label="Previous interior" disabled={active === 0} onClick={() => go(active - 1)}><ArrowLeft size={18} /></button>
          <button type="button" aria-label="Next interior" disabled={active === 2} onClick={() => go(active + 1)}><ArrowRight size={18} /></button>
        </div>
      </div>
      <div className="interior-grid" ref={gallery} tabIndex={0} role="region" aria-label="Interior image gallery"
        onKeyDown={event => { if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(Math.max(0, Math.min(2, active + (event.key === 'ArrowRight' ? 1 : -1)))); } }}
        onScroll={() => { const rail = gallery.current; if(!rail) return; const cards = Array.from(rail.children) as HTMLElement[]; const closest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs(cards[best].offsetLeft - rail.scrollLeft) ? index : best, 0); setActive(closest); }}>
        {interiors.map((item, i) => (
          <figure
            key={item.key}
            className={`interior-card interior-${i}`}
          >
            <Media
              name={item.key}
              sizes={
                i === 0
                  ? "(max-width:760px) 100vw, 90vw"
                  : "(max-width:760px) 100vw, 75vw"
              }
            />
            <figcaption>
              <span className="image-index">0{i + 1}</span>
              <div>
                <p className="eyebrow">
                  {
                    ["ENTRANCE LOBBY", "OPEN-PLAN OFFICES", "CONFERENCE ROOM"][
                      i
                    ]
                  }
                </p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <Impression />
    </section>
  );
}
