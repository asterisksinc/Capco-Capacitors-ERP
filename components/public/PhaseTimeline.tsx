"use client";

import { useEffect, useRef, useState } from "react";

export type TimelinePhase = { category?: string; title: string; description: string };

/**
 * Scroll-driven phase timeline (reference: references/video1.mp4).
 * The stage pins while the visitor scrolls; a ruler with numbered nodes slides left past a fixed
 * centre marker, the passed part fills with the accent colour, and phase titles slide through a
 * fixed bracketed frame with their neighbours faded. Fully reversible on scroll-up.
 */
export function PhaseTimeline({ phases }: { phases: readonly TimelinePhase[] }) {
  const n = phases.length;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || n === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const t = Math.min(1, Math.max(0, -rect.top / travel)); // 0..1 through the pinned range
      const p = t * (n - 1); // 0..n-1, fractional phase position
      const width = wrap.clientWidth;
      const rulerStep = Math.max(150, width * 0.17); // px between ruler nodes
      // px between phase titles: at least one title width + gap, so neighbours never overlap
      const textStep = Math.max(width * 0.45, Math.min(width * 0.84, 420) + 48);

      if (fillRef.current) {
        // fill runs from node 01 to the centre marker, growing as phases are passed
        fillRef.current.style.left = `${width / 2 - p * rulerStep}px`;
        fillRef.current.style.width = `${p * rulerStep}px`;
      }
      if (rulerRef.current) {
        rulerRef.current.style.setProperty("--step", `${rulerStep}px`);
        rulerRef.current.style.transform = `translate3d(${-p * rulerStep}px,0,0)`;
      }
      nodeRefs.current.forEach((node, i) => {
        if (node) node.dataset.reached = String(i <= p + 0.02);
      });
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - p;
        el.style.transform = `translate3d(calc(-50% + ${d * textStep}px),0,0)`;
        el.style.opacity = String(Math.max(0.12, 1 - Math.min(1, Math.abs(d)) * 0.8));
      });
      const idx = Math.min(n - 1, Math.round(p));
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [n]);

  const pad = (v: number) => String(v).padStart(2, "0");
  const TICKS = 5; // minor ticks between nodes

  return (
    // Scroll room: ~55vh per phase transition, plus one screen for the pinned stage itself
    <div ref={wrapRef} className="relative" style={{ height: `calc(100svh + ${(n - 1) * 55}svh)` }}>
      <div className="sticky top-[86px] flex h-[calc(100svh-86px)] flex-col justify-center overflow-hidden">
        {/* Fixed centre marker: phase label + category */}
        <div className="relative z-20 text-center">
          <p className="type-caption font-mono uppercase tracking-[0.12em] text-[#121212]">Phase {pad(active + 1)}</p>
          <p className="type-caption mt-1 font-mono text-[#8A8A8A]">{phases[active]?.category ?? `${pad(active + 1)} / ${pad(n)}`}</p>
        </div>

        {/* Ruler */}
        <div className="relative mt-3 h-[72px]">
          {/* base line */}
          <div className="absolute inset-x-0 top-[22px] h-px bg-[#E4E4E4]" aria-hidden="true" />
          {/* passed part: accent band from the left edge to the centre */}
          <div ref={fillRef} className="absolute left-1/2 top-[18px] h-[9px] w-0 bg-[#58C7E8]/12" aria-hidden="true">
            <div className="absolute inset-x-0 top-[4px] h-px bg-[#58C7E8]/70" />
          </div>
          {/* centre glow line + dot */}
          <span className="pointer-events-none absolute left-1/2 top-[-4px] z-20 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#58C7E8]" aria-hidden="true" />
          <span className="pointer-events-none absolute left-1/2 top-0 z-10 h-[64px] w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#58C7E8] via-[#58C7E8]/50 to-transparent" aria-hidden="true" />

          {/* sliding track: node i sits at i*rulerStep from the centre */}
          <div ref={rulerRef} className="absolute left-1/2 top-0 h-full will-change-transform">
            {phases.map((_, i) => (
              <div key={i} className="absolute top-0" style={{ left: `calc(${i} * var(--step, 200px))` }}>
                {/* minor ticks to the next node */}
                {i < n - 1 &&
                  Array.from({ length: TICKS - 1 }, (_, k) => (
                    <span
                      key={k}
                      aria-hidden="true"
                      className="absolute top-[18px] h-[5px] w-px bg-[#D4D4D4]"
                      style={{ left: `calc(${(k + 1) / TICKS} * var(--step, 200px))` }}
                    />
                  ))}
                <span
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  data-reached="false"
                  aria-hidden="true"
                  className="absolute top-[8px] h-[16px] w-px -translate-x-1/2 bg-[#BDBDBD] transition-[height,background-color,top] duration-300 data-[reached=true]:top-[2px] data-[reached=true]:h-[22px] data-[reached=true]:w-[2px] data-[reached=true]:bg-[#58C7E8]"
                />
                <span className="absolute top-[32px] -translate-x-1/2 font-mono text-[12px] text-[#595959]">{pad(i + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase titles sliding through a fixed bracketed frame */}
        <div className="relative mt-10 h-[200px] lg:mt-14 lg:h-[220px]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[min(92vw,460px)] -translate-x-1/2" aria-hidden="true">
            <span className="absolute left-0 top-0 h-[10px] w-[10px] border-l border-t border-[#767676]" />
            <span className="absolute right-0 top-0 h-[10px] w-[10px] border-r border-t border-[#767676]" />
            <span className="absolute bottom-0 left-0 h-[10px] w-[10px] border-b border-l border-[#767676]" />
            <span className="absolute bottom-0 right-0 h-[10px] w-[10px] border-b border-r border-[#767676]" />
          </div>
          {phases.map((phase, i) => (
            <div
              key={phase.title}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              aria-hidden={i !== active}
              className="absolute left-1/2 top-7 w-[min(84vw,420px)] text-center will-change-transform"
            >
              <p className="type-caption font-mono tracking-[0.08em] text-[#8A8A8A]">
                {pad(i + 1)} / {pad(n)}
              </p>
              <h3 className="type-h3-lg mt-3 font-normal text-[#121212]">{phase.title}</h3>
              <p className="type-small mt-3 leading-[1.5] text-[#595959]">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
