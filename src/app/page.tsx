import { Header } from "@/components/Header";
import { HeroScrollExperience } from "@/components/HeroScrollExperience";
import { ProjectIntroduction } from "@/components/ProjectIntroduction";
import { ArchitecturalStory } from "@/components/ArchitecturalStory";
import { BuildingExplorer } from "@/components/BuildingExplorer";
import { Specifications } from "@/components/Specifications";
import { InteriorGallery } from "@/components/InteriorGallery";
import { Amenities } from "@/components/Amenities";
import { LocationSection } from "@/components/LocationSection";
import { DeveloperSection } from "@/components/DeveloperSection";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { project } from "@/config/project";
export default function Home() {
  const configured = !!(
    process.env.RESEND_API_KEY &&
    process.env.LEAD_FROM_EMAIL &&
    process.env.LEAD_TO_EMAIL &&
    (process.env.NODE_ENV !== "production" ||
      (process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.RATE_LIMIT_SALT))
  );
  const structured = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "RADIAN by V Venturez",
    description: "Commercial / IT Park in Bommasandra, Bengaluru",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bommasandra, Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    sameAs: project.officialUrl,
  };
  return (
    <>
      <Header />
      <main id="main-content">
        <div id="top" aria-hidden="true" />
        <HeroScrollExperience />
        <ProjectIntroduction />
        <ArchitecturalStory />
        <BuildingExplorer />
        <Specifications />
        <InteriorGallery />
        <Amenities />
        <LocationSection />
        <DeveloperSection />
        <EnquiryForm configured={configured} />
      </main>
      <Footer />
      <Reveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
