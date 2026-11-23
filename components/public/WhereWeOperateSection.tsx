"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type MapLocation = {
  name: string;
  type: string;
  detail: string;
  body: string;
  /** Pin icon file in /figma/solutions (operating site / office / in development). */
  icon: string;
  /** "texas" locations are shown in the Texas inset; everything else sits on the world map. */
  region: "world" | "texas";
  /** Pin position as a percentage of the world map image. */
  world: { x: number; y: number };
  /** Pin position as a percentage of the Texas inset image (Texas locations only). */
  texas?: { x: number; y: number };
};

export type TexasInset = {
  /** Where the single Texas marker sits on the world map (percent). */
  cluster: { x: number; y: number };
  src: string;
  aspect: string;
};

/**
 * Original "Where We Operate" locations, now placed at their real-world positions.
 * `world` / `texas` are percentages of /figma/solutions/oem-map/world-operate.svg (Natural Earth
 * projection, 1200x531) and texas-operate.svg (Mercator, 600x573). Regenerate both maps and these
 * numbers together if locations change. Bell Junction and Salt Fork are placed in their described areas.
 */
const oemLocations: readonly MapLocation[] = [
  {
    name: "Bell Junction",
    type: "Operating site",
    detail: "West Texas · ERCOT",
    body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.",
    icon: "6261e.svg",
    region: "texas",
    world: { x: 22.7, y: 35.1 },
    texas: { x: 36.4, y: 47.5 },
  },
  {
    name: "Cedar Bayou",
    type: "Operating site",
    detail: "Site location",
    body: "Explore the operating network and contact our team for more information.",
    icon: "a1758.svg",
    region: "texas",
    world: { x: 24.4, y: 36.5 },
    texas: { x: 86.6, y: 63.6 },
  },
  {
    name: "Marfa Flats",
    type: "Operating site",
    detail: "Site location",
    body: "Standalone storage on a constrained node, cycling twice daily against congestion.",
    icon: "a1758.svg",
    region: "texas",
    world: { x: 22, y: 36 },
    texas: { x: 22, y: 58.7 },
  },
  {
    name: "Salt Fork",
    type: "Operating site",
    detail: "Site location",
    body: "First fleet site to complete a full augmentation cycle with no measured capacity shortfall.",
    icon: "a1758.svg",
    region: "texas",
    world: { x: 23.3, y: 33.9 },
    texas: { x: 48.5, y: 33.4 },
  },
  {
    name: "Dallas HQ",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    icon: "8200f.svg",
    region: "texas",
    world: { x: 24.2, y: 34.2 },
    texas: { x: 73.3, y: 37.2 },
  },
  {
    name: "Austin",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    icon: "8200f.svg",
    region: "texas",
    world: { x: 23.7, y: 36.1 },
    texas: { x: 66.7, y: 59.1 },
  },
  {
    name: "Rotterdam",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    icon: "ab167.svg",
    region: "world",
    world: { x: 51.1, y: 20.3 },
  },
  {
    name: "Adelaide",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    icon: "ab167.svg",
    region: "world",
    world: { x: 86.7, y: 84.2 },
  },
  {
    name: "Santiago",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    icon: "ab167.svg",
    region: "world",
    world: { x: 31.2, y: 83.1 },
  },
] as const;

/** OEM/Dealership Texas inset; the cluster marker is the centre of the six Texas sites on the world map. */
const oemTexasInset: TexasInset = {
  cluster: { x: 23.4, y: 35.3 },
  src: "/figma/solutions/oem-map/texas-operate.svg",
  aspect: "600/573",
};

type WhereWeOperateSectionProps = {
  locations?: readonly MapLocation[];
  /** World map image; pin `world` coordinates are percentages of this image. */
  mapSrc?: string;
  /** Aspect ratio of mapSrc, e.g. "1200/531". */
  mapAspect?: string;
  /** Texas inset, or null when no location is in Texas. */
  texasInset?: TexasInset | null;
};

/**
 * "Where We Operate" section: world map + details card, with an optional Texas inset that appears
 * only while a Texas location is selected. Defaults are the OEM / Dealership locations.
 */
export function WhereWeOperateSection({
  locations = oemLocations,
  mapSrc = "/figma/solutions/oem-map/world-operate.svg",
  mapAspect = "1200/531",
  texasInset = oemTexasInset,
}: WhereWeOperateSectionProps = {}) {
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const activeLocation = locations[activeLocationIndex];
  const texasCount = locations.filter((l) => l.region === "texas").length;
  const hasTexas = Boolean(texasInset) && texasCount > 0;
  const isTexasActive = hasTexas && activeLocation.region === "texas";
  const TEXAS_CLUSTER = texasInset?.cluster ?? { x: 0, y: 0 };

  return (
    <section className="bg-gradient-to-b from-[#6D6D6D] to-[#424242] px-6 py-20 text-white lg:px-[60px] lg:py-28">
      <div className="mx-auto max-w-[1800px]">
        {/* Eyebrow & Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-white">
            <span className="h-[6px] w-[6px] bg-[#00E05C]" />
            Global Footprint
          </div>
          <h2 className="mt-4 text-[42px] font-normal leading-[1.0] tracking-[-2px] text-white sm:text-[52px] lg:text-[60px]">
            Where We Operate
          </h2>
        </div>

        <div className="mt-12 grid gap-4 rounded-[24px] bg-black/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 lg:p-8">
          {/* World map */}
          <div className="relative min-w-0 lg:self-center">
            <div className="relative w-full" style={{ aspectRatio: mapAspect }}>
              <img
                src={mapSrc}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
              />

              {/* Texas cluster marker */}
              {hasTexas && (
              <button
                type="button"
                onClick={() => {
                  if (activeLocation.region !== "texas")
                    setActiveLocationIndex(Math.max(0, locations.findIndex((l) => l.region === "texas")));
                }}
                style={{ left: `${TEXAS_CLUSTER.x}%`, top: `${TEXAS_CLUSTER.y}%` }}
                aria-label={`Texas network: ${texasCount} sites`}
                aria-pressed={activeLocation.region === "texas"}
                className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-[scale] duration-300 ease-out ${
                  activeLocation.region === "texas" ? "scale-110" : "hover:scale-110"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors duration-300 sm:h-9 sm:w-9 sm:text-[13px] ${
                    activeLocation.region === "texas"
                      ? "border-[#58C7E8] bg-[#58C7E8] text-[#020202]"
                      : "border-white/70 bg-black/50 text-white group-hover:border-[#58C7E8]"
                  }`}
                >
                  {texasCount}
                </span>
                {activeLocation.region === "texas" && (
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#58C7E8]/30" />
                )}
              </button>
              )}

              {/* Locations outside Texas */}
              {locations.map((loc, idx) =>
                !(hasTexas && loc.region === "texas") ? (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => setActiveLocationIndex(idx)}
                    style={{ left: `${loc.world.x}%`, top: `${loc.world.y}%` }}
                    aria-pressed={activeLocationIndex === idx}
                    aria-label={`View ${loc.name}`}
                    className={`absolute grid -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center p-1.5 transition-[scale,opacity] duration-300 ease-out ${
                      activeLocationIndex === idx ? "z-20 scale-125" : "z-10 opacity-80 hover:scale-110 hover:opacity-100"
                    }`}
                  >
                    <img src={`/figma/solutions/${loc.icon}`} alt="" aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />
                    {activeLocationIndex === idx && (
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#58C7E8]/30" />
                    )}
                  </button>
                ) : null
              )}

              {/* Name label next to the active world pin */}
              <div
                aria-hidden="true"
                style={{
                  left: `${isTexasActive ? TEXAS_CLUSTER.x : activeLocation.world.x}%`,
                  top: `${isTexasActive ? TEXAS_CLUSTER.y : activeLocation.world.y}%`,
                }}
                className="pointer-events-none absolute z-30 hidden -translate-x-1/2 translate-y-[22px] whitespace-nowrap rounded-full bg-black/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white transition-[left,top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block"
              >
                {isTexasActive ? "Texas network" : activeLocation.name}
              </div>
            </div>
          </div>

          {/* Side column: Texas inset (only while a Texas site is selected) + details */}
          <div className={`flex min-w-0 flex-col lg:justify-center ${hasTexas ? "lg:min-h-[560px]" : "lg:self-center"}`}>
            {hasTexas && texasInset && (
            <div
              inert={!isTexasActive}
              aria-hidden={!isTexasActive}
              className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isTexasActive
                  ? "mb-4 grid-rows-[1fr] opacity-100"
                  : "mb-0 grid-rows-[0fr] opacity-0"
              }`}
            >
            <div className="min-h-0 overflow-hidden">
            <div className="rounded-[18px] border border-[#58C7E8]/60 bg-black/30 p-4">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-white/60">
                <span>Texas network</span>
                <span>{texasCount} sites</span>
              </div>
              <div
                className="relative mx-auto mt-2 w-full max-w-[230px] sm:max-w-[300px]"
                style={{ aspectRatio: texasInset.aspect }}
              >
                <img
                  src={texasInset.src}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full select-none"
                />
                {locations.map((loc, idx) =>
                  loc.region === "texas" && loc.texas ? (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setActiveLocationIndex(idx)}
                      style={{ left: `${loc.texas.x}%`, top: `${loc.texas.y}%` }}
                      aria-pressed={activeLocationIndex === idx}
                      aria-label={`View ${loc.name}`}
                      title={loc.name}
                      className={`absolute grid -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center p-1 transition-[scale,opacity] duration-300 ease-out ${
                        activeLocationIndex === idx ? "z-20 scale-125" : "z-10 opacity-80 hover:scale-110 hover:opacity-100"
                      }`}
                    >
                      <img src={`/figma/solutions/${loc.icon}`} alt="" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                      {activeLocationIndex === idx && (
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#58C7E8]/30" />
                      )}
                    </button>
                  ) : null
                )}
              </div>
            </div>
            </div>
            </div>
            )}

            <div
              key={activeLocation.name}
              className="oem-location-card rounded-[18px] border border-white/20 bg-black/60 p-5 backdrop-blur-md"
              aria-live="polite"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/60">{activeLocation.type}</span>
              <h4 className="mt-1 text-[18px] font-semibold text-white">{activeLocation.name}</h4>
              <p className="mt-0.5 text-[12px] text-[#58C7E8]">{activeLocation.detail}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/80">{activeLocation.body}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 border-t border-white/20 pt-4 text-[13px] text-white/80 lg:col-span-2">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <span className="text-[16px] leading-none">+</span> OPERATING SITE
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" /> OFFICE
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-white" /> IN DEVELOPMENT
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveLocationIndex((i) => (i + locations.length - 1) % locations.length)}
                aria-label="Previous location"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#020202]"
              >
                <ArrowLeft size={15} />
              </button>
              <span className="font-mono text-[13px] tabular-nums">
                {String(activeLocationIndex + 1).padStart(2, "0")}/{String(locations.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setActiveLocationIndex((i) => (i + 1) % locations.length)}
                aria-label="Next location"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#020202]"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
