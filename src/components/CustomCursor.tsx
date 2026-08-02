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

  // Determine icon based on route
  const getIcon = () => {
    switch (pathname) {
      case "/":
        return <Hexagon className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      case "/services":
        return <Code2 className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      case "/process":
        return <Workflow className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      case "/pricing":
        return <CircleDollarSign className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      case "/work":
        return <FolderGit2 className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      case "/contact":
        return <Mail className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
      default:
        return <MousePointer2 className="w-5 h-5 text-gold drop-shadow-[0_0_8px_rgba(201,161,90,0.8)]" strokeWidth={1.5} />;
    }
  };

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
      <div className="relative flex items-center justify-center">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gold/10 blur-xl rounded-full transform scale-150" />
        {/* Icon */}
        {getIcon()}
      </div>
    </motion.div>
  );
}
