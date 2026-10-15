"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Plus,
  Minus,
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  PublicFooter,
  PublicNav,
} from "@/components/public/PublicChrome";

const oemCapabilities = [
  {
    title: "Custom Metallization",
    body: "Zinc/Aluminium alloy formulations tailored to your exact capacitance, voltage, dielectric strength, and self-healing requirements. Vacuum-deposited via Leybold equipment.",
  },
  {
    title: "Terminal & Housing Configuration",
    body: "Wide selection of terminal styles (Faston tabs, solder pins, flexible insulated wire leads) and flame-retardant plastic or aluminium canister housings engineered to fit your chassis envelope.",
  },
  {
    title: "Prototype & Testing",
    body: "Rapid turnaround on functional evaluation prototypes (10 to 50 sample units) delivered within 7–10 days with comprehensive NABL dielectric, endurance, and surge test documentation.",
  },
  {
    title: "Technical Documentation",
    body: "Complete OEM compliance dossier including BIS certification certificates, CE / RoHS declarations of conformity, 2D dimensional CAD drawings, and 3D STEP models.",
  },
] as const;

const developmentSteps = [
  {
    num: "01",
    label: "STEP 01",
    title: "Application Discovery",
    dial: "/figma/solutions/28730.svg",
    body: "Comprehensive requirement mapping analyzing your electrical loads, thermal environments, mechanical constraints, and compliance needs to establish clear technical specifications.",
  },
  {
    num: "02",
    label: "STEP 02",
    title: "Design & Prototyping",
    dial: "/figma/solutions/88be3.svg",
    body: "Custom capacitor configurations with optimized metallization, winding, and encapsulation. 3 to 5 prototype variants built and internally validated for your evaluation.",
  },
  {
    num: "03",
    label: "STEP 03",
    title: "Validation & Trials",
    dial: "/figma/solutions/a7ea4.svg",
    body: "Field testing in your equipment under real operating conditions with iterative refinements based on performance data until specifications are locked and approved.",
  },
  {
    num: "04",
    label: "STEP 04",
    title: "Mass Production",
    dial: "/figma/solutions/db991.svg",
    body: "Vertically integrated manufacturing with 100% batch testing, BIS-certified release, and JIT delivery aligned to your production schedules and inventory requirements.",
  },
] as const;

const oemStories = [
  {
    image: "/figma/solutions/946c5.png",
    clientTag: "HVAC OEM Client Case",
    title: "Leading HVAC OEM Reduces Capacitor Costs by 28%",
    stats: [
      { label: "[CR]", value: "28%" },
      { label: "[FR]", value: "60%" },
      { label: "[ZQI]", value: "18 Months" },
    ],
    summary:
      "High landed cost of imported motor run capacitors with 12-week lead times. Capcocapacitors co-engineered equivalent capacitors with Leybold metallization, delivered in 10 days.",
    fullText:
      "A Tier-1 HVAC manufacturer was experiencing severe supply disruptions and escalating import duties on European-sourced motor run capacitors. CAPCO's engineering team reverse-engineered the dielectric stack and qualified a custom P2 burst-proof polypropylene capacitor within 3 weeks. Full volume production transitioned within 60 days, cutting unit costs by 28% and stabilizing assembly line inventory with buffer stock held in Hyderabad.",
  },
  {
    image: "/figma/solutions/4596c.png",
    clientTag: "Agricultural Pump OEM",
    title: "Submersible Pump OEM Achieves Burst-Proof Reliability Across Rural Grids",
    stats: [
      { label: "[FR]", value: "-64%" },
      { label: "[LT]", value: "10 Days" },
      { label: "[IS]", value: "IS:2993" },
    ],
    summary:
      "Rural voltage surges between 140V and 500V caused frequent capacitor failures in agricultural borewell pumps. CAPCO engineered a high-surge self-healing capacitor with reinforced dielectric margins.",
    fullText:
      "Operating in agricultural zones with severe phase fluctuations, western pump manufacturers suffered warranty returns exceeding 8%. CAPCO deployed custom MPP film with zinc-heavy edges and high-temperature polyurethane resin encapsulation. Field warranty claims plummeted by 64% over two monsoon seasons, making CAPCO their exclusive factory-installed capacitor partner.",
  },
  {
    image: "/figma/solutions/34685.png",
    clientTag: "Industrial EPC & APFC",
    title: "APFC Panel Builder Delivers 35% Space Saving with Modular 150 KVAR Banks",
    stats: [
      { label: "[SS]", value: "35%" },
      { label: "[PF]", value: "0.99" },
      { label: "[IS]", value: "IS:13340" },
    ],
    summary:
      "Heavy automotive stamping facility required high harmonic endurance in compact switchgear enclosures. CAPCO delivered modular cylindrical PFC cells rated for continuous 24/7 duty.",
    fullText:
      "Space constraints inside plant electrical substations restricted conventional box-type capacitor banks. CAPCO engineered compact 25 KVAR cylindrical cells with overpressure disconnectors, enabling 150 KVAR modular rack integration in 35% less enclosure footprint while maintaining power factor strictly at 0.99 under fluctuating robotic stamping loads.",
  },
  {
    image: "/figma/solutions/bec3c.png",
    clientTag: "Appliance Tier-1 OEM",
    title: "Consumer Appliance Manufacturer Validates 30,000-Hour Operating Life",
    stats: [
      { label: "[LIFE]", value: "30,000h" },
      { label: "[DF]", value: "<0.002" },
      { label: "[CERT]", value: "CE / RoHS" },
    ],
    summary:
      "Front-load washing machine manufacturer required Class-B 10,000h certified capacitors with integrated bleeder resistors and compact quick-connect terminals.",
    fullText:
      "To meet global export standards across Middle Eastern and European appliance markets, this manufacturer required dual BIS & CE conformity. CAPCO designed a low-loss polypropylene motor capacitor with integrated safety disconnectors and tan-delta loss below 0.0018, passing 30,000 hours of continuous accelerated thermal life testing.",
  },
] as const;

const oemProducts = [
  {
    tag: "BOPP Substrate",
    code: "CAT: MPP-01",
    title: "Metalized Polypropylene Film (MPP)",
    body: "In-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications.",
    specs: [
      ["THICKNESS:", "3.5–14 Micron"],
      ["VOLTAGE:", "Up to 4000V AC"],
    ],
    cta: "Explore MPP Film",
    slug: "zinc-aluminium-alloy-metalised-bopp-film",
  },
  {
    tag: "IS:2993 Certified",
    code: "CAT: MOT-RUN",
    title: "Fan & Motor Capacitors",
    body: "Motor run, motor start, fan, and submersible panel capacitors for HVAC, pumps, and appliances.",
    specs: [
      ["RANGE:", "0.5–432 MFD"],
      ["VOLTAGE:", "400–440V AC"],
    ],
    cta: "Explore Fan & Motor",
    slug: "fan-capacitor",
  },
  {
    tag: "IS:13340 Heavy Duty",
    code: "CAT: PFC-CELL",
    title: "Power Factor Correction (PFC)",
    body: "Cylindrical, box type, and capacitor banks up to 150 KVAR for industrial APFC panels.",
    specs: [
      ["RANGE:", "0.5–25 KVAR/Cell"],
      ["VOLTAGE:", "415–440V AC"],
    ],
    cta: "Explore PFC Capacitors",
    slug: "pfc-capacitor",
  },
  {
    tag: "IS:1569 Standard",
    code: "CAT: LUM-RES",
    title: "Luminaire Capacitors",
    body: "Lighting capacitors with inbuilt discharge resistors for street lights and industrial luminaires.",
    specs: [
      ["CAPACITANCE:", "1–45 MFD"],
      ["RATED V:", "230–250V AC"],
    ],
    cta: "Explore Lighting Capacitors",
    slug: "lighting-luminaire-capacitor",
  },
  {
    tag: "High Frequency",
    code: "CAT: UV-CUR",
    title: "UV Lamp Capacitors",
    body: "High-frequency capacitors for UV curing systems in printing, coating, and industrial manufacturing.",
    specs: [
      ["TUNING:", "Custom Build"],
      ["VOLTAGE:", "Up to 4000V AC"],
    ],
    cta: "Explore UV Capacitors",
    slug: "uv-lamp-capacitor",
  },
  {
    tag: "OEM Co-Engineering",
    code: "CAT: CUST-ENG",
    title: "Customized Capacitors",
    body: "Co-engineered capacitors tailored to your electrical, thermal, and mechanical requirements.",
    specs: [
      ["DIMENSIONS:", "Per Specification"],
      ["TERMINALS:", "Custom Pins/Tags"],
    ],
    cta: "Request Custom Solution",
    slug: "special-application-capacitor",
  },
] as const;

const locations = [
  {
    name: "Bell Junction",
    type: "Operating site",
    detail: "West Texas · ERCOT",
    body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.",
    x: 30,
    y: 56,
    icon: "6261e.svg",
  },
  {
    name: "Cedar Bayou",
    type: "Operating site",
    detail: "Site location",
    body: "Explore the operating network and contact our team for more information.",
    x: 42,
    y: 68,
    icon: "a1758.svg",
  },
  {
    name: "Marfa Flats",
    type: "Operating site",
    detail: "Site location",
    body: "Standalone storage on a constrained node, cycling twice daily against congestion.",
    x: 22,
    y: 72,
    icon: "a1758.svg",
  },
  {
    name: "Salt Fork",
    type: "Operating site",
    detail: "Site location",
    body: "First fleet site to complete a full augmentation cycle with no measured capacity shortfall.",
    x: 36,
    y: 46,
    icon: "a1758.svg",
  },
  {
    name: "Dallas HQ",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    x: 52,
    y: 58,
    icon: "8200f.svg",
  },
  {
    name: "Austin",
    type: "Office",
    detail: "Office location",
    body: "Contact the team for information about this location.",
    x: 47,
    y: 78,
    icon: "8200f.svg",
  },
  {
    name: "Rotterdam",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 66,
    y: 44,
    icon: "ab167.svg",
  },
  {
    name: "Adelaide",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 82,
    y: 72,
    icon: "ab167.svg",
  },
  {
    name: "Santiago",
    type: "In development",
    detail: "Development location",
    body: "Contact the team for information about this location.",
    x: 62,
    y: 88,
    icon: "ab167.svg",
  },
] as const;

const oemFaqs = [
  {
    q: "What is the minimum order quantity (MOQ) for OEM partnerships?",
    a: "Standard OEM mass production runs start at 1,000 units per specification, while prototype and engineering qualification batches can be supplied in sample quantities of 10 to 50 units.",
  },
  {
    q: "Can you match capacitors from other manufacturers?",
    a: "Yes. Our engineering lab can reverse-engineer or cross-reference existing imported or domestic capacitors to match exact capacitance, tan-delta dissipation factor, terminal styles, and housing dimensions.",
  },
  {
    q: "What is the typical lead time for custom capacitor development?",
    a: "Custom engineering prototypes are delivered within 7–10 working days, and full-scale mass production dispatch typically begins within 2–3 weeks of sample approval.",
  },
  {
    q: "Do you provide technical documentation for our compliance files?",
    a: "Every OEM and export shipment includes comprehensive BIS test certificates, NABL accredited lab reports, RoHS/CE declarations of conformity, and dimensional CAD drawings.",
  },
  {
    q: "Can CAPCO support JIT delivery for our assembly lines?",
    a: "Yes. With a combined manufacturing capacity of 1,050,000 units/month across our Medak and Jeedimetla plants plus regional buffer stock, we support scheduled pull-triggers and JIT replenishment.",
  },
  {
    q: "What industries do you currently serve as an OEM partner?",
    a: "We supply Tier-1 manufacturers across HVAC & commercial air conditioning, submersible & agricultural pumps, consumer appliances, industrial APFC panels, and municipal lighting infrastructure.",
  },
] as const;

export function OemSolutionView() {
  const [activeCapability, setActiveCapability] = useState<number | null>(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<(typeof oemStories)[number] | null>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);
  const activeLocation = locations[activeLocationIndex];

  const scrollToStory = (index: number) => {
    const nextIdx = (index + oemStories.length) % oemStories.length;
    setActiveStoryIndex(nextIdx);
    const container = storiesScrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>("[data-story-card]");
    const target = cards[nextIdx];
    if (target) {
      container.scrollTo({
        left: target.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. Hero Section (Strictly 100vh on Desktop including Navbar) */}
      <section className="relative flex h-screen min-h-[720px] max-h-[1194px] flex-col justify-between overflow-hidden bg-[#000000] text-white">
        <img
          src="/figma/solutions/66dd5.png"
          alt="CAPCO advanced capacitor manufacturing line"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />

        {/* Global Standard Public Navigation */}
        <PublicNav variant="overlay" logoSrc="/figma/solutions/caef4.png" className="relative z-30 shrink-0" />

        {/* Hero Main Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-end px-6 pb-20 pt-4 lg:px-[60px] lg:pb-[95px]">
          {/* Top Description on Right (Desktop) */}
          <div className="mb-6 flex justify-end lg:mb-8">
            <p className="max-w-[518px] text-left text-[18px] font-normal leading-[1.25] text-white sm:text-[20px] lg:text-[22px] [text-shadow:0px_0px_28px_rgba(255,255,255,0.25)]">
              Co-engineered capacitor solutions, vertically integrated manufacturing, and dedicated support for India&apos;s leading equipment manufacturers.
            </p>
          </div>

          {/* Eyebrows Row */}
          <div className="flex flex-wrap items-center gap-6 text-[15px] font-medium tracking-[0.02em] text-white sm:text-[16px]">
            <span className="inline-flex items-center gap-2">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              5,000+ AUTHORISED DEALERS
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              20+ STATES COVERED
            </span>
          </div>

          {/* Thin White Rule */}
          <div className="my-5 h-px w-full bg-white/30" />

          {/* Heading and Action Buttons Grid */}
          <div className="relative">
            <div className="lg:max-w-[70%]">
              <h1 className="max-w-[1281px] text-[44px] font-light leading-[1.0] tracking-[-3px] text-white sm:text-[68px] md:text-[84px] lg:text-[92px] lg:tracking-[-5px]">
                Your Strategic OEM
                <br />
                Capacitor Partner
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 lg:mt-8">
                <Link
                  href="/contact?category=oem#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[274px] items-center justify-between gap-6 bg-[#58C7E8] px-4 py-3 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-[#121212]">Schedule Technical Consultation</span>
                  <ArrowRight size={18} className="!text-[#121212] shrink-0" />
                </Link>

                <a
                  href="/catalogs/capco-product-catalog.pdf"
                  download="CAPCO-OEM-Solutions.pdf"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[200px] items-center justify-between gap-4 bg-white px-4 py-3 text-[14px] font-medium leading-[1.2] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">View OEM</span>
                  <FileText size={18} className="!text-[#020202] shrink-0" />
                </a>
              </div>
            </div>

            {/* Bottom-Right Compliance Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:max-w-[48%] lg:justify-end lg:gap-8">
              {[
                {
                  title: "BIS Mark",
                  sub: "IS:2993 / IS:13340",
                  icon: <ShieldCheck size={20} className="text-white" />,
                },
                {
                  title: "ISO Quality",
                  sub: "9001:2008 Certified",
                  icon: <Award size={20} className="text-white" />,
                },
                {
                  title: "CE Approved",
                  sub: "EU Export Standard",
                  icon: <CheckCircle2 size={20} className="text-white" />,
                },
              ].map((badge) => (
                <div key={badge.title} className="flex items-center gap-3">
                  <span
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                    }}
                    className="grid h-[44px] w-[44px] place-items-center bg-white/40"
                  >
                    {badge.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-medium leading-none text-white">{badge.title}</span>
                    <span className="mt-1 text-[18px] font-medium leading-none text-white">{badge.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-Left Angled White Cutout (Identical to About Page Hero) */}
        <div
          aria-hidden="true"
          style={{
            clipPath: "polygon(0 0, calc(100% - 48px) 0, 100% 100%, 0 100%)",
          }}
          className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-[48px] w-[58%] bg-white lg:block xl:h-[56px] xl:w-[62%]"
        />
      </section>

      {/* 2. Built for Equipment Manufacturers */}
      <section id="oem-overview" className="relative z-10 bg-white px-6 pb-24 pt-16 lg:px-[60px] lg:pt-20 lg:pb-32">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                30+ Years of OEM Trust
              </div>
              <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-[#020202] sm:text-[44px] lg:text-[48px]">
                Built for Equipment
                <br />
                Manufacturers
              </h2>
            </div>
            <p className="max-w-[500px] text-[15px] leading-[1.4] text-[#595959] lg:text-[16px]">
              CAPCO partners with HVAC, TPW Fan Manufacturers, Moto &amp; Panel appliance, and industrial equipment OEMs to deliver custom capacitor solutions that meet exact technical specifications, compliance requirements, and production timelines.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="mt-14 overflow-hidden rounded-[24px] bg-[#F5F5F5] lg:grid lg:grid-cols-2">
            {/* Left Column: Leybold Vacuum Machine */}
            <div className="relative min-h-[380px] w-full lg:min-h-[580px]">
              <img
                src="/figma/solutions/15515.png"
                alt="CAPCO high-vacuum Leybold metallization chamber"
                className="h-full w-full object-cover lg:rounded-l-[24px]"
              />
            </div>

            {/* Right Column: Accordion Items */}
            <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
              <div className="divide-y divide-[#E5E5E5]">
                {oemCapabilities.map((item, idx) => {
                  const isOpen = activeCapability === idx;
                  return (
                    <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setActiveCapability(isOpen ? null : idx)}
                        className="flex w-full cursor-pointer items-center justify-between text-left"
                      >
                        <span
                          className={`text-[20px] font-normal tracking-[-0.52px] transition sm:text-[24px] lg:text-[26px] ${
                            isOpen ? "text-[#020202]" : "text-[#8C8C8C] hover:text-[#020202]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white transition">
                          {isOpen ? <X size={15} /> : <Plus size={15} />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="mt-3 max-w-[500px] text-[14px] leading-[1.5] text-[#595959]">
                          {item.body}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/contact?category=oem#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[240px] items-center justify-between gap-6 bg-white px-4 py-3 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#EAEAEA]"
                >
                  <span className="!text-[#121212]">Start Co-Engineering Project</span>
                  <ArrowRight size={16} className="!text-[#121212] shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dedicated Support for Production Success (2-Column Sticky Layout) */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_874px] lg:gap-16">
            {/* Left Column: Anchored / Sticky Header & Action Button */}
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[4px] w-[4px] bg-[#00E05C]" />
                Collaborative Development Process
              </div>
              <h2 className="mt-5 text-[38px] font-normal leading-[1.0] tracking-[-2.88px] text-[#121212] sm:text-[48px] lg:text-[56px]">
                Dedicated Support for
                <br />
                Production Success
              </h2>
              <div className="mt-8">
                <Link
                  href="/contact?category=oem#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[240px] items-center justify-between gap-6 bg-[#0092CA] px-5 py-3 text-[14px] font-medium leading-[1.2] !text-white transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-white">Start Co-Engineering Project</span>
                  <ArrowRight size={16} className="!text-white shrink-0" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Step Rows with Stacking Cards Scroll Effect */}
            <div className="flex flex-col gap-8 pb-12">
              {developmentSteps.map((step, idx) => (
                <div
                  key={step.num}
                  style={{
                    top: `${110 + idx * 24}px`,
                    zIndex: idx + 1,
                  }}
                  className="sticky flex flex-col gap-1 rounded-[12px] shadow-xl sm:flex-row transition-transform duration-200"
                >
                  {/* Number Card */}
                  <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#ECECEC] sm:w-[350px] shrink-0">
                    <img
                      src={step.dial}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 m-auto h-[290px] w-[290px] opacity-70"
                    />
                    <span className="relative z-10 font-sans text-[72px] font-normal leading-none tracking-tight text-[#121212]">
                      {step.num}
                    </span>
                  </div>

                  {/* Info Card */}
                  <div className="flex h-[350px] flex-1 flex-col justify-between rounded-[12px] bg-[#ECECEC] p-8 sm:p-10">
                    <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#595959]">
                      {step.label}
                    </span>
                    <div>
                      <h3 className="text-[20px] font-normal tracking-[-0.02em] text-[#121212] sm:text-[22px]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-[1.5] text-[#595959]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Client Logos Bar (5-Column Grid with Divider Lines) */}
      <section className="border-y border-[#E4E4E4] bg-white">
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-2 divide-x divide-[#E4E4E4] sm:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex h-[140px] items-center justify-center px-6 transition hover:opacity-80 lg:h-[160px]"
              >
                <svg
                  width="140"
                  height="32"
                  viewBox="0 0 140 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-auto"
                >
                  <path
                    d="M12.5 7C7.8 7 4 10.8 4 15.5C4 20.2 7.8 24 12.5 24C16.2 24 19.3 21.6 20.5 18.2C21.7 21.6 24.8 24 28.5 24C33.2 24 37 20.2 37 15.5C37 10.8 33.2 7 28.5 7C24.8 7 21.7 9.4 20.5 12.8C19.3 9.4 16.2 7 12.5 7ZM12.5 11C15 11 17 13 17 15.5C17 18 15 20 12.5 20C10 20 8 18 8 15.5C8 13 10 11 12.5 11ZM28.5 11C31 11 33 13 33 15.5C33 18 31 20 28.5 20C26 20 24 18 24 15.5C24 13 26 11 28.5 11Z"
                    fill="#020202"
                  />
                  <text
                    x="44"
                    y="21"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="0.1em"
                    fill="#020202"
                  >
                    LOGOIPSUM
                  </text>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OEM Success Stories Carousel */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#00E05C]" />
                Proven Partnerships
              </div>
              <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-[#020202] sm:text-[48px] lg:text-[56px]">
                OEM Success Stories
              </h2>
            </div>

            {/* Carousel Navigation Controls */}
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-mono text-[#8C8C8C]">
                0{activeStoryIndex + 1}/0{oemStories.length}
              </span>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex - 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#E5E5E5] bg-white text-[#020202] transition hover:bg-[#020202] hover:text-white"
                aria-label="Previous story"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex + 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#E5E5E5] bg-white text-[#020202] transition hover:bg-[#020202] hover:text-white"
                aria-label="Next story"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Stories Horizontal Track */}
          <div
            ref={storiesScrollRef}
            className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-none"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {oemStories.map((story) => (
              <div
                key={story.title}
                data-story-card
                onClick={() => setSelectedStory(story)}
                style={{ scrollSnapAlign: "start" }}
                className="group relative h-[560px] w-[88vw] max-w-[1512px] shrink-0 cursor-pointer overflow-hidden rounded-[32px] bg-[#1A1A1A] transition-all duration-300 hover:shadow-2xl lg:h-[864px] lg:w-[1512px]"
              >
                {/* Background Image */}
                <img
                  src={story.image}
                  alt={story.title}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Figma Gradient: linear-gradient(180deg, rgba(10, 10, 10, 0.157) 0%, rgba(10, 10, 10, 0.45) 100%) */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10, 10, 10, 0.157) 0%, rgba(10, 10, 10, 0.45) 100%)",
                  }}
                />

                {/* Bottom Auto Layout Container: padding: 14px; gap: 0px 24px */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-[14px]">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-[24px]">
                    {/* Left Title Container: width: 900px; padding: 0px 0px 34px 34px; gap: 15px */}
                    <div className="flex flex-col items-start gap-[15px] lg:w-[900px] lg:pb-[34px] lg:pl-[34px]">
                      {/* [Year/Category Tag] */}
                      <span className="font-mono text-[11px] leading-[13px] tracking-[1.1px] text-white/70">
                        {story.clientTag ? `[${story.clientTag.toUpperCase()}]` : "[CASE STUDY]"}
                      </span>
                      {/* Title: 48px / 53px / -1.44px */}
                      <h3 className="font-sans text-[28px] font-normal leading-[1.1] tracking-[-1.44px] text-white sm:text-[38px] lg:text-[48px] lg:leading-[53px]">
                        {story.title}
                      </h3>
                    </div>

                    {/* Right Frosted Glass Stats Card: width: 560px; max-w: 560px; height: 245.38px; padding: 36px; gap: 47.38px; background: rgba(16, 16, 16, 0.42); backdrop-blur: 14px; border-radius: 18px */}
                    <div className="flex w-full max-w-[560px] flex-col justify-between rounded-[18px] bg-[rgba(16,16,16,0.42)] p-6 backdrop-blur-[14px] lg:h-[245.38px] lg:w-[560px] lg:p-[36px]">
                      {/* Stats Row: gap 32px */}
                      <div className="flex flex-wrap items-start gap-6 lg:gap-[32px]">
                        {story.stats.map((stat) => (
                          <div key={stat.label} className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] leading-[13px] tracking-[1.1px] text-white/70">
                              {stat.label.startsWith("[") ? stat.label : `[${stat.label}]`}
                            </span>
                            <div className="font-sans text-[28px] font-normal leading-[38px] tracking-[-1.14px] text-white sm:text-[38px]">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Paragraph: width: 488px; font-size: 15px; line-height: 22px; letter-spacing: -0.15px; color: rgba(255, 255, 255, 0.82) */}
                      <p className="mt-4 max-w-[488px] font-sans text-[14px] font-normal leading-[22px] tracking-[-0.15px] text-white/80 lg:mt-0 lg:text-[15px]">
                        {story.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[24px] bg-[#121212] p-8 text-white sm:p-10">
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
            <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#58C7E8]">
              {selectedStory.clientTag}
            </span>
            <h3 className="mt-3 text-[28px] font-normal leading-snug sm:text-[32px]">
              {selectedStory.title}
            </h3>
            <div className="my-6 grid grid-cols-3 gap-4 rounded-[16px] bg-white/5 p-4">
              {selectedStory.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="text-[11px] font-mono text-white/50">{stat.label}</span>
                  <div className="mt-1 text-[22px] font-bold text-white sm:text-[26px]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed text-white/80">
              {selectedStory.fullText}
            </p>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="rounded-full bg-[#58C7E8] px-6 py-2.5 text-[14px] font-semibold text-black transition hover:brightness-105"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Browse by Product Category */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                COMPLETE CAPACITOR SOLUTIONS
              </div>
              <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-[#020202] sm:text-[48px] lg:text-[56px]">
                Browse by Product Category
              </h2>
            </div>

            <a
              href="/catalogs/capco-product-catalog.pdf"
              download="CAPCO-Catalog.pdf"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[52px] items-center gap-4 bg-[#58C7E8] px-6 py-3 text-[14px] font-semibold !text-[#020202] transition hover:brightness-105"
            >
              <span className="!text-[#020202]">Download Complete Catalog (PDF)</span>
              <Download size={17} className="!text-[#020202] shrink-0" />
            </a>
          </div>

          {/* 6 Product Cards Grid (3 Columns x 2 Rows) */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {oemProducts.map((p) => (
              <div
                key={p.title}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 55px), calc(100% - 55px) 100%, 0 100%)",
                }}
                className="flex flex-col justify-between bg-[#F4F4F4] p-8 sm:p-10 transition hover:bg-[#EFEFEF]"
              >
                <div>
                  {/* Category Tag & Code Row */}
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-[#595959]">
                      {p.tag}
                    </span>
                    <span className="font-mono font-medium text-[#0092CA]">
                      {p.code}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <h3 className="mt-6 text-[22px] font-normal tracking-tight text-[#020202] sm:text-[24px]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.5] text-[#595959]">
                    {p.body}
                  </p>

                  {/* Specs Row */}
                  <div className="mt-6 flex flex-wrap gap-4 border-t border-[#E4E4E4] pt-4 text-[13px]">
                    {p.specs.map(([lbl, val]) => (
                      <div key={lbl} className="flex items-center gap-1.5">
                        <span className="font-medium text-[#8C8C8C]">{lbl}</span>
                        <span className="font-medium text-[#020202]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Chamfered White CTA */}
                <div className="mt-8 pt-2">
                  <Link
                    href={`/products/${p.slug}`}
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                    }}
                    className="inline-flex min-h-[44px] items-center justify-between gap-4 bg-white px-4 py-2.5 text-[13px] font-medium !text-[#020202] transition hover:bg-[#EAEAEA]"
                  >
                    <span className="!text-[#020202]">{p.cta}</span>
                    <ArrowRight size={15} className="!text-[#020202] shrink-0" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Where We Operate (Interactive Map Section) */}
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

          {/* Interactive World / Region Area */}
          <div className="relative mt-12 min-h-[520px] w-full overflow-hidden rounded-[24px] bg-black/20 p-8">
            {/* Map Background SVG Coordinates and Pins */}
            <div className="relative h-[440px] w-full">
              {locations.map((loc, idx) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => setActiveLocationIndex(idx)}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition ${
                    activeLocationIndex === idx ? "scale-125 z-20" : "opacity-80 hover:scale-110 z-10"
                  }`}
                  aria-label={`View ${loc.name}`}
                >
                  <img
                    src={`/figma/solutions/${loc.icon}`}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8"
                  />
                </button>
              ))}

              {/* Active Site Details Card Popup */}
              {activeLocation && (
                <div
                  style={{
                    left: `${Math.min(Math.max(activeLocation.x, 15), 70)}%`,
                    top: `${Math.max(activeLocation.y - 32, 10)}%`,
                  }}
                  className="pointer-events-none absolute z-30 w-[300px] -translate-x-1/2 rounded-[16px] border border-white/20 bg-black/75 p-5 backdrop-blur-md"
                >
                  <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/60">
                    {activeLocation.type}
                  </span>
                  <h4 className="mt-1 text-[18px] font-semibold text-white">
                    {activeLocation.name}
                  </h4>
                  <p className="mt-0.5 text-[12px] text-[#58C7E8]">
                    {activeLocation.detail}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/80">
                    {activeLocation.body}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-white/20 pt-4 text-[13px] text-white/80">
              <div className="flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-2">
                  <span className="text-[16px]">+</span> OPERATING SITE
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white" /> OFFICE
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full border border-white" /> IN DEVELOPMENT
                </span>
              </div>
              <span className="font-mono text-[13px]">
                0{activeLocationIndex + 1}/0{locations.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Start Your OEM Journey with Capco Capacitors */}
      <section className="bg-[#000000] px-6 py-20 text-white lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-white">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              Ready to Partner?
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-white sm:text-[48px] lg:text-[56px]">
              Start Your OEM Journey
              <br />
              with Capco Capacitors
            </h2>
          </div>

          {/* 3 Step Cards */}
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div>
              <div className="h-[360px] w-full overflow-hidden rounded-[20px] bg-[#1a1a1a] sm:h-[400px]">
                <img
                  src="/figma/solutions/oem-journey-1.png"
                  alt="OEM Technical Consultation"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-[20px] font-medium text-white sm:text-[22px]">
                Technical Consultation
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#8C8C8C]">
                Share your specifications, application requirements, and target pricing. Our engineers will recommend optimal solutions.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact?category=oem#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[52px] items-center justify-between gap-4 bg-white px-5 py-3 text-[14px] font-semibold !text-[#121212] transition hover:bg-[#EAEAEA]"
                >
                  <span className="!text-[#121212]">Schedule Technical Consultation</span>
                  <ArrowRight size={16} className="!text-[#121212] shrink-0" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="h-[360px] w-full overflow-hidden rounded-[20px] bg-[#1a1a1a] sm:h-[400px]">
                <img
                  src="/figma/solutions/oem-journey-2.png"
                  alt="Prototype & Validation"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-[20px] font-medium text-white sm:text-[22px]">
                Prototype &amp; Validation
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#8C8C8C]">
                Receive samples for testing and validation. We&apos;ll iterate based on your feedback until performance matches your expectations.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="h-[360px] w-full overflow-hidden rounded-[20px] bg-[#1a1a1a] sm:h-[400px]">
                <img
                  src="/figma/solutions/oem-journey-3.png"
                  alt="Production & Delivery"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-[20px] font-medium text-white sm:text-[22px]">
                Production &amp; Delivery
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#8C8C8C]">
                Finalize commercial terms, sign supply agreement, and begin regular deliveries with JIT or bulk shipment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          {/* Eyebrow & Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              OEM Partnership Clarity
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-[#020202] sm:text-[48px] lg:text-[56px]">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Cards */}
          <div className="mt-12 flex flex-col gap-4">
            {oemFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-[16px] bg-[#F5F5F5] p-6 transition sm:p-7"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                  >
                    <span className="text-[17px] font-medium text-[#020202] sm:text-[19px]">
                      {faq.q}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#222222] text-white transition hover:bg-black">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 text-[15px] leading-relaxed text-[#595959]">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Ready to Partner? CTA Banner (Radar Background) */}
      <section className="relative overflow-hidden bg-[#0A0A0A] px-6 py-24 text-center text-white lg:px-[60px] lg:py-36">
        {/* Subtle Concentric Radar Radial Dial */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
          <svg
            width="1200"
            height="1200"
            viewBox="0 0 1200 1200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
          >
            <circle cx="600" cy="600" r="200" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="600" cy="600" r="380" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="600" cy="600" r="540" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="8 8" />
            <line x1="600" y1="50" x2="600" y2="1150" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1="50" y1="600" x2="1150" y2="600" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.4" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[800px]">
          <h2 className="text-[44px] font-light leading-[1.05] tracking-tight text-white sm:text-[56px] lg:text-[64px]">
            Ready to Partner?
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-relaxed text-[#A1A1A1] sm:text-[18px]">
            Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/contact?category=oem#enquiry-form"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] min-w-[240px] items-center justify-between gap-6 bg-[#4E76F5] px-6 py-3.5 text-[15px] font-semibold !text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <span className="!text-white">Request OEM Pricing</span>
              <ArrowRight size={18} className="!text-white shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Public Footer (Clean, matching Figma reference with hideCta to prevent duplicate CTA) */}
      <PublicFooter hideCta={true} />
    </main>
  );
}
