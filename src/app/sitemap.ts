import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return [];
  return [
    { url: new URL("/", origin).href, changeFrequency: "monthly", priority: 1 },
    {
      url: new URL("/privacy", origin).href,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
