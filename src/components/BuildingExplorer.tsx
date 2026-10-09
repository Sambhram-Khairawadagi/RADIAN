"use client";
import { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { floors, type FloorId } from "@/config/project";
import { assets } from "@/config/assets";
import { Media, Impression } from "./Media";
export function BuildingExplorer() {
  const [selected, setSelected] = useState<FloorId>("1");
  const [hasSelected, setHasSelected] = useState(false);
  const reduced = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const floor = floors.find((f) => f.id === selected)!;
  const select = (index: number) => {
    const next = (index + floors.length) % floors.length;
    setHasSelected(true);
    setSelected(floors[next].id);
    buttons.current[next]?.focus();
  };
  function enquire() {
    window.dispatchEvent(new CustomEvent("radian:floor", { detail: selected }));
  }
  return (
    <section id="explore" className="section explorer">
      <div className="section-kicker">
        <span>03 / EXPLORE RADIAN</span>
        <span>AN ADDRESS. MANY POSSIBILITIES.</span>
      </div>
      <div className="explorer-heading" data-reveal>
        <h2>
          A new level
          <br />
          of <em>perspective.</em>
        </h2>
        <p>
          Explore the building&apos;s levels.
          <br />
          Start a conversation about your next workspace.
        </p>
      </div>
      <div className="explorer-grid">
        <figure className="explorer-visual">
          <Media
            name="unfolded"
            className="contain"
            sizes="(max-width:760px) 100vw, 60vw"
          />
          <figcaption>
            <Impression />
            <span>Illustrative view; level selection is schematic.</span>
          </figcaption>
        </figure>
        <div className="explorer-controls">
          <p className="eyebrow">SELECT A LEVEL</p>
          <div
            className="floor-tabs"
            role="tablist"
            aria-label="Building levels"
          >
            {floors.map((f, i) => (
              <button
                key={f.id}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={`floor-tab-${f.id}`}
                role="tab"
                aria-selected={selected === f.id}
                aria-controls="floor-panel"
                tabIndex={selected === f.id ? 0 : -1}
                onClick={() => {
                  setHasSelected(true);
                  setSelected(f.id);
                }}
                onKeyDown={(e) => {
                  if (
                    [
                      "ArrowRight",
                      "ArrowDown",
                      "ArrowLeft",
                      "ArrowUp",
                      "Home",
                      "End",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                    select(
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? floors.length - 1
                          : i +
                            (["ArrowRight", "ArrowDown"].includes(e.key)
                              ? 1
                              : -1),
                    );
                  }
                }}
              >
                {f.id}
              </button>
            ))}
          </div>
          <div
            className="floor-detail"
            id="floor-panel"
            role="tabpanel"
            aria-labelledby={`floor-tab-${selected}`}
            tabIndex={0}
          >
            <div className="floor-label">
              <svg
                viewBox="0 0 65 85"
                width="65"
                height="85"
                aria-label={`Schematic highlighting ${floor.name}`}
                role="img"
              >
                {floors.map((f, i) => (
                  <rect
                    key={f.id}
                    x="5"
                    y={72 - i * 10}
                    width="52"
                    height="7"
                    fill={f.id === selected ? "var(--gold)" : "none"}
                    stroke={f.id === selected ? "var(--gold)" : "#7e8993"}
                  />
                ))}
              </svg>
              <motion.h3
                key={floor.id}
                initial={!hasSelected || reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {floor.name}
              </motion.h3>
            </div>
            <p>
              Discuss layouts, specifications, and current options for the{" "}
              {floor.name.toLowerCase()} with the project team.
            </p>
            <dl className="floor-facts">
              <div>
                <dt>Floor plan</dt>
                <dd>
                  {floor.planKey && assets[floor.planKey]
                    ? "Reference available"
                    : "Available on request"}
                </dd>
              </div>
              <div>
                <dt>Size & availability</dt>
                <dd>Confirm with the team</dd>
              </div>
            </dl>
            {floor.planKey && assets[floor.planKey] && (
              <a
                className="text-link"
                href={assets[floor.planKey]!.src}
                target="_blank"
                rel="noreferrer"
              >
                View floor-plan reference
              </a>
            )}
            <a
              className="button button-light"
              href="#contact"
              onClick={enquire}
            >
              Enquire about this floor
            </a>
            <p className="small-note">
              Level selectors are based on the B + G + 5 project brief. Rendered
              levels are illustrative, not surveyed floor mapping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
