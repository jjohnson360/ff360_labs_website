"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Hexagon,
  Code2,
  Workflow,
  CircleDollarSign,
  FolderGit2,
  Mail,
  MousePointer2,
} from "lucide-react";

export default function CustomCursor() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // useMotionValue: updates bypass React's render cycle entirely
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Tighter spring config for near-zero perceived lag
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Unmount entirely on touch/coarse-pointer devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    // Mount-time visibility flip for a fine-pointer device; not a state sync loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Route-specific glyph. Kept small (16px) — it sits on the dark chip below,
  // which is what actually carries the contrast over busy backgrounds.
  const Icon = (() => {
    switch (pathname) {
      case "/": return Hexagon;
      case "/services": return Code2;
      case "/process": return Workflow;
      case "/pricing": return CircleDollarSign;
      case "/work": return FolderGit2;
      case "/contact": return Mail;
      default: return MousePointer2;
    }
  })();

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div className="relative flex h-[26px] w-[26px] items-center justify-center">
        {/* Outer glow — reads as a halo on dark, a soft edge on light linework */}
        <div className="absolute inset-0 scale-150 rounded-full bg-gold/15 blur-md" />
        {/* Dark backing chip: the contrast anchor. Stays legible over the
            gold canvas linework on the home / work / about backgrounds. */}
        <div className="absolute inset-0 rounded-full border border-gold/70 bg-[#0a0a0b]/80 shadow-[0_0_10px_rgba(0,0,0,0.6)] backdrop-blur-[2px]" />
        {/* Precise centre dot so the actual pointer position is never ambiguous */}
        <div className="absolute h-[3px] w-[3px] rounded-full bg-gold-light" />
        <Icon
          className="relative h-4 w-4 text-gold-light drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          strokeWidth={1.75}
        />
      </div>
    </motion.div>
  );
}
