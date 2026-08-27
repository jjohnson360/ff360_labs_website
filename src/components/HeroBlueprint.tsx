"use client";

import { useEffect, useRef } from "react";
import { cappedPixelRatio, isFinePointerDevice, prefersReducedMotion } from "@/lib/physicsResponsive";

/**
 * Animated blueprint linework behind the home hero — a slowly rotating
 * orthographic geodesic wireframe wrapped in drafting furniture: a dashed
 * construction circle, a sweeping radial dimension callout, a baseline
 * dimension, a centre crosshair and corner registration ticks.
 *
 * Pure 2D canvas: no WebGL, no GLB, no Suspense / error boundary needed.
 * It leans on the site's existing blueprint / corner-bracket vocabulary
 * (see `.blueprint-grid` and `.corner` in globals.css) rather than the
 * generic floating spheres it replaces.
 *
 * Motion budget:
 *  - reduced motion → one static composed frame, no rAF loop
 *  - coarse pointer  → animates, no cursor parallax
 *  - fine pointer    → animates + a few px of parallax drift
 */

const GOLD = "201, 161, 90";
const SILVER = "185, 192, 196";

type Vec3 = [number, number, number];

/** Unit-sphere geodesic: icosahedron optionally subdivided once. */
function buildGeodesic(subdivide: boolean): { verts: Vec3[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts: Vec3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(normalize);

  let faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  if (subdivide) {
    const mid = new Map<string, number>();
    const midpoint = (a: number, b: number): number => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const cached = mid.get(key);
      if (cached !== undefined) return cached;
      const m = normalize([
        verts[a][0] + verts[b][0],
        verts[a][1] + verts[b][1],
        verts[a][2] + verts[b][2],
      ]);
      const idx = verts.length;
      verts = [...verts, m];
      mid.set(key, idx);
      return idx;
    };
    const next: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const key = p < q ? `${p}_${q}` : `${q}_${p}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([p, q]);
      }
    }
  }
  return { verts, edges };
}

function normalize([x, y, z]: number[]): Vec3 {
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

export default function HeroBlueprint() {
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

    let mobile = parent.clientWidth < 768;
    let geo = buildGeodesic(!mobile);

    // Layout, recomputed on resize.
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nowMobile = w < 768;
      if (nowMobile !== mobile) {
        mobile = nowMobile;
        geo = buildGeodesic(!mobile);
      }
      cx = w / 2;
      // Anchor the object on the headline rather than the section centre so
      // it doesn't sit under the nav-card stack lower down.
      cy = Math.min(h * 0.42, 380);
      R = Math.min(w * 0.24, h * 0.32, 260);
    };
    resize();

    // Pointer parallax — target set on move, eased toward each frame.
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

    const rotate = (p: Vec3, ay: number, ax: number): Vec3 => {
      let [x, y, z] = p;
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      [x, z] = [x * cosY - z * sinY, x * sinY + z * cosY];
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      [y, z] = [y * cosX - z * sinX, y * sinX + z * cosX];
      return [x, y, z];
    };

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      // Build-in reveal: edges fade up over the first ~1.6s.
      const reveal = reduced ? 1 : Math.min(1, elapsed / 1.6);
      const spin = reduced ? 0.6 : elapsed * 0.08;
      const tilt = reduced ? 0.5 : 0.4 + Math.sin(elapsed * 0.11) * 0.14;

      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(eased.x * -7, eased.y * -7);

      // --- construction circles --------------------------------------
      ctx.setLineDash([2, 6]);
      ctx.lineDashOffset = reduced ? 0 : -elapsed * 6;
      ctx.strokeStyle = `rgba(${GOLD}, 0.16)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(${GOLD}, 0.08)`;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.9, 0, Math.PI * 2);
      ctx.stroke();

      // --- centre crosshair ----------------------------------------
      ctx.strokeStyle = `rgba(${GOLD}, 0.22)`;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      // --- geodesic wireframe ------------------------------------
      const projected = geo.verts.map((v) => rotate(v, spin, tilt));
      ctx.lineWidth = 1;
      for (const [a, b] of geo.edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa[2] + pb[2]) / 4 + 0.5; // 0 back … 1 front
        ctx.strokeStyle = `rgba(${GOLD}, ${(0.08 + depth * 0.34) * reveal})`;
        ctx.beginPath();
        ctx.moveTo(cx + pa[0] * R, cy - pa[1] * R);
        ctx.lineTo(cx + pb[0] * R, cy - pb[1] * R);
        ctx.stroke();
      }
      // vertex ticks
      ctx.fillStyle = `rgba(${SILVER}, ${0.3 * reveal})`;
      for (const p of projected) {
        if (p[2] < -0.2) continue; // front hemisphere only
        ctx.beginPath();
        ctx.arc(cx + p[0] * R, cy - p[1] * R, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- sweeping radial dimension ---------------------------
      const ang = reduced ? -0.9 : elapsed * 0.13 - Math.PI / 2;
      const ex = cx + Math.cos(ang) * R * 1.25;
      const ey = cy + Math.sin(ang) * R * 1.25;
      ctx.strokeStyle = `rgba(${GOLD}, 0.5)`;
      ctx.fillStyle = `rgba(${GOLD}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-7, -3);
      ctx.lineTo(-7, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.font = `10px ${mono}`;
      ctx.fillStyle = `rgba(${GOLD}, 0.6)`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("R 161.8", cx + Math.cos(ang) * R * 0.68, cy + Math.sin(ang) * R * 0.68);

      // --- baseline callout ----------------------------------
      const by = cy + R * 1.6;
      const bx0 = cx - R * 1.25;
      const bx1 = cx + R * 1.25;
      ctx.strokeStyle = `rgba(${GOLD}, 0.28)`;
      ctx.beginPath();
      ctx.moveTo(bx0, by);
      ctx.lineTo(cx - 32, by);
      ctx.moveTo(cx + 32, by);
      ctx.lineTo(bx1, by);
      ctx.moveTo(bx0, by - 5);
      ctx.lineTo(bx0, by + 5);
      ctx.moveTo(bx1, by - 5);
      ctx.lineTo(bx1, by + 5);
      ctx.stroke();
      ctx.fillStyle = `rgba(${GOLD}, 0.5)`;
      ctx.fillText("Ø 323.6", cx, by);

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
