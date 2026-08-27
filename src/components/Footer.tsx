"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { LEGAL_LINKS, NAV_LINKS, SITE_EMAIL, SITE_LOCATION, SITE_NAME } from "@/lib/site";

const PhysicsFooter = dynamic(() => import("@/components/PhysicsFooter"), {
  ssr: false,
});

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-line bg-bg relative z-10">
      <div className="max-w-[1180px] mx-auto px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Link
            href="/"
            className="font-display italic font-medium text-lg tracking-wide"
          >
            ff
            <span className="font-sans not-italic font-semibold tracking-wide">
              360
            </span>
            _labs
          </Link>
          <p className="mt-3 text-text-dim text-sm max-w-xs">
            Always building something new.
          </p>
        </div>

        <nav aria-label="Footer">
          <div className="font-mono text-[10px] tracking-widest uppercase text-text-faint mb-4">
            Site
          </div>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs tracking-widest uppercase text-text-dim hover:text-gold-light transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-text-faint mb-4">
            Contact
          </div>
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="font-mono text-xs text-gold hover:text-gold-light transition-colors"
          >
            {SITE_EMAIL}
          </a>
          <p className="mt-3 font-mono text-xs text-text-dim">
            {SITE_LOCATION} — working globally.
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-8 pb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="font-mono text-[10px] tracking-widest uppercase text-text-faint">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-[10px] tracking-widest uppercase text-text-faint hover:text-text-dim transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Decorative physics strip — content above is the accessible source of truth. */}
      <div aria-hidden="true">
        <PhysicsFooter />
      </div>
    </footer>
  );
}
