"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";

export type MapLocation = {
  name: string;
  /** Small label above the name in the detail card (region, or site type). */
  region: string;
  detail: string;
  /** Optional longer description under the detail line. */
  body?: string;
  lat: number;
  lon: number;
  /** When set, the pin and card link here (home / product pages link to regional solutions). */
  href?: string;
  /** Texas sites share one "Texas network" pin and are picked from the Texas inset. */
  texas?: { x: number; y: number };
};

/**
 * The dot map is equirectangular: lon -180..180, lat 75..-56, 1200x437
 * (/figma/home/world-dot-map.svg). Regenerate both together if the extent changes.
 */
const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * 100,
  y: ((75 - lat) / (75 - -56)) * 100,
});

/** Export markets (home page and product pages). */
export const exportMarkets: readonly MapLocation[] = [
  { name: "UAE", region: "Middle East", detail: "Dubai & Abu Dhabi · Motor Run and PFC Capacitors", lat: 24.4, lon: 54.4, href: "/regions/uae" },
  { name: "USA", region: "North America", detail: "UL-certified Motor Run and PFC Capacitors", lat: 39, lon: -98, href: "/regions/usa" },
  { name: "Sri Lanka", region: "South Asia", detail: "Submersible Panel and Fan Capacitors", lat: 7.9, lon: 80.8, href: "/regions/sri-lanka" },
  { name: "Bangladesh", region: "South Asia", detail: "Motor Start and Fan Capacitors", lat: 23.7, lon: 90.4, href: "/regions/bangladesh" },
  { name: "Turkey", region: "Middle East", detail: "Lighting and Motor Run Capacitors", lat: 39, lon: 35, href: "/regions/turkey" },
  { name: "African Continent", region: "Africa", detail: "PFC Capacitors and Capacitor Banks", lat: 4, lon: 21, href: "/regions/africa" },
  { name: "Egypt", region: "Middle East", detail: "PFC and Motor Run Capacitors", lat: 26.8, lon: 30.8, href: "/regions/egypt" },
];

/**
 * OEM / Dealership operating network (the original nine locations at their real positions).
 * `texas` = percent position on /figma/solutions/oem-map/texas-operate.svg (600x573).
 */
const operatingNetwork: readonly MapLocation[] = [
  { name: "Bell Junction", region: "Operating site", detail: "West Texas · ERCOT", body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.", lat: 31.9, lon: -102.3, texas: { x: 36.4, y: 47.5 } },
  { name: "Cedar Bayou", region: "Operating site", detail: "Site location", body: "Explore the operating network and contact our team for more information.", lat: 29.75, lon: -94.93, texas: { x: 86.6, y: 63.6 } },
  { name: "Marfa Flats", region: "Operating site", detail: "Site location", body: "Standalone storage on a constrained node, cycling twice daily against congestion.", lat: 30.31, lon: -104.02, texas: { x: 22, y: 58.7 } },
  { name: "Salt Fork", region: "Operating site", detail: "Site location", body: "First fleet site to complete a full augmentation cycle with no measured capacity shortfall.", lat: 33.2, lon: -100.0, texas: { x: 48.5, y: 33.4 } },
  { name: "Dallas HQ", region: "Office", detail: "Office location", body: "Contact the team for information about this location.", lat: 32.78, lon: -96.8, texas: { x: 73.3, y: 37.2 } },
  { name: "Austin", region: "Office", detail: "Office location", body: "Contact the team for information about this location.", lat: 30.27, lon: -97.74, texas: { x: 66.7, y: 59.1 } },
  { name: "Rotterdam", region: "In development", detail: "Development location", body: "Contact the team for information about this location.", lat: 51.92, lon: 4.48 },
  { name: "Adelaide", region: "In development", detail: "Development location", body: "Contact the team for information about this location.", lat: -34.93, lon: 138.6 },
  { name: "Santiago", region: "In development", detail: "Development location", body: "Contact the team for information about this location.", lat: -33.45, lon: -70.67 },
];

type WhereWeOperateSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  locations?: readonly MapLocation[];
};

/**
 * "Where We Operate" — the home page map: dotted world map with pulsing pins, a floating detail
 * card and a row of location chips. Locations with a `texas` position collapse into one
 * "Texas network" pin and open a Texas inset. Defaults are the OEM / Dealership network.
 */
export function WhereWeOperateSection({
  id = "global-footprint",
  eyebrow = "Global Footprint",
  title = "Where We Operate",
  locations = operatingNetwork,
}: WhereWeOperateSectionProps = {}) {
  const [active, setActive] = useState(0);
  const current = locations[active];

  const texasSites = locations.filter((l) => l.texas);
  const texasActive = Boolean(current.texas);
  const firstTexas = locations.findIndex((l) => l.texas);
  const texasPin = texasSites.length
    ? project(
        texasSites.reduce((s, l) => s + l.lat, 0) / texasSites.length,
        texasSites.reduce((s, l) => s + l.lon, 0) / texasSites.length,
      )
    : null;

  const pinInner = (label: string) => (
    <>
      <span className="world-map-pulse absolute inset-1 rounded-full bg-[#58C7E8]" aria-hidden="true" />
      <span className="world-map-dot relative block h-3 w-3 rounded-full border-2 border-[#0B1722] bg-[#58C7E8] lg:h-3.5 lg:w-3.5" aria-hidden="true" />
      <span className="world-map-label pointer-events-none absolute bottom-full mb-1.5 whitespace-nowrap rounded bg-white px-2 py-1 text-[12px] font-medium text-[#020202]">
        {label}
      </span>
    </>
  );
  const pinClass = (isActive: boolean) =>
    `world-map-pin absolute z-20 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center ${isActive ? "is-active" : ""}`;

  return (
    <section id={id} aria-label="Global footprint" className="relative overflow-hidden bg-[#0A0A0A] px-6 py-20 text-white lg:px-[60px] lg:py-[100px]">
      <div className="mx-auto max-w-[1800px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-[14px] font-medium uppercase tracking-normal text-white">
            <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
            {eyebrow}
          </div>
          <h2 className="type-h2 mt-5 font-normal">{title}</h2>
        </div>

        <div className="world-map relative mt-12 overflow-hidden rounded-[20px] bg-[#0B1722] px-4 pb-6 pt-8 text-white sm:px-8 lg:px-12 lg:pb-10 lg:pt-14">
          <div className="relative mx-auto aspect-[1200/437] w-full max-w-[1500px]">
            <img src="/figma/home/world-dot-map.svg?v=2" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full select-none" draggable={false} />

            {texasPin && (
              <button
                type="button"
                style={{ left: `${texasPin.x}%`, top: `${texasPin.y}%` }}
                onClick={() => !texasActive && setActive(firstTexas)}
                onMouseEnter={() => !texasActive && setActive(firstTexas)}
                aria-pressed={texasActive}
                aria-label={`Texas network: ${texasSites.length} sites`}
                className={pinClass(texasActive)}
              >
                {pinInner(`Texas network · ${texasSites.length} sites`)}
              </button>
            )}

            {locations.map((loc, index) => {
              if (loc.texas) return null;
              const { x, y } = project(loc.lat, loc.lon);
              const props = {
                style: { left: `${x}%`, top: `${y}%` },
                onMouseEnter: () => setActive(index),
                onFocus: () => setActive(index),
                className: pinClass(active === index),
              };
              return loc.href ? (
                <Link key={loc.name} href={loc.href} aria-label={`View ${loc.name} regional solutions`} {...props}>
                  {pinInner(loc.name)}
                </Link>
              ) : (
                <button key={loc.name} type="button" onClick={() => setActive(index)} aria-pressed={active === index} aria-label={`View ${loc.name}`} {...props}>
                  {pinInner(loc.name)}
                </button>
              );
            })}
          </div>

          {/* Texas inset: opens while a Texas site is selected (top-right on desktop, over empty map) */}
          {texasSites.length > 0 && (
            <div
              inert={!texasActive}
              aria-hidden={!texasActive}
              className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:absolute lg:right-12 lg:top-14 lg:z-30 lg:mt-0 lg:w-[280px] ${
                texasActive ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.16em] text-[#58C7E8]">
                    <span>Texas network</span>
                    <span className="text-white/60">{texasSites.length} sites</span>
                  </div>
                  <div className="relative mx-auto mt-3 aspect-[600/573] w-full max-w-[240px]">
                    <img src="/figma/solutions/oem-map/texas-operate.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full select-none" />
                    {locations.map((loc, index) =>
                      loc.texas ? (
                        <button
                          key={loc.name}
                          type="button"
                          style={{ left: `${loc.texas.x}%`, top: `${loc.texas.y}%` }}
                          onClick={() => setActive(index)}
                          onMouseEnter={() => setActive(index)}
                          aria-pressed={active === index}
                          aria-label={`View ${loc.name}`}
                          className={`${pinClass(active === index)} h-7 w-7`}
                        >
                          {pinInner(loc.name)}
                        </button>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="relative mt-6 lg:absolute lg:bottom-20 lg:left-12 lg:z-30 lg:mt-0 lg:w-[300px]">
            <div key={current.name} className="map-card-swap rounded-xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md" aria-live="polite">
              <p className="type-caption uppercase tracking-[0.16em] text-[#58C7E8]">{current.region}</p>
              <h3 className="type-h3 mt-2">{current.name}</h3>
              <p className="type-small mt-3 leading-6 text-white/75">{current.detail}</p>
              {current.body && <p className="type-small mt-2 leading-6 text-white/60">{current.body}</p>}
              {current.href && (
                <Link href={current.href} className="mt-4 inline-block text-sm font-medium !text-[#58C7E8]">View regional solutions →</Link>
              )}
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] uppercase tracking-wider lg:mt-8">
            {locations.map((loc, index) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className={`inline-flex items-center gap-2 transition-colors ${active === index ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                <span className="h-2 w-2 rounded-full bg-[#58C7E8]" />
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
