"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // TODO: Wire this up to a real backend handler (e.g. Next.js API route or external service)
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

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

          {status === "success" ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center">
              <svg className="w-12 h-12 stroke-gold mb-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 4L12 14.01l-3-3"/>
              </svg>
              <h3 className="font-display text-2xl mb-2 text-gold">Message Received</h3>
              <p className="text-text-dim text-sm">I'll review the details and get back to you within 48 hours.</p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-8 font-mono text-xs tracking-widest uppercase text-text-faint hover:text-text transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-mono text-[10px] tracking-widest text-text-dim uppercase">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="bg-bg-soft border border-line-silver rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-text" 
                  placeholder="Jane Doe"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-[10px] tracking-widest text-text-dim uppercase">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="bg-bg-soft border border-line-silver rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-text" 
                  placeholder="jane@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-mono text-[10px] tracking-widest text-text-dim uppercase">Project Details</label>
                <textarea 
                  id="message" 
                  required
                  rows={5}
                  className="bg-bg-soft border border-line-silver rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors text-text resize-none" 
                  placeholder="Tell me about what you're building..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="mt-4 font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
