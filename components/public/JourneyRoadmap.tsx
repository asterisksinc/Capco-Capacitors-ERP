"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

type Milestone = { readonly year: string; readonly tag?: string; readonly tagline: string };

/* ---- Circuit geometry (SVG user units) ----------------------------------
 * A horizontal "bus" trace doubles as a true-to-scale year ruler. Each
 * milestone branches off the bus at its real year, then fans out (PCB-style)
 * to an evenly spaced capacitor node so labels never collide.
 * ------------------------------------------------------------------------ */
const VB_W = 1600;
const VB_H = 300;
const BUS_Y = 150;
const BUS_X0 = 40;
const BUS_X1 = 1560;
const NODE_X0 = 150;
const NODE_X1 = 1450;

type Node = { year: number; busX: number; x: number; upper: boolean };
type State = "done" | "active" | "todo";

const pad = (n: number) => String(n).padStart(2, "0");

function buildGeometry(milestones: readonly Milestone[]) {
  const years = milestones.map((m) => Number(m.year));
  const yMin = Math.floor((Math.min(...years) - 2) / 5) * 5; // e.g. 1990
  const yMax = Math.ceil((Math.max(...years) + 2) / 5) * 5; // e.g. 2030
  const yearToX = (y: number) => BUS_X0 + 40 + ((y - yMin) / (yMax - yMin)) * (BUS_X1 - BUS_X0 - 80);
  const n = milestones.length;
  const nodes: Node[] = years.map((year, i) => ({
    year,
    busX: yearToX(year),
    x: n === 1 ? VB_W / 2 : NODE_X0 + (i * (NODE_X1 - NODE_X0)) / (n - 1),
    upper: i % 2 === 1,
  }));
  const ticks: { x: number; year: number; major: boolean }[] = [];
  for (let y = yMin; y <= yMax; y++) ticks.push({ x: yearToX(y), year: y, major: y % 5 === 0 });
  return { nodes, ticks };
}

/** Bus → short stub → diagonal fan-out → straight lead into the capacitor plates. */
function branchPath(node: Node) {
  const dir = node.upper ? -1 : 1;
  return `M${node.busX} ${BUS_Y} V${BUS_Y + dir * 26} L${node.x} ${BUS_Y + dir * 72} V${BUS_Y + dir * 118}`;
}

/** Capacitor schematic symbol (two plates) + lead + solder pad. */
function CapacitorNode({ node, state }: { node: Node; state: State }) {
  const dir = node.upper ? -1 : 1;
  const p1 = BUS_Y + dir * 118;
  const p2 = BUS_Y + dir * 127;
  const padY = BUS_Y + dir * 140;
  const stroke = state === "todo" ? "#2C4656" : "#58C7E8";
  const w = state === "active" ? 15 : 12;
  const t = { transition: "stroke .4s ease, fill .4s ease" };
  return (
    <g opacity={state === "done" ? 0.7 : 1} style={{ transition: "opacity .4s ease" }}>
      <line x1={node.x - w} y1={p1} x2={node.x + w} y2={p1} stroke={stroke} strokeWidth="3" strokeLinecap="round" style={t} />
      <line x1={node.x - w} y1={p2} x2={node.x + w} y2={p2} stroke={stroke} strokeWidth="3" strokeLinecap="round" style={t} />
      <line x1={node.x} y1={p2} x2={node.x} y2={padY} stroke={stroke} strokeWidth="2" style={t} />
      {state === "active" && <circle cx={node.x} cy={padY} r="11" fill="none" stroke="#58C7E8" strokeOpacity=".5" className="journey-pad-ring" />}
      <circle cx={node.x} cy={padY} r="5" fill={state === "active" ? "#58C7E8" : "#0B1722"} stroke={stroke} strokeWidth="2" style={t} />
    </g>
  );
}

export default function JourneyRoadmap({ milestones }: { milestones: readonly Milestone[] }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const count = milestones.length;
  const segments = Math.max(1, count - 1);
  const scrollIndex = Math.min(count - 1, Math.round(progress * segments));
  // Hover (or keyboard focus) previews a milestone; otherwise scroll position drives it.
  const activeIndex = hoverIndex ?? scrollIndex;
  const hoverHandlers = (idx: number) => ({
    onMouseEnter: () => setHoverIndex(idx),
    onFocus: () => setHoverIndex(idx),
    onMouseLeave: () => setHoverIndex(null),
    onBlur: () => setHoverIndex(null),
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const raw = (-rect.top / total - 0.04) / 0.88;
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const { nodes, ticks } = buildGeometry(milestones);
  const active = nodes[activeIndex];
  const litFraction = (active.busX - BUS_X0) / (BUS_X1 - BUS_X0);
  const ease = "cubic-bezier(.22, 1, .36, 1)";
  const stateOf = (i: number): State => (i < activeIndex ? "done" : i === activeIndex ? "active" : "todo");

  return (
    <section
      id="company-timeline"
      ref={containerRef}
      className="journey-circuit relative bg-[#0B1722] text-white lg:min-h-[320vh]"
      aria-label="CAPCO company timeline"
    >
      <div className="flex w-full flex-col px-6 py-16 lg:sticky lg:top-0 lg:h-screen lg:justify-between lg:overflow-hidden lg:px-[80px] lg:py-14">
        {/* Header */}
        <div className="relative mx-auto flex w-full max-w-[1800px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[800px]">
            <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-white">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              OUR JOURNEY
            </p>
            <h2 className="mt-3 text-[32px] font-normal leading-[1.05] tracking-[-0.04em] text-white sm:text-[40px] lg:text-[48px]">
              32 Years of Growth, Innovation &amp; Compliance
            </h2>
          </div>

          <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:items-end">
            <p className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-[#6E8A9A] lg:block">
              Ref. CAPCO-TL-{milestones[0].year}/{milestones[count - 1].year} · {pad(count)} Milestones
            </p>
            <a
              href="/catalogs/capco-product-catalog.pdf"
              download="CAPCO-Company-Timeline.pdf"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
              className="inline-flex min-h-[50px] w-[300px] max-w-full shrink-0 items-end justify-between bg-[#58C7E8] px-3.5 pb-2.5 pt-5 text-[13px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <span className="!text-[#121212]">Download Detailed Timeline (PDF)</span>
              <img src="/figma/solutions/4e858.svg" alt="" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ---------- Desktop: circuit timeline ---------- */}
        <div className="relative mx-auto my-auto hidden w-full pb-[150px] pt-[150px] lg:block [@media(max-height:820px)]:pb-[120px] [@media(max-height:820px)]:pt-[120px]">
          <div
            className="relative mx-auto w-full"
            style={{ aspectRatio: `${VB_W} / ${VB_H}`, maxWidth: `min(1500px, calc((100vh - 560px) * ${VB_W / VB_H}))` }}
          >
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <defs>
                {/* userSpaceOnUse: a flat horizontal line has a zero-height bbox, which breaks bbox-relative filters/gradients */}
                <filter id="journey-glow" filterUnits="userSpaceOnUse" x="0" y="-40" width={VB_W} height={VB_H + 80}>
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="journey-bus-fade" gradientUnits="userSpaceOnUse" x1={BUS_X0} y1="0" x2={BUS_X1} y2="0">
                  <stop offset="0" stopColor="#2C4656" stopOpacity="0" />
                  <stop offset=".04" stopColor="#2C4656" />
                  <stop offset=".96" stopColor="#2C4656" />
                  <stop offset="1" stopColor="#2C4656" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Year ruler */}
              {ticks.map((t) => (
                <g key={t.year}>
                  <line x1={t.x} y1={BUS_Y + 6} x2={t.x} y2={BUS_Y + (t.major ? 16 : 10)} stroke={t.major ? "#46667A" : "#2C4656"} strokeWidth="1" />
                  {t.major && !nodes.some((nd) => Math.abs(nd.busX - t.x) < 18) && (
                    <text x={t.x} y={BUS_Y - 12} textAnchor="middle" fill="#557386" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="1">
                      {t.year}
                    </text>
                  )}
                </g>
              ))}

              {/* Branch traces */}
              {nodes.map((node, i) => {
                const state = stateOf(i);
                return (
                  <path
                    key={node.year}
                    d={branchPath(node)}
                    fill="none"
                    stroke={state === "todo" ? "#22394A" : "#58C7E8"}
                    strokeOpacity={state === "done" ? 0.45 : 1}
                    strokeWidth={state === "active" ? 2.5 : 2}
                    strokeLinejoin="round"
                    filter={state === "active" ? "url(#journey-glow)" : undefined}
                    style={{ transition: "stroke .4s ease, stroke-opacity .4s ease" }}
                  />
                );
              })}

              {/* Bus: base + lit portion up to the active year */}
              <path d={`M${BUS_X0} ${BUS_Y} H${BUS_X1}`} stroke="url(#journey-bus-fade)" strokeWidth="3" fill="none" />
              <path
                d={`M${BUS_X0} ${BUS_Y} H${BUS_X1}`}
                fill="none"
                pathLength={1}
                stroke="#58C7E8"
                strokeWidth="3"
                strokeDasharray="1 1"
                strokeDashoffset={1 - litFraction}
                filter="url(#journey-glow)"
                style={{ transition: `stroke-dashoffset .7s ${ease}` }}
              />

              {/* Junctions on the bus */}
              {nodes.map((node, i) => (
                <circle
                  key={node.year}
                  cx={node.busX}
                  cy={BUS_Y}
                  r={i === activeIndex ? 5 : 3.5}
                  fill={i <= activeIndex ? "#58C7E8" : "#0B1722"}
                  stroke={i <= activeIndex ? "#58C7E8" : "#46667A"}
                  strokeWidth="2"
                  style={{ transition: "fill .4s ease, stroke .4s ease, r .3s ease" }}
                />
              ))}

              {/* Travelling spark */}
              <g style={{ transform: `translateX(${active.busX}px)`, transition: `transform .7s ${ease}` }}>
                <circle cx={0} cy={BUS_Y} r="12" fill="#58C7E8" opacity=".18" className="journey-spark" />
                <circle cx={0} cy={BUS_Y} r="4" fill="#fff" />
              </g>

              {/* Capacitor nodes */}
              {nodes.map((node, i) => (
                <CapacitorNode key={node.year} node={node} state={stateOf(i)} />
              ))}
            </svg>

            {/* Labels (HTML, crisp at any size) */}
            {nodes.map((node, i) => {
              const m = milestones[i];
              const state = stateOf(i);
              const padY = BUS_Y + (node.upper ? -140 : 140);
              return (
                <button
                  key={m.year}
                  type="button"
                  {...hoverHandlers(i)}
                  aria-current={state === "active" ? "step" : undefined}
                  aria-label={`${m.year}: ${m.tagline}`}
                  className={`absolute block w-[220px] -translate-x-1/2 cursor-default px-2 text-center [@media(max-height:820px)]:w-[190px] ${
                    node.upper ? "-translate-y-full pb-5" : "pt-5"
                  }`}
                  style={{ left: `${(node.x / VB_W) * 100}%`, top: `${(padY / VB_H) * 100}%` }}
                >
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-500 ${
                      state === "active" ? "text-[#58C7E8]" : "text-[#557386]"
                    }`}
                  >
                    M/{pad(i + 1)}
                    {m.tag ? ` · ${m.tag}` : ""}
                  </span>
                  <span
                    className={`mt-1.5 block font-light leading-none tracking-[-0.04em] transition-all duration-500 ${
                      state === "active"
                        ? "text-[46px] text-white [@media(max-height:820px)]:text-[36px]"
                        : state === "done"
                          ? "text-[32px] text-[#B5C7D1] [@media(max-height:820px)]:text-[26px]"
                          : "text-[32px] text-[#4E6B7D] [@media(max-height:820px)]:text-[26px]"
                    }`}
                    style={{ transitionTimingFunction: ease }}
                  >
                    {m.year}
                  </span>
                  <span
                    className={`mt-2 block text-[13px] leading-[1.35] transition-colors duration-500 ${
                      state === "active" ? "text-white" : state === "done" ? "text-[#8FA6B3]" : "text-[#4E6B7D]"
                    }`}
                  >
                    {m.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop footer */}
        <div className="relative mx-auto hidden w-full max-w-[1800px] items-center justify-between border-t border-white/10 pt-4 lg:flex">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#6E8A9A]">
            Milestone {pad(activeIndex + 1)} / {pad(count)} · {milestones[activeIndex].year}
          </span>
          <div className="flex gap-2">
            {milestones.map((m, idx) => (
              <button
                key={m.year}
                type="button"
                {...hoverHandlers(idx)}
                aria-label={`Show ${m.year}`}
                className={`h-2 cursor-default rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-8 bg-[#58C7E8]" : idx < activeIndex ? "w-2 bg-[#58C7E8]/45" : "w-2 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---------- Mobile / tablet: vertical circuit ---------- */}
        <ol className="relative mt-12 lg:hidden">
          <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-[#58C7E8]/60" />
          {milestones.map((m, i) => (
            <li key={m.year} className="relative flex gap-5 pb-9 last:pb-0">
              <span aria-hidden="true" className="relative z-10 mt-1 flex h-6 w-6 shrink-0 flex-col items-center justify-center gap-[3px] bg-[#0B1722]">
                <span className="block h-[2px] w-4 bg-[#58C7E8]" />
                <span className="block h-[2px] w-4 bg-[#58C7E8]" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#58C7E8]">
                  M/{pad(i + 1)}
                  {m.tag ? ` · ${m.tag}` : ""}
                </p>
                <p className="mt-1 text-[34px] font-light leading-none tracking-[-0.04em] text-white">{m.year}</p>
                <p className="mt-2 text-[15px] leading-[1.4] text-[#A9BCC7]">{m.tagline}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
