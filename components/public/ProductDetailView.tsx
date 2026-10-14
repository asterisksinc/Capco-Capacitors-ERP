"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PublicNav } from "@/components/public/PublicChrome";
import { type PublicProduct, publicProducts } from "@/lib/publicProducts";

const includedItems = [
  "Vaccum Sealed",
  "Heavy Edge",
  "Precisely Slitted",
  "Superior Quality",
  "Customizable",
];

const defaultSpecs: [string, string][] = [
  ["Type", "Standard / Customised"],
  ["Thickness", "3.5 - 14 Micron"],
  ["Film Width", "25, 30, 37.5, 45, 50, 60, 75, 100 mm"],
  ["Roll OD", "Up to 350mm"],
  ["Core ID", "75 mm"],
  ["Surface Resistivity", "6-9 OHMS / Square"],
  ["Free Margin", "1.5 - 1.8 mm"],
];

const manufacturingPhases = [
  {
    phase: "PHASE 01",
    category: "Raw Material",
    step: "01 / 05",
    title: "Film Procurement",
    description: "Sourced from certified BOPP suppliers with strict dielectric strength tolerances.",
    nextPreview: "Enclosure, P",
  },
  {
    phase: "PHASE 02",
    category: "Vacuum Metallization",
    step: "02 / 05",
    title: "Leybold Alloy Deposition",
    description: "In-house zinc-aluminium alloy vapor deposition with controlled heavy-edge resistivity profiles.",
    nextPreview: "Precision Sl",
  },
  {
    phase: "PHASE 03",
    category: "Micro-Slitting",
    step: "03 / 05",
    title: "High-Speed Precision Slitting",
    description: "Automated tension-controlled slitting across 25 mm to 100 mm widths with burr-free margins.",
    nextPreview: "Element Wind",
  },
  {
    phase: "PHASE 04",
    category: "Winding & Spraying",
    step: "04 / 05",
    title: "Automated Element Winding",
    description: "Swiss Metar winding and Schoopage metal spraying for low dissipation factor and long life.",
    nextPreview: "HV Dielectric",
  },
  {
    phase: "PHASE 05",
    category: "Quality Assurance",
    step: "05 / 05",
    title: "100% Dielectric & BIS Testing",
    description: "Self-healing clearing tests, capacitance verification, and vacuum-sealed moisture packaging.",
    nextPreview: "Film Procure",
  },
];

const locations = [
  {
    name: "Bell Junction",
    type: "Operating site",
    detail: "West Texas · ERCOT",
    body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Capco from first dispatch.",
    x: 30,
    y: 32.5,
    icon: "6261e.svg",
  },
  {
    name: "Cedar Bayou",
    type: "Operating site",
    detail: "Site location",
    body: "Explore the operating network and contact our team for more information.",
    x: 42,
    y: 40.5,
    icon: "a1758.svg",
  },
  {
    name: "Marfa Flats",
    type: "Operating site",
    detail: "Site location",
    body: "Standalone storage on a constrained node, cycling twice daily against congestion.",
    x: 22,
    y: 43.2,
    icon: "a1758.svg",
  },
  {
    name: "Salt Fork",
    type: "Operating site",
    detail: "Site location",
    body: "First fleet site to complete a full augmentation cycle with no measured capacity shortfall.",
    x: 36,
    y: 28,
    icon: "a1758.svg",
  },
  {
    name: "Dallas HQ",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    x: 52,
    y: 34,
    icon: "8200f.svg",
  },
  {
    name: "Austin",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    x: 47,
    y: 47.2,
    icon: "8200f.svg",
  },
  {
    name: "Rotterdam",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 66,
    y: 24.5,
    icon: "ab167.svg",
  },
  {
    name: "Adelaide",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 82,
    y: 43.2,
    icon: "ab167.svg",
  },
  {
    name: "Santiago",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 62,
    y: 54,
    icon: "ab167.svg",
  },
];

const journeySteps = [
  {
    title: "Technical Consultation",
    body: "Share your specifications, application requirements, and target pricing. Our engineers will recommend optimal solutions.",
    image: "/figma/products/journey-building.png",
  },
  {
    title: "Prototype & Validation",
    body: "Receive samples for testing and validation. We'll iterate based on your feedback until performance matches your expectations.",
    image: "/figma/products/journey-building.png",
  },
  {
    title: "Production & Delivery",
    body: "Finalize commercial terms, sign supply agreement, and begin regular deliveries with JIT or bulk shipment options.",
    image: "/figma/products/journey-building.png",
  },
];

type ProductDetailViewProps = {
  product: PublicProduct;
  previous: PublicProduct;
  next: PublicProduct;
};

export function ProductDetailView({ product, previous, next }: ProductDetailViewProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);
  const [activeLocation, setActiveLocation] = useState(0);

  const totalPages = 4;
  const visibleProducts = [0, 1, 2].map(
    (offset) => publicProducts[(carouselPage * 3 + offset) % publicProducts.length]
  );

  const phaseData = manufacturingPhases[activePhase];
  const location = locations[activeLocation];

  const isBoppFilm = product.slug === "zinc-aluminium-alloy-metalised-bopp-film";
  const displayCategory = isBoppFilm
    ? "Metalized Polypropylene Film (MPP)"
    : product.category;

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. Top Navigation Bar */}
      <PublicNav logoSrc="/figma/solutions/caef4.png" />

      {/* 2. Product Hero Header & Prev/Next Controls */}
      <section className="px-6 pb-16 pt-10 lg:min-h-[527px] lg:px-[60px] lg:pb-[128px] lg:pt-[74px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.02em] text-[#666666]">
            <Link href={`/products/${previous.slug}`} className="transition hover:text-[#020202]">
              Previous Product
            </Link>
            <Link href={`/products/${next.slug}`} className="transition hover:text-[#020202]">
              Next Product
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              href={`/products/${previous.slug}`}
              aria-label={`Previous product: ${previous.title}`}
              className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
            >
              <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" className="rotate-180" />
            </Link>
            <Link
              href={`/products/${next.slug}`}
              aria-label={`Next product: ${next.title}`}
              className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
            >
              <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" />
            </Link>
          </div>

          <div className="mx-auto mt-6 max-w-[920px] text-center lg:mt-[10px]">
            <p className="inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[-0.02em] text-[#121212]">
              <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
              {displayCategory}
            </p>
            <h1 className="mt-5 text-[40px] font-normal leading-[1.03] tracking-[-0.04em] text-[#020202] sm:text-[56px] lg:text-[72px]">
              {isBoppFilm ? (
                <>
                  Zinc/ Aluminium Alloy
                  <br />
                  Metalised BOPP Film
                </>
              ) : (
                product.title
              )}
            </h1>
          </div>
        </div>
      </section>

      {/* 3. 2x2 Bordered Specification Grid */}
      <section className="border-y border-[#E7E7E7]">
        <div className="mx-auto max-w-[1920px]">
          {/* Top Row */}
          <div className="grid border-b border-[#E7E7E7] lg:grid-cols-2">
            {/* Top-Left Cell */}
            <div className="flex flex-col justify-between border-b border-[#E7E7E7] p-6 lg:min-h-[481px] lg:border-b-0 lg:border-r lg:p-[24px]">
              <h2 className="text-[20px] font-normal leading-[1.2] tracking-[-0.03em] text-[#020202] lg:text-[22px]">
                Premium-Grade Metallized Dielectric Film
              </h2>
              <p className="mt-16 max-w-[345px] text-[14px] leading-[1.38] tracking-[-0.02em] text-[#404040] lg:mt-0">
                {isBoppFilm
                  ? "In-house Leybold-metallized BOPP film engineered for self-healing, high-voltage capacitor applications with superior volumetric efficiency."
                  : `${product.summary} Engineered with in-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications with superior volumetric efficiency.`}
              </p>
            </div>

            {/* Top-Right Cell */}
            <div className="p-6 lg:min-h-[481px] lg:p-[24px]">
              <h2 className="text-[20px] font-normal leading-[1.2] tracking-[-0.03em] text-[#020202] lg:text-[22px]">
                Engineered for Reliability
              </h2>
              <div className="relative mx-auto mt-10 aspect-[759/280] w-full max-w-[759px] lg:mt-[76px]">
                <Image
                  src="/figma/products/bopp-tech-drawing.png"
                  alt="Technical BOPP film roll diagram"
                  fill
                  sizes="(min-width: 1024px) 759px, 92vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2">
            {/* Bottom-Left Cell: What's included */}
            <div className="border-b border-[#E7E7E7] p-6 lg:min-h-[347px] lg:border-b-0 lg:border-r lg:p-[24px]">
              <h2 className="text-[20px] font-normal leading-[1.2] tracking-[-0.03em] text-[#020202] lg:text-[22px]">
                What&apos;s included
              </h2>
              <div className="mt-6 flex flex-col items-start gap-[10px]">
                {includedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[16px] py-[9px] text-[13px] font-normal leading-none tracking-[-0.02em] text-[#121212]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom-Right Cell: Specs */}
            <div className="p-6 lg:min-h-[347px] lg:p-[24px]">
              <h2 className="text-[20px] font-normal leading-[1.2] tracking-[-0.03em] text-[#020202] lg:text-[22px]">
                Specs
              </h2>
              <div className="mt-5">
                {defaultSpecs.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-[#E7E7E7] py-[10.5px] text-[13px] leading-[1.2] tracking-[-0.02em] last:border-b-0"
                  >
                    <span className="text-[#121212]">{label}</span>
                    <span className="text-right text-[#595959]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted By + Ruler Tick Scale + Interactive Phase Timeline */}
      <section className=" pb-16 pt-20 lg:pb-[120px] lg:pt-[138px]">
        <div className="mx-auto max-w-[1920px]">
          {/* Trusted By Pill */}
          <div className="px-6 text-center">
            <p className="inline-flex max-w-full items-center justify-center rounded-full bg-[#F5F5F5] px-5 py-2.5 font-mono text-[10px] uppercase leading-[1.35] tracking-[0.06em] text-[#595959]">
              TRUSTED BY LEADING CAPACITOR MANUFACTURERS ACROSS INDIA, MIDDLE EAST &amp; SOUTHEAST ASIA
            </p>
          </div>

          {/* Partner Logos Row */}
          <div className="mx-auto mt-10 max-w-[1800px] overflow-x-auto px-6 scrollbar-none lg:mt-[52px] lg:px-0">
            <div className="min-w-[960px]">
              <Image
                src="/figma/products/trusted-logos-strip.png"
                alt="Trusted capacitor manufacturers"
                width={1800}
                height={42}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* Horizontal Ruler Tick Scale with Center Pointer */}
          <div className="mx-auto mt-5 max-w-[1800px] px-6 lg:mt-[24px] lg:px-[24px]" aria-hidden="true">
            <div className="relative flex items-start justify-between">
              {Array.from({ length: 55 }, (_, i) => {
                const isCenter = i === 27;
                const isMajor = i % 5 === 2;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <span
                      className={
                        isCenter
                          ? "h-[15px] w-[1.5px] bg-[#121212]"
                          : isMajor
                            ? "h-[13px] w-[1px] bg-[#8C8C8C]"
                            : "h-[6px] w-[1px] bg-[#D6D6D6]"
                      }
                    />
                    {isCenter && (
                      <span className="mt-[2px] h-0 w-0 border-b-[5px] border-l-[3.5px] border-r-[3.5px] border-b-[#121212] border-l-transparent border-r-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Phase Timeline */}
          <div className="mt-24 lg:mt-[510px]">
            {/* Phase Header */}
            <div className="px-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#121212]">
                {phaseData.phase}
              </p>
              <p className="mt-1 font-mono text-[12px] text-[#595959]">{phaseData.category}</p>
            </div>

            {/* Timeline Axis */}
            <div className="relative mx-auto mt-3 max-w-[1800px] px-6 lg:px-[60px]">
              {/* Center Blue Square + Vertical Green Indicator Line */}
              <div
                className="pointer-events-none mx-auto flex flex-col items-center"
                aria-hidden="true"
              >
                <span className="h-[5px] w-[5px] bg-[#4D65FF]" />
                <span className="h-[140px] w-[1px] bg-gradient-to-b from-[#00E05C] via-[#00E05C]/65 to-transparent" />
              </div>

              {/* Horizontal Axis Line at y=58px from top of indicator */}
              <div className="relative -mt-[82px] border-t border-[#DFDFDF]">
                {/* Right-half ticks and numbered phase buttons (01 at 50%, 02 at 68.5%, 03 at 87%) */}
                <div className="relative h-[44px] w-full">
                  {/* Small downward ticks along right half */}
                  <div
                    className="pointer-events-none absolute inset-x-1/2 top-0 right-0 hidden justify-between sm:flex"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 19 }, (_, idx) => (
                      <span key={idx} className="h-[5px] w-[1px] bg-[#DFDFDF]" />
                    ))}
                  </div>

                  {/* Phase 01 (Center) */}
                  <button
                    type="button"
                    onClick={() => setActivePhase(0)}
                    className={`absolute left-1/2 top-[16px] -translate-x-1/2 cursor-pointer font-mono text-[11px] transition ${
                      activePhase === 0 ? "font-semibold text-[#121212]" : "text-[#595959] hover:text-[#121212]"
                    }`}
                  >
                    01
                  </button>

                  {/* Phase 02 */}
                  <button
                    type="button"
                    onClick={() => setActivePhase(1)}
                    className={`absolute left-[68.5%] top-0 -translate-x-1/2 cursor-pointer font-mono text-[11px] transition ${
                      activePhase === 1 ? "font-semibold text-[#121212]" : "text-[#595959] hover:text-[#121212]"
                    }`}
                  >
                    <span className="mx-auto -mt-[24px] mb-[16px] block h-[24px] w-[1px] bg-[#DFDFDF]" />
                    02
                  </button>

                  {/* Phase 03 */}
                  <button
                    type="button"
                    onClick={() => setActivePhase(2)}
                    className={`absolute left-[87%] top-0 -translate-x-1/2 cursor-pointer font-mono text-[11px] transition ${
                      activePhase === 2 ? "font-semibold text-[#121212]" : "text-[#595959] hover:text-[#121212]"
                    }`}
                  >
                    <span className="mx-auto -mt-[24px] mb-[16px] block h-[24px] w-[1px] bg-[#DFDFDF]" />
                    03
                  </button>
                </div>
              </div>
            </div>

            {/* L-Bracket Framed Phase Callout Card */}
            <div className="relative mx-auto mt-16 max-w-[1800px] px-6 lg:mt-[96px] lg:px-[60px]">
              <div className="relative mx-auto flex min-h-[220px] max-w-[1334px] flex-col items-center justify-start px-6 pt-3 pb-10 text-center lg:min-h-[248px]">
                {/* 4 Corner L-Brackets */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-[10px] w-[10px] border-l border-t border-[#767676]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-0 h-[10px] w-[10px] border-r border-t border-[#767676]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-0 h-[10px] w-[10px] border-b border-l border-[#767676]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 right-0 h-[10px] w-[10px] border-b border-r border-[#767676]"
                />

                <p className="font-mono text-[11px] tracking-[0.08em] text-[#595959]">
                  {phaseData.step}
                </p>
                <h3 className="mt-3 text-[24px] font-normal tracking-[-0.03em] text-[#121212] lg:text-[28px]">
                  {phaseData.title}
                </h3>
                <p className="mt-3 max-w-[520px] text-[13px] leading-[1.45] tracking-[-0.01em] text-[#595959]">
                  {phaseData.description}
                </p>
              </div>

              {/* Faded Next Phase Preview on Right */}
              <button
                type="button"
                onClick={() => setActivePhase((prev) => (prev + 1) % manufacturingPhases.length)}
                className="absolute right-[60px] top-[70px] hidden cursor-pointer text-[13px] tracking-[-0.01em] text-[#C8C8C8] transition hover:text-[#595959] xl:block"
              >
                {phaseData.nextPreview}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-Column Partner Strip */}
      <section aria-label="Partner network" className="border-y border-[#E7E7E7]">
        <div className="mx-auto grid max-w-[1920px] grid-cols-2 sm:grid-cols-3 lg:min-h-[218px] lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, idx) => (
            <div
              key={idx}
              className="flex min-h-[110px] items-center justify-center border-b border-r border-[#E7E7E7] px-6 py-6 last:border-r-0 lg:min-h-[218px] lg:border-b-0"
            >
              <img
                src="/figma/solutions/bc3ed.svg"
                alt="Logoipsum partner"
                className="h-auto max-w-[140px] lg:max-w-[162px]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6. "Explore our full range of capacitors." 3-Card Product Section */}
      <section className="px-6 pb-20 pt-16 lg:px-[60px] lg:pb-[160px] lg:pt-[122px]">
        <div className="mx-auto max-w-[1800px]">
          {/* Section Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[-0.02em] text-[#121212]">
                <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
                Complete Capacitors Solutions
              </p>
              <h2 className="mt-5 text-[36px] font-normal leading-[1.02] tracking-[-0.04em] text-[#020202] sm:text-[48px] lg:mt-6 lg:text-[56px]">
                Explore our full
                <br />
                range of capacitors.
              </h2>
            </div>

            <div className="flex flex-col items-start justify-between self-stretch sm:items-end">
              <span className="font-mono text-[10px] text-[#666666]" aria-live="polite">
                {String(carouselPage + 1).padStart(2, "0")}/{String(totalPages).padStart(2, "0")}
              </span>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  aria-label="Previous capacitor range page"
                  onClick={() => setCarouselPage((prev) => (prev + totalPages - 1) % totalPages)}
                  className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
                >
                  <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" className="rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next capacitor range page"
                  onClick={() => setCarouselPage((prev) => (prev + 1) % totalPages)}
                  className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
                >
                  <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* 3-Column Product Cards */}
          <div className="mt-10 grid gap-x-[9px] gap-y-12 md:grid-cols-2 lg:mt-[44px] lg:grid-cols-3">
            {visibleProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group block"
              >
                <div className="relative aspect-[594/675] w-full overflow-hidden bg-[#F1F1F1]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 94vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-[18px]">
                  <p className="flex flex-wrap items-center gap-2.5 text-[11px] tracking-[-0.01em] text-[#121212]">
                    <span className="font-medium">{item.date}</span>
                    <span>•</span>
                    <span>
                      Posted by <span className="text-[#999999]">{item.author}</span>
                    </span>
                  </p>
                  <h3 className="mt-3 text-[18px] font-medium leading-[1.25] tracking-[-0.02em] text-[#020202]">
                    {item.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center rounded-[4px] bg-[#F4F4F4] px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-[#404040]">
                    {item.tagLabel ?? item.category.toUpperCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Global Footprint — "Where We Operate" Interactive Map */}
      <section
        aria-label="Global footprint"
        className="relative h-[570px] w-full overflow-hidden bg-[#9E9E9E] text-white lg:h-[800px]"
      >
        <Image
          src="/figma/solutions/caf7c.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className=" absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.62) 0%, rgba(10,10,10,0.12) 30%, rgba(10,10,10,0) 48%), linear-gradient(0deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 22%), #9E9E9E",
          }}
        />

        {/* Map Heading */}
        <div className="relative pt-[60px] text-center lg:pt-[100px]">
          <p className="inline-flex items-center justify-center gap-2 text-[13px] font-medium tracking-[-0.02em] text-white">
            <span className="h-[4px] w-[4px] bg-[#00E05C]" />
            Global Footprint
          </p>
          <h2 className="mt-5 text-[34px] font-normal leading-none tracking-[-0.04em] lg:mt-6 lg:text-[48px]">
            Where We Operate
          </h2>
        </div>

        {/* Interactive Map Markers */}
        {locations.map((item, idx) => (
          <button
            type="button"
            key={item.name}
            style={{ left: `${item.x}%`, top: `${item.y + 23.5}%` }}
            aria-label={item.name}
            aria-pressed={activeLocation === idx}
            onClick={() => setActiveLocation(idx)}
            className="absolute z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-transparent"
          >
            {activeLocation === idx && (
              <span className="pointer-events-none absolute inset-[5px] rounded-full border border-[#00E05C]/55" />
            )}
            <img src={`/figma/solutions/${item.icon}`} alt="" aria-hidden="true" />
          </button>
        ))}

        {/* Active Site Popup Card */}
        <div
          aria-live="polite"
          style={{
            left: `${Math.min(location.x + 1.35, 70)}%`,
            top: `${Math.max(location.y + 1.5, 22)}%`,
            backgroundImage: 'url("/figma/solutions/f9fe0.svg")',
          }}
          className="absolute z-10 w-[230px] rounded-[12px] border border-white/10 bg-[#101010]/45 bg-cover bg-center p-[18px] backdrop-blur-md sm:w-[300px] sm:p-[22px]"
        >
          <small className="block font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#B5B5B5]">
            {location.type}
          </small>
          <h3 className="mt-2 text-[14px] font-medium text-white">{location.name}</h3>
          <span className="text-[13px] text-[#B5B5B5]">{location.detail}</span>
          <p className="mt-3 border-t border-white/15 pt-3 text-[12.3px] leading-[1.4] text-white/75">
            {location.body}
          </p>
        </div>

        {/* Bottom Map Legend */}
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.06em] text-white/75 sm:text-[9.5px] lg:inset-x-[56px]">
          <div className="flex flex-wrap items-center gap-3 sm:gap-[18px]">
            {[
              ["501a6.svg", "Operating site"],
              ["e1fc2.svg", "Office"],
              ["3e93b.svg", "In development"],
            ].map(([icon, label]) => (
              <span key={label} className="inline-flex items-center gap-[7px]">
                <img src={`/figma/solutions/${icon}`} alt="" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          <span>{String(activeLocation + 1).padStart(2, "0")}/09</span>
        </div>
      </section>

      {/* 8. Ready to Partner? — "Start Your OEM Journey with Capco Capacitors" */}
      <section className="bg-[#121212] px-6 py-16 text-white lg:px-[60px] lg:py-[160px]">
        <div className="mx-auto max-w-[1800px]">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[-0.02em] text-white">
            <span className="h-[5px] w-[5px] bg-[#4D65FF]" />
            Ready to Partner?
          </p>
          <h2 className="mt-6 text-[36px] font-normal leading-[1.02] tracking-[-0.05em] text-white sm:text-[52px] lg:mt-[32px] lg:text-[72px]">
            Start Your OEM Journey
            <br />
            with Capco Capacitors
          </h2>

          {/* 3 Rounded Image Cards */}
          <div className="mt-12 grid gap-x-[9px] gap-y-10 md:grid-cols-3 lg:mt-[80px]">
            {journeySteps.map((card) => (
              <article key={card.title}>
                <div className="relative aspect-[594/600] w-full overflow-hidden rounded-[24px] lg:rounded-[32px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 768px) 31vw, 94vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-6 text-[14px] font-medium leading-[1.2] text-white">
                  {card.title}
                </h3>
                <p className="mt-3.5 max-w-[400px] text-[12px] leading-[1.35] text-white/72">
                  {card.body}
                </p>
              </article>
            ))}
          </div>

          {/* Bottom-Left Schedule Technical Consultation Clipped White Button */}
          <div className="mt-12 lg:mt-[64px]">
            <Link
              href="/contact#oem-solutions"
              style={{
                backgroundImage: 'url("/figma/solutions/9a91f.svg")',
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
              className="inline-flex min-h-[64px] w-[301px] max-w-full items-end justify-between px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95 lg:min-h-[80px]"
            >
              <span>Schedule Technical Consultation</span>
              <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
