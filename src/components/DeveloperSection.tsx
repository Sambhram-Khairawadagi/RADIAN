import Image from "next/image";
import { assets } from "@/config/assets";
import { project } from "@/config/project";
export function DeveloperSection() {
  return (
    <section className="section developer" aria-labelledby="developer-title">
      <div className="developer-brand">
        {assets.developerLogo && (
          <Image
            src={assets.developerLogo.src}
            alt={assets.developerLogo.alt}
            width={320}
            height={160}
            sizes="(max-width:760px) 240px, 320px"
          />
        )}
        <span>THE DEVELOPER</span>
      </div>
      <div data-reveal>
        <p className="eyebrow">08 / BY V VENTUREZ</p>
        <h2 id="developer-title">
          A vision,
          <br />
          <em>taking shape.</em>
        </h2>
        <p>
          V Venturez develops residential and commercial properties in
          Bengaluru. RADIAN is the developer&apos;s commercial / IT park project
          in Bommasandra.
        </p>
        <a
          className="text-link"
          href={project.developerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Discover V Venturez
        </a>
      </div>
    </section>
  );
}
