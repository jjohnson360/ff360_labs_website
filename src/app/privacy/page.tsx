import type { Metadata } from "next";
import Link from "next/link";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE_NAME} collects, uses, and protects the limited personal information handled through this website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/*
 * Plain-language privacy statement for a brochure site whose only data
 * collection is the contact form. TODO(content): have this reviewed against
 * your actual obligations, set the "Last updated" date, and add a legal
 * entity name if the studio is incorporated.
 */

const sections = [
  {
    heading: "What we collect",
    body: [
      "When you submit the contact form we receive the name, email address, and project details you enter. That's the only information you actively give us through this site.",
      "Like most websites, our host (Vercel) automatically records basic technical request data such as IP address, browser type, and the pages requested. We use this only for security and to keep the site running.",
    ],
  },
  {
    heading: "How your information is used",
    body: [
      "Contact form submissions are used solely to respond to your enquiry and, if we work together, to carry out the project. We do not sell or rent your information, and we do not use it for advertising.",
    ],
  },
  {
    heading: "Who processes it",
    body: [
      "The contact form is handled by Formspree, which forwards submissions to us by email and retains a copy in our account. Their handling of the data is covered by the Formspree privacy policy.",
      "The site is hosted on Vercel, which processes the technical request data described above on our behalf.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "This site does not set advertising or tracking cookies, and it does not run third-party analytics. Fonts are served from our own domain rather than loaded from an external provider.",
    ],
  },
  {
    heading: "Retention",
    body: [
      "We keep contact enquiries for as long as needed to follow up and, where a project results, for the life of that engagement plus a reasonable period for our records. You can ask us to delete your enquiry at any time.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can request a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Email us and we'll take care of it.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If this policy changes, the updated version will be posted on this page with a new date.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="max-w-[760px] mx-auto px-8 py-24">
      <div className="mb-14">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">
          Privacy
        </div>
        <h1 className="font-display font-semibold text-4xl md:text-5xl text-text">
          <span className="metal-silver shimmer-text">How we handle your data.</span>
        </h1>
        <p className="mt-6 font-mono text-[11px] tracking-widest uppercase text-text-faint">
          {/* TODO(content): set the real date when this is reviewed */}
          Last updated — TODO(content)
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display font-medium text-xl mb-4 text-text">
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.body.map((p, i) => (
                <p key={i} className="text-text-dim text-sm leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="font-display font-medium text-xl mb-4 text-text">
            Contact
          </h2>
          <p className="text-text-dim text-sm leading-relaxed">
            Questions about this policy or your data? Email{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {SITE_EMAIL}
            </a>
            , or use the{" "}
            <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">
              contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
