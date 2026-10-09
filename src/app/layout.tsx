import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { project } from "@/config/project";
import { assets } from "@/config/assets";
import "./globals.css";
import "./modern.css";
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: "RADIAN by V Venturez | Commercial Spaces in Bommasandra",
  description:
    "Discover RADIAN, a commercial / IT park by V Venturez in Bommasandra, Bengaluru. Explore the architecture, interiors, building levels, and project details.",
  robots: { index: project.launchApproved, follow: project.launchApproved },
  openGraph: {
    title: "RADIAN by V Venturez",
    description:
      "A new perspective on commercial spaces in Bommasandra, Bengaluru.",
    type: "website",
    locale: "en_IN",
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(siteUrl && assets.front
      ? {
          images: [
            {
              url: assets.front.src,
              width: assets.front.width,
              height: assets.front.height,
              alt: assets.front.alt,
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "RADIAN by V Venturez",
    ...(siteUrl && assets.front ? { images: [assets.front.src] } : {}),
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
