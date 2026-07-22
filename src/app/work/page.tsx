import Link from "next/link";

const projects = [
  {
    title: "Retail Inventory Sync Engine",
    category: "Software",
    desc: "Square × Shopify API",
  },
  {
    title: "Victorian Apothecary Scene",
    category: "3D / Environment",
    desc: "Blender → Unity, procedural",
  },
  {
    title: "ff360 Identity System",
    category: "Brand",
    desc: "Logo, mark, guidelines",
  },
  {
    title: "Original Score & Mix",
    category: "Music Tech",
    desc: "Full production",
  },
];

export default function Work() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
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
  );
}
