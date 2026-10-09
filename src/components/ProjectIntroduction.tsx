import { Media, Impression } from "./Media";
import { project } from "@/config/project";
export function ProjectIntroduction() {
  return (
    <section id="overview" className="section introduction">
      <div className="section-kicker">
        <span>01 / THE VISION</span>
        <span>A DIFFERENT PERSPECTIVE</span>
      </div>
      <div className="intro-heading" data-reveal>
        <h2>
          Where Vision
          <br />
          Meets <em>Architecture.</em>
        </h2>
        <div>
          <p className="body-lead">
            A considered address.
            <br />A world of possibilities.
          </p>
          <p>
            RADIAN is a contemporary commercial development in Bommasandra,
            Bengaluru, designed around adaptable workspaces, modern
            architecture, and business-focused infrastructure.
          </p>
          <a className="text-link" href="#specifications">
            Discover the details
          </a>
        </div>
      </div>
      <figure className="intro-figure" data-reveal>
        <Media name="front" sizes="(max-width:760px) 100vw, 90vw" />
        <figcaption>
          <span>RADIAN / THE ARCHITECTURE</span>
          <Impression />
        </figcaption>
      </figure>
      <dl className="data-strip">
        {[
          [project.configuration, "BUILDING CONFIGURATION"],
          ["1", "ACRE · LAND AREA"],
          [project.builtUpArea.replace(/ sq ft$/, ""), "SQ FT · BUILT-UP AREA"],
          [String(project.totalUnits), "TOTAL UNITS"],
        ].map(([v, l]) => (
          <div key={l}>
            <dt>{l}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
