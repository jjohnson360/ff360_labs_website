"use client";

import { useEffect, useRef } from "react";
import { cappedPixelRatio, isFinePointerDevice, prefersReducedMotion } from "@/lib/physicsResponsive";

/**
 * Ambient oscilloscope field — a scrolling composite waveform with a
 * travelling beam dot, a couple of slowly-morphing Lissajous figures, a
 * centre reticle and corner registration ticks. Calm and rhythmic, a nod
 * to the studio's music / DSP roots; sits behind the About page copy.
 *
 * Pure 2D canvas. Shares the gold/silver + corner-bracket vocabulary of
 * `HeroBlueprint` / `HeroPatchbay` and the same motion budget:
 *  - reduced motion → one static frame, no rAF loop
 *  - coarse pointer  → animates, no cursor parallax
 *  - fine pointer    → animates + a few px of parallax drift
 */

const GOLD = "201, 161, 90";
const SILVER = "185, 192, 196";

export default function HeroOscilloscope() {
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

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let mobile = false;

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      mobile = w < 768;
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
    const start = performance.now();

    // Composite trace: three drifting harmonics summed and normalised.
    const wave = (nx: number, t: number): number => {
      const a = Math.sin(nx * 2.0 + t * 0.9);
      const b = 0.5 * Math.sin(nx * 5.3 + t * 1.5 + Math.sin(t * 0.2) * 0.8);
      const c = 0.3 * Math.sin(nx * 9.1 - t * 0.6);
      return (a + b + c) / 1.8; // → roughly [-1, 1]
    };

    const drawWave = (t: number, ampPx: number, phase: number, color: string, alpha: number, lw: number) => {
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      const stepPx = mobile ? 4 : 2;
      for (let px = 0; px <= w; px += stepPx) {
        const nx = (px / w) * Math.PI * 2;
        const y = cy + wave(nx, t + phase) * ampPx;
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
    };

    const drawLissajous = (
      t: number,
      rx: number,
      ry: number,
      ox: number,
      oy: number,
      freqA: number,
      freqB: number,
      color: string,
      alpha: number,
    ) => {
      const a = freqA + (reduced ? 0 : Math.sin(t * 0.05) * 0.6);
      const b = freqB + (reduced ? 0 : Math.sin(t * 0.07 + 1) * 0.6);
      const delta = reduced ? 0.4 : t * 0.09;
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const steps = mobile ? 120 : 240;
      for (let i = 0; i <= steps; i++) {
        const p = (i / steps) * Math.PI * 2;
        const x = ox + Math.sin(a * p + delta) * rx;
        const y = oy + Math.sin(b * p) * ry;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const draw = (now: number) => {
      const t = reduced ? 3.4 : (now - start) / 1000;

      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(eased.x * -8, eased.y * -8);

      // --- Lissajous figures --------------------------------------
      const bigR = Math.min(w * 0.22, h * 0.26, 230);
      drawLissajous(t, bigR, bigR, cx, cy, 3, 2, SILVER, 0.07);
      if (!mobile) {
        drawLissajous(t * 0.8 + 5, bigR * 0.5, bigR * 0.55, cx + bigR * 1.35, cy - bigR * 0.7, 5, 4, GOLD, 0.08);
      }

      // --- centre reticle ---------------------------------------
      ctx.strokeStyle = `rgba(${GOLD}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx, cy + 12);
      ctx.stroke();
      for (let gx = cx % 48; gx < w; gx += 48) {
        ctx.beginPath();
        ctx.moveTo(gx, cy - 3);
        ctx.lineTo(gx, cy + 3);
        ctx.stroke();
      }

      // --- waveform (echo channel + main + beam) ---------------
      const amp = Math.min(h * 0.09, 90);
      drawWave(t, amp * 0.8, 1.3, SILVER, 0.1, 1);

      ctx.shadowColor = `rgba(${GOLD}, 0.2)`;
      ctx.shadowBlur = 6;
      drawWave(t, amp, 0, GOLD, 0.32, 1.5);
      ctx.shadowBlur = 0;

      // travelling beam dot along the main trace
      const beamX = reduced ? w * 0.5 : (t * 90) % w;
      const beamNx = (beamX / w) * Math.PI * 2;
      const beamY = cy + wave(beamNx, t) * amp;
      ctx.fillStyle = `rgba(${GOLD}, 0.85)`;
      ctx.shadowColor = `rgba(${GOLD}, 0.6)`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(beamX, beamY, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- corner registration ticks -----------------------
      const m = 26;
      const s = 16;
      ctx.strokeStyle = `rgba(${GOLD}, 0.3)`;
      ctx.beginPath();
      ctx.moveTo(m, m + s); ctx.lineTo(m, m); ctx.lineTo(m + s, m);
      ctx.moveTo(w - m - s, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + s);
      ctx.moveTo(m, h - m - s); ctx.lineTo(m, h - m); ctx.lineTo(m + s, h - m);
      ctx.moveTo(w - m - s, h - m); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m, h - m - s);
      ctx.stroke();

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
