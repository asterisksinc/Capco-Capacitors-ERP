"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth (eased) wheel scrolling for the public site, via Lenis.
 * - Native scrolling is kept on touch devices (Lenis default) and for visitors with "reduce motion".
 * - Scroll positions stay real, so sticky sections and the scroll-driven animations keep working.
 * - Nested scroll areas (drawers, carousels) scroll on their own (allowNestedScroll).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -96 },
      allowNestedScroll: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
