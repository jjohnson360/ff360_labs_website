"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const HeroPatchbay = dynamic(() => import("@/components/HeroPatchbay"), {
  ssr: false,
});

/*
 * Real projects, kept intentionally light for now — titles and categories
 * only, no case studies or images yet. Mirrors the "Currently Working On"
 * list on github.com/jjohnson360; websites and the game lead, audio plugins
 * sit at the bottom. Expect this set to keep shifting while work is in flux.
 */
const projects = [
  {
    title: "Dr. Pod's Apothecary Game",
    category: "Game / Unity",
    desc: "3D puzzle game · real-world storefront tie-in",
  },
  {
    title: "FF360 Nexus",
    category: "3D / Interactive",
    desc: "Explorable 3D “digital HQ” · Unity 6 + Blender",
  },
  {
    title: "The Governor of Crunk",
    category: "Web / Music",
    desc: "Artist site · 2026 album debut",
  },
  {
    title: "ff360 Music",
    category: "Web / Music",
    desc: "Next.js portfolio · embedded audio playback",
  },
  {
    title: "ff360_labs Studio Site",
    category: "Web / Interactive",
    desc: "Next.js · 2D-canvas + physics UI",
  },
  {
    title: "Personal Finance Tracker",
    category: "Full-Stack / AI",
    desc: "FastAPI · PostgreSQL · React",
  },
  {
    title: "ChordFlow",
    category: "Audio / MIDI",
    desc: "JUCE VST3/AU MIDI generator",
  },
  {
    title: "Ecosystem Distortion",
    category: "Audio / DSP",
    desc: "Multi-instance JUCE · spectral partitioning",
  },
];

export default function WorkContent() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient patch-bay background — a nod to the modular-audio work below. */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroPatchbay />
      </div>

      <div className="max-w-[1180px] mx-auto px-8 py-24 relative z-10">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">Selected Work</div>
          <h1 className="font-display font-semibold text-4xl md:text-5xl max-w-2xl text-text">
            <span className="metal-silver shimmer-text">A few things worth showing.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {projects.map((project, i) => (
            <div key={i} className="glass-panel p-8 rounded-sm group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
              {/* Corner accents */}
              <div className="corner tl"></div><div className="corner tr"></div>
              <div className="corner bl"></div><div className="corner br"></div>

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-gold uppercase mb-4">{project.category}</div>
                  <h3 className="font-display text-2xl mb-4 group-hover:text-gold-light transition-colors">{project.title}</h3>
                </div>
                <div className="mt-8 flex justify-between items-center text-text-dim group-hover:text-gold transition-colors">
                  <span className="text-sm">{project.desc}</span>
                  <svg className="w-5 h-5 stroke-current fill-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link href="/contact" className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 border border-gold text-gold hover:bg-gold/10">
            Discuss A Project
          </Link>
        </div>
      </div>
    </div>
  );
}
