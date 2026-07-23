"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the Physics Sandbox to ensure it only runs on the client
// and bypasses SSR since matter.js relies heavily on the browser window/canvas.
const PhysicsSandbox = dynamic(() => import("@/components/PhysicsSandbox"), {
  ssr: false,
});

export default function NotFound() {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Textures */}
      <div className="blueprint-grid z-0 opacity-50 pointer-events-none"></div>

      {/* Physics Interactive Layer */}
      <PhysicsSandbox />

      {/* 404 Typography Overlay */}
      <div className="relative z-20 flex flex-col items-center pointer-events-none text-center px-4">
        <h1 className="font-display font-semibold text-8xl md:text-9xl leading-none tracking-tight text-white mb-4">
          404
        </h1>
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-gold mb-8">
          System Malfunction
        </p>
        
        {/* Pointer events auto allows the button to be clicked despite the overlay */}
        <div className="pointer-events-auto">
          <Link href="/" className="font-mono text-xs tracking-widest uppercase py-4 px-8 rounded-sm transition-all duration-250 bg-gradient-to-br from-gold-dark via-gold-light to-gold text-[#14110a] font-semibold hover:brightness-110 hover:-translate-y-px inline-block">
            Reboot System
          </Link>
        </div>
      </div>
      
      {/* Easter Egg Hint */}
      <div className="absolute bottom-12 z-20 pointer-events-none">
        <p className="font-mono text-[10px] tracking-widest uppercase text-silver-light/50">
          ( You can drag the debris )
        </p>
      </div>

    </div>
  );
}
