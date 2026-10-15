"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  FileText,
  Plus,
  Minus,
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  Headphones,
  Mail,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  PublicFooter,
  PublicNav,
} from "@/components/public/PublicChrome";

const waysCapcoHelps = [
  {
    id: "application-specific",
    tabLabel: "APPLICATION SPECIFIC",
    title: "Power Factor Correction Audits",
    body: "Our engineers conduct comprehensive power factor audits using Class-A analyzers, measuring reactive power, harmonic distortion, and load patterns to recommend optimal capacitor sizing.",
    cta: "Request Power Audit",
    href: "/contact?category=industrial#enquiry-form",
    badge: "QCO 2017 MANDATE OK",
    icon: ShieldCheck,
  },
  {
    id: "apfc-integration",
    tabLabel: "APFC Panel Integration",
    title: "APFC Panel Integration Support",
    body: "We provide end-to-end support for APFC panel design, capacitor bank sizing, contactor/thyristor selection, and commissioning to ensure seamless integration with your existing electrical infrastructure.",
    cta: "Request APFC Support",
    href: "/contact?category=apfc#enquiry-form",
    badge: "RE-AUDITED ANNUALLY",
    icon: Cpu,
  },
  {
    id: "bulk-supply",
    tabLabel: "BULK SUPPLY",
    title: "Bulk Capacitor Supply",
    body: "From 0.5–25 KVAR cylindrical/box type capacitors to 150 KVAR capacitor banks, we supply BIS-certified capacitors for ongoing maintenance, retrofit projects, and new installations.",
    cta: "Request Bulk Quote",
    href: "/contact?category=bulk#enquiry-form",
    badge: "EN 60252-1 COMPLIANT",
    icon: Layers,
  },
] as const;

const industrialProducts = [
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
    body: "Cylindrical, box type, and capacitor banks (up to 150 KVAR) for industrial APFC panels.",
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
    slug: "pfc-capacitor",
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
    slug: "pfc-capacitor",
  },
] as const;

const successStories = [
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
      "High landed cost of imported motor run capacitors with 12-week lead times. Capco capacitors co-engineered equivalent capacitors with Leybold metallization, delivered in 10 days.",
    fullText:
      "A Tier-1 HVAC manufacturer was experiencing severe supply disruptions and escalating import duties on European-sourced motor run capacitors. CAPCO's engineering team qualified a custom P2 burst-proof polypropylene capacitor within 3 weeks. Full volume production transitioned within 60 days, cutting unit costs by 28% and stabilizing assembly line inventory with buffer stock held in Hyderabad.",
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

const faqItems = [
  {
    q: "What is the minimum order quantity (MOQ) for dealers?",
    a: "Standard PFC cylindrical cells and banks have flexible minimum order quantities starting from 10 units for evaluation batches, with scheduled buffer stock available for recurring bulk supply agreements.",
  },
  {
    q: "How do I check my MDF balance?",
    a: "Authorized CAPCO distributors and channel partners can access their Market Development Fund (MDF) ledger directly through the partner portal or via their assigned regional relationship manager.",
  },
  {
    q: "Can I return unsold inventory?",
    a: "Yes. Our standard dealer partner agreement includes an inventory re-balancing program, allowing rotation of slow-moving standard ratings for high-demand capacitor models once per fiscal year.",
  },
  {
    q: "How do I register a customer for territory protection?",
    a: "Registered project registrations can be submitted through our sales portal with tender/client specification details to lock exclusive distributor pricing and quotation protection for 90 days.",
  },
  {
    q: "What if a customer contacts Capco Capacitors directly?",
    a: "Direct inquiries originating from protected geographic dealer territories are routed back to our authorized regional channel partner with full technical engineering support from our central office.",
  },
  {
    q: "How do I request urgent stock during peak season?",
    a: "Fast-track dispatch orders are fulfilled directly from our Hyderabad central buffer warehouse or regional transit hubs within 24–48 hours for pre-cleared credit terms.",
  },
  {
    q: "Is training provided for new dealers?",
    a: "Yes. CAPCO conducts comprehensive product certifications, APFC sizing workshops, and harmonic analysis training for dealer engineering and sales teams both on-site and at our Hyderabad plant.",
  },
  {
    q: "Can I sell CAPCO products online (e-commerce)?",
    a: "Authorized distribution agreements permit authorized online channel distribution adhering to minimum advertised price (MAP) policies and verified genuine manufacturer certification guidelines.",
  },
] as const;

const locations = [
  {
    name: "Bell Junction",
    type: "OPERATING SITE",
    detail: "West Texas · ERCOT",
    body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.",
    x: 35,
    y: 42,
  },
  {
    name: "TSIIC Automotive Park Hub",
    type: "OPERATING SITE",
    detail: "Medak, Hyderabad - Telangana",
    body: "Flagship 100,000 sq.ft. facility housing Leybold high-vacuum metallization lines and automated winding cells.",
    x: 52,
    y: 50,
  },
  {
    name: "North Regional Buffer Hub",
    type: "OFFICE",
    detail: "Delhi NCR - Haryana",
    body: "Regional logistics node ensuring rapid 24-48h dispatch for North Indian OEM corridors.",
    x: 48,
    y: 35,
  },
  {
    name: "Western Industrial Office",
    type: "OFFICE",
    detail: "Pune & Ahmedabad Corridor",
    body: "Technical support desk servicing pump, textile, and automation panel builders.",
    x: 42,
    y: 55,
  },
  {
    name: "Middle East Export Office",
    type: "IN DEVELOPMENT",
    detail: "Dubai Logistics City - UAE",
    body: "Expanding regional export distribution center for MENA electrical switchgear markets.",
    x: 62,
    y: 45,
  },
] as const;

export function IndustrialEnquirySolutionView() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<(typeof successStories)[number] | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);
  const projectCardsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeLocation = locations[activeLocationIndex];

  const scrollToStory = (index: number) => {
    const nextIdx = (index + successStories.length) % successStories.length;
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
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Frame 2 - 100vh on Desktop with Angled Cutout)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[720px] lg:h-[1194px] lg:max-h-[100vh] flex-col justify-between overflow-hidden bg-[#101010] text-white">
        <img
          src="/figma/solutions/22cfa.png"
          alt="Power transmission grid infrastructure across landscape"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />

        {/* Global Standard Public Navigation */}
        <PublicNav variant="overlay" logoSrc="/figma/solutions/caef4.png" className="relative z-30 shrink-0" />

        {/* Hero Main Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-end px-6 pb-16 pt-4 lg:px-[60px] lg:pb-[75px]">
          {/* Top Description on Right (Desktop) */}
          <div className="mb-8 flex justify-end lg:mb-10">
            <p className="max-w-[518px] text-left text-[18px] font-normal leading-[120%] text-white [text-shadow:0px_0px_28.2px_rgba(255,255,255,0.25)] sm:text-[20px] lg:text-[22px]">
              CAPCO provides power factor audits, APFC panel integration support, and bulk capacitor supply (0.5–25 KVAR, up to 150 KVAR banks) for industrial buyers seeking to reduce electricity demand charges, improve voltage stability, and minimize equipment downtime.
            </p>
          </div>

          {/* Eyebrows Row (Frame 14) */}
          <div className="flex flex-wrap items-center gap-6 text-[15px] font-medium tracking-[0.02em] text-white sm:text-[16px]">
            <span className="inline-flex items-center gap-2">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              REDUCE ENERGY COSTS
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              IMPROVE POWER QUALITY
            </span>
          </div>

          {/* Thin White Rule */}
          <div className="my-5 h-px w-full bg-white/50" />

          {/* Heading and Action Buttons Grid */}
          <div className="relative">
            <div className="lg:max-w-[70%]">
              <h1 className="max-w-[1281px] text-[44px] font-light leading-[1.0] tracking-[-3px] text-white sm:text-[68px] md:text-[84px] lg:text-[104px] lg:tracking-[-5px]">
                Industrial Power Factor
                <br />
                Correction Solutions
              </h1>

              {/* Frame 15: Action buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-4 lg:mt-8">
                <Link
                  href="/contact?category=industrial#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex h-[56px] w-[200px] items-center justify-between bg-[#58C7E8] px-4 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-[#020202]">Request Power Audit</span>
                  <ArrowRight size={18} className="!text-[#020202] shrink-0" />
                </Link>

                <Link
                  href="/contact?category=bulk#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex h-[56px] w-[200px] items-center justify-between bg-white px-4 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">Request Bulk Quote</span>
                  <FileText size={18} className="!text-[#020202] shrink-0" />
                </Link>
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

        {/* Bottom-Left Angled White Cutout */}
        <div
          aria-hidden="true"
          style={{
            clipPath: "polygon(0 0, calc(100% - 48px) 0, 100% 100%, 0 100%)",
          }}
          className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-[48px] w-[58%] bg-white lg:block xl:h-[56px] xl:w-[62%]"
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. THE COST OF POOR POWER FACTOR (Projects List)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-24">
        <div className="mx-auto max-w-[1920px]">
          {/* Eyebrow and Heading Grid (Frame 151) */}
          <div className="grid gap-6 lg:grid-cols-[680px_1fr] lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                THE COST OF POOR POWER FACTOR
              </div>
              <h2 className="mt-4 text-[36px] font-normal leading-[56px] tracking-[-2.88px] text-[#121212] sm:text-[44px] lg:text-[48px]">
                Are You Paying Penalty Charges for Low Power Factor?
              </h2>
            </div>
            <div className="flex justify-end">
              <p className="max-w-[612px] text-[18px] font-normal leading-[140%] text-[#595959] sm:text-[20px] lg:text-[24px]">
                Most industrial facilities in India operate at a power factor of 0.75–0.85, well below the 0.95 threshold required by most state electricity boards.
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Projects List (3 Cards: 1512px x 864px) */}
          <div
            ref={projectCardsScrollRef}
            className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 lg:mt-16"
          >
            {/* Card 1: Power Factor Penalties */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[864px] lg:w-[1512px]">
              <img
                src="/figma/solutions/industrial-penalty.png"
                alt="Power Factor Penalties"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.157)] to-[rgba(10,10,10,0.65)]" />

              {/* Bottom Left Title */}
              <div className="absolute bottom-10 left-8 flex flex-col gap-3 sm:bottom-14 sm:left-12">
                <div className="grid h-8 w-8 place-items-center opacity-70">
                  <FileText size={28} className="text-white" />
                </div>
                <h3 className="text-[32px] font-normal tracking-[-2px] text-white sm:text-[40px] lg:text-[48px]">
                  Power Factor Penalties
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="text-[15px] font-normal leading-[140%] text-white/80 sm:text-[16px]">
                  Facilities operating below 0.95 power factor face penalty charges of ₹1–3 per KVA of reactive power, adding significant costs to monthly electricity bills.
                </p>
                <div className="text-[26px] font-normal leading-[140%] text-white/90 sm:text-[32px]">
                  ₹5–20 Lakhs Annual Penalty
                </div>
              </div>
            </div>

            {/* Card 2: Success Stories */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[864px] lg:w-[1512px]">
              <img
                src="/figma/solutions/946c5.png"
                alt="Success Stories"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.157)] to-[rgba(10,10,10,0.65)]" />

              {/* Bottom Left Title */}
              <div className="absolute bottom-10 left-8 flex flex-col gap-3 sm:bottom-14 sm:left-12">
                <div className="grid h-8 w-8 place-items-center opacity-70">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <h3 className="text-[32px] font-normal tracking-[-2px] text-white sm:text-[40px] lg:text-[48px]">
                  Success Stories
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="text-[15px] font-normal leading-[140%] text-white/80 sm:text-[16px]">
                  See how OEMs, dealers, and industrial buyers achieved cost savings, efficiency gains, and growth with CAPCO capacitors.
                </p>
                <Link
                  href="/solutions/oem"
                  className="inline-flex h-[56px] w-[230px] items-center justify-between bg-white px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">View Case Studies</span>
                  <ArrowRight size={18} className="!text-[#020202]" />
                </Link>
              </div>
            </div>

            {/* Card 3: Industry Trends & Best Practices */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[864px] lg:w-[1512px]">
              <img
                src="/figma/solutions/caf7c.png"
                alt="Industry Trends & Best Practices"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.157)] to-[rgba(10,10,10,0.65)]" />

              {/* Bottom Left Title */}
              <div className="absolute bottom-10 left-8 flex flex-col gap-3 sm:bottom-14 sm:left-12">
                <div className="grid h-8 w-8 place-items-center opacity-70">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h3 className="text-[32px] font-normal tracking-[-2px] text-white sm:text-[40px] lg:text-[48px]">
                  Industry Trends & Best Practices
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="text-[15px] font-normal leading-[140%] text-white/80 sm:text-[16px]">
                  Power factor correction guides, capacitor selection tips, and updates on Indian electrical manufacturing.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex h-[56px] w-[230px] items-center justify-between bg-white px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">Read Latest Insights</span>
                  <ArrowRight size={18} className="!text-[#020202]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THREE WAYS CAPCO HELPS INDUSTRIAL BUYERS (Frame 31)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F5] px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                OUR SOLUTIONS
              </div>
              <h2 className="mt-4 text-[36px] font-normal leading-[100%] tracking-[-2px] text-[#020202] sm:text-[44px] lg:text-[48px]">
                Three Ways Capco Helps
                <br />
                Industrial Buyers
              </h2>
            </div>

            <Link
              href="/contact?category=industrial#enquiry-form"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex h-[56px] w-[300px] items-center justify-center bg-[#58C7E8] px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#000000] transition hover:brightness-105"
            >
              <span className="!text-[#000000]">Request Power Audit</span>
            </Link>
          </div>

          {/* 3 Distinct Full-width Rows (Frame 119) */}
          <div className="mt-14 flex flex-col gap-8 lg:mt-16">
            {waysCapcoHelps.map((way) => {
              const IconComp = way.icon;
              return (
                <div
                  key={way.id}
                  className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"
                >
                  {/* Left Label & Divider */}
                  <div className="flex flex-1 items-center gap-6">
                    <span className="text-[28px] font-medium uppercase leading-[120%] text-[#595959] sm:text-[32px] lg:text-[36px]">
                      {way.tabLabel}
                    </span>
                    <div className="hidden h-[2px] flex-1 bg-[#DBDBDB] lg:block" />
                  </div>

                  {/* Right Card (902px x 394px) with Chamfered Bottom-Right Corner */}
                  <div
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)",
                    }}
                    className="flex flex-col justify-between bg-white p-8 lg:h-[394px] lg:w-[902px] lg:p-[42px]"
                  >
                    <div>
                      {/* 64px Icon Box */}
                      <div className="grid h-16 w-16 place-items-center bg-[#DEDEDE]/40">
                        <IconComp size={28} className="text-[#595959]" />
                      </div>

                      <h3 className="mt-6 text-[22px] font-normal leading-[120%] text-[#020202] sm:text-[24px] lg:text-[26px]">
                        {way.title}
                      </h3>

                      <p className="mt-4 text-[16px] font-normal leading-[140%] text-[#595959] lg:text-[18px]">
                        {way.body}
                      </p>
                    </div>

                    <div>
                      <div className="my-6 h-px w-full bg-[#DBDBDB]" />

                      <div className="flex flex-wrap items-center gap-6">
                        <Link
                          href={way.href}
                          className="inline-flex h-[36px] w-[187px] items-center justify-center bg-[#58C7E8] text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:brightness-105"
                        >
                          <span className="!text-[#020202]">{way.cta}</span>
                        </Link>

                        <div className="hidden h-[26px] w-[1px] bg-[#DBDBDB] sm:block" />

                        <span className="text-[14px] font-medium leading-[120%] text-[#595959]">
                          {way.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CLIENT LOGOS BAR (Frame 22 - 5 Columns with Dividers)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-[#E4E4E4] bg-white">
        <div className="mx-auto max-w-[1920px]">
          <div className="grid grid-cols-2 divide-x divide-[#E4E4E4] sm:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex h-[180px] items-center justify-center px-6 transition hover:opacity-80 lg:h-[216px]"
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

      {/* ─────────────────────────────────────────────────────────────
          5. BROWSE BY PRODUCT CATEGORY (Frame 45 - 6 Bento Grid Cards)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                COMPLETE CAPACITOR SOLUTIONS
              </div>
              <h2 className="mt-4 text-[36px] font-normal leading-[100%] tracking-[-2px] text-[#020202] sm:text-[44px] lg:text-[48px]">
                Browse by Product Category
              </h2>
            </div>

            <a
              href="/catalogs/capco-product-catalog.pdf"
              download="CAPCO-Complete-Product-Catalog.pdf"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex h-[56px] w-[300px] items-center justify-between bg-[#58C7E8] px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:brightness-105"
            >
              <span className="!text-[#020202]">Download Complete Catalog (PDF)</span>
              <Download size={18} className="!text-[#020202]" />
            </a>
          </div>

          {/* 6 Bento Grid Cards (2 Rows of 3, each 572px x 389px) */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {industrialProducts.map((prod) => (
              <div
                key={prod.code}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)",
                }}
                className="group relative flex flex-col justify-between bg-[#F5F5F5] p-8 transition-all duration-300 hover:bg-[#EAEAEA] lg:h-[389px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#DEDEDE]/40 px-3 py-1.5 text-[14px] font-normal text-[#020202]">
                      {prod.tag}
                    </span>
                    <span className="text-[18px] font-medium leading-[120%] text-[#58C7E8]">
                      {prod.code}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[22px] font-normal text-[#020202]">
                    {prod.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-[140%] text-[#595959]">
                    {prod.body}
                  </p>
                </div>

                <div>
                  <div className="my-5 border-t border-[#DCDCDC] pt-4">
                    <div className="space-y-1.5 text-[12px] text-[#555]">
                      {prod.specs.map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span>{label}</span>
                          <span className="font-semibold text-[#121212]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/products/${prod.slug}`}
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-[#020202] transition hover:text-[#0092CA]"
                  >
                    <span>{prod.cta}</span>
                    <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. DEALERSHIP SUCCESS STORIES CAROUSEL
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1920px]">
          {/* Header Row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[4px] w-[4px] bg-[#00E05C]" />
                Proven Partnerships
              </div>
              <h2 className="mt-4 text-[38px] font-normal leading-[56px] tracking-[-2.88px] text-[#121212] sm:text-[48px] lg:text-[56px]">
                Dealership Success Stories
              </h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <span className="mr-3 font-mono text-[10px] text-[#595959]">
                0{activeStoryIndex + 1}/0{successStories.length}
              </span>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex - 1)}
                className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F5F5F5] text-[#121212] transition hover:bg-[#E5E5E5]"
                aria-label="Previous story"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex + 1)}
                className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F5F5F5] text-[#121212] transition hover:bg-[#E5E5E5]"
                aria-label="Next story"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Cards Carousel (1512px x 864px each) */}
          <div
            ref={storiesScrollRef}
            className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
          >
            {successStories.map((story) => (
              <div
                key={story.title}
                data-story-card
                className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[864px] lg:w-[1512px]"
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.157)] to-[rgba(10,10,10,0.65)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
                  <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-[760px]">
                      <span className="font-mono text-[11px] tracking-[1.1px] text-white/70">
                        [2025]
                      </span>
                      <h3 className="mt-3 text-[32px] font-normal leading-[1.1] tracking-[-1.44px] text-white sm:text-[42px] lg:text-[48px]">
                        {story.title}
                      </h3>
                      <p className="mt-4 max-w-[620px] text-[15px] leading-[1.6] text-white/80">
                        {story.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-6 backdrop-blur-[14px] sm:p-8 lg:w-[480px]">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        {story.stats.map((st) => (
                          <div key={st.label}>
                            <span className="font-mono text-[11px] text-white/60">{st.label}</span>
                            <strong className="block text-[22px] font-light text-white sm:text-[26px]">
                              {st.value}
                            </strong>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedStory(story)}
                        className="inline-flex items-center justify-between text-[13px] font-medium text-white transition hover:text-[#58C7E8]"
                      >
                        <span>Read Full Case Study</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Popup Modal */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[24px] bg-[#1A1A1A] p-8 text-white shadow-2xl sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
            <span className="font-mono text-[11px] text-[#58C7E8]">{selectedStory.clientTag}</span>
            <h3 className="mt-3 text-[28px] font-light leading-snug tracking-tight sm:text-[34px]">
              {selectedStory.title}
            </h3>
            <div className="my-6 grid grid-cols-3 gap-4 border-y border-white/10 py-4">
              {selectedStory.stats.map((st) => (
                <div key={st.label}>
                  <span className="font-mono text-[11px] text-white/60">{st.label}</span>
                  <strong className="block text-[24px] font-light text-white">{st.value}</strong>
                </div>
              ))}
            </div>
            <p className="text-[15px] leading-[1.8] text-white/85">{selectedStory.fullText}</p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. EVERYTHING YOU NEED TO KNOW (Exact 8 FAQ Items)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
              <span className="h-[4px] w-[4px] bg-[#58C7E8]" />
              Quick Answers
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[55px] tracking-[-2.4px] text-[#121212] sm:text-[44px] lg:text-[48px]">
              Everything You Need to Know
            </h2>
          </div>

          <div className="mt-14 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-[16px] bg-[#F7F7F7] transition hover:bg-[#F2F2F2]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between p-6 text-left sm:p-7"
                  >
                    <span className="text-[17px] font-normal text-[#121212] sm:text-[18px]">
                      {item.q}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white">
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-[15px] leading-[1.7] text-[#555] sm:px-7 sm:pb-7">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. WHERE WE OPERATE (Interactive Map Section)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#6D6D6D] to-[#424242] px-6 py-20 text-white lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-white">
              <span className="h-[4px] w-[4px] bg-[#00E05C]" />
              Global Footprint
            </div>
            <h2 className="mt-4 text-[42px] font-normal leading-[55px] tracking-[-2.4px] text-white sm:text-[48px]">
              Where We Operate
            </h2>
          </div>

          <div className="relative mt-12 min-h-[520px] w-full overflow-hidden rounded-[24px] bg-black/20 p-8">
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
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white bg-black/60 text-white">
                    {loc.type === "OPERATING SITE" ? "+" : loc.type === "OFFICE" ? "•" : "○"}
                  </span>
                </button>
              ))}

              {activeLocation && (
                <div
                  style={{
                    left: `${Math.min(Math.max(activeLocation.x, 15), 70)}%`,
                    top: `${Math.max(activeLocation.y - 32, 10)}%`,
                  }}
                  className="pointer-events-none absolute z-30 w-[280px] -translate-x-1/2 rounded-[16px] border border-white/20 bg-black/80 p-5 backdrop-blur-md"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#B5B5B5]">
                    {activeLocation.type}
                  </span>
                  <h4 className="mt-1 text-[16px] font-medium text-white">
                    {activeLocation.name}
                  </h4>
                  <p className="mt-0.5 text-[12px] text-[#B5B5B5]">
                    {activeLocation.detail}
                  </p>
                  <div className="my-2 h-px w-full bg-white/12" />
                  <p className="text-[12px] leading-[19px] text-white/70">
                    {activeLocation.body}
                  </p>
                </div>
              )}
            </div>

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

      {/* ─────────────────────────────────────────────────────────────
          9. PLANT FACILITIES (Frame 91 - Dark Section with Banner & Contacts)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#121212] px-6 py-20 text-white lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#58C7E8]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              LOCATIONS
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[100%] tracking-[-2px] text-white sm:text-[44px] lg:text-[48px]">
              Plant Facilities
            </h2>
          </div>

          {/* Large Facility Banner (1800px x 864px in Figma) */}
          <div className="relative mt-12 w-full overflow-hidden rounded-[32px] bg-[#1a1a1a] sm:h-[600px] lg:mt-16 lg:h-[864px]">
            <img
              src="/figma/solutions/plant-facilities-bg.png"
              alt="DADA Energies CAPCO global manufacturing hub plant facilities"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Bottom-right Overlay Glass Badge */}
            <div className="absolute bottom-6 right-6 max-w-[560px] rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-10 sm:right-10">
              <p className="text-[15px] font-normal leading-[140%] text-white/80 sm:text-[16px]">
                DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village, Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.
              </p>
              <div className="mt-6">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=DADA+ENERGIES+TSIIC+Automotive+Park+Muppireddypally+Telangana+502336"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[56px] w-[280px] items-center justify-between bg-white px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">Get Directions on Google Maps</span>
                  <ExternalLink size={18} className="!text-[#020202] shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Circles Row (Frame 150) */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-14">
            {/* Commercial Desk Phone */}
            <div className="flex flex-col items-start gap-4">
              <span className="text-[16px] font-normal leading-[120%] text-white/50">
                COMMERCIAL DESK PHONE
              </span>
              <a
                href="tel:+919848014000"
                className="group flex flex-col items-start gap-4 transition"
              >
                <div className="grid h-[156px] w-[156px] place-items-center rounded-full border border-white/50 transition group-hover:border-white group-hover:bg-white/10">
                  <Headphones size={38} className="text-white" />
                </div>
                <strong className="text-[18px] font-normal leading-[140%] text-white transition group-hover:text-[#58C7E8]">
                  +91 98480 14000
                </strong>
              </a>
            </div>

            {/* Department Email Desk */}
            <div className="flex flex-col items-start gap-4">
              <span className="text-[16px] font-normal leading-[120%] text-white/50">
                DEPARTMENT EMAIL DESK
              </span>
              <a
                href="mailto:sales@capcocapacitor.com"
                className="group flex flex-col items-start gap-4 transition"
              >
                <div className="grid h-[156px] w-[156px] place-items-center rounded-full border border-white/50 transition group-hover:border-white group-hover:bg-white/10">
                  <Mail size={38} className="text-white" />
                </div>
                <strong className="text-[18px] font-normal leading-[140%] text-white transition group-hover:text-[#58C7E8]">
                  sales@capcocapacitor.com
                </strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. JOIN 5,000+ CAPCO DEALERS (CTA Section)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#121212] px-6 py-28 text-white lg:px-[60px] lg:py-36">
        {/* Radar Rings Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
        >
          <div className="h-[420px] w-[420px] rounded-full border border-dashed border-white/30 sm:h-[620px] sm:w-[620px] lg:h-[820px] lg:w-[820px]" />
          <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-white/20 sm:h-[420px] sm:w-[420px] lg:h-[580px] lg:w-[580px]" />
          <div className="absolute h-[140px] w-[140px] rounded-full border border-white/10 sm:h-[220px] sm:w-[220px] lg:h-[320px] lg:w-[320px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[796px] text-center">
          <h2 className="text-[36px] font-normal leading-[55px] tracking-[-2.4px] text-white sm:text-[44px] lg:text-[48px]">
            Join 5,000+ Successful CAPCO Dealers
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] text-[16px] leading-[140%] text-white/80 sm:text-[18px]">
            Whether you&apos;re a regional distributor or a specialized industrial supplier, Capco Capacitors offers the margins, marketing support, and brand equity to grow your business profitably.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact?category=dealership#enquiry-form"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] min-w-[240px] items-center justify-between gap-6 bg-[#4D82F3] px-6 py-3.5 text-[15px] font-medium leading-[1.2] !text-white transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <span className="!text-white">Apply for Dealership</span>
              <ArrowRight size={18} className="!text-white shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. PUBLIC FOOTER
         ───────────────────────────────────────────────────────────── */}
      <PublicFooter />
    </main>
  );
}
