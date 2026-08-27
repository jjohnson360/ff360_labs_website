import type { MetadataRoute } from "next";
import { SITE_URL, NAV_LINKS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...NAV_LINKS.map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: link.href === "/contact" ? 0.9 : 0.8,
    })),
  ];
}
