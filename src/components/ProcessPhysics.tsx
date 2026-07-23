"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const PHASES = [
  "01 Discover",
  "02 Design",
  "03 Build",
  "04 Launch"
];

export default function ProcessPhysics() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    // ZERO GRAVITY
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
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

    // 4. Create Boundaries (thick walls so they don't clip out easily)
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width + 200, 100, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -50, width + 200, 100, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height + 200, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height + 200, wallOptions);
    
    Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);

    // 5. Create Nodes and Springs
    const bodies: Matter.Body[] = [];
    const constraints: Matter.Constraint[] = [];
    const nodeRadius = 60;

    PHASES.forEach((text, i) => {
      // Spread them out randomly but generally left to right
      const x = (width * 0.2) + (i * (width * 0.2)) + (Math.random() * 50 - 25);
      const y = (height / 2) + (Math.random() * 200 - 100);

      const bodyOptions: Matter.IChamferableBodyDefinition = {
        label: text,
        restitution: 0.8, // Bouncy
        frictionAir: 0.05, // Slows down movement smoothly in zero-G
        density: 0.1,
        render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 },
      };

      const body = Matter.Bodies.circle(x, y, nodeRadius, bodyOptions);
      body.plugin.radius = nodeRadius;
      
      bodies.push(body);

      // Connect to the previous node with a spring
      if (i > 0) {
        const prevBody = bodies[i - 1];
        const constraint = Matter.Constraint.create({
          bodyA: prevBody,
          bodyB: body,
          stiffness: 0.02, // Very elastic spring
          damping: 0.05,
          length: 250, // Rest length of the spring
          render: { visible: false } // We will custom render the line
        });
        constraints.push(constraint);
      }
    });

    Matter.World.add(world, [...bodies, ...constraints]);

    // Give the first node a little push to start the floating animation
    Matter.Body.applyForce(bodies[0], bodies[0].position, { x: 0.2, y: -0.2 });

    // 6. Custom Render for Nodes and Springs
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      
      // Draw Springs (Constraints) first so they are behind the nodes
      ctx.beginPath();
      for (const constraint of constraints) {
        if (constraint.bodyA && constraint.bodyB) {
          ctx.moveTo(constraint.bodyA.position.x, constraint.bodyA.position.y);
          ctx.lineTo(constraint.bodyB.position.x, constraint.bodyB.position.y);
        }
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(201, 161, 90, 0.4)"; // Faint gold lines
      ctx.stroke();

      // Draw Nodes
      for (const body of bodies) {
        if (!body.label) continue;
        
        const r = body.plugin.radius;
        
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        
        // Draw Circle
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        
        // Fill and Stroke
        ctx.fillStyle = "rgba(23, 23, 26, 0.8)"; // Charcoal with slight transparency
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#c9a15a"; // Gold
        ctx.stroke();

        // Draw Text
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillStyle = "#e0e0e0"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Split text (e.g. "01 Discover" -> "01" on top, "Discover" below)
        const parts = body.label.split(" ");
        if (parts.length === 2) {
            ctx.fillStyle = "#c9a15a"; // Gold for number
            ctx.font = "bold 16px 'JetBrains Mono', monospace";
            ctx.fillText(parts[0], 0, -10);
            
            ctx.fillStyle = "#e0e0e0"; // Silver for text
            ctx.font = "bold 14px 'Inter', sans-serif";
            ctx.fillText(parts[1], 0, 12);
        } else {
            ctx.fillText(body.label, 0, 0);
        }
        
        ctx.restore();
      }
    });

    // 7. Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.1, render: { visible: false } },
    });
    Matter.World.add(world, mouseConstraint);
    
    // Allows scrolling to pass through the canvas when not actively dragging a body
    mouseConstraint.mouse.element.removeEventListener("mousewheel", (mouseConstraint.mouse as any).mousewheel);
    mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", (mouseConstraint.mouse as any).mousewheel);

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

      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setVertices(ground, Matter.Bodies.rectangle(newWidth / 2, newHeight + 50, newWidth + 200, 100).vertices);
      Matter.Body.setPosition(ceiling, { x: newWidth / 2, y: -50 });
      Matter.Body.setVertices(ceiling, Matter.Bodies.rectangle(newWidth / 2, -50, newWidth + 200, 100).vertices);
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
      Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(newWidth + 50, newHeight / 2, 100, newHeight + 200).vertices);
      Matter.Body.setPosition(leftWall, { x: -50, y: newHeight / 2 });
      Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-50, newHeight / 2, 100, newHeight + 200).vertices);
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <div 
      ref={sceneRef} 
      className="w-full h-full absolute inset-0 z-0 pointer-events-auto"
    />
  );
}
