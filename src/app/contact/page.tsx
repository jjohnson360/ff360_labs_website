import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="max-w-[1180px] mx-auto px-8 py-24">
      <div className="mb-16">
        <div className="font-mono text-xs tracking-[0.24em] uppercase text-silver mb-5">Get In Touch</div>
        <h1 className="font-display font-semibold text-4xl md:text-5xl max-w-2xl text-text">
          <span className="metal-gold shimmer-text">Ready to build?</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="space-y-8 mt-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-text-faint uppercase mb-2">Location</div>
              <div className="font-mono text-text-dim">Based in Conway, Arkansas — working globally.</div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-text-faint uppercase mb-2">Email</div>
              <a href="mailto:hello@ff360labs.com" className="font-mono text-gold hover:text-gold-light transition-colors">hello@ff360labs.com</a>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-text-faint uppercase mb-2">Social</div>
              <div className="flex gap-4">
                <a href="#" className="font-mono text-text-dim hover:text-silver transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-sm relative">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
