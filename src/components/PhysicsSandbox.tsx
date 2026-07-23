"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function PhysicsSandbox() {
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

    // 5. Create Logo Bodies
    const characters = ['f', 'f', '3', '6', '0', '_', 'l', 'a', 'b', 's'];
    const bodies: Matter.Body[] = [];

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const initialScale = isMobile ? 0.6 : 1;

    const startX = width / 2 - (characters.length * 25 * initialScale);

    characters.forEach((char, index) => {
      // Vary shape based on character vaguely
      const isCircle = ['0', '6', '3', 'a', 's'].includes(char);
      const isTall = ['f', 'l', 'b'].includes(char);
      const isWide = char === '_';

      let w = 50, h = 50;
      if (isTall) { h = 70; w = 40; }
      if (isWide) { w = 80; h = 20; }
      if (isCircle) { w = 25; } // radius

      const bodyOptions: Matter.IChamferableBodyDefinition = {
        label: char,
        restitution: 0.6, // Bouncy
        friction: 0.1,
        density: 0.05,    // Heavy feel
        render: {
          fillStyle: "#17171a", // Charcoal
          strokeStyle: "#c9a15a", // Gold wireframe/border
          lineWidth: 2,
        },
      };

      const x = startX + index * (50 * initialScale);
      const y = Math.random() * -500 - 100; // Drop from above

      let body;
      if (isCircle) {
        body = Matter.Bodies.circle(x, y, w, bodyOptions);
      } else {
        body = Matter.Bodies.rectangle(x, y, w, h, bodyOptions);
      }

      if (initialScale !== 1) {
        Matter.Body.scale(body, initialScale, initialScale);
      }

      // Random spin
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
      bodies.push(body);
    });

    Matter.World.add(world, bodies);

    // 6. Custom Render for Text
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      const fontSize = Math.floor(32 * initialScale);
      ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "#c9a15a"; // Gold text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const body of bodies) {
        if (body.label && body.label.length === 1) {
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          // Small offset adjustments for specific characters if needed
          let offsetY = 0;
          if (body.label === '_') offsetY = -10 * initialScale;
          ctx.fillText(body.label, 0, offsetY);
          ctx.restore();
        }
      }
    });

    // 7. Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.World.add(world, mouseConstraint);

    // Fix scroll capture issue on canvas
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

      if (renderRef.current.bounds) {
        renderRef.current.bounds.max.x = newWidth;
        renderRef.current.bounds.max.y = newHeight;
      }

      // Update boundaries
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 25 });
      Matter.Body.setVertices(ground, Matter.Bodies.rectangle(newWidth / 2, newHeight + 25, newWidth + 100, 50).vertices);

      Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
      Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(newWidth + 25, newHeight / 2, 50, newHeight + 100).vertices);

      Matter.Body.setPosition(leftWall, { x: -25, y: newHeight / 2 });
      Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-25, newHeight / 2, 50, newHeight + 100).vertices);
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup to prevent strict mode leaks
    return () => {
      window.removeEventListener("resize", handleResize);
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
