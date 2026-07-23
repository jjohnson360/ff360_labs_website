"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { usePathname } from "next/navigation";

const FOOTER_ITEMS = [
  "© 2026 ff360_labs",
  "Always building something new.",
  "GitHub",
  "Contact Us"
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
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // 3. Setup Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

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
    const bodies: Matter.Body[] = [];
    const pillHeight = 40;

    FOOTER_ITEMS.forEach((text) => {
      const pillWidth = text.length * 10 + 40; // Approximate width based on chars
      
      const bodyOptions: Matter.IChamferableBodyDefinition = {
        label: text,
        restitution: 0.3, // Less bouncy than the tech stack
        friction: 0.5,
        density: 0.05,
        chamfer: { radius: 4 }, // Slight rounding for footer blocks
        render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 },
      };

      const x = (width * 0.2) + (Math.random() * (width * 0.6));
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
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#a1a1aa"; // text-silver
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(body.label, 0, 1);
        
        ctx.restore();
      }
    });

    // 7. Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse;

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

    // 9. Intersection Observer to drop bodies when scrolled into view
    let dropped = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !dropped) {
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
