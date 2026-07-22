import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="font-mono text-xs tracking-[0.28em] uppercase text-gold mb-7 flex items-center gap-3 before:content-[''] before:w-7 before:h-px before:bg-gold-dark after:content-[''] after:w-7 after:h-px after:bg-gold-dark">
          Creative Technology Studio
        </div>

        <h1 className="font-display font-semibold text-5xl md:text-7xl leading-[0.98] tracking-tight max-w-4xl text-center">
          Always building<br />
          <em className="metal-gold shimmer-text italic font-medium">something</em><br />
          <span className="metal-silver shimmer-text">new.</span>
        </h1>

        <p className="mt-7 max-w-[560px] text-text-dim text-lg">
          ff360_labs designs and builds websites, interactive experiences, 3D work,
          and creative software — for small businesses, artists, and anyone with an
          idea that doesn't fit a template.
        </p>

        <div className="mt-11 flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110 hover:-translate-y-px">
            Start a Project
          </Link>
          <Link href="/work" className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 border border-line-silver text-silver-light hover:border-silver hover:bg-white/5">
            See the Work
          </Link>
        </div>

        <div className="mt-16 flex flex-col gap-4 max-w-lg w-full">
          {[
            { href: "/services", label: "01", text: "Services", desc: "What gets built" },
            { href: "/process", label: "02", text: "Process", desc: "How it runs" },
            { href: "/pricing", label: "03", text: "Pricing", desc: "Starting points" },
            { href: "/work", label: "04", text: "Work", desc: "Selected projects" },
            { href: "/contact", label: "05", text: "Contact", desc: "Get in touch" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="glass-panel glass-panel-hover flex items-center justify-between p-4 rounded-sm transition-all group">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-gold">{item.label}</span>
                <span className="font-display text-lg tracking-wide">{item.text}</span>
              </div>
              <div className="flex items-center gap-4 text-text-dim">
                <span className="font-mono text-[10px] uppercase hidden sm:block tracking-widest">{item.desc}</span>
                <svg className="w-5 h-5 stroke-current fill-none transition-transform group-hover:translate-x-1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
