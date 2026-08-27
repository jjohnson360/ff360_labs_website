import type { Metadata } from "next";
import Link from "next/link";
import { SITE_LOCATION } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "ff360_labs is a creative technology studio based in Conway, Arkansas — working across web, interactive, 3D, and creative software.",
  alternates: { canonical: "/about" },
};

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * DRAFT COPY — the bio and timeline below are drawn from the founder's public
 * profile (github.com/jjohnson360) and written in the site voice. Still worth
 * a founder review pass before this is treated as final; the layout is done.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// The site speaks as "we" (a small studio) while being honest that it's one
// person's background pulled together — see the "Who's behind it" section.
const principles = [
  {
    tag: "01",
    title: "Scope before pixels",
    body: "Every project starts with a written brief so decisions are made once, on purpose — not renegotiated halfway through the build.",
  },
  {
    tag: "02",
    title: "Build it to last",
    body: "No page-builder lock-in and no mystery dependencies. The sites we hand over are ones you (or the next developer) can actually maintain.",
  },
  {
    tag: "03",
    title: "Interaction with intent",
    body: "Motion and 3D earn their place when they clarify or delight — never as decoration that slows the page down.",
  },
  {
    tag: "04",
    title: "Small studio, direct line",
    body: "You talk to the person doing the work. Fewer handoffs, faster answers, and a clearer picture of where a project stands.",
  },
];

const timeline = [
  {
    year: "Before",
    note: "Years of work across engineering, music production, and 3D art — the background everything here is built on.",
  },
  {
    year: "2025",
    note: "Started structured programming coursework and a self-directed path into software development.",
  },
  {
    year: "2026",
    note: "ff360_labs takes shape — this site, procedural 3D pipelines scripted in Blender, and a run of audio plugins and metering tools.",
  },
  {
    year: "Today",
    note: "Building where code, sound, and visual craft meet, and taking on select client work.",
  },
];

export default function About() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
        <div>
          <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">
            The Studio
          </div>
          <h1 className="font-display font-semibold text-4xl md:text-5xl max-w-2xl text-text">
            A{" "}
            <span className="metal-gold shimmer-text">creative technology</span>{" "}
            studio for ideas that don&apos;t fit a template.
          </h1>
        </div>
        <p className="text-text-dim max-w-[340px] text-sm">
          ff360_labs designs and builds websites, interactive experiences, 3D
          work, and creative software — for small businesses, artists, and
          founders who want something made rather than assembled.
        </p>
      </div>

      {/* ── Who ───────────────────────────────────────────────────────────── */}
      <section className="mb-28 grid gap-10 md:grid-cols-[220px_1fr]">
        <div className="font-mono text-xs tracking-widest uppercase text-text-faint pt-2">
          Who&apos;s behind it
        </div>
        <div className="space-y-5 text-text-dim leading-relaxed max-w-2xl">
          <p>
            <span className="text-text">Jackie &ldquo;Fred&rdquo; Johnson</span>{" "}
            started ff360_labs after years spent moving between engineering,
            music production, and 3D art — and deciding not to pick just one.
            The studio is where those threads come together and point at
            AI-assisted software development.
          </p>
          <p>
            It&apos;s deliberately small. The person scoping your project is the
            person designing and building it, so the work stays close to the
            original idea instead of drifting through a chain of handoffs.
          </p>
          <p>
            The through-line is projects that sit where code, sound, and visual
            craft meet — web and interactive builds, procedural 3D, and audio
            tooling.
          </p>
          <p>
            Based in {SITE_LOCATION}, working with clients anywhere.
          </p>
        </div>
      </section>

      {/* ── Principles ────────────────────────────────────────────────────── */}
      <section className="mb-28">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-10">
          How We Work
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p) => (
            <div
              key={p.tag}
              className="glass-panel glass-panel-hover p-8 rounded-sm"
            >
              <div className="font-mono text-[10px] tracking-widest text-gold mb-4">
                {p.tag}
              </div>
              <h3 className="font-display font-medium text-xl mb-3">{p.title}</h3>
              <p className="text-text-dim text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Background / timeline ─────────────────────────────────────────── */}
      <section className="mb-28">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-10">
          Background
        </div>
        <ul className="space-y-6 max-w-2xl">
          {timeline.map((t, i) => (
            <li key={i} className="flex gap-6">
              <span className="font-mono text-xs text-gold shrink-0 w-16 pt-1">
                {t.year}
              </span>
              <span className="text-text-dim text-sm leading-relaxed">
                {t.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-line pt-16 flex flex-col sm:flex-row gap-4">
        <Link
          href="/contact"
          className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110 hover:-translate-y-px text-center"
        >
          Start a Project
        </Link>
        <Link
          href="/work"
          className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 border border-line-silver text-silver-light hover:border-silver hover:bg-white/5 text-center"
        >
          See the Work
        </Link>
      </section>
    </div>
  );
}
