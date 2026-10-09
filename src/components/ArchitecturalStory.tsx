import { Media, Impression } from "./Media";
export function ArchitecturalStory() {
  return (
    <section
      className="section architecture"
      aria-labelledby="architecture-title"
    >
      <div className="architecture-text" data-reveal>
        <p className="eyebrow">02 / ARCHITECTURAL VISION</p>
        <h2 id="architecture-title">
          Designed to
          <br />
          open <em>possibilities.</em>
        </h2>
        <p>
          Light, proportion, and a contemporary facade shape the architectural
          vision for RADIAN. The supplied visualizations offer a perspective on
          the building and the spaces within.
        </p>
        <div className="detail-rule">
          <span>01</span>
          <p>Contemporary architecture</p>
        </div>
        <div className="detail-rule">
          <span>02</span>
          <p>Adaptable working environments</p>
        </div>
        <div className="detail-rule">
          <span>03</span>
          <p>Business-focused infrastructure</p>
        </div>
      </div>
      <figure data-reveal>
        <Media name="angle" />
        <figcaption>
          <Impression />
        </figcaption>
      </figure>
    </section>
  );
}
