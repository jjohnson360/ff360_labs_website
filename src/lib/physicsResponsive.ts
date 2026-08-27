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
 */
export function getResponsiveScale(width: number, min = 0.55): number {
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
