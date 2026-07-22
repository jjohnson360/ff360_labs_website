"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Process", href: "/process" },
    { name: "Pricing", href: "/pricing" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg/80 backdrop-blur-md border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-8 h-[76px] flex items-center justify-between">
        <Link href="/" className="font-display italic font-medium text-xl tracking-wide relative z-10">
          ff<span className="font-sans not-italic font-semibold tracking-wide">360</span>_labs
        </Link>
        <nav className="hidden md:flex gap-10 relative z-10">
          {navLinks.map((link) => {
            // Treat "/" as matching "/services" if they are equivalent logically, but the prompt says Services is at /services.
            // Home is at / and has Services teaser. I'll highlight Services on /services.
            const isActive = pathname === link.href || (pathname === "/" && link.name === "Services");
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors duration-250 relative ${
                  isActive ? "text-gold" : "text-text-dim hover:text-gold-light"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 -bottom-[6px] w-full h-[1px] bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
