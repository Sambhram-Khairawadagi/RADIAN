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
      <div className="interior-grid">
        {interiors.map((item, i) => (
          <figure
            key={item.key}
            className={`interior-card interior-${i}`}
            data-reveal
          >
            <Media
              name={item.key}
              sizes={
                i === 0
                  ? "(max-width:760px) 100vw, 90vw"
                  : "(max-width:760px) 100vw, 45vw"
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
