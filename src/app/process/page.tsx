"use client";

import { motion } from "framer-motion";

const phases = [
  {
    num: "01",
    title: "Discover",
    items: ["Your business", "Your audience", "Your goals", "Your vision"],
    deliverable: "Project Brief",
  },
  {
    num: "02",
    title: "Design",
    items: ["Site structure", "Visual direction", "User experience", "Branding elements"],
    deliverable: "Design Prototype",
  },
  {
    num: "03",
    title: "Build",
    items: ["Responsive website", "Interactive features", "Optimization", "Testing"],
    deliverable: "Working Website",
  },
  {
    num: "04",
    title: "Launch",
    items: ["Deployment", "Domain setup", "SEO basics", "Training"],
    deliverable: "Live Product",
  },
];

export default function Process() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
      <div className="mb-20">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">How A Project Runs</div>
        <h1 className="font-display font-semibold text-4xl md:text-5xl max-w-2xl text-text">
          <span className="metal-silver shimmer-text">Four phases,</span> from idea to live product.
        </h1>
      </div>

      <div className="relative mt-24">
        {/* Animated horizontal line behind the timeline (Desktop) */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-0 top-[15px] h-px bg-gradient-to-r from-gold-dark via-gold to-transparent hidden lg:block z-0"
        />

        {/* Animated vertical line (Mobile) */}
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-[15px] top-0 w-px bg-gradient-to-b from-gold-dark via-gold to-transparent lg:hidden z-0"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col relative"
            >
              {/* Desktop Node */}
              <div className="hidden lg:flex justify-center mb-8 relative z-10">
                <div className="w-[30px] h-[30px] rounded-full bg-bg border-2 border-gold shadow-[0_0_15px_rgba(201,161,90,0.4)] flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-gold-light"></div>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="flex lg:block">
                 {/* Mobile Node */}
                 <div className="lg:hidden shrink-0 w-[30px] h-[30px] rounded-full bg-bg border-2 border-gold shadow-[0_0_15px_rgba(201,161,90,0.4)] flex items-center justify-center mt-6 mr-6 relative z-10">
                   <div className="w-2 h-2 rounded-full bg-gold-light"></div>
                 </div>

                 <div className="glass-panel p-6 rounded-sm h-full flex flex-col flex-grow">
                   <div className="font-mono text-xs tracking-widest text-gold mb-4">{phase.num}</div>
                   <h3 className="font-display italic font-medium text-2xl mb-6">{phase.title}</h3>
                   <ul className="space-y-3 mb-8 flex-grow">
                     {phase.items.map((item, j) => (
                       <li key={j} className="text-text-dim text-sm pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-text-faint">
                         {item}
                       </li>
                     ))}
                   </ul>
                   <div className="font-mono text-[10px] tracking-widest uppercase text-text-faint pt-6 border-t border-line-silver mt-auto">
                     Deliverable <span className="block mt-2 font-semibold metal-gold shimmer-text text-xs">{phase.deliverable}</span>
                   </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
