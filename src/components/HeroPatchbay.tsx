"use client";

import { useEffect, useRef } from "react";
import { cappedPixelRatio, isFinePointerDevice, prefersReducedMotion } from "@/lib/physicsResponsive";

/**
 * Animated modular patch-bay behind the home hero — a grid of jacks on a
 * faint rack panel, linked by slack bezier "cables" that sag under gravity,
 * sway gently, and periodically re-patch themselves (one at a time: the
 * plug lifts, arcs to a new jack, and drops in).
 *
 * Doubles as a signal-flow / system diagram and nods to the studio's
 * modular-audio + synth work. Pure 2D canvas — no WebGL, no GLB.
 *
 * Motion budget:
 *  - reduced motion → one static patched frame, no rAF loop
 *  - coarse pointer  → animates, no cursor parallax
 *  - fine pointer    → animates + a few px of parallax drift
 */

const GOLD = "201, 161, 90";
const SILVER = "185, 192, 196";
const JACK_LABELS = ["OSC", "VCF", "ENV", "LFO", "VCA", "MIX", "CLK", "OUT", "CV", "FM"];

interface Jack {
  x: number;
  y: number;
  label?: string;
}

interface Cable {
  from: number;
  to: number;
  gold: boolean;
  phase: number;
  age: number;
  ttl: number;
  // Re-patch transition: null when stable, else the jack we're moving toward.
  swapTo: number | null;
  swapT: number;
  swapFromXY: [number, number];
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export default function HeroPatchbay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const reduced = prefersReducedMotion();
    const parallax = isFinePointerDevice() && !reduced;
    const dpr = cappedPixelRatio();
    const mono =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-jetbrains-mono")
        .trim() || "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let jacks: Jack[] = [];
    let cables: Cable[] = [];

    const rand = (() => {
      // Small deterministic PRNG so the reduced-motion frame is stable.
      let s = 0x2f6e2b1;
      return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
    })();

    const build = () => {
      const mobile = w < 768;
      const cols = mobile ? 4 : 6;
      const rows = mobile ? 3 : 3;
      const x0 = w * 0.16;
      const x1 = w * 0.84;
      const y0 = h * 0.2;
      const y1 = Math.min(h * 0.58, y0 + 300);
      jacks = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jx = x0 + (c / (cols - 1)) * (x1 - x0);
          const jy = y0 + (r / (rows - 1)) * (y1 - y0);
          const i = r * cols + c;
          jacks.push({ x: jx, y: jy, label: JACK_LABELS[i] && i % 2 === 0 ? JACK_LABELS[i] : undefined });
        }
      }

      // Prefer patching jacks that are near-ish and not stacked vertically —
      // keeps cables reading like real patch leads instead of long droops.
      const pick = (from: number): number => {
        const a = jacks[from];
        const cands = jacks
          .map((j, i) => ({ i, d: Math.hypot(j.x - a.x, j.y - a.y), dx: Math.abs(j.x - a.x) }))
          .filter((c) => c.i !== from && c.d > 90 && c.d < w * 0.4 && c.dx > 70);
        if (!cands.length) return (from + 1) % jacks.length;
        return cands[Math.floor(rand() * cands.length)].i;
      };

      const cableCount = mobile ? 3 : 6;
      cables = [];
      const used = new Set<number>();
      for (let k = 0; k < cableCount; k++) {
        let from = Math.floor(rand() * jacks.length);
        let to = pick(from);
        let guard = 0;
        while ((used.has(from * 100 + to) || used.has(to * 100 + from)) && guard++ < 40) {
          from = Math.floor(rand() * jacks.length);
          to = pick(from);
        }
        used.add(from * 100 + to);
        cables.push({
          from,
          to,
          gold: k % 2 === 0,
          phase: rand() * Math.PI * 2,
          age: 0,
          ttl: 6 + rand() * 7,
          swapTo: null,
          swapT: 0,
          swapFromXY: [0, 0],
        });
      }
    };

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (parallax) window.addEventListener("pointermove", onPointer, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    let raf = 0;
    let prev = performance.now();
    const start = prev;

    /** Live position of a cable end — mid-arc when re-patching. */
    const endPoint = (cable: Cable, which: "from" | "to"): [number, number] => {
      if (which === "from" || cable.swapTo === null) {
        const j = jacks[which === "from" ? cable.from : cable.to];
        return [j.x, j.y];
      }
      const t = easeInOut(Math.min(1, cable.swapT));
      const [fx, fy] = cable.swapFromXY;
      const tj = jacks[cable.swapTo];
      const lift = Math.sin(Math.min(1, cable.swapT) * Math.PI) * 64;
      return [fx + (tj.x - fx) * t, fy + (tj.y - fy) * t - lift];
    };

    const drawCable = (cable: Cable, time: number) => {
      const [ax, ay] = endPoint(cable, "from");
      const [bx, by] = endPoint(cable, "to");
      const dist = Math.hypot(bx - ax, by - ay);
      const sag = 14 + dist * 0.16 + (reduced ? 0 : Math.sin(time * 0.6 + cable.phase) * 4);
      const swayX = reduced ? 0 : Math.sin(time * 0.4 + cable.phase) * 4;
      const c1x = ax + (bx - ax) * 0.25 + swayX;
      const c1y = ay + sag;
      const c2x = ax + (bx - ax) * 0.75 + swayX;
      const c2y = by + sag;

      const col = cable.gold ? GOLD : SILVER;
      ctx.strokeStyle = `rgba(${col}, 0.32)`;
      ctx.lineWidth = 1.75;
      ctx.shadowColor = `rgba(${col}, 0.25)`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.bezierCurveTo(c1x, c1y, c2x, c2y, bx, by);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Plugged connector barrels
      for (const [px, py] of [[ax, ay], [bx, by]] as [number, number][]) {
        ctx.fillStyle = `rgba(${col}, 0.6)`;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(10, 10, 11, 0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const time = (now - start) / 1000;

      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(eased.x * -6, eased.y * -6);

      // --- rack rails ------------------------------------------------
      ctx.strokeStyle = `rgba(${GOLD}, 0.07)`;
      ctx.lineWidth = 1;
      for (const rx of [w * 0.09, w * 0.91]) {
        ctx.beginPath();
        ctx.moveTo(rx, h * 0.12);
        ctx.lineTo(rx, h * 0.9);
        ctx.stroke();
        ctx.fillStyle = `rgba(${GOLD}, 0.13)`;
        for (let sy = h * 0.16; sy < h * 0.9; sy += h * 0.14) {
          ctx.beginPath();
          ctx.arc(rx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- jacks --------------------------------------------------
      for (const j of jacks) {
        ctx.strokeStyle = `rgba(${GOLD}, 0.22)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(${SILVER}, 0.35)`;
        ctx.beginPath();
        ctx.arc(j.x, j.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (j.label) {
          ctx.font = `9px ${mono}`;
          ctx.fillStyle = `rgba(${GOLD}, 0.3)`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(j.label, j.x + 12, j.y - 9);
        }
      }

      // --- cables (+ re-patch scheduling) -----------------------
      const anySwapping = cables.some((c) => c.swapTo !== null);
      for (const cable of cables) {
        if (!reduced) {
          cable.age += dt;
          if (cable.swapTo !== null) {
            cable.swapT += dt / 1.3;
            if (cable.swapT >= 1) {
              cable.to = cable.swapTo;
              cable.swapTo = null;
              cable.swapT = 0;
              cable.age = 0;
              cable.ttl = 6 + Math.random() * 7;
            }
          } else if (cable.age > cable.ttl && !anySwapping) {
            let next = Math.floor(Math.random() * jacks.length);
            let guard = 0;
            while ((next === cable.from || next === cable.to) && guard++ < 20) {
              next = Math.floor(Math.random() * jacks.length);
            }
            cable.swapTo = next;
            cable.swapT = 0;
            cable.swapFromXY = [jacks[cable.to].x, jacks[cable.to].y];
          }
        }
        drawCable(cable, time);
      }

      ctx.restore();
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (parallax) window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
