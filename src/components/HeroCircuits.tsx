"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function HeroCircuits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pathname = usePathname();
  const showCodeRainRef = useRef(pathname === "/");

  useEffect(() => {
    showCodeRainRef.current = pathname === "/";
  }, [pathname]);

  useEffect(() => {
    // Check for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // --- Code Rain ---
    const chars = "01010101010101010101ABCDEF".split("");
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: { y: number; speed: number; active: boolean }[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = {
        y: Math.random() * -height, // Start randomly offscreen
        speed: Math.random() * 0.4 + 0.1, // Very slow speed (0.1 to 0.5)
        active: Math.random() > 0.8, // Only ~20% of columns have active rain
      };
    }

    // --- Circuit Lines ---
    type Point = { x: number; y: number };
    class CircuitLine {
      points: Point[];
      currentLength: number;
      maxLength: number;
      speed: number;
      active: boolean;
      color: string;
      thickness: number;

      constructor(startX: number, startY: number) {
        this.points = [{ x: startX, y: startY }];
        this.currentLength = 0;
        this.maxLength = Math.random() * 300 + 100;
        this.speed = Math.random() * 2 + 1;
        this.active = true;
        this.color = Math.random() > 0.5 ? "rgba(201, 161, 90, 0.4)" : "rgba(176, 176, 176, 0.2)"; // Gold or Silver
        this.thickness = Math.random() > 0.7 ? 2 : 1;
        this.generatePath();
      }

      generatePath() {
        let currentX = this.points[0].x;
        let currentY = this.points[0].y;
        
        const possibleDirs = [
          { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, // Horizontal
          { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, // Vertical
          { dx: 1, dy: 1 }, { dx: -1, dy: 1 } // Diagonal
        ];

        let totalLen = 0;
        while (totalLen < this.maxLength) {
          const dir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
          const segmentLen = Math.random() * 50 + 20;
          
          currentX += dir.dx * segmentLen;
          currentY += dir.dy * segmentLen;
          
          this.points.push({ x: currentX, y: currentY });
          totalLen += segmentLen;
        }
      }

      update() {
        if (!this.active) return;
        this.currentLength += this.speed;
        if (this.currentLength >= this.maxLength) {
          this.active = false;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        let drawnLen = 0;
        for (let i = 1; i < this.points.length; i++) {
          const p1 = this.points[i - 1];
          const p2 = this.points[i];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (drawnLen + dist <= this.currentLength) {
            ctx.lineTo(p2.x, p2.y);
            drawnLen += dist;
            
            // Draw nodes at intersections
            if (i < this.points.length - 1) {
              ctx.fillStyle = this.color;
              ctx.fillRect(p2.x - 2, p2.y - 2, 4, 4);
            }
          } else {
            // Partial segment
            const remaining = this.currentLength - drawnLen;
            const ratio = remaining / dist;
            ctx.lineTo(p1.x + dx * ratio, p1.y + dy * ratio);
            
            // End node
            ctx.fillStyle = this.color;
            ctx.fillRect((p1.x + dx * ratio) - 2, (p1.y + dy * ratio) - 2, 4, 4);
            break;
          }
        }
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
      }
    }

    const circuits: CircuitLine[] = [];
    const maxCircuits = 15;

    // Main animation loop
    const render = () => {
      // Semi-transparent fade for motion trails
      ctx.fillStyle = "rgba(10, 10, 11, 0.1)"; // Match --bg very closely
      ctx.fillRect(0, 0, width, height);

      // --- Draw Code Rain ---
      if (showCodeRainRef.current) {
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          if (!drops[i].active) continue;

          // Random character
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          // Faint color for code
          ctx.fillStyle = `rgba(176, 176, 176, ${Math.random() * 0.08 + 0.02})`; // Extremely faint
          
          const x = i * fontSize;
          const y = drops[i].y;
          
          ctx.fillText(text, x, y);
          
          // Reset drop to top randomly when it goes off screen
          if (y > height && Math.random() > 0.98) {
            drops[i].y = Math.random() * -100;
          }
          drops[i].y += drops[i].speed;
        }
      }

      // --- Draw Circuits ---
      // Spawn new circuits if needed
      if (circuits.length < maxCircuits && Math.random() > 0.95) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        circuits.push(new CircuitLine(startX, startY));
      }

      // Update and draw existing circuits
      for (let i = circuits.length - 1; i >= 0; i--) {
        const circuit = circuits[i];
        circuit.update();
        circuit.draw(ctx);
        
        if (!circuit.active && Math.random() > 0.99) {
          // Remove old dead circuits slowly
          circuits.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
         <div className="w-64 h-64 border border-gold/20 rounded-full flex items-center justify-center">
            <div className="w-32 h-32 border border-gold/40 rounded-sm rotate-45"></div>
         </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />
      {/* Vignette/Gradient overlay to blend edges into the background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a0a0b_100%)] pointer-events-none"></div>
    </motion.div>
  );
}
