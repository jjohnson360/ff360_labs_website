import Link from "next/link";

const plans = [
  {
    name: "Launch",
    price: "$750–$1,500",
    desc: "For Small Businesses",
    features: [
      "3–5 pages",
      "Mobile design",
      "Contact form",
      "Basic SEO",
    ],
    for: "Small businesses · personal brands · simple portfolios",
    featured: false,
  },
  {
    name: "Growth",
    price: "$1,500–$3,000",
    desc: "For Growing Brands",
    features: [
      "5–10 pages",
      "Custom design",
      "Animations",
      "CMS integration",
      "Analytics"
    ],
    for: "Established businesses · creators · organizations",
    featured: true,
  },
  {
    name: "Innovation",
    price: "Custom",
    desc: "For Custom Builds",
    features: [
      "Advanced UI",
      "3D assets",
      "Custom development",
      "Experimental features"
    ],
    for: "Interactive sites · 3D experiences · web apps · custom tools",
    featured: false,
    experimental: true,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
      <div className="mb-20 text-center">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">Starting Points</div>
        <h1 className="font-display font-semibold text-4xl md:text-5xl text-text">
          <span className="metal-silver shimmer-text">Three ways to begin.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start mb-16">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-sm transition-all duration-300 ${
              plan.featured
                ? "bg-bg-card border border-gold shadow-[0_0_30px_rgba(201,161,90,0.1)] lg:-translate-y-4"
                : "glass-panel glass-panel-hover"
            }`}
          >
            {plan.experimental && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <span className="bg-bg border border-silver text-silver-light font-mono text-[10px] tracking-widest uppercase py-1 px-3 rounded-full font-semibold">
                  Experimental
                </span>
              </div>
            )}
            
            <div className="mb-8">
              <div className="font-mono text-[10px] tracking-widest text-text-faint uppercase mb-2">{plan.desc}</div>
              <h3 className={`font-display text-2xl mb-2`}>
                {plan.name}
              </h3>
              <div className={`font-mono text-xl ${plan.experimental ? "metal-silver shimmer-text" : "metal-gold shimmer-text"}`}>
                {plan.price}
              </div>
            </div>

            <ul className="space-y-4 mb-10 min-h-[160px]">
              {plan.features.map((feat, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-text-dim">
                  <svg className={`w-5 h-5 shrink-0 ${plan.featured ? "stroke-gold" : "stroke-silver"}`} fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <div className="text-text-faint text-[11px] leading-relaxed italic mb-8 min-h-[40px]">
              {plan.for}
            </div>

            <Link href="/contact" className={`block text-center font-mono text-xs tracking-widest uppercase py-4 px-4 rounded-sm transition-all duration-250 ${
              plan.featured
                ? "bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110"
                : "border border-line-silver text-silver-light hover:border-silver hover:bg-white/5"
            }`}>
              Inquire Now
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <p className="text-text-dim text-sm leading-relaxed">
          <span className="metal-gold shimmer-text font-medium">Innovation</span> projects push past standard web development — 3D scenes, custom interfaces, generative or automated systems. Because the scope is less predictable, these start with a paid discovery phase to define feasibility and timeline before a final quote or commitment, and typically run longer than a Launch or Growth project.
        </p>
      </div>
    </div>
  );
}
