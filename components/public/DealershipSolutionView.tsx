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
} from "lucide-react";
import {
  PublicFooter,
  PublicNav,
} from "@/components/public/PublicChrome";

const dealerAdvantages = [
  {
    num: "01",
    label: "STEP 01",
    title: "High-Demand Product Range",
    dial: "/figma/solutions/28730.svg",
    body: "From 0.5 MFD fan capacitors to 150 KVAR capacitor banks: serve residential, commercial, and industrial customers with one portfolio.",
  },
  {
    num: "02",
    label: "STEP 02",
    title: "BIS & CE Certified",
    dial: "/figma/solutions/88be3.svg",
    body: "Every product carries BIS, ISO 9001:2008, and CE marks: eliminating compliance objections in tenders and OEM specifications.",
  },
  {
    num: "03",
    label: "STEP 03",
    title: "Vertical Integration Advantage",
    dial: "/figma/solutions/a7ea4.svg",
    body: "In-house Leybold metallization and Metar winding means better pricing, faster replenishment, and zero supply disruptions.",
  },
  {
    num: "04",
    label: "STEP 04",
    title: "Pan-India Dealer Network",
    dial: "/figma/solutions/db991.svg",
    body: "Join 5000+ authorized dealers across 20+ states with protected territories and no channel conflict.",
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

const dealershipFaqs = [
  {
    q: "What is the minimum order quantity (MOQ) for dealers?",
    a: "Initial dealer stock orders start at ₹50,000 across mixed product categories, with flexible reorder quantities to support fast inventory turnover.",
  },
  {
    q: "How do I check my MDF balance?",
    a: "Authorized dealers can access their Market Development Fund (MDF) balance through the Dealer Portal, updated weekly based on invoiced dispatch volumes.",
  },
  {
    q: "Can I return unsold inventory?",
    a: "We offer seasonal inventory rotation for active dealers in good standing, allowing slow-moving SKUs to be exchanged for high-velocity fast-moving variants.",
  },
  {
    q: "How do I register a customer for territory protection?",
    a: "Dealers can log project tenders and OEM accounts through our Territory Protection Registry in the dealer dashboard to lock exclusive supply rights.",
  },
  {
    q: "What if a customer contacts Capco Capacitors directly?",
    a: "Direct customer and contractor inquiries originating from your territory are routed straight to our authorized regional dealer with protected margins.",
  },
  {
    q: "How do I request urgent stock during peak season?",
    a: "Dealers enjoy dedicated emergency dispatch priority from our regional buffer warehouses in Hyderabad and North India within 24–48 hours.",
  },
  {
    q: "Is training provided for new dealers?",
    a: "Yes. Our sales engineering team conducts hands-on product selection training, technical teardowns, and application sizing workshops for your team.",
  },
  {
    q: "Can I sell CAPCO products online (e-commerce)?",
    a: "Authorized dealers may sell through approved B2B e-commerce platforms subject to CAPCO Minimum Advertised Pricing (MAP) brand guidelines.",
  },
] as const;

export function DealershipSolutionView() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<(typeof successStories)[number] | null>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);
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
      {/* 1. Hero Section (Strictly 100vh on Desktop including Navbar) */}
      <section className="relative flex h-screen min-h-[720px] max-h-[1194px] flex-col justify-between overflow-hidden bg-[#101010] text-white">
        <img
          src="/figma/solutions/22cfa.png"
          alt="Power transmission grid infrastructure across landscape"
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
              Join India&apos;s most trusted capacitor dealer network: competitive margins, co-branded marketing support, and 30+ years of brand equity behind every sale.
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
                Grow Your Business
                <br />
                with Capco Capacitors
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4 lg:mt-8">
                <Link
                  href="/contact?category=dealership#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[274px] items-center justify-between gap-6 bg-[#58C7E8] px-4 py-3 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-[#121212]">Apply for Dealership</span>
                  <ArrowRight size={18} className="!text-[#121212] shrink-0" />
                </Link>

                <a
                  href="/catalogs/capco-product-catalog.pdf"
                  download="CAPCO-Dealership-Solutions.pdf"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[200px] items-center justify-between gap-4 bg-white px-4 py-3 text-[14px] font-medium leading-[1.2] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">View Dealership</span>
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

      {/* 2. A Brand That Sells Itself (Sticky Stacking Cards Scroll Effect) */}
      <section id="dealership-overview" className="relative z-10 bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_874px] lg:gap-16">
            {/* Left Column: Sticky Header & Action Button */}
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[4px] w-[4px] bg-[#00E05C]" />
                30+ Years of Market Trust
              </div>
              <h2 className="mt-5 text-[38px] font-normal leading-[1.0] tracking-[-2.88px] text-[#121212] sm:text-[48px] lg:text-[56px]">
                A Brand That
                <br />
                Sells Itself
              </h2>

              <div className="mt-8">
                <Link
                  href="/contact?category=dealership#enquiry-form"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[260px] items-center justify-between gap-6 bg-[#0092CA] px-5 py-3 text-[14px] font-medium leading-[1.2] !text-white transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-white">Download OEM Partnership Guide</span>
                  <ArrowRight size={16} className="!text-white shrink-0" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Step Rows with Stacking Cards Scroll Effect */}
            <div className="flex flex-col gap-8 pb-12">
              {dealerAdvantages.map((step, idx) => (
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

      {/* 3. Where We Operate (Interactive Map Section) */}
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

              {/* Active Site Popup Card */}
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

      {/* 4. Plant Facilities */}
      <section className="bg-[#000000] px-6 py-20 text-white lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#58C7E8]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              LOCATIONS
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-white sm:text-[48px] lg:text-[56px]">
              Plant Facilities
            </h2>
          </div>

          {/* Large Facility Image with Translucent Address Badge */}
          <div className="relative mt-12 w-full overflow-hidden rounded-[24px] bg-[#1a1a1a] sm:h-[600px] lg:mt-16 lg:h-[720px]">
            <img
              src="/figma/solutions/plant-facilities-bg.png"
              alt="DADA Energies CAPCO global manufacturing hub plant facilities"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Address Badge at Bottom Right */}
            <div className="absolute bottom-6 right-6 max-w-[440px] rounded-[16px] border border-white/20 bg-black/75 p-6 backdrop-blur-md sm:bottom-10 sm:right-10 sm:p-8">
              <p className="text-[13px] leading-[1.6] text-white/90 sm:text-[14px]">
                DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village, Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.
              </p>
              <div className="mt-5">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=DADA+ENERGIES+TSIIC+Automotive+Park+Muppireddypally+Telangana+502336"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-white px-4 py-2.5 text-[13px] font-medium !text-[#0A0A0A] transition hover:bg-white/90"
                >
                  <span className="!text-[#0A0A0A]">Get Directions on Google Maps</span>
                  <ExternalLink size={14} className="!text-[#0A0A0A] shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Two Contact Desk Cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:gap-10">
            <a
              href="tel:+919848014000"
              className="flex items-center gap-5 rounded-[16px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 sm:p-8"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                <Headphones size={24} />
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#58C7E8]">
                  COMMERCIAL DESK PHONE
                </span>
                <strong className="mt-1 block text-[20px] font-medium text-white sm:text-[24px]">
                  +91 98480 14000
                </strong>
              </div>
            </a>

            <a
              href="mailto:sales@capcocapacitor.com"
              className="flex items-center gap-5 rounded-[16px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 sm:p-8"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                <Mail size={24} />
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#58C7E8]">
                  DEPARTMENT EMAIL DESK
                </span>
                <strong className="mt-1 block text-[20px] font-medium text-white sm:text-[24px]">
                  sales@capcocapacitor.com
                </strong>
              </div>
            </a>
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

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-mono text-[#8C8C8C]">
                0{activeStoryIndex + 1}/0{successStories.length}
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

          {/* Stories Track */}
          <div
            ref={storiesScrollRef}
            className="mt-12 flex gap-6 overflow-x-auto pb-4 scrollbar-none"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {successStories.map((story) => (
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

      {/* 6. Everything You Need to Know (FAQ Accordion Cards) */}
      <section className="bg-white px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          {/* Eyebrow & Title */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              Quick Answers
            </div>
            <h2 className="mt-4 text-[38px] font-normal leading-[1.0] tracking-[-2px] text-[#020202] sm:text-[48px] lg:text-[56px]">
              Everything You Need to Know
            </h2>
          </div>

          {/* Accordion Cards */}
          <div className="mt-12 flex flex-col gap-4">
            {dealershipFaqs.map((faq, idx) => {
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

      {/* 7. Join 5,000+ Successful CAPCO Dealers (Radar Background) */}
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
            Join 5,000+ Successful CAPCO Dealers
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-relaxed text-[#A1A1A1] sm:text-[18px]">
            Whether you&apos;re a regional distributor or a specialized industrial supplier, Capco Capacitors offers the margins, marketing support, and brand equity to grow your business profitably.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/contact?category=dealership#enquiry-form"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] min-w-[240px] items-center justify-between gap-6 bg-[#4E76F5] px-6 py-3.5 text-[15px] font-semibold !text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <span className="!text-white">Apply for Dealership</span>
              <ArrowRight size={18} className="!text-white shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Public Footer */}
      <PublicFooter hideCta={true} />
    </main>
  );
}
