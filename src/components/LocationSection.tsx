import { MapPin, TrainFront, Route, Building2 } from "lucide-react";
import { project } from "@/config/project";
export function LocationSection() {
  return (
    <section id="location" className="section location">
      <div className="location-copy" data-reveal>
        <p className="eyebrow">07 / CONNECTED TO POSSIBILITY</p>
        <h2>
          The right place.
          <br />
          The next <em>chapter.</em>
        </h2>
        <p>
          Located in Bommasandra, Bengaluru, near Bommasandra Metro Station,
          RADIAN sits within an established commercial and industrial area.
        </p>
        <ul className="connectivity">
          <li>
            <TrainFront />
            <span>Bommasandra Metro Station</span>
          </li>
          <li>
            <Route />
            <span>Road and public transport connections</span>
          </li>
          <li>
            <Building2 />
            <span>A commercial and industrial setting</span>
          </li>
        </ul>
      </div>
      <div className="location-panel" data-reveal>
        <MapPin size={38} strokeWidth={1} />
        <p className="eyebrow">BENGALURU · KARNATAKA</p>
        <h3>Bommasandra</h3>
        <p>Discover the surrounding area.</p>
        <a
          href={project.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-dark"
        >
          Explore on Google Maps
        </a>
        <a
          href={project.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Directions to the metro area
        </a>
        <p className="small-note">
          Area-level reference near the metro station. The exact project pin is
          pending confirmation. Maps opens only when you choose.
        </p>
      </div>
    </section>
  );
}
