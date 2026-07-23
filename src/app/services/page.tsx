"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const TechStackPhysics = dynamic(() => import("@/components/TechStackPhysics"), {
  ssr: false,
});

const services = [
  {
    tag: "01 / WEB",
    title: "Website Design & Development",
    desc: "Small business, portfolio, and product sites — designed and built end to end.",
    icon: (
      <svg className="w-10 h-10 stroke-gold fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 8h18M7 18v3M17 18v3"/></svg>
    )
  },
  {
    tag: "02 / INTERACTIVE",
    title: "Interactive Web Experiences",
    desc: "Custom interfaces and animation-driven pages that go past the standard template.",
    icon: (
      <svg className="w-10 h-10 stroke-silver fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    )
  },
  {
    tag: "03 / 3D",
    title: "3D Modeling & Visualization",
    desc: "Procedural, game-ready 3D assets and environments — built in Blender, staged for Unity.",
    icon: (
      <svg className="w-10 h-10 stroke-gold fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>
    )
  },
  {
    tag: "04 / CODE",
    title: "Creative Coding & Automation",
    desc: "Custom tools and integrations — API syncs, generative scripts, AI-assisted pipelines.",
    icon: (
      <svg className="w-10 h-10 stroke-silver fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M8 5L2 12l6 7M16 5l6 7-6 7"/></svg>
    )
  },
  {
    tag: "05 / BRAND",
    title: "Branding & Digital Identity",
    desc: "Logo systems, color and type direction, and the guidelines that keep a brand consistent.",
    icon: (
      <svg className="w-10 h-10 stroke-gold fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18M3 12h18"/></svg>
    )
  },
  {
    tag: "06 / MUSIC TECH",
    title: "Music Technology Projects",
    desc: "Production, mixing, and the tools that support an artist's release workflow.",
    icon: (
      <svg className="w-10 h-10 stroke-silver fill-none" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    )
  }
];

export default function Services() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
        <div>
          <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">What Gets Built</div>
          <h1 className="font-display font-semibold text-4xl md:text-5xl max-w-2xl text-text">
            Six disciplines, one studio.
          </h1>
        </div>
        <p className="text-text-dim max-w-[340px] text-sm">
          Every project draws on some combination of these — scoped up front
          so nothing gets lost between phases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel glass-panel-hover p-8 rounded-sm group flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="transition-transform duration-300 group-hover:scale-110">
                {s.icon}
              </div>
              <div className="font-mono text-[10px] tracking-widest text-text-faint">{s.tag}</div>
            </div>
            <div>
              <h3 className="font-display font-medium text-xl mb-3">{s.title}</h3>
              <p className="text-text-dim text-sm leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 mb-10 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-3">Behind the Scenes</div>
          <h2 className="font-display font-semibold text-3xl md:text-4xl text-text">
            Our Tech Stack
          </h2>
          <p className="text-text-dim text-sm mt-3 max-w-md mx-auto">
            Grab, toss, and stack the tools we use to build fast, interactive, and scalable digital products.
          </p>
        </div>
        
        {/* Physics Bucket */}
        <div className="relative w-full h-[50vh] min-h-[450px] border border-gold/20 rounded-sm overflow-hidden bg-[#0d0c0f]/80 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto">
           <TechStackPhysics />
        </div>
      </div>
    </div>
  );
}
