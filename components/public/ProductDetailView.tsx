"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ClientTicker from "@/components/public/ClientTicker";
import { PublicFaqSection, PublicNav } from "@/components/public/PublicChrome";
import { SiteFooter } from "@/components/public/SiteFooter";
import { type PublicProduct, publicProducts } from "@/lib/publicProducts";
import { productCopy } from "@/lib/productCopy";

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
    name: "UAE",
    type: "Operating site",
    detail: "West Texas · ERCOT",
    body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.",
    x: 30,
    y: 32.5,
    icon: "6261e.svg",
  },
  {
    name: "USA",
    type: "Operating site",
    detail: "New York, Los Angeles, Houston",
    body: "UL-certified Motor Run and PFC Capacitors for North American OEMs.",
    x: 22,
    y: 29,
    icon: "a1758.svg",
  },
  {
    name: "Sri Lanka",
    type: "Operating site",
    detail: "Colombo",
    body: "Submersible Panel and Fan Capacitors for South Asian markets.",
    x: 67,
    y: 58,
    icon: "a1758.svg",
  },
  {
    name: "Bangladesh",
    type: "Operating site",
    detail: "Dhaka & Chittagong",
    body: "Motor Start and Fan Capacitors for Bangladesh OEMs.",
    x: 71,
    y: 43,
    icon: "a1758.svg",
  },
  {
    name: "Turkey",
    type: "Office",
    detail: "Istanbul",
    body: "Lighting and Motor Run Capacitors for Turkey.",
    x: 53,
    y: 27,
    icon: "8200f.svg",
  },
  {
    name: "African Continent",
    type: "Office",
    detail: "Lagos, Mombasa, Dar es Salaam",
    body: "PFC Capacitors and Capacitor Banks across Africa.",
    x: 49,
    y: 57,
    icon: "8200f.svg",
  },
  {
    name: "Egypt",
    type: "In development",
    detail: "Cairo",
    body: "PFC and Motor Run Capacitors for Egypt.",
    x: 54,
    y: 39,
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

const certifications = [
  ["/figma/home/bis-isi.svg", "BIS ISI", "IS:1709 / IS:1569", "IS:2993 / IS:13340"],
  ["/figma/home/iso-9001.svg", "ISO 9001", "2008 Standards", "Quality Management"],
  ["/figma/home/ce-mark.svg", "CE MARK", "European Conformity", "Low Voltage Directive"],
  ["/figma/home/iec-logo.svg", "IEC 60252-1", "AC Motor Capacitors", "General Safety Rules"],
  ["/figma/home/iec-logo.svg", "IEC 60831", "Power Capacitors", "Self-Healing Shunt"],
] as const;

type ProductDetailViewProps = {
  product: PublicProduct;
  previous: PublicProduct;
  next: PublicProduct;
};

export function ProductDetailView({ product, previous, next }: ProductDetailViewProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);
  const [activeLocation, setActiveLocation] = useState(0);
  const phaseScaleRef = useRef<HTMLDivElement>(null);
  const phaseMarkerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const totalPages = 4;
  const visibleProducts = [0, 1, 2].map(
    (offset) => publicProducts[(carouselPage * 3 + offset) % publicProducts.length]
  );

  const copy = productCopy[product.slug];
  const phaseItems = (copy?.phases ?? manufacturingPhases.map((phase) => ({ category: phase.category, title: phase.title, description: phase.description }))).map((phase, index) => ({
    ...phase,
    phase: `PHASE ${String(index + 1).padStart(2, "0")}`,
    step: `${String(index + 1).padStart(2, "0")} / 05`,
    nextPreview: index < 4 ? (copy?.phases[index + 1]?.title ?? manufacturingPhases[index + 1]?.title ?? "") : (copy?.phases[0]?.title ?? "Film Procurement"),
  }));
  const phaseData = phaseItems[activePhase];
  useEffect(() => {
    const container = phaseScaleRef.current;
    const marker = phaseMarkerRefs.current[activePhase];
    if (container && marker) {
      container.scrollTo({ left: Math.max(0, marker.offsetLeft - container.clientWidth / 2), behavior: "smooth" });
    }
  }, [activePhase]);
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

      {/* 4. Trusted By + Client Ticker + Product Showcase + Interactive Phase Timeline */}
      <section className="pb-16 pt-16 lg:pb-[100px] lg:pt-[100px]">
        <div className="mx-auto max-w-[1920px]">
          {/* Trusted By Pill */}
          <div className="px-6 text-center">
            <p className="inline-flex max-w-full items-center justify-center rounded-full bg-[#F5F5F5] px-5 py-2.5 font-mono text-[10px] uppercase leading-[1.35] tracking-[0.06em] text-[#595959]">
              TRUSTED BY LEADING CAPACITOR MANUFACTURERS ACROSS INDIA, MIDDLE EAST &amp; SOUTHEAST ASIA
            </p>
          </div>

          {/* Animated Client Ticker with Integrated Animated Ruler */}
          <div className="mt-6 lg:mt-10">
            <ClientTicker />
          </div>

          {/* Centered Product Visual Showcase */}
          <div className="relative mx-auto my-12 flex aspect-[16/10] w-full max-w-[620px] items-center justify-center px-6 lg:my-16">
            <div className="relative h-full w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 620px, 92vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Interactive Phase Timeline */}
          <div className="mt-8 lg:mt-12">
            {/* Phase Header */}
            <div className="px-6 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#121212]">
                {phaseData.phase}
              </p>
              <p className="mt-1 font-mono text-[12px] text-[#595959]">{phaseData.category}</p>
            </div>

            {/* Scrollable phase scale with the selected marker centered on the green guide */}
            <div ref={phaseScaleRef} onWheel={(event) => { if (phaseScaleRef.current && Math.abs(event.deltaY) > Math.abs(event.deltaX)) { event.preventDefault(); phaseScaleRef.current.scrollBy({ left: event.deltaY, behavior: "smooth" }); } }} className="hide-scrollbar relative mx-auto mt-3 max-w-[1800px] overflow-x-auto overscroll-x-contain px-6 lg:px-[60px]" aria-label="Scrollable phase scale">
              <div className="relative h-[150px] min-w-[1200px] border-t border-[#DFDFDF] lg:min-w-[2200px]">
                <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[140px] w-px -translate-x-1/2 bg-gradient-to-b from-[#00E05C] via-[#00E05C]/65 to-transparent" aria-hidden="true" />
                <span className="pointer-events-none absolute left-1/2 -top-[5px] z-20 h-[7px] w-[7px] -translate-x-1/2 bg-[#4D65FF]" aria-hidden="true" />
                {Array.from({ length: Math.max(phaseItems.length * 6, 6) }, (_, idx) => <span key={idx} className="absolute top-0 h-[7px] w-px bg-[#DFDFDF]" style={{ left: `${(idx / Math.max(phaseItems.length * 6 - 1, 1)) * 100}%` }} aria-hidden="true" />)}
                {phaseItems.map((phase, index) => (
                  <button
                    ref={(node) => { phaseMarkerRefs.current[index] = node; }}
                    type="button"
                    key={phase.step}
                    onClick={() => setActivePhase(index)}
                    style={{ left: `${phaseItems.length === 1 ? 50 : (index / (phaseItems.length - 1)) * 100}%` }}
                    className={`absolute top-[34px] -translate-x-1/2 cursor-pointer font-mono text-[20px] transition ${activePhase === index ? "scale-125 font-semibold text-[#121212]" : "text-[#595959] hover:scale-110 hover:text-[#121212]"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
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

      {/* 5. Product compliance certifications */}
      <section aria-label="Product certifications" className="relative overflow-hidden bg-[#EEFAFF] px-6 py-16 lg:px-[60px] lg:py-[100px]">
        <img src="/figma/home/compliance-world-map.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-[8%] -top-[46px] w-[75%] max-w-none opacity-70" />
        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.02em]"><span className="h-1.5 w-1.5 bg-[#58C7E8]" /> TRUST THROUGH COMPLIANCE</div>
              <h2 className="mt-4 text-[36px] font-normal leading-[1.08] tracking-[-0.04em] sm:text-[42px] lg:text-[48px]">Certified for Quality, Safety &amp; Export</h2>
              <p className="mt-4 max-w-[960px] text-[15px] leading-[1.5] text-[#595959] lg:text-[17px]">Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.</p>
            </div>
            <a href="/catalogs/capco-product-catalog.pdf" download className="inline-flex min-h-[56px] w-full max-w-[320px] shrink-0 items-end justify-between gap-4 bg-[#58C7E8] px-4 pb-3 pt-6 text-[13px] font-medium text-[#020202]">Download Compliance Certificates (PDF)<span aria-hidden="true" className="text-xl">↓</span></a>
          </div>
          <div className="mt-12 rounded-[20px] bg-white px-4 py-8 shadow-[0_14px_44px_rgba(88,199,232,0.14)] lg:mt-[52px] lg:px-6 lg:py-[42px]">
            <div className="grid grid-cols-1 divide-y divide-[#EAEAEA] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-[#EAEAEA]">
              {certifications.map(([icon, title, sub1, sub2]) => <article key={title} className="flex flex-col items-center px-6 py-6 text-center lg:py-2"><div className="flex h-[68px] w-[68px] items-center justify-center bg-[#EEFAFF]"><img src={icon} alt={title} className="max-h-12 max-w-12" /></div><h3 className="mt-8 text-[19px] font-medium">{title}</h3><div className="my-3 h-px w-[64px] bg-[#58C7E8]" /><p className="text-[14px]">{sub1}</p><p className="mt-1 text-[12px] text-[#595959]">{sub2}</p></article>)}
            </div>
          </div>
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
          src="/figma/home/compliance-world-map.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-80 mix-blend-screen"
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
        {locations.slice(0, 7).map((item, idx) => (
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
          <span>{String(activeLocation + 1).padStart(2, "0")}/07</span>
        </div>
      </section>

      {false && <PublicFaqSection
        eyebrow="Technical Clarity"
        title="Frequently Asked Questions"
        items={[
          { q: "What applications is this product suited for?", a: product.summary },
          { q: "Can CAPCO customize specifications for OEM requirements?", a: "Yes. Capacitance, housing, terminals, dimensions, and packaging can be configured to your application and assembly-line requirements." },
          { q: "Do you provide compliance and test certificates?", a: "Every shipment can include applicable BIS, ISO, CE, and IEC documentation with batch-level test results." },
          { q: "What is the typical lead time for bulk orders?", a: "Standard specifications are scheduled for dispatch within 7–15 working days; custom configurations are confirmed with the quotation." },
        ]}
      />}

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
      <PublicFaqSection
        eyebrow="Technical Clarity"
        title="Frequently Asked Questions"
        items={[
          { q: "What applications is this product suited for?", a: product.summary },
          { q: "Can CAPCO customize specifications for OEM requirements?", a: "Yes. Capacitance, housing, terminals, dimensions, and packaging can be configured to your application and assembly-line requirements." },
          { q: "Do you provide compliance and test certificates?", a: "Every shipment can include applicable BIS, ISO, CE, and IEC documentation with batch-level test results." },
          { q: "What is the typical lead time for bulk orders?", a: "Standard specifications are scheduled for dispatch within 7-15 working days; custom configurations are confirmed with the quotation." },
        ]}
      />
      <section id="contact" className="hidden relative grid min-h-[560px] place-items-center overflow-hidden bg-[#121212] px-6 py-24 text-white lg:min-h-[720px] lg:px-[60px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <span className="absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <span className="absolute left-1/2 top-1/2 h-[1500px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
          <div className="absolute left-1/2 top-1/2 h-[636px] w-[636px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/527c0.svg")' }} />
          <div className="absolute left-1/2 top-1/2 h-[856px] w-[856px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat" style={{ backgroundImage: 'url("/figma/solutions/9c1db.svg")' }} />
          <span className="absolute left-[15.9%] top-[18%] hidden h-[10px] w-[10px] border-l border-t border-white/30 lg:block" />
          <span className="absolute right-[15.9%] top-[18%] hidden h-[10px] w-[10px] border-r border-t border-white/30 lg:block" />
          <span className="absolute bottom-[18%] left-[15.9%] hidden h-[10px] w-[10px] border-b border-l border-white/30 lg:block" />
          <span className="absolute bottom-[18%] right-[15.9%] hidden h-[10px] w-[10px] border-b border-r border-white/30 lg:block" />
        </div>
        <div className="relative z-10 mx-auto max-w-[860px] text-center">
          <h2 className="text-[36px] font-normal leading-[1.15] tracking-[-0.05em] text-white sm:text-[42px] lg:text-[48px]">Ready to Partner?</h2>
          <p className="mx-auto mt-6 max-w-[860px] text-[16px] leading-[1.42] tracking-[-0.03em] text-white/90 lg:mt-8 lg:text-[18px]">Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.</p>
          <div className="mt-8"><Link href="/contact?category=oem#enquiry-form" className="inline-flex min-h-[56px] min-w-[200px] items-end justify-between gap-4 bg-[#4E76F5] px-4 pb-3 pt-6 text-[14px] font-semibold leading-[1.2] text-white transition hover:-translate-y-0.5 hover:brightness-105" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}><span>Request OEM Pricing</span><ArrowRight size={16} /></Link></div>
        </div>
      </section>
      <SiteFooter showPartnerCta />
    </main>
  );
}
