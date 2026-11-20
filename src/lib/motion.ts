// Client-only helpers deciding how much motion/media a visitor gets.
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** False on Save-Data or 2G/slow-2G — heavy video must not autoplay there. */
export function canAutoplayVideo() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && /(^|-)2g$/.test(c.effectiveType)) return false;
  return !prefersReducedMotion();
}

/** Touch-first screens: skip costly per-frame effects (CSS blur filters) and draw the canvas at a lower density. */
export const isCoarse = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
/** Blur value for scroll-scrubbed reveals: real blur on desktop, none on phones (keeps scrubbing at 60fps). */
export const blur = (px: number) => (isCoarse() ? "blur(0px)" : `blur(${px}px)`);

export const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

/** Canvas frame-sequence scrubbing: desktop, full data, motion allowed. */
export const canScrubFrames = () => isDesktop() && canAutoplayVideo();
