// Shared helpers for the Matter.js physics scenes (TechStackPhysics,
// PhysicsFooter, ProcessPhysics) so bodies scale down on narrow viewports
// instead of clipping desktop-sized pills/nodes into a much smaller box,
// and so drag interaction only attaches on devices that actually have a
// mouse — Matter's touch listeners call preventDefault() on touchmove,
// which otherwise blocks native page scrolling on mobile.

/** Reference container width the base pill/node sizes were designed against. */
const REFERENCE_WIDTH = 900;

/**
 * Returns a scale factor (clamped between `min` and 1) for a given
 * container width, so bodies shrink proportionally on narrow screens.
 *
 * The floor is low (0.4) so pills sized for a 900px desktop layout actually
 * fit a ~320px phone container instead of jamming against the walls — text
 * legibility is handled separately (callers clamp font size to a px floor),
 * so geometry can shrink further than text.
 */
export function getResponsiveScale(width: number, min = 0.4): number {
  return Math.max(min, Math.min(1, width / REFERENCE_WIDTH));
}

/** True only for devices with an actual mouse (fine pointer + hover support). */
export function isFinePointerDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/**
 * True when the visitor has asked the OS to minimize non-essential motion.
 * The physics scenes settle to a static frame instead of animating when this
 * is set (the CSS `prefers-reduced-motion` block can't reach a canvas loop).
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Device pixel ratio, capped so high-DPI phones don't pay a 3x canvas fill
 * cost for a decorative scene. 2 is plenty for crisp text/edges.
 */
export function cappedPixelRatio(max = 2): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}

// Matter.Body is structurally `{ position: {x, y} }` for our purposes — kept
// loose so callers don't need to import Matter's types into this file.
interface XYBody {
  position: { x: number; y: number };
}

/**
 * Safety net for the decorative Matter scenes: if a body has drifted outside
 * a generous margin around the canvas — which happens on mobile when the URL
 * bar shows/hides and the `vh`-sized container resizes mid-simulation, or
 * when a backgrounded tab resumes with a large timestep — drop it back to a
 * random spot near the top and kill its velocity. Without this the blocks can
 * tunnel through a wall and vanish for good.
 *
 * `setPosition`/`setVelocity` are passed in so this stays Matter-agnostic;
 * callers hand over `Matter.Body.setPosition` and `Matter.Body.setVelocity`.
 */
export function keepBodiesInBounds<T extends XYBody>(
  bodies: T[],
  width: number,
  height: number,
  setPosition: (body: T, pos: { x: number; y: number }) => void,
  setVelocity: (body: T, vel: { x: number; y: number }) => void,
): void {
  const marginX = width * 0.5 + 200;
  // Generous headroom above the canvas — the scenes stagger their spawn drops
  // from a few container-heights up, and that is not "escaped".
  const ceilingY = -(height * 5) - 500;
  for (const body of bodies) {
    const { x, y } = body.position;
    const escaped =
      x < -marginX || x > width + marginX || y > height + 300 || y < ceilingY;
    if (!escaped) continue;
    setPosition(body, {
      x: width * 0.3 + Math.random() * width * 0.4,
      y: -60 - Math.random() * 120,
    });
    setVelocity(body, { x: 0, y: 0 });
  }
}
