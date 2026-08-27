"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import {
  cappedPixelRatio,
  getResponsiveScale,
  isFinePointerDevice,
  prefersReducedMotion,
} from "@/lib/physicsResponsive";

const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", 
  "WebGL", "Three.js", "Python", "Blender", 
  "Figma", "Node.js", "PostgreSQL", "GraphQL"
];

export default function TechStackPhysics() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

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

    // 3. Setup Runner (started lazily once the scene scrolls into view — see step 9)
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

    // 5. Create Tech Pills
    // Scale pill size (and later, font) down on narrow/mobile containers so
    // pills sized for a ~900px desktop layout don't overcrowd a phone screen.
    const scale = getResponsiveScale(width);
    const bodies: Matter.Body[] = [];
    const pillHeight = 50 * scale;

    TECH_STACK.forEach((tech) => {
      // Approximate width based on character count (roughly 12px per char + 60px padding)
      const pillWidth = (tech.length * 12 + 60) * scale;

      const bodyOptions: Matter.IChamferableBodyDefinition = {
        label: tech,
        restitution: 0.5, // Bouncy
        friction: 0.1,
        density: 0.05,
        chamfer: { radius: pillHeight / 2 }, // Pill shape rounding
        render: {
          fillStyle: "transparent", // Handled in custom render
          strokeStyle: "transparent",
          lineWidth: 0,
        },
      };

      // Stagger drops across the top
      const x = (width * 0.2) + (Math.random() * (width * 0.6));
      const y = Math.random() * -800 - 100; // Drop from above at different times

      const body = Matter.Bodies.rectangle(x, y, pillWidth, pillHeight, bodyOptions);

      // Random spin
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

      // Store dimensions for custom rendering
      body.plugin.width = pillWidth;
      body.plugin.height = pillHeight;

      bodies.push(body);
    });

    Matter.World.add(world, bodies);

    // 6. Custom Render for Pills and Text
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      
      for (const body of bodies) {
        if (!body.label) continue;
        
        const w = body.plugin.width;
        const h = body.plugin.height;
        const radius = h / 2;
        
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        
        // Draw Pill Shape
        ctx.beginPath();
        ctx.roundRect(-w/2, -h/2, w, h, radius);
        
        // Fill and Stroke
        ctx.fillStyle = "#17171a"; // Charcoal
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#c9a15a"; // Gold
        ctx.stroke();

        // Draw Text
        ctx.font = `bold ${Math.round(16 * scale)}px 'Inter', sans-serif`;
        ctx.fillStyle = "#e0e0e0"; // Silver light for text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(body.label, 0, 1); // 1px offset for visual center
        
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
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
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

    // 9. Reduced motion: step the pile to rest once and paint a single static
    // frame — no runner, no render loop, no scroll observer.
    let observer: IntersectionObserver | null = null;
    if (reducedMotion) {
      for (let i = 0; i < 260; i++) Matter.Engine.update(engine, 1000 / 60);
      Matter.Render.world(render);
    } else {
      // Otherwise only run the simulation while the scene is actually on screen
      // — it's well below the fold on the services page.
      let isRunning = false;
      observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries[0].isIntersecting;
          if (intersecting && !isRunning) {
            Matter.Runner.run(runner, engine);
            Matter.Render.run(render);
            isRunning = true;
          } else if (!intersecting && isRunning) {
            Matter.Runner.stop(runner);
            Matter.Render.stop(render);
            isRunning = false;
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(sceneRef.current);
    }

    // 10. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sceneRef} 
      className="w-full h-full absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
    />
  );
}
