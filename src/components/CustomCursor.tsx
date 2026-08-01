"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { 
  Hexagon, 
  Code2, 
  Workflow, 
  CircleDollarSign, 
  FolderGit2, 
  Mail,
  MousePointer2
} from "lucide-react";

export default function CustomCursor() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  
  // Track mouse coordinates
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Use springs for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    cursorX.set(mousePosition.x);
    cursorY.set(mousePosition.y);
  }, [mousePosition, cursorX, cursorY]);

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

  // Only render on devices with fine pointer (mouse)
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
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
