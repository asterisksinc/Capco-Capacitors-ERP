"use client";

/* eslint-disable @next/next/no-img-element */
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Download,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PublicFaqSection,
  PublicFooter,
  PublicNav,
  ReadyToSpecifyCapcoSection,
} from "@/components/public/PublicChrome";

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
  specs: readonly string[];
  metaLeft: readonly [string, string];
  metaRight: readonly [string, string];
};

const industries: readonly IndustrySolution[] = [
  {
    tab: "HVAC & Refrigeration",
    sector: "SYSTEM SECTOR: 01",
    title: "HVAC & Commercial Refrigeration Systems",
    body: "Motor run capacitors for AC units, HVAC systems, compressors, and rooftop cooling applications. Engineered with P2 safety disconnector protection and high thermal endurance up to +85°C.",
    tags: ["Motor Run Capacitors", "Compressor Duty"],
    cta: "Explore HVAC Solutions",
    href: "/products/motor-run-capacitor",
    specHeading: "P2 Safety Disconnector",
    specs: [
      "Capacity: 0.5 to 432 MFD",
      "Voltage Rating: 400 to 440V AC",
      "Operating Temp: -25°C to +85°C",
      "Standard: IS:2993 & IEC 60252-1",
    ],
    metaLeft: ["APPROVAL:", "BIS / ISI / CE"],
    metaRight: ["OEM BATCHES:", "JIT READY"],
  },
  {
    tab: "Water Pumps & Agriculture",
    sector: "SYSTEM SECTOR: 02",
    title: "Water Pumps & Agricultural Drive Panels",
    body: "Submersible panel capacitors (10–120 MFD), motor start capacitors (40–500 MFD), and heat-resistant designs for borewell and agricultural pumps. Reinforced burst-proof construction built to handle severe rural grid voltage fluctuations.",
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
    body: "P2 burst-proof capacitors for washing machines, refrigerators, and ACs with inbuilt discharge resistors and IEC 60252-1 compliance. Compact form factors developed specifically for high-density appliance integration.",
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
    body: "Heavy-duty cylindrical PFC cells (0.5–25 KVAR), box-type capacitors, and modular banks up to 150 KVAR for continuous industrial facilities. Self-healing metallized polypropylene construction with overpressure disconnector.",
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
    body: "Precision lighting and high-frequency UV lamp capacitors with integrated discharge resistors for street lights, industrial luminaires, highway corridors, and industrial UV curing lines.",
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
    body: "CE, RoHS, and UL-aligned capacitor programs with complete export documentation, fumigated sea-worthy palletization, and container-load dispatch to 15+ international markets across the Middle East, Africa, South Asia, and North America.",
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
  ["In-House Metallization & Winding", "Leybold Germany BOPP film metallization + Metar Switzerland automatic winding deliver purity, faster delivery, and supply discipline.", "Learn About Our Technology"],
  ["BIS, ISO & CE Certified", "Every product meets IS:2993, IS:13340, ISO 9001 standards and export requirements across OEM, dealers, and project markets.", "View Certificates"],
  ["5,000+ Dealers, JIT Delivery", "From Nashik to Coimbatore, our dealer network ensures local availability, technical support, and just-in-time replenishment.", "Meet Dealer Team"],
];

const certifications = [
  {
    title: "BIS ISI",
    sub1: "IS:1709 / IS:1569",
    sub2: "IS:2993 / IS:13340",
    icon: "/figma/home/bis-isi.svg",
  },
  {
    title: "ISO 9001",
    sub1: "2008 Standards",
    sub2: "Quality Management",
    icon: "/figma/home/iso-9001.svg",
  },
  {
    title: "CE MARK",
    sub1: "European Conformity",
    sub2: "Low Voltage Directive",
    icon: "/figma/home/ce-mark.svg",
  },
  {
    title: "IEC 60252-1",
    sub1: "AC Motor Capacitors",
    sub2: "General Safety Rules",
    icon: "/figma/home/iec-logo.svg",
  },
  {
    title: "IEC 60831",
    sub1: "Power Capacitors",
    sub2: "Self-Healing Shunt",
    icon: "/figma/home/iec-logo.svg",
  },
] as const;

const WORLD_MAP_DOT_ROWS = [
  "........####......####..............########............................",
  "......#######....######.........##################......................",
  "....#########...########.....############################...............",
  "...##########..#########...####################################.........",
  "..###########....#######..########################################......",
  "...#########......#####..##########################################.....",
  "....#######........####.###########################################.....",
  ".....#####..........###.########..################################......",
  "......###............#####...###...##############################.......",
  ".......##............############....############################.......",
  "........##..........##############....##########################........",
  ".........###.......################....########################.........",
  "..........#####....#################.....#####################..........",
  "..........#######..##################.....###################...........",
  "...........########.#################......######...########............",
  "...........#########..###############.......####.....######.###.........",
  "............########...##############........##.......####..####........",
  "............########....############...................##....####.......",
  ".............#######.....##########...........................###.......",
  ".............######.......#########......................########.......",
  "..............#####........#######.....................###########......",
  "..............####.........#######....................#############.....",
  "...............###..........#####.....................#############.....",
  "...............###...........####......................###########......",
  "................##............##........................#########.......",
  "................#.........................................#####.....##..",
] as const;

const manufacturingSteps = [
  {
    num: "01",
    title: "Raw Film Procurement",
    subtitle: "Certified BOPP Film",
    body: "Sourced from trusted suppliers with strict dielectric strength, tolerance, and RoHS controls.",
  },
  {
    num: "02",
    title: "Metallization",
    subtitle: "In-House Alloy Deposition",
    body: "Zinc/Aluminium layers vacuum-deposited via Leybold (Germany) for uniform surface resistivity (6–9 Ω/sq).",
  },
  {
    num: "03",
    title: "Automatic Winding",
    subtitle: "Precision Non-Inductive",
    body: "High-speed fully automatic winding ensures ≤±5% capacitance tolerance and minimal internal losses.",
  },
  {
    num: "04",
    title: "Encapsulation & Safety",
    subtitle: "Dry & Oil Encapsulation",
    body: "Resin- or oil-filled housing with application-specific P2 over-pressure disconnectors for thermal and electrical stress protection.",
  },
  {
    num: "05",
    title: "Testing & Quality Check",
    subtitle: "IEC-Compliant Test Regime",
    body: "100% tested for capacitance, voltage endurance, and insulation resistance before vacuum-sealed packaging.",
  },
] as const;

const projects = [
  ["/figma/project-catalogs-card.png", "Product Catalogs & Spec Sheets", "Downloadable PDFs with electrical specs, BIS certifications, and installation guides.", "Browse Downloads"],
  ["/figma/project-success-card.png", "Success Stories", "OEM and dealer projects with measurable cost, lead-time, and reliability outcomes.", "View Case Studies"],
  ["/figma/project-insights-card.png", "Industry Trends & Best Practices", "Selection guides, PFC notes, and capacitor application insights.", "Read Insights"],
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal ${light ? "text-white" : "text-[#020202]"}`}>
      <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
      {children}
    </div>
  );
}

function ButtonLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href="#contact"
      className={`inline-flex h-14 items-center gap-6 px-4 text-sm font-semibold transition ${
        light
          ? "bg-white !text-[#020202] hover:bg-[#eaf8fc] [&_*]:!text-[#020202] [&_svg]:stroke-[#020202]"
          : "bg-[#58c7e8] text-[#020202] hover:bg-[#41b7d9] [&_svg]:stroke-[#020202]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </a>
  );
}

export default function Home() {
  const [industryIndex, setIndustryIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(0);
  const activeIndustry = industries[industryIndex];
  const activeProcess = manufacturingSteps[processIndex];

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <section className="relative flex min-h-[700px] flex-col justify-between overflow-hidden bg-[#101010] text-white lg:h-screen lg:max-h-screen">
        <Image src="/figma/home/rectangle-1.png" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/65" />
        <PublicNav variant="overlay" className="relative z-20 shrink-0" />
        <div className="relative z-10 mx-auto mt-auto flex w-full max-w-[1920px] flex-col justify-end px-6 pb-16 pt-10 lg:px-[60px] lg:pb-[88px]">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <Eyebrow light>Electrical Systems Built For The Next Century</Eyebrow>
              <h1 className="mt-5 max-w-[780px] text-[44px] font-normal leading-[0.96] tracking-normal sm:text-[64px] lg:text-[84px] xl:text-[100px]">
                India&apos;s Trusted Capacitor Manufacturer
              </h1>
              <div className="mt-7 flex flex-wrap gap-4">
                <ButtonLink>Explore Products</ButtonLink>
                <ButtonLink light>Explore Programs</ButtonLink>
              </div>
            </div>
            <div className="grid gap-6 lg:justify-items-end">
              <p className="max-w-[560px] text-lg leading-[1.45] text-white/85 xl:text-xl">
                BIS-certified motor run, PFC, lighting, and custom capacitors engineered with in-house BOPP metallization, JIT supply, and OEM-ready compliance.
              </p>
              <div className="grid w-full max-w-[660px] gap-3 sm:grid-cols-3">
                {[
                  ["BIS ISI", "Certified"],
                  ["ISO 9001", "Quality Certified"],
                  ["15+ Export", "Markets"],
                ].map(([value, label]) => (
                  <div key={value} className="border border-white/20 bg-black/25 p-4 backdrop-blur">
                    <p className="text-lg font-semibold">{value}</p>
                    <p className="mt-1 text-xs text-white/62">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid border-b border-[#e4e4e4] bg-[#f5f5f5] md:grid-cols-3">
        {[["32+ Years", "In Manufacturing"], ["500+", "Authorized Dealers"], ["15+", "Export Countries"]].map(([value, label]) => (
          <div key={label} className="flex min-h-[156px] flex-col items-center justify-center border-[#e4e4e4] py-10 md:min-h-[296px] md:border-r">
            <strong className="text-4xl font-normal leading-none md:text-[56px]">{value}</strong>
            <span className="mt-4 text-base text-[#595959] md:text-lg">{label}</span>
          </div>
        ))}
      </section>

      <section id="why" className="px-6 py-20 lg:min-h-[334px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-[680px_1fr]">
            <div>
              <Eyebrow>Why CAPCO?</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal leading-tight tracking-normal lg:text-5xl">Engineered for Reliability, Backed by Compliance</h2>
            </div>
            <p className="self-center text-xl leading-[1.45] text-[#595959] lg:justify-self-end lg:max-w-[612px] lg:text-2xl">
              Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:min-h-[1743px] lg:px-[60px] lg:pb-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-2 lg:grid-cols-[1.16fr_0.84fr]">
            <div className="grid gap-2">
              {["/figma/products/product-1.png", "/figma/products/product-5.png", "/figma/project-insights-card.png"].map((image) => (
                <div key={image} className="relative min-h-[330px] overflow-hidden bg-[#e8e8e8] lg:min-h-[505px]">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 58vw, 94vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              {whyFeatures.map(([featureTitle, featureBody, cta], index) => (
                <article key={featureTitle} className="flex min-h-[330px] flex-col justify-between bg-[#f3f3f3] p-8 lg:min-h-[505px] lg:p-12">
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm">{String(index + 1).padStart(2, "0")}</div>
                    <h3 className="mt-8 text-2xl font-medium">{featureTitle}</h3>
                    <p className="mt-5 max-w-[560px] text-base leading-[1.55] text-[#595959]">{featureBody}</p>
                  </div>
                  <ButtonLink>{cta}</ButtonLink>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-white px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Complete Capacitor Solutions</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Browse by Product Category</h2>
            </div>
            <ButtonLink><Download size={16} /> Download Complete Catalog</ButtonLink>
          </div>
          <div className="mt-[60px] grid gap-[42px] md:grid-cols-2 xl:grid-cols-3">
            {products.map(([badge, code, productTitle, productBody, specA, specB, cta]) => (
              <article key={productTitle} className="flex min-h-[389px] flex-col justify-between bg-[#f5f5f5] p-8">
                <div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="bg-white px-3 py-2 text-sm">{badge}</span>
                    <span className="text-sm font-semibold text-[#58c7e8]">{code}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium">{productTitle}</h3>
                  <p className="mt-4 text-base leading-[1.45] text-[#595959]">{productBody}</p>
                </div>
                <div>
                  <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#dcdcdc] pt-5 text-sm">
                    <span>{specA}</span>
                    <span>{specB}</span>
                  </div>
                  <ButtonLink>{cta}</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="bg-[#F4F4F4] px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <Eyebrow>Application-Specific Expertise</Eyebrow>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
            Capacitor Solutions by Industry
          </h2>

          {/* 6-Tab Selector Bar */}
          <div className="mt-10 overflow-x-auto border-b border-[#DBDBDB] lg:mt-[56px]">
            <div className="flex min-w-[980px] items-center justify-between">
              {industries.map((industry, index) => {
                const isActive = industryIndex === index;
                return (
                  <button
                    key={industry.tab}
                    type="button"
                    onClick={() => setIndustryIndex(index)}
                    className={`relative cursor-pointer px-4 pb-5 pt-2 text-center text-[16px] transition lg:text-[18px] ${
                      isActive
                        ? "border-b-2 border-[#020202] font-medium text-[#020202]"
                        : "border-b-2 border-transparent font-normal text-[#595959] hover:text-[#020202]"
                    }`}
                  >
                    {industry.tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Clipped White Card */}
          <div
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 76px), calc(100% - 76px) 100%, 0 100%)",
            }}
            className="mt-8 grid items-center gap-10 bg-white p-8 sm:p-10 lg:mt-[42px] lg:min-h-[540px] lg:grid-cols-[1fr_528px] lg:p-[60px]"
          >
            {/* Left Column: Sector Copy, Clipped Tag Pills & CTA Button */}
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-[16px] font-normal uppercase tracking-normal text-[#58C7E8] lg:text-[18px]">
                  {activeIndustry.sector}
                </p>
                <h3 className="mt-3 text-[28px] font-normal leading-[1.15] tracking-[-0.03em] text-[#020202] lg:text-[36px]">
                  {activeIndustry.title}
                </h3>
                <p className="mt-6 max-w-[780px] text-[16px] leading-[1.48] text-[#595959] lg:text-[18px]">
                  {activeIndustry.body}
                </p>

                {/* 2 Clipped Grey Tag Pills */}
                <div className="mt-7 flex flex-wrap gap-3">
                  {activeIndustry.tags.map((tag) => (
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
                  href={activeIndustry.href}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[228px] items-end justify-between gap-6 bg-[#58C7E8] px-3.5 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  <span>{activeIndustry.cta}</span>
                  <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right Column: Clipped Light Cyan Key Specifications Box */}
            <aside
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 62px), calc(100% - 62px) 100%, 0 100%)",
              }}
              className="flex min-h-[380px] flex-col justify-between bg-[#DFF4FC] p-7 sm:p-9 lg:min-h-[416px] lg:p-10"
            >
              <div>
                <p className="text-[12px] font-normal text-[#595959]">Key Specifications</p>
                <h4 className="mt-1.5 text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-[#020202] lg:text-[22px]">
                  {activeIndustry.specHeading}
                </h4>

                <ul className="mt-6 space-y-3.5 text-[14px] leading-[1.35] text-[#020202]">
                  {activeIndustry.specs.map((spec) => (
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
                    <span className="text-[#595959]">{activeIndustry.metaLeft[0]}</span>
                    <strong className="font-semibold text-[#020202]">
                      {activeIndustry.metaLeft[1]}
                    </strong>
                  </span>
                  <span className="h-3.5 w-px bg-[#BCEAF8]" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[#595959]">{activeIndustry.metaRight[0]}</span>
                    <strong className="font-semibold text-[#020202]">
                      {activeIndustry.metaRight[1]}
                    </strong>
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="process" className="bg-white px-6 py-24 lg:min-h-[530px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.95fr_1fr]">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <Eyebrow>Vertical Integration</Eyebrow>
              <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
                5-Stage In-House
                <br />
                Manufacturing Process
              </h2>
            </div>

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
            <div className="flex h-12 w-12 items-center justify-center bg-[#F4F4F4] text-sm font-medium text-[#020202]">
              {activeProcess.num}
            </div>
            <h3 className="mt-6 text-3xl font-normal tracking-[-0.03em] text-[#020202] lg:text-[36px]">
              {activeProcess.title}
            </h3>
            <p className="mt-3 text-lg font-medium text-[#58C7E8]">{activeProcess.subtitle}</p>
            <p className="mt-7 max-w-2xl text-lg leading-[1.48] text-[#595959] lg:text-xl">
              {activeProcess.body}
            </p>
            <div className="mt-9">
              <Link
                href="/about#facilities"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                }}
                className="inline-flex min-h-[56px] min-w-[272px] items-end justify-between gap-6 bg-[#58C7E8] px-3.5 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                <span>View Our Manufacturing Facilities</span>
                <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#EEFAFF] px-6 py-20 lg:px-[60px] lg:py-[100px]">
        {/* Dotted World Map Background on Right Half */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 flex w-[76%] items-center justify-end overflow-hidden opacity-90 lg:w-[66%]"
        >
          <svg
            viewBox="0 0 980 390"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full object-cover object-right"
          >
            {WORLD_MAP_DOT_ROWS.map((row, rIdx) =>
              Array.from(row).map((ch, cIdx) =>
                ch === "#" ? (
                  <circle
                    key={`${rIdx}-${cIdx}`}
                    cx={cIdx * 13.5 + 8}
                    cy={rIdx * 14.5 + 10}
                    r={3.2}
                    fill="#C6E7F6"
                  />
                ) : null,
              ),
            )}
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#020202]">
                <span className="h-1.5 w-1.5 bg-[#58C7E8]" />
                TRUST THROUGH COMPLIANCE
              </div>
              <h2 className="mt-4 text-[36px] font-normal leading-[1.08] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:text-[48px]">
                Certified for Quality, Safety &amp; Export
              </h2>
              <p className="mt-4 max-w-[960px] text-[15px] leading-[1.5] text-[#595959] lg:text-[17px]">
                Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.
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
                    className="flex h-[78px] w-[78px] items-center justify-center bg-[#EEFAFF]"
                  >
                    <img
                      src={cert.icon}
                      alt={cert.title}
                      className="h-[42px] w-[42px] object-contain"
                    />
                  </div>
                  <h3 className="mt-8 text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-[#020202] lg:text-[22px]">
                    {cert.title}
                  </h3>
                  <div className="my-4 h-[1.5px] w-[46px] bg-[#BCEAF8]" />
                  <p className="text-[15px] font-normal leading-[1.35] text-[#020202] lg:text-[16px]">
                    {cert.sub1}
                  </p>
                  <p className="mt-1.5 text-[13px] font-normal leading-[1.35] text-[#595959]">
                    {cert.sub2}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:min-h-[661px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Trusted By Industry Leaders</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">What Our Partners Say</h2>
            </div>
            <ButtonLink>Read More Case Studies</ButtonLink>
          </div>
          <div className="relative mt-[60px] flex min-h-[315px] items-center justify-center bg-white px-6 py-12 lg:px-[152px]">
            <button className="absolute left-5 top-1/2 hidden -translate-y-1/2 bg-[#f5f5f5] p-3 lg:block" aria-label="Previous testimonial"><ArrowLeft size={20} /></button>
            <div className="mx-auto max-w-[1284px] text-center">
              <div className="inline-flex items-center gap-3 text-sm text-[#595959]">
                <span className="bg-[#f5f5f5] px-3 py-2">OEM Client Case</span>
                <span>HVAC Manufacturing</span>
              </div>
              <blockquote className="mt-8 text-3xl font-normal leading-[1.13] tracking-normal text-[#020202] lg:text-5xl">
                CAPCO&apos;s vertically integrated manufacturing helped us reduce capacitor costs by 28% while improving lead times from 12 weeks to 10 days. Their co-engineering support was critical for our new AC product line.
              </blockquote>
              <div className="mt-10 flex items-center justify-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center bg-[#ededed] text-lg font-semibold">RK</div>
                <div className="text-left">
                  <p className="font-semibold">Rajesh Kumar</p>
                  <p className="mt-1 text-sm text-[#595959]">Head of Procurement</p>
                </div>
              </div>
            </div>
            <button className="absolute right-5 top-1/2 hidden -translate-y-1/2 bg-[#f5f5f5] p-3 lg:block" aria-label="Next testimonial"><ArrowRight size={20} /></button>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-[#f5f5f5] px-6 py-20 lg:min-h-[1210px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Trusted By Industry Leaders</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Projects</h2>
            </div>
            <div className="hidden text-right lg:block">
              <p className="text-sm text-[#595959]">01/03</p>
              <div className="mt-2 flex gap-3">
                <button className="bg-white p-3" aria-label="Previous project"><ArrowLeft size={20} /></button>
                <button className="bg-white p-3" aria-label="Next project"><ArrowRight size={20} /></button>
              </div>
            </div>
          </div>
          <div className="mt-14 flex snap-x gap-2 overflow-x-auto pb-3">
            {projects.map(([image, projectTitle, projectBody, cta], index) => (
              <article key={projectTitle} className="relative h-[560px] w-[84vw] max-w-[1512px] shrink-0 snap-start overflow-hidden rounded-[18px] lg:h-[864px] lg:w-[78vw]">
                <Image src={image} alt="" fill sizes="(min-width: 1024px) 78vw, 84vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/48" />
                <div className="absolute bottom-10 left-8 text-white lg:bottom-[90px] lg:left-12">
                  {index === 0 ? <BookOpen size={32} /> : index === 1 ? <Award size={32} /> : <Zap size={32} />}
                  <h3 className="mt-4 text-3xl font-normal tracking-normal lg:text-5xl">{projectTitle}</h3>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-[#101010]/45 p-6 text-white backdrop-blur lg:left-auto lg:w-[560px] lg:p-9">
                  <p className="text-base leading-[1.4] opacity-80">{projectBody}</p>
                  <div className="mt-8"><ButtonLink light>{cta}</ButtonLink></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReadyToSpecifyCapcoSection />

      <PublicFaqSection />

      <PublicFooter />
    </main>
  );
}

