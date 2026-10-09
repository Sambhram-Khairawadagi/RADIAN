import type { Metadata } from "next";
import Link from "next/link";
import { project } from "@/config/project";
export const metadata: Metadata = {
  title: "Privacy & Enquiries | RADIAN",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <main className="privacy-page">
      <Link className="text-link" href="/">
        Return to RADIAN
      </Link>
      <p className="eyebrow">RADIAN BY V VENTUREZ</p>
      <h1>Privacy & enquiries</h1>
      <p>
        This form requests your name, phone number, email, optional floor
        preference, message, and consent so the V Venturez project team can
        respond to your enquiry.
      </p>
      <h2>How the form works</h2>
      <p>
        When online enquiries are connected, submitted details are sent through
        the configured email delivery service to the project team. The website
        does not store enquiries in a lead database. When delivery is not
        configured, the form reports that the enquiry has not been sent.
      </p>
      <h2>Security and external services</h2>
      <p>
        Spam prevention uses a hidden form field, submission timing, and request
        limits. When shared rate limiting is configured, a salted hash derived
        from your network address is temporarily stored for up to 15 minutes.
        Your raw address is not stored by this application for rate limiting.
        Hosting and email providers may maintain their own operational logs.
      </p>
      <p>
        No embedded map, advertising tracker, or analytics service is added by
        this website. Google Maps opens only when you follow a map link.
        Telephone and email links open your chosen applications.
      </p>
      <h2>Your enquiry</h2>
      <p>
        To ask about your enquiry, request correction or deletion of your
        submitted details, or withdraw permission for further contact, email{" "}
        <a className="text-link" href={`mailto:${project.email}`}>
          {project.email}
        </a>
        . The project owner must confirm its contact-data retention period and
        publish any further applicable privacy disclosures before launch.
      </p>
      <p className="small-note">
        This notice describes the implemented website. Owner approval of the
        operational privacy policy and retention period is pending.
      </p>
    </main>
  );
}
