"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".home-page [data-reveal], .home-page h2, .home-page article";
/** Hero has its own CSS entrance; horizontal carousels shouldn't fade while swiping. */
const EXCLUDE_SELECTOR = "[data-hero-background], section[aria-labelledby='home-title'], .project-list";

/**
 * Progressive enhancement: content stays visible without JS or with reduced motion.
 * Only elements that start below the fold are hidden, so nothing that is already
 * painted ever blinks out and back in. The reveal itself is a CSS transition on
 * opacity/transform only (GPU-composited, no blur), which keeps scrolling smooth.
 */
export default function HomeMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    const start = () => {
      dispose();
      if (preference.matches) return;

      const viewportBottom = window.innerHeight;
      const pending = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
        (el) => !el.closest(EXCLUDE_SELECTOR) && el.getBoundingClientRect().top > viewportBottom,
      );
      pending.forEach((el) => { el.dataset.motion = "hidden"; });

      const observer = new IntersectionObserver((entries) => {
        // Stagger siblings that enter together (e.g. a row of product cards).
        const entering = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target as HTMLElement);
        entering.forEach((target, i) => {
          const delay = Number(target.dataset.revealDelay ?? 0) + Math.min(i, 5) * 80;
          target.style.transitionDelay = `${delay}ms`;
          target.dataset.motion = "shown";
          target.addEventListener("transitionend", () => {
            target.style.transitionDelay = "";
          }, { once: true });
          observer.unobserve(target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      pending.forEach((el) => observer.observe(el));

      const background = document.querySelector<HTMLElement>("[data-hero-background]");
      let frame = 0;
      let lastY = -1;
      const update = () => {
        frame = 0;
        const y = window.scrollY;
        if (!background || y === lastY || y > background.offsetHeight) return;
        lastY = y;
        background.style.transform = `translate3d(0, ${(y * 0.12).toFixed(2)}px, 0)`;
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener("scroll", onScroll, { passive: true });

      dispose = () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
        pending.forEach((el) => { delete el.dataset.motion; el.style.transitionDelay = ""; });
        if (background) background.style.transform = "";
      };
    };

    start();
    preference.addEventListener("change", start);
    return () => { dispose(); preference.removeEventListener("change", start); };
  }, []);
  return null;
}
