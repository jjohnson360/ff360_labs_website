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
