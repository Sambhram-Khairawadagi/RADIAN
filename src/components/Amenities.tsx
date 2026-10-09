import {
  ShieldCheck,
  Flame,
  ScanLine,
  Leaf,
  Zap,
  PanelsTopLeft,
  CarFront,
} from "lucide-react";
import { amenities } from "@/config/project";
const icons = {
  ShieldCheck,
  Flame,
  ScanLine,
  Leaf,
  Zap,
  PanelsTopLeft,
  CarFront,
};
export function Amenities() {
  return (
    <section id="amenities" className="section amenities">
      <div className="amenities-heading" data-reveal>
        <p className="eyebrow">06 / AMENITIES</p>
        <h2>
          For business.
          <br />
          For <em>what&apos;s next.</em>
        </h2>
        <p>
          Business-focused infrastructure,
          <br />
          considered from the ground up.
        </p>
      </div>
      <div className="amenity-grid">
        {amenities.map(([icon, title, text], i) => {
          const Icon = icons[icon];
          return (
            <article key={title} data-reveal>
              <div className="amenity-top">
                <Icon size={29} strokeWidth={1.2} />
                <span>0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
