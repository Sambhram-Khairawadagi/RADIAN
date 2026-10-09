import { project } from "@/config/project";
export function Specifications() {
  const details = [
    ["Project", "RADIAN"],
    ["Developer", project.developer],
    ["Category", project.category],
    ["Location", project.location],
    ["Configuration", project.configuration],
    ["Land area", project.landArea],
    ["Built-up area", project.builtUpArea],
    ["Total units", String(project.totalUnits)],
    ["Parking capacity", `${project.parking} · owner-reported`],
    ["Project status", project.status],
    [
      "RERA registration",
      project.reraNumber || "Registration number pending confirmation",
    ],
    ["Elevators", "Total elevator count pending confirmation"],
  ];
  return (
    <section id="specifications" className="section specifications">
      <div className="spec-heading" data-reveal>
        <p className="eyebrow">04 / THE DETAILS</p>
        <h2>
          Considered.
          <br />
          In every <em>detail.</em>
        </h2>
        <div className="price">
          <span>INDICATIVE PRICE</span>
          <p>
            {project.indicativePrice}
            <small> / sq ft</small>
          </p>
          <p className="small-note">
            Owner-provided pricing. Final price, taxes, exclusions,
            availability, and terms require confirmation.
          </p>
        </div>
      </div>
      <div>
        <dl className="spec-list">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="small-note spec-note">
          The owner reports “2 elevators per floor”; this is not a verified
          total elevator count. Configuration, land area, and parking are
          owner-provided. RERA registration is owner-reported; the official
          number is awaited.
        </p>
      </div>
    </section>
  );
}
