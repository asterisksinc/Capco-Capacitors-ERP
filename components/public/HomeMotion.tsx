"use client";

import { useEffect } from "react";

/** Progressive enhancement: content stays visible without JS or with reduced motion. */
export default function HomeMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    const start = () => {
      dispose();
      if (preference.matches) return;
      const animations = new Set<Animation>();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const animation = target.animate(
            [{ opacity: 0, transform: "translateY(28px)", filter: "blur(3px)" }, { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }],
            { duration: 850, easing: "cubic-bezier(.22, 1, .36, 1)", delay: Number(target.dataset.revealDelay ?? 0) },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer.unobserve(target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".home-page [data-reveal], .home-page h2, .home-page article").forEach((element) => observer.observe(element));
      const background = document.querySelector<HTMLElement>("[data-hero-background]");
      let frame = 0;
      const update = () => {
        frame = 0;
        if (background && window.scrollY < background.offsetHeight) {
          background.style.transform = `translateY(${window.scrollY * 0.12}px)`;
        }
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener("scroll", onScroll, { passive: true });
      dispose = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
        if (background) background.style.transform = "";
      };
    };
    start();
    preference.addEventListener("change", start);
    return () => { dispose(); preference.removeEventListener("change", start); };
  }, []);
  return null;
}
