"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import {
  cappedPixelRatio,
  getResponsiveScale,
  isFinePointerDevice,
  keepBodiesInBounds,
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

    // 4. Create Boundaries — thick (120px) so fast bodies can't tunnel through,
    // and a ceiling well above the spawn zone to catch anything flung upward.
    const wallOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };

    const ground = Matter.Bodies.rectangle(width / 2, height + 60, width + 400, 120, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-60, height / 2, 120, height * 6 + 200, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 60, height / 2, 120, height * 6 + 200, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -height * 2 - 60, width + 400, 120, wallOptions);

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    // 5. Create Tech Pills
    // Scale pill size (and later, font) down on narrow/mobile containers so
    // pills sized for a ~900px desktop layout don't overcrowd a phone screen.
    const scale = getResponsiveScale(width);
    // Font shrinks with the container but never below 11px, so labels stay
    // readable on phones even when the pill geometry scales further down.
    const fontPx = Math.max(11, Math.round(16 * scale));
    const bodies: Matter.Body[] = [];
    const pillHeight = Math.max(fontPx + 12, 50 * scale);

    TECH_STACK.forEach((tech) => {
      // Width is the larger of the desktop-derived size and whatever the
      // (px-floored) label actually needs, so short pills don't collapse
      // narrower than their text on mobile.
      const pillWidth = Math.max(
        (tech.length * 12 + 60) * scale,
        tech.length * fontPx * 0.62 + 24
      );

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

      // Stagger drops across the top — keep away from the side walls so wide
      // pills don't spawn already clipping on a narrow container.
      const x = (width * 0.3) + (Math.random() * (width * 0.4));
      // Stagger the drop over a span that tracks the container height so pills
      // don't rain from far above a short mobile box.
      const y = Math.random() * -(height * 1.5) - 60;

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

      // Safety net: recover any pill that has escaped the canvas bounds.
      keepBodiesInBounds(
        bodies,
        render.options.width ?? width,
        render.options.height ?? height,
        Matter.Body.setPosition,
        Matter.Body.setVelocity,
      );

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
        ctx.font = `bold ${fontPx}px 'Inter', sans-serif`;
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

    // 8. Handle Resize — via ResizeObserver so it also catches the container
    // shrinking/growing when a mobile browser shows or hides its URL bar (the
    // `h-[42vh]` bucket changes height on scroll). Reposition the walls, then
    // pull any body that ended up outside the new bounds back in — otherwise
    // a resize mid-fall would leave pills stranded below the floor.
    const applySize = () => {
      const el = sceneRef.current;
      const r = renderRef.current;
      if (!el || !r) return;
      const nw = Math.max(el.clientWidth, 1);
      const nh = Math.max(el.clientHeight, 1);

      Matter.Render.setSize(r, nw, nh);

      Matter.Body.setPosition(ground, { x: nw / 2, y: nh + 60 });
      Matter.Body.setVertices(ground, Matter.Bodies.rectangle(nw / 2, nh + 60, nw + 400, 120).vertices);
      Matter.Body.setPosition(ceiling, { x: nw / 2, y: -nh * 2 - 60 });
      Matter.Body.setVertices(ceiling, Matter.Bodies.rectangle(nw / 2, -nh * 2 - 60, nw + 400, 120).vertices);
      Matter.Body.setPosition(rightWall, { x: nw + 60, y: nh / 2 });
      Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(nw + 60, nh / 2, 120, nh * 6 + 200).vertices);
      Matter.Body.setPosition(leftWall, { x: -60, y: nh / 2 });
      Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-60, nh / 2, 120, nh * 6 + 200).vertices);

      keepBodiesInBounds(bodies, nw, nh, Matter.Body.setPosition, Matter.Body.setVelocity);

      // No render loop under reduced motion — repaint the static frame by hand.
      if (reducedMotion) Matter.Render.world(r);
    };

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(applySize);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(sceneRef.current);

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
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
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
