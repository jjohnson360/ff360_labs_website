"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { usePathname } from "next/navigation";
import {
  cappedPixelRatio,
  getResponsiveScale,
  isFinePointerDevice,
  prefersReducedMotion,
} from "@/lib/physicsResponsive";

// Decorative text blocks only — the real footer nav/contact lives in the
// accessible markup above this canvas (see Footer.tsx).
const FOOTER_ITEMS = [
  "© 2026 ff360_labs",
  "Always building something new.",
  "Conway, Arkansas",
  "Working globally",
];

export default function PhysicsFooter() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // 2. Setup Renderer
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: cappedPixelRatio(),
      },
    });
    renderRef.current = render;

    const reducedMotion = prefersReducedMotion();

    // 3. Setup Runner (started lazily once the footer scrolls into view — see step 9)
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // 4. Create Boundaries
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    
    // Bottom, Left, Right
    const ground = Matter.Bodies.rectangle(width / 2, height + 25, width + 100, 50, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height + 100, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height + 100, wallOptions);
    
    Matter.World.add(world, [ground, leftWall, rightWall]);

    // 5. Create Footer Bodies (But don't add them yet!)
    // Scale down on narrow/mobile containers so blocks sized for a ~900px
    // desktop footer don't overcrowd a phone-width bar.
    const scale = getResponsiveScale(width);
    // Font shrinks with the container but never below 10px so the labels stay
    // readable on phones; pill geometry can scale further down than that.
    const fontPx = Math.max(10, Math.round(12 * scale));
    const bodies: Matter.Body[] = [];
    const pillHeight = Math.max(fontPx + 10, 40 * scale);

    FOOTER_ITEMS.forEach((text) => {
      // Size the block to the label at its actual (px-floored) mono font —
      // JetBrains Mono runs ~0.6em per glyph — rather than a fixed heuristic
      // that left the text as a tiny dot in an oversized box on mobile.
      const pillWidth = Math.max(
        (text.length * 10 + 40) * scale,
        text.length * fontPx * 0.62 + 20
      );

      const bodyOptions: Matter.IChamferableBodyDefinition = {
        label: text,
        restitution: 0.3, // Less bouncy than the tech stack
        friction: 0.5,
        density: 0.05,
        chamfer: { radius: 4 }, // Slight rounding for footer blocks
        render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 },
      };

      const x = (width * 0.3) + (Math.random() * (width * 0.4));
      const y = -100 - (Math.random() * 200); // Start way offscreen top

      const body = Matter.Bodies.rectangle(x, y, pillWidth, pillHeight, bodyOptions);
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      
      body.plugin.width = pillWidth;
      body.plugin.height = pillHeight;
      
      bodies.push(body);
    });

    // 6. Custom Render for Text
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      for (const body of bodies) {
        if (!body.label) continue;
        
        const w = body.plugin.width;
        const h = body.plugin.height;
        
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        
        // Draw Block
        ctx.beginPath();
        ctx.roundRect(-w/2, -h/2, w, h, 4);
        
        // Fill and Stroke
        ctx.fillStyle = "#17171a"; // Charcoal
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#404040"; // Dimmer outline for footer
        ctx.stroke();

        // Draw Text
        ctx.font = `${fontPx}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "#a1a1aa"; // text-silver
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(body.label, 0, 1);
        
        ctx.restore();
      }
    });

    // 7. Mouse Interaction — only attach on devices with an actual mouse, and
    // not under reduced motion (there's no live simulation to drag).
    // Matter's touch listeners call preventDefault() on touchmove, which
    // would otherwise block native scrolling on mobile/touch devices.
    if (isFinePointerDevice() && !reducedMotion) {
      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Matter.World.add(world, mouseConstraint);
      render.mouse = mouse;
    }

    // 8. Handle Resize
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;
      
      renderRef.current.canvas.width = newWidth;
      renderRef.current.canvas.height = newHeight;
      renderRef.current.options.width = newWidth;
      renderRef.current.options.height = newHeight;

      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 25 });
      Matter.Body.setVertices(ground, Matter.Bodies.rectangle(newWidth / 2, newHeight + 25, newWidth + 100, 50).vertices);
      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
      Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(newWidth + 25, newHeight / 2, 50, newHeight + 100).vertices);
      Matter.Body.setPosition(leftWall, { x: -25, y: newHeight / 2 });
      Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-25, newHeight / 2, 50, newHeight + 100).vertices);
    };

    window.addEventListener("resize", handleResize);

    // 9. Intersection Observer to drop bodies and (de)animate the scene
    // when it scrolls in/out of view. The footer mounts on every page, so
    // without this its Runner/Render loop would tick forever in the
    // background even when nobody has scrolled anywhere near it.
    let dropped = false;
    let isRunning = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0].isIntersecting;
        if (!intersecting) {
          if (isRunning) {
            Matter.Runner.stop(runner);
            Matter.Render.stop(render);
            isRunning = false;
          }
          return;
        }

        if (reducedMotion) {
          // Drop the blocks in, settle to rest synchronously, paint one frame.
          if (!dropped) {
            Matter.World.add(world, bodies);
            for (let i = 0; i < 200; i++) Matter.Engine.update(engine, 1000 / 60);
            Matter.Render.world(render);
            dropped = true;
          }
          return;
        }

        if (!isRunning) {
          Matter.Runner.run(runner, engine);
          Matter.Render.run(render);
          isRunning = true;
        }
        if (!dropped) {
          Matter.World.add(world, bodies);
          dropped = true;
        }
      },
      { threshold: 0.1 }
    );

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    // 10. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, [pathname]);

  return (
    <div 
      ref={sceneRef} 
      className="w-full h-[150px] relative z-10 cursor-grab active:cursor-grabbing bg-bg overflow-hidden border-t border-[#17171a]"
    />
  );
}
