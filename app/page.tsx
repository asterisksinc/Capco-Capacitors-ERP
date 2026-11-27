"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import HomeHero from "@/components/public/HomeHero";
import HomeMotion from "@/components/public/HomeMotion";
import ClientTicker from "@/components/public/ClientTicker";
import CrossFade from "@/components/public/CrossFade";
import {
  PublicFaqSection,
  ReadyToSpecifyCapcoSection,
} from "@/components/public/PublicChrome";
import { SiteFooter } from "@/components/public/SiteFooter";

const productLinks = [
  "/products?category=Metalized%20Polypropylene%20Film%20%5B%20MPP%20%5D", "/products?category=Fan%20Capacitors",
  "/products?category=Power%20Factor%20Capacitors", "/products?category=Luminaire%20Capacitor",
  "/products?category=Luminaire%20Capacitor", "/contact?category=oem#enquiry-form",
];

/** Card images come from the shared product catalogue so Home and /products stay in sync. */
const products = [
  ["BOPP Substrate", "CAT: MPP-01", "Metalized Polypropylene Film (MPP)", "In-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications.", "THICKNESS: 3.5-14 Micron", "VOLTAGE: Up to 4000V AC", "Explore MPP Film"],
  ["IS:2993 Certified", "CAT: MOT-RUN", "Fan & Motor Capacitors", "Motor run, motor start, fan, and submersible panel capacitors for HVAC, pumps, and appliances.", "RANGE: 0.5-432 MFD", "VOLTAGE: 400-440V AC", "Explore Fan & Motor"],
  ["IS:13340 Heavy Duty", "CAT: PFC-CELL", "Power Factor Correction (PFC)", "Cylindrical, box type, and capacitor banks up to 150 KVAR for industrial APFC panels.", "RANGE: 0.5-25 KVAR/Cell", "VOLTAGE: 415-440V AC", "Explore PFC Capacitors"],
  ["IS:1569 Standard", "CAT: LUM-RES", "Luminaire Capacitors", "Lighting capacitors with inbuilt discharge resistors for street lights and industrial luminaires.", "CAPACITANCE: 1-45 MFD", "RATED V: 230-250V AC", "Explore Lighting Capacitors"],
  ["High Frequency", "CAT: UV-CUR", "UV Lamp Capacitors", "High-frequency capacitors for UV curing systems in printing, coating, and industrial manufacturing.", "TUNING: Custom Build", "VOLTAGE: Up to 4000V AC", "Explore UV Capacitors"],
  ["OEM Co-Engineering", "CAT: CUST-ENG", "Customized Capacitors", "Co-engineered capacitors tailored to your electrical, thermal, and mechanical requirements.", "DIMENSIONS: Per Specification", "TERMINALS: Custom Pins/Tags", "Request Custom Solution"],
];

type IndustrySolution = {
  tab: string;
  sector: string;
  title: string;
  body: string;
  tags: readonly string[];
  cta: string;
  href: string;
  specHeading: string;
  specBody?: string;
  specs: readonly string[];
  metaLeft: readonly [string, string];
  metaRight: readonly [string, string];
};

const industries: readonly IndustrySolution[] = [
  {
    tab: "HVAC & Refrigeration",
    sector: "SYSTEM SECTOR: 01",
    title: "HVAC & Commercial Refrigeration Systems",
    body: "Motor run capacitors (0.5–100 MFD), P2 safety-equipped AC capacitors, and custom dual-capacitance configurations for compressors and fan motors.",
    tags: ["Motor Run Capacitors", "P2 AC Capacitors", "Custom Solutions"],
    cta: "Explore HVAC Solutions",
    href: "/products/motor-run-capacitor",
    specHeading: "P2 Safety Disconnector",
    specBody: "In-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications.",
    specs: [
      "Operating Class: Class B (10,000h)",
      "Thermal Range: -25°C to +85°C",
      "Voltage Rating: 440V / 500V AC",
      "Dielectric: Self-healing MPP Film",
    ],
    metaLeft: ["APPROVAL:", "BIS / IEC 60252-1"],
    metaRight: ["STATUS:", "IN-STOCK"],
  },
  {
    tab: "Water Pumps & Agriculture",
    sector: "SYSTEM SECTOR: 02",
    title: "Water Pumps & Agricultural Drive Panels",
    body: "Submersible panel capacitors (10–120 MFD), motor start capacitors (40–500 MFD), and heat-resistant designs for borewell and agricultural pumps.",
    tags: ["Submersible Capacitors", "Motor Start Capacitors"],
    cta: "Explore Pump Solutions",
    href: "/products/submersible-panel-capacitor",
    specHeading: "Fluctuation Tolerant",
    specs: [
      "Capacity: 10 to 120 MFD",
      "Surge Tolerance: Up to 550V AC",
      "Enclosure: Flame-retardant Plastic/Alum",
      "Standard: IS:2993 Certified",
    ],
    metaLeft: ["APPROVAL:", "BIS / ISI"],
    metaRight: ["STATUS:", "PAN-INDIA JIT"],
  },
  {
    tab: "Home Appliances",
    sector: "SYSTEM SECTOR: 03",
    title: "Home Appliances & Consumer Electronics",
    body: "P2 burst-proof capacitors for washing machines, refrigerators, and ACs with inbuilt discharge resistors and IEC 60252-1 compliance.",
    tags: ["Appliance Capacitors", "P2 Safety Technology"],
    cta: "Explore Appliance Solutions",
    href: "/products/ac-refrigeration-washing-machine-capacitor",
    specHeading: "IEC Compliant",
    specs: [
      "Life Expectancy: 30,000 Operating Hours",
      "Loss Factor: tan δ ≤ 0.002 at 50Hz",
      "Terminations: Faston 6.3mm or Wire Leads",
      "Resistor: Inbuilt Bleeder Resistor",
    ],
    metaLeft: ["APPROVAL:", "CE / RoHS / BIS"],
    metaRight: ["OEM BATCHES:", "READY"],
  },
  {
    tab: "Industrial Manufacturing",
    sector: "SYSTEM SECTOR: 04",
    title: "Industrial Power Factor Correction & APFC Panels",
    body: "Cylindrical PFC capacitors (0.5–25 KVAR), capacitor banks (up to 150 KVAR), and APFC panel integration support for power factor correction.",
    tags: ["PFC Cylindrical Cells", "APFC Capacitor Banks"],
    cta: "Explore PFC Solutions",
    href: "/products/pfc-cylindrical-capacitor",
    specHeading: "Heavy Duty IS:13340",
    specs: [
      "Rating: 0.5 to 25 KVAR / Cell",
      "Bank Capacity: Up to 150 KVAR",
      "Inrush Current: Up to 200x Rated IN",
      "Standard: IS:13340 & IEC 60831-1/2",
    ],
    metaLeft: ["APPROVAL:", "IS:13340 / BIS"],
    metaRight: ["DUTY:", "CONTINUOUS 24/7"],
  },
  {
    tab: "Lighting & Infrastructure",
    sector: "SYSTEM SECTOR: 05",
    title: "Lighting & Municipal Infrastructure",
    body: "Lighting capacitors (1–45 MFD) with inbuilt discharge resistors, UV lamp capacitors (up to 4000V), and Smart City-compliant solutions.",
    tags: ["Luminaire Capacitors", "UV Lamp Capacitors"],
    cta: "Explore Lighting Solutions",
    href: "/products/lighting-luminaire-capacitor",
    specHeading: "IS:1569 Standard",
    specs: [
      "Capacitance: 1 to 45 MFD",
      "Rated Voltage: 230V to 440V AC (50/60Hz)",
      "Safety: Integrated Discharge Resistor",
      "Standard: IS:1569 & EN 61048",
    ],
    metaLeft: ["APPROVAL:", "IS:1569 / CE"],
    metaRight: ["LIFE:", "30,000+ HOURS"],
  },
  {
    tab: "Export Markets",
    sector: "SYSTEM SECTOR: 06",
    title: "Global OEM & Distributor Export Programs",
    body: "CE-marked capacitors, export documentation support, and regional compliance guidance for equipment destined for Middle East and Southeast Asia.",
    tags: ["CE & RoHS Certified", "Container-Load Supply"],
    cta: "Explore Export Solutions",
    href: "/contact?category=export#enquiry-form",
    specHeading: "Export Compliant",
    specs: [
      "Footprint: 15+ Countries Worldwide",
      "Compliance: CE, RoHS, UL 810 & GSO",
      "Documentation: COO, NABL & Test Reports",
      "Dispatch: FOB / CIF Container Loads",
    ],
    metaLeft: ["APPROVAL:", "CE / UL / GSO"],
    metaRight: ["STATUS:", "EXPORT READY"],
  },
] as const;

const whyFeatures = [
  ["In-House Metallization & Winding", "Leybold (Germany) BOPP film metallization + Metar (Switzerland) automatic winding = Better pricing, faster delivery, zero supply disruptions.", "Learn About Our Technology"],
  ["BIS, ISO & CE Certified", "Every product meets IS:2993, IS:13340, IEC 60252-1 standards—qualified for government tenders, OEM specs, and export markets.", "View Certifications"],
  ["5,000+ Authorized Dealers, JIT Delivery", "From Hyderabad to Guwahati, our dealer network ensures local availability, technical support, and just-in-time replenishment for OEMs.", "Find a Dealer Near You"],
];

const certifications = [
  {
    title: "BIS ISI",
    sub1: "IS:1709 / IS:1569",
    sub2: "IS:2993 / IS:13340",
    icon: "/figma/home/64137.svg",
  },
  {
    title: "ISO 9001",
    sub1: "2008 Standards",
    sub2: "Quality Management",
    icon: "/figma/home/bbeba.svg",
  },
  {
    title: "CE MARK",
    sub1: "European Conformity",
    sub2: "Low Voltage Directive",
    icon: "/figma/home/40e25.svg",
  },
  {
    title: "IEC 60252-1",
    sub1: "AC Motor Capacitors",
    sub2: "General Safety Rules",
    icon: "/figma/home/3f482.svg",
  },
  {
    title: "IEC 60831",
    sub1: "Power Capacitors",
    sub2: "Self-Healing Shunt",
    icon: "/figma/home/3f482.svg",
  },
] as const;

const manufacturingSteps = [
  {
    num: "01",
    image: "/figma/home/process/step-01-raw-film.jpg",
    imageAlt: "Rolls of BOPP capacitor film",
    imagePosition: "50% 50%",
    title: "Raw Film Procurement",
    subtitle: "Certified BOPP Film",
    body: "Sourced from trusted suppliers with strict dielectric strength tolerances (>600 V/micron).",
  },
  {
    num: "02",
    image: "/figma/home/process/step-02-metallization.jpg",
    imageAlt: "Leybold vacuum metallization chamber",
    imagePosition: "50% 50%",
    title: "In-House Metallization",
    subtitle: "In-House Alloy Deposition",
    body: "Zinc/Aluminium layers vacuum-deposited via Leybold (Germany) for uniform surface resistivity (6–9 Ω/sq).",
  },
  {
    num: "03",
    image: "/figma/home/process/step-03-winding.jpg",
    imageAlt: "Metar automatic winding line",
    imagePosition: "50% 50%",
    title: "Metar Automatic Winding",
    subtitle: "Precision Non-Inductive Winding",
    body: "Metar (Switzerland) high-speed winding ensures <±5% capacitance tolerance and minimal internal losses.",
  },
  {
    num: "04",
    image: "/figma/home/process/step-04-encapsulation.jpg",
    imageAlt: "Automated capacitor encapsulation and packing line",
    imagePosition: "50% 50%",
    title: "Encapsulation & Safety",
    subtitle: "Dry & Oil Encapsulation",
    body: "Resin- or oil-filled housing with application-specific P2 over-pressure disconnectors for thermal and electrical stress protection.",
  },
  {
    num: "05",
    image: "/figma/home/process/step-05-testing.jpg",
    imageAlt: "In-house capacitor testing laboratory",
    imagePosition: "50% 50%",
    title: "Testing & Quality Check",
    subtitle: "BIS-Certified Batch Release",
    body: "100% tested for capacitance, voltage endurance, and insulation resistance before vacuum-sealed packaging.",
  },
] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal ${light ? "text-white" : "text-[#020202]"}`}>
      <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
      {children}
    </div>
  );
}

function ButtonLink({ children, href = "/contact", light = false, muted = false, download = false }: {
  children: React.ReactNode; href?: string; light?: boolean; muted?: boolean; download?: boolean;
}) {
  return (
    <a href={href} download={download || undefined} className={`home-button ${light ? "home-button--light" : ""} ${muted ? "home-button--muted" : ""}`}>
      <span>{children}</span>
      <img src={download ? "/figma/solutions/4e858.svg" : "/figma/solutions/a9bc9.svg"} alt="" />
    </a>
  );
}

export default function Home() {
  const [industryIndex, setIndustryIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[industryIndex];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [industryIndex]);

  const activeProcess = manufacturingSteps[processIndex];

  return (
    <main className="home-page min-h-screen bg-white text-[#020202]">
      <HomeMotion />
      <HomeHero />

      <section className="grid border-b border-[#e4e4e4] bg-[#f5f5f5] md:grid-cols-3">
        {[["32+ Years", "In Manufacturing"], ["5,000+", "Authorized Dealers"], ["15+", "Export Countries"]].map(([value, label]) => (
          <div key={label} className="flex min-h-[124px] flex-col items-center justify-center border-[#e4e4e4] py-8 md:min-h-[200px] md:border-r">
            <strong className="text-[30px] font-normal leading-none tracking-[-0.03em] md:text-[40px]">{value}</strong>
            <span className="mt-3 text-[15px] text-[#595959] md:text-base">{label}</span>
          </div>
        ))}
      </section>

      <ClientTicker />

      <section id="why" className="px-6 py-20 lg:min-h-[334px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,680fr)_minmax(0,612fr)]">
            <div>
              <Eyebrow>Why CAPCO?</Eyebrow>
              <h2 className="type-h2 mt-6 font-normal">Engineered for Reliability, Backed by Compliance</h2>
            </div>
            <p className="type-lead self-center text-[#595959] lg:justify-self-end lg:max-w-[520px]">
              Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Why choose CAPCO" className="px-6 lg:px-[60px]">
        <div className="mx-auto max-w-[1800px] border-b border-[#e4e4e4]">
          {whyFeatures.map(([featureTitle, featureBody, cta], index) => (
            <article className="feature-row" key={featureTitle}>
              <div className="feature-image overflow-hidden">
                <Image src={['/figma/home/why/why-01-metallization.jpg', '/figma/home/why/why-02-certified.jpg', '/figma/home/why/why-03-distribution.jpg'][index]} alt={['Metallized BOPP film roll beside a vacuum metallization chamber', 'BIS, ISO 9001:2015 and CE certifications with CAPCO capacitors', 'CAPCO capacitors loaded for pan-India dealer distribution'][index]} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>
              <div className="feature-copy">
                <div><img src="/figma/home/85f0e.svg" alt="" /><h3>{featureTitle}</h3></div>
                <p>{featureBody}</p>
                <ButtonLink muted href={['/about#manufacturing-line', '/gallery?filter=certifications', '/solutions/dealership'][index]}>{cta}</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="solutions" className="bg-white px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Complete Capacitor Solutions</Eyebrow>
              <h2 className="type-h2 mt-6 font-normal">Browse by Product Category</h2>
            </div>
            <ButtonLink href="/catalogs/capco-product-catalog.pdf" download>Download Complete Catalog (PDF)</ButtonLink>
          </div>
          <div className="mt-[60px] grid gap-[42px] md:grid-cols-2 xl:grid-cols-3">
            {products.map(([badge, code, productTitle, productBody, specA, specB, cta], index) => (
              <article key={productTitle} className="product-card group flex min-h-[389px] flex-col justify-between gap-9 bg-[#f5f5f5] p-8">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="product-badge bg-white px-3 py-2 text-sm">{badge}</span>
                    <span className="text-sm font-medium text-[#58c7e8]">{code}</span>
                  </div>
                  <h3 className="type-h3 mt-8 font-medium">{productTitle}</h3>
                  <p className="type-body mt-4 text-[#595959]">{productBody}</p>
                </div>
                <div>
                  <div className="mb-9 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span>{specA}</span>
                    <span>{specB}</span>
                  </div>
                  <ButtonLink light href={productLinks[index]}>{cta}</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="bg-[#F4F4F4] px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <Eyebrow>Application-Specific Expertise</Eyebrow>
          <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
            Capacitor Solutions by Industry
          </h2>

          {/* 6-Tab Selector Bar */}
          <div className="mt-10 overflow-x-auto border-b border-[#DBDBDB] lg:mt-[56px]">
            <div className="relative flex min-w-[980px] items-center justify-between">
              {industries.map((industry, index) => {
                const isActive = industryIndex === index;
                return (
                  <button
                    key={industry.tab}
                    ref={(el) => { tabRefs.current[index] = el; }}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setIndustryIndex(index)}
                    className={`industry-tab relative cursor-pointer px-4 pb-5 pt-2 text-center text-[16px] lg:text-[18px] ${
                      isActive
                        ? "text-[#020202]"
                        : "text-[#595959] hover:text-[#020202]"
                    }`}
                  >
                    {industry.tab}
                  </button>
                );
              })}
              <span
                aria-hidden="true"
                className="industry-indicator pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[#020202]"
                style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
              />
            </div>
          </div>

          {/* Main Clipped White Card */}
          <div
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 76px), calc(100% - 76px) 100%, 0 100%)",
            }}
            className="mt-8 grid items-center gap-10 bg-white p-8 sm:p-10 lg:mt-[42px] lg:min-h-[540px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:p-[60px]"
          >
            {/* Left Column: Sector Copy, Clipped Tag Pills & CTA Button */}
            <CrossFade
              items={industries}
              activeIndex={industryIndex}
              className="h-full"
              slideClassName="flex h-full flex-col justify-between"
              render={(ind) => (
                <>
              <div>
                <p className="type-small font-medium uppercase tracking-normal text-[#58C7E8]">
                  {ind.sector}
                </p>
                <h3 className="type-h3-lg mt-3 font-normal text-[#020202]">
                  {ind.title}
                </h3>
                <p className="type-lead mt-6 max-w-[780px] text-[#595959]">
                  {ind.body}
                </p>

                {/* 2 Clipped Grey Tag Pills */}
                <div className="mt-7 flex flex-wrap gap-3">
                  {ind.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                      }}
                      className="inline-flex h-[40px] items-center bg-[#F4F4F4] px-4 text-[14px] font-normal text-[#020202]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom-Left Clipped Cyan CTA Button */}
              <div className="mt-10 lg:mt-12">
                <Link
                  href={ind.href}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[228px] items-end justify-between gap-6 bg-[#58C7E8] px-3.5 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  <span>{ind.cta}</span>
                  <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
                </Link>
              </div>
                </>
              )}
            />

            {/* Right Column: Clipped Light Cyan Key Specifications Box */}
            <CrossFade
              items={industries}
              activeIndex={industryIndex}
              className="h-full"
              render={(ind) => (
            <aside
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 62px), calc(100% - 62px) 100%, 0 100%)",
              }}
              className="flex h-full min-h-[380px] flex-col justify-between bg-[#DFF4FC] p-7 sm:p-9 lg:min-h-[416px] lg:p-10"
            >
              <div>
                <p className="type-caption font-normal text-[#595959]">Key Specifications</p>
                <h4 className="type-h4 mt-1.5 font-medium text-[#020202]">
                  {ind.specHeading}
                </h4>
                {ind.specBody && <p className="type-small mt-4 leading-[1.4] text-[#595959]">{ind.specBody}</p>}

                <ul className="mt-6 space-y-3.5 text-[14px] leading-[1.35] text-[#020202]">
                  {ind.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <span className="mt-[2px] text-[#020202]">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="my-7 h-px w-full bg-[#BCEAF8]" />
                <div className="flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.02em]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[#595959]">{ind.metaLeft[0]}</span>
                    <strong className="font-semibold text-[#020202]">
                      {ind.metaLeft[1]}
                    </strong>
                  </span>
                  <span className="h-3.5 w-px bg-[#BCEAF8]" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[#595959]">{ind.metaRight[0]}</span>
                    <strong className="font-semibold text-[#020202]">
                      {ind.metaRight[1]}
                    </strong>
                  </span>
                </div>
              </div>
            </aside>
              )}
            />
          </div>
        </div>
      </section>

      <section id="process" aria-label="Manufacturing process" className="bg-white px-6 py-24 lg:min-h-[600px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <Eyebrow>End-to-End Control</Eyebrow>
          <h2 className="type-h2 mt-5 max-w-[760px] font-normal lg:mt-6">
            From Raw Film to Final Capacitor
          </h2>
          <p className="type-lead mt-5 max-w-[820px] text-[#595959]">
            CAPCO&apos;s vertically integrated manufacturing ensures complete quality control, cost efficiency, and supply chain reliability—from BOPP film procurement to final testing.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-[0.95fr_1fr] lg:mt-[60px]">
          <div className="flex flex-col gap-6">
            <CrossFade
              items={manufacturingSteps}
              activeIndex={processIndex}
              className="w-full"
              render={(step) => (
                <figure
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
                  }}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F4F4]"
                >
                  {step.image ? (
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      loading="lazy"
                      style={{ objectPosition: step.imagePosition }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full" aria-hidden="true" />
                  )}
                  <figcaption className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white/90 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em] text-[#020202] backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 bg-[#58C7E8]" />
                    Step {step.num} · {step.title}
                  </figcaption>
                </figure>
              )}
            />
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#595959]" aria-live="polite">
                {activeProcess.num}/05
              </span>
              <button
                type="button"
                aria-label="Previous process step"
                onClick={() =>
                  setProcessIndex(
                    (prev) => (prev + manufacturingSteps.length - 1) % manufacturingSteps.length
                  )
                }
                className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
              >
                <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next process step"
                onClick={() => setProcessIndex((prev) => (prev + 1) % manufacturingSteps.length)}
                className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
              >
                <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="border-l border-[#E4E4E4] pl-8 lg:pl-12">
            <CrossFade
              items={manufacturingSteps}
              activeIndex={processIndex}
              render={(step) => (
                <>
            <div className="product-badge flex h-16 w-16 items-center justify-center bg-[#F4F4F4] text-2xl font-normal text-[#595959]">
              {step.num}
            </div>
            <h3 className="type-h3-lg mt-6 font-normal text-[#020202]">
              {step.title}
            </h3>
            <p className="type-lead mt-3 font-medium text-[#58C7E8]">{step.subtitle}</p>
            <p className="type-lead mt-7 max-w-2xl text-[#595959]">
              {step.body}
            </p>
            <div className="mt-9">
              <Link
                href="/about#facilities"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                }}
                className="inline-flex min-h-[56px] w-full max-w-[300px] items-end justify-between gap-4 bg-[#58C7E8] px-3.5 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                <span>View Our Manufacturing Facilities</span>
                <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
              </Link>
            </div>
                </>
              )}
            />
          </div>
        </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#EEFAFF] px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <img src="/figma/home/compliance-world-map.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-[8%] -top-[46px] w-[75%] max-w-none" />

        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.02em] text-[#020202]">
                <span className="h-1.5 w-1.5 bg-[#58C7E8]" />
                TRUST THROUGH COMPLIANCE
              </div>
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
                Certified for Quality, Safety &amp; Export
              </h2>
              <p className="type-lead mt-4 max-w-[960px] text-[#595959]">
                All CAPCO capacitors are manufactured under ISO 9001:2008 QMS and comply with BIS, CE, and IEC standards—qualified for Indian government tenders, OEM specifications, and export to Middle East, Africa, and Southeast Asia.
              </p>
            </div>

            <a
              href="/catalogs/capco-product-catalog.pdf"
              download
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] w-full max-w-[320px] shrink-0 items-end justify-between gap-4 bg-[#58C7E8] px-4 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <span>Download Compliance Certificates (PDF)</span>
              <img src="/figma/solutions/4e858.svg" alt="" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-12 rounded-[20px] bg-white px-4 py-10 shadow-[0_14px_44px_rgba(88,199,232,0.14)] lg:mt-[52px] lg:px-6 lg:py-[52px]">
            <div className="grid grid-cols-1 divide-y divide-[#EAEAEA] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-[#EAEAEA]">
              {certifications.map((cert) => (
                <article
                  key={cert.title}
                  className="flex flex-col items-center px-6 py-6 text-center lg:py-2"
                >
                  <div
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
                    }}
                    className="flex h-[80px] w-[80px] items-center justify-center bg-[#EEFAFF]"
                  >
                    <img
                      src={cert.icon}
                      alt={cert.title}
                      className="max-w-none"
                    />
                  </div>
                  <h3 className="type-h3 mt-[42px] font-medium text-[#020202]">
                    {cert.title}
                  </h3>
                  <div className="my-3 h-px w-[80px] bg-[#58c7e8]" />
                  <p className="type-body font-normal text-[#020202]">
                    {cert.sub1}
                  </p>
                  <p className="type-small mt-1.5 font-normal leading-[1.35] text-[#595959]">
                    {cert.sub2}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ReadyToSpecifyCapcoSection />

      <PublicFaqSection />

      <SiteFooter />
    </main>
  );
}

