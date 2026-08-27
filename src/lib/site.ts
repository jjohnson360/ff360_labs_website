// Central site config — shared by layout metadata, the sitemap/robots
// route handlers, the OG image, and the header/footer navigation so there's
// a single source of truth for the URL structure and copy.

/**
 * Absolute origin of the production site. Set `NEXT_PUBLIC_SITE_URL` once a
 * custom domain is registered; until then this resolves to the Vercel
 * production URL at build time, and to localhost in local dev.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "ff360_labs";

export const SITE_TAGLINE = "Creative Technology Studio";

export const SITE_DESCRIPTION =
  "ff360_labs designs and builds websites, interactive experiences, 3D work, and creative software — for small businesses, artists, and anyone with an idea that doesn't fit a template.";

export const SITE_LOCATION = "Conway, Arkansas";

export const SITE_EMAIL = "hello@ff360labs.com";

export interface NavLink {
  name: string;
  href: string;
  /** One-line description used on the home page index and for a11y. */
  desc: string;
}

export const NAV_LINKS: NavLink[] = [
  { name: "Services", href: "/services", desc: "What gets built" },
  { name: "Process", href: "/process", desc: "How it runs" },
  { name: "Pricing", href: "/pricing", desc: "Starting points" },
  { name: "Work", href: "/work", desc: "Selected projects" },
  { name: "Contact", href: "/contact", desc: "Get in touch" },
];
