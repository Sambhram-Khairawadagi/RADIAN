import type { MetadataRoute } from "next";
import { project } from "@/config/project";
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: {
      userAgent: "*",
      ...(project.launchApproved
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    ...(origin ? { sitemap: new URL("/sitemap.xml", origin).href } : {}),
  };
}
