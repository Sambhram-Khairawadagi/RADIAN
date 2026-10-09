import { project, navigation } from "@/config/project";
import Image from "next/image";
import { assets } from "@/config/assets";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="footer-wordmark">RADIAN</p>
          <p>BY V VENTUREZ</p>
          <p>{project.location}</p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-contact">
          <a href={project.phoneHref}>{project.phone}</a>
          <a href={`mailto:${project.email}`}>{project.email}</a>
          <a href="#contact" className="text-link">
            Begin a conversation
          </a>
        </div>
      </div>
      <div className="footer-disclaimer">
        <p>
          All architectural and interior visuals are artist&apos;s impressions.
          Final designs, finishes, layouts, specifications, and availability may
          vary. Pricing is indicative and subject to confirmation, taxes,
          exclusions, and final terms. No return or yield is guaranteed.
        </p>
        <p>
          RERA:{" "}
          {project.reraNumber || "registration number pending confirmation"}.
          Registration is owner-reported. Confirm project details and applicable
          disclosures with the developer before making a decision.
        </p>
      </div>
      <div className="footer-partner">
        {assets.partnerLogo && (
          <div className="footer-partner-logo">
            <Image
              src={assets.partnerLogo.src}
              alt="Property Basket"
              width={assets.partnerLogo.width}
              height={assets.partnerLogo.height}
              sizes="180px"
            />
          </div>
        )}
        <p>
          {project.partnerRole}
          <span>by <strong>Property Basket</strong></span>
        </p>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} V Venturez. All rights reserved.
        </span>
        <a href="/privacy">Privacy & enquiries</a>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}
