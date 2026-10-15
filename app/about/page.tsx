"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PublicFaqSection,
  PublicFooter,
  PublicNav,
  ReadyToSpecifyCapcoSection,
} from "@/components/public/PublicChrome";

const HERO_STATS = [
  ["IS:2993 / IS:13340", "BIS Certified"],
  ["ISO 9001:2008", "TUV/5GS Audited"],
  ["IEC 60252-1", "EU Directives"],
  ["IEC 60831-1/2", "Self-Healing Dry"],
  ["500+ Dealers", "Pan-India Stock"],
  ["15+ Nations", "Direct Exporter"],
  ["32+ Years", "Est. 1994"],
] as const;

const JOURNEY_HIGHLIGHTS = [
  {
    num: "/001",
    stat: "500+",
    title: "Authorized Distributors",
    body: "Spanning 20+ states with assured depot inventory, rapid logistics, zero margin undercutting, and full dealer replacement warranty guarantee.",
    bg: "bg-[#EEFAFF]",
  },
  {
    num: "/002",
    stat: "100+",
    title: "Tier-1 OEM Partnerships",
    body: "Direct vendor code approval with leading air conditioning, submersible pump, industrial motor, and ballast assembly manufacturers.",
    bg: "bg-[#F4F4F4]",
  },
  {
    num: "/003",
    stat: "32+",
    title: "Years In Industrial Market",
    body: "Uninterrupted field longevity. Continuous manufacturing reliability with failure rates under 15 PPM across heavy duty switching cycles.",
    bg: "bg-[#EEFAFF]",
  },
] as const;

const AFFILIATIONS = [
  "IEEMA Member",
  "FICCI Industrial Council",
  "Indian Standard Association (ISA)",
  "GCC Chamber of Commerce Approved",
] as const;

const TIMELINE_DATA = [
  { year: "1994", tagline: "The Journey of CAPCO Begins" },
  { year: "1996", tagline: "BIS Certification for KVAR Capacitors" },
  { year: "2005", tagline: "In-House Metallization Capability" },
  { year: "2012", tagline: "Exports to Global Markets" },
  { year: "2016", tagline: "Dedicated Motor Capacitor Plant" },
  { year: "2020", tagline: "BIS Certification for Motor Run Capacitors" },
  { year: "2023", tagline: "Advanced Manufacturing Facility" },
  { year: "2025", tagline: "Motor Start Capacitor License" },
] as const;

const FACILITIES = [
  {
    tag: "PLANT 01 — AUTOMOTIVE PARK",
    title: "TSIIC Automotive Park, Medak",
    badge: "750K UNITS / MO",
    body: "Our flagship heavy manufacturing campus commissioned in 2016. Houses vacuum metallization chambers, automated Swiss winding cells, and the primary corporate testing laboratory.",
    specs: [
      ["Built-up Industrial Footprint", "50,000 Sq Ft"],
      ["Metallization Infrastructure", "Leybold (Germany) Line"],
      ["Automated Winding Lines", "10x Metar Swiss Stations"],
      ["Encapsulation Facilities", "5x Automated Stations"],
      ["Test Lab Level", "NABL Calibrated"],
    ],
  },
  {
    tag: "PLANT 02 — INDUSTRIAL PARK",
    title: "Jeedimetla Industrial Estate, Hyderabad",
    badge: "300K UNITS / MO",
    body: "Our historical operating facility established in 1994. Reconfigured for custom engineered runs, rapid turnaround OEM prototype lots, and lighting capacitor manufacturing.",
    specs: [
      ["Built-up Industrial Footprint", "30,000 Sq Ft"],
      ["Core Focus", "Lighting & APFC Modules"],
      ["Automated Winding Lines", "5x Metar Swiss Stations"],
      ["Encapsulation Facilities", "3x Encapsulation Units"],
      ["Quality Control Station", "Internal Verification Bay"],
    ],
  },
] as const;

const FACILITY_KPIS = [
  ["1,050,000", "TOTAL MONTHLY UNITS"],
  ["₹100+ Cr", "ANNUAL TURNOVER"],
  ["250+", "SKILLED WORKFORCE"],
  ["15+", "R&D ENGINEERS"],
  ["25+", "FULL-TIME QC STAFF"],
  ["15%", "EXPORT PRODUCTION"],
] as const;

const CSR_PILLARS = [
  {
    eyebrow: "500 KW SOLAR ROOFTOP",
    title: "Environmental Care",
    body: "Zero Liquid Discharge (ZLD) plant architecture with a 500 kW rooftop solar array providing over 30% of total electrical energy. 100% lead-free, non-PCB formulation throughout.",
    icon: "solar",
  },
  {
    eyebrow: "5,000+ FARMERS BENEFITED",
    title: "Farmer Community Support",
    body: "Annual free agricultural capacitor drive donating thousands of heavy-duty pump capacitors to local smallholders in rural Telangana, reducing pump burnout caused by erratic voltages.",
    icon: "tractor",
  },
  {
    eyebrow: "92% RETENTION RATE",
    title: "Employee Welfare & Up-skilling",
    body: "Comprehensive health insurance coverage for all line technicians, on-site technical apprenticeship programs with local ITI institutions, and an active women-led assembly squad.",
    icon: "users",
  },
  {
    eyebrow: "ZERO LOST-TIME INCIDENTS",
    title: "Occupational Safety",
    body: "Strict adherence to international industrial safety standards. Regular third-party electrical audits, continuous ventilation monitoring, and zero lost-time accidents record over 48 months.",
    icon: "shield-plus",
  },
] as const;

const ABOUT_FAQS = [
  {
    q: "What is the minimum order quantity (MOQ) for OEM partnerships?",
    a: "Standard OEM production runs start at 1,000 units per specification, while prototype and validation lots can be supplied in sample quantities of 10 to 50 units.",
  },
  {
    q: "Can you match capacitors from other manufacturers?",
    a: "Yes. Our engineering lab can reverse-engineer or cross-reference existing imported or domestic capacitors to match exact capacitance, tan-delta, terminal, and housing dimensions.",
  },
  {
    q: "What is the typical lead time for custom capacitor development?",
    a: "Custom engineering samples are delivered within 7–10 working days, and full-scale mass production dispatch typically begins within 2–3 weeks of sample approval.",
  },
  {
    q: "Do you provide technical documentation for our compliance files?",
    a: "Every OEM and export shipment includes comprehensive BIS test certificates, NABL lab reports, RoHS/CE declarations of conformity, and dimensional CAD drawings.",
  },
  {
    q: "Can CAPCO support JIT delivery for our assembly lines?",
    a: "Yes. With a combined capacity of 1,050,000 units/month across our Medak and Jeedimetla plants plus regional depot stock, we support scheduled buffer and JIT replenishment.",
  },
  {
    q: "What industries do you currently serve as an OEM partner?",
    a: "We supply Tier-1 manufacturers across HVAC & air conditioning, submersible & agricultural pumps, consumer appliances, industrial APFC panels, and municipal lighting.",
  },
] as const;

function CsrIcon({ type }: { type: string }) {
  return (
    <div className="text-[#58C7E8]">
      {type === "solar" && (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v2M5.6 5.6l1.4 1.4M18.4 5.6L17 7M4 13h16l-2 7H6l-2-7zM9 13l-1 7M15 13l1 7M5 16.5h14" />
        </svg>
      )}
      {type === "tractor" && (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="7" cy="17" r="3" />
          <circle cx="18" cy="18" r="2" />
          <path d="M10 17h6M5 14h9l2-5h-5V5H8v4" />
        </svg>
      )}
      {type === "users" && (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      )}
      {type === "shield-plus" && (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      )}
    </div>
  );
}

function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

function ScrollTimelineSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const count = TIMELINE_DATA.length;
      const index = Math.min(count - 1, Math.floor(progress * count));
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMilestone = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = rect.top + scrollTop;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = containerTop + (idx / TIMELINE_DATA.length) * totalScrollable + 50;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      id="company-timeline"
      ref={containerRef}
      className="relative bg-[#FAFAFA] min-h-[350vh]"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden px-6 py-8 sm:py-12 lg:px-[80px] lg:py-14">
        {/* Top Header */}
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[800px]">
            <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              OUR JOURNEY
            </p>
            <h2 className="mt-3 text-[32px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[40px] lg:text-[48px]">
              32 Years of Growth, Innovation &amp; Compliance
            </h2>
          </div>

          <a
            href="/catalogs/capco-product-catalog.pdf"
            download="CAPCO-Company-Timeline.pdf"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
            }}
            className="inline-flex min-h-[50px] w-[300px] shrink-0 items-end justify-between bg-[#58C7E8] px-3.5 pb-2.5 pt-5 text-[13px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
          >
            <span className="!text-[#121212]">Download Detailed Timeline (PDF)</span>
            <img src="/figma/solutions/4e858.svg" alt="" aria-hidden="true" />
          </a>
        </div>

        {/* Center Display: Video 1 animation */}
        <div className="mx-auto my-auto flex w-full max-w-[1400px] items-center justify-center py-6">
          <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-10 md:flex-row md:items-center md:justify-center lg:gap-16">
            
            {/* Left: Animated Rolling Year Numbers */}
            <div className="relative h-[80px] w-[200px] overflow-hidden text-center sm:h-[110px] sm:w-[260px] md:text-right lg:h-[140px] lg:w-[320px]">
              <div
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translateY(-${activeIndex * (100 / TIMELINE_DATA.length)}%)`,
                  height: `${TIMELINE_DATA.length * 100}%`,
                }}
              >
                {TIMELINE_DATA.map((item, idx) => (
                  <div
                    key={item.year}
                    style={{ height: `${100 / TIMELINE_DATA.length}%` }}
                    className={`flex items-center justify-center md:justify-end text-[68px] sm:text-[96px] lg:text-[124px] font-light leading-none tracking-[-0.04em] transition-opacity duration-300 ${
                      idx === activeIndex
                        ? "text-[#020202] opacity-100"
                        : "text-[#B0B0B0] opacity-20"
                    }`}
                  >
                    {item.year}
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Horizontal Accent Connector Line (as in Video 1) */}
            <div className="hidden h-[2px] w-[50px] shrink-0 bg-[#E63946] sm:block md:w-[70px] lg:w-[100px] transition-transform duration-300" />

            {/* Right: Vertical List of Taglines */}
            <div className="flex max-w-[620px] flex-col gap-3.5 sm:gap-4 lg:gap-5">
              {TIMELINE_DATA.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.year}
                    type="button"
                    onClick={() => scrollToMilestone(idx)}
                    className={`group flex items-center text-left transition-all duration-500 cursor-pointer ${
                      isActive
                        ? "translate-x-2 text-[#020202] opacity-100"
                        : "text-[#8C8C8C] opacity-25 hover:opacity-50"
                    }`}
                  >
                    <span
                      className={`text-[17px] sm:text-[21px] lg:text-[26px] transition-all duration-300 ${
                        isActive ? "font-normal text-[#020202]" : "font-light text-[#8C8C8C]"
                      }`}
                    >
                      {item.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Milestone Progress Indicators */}
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between border-t border-[#E5E5E5] pt-4">
          <span className="text-[12px] uppercase tracking-[0.08em] text-[#595959]">
            Scroll to explore milestone: {activeIndex + 1} of {TIMELINE_DATA.length} ({TIMELINE_DATA[activeIndex].year})
          </span>
          <div className="flex gap-2">
            {TIMELINE_DATA.map((item, idx) => (
              <button
                key={item.year}
                type="button"
                onClick={() => scrollToMilestone(idx)}
                aria-label={`Jump to ${item.year}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-8 bg-[#58C7E8]"
                    : "w-2 bg-[#D9D9D9] hover:bg-[#A0A0A0]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [journeyRef, isJourneyInView] = useInView<HTMLElement>(0.12);

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. HERO SECTION — 100vh including Navbar */}
      <section className="relative flex min-h-[700px] flex-col justify-between overflow-hidden bg-[#101010] text-white lg:h-screen lg:max-h-screen">
        <Image
          src="/figma/about/hero-bg.jpg"
          alt="CAPCO cleanroom capacitor manufacturing line"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.12) 100%)",
          }}
        />

        <PublicNav variant="overlay" className="relative z-20 shrink-0" />

        <div className="relative z-10 mx-auto mt-auto w-full max-w-[1920px] px-6 pb-16 pt-8 lg:px-[60px] lg:pb-[108px] xl:pb-[124px]">
          <div className="max-w-[1800px]">
            {/* Eyebrows */}
            <div className="flex flex-wrap items-center gap-6">
              <span className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-normal text-white sm:text-[15px]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                SINCE 1994 | HYD-PLANT-01 6 02
              </span>
              <span className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-normal text-white sm:text-[15px]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                MAKE IN INDIA
              </span>
            </div>

            {/* White Horizontal Rule */}
            <div className="my-5 h-px w-full bg-white/50 lg:my-6 xl:my-8" />

            {/* Main Heading - Scaled down for balanced hero layout */}
            <h1 className="max-w-[1120px] text-[34px] font-light leading-[1.05] tracking-[-0.04em] text-white sm:text-[46px] lg:text-[58px] xl:text-[70px] 2xl:text-[78px] lg:leading-[1.06]">
              32+ Years of Capacitor
              <br />
              Manufacturing Excellence
            </h1>

            {/* Hero Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4 lg:mt-8 xl:mt-10">
              <a
                href="#manufacturing-line"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                }}
                className="inline-flex min-h-[54px] w-[260px] items-end justify-between bg-[#58C7E8] px-3 pb-3 pt-5 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                <span className="!text-[#121212]">Explore Manufacturing Line</span>
                <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
              </a>

              <a
                href="#company-timeline"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                }}
                className="inline-flex min-h-[54px] w-[218px] items-end justify-between bg-white px-4 pb-3 pt-5 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#F4F4F4]"
              >
                <span className="!text-[#121212]">Explore Timeline</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#121212"
                  strokeWidth="2"
                  aria-hidden="true"
                  className="shrink-0 text-[#121212]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom-Right Intro Paragraph */}
          <p className="mt-8 max-w-[600px] text-[15px] font-normal leading-[1.28] text-white/95 sm:text-[17px] lg:absolute lg:bottom-[26px] lg:right-[60px] lg:mt-0 lg:text-[18px] xl:bottom-[34px] xl:max-w-[645px] xl:text-[21px] lg:leading-[1.22]">
           CAPCO Capacitors is the flagship capacitor brand of Dada Energies (P) Ltd., a Hyderabad-based manufacturer established in 1994. Dada Energies provides the manufacturing strength and quality systems behind CAPCO’s motor run, PFC, lighting and custom capacitor solutions.
          </p>
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

      {/* 2. 7-COLUMN CERTIFICATIONS & METRICS BAR */}
      <section className="mt-8 border-y border-[#DBDBDB] bg-white py-6 lg:mt-[60px] lg:py-[40px]">
        <div className="mx-auto grid max-w-[1920px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
          {HERO_STATS.map(([title, subtitle], idx) => (
            <div
              key={title}
              className={`flex flex-col items-center justify-center gap-3 px-4 py-6 text-center lg:h-[178px] lg:gap-[16px] lg:py-0 ${
                idx < HERO_STATS.length - 1 ? "lg:border-r lg:border-[#DBDBDB]" : ""
              }`}
            >
              <strong className="text-[19px] font-medium leading-none tracking-[-0.04em] text-[#020202] sm:text-[22px] lg:text-[24px]">
                {title}
              </strong>
              <span className="text-[14px] font-normal leading-none text-[#595959] sm:text-[16px] lg:text-[18px]">
                {subtitle}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FULL-WIDTH GLOBAL MANUFACTURING HUB AERIAL BANNER */}
      <section className="mt-8 lg:mt-[60px]">
        <div className="relative mx-auto aspect-[1920/960] w-full max-w-[1920px] overflow-hidden bg-[#E5E5E5]">
          <Image
            src="/figma/about/global-hub-banner.png"
            alt="CAPCO Global Manufacturing Hub aerial view"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* 4. SPLIT "WHO WE ARE" SECTION */}
      <section className="mx-auto grid max-w-[1920px] lg:min-h-[673px] lg:grid-cols-[930fr_990fr]">
        {/* Left Hydroelectric Dam Image */}
        <div className="relative min-h-[360px] w-full overflow-hidden bg-[#1A1A1A] sm:min-h-[480px] lg:min-h-[673px]">
          <Image
            src="/figma/products/product-5.png"
            alt="High-voltage power infrastructure"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Right Dark Technical Copy Block */}
        <div
          style={{
            backgroundImage: 'url("/figma/products/product-11.png")',
            backgroundSize: "cover",
          }}
          className="flex flex-col justify-between bg-[#020202] px-6 py-12 text-white sm:px-10 lg:px-[60px] lg:py-[72px]"
        >
          <div>
            <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-white">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              WHO WE ARE
            </p>
            <h2 className="mt-5 max-w-[680px] text-[30px] font-normal leading-[1.14] tracking-[-0.03em] text-white sm:text-[38px] lg:mt-6 lg:text-[42px]">
              Vertically Integrated. Compliance-
              <br />
              Backed. Export-Ready.
            </h2>

            <div className="mt-7 max-w-[840px] space-y-4 text-[14px] font-normal leading-[1.48] text-white/85 lg:mt-8 lg:text-[15px]">
              <p>
                Established in 1994, Dada Energies Private Limited engineers high-integrity
                dielectric film capacitors under the trusted flagship brand CAPCO. Operating across
                two state-of-the-art facilities in Hyderabad, Telangana, we represent the vanguard
                of Indian electrical manufacturing-providing an uncompromising domestic alternative
                to unpredictable foreign imports.
              </p>
              <p>
                Our core technical differentiation lies in rigorous upstream control: from imported
                electrical-grade virgin BOPP film to our in-house German Leybold Optics high-vacuum
                metallizers and Swiss Metar high-speed winding stations. Every single microfarad is
                calibrated, pressurized, and sealed under strictly conditioned cleanroom parameters.
              </p>
              <p>
                Today, CAPCO serves three balanced commercial vectors: large-scale original
                equipment manufacturers (OEMs) in HVAC and water pumping, a protected distributor
                ecosystem of 500+ dealers with guaranteed 12-25% operational margin stability, and
                major utility/industrial APFC panel contractors. Through our international logistics
                division, we ship regularly to the UAE, Sri Lanka, Bangladesh, Turkey, Egypt, and
                North America.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] w-[218px] items-end justify-between bg-[#58C7E8] px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <span>Explore Our Products</span>
              <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
            </Link>

            <a
              href="/catalogs/capco-product-catalog.pdf"
              download="CAPCO-Company-Profile.pdf"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] w-[280px] items-end justify-between bg-white px-3 pb-3 pt-6 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#F4F4F4]"
            >
              <span className="!text-[#121212]">Download Company Profile (PDF)</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#121212"
                strokeWidth="2"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M12 4v12M6 10l6 6 6-6M4 20h16" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 5. OUR JOURNEY — 500+ DEALERS, 100+ OEM PARTNERS, 15+ EXPORT MARKETS */}
      <section ref={journeyRef} className="px-6 py-16 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div
            style={{
              opacity: isJourneyInView ? 1 : 0,
              transform: isJourneyInView ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-[680px]">
              <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                OUR JOURNEY
              </p>
              <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
                500+ Dealers, 100+ OEM Partners,
                <br />
                15+ Export Markets
              </h2>
            </div>
            <p className="max-w-[612px] text-[18px] font-normal leading-[1.35] text-[#595959] lg:text-[24px]">
              Supplying primary electrical power units to Tier-1 white goods manufacturers and
              critical sub-station grid installations nationwide.
            </p>
          </div>

          {/* 3 Stacked Clipped Highlight Cards with Scroll Stack-Up Animation */}
          <div className="relative mx-auto mt-12 flex max-w-[832px] flex-col gap-8 pb-12 lg:mt-[60px] lg:gap-10 lg:pb-24">
            {JOURNEY_HIGHLIGHTS.map((card, idx) => (
              <article
                key={card.num}
                style={{
                  top: `calc(100px + ${idx * 38}px)`,
                  zIndex: idx + 1,
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                }}
                className={`sticky ${card.bg} flex min-h-[260px] flex-col justify-between p-7 sm:p-10 lg:min-h-[295px] lg:p-[42px] transition-all duration-300 shadow-[0_-8px_24px_rgba(0,0,0,0.06),0_16px_36px_rgba(0,0,0,0.08)] border border-black/5 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-medium text-[#58C7E8]">{card.num}</span>
                  <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#595959]/75 sm:text-[13px]">
                    {card.stat} • {card.title}
                  </span>
                </div>
                <div className="mt-6">
                  <strong className="block text-[38px] font-medium leading-none tracking-[-0.03em] text-[#020202] lg:text-[48px]">
                    {card.stat}
                  </strong>
                  <h3 className="mt-4 text-[20px] font-normal leading-[1.2] text-[#020202] lg:text-[24px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[645px] text-[15px] leading-[1.42] text-[#595959] lg:text-[16px]">
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ENGINEERING SUPPLIER LOGOS & INDUSTRY AFFILIATIONS */}
      <section className="bg-[#F4F4F4] px-6 py-16 lg:px-[60px] lg:py-[72px]">
        <div className="mx-auto max-w-[1800px] text-center">
          <p className="inline-flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#020202]">
            <span className="h-[5px] w-[5px] bg-[#58C7E8]" />
            ENGINEERING SUPPLIER TO NATIONWIDE LEADERS &amp; GLOBAL DISTRIBUTORS
          </p>

          {/* 2x5 LGPSM Logo Grid */}
          <div className="mx-auto mt-10 grid max-w-[1180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }, (_, idx) => (
              <div
                key={idx}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                }}
                className="flex h-[66px] items-center justify-center gap-3 bg-white px-4"
              >
                <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
                  <path
                    d="M2 2h12l4 5h-5l-2-2.5H5v8h7l2-2.5h5l-4 5H2V2z"
                    fill="#58C7E8"
                  />
                  <path d="M15 9h9l-3 4h-6V9z" fill="#58C7E8" />
                </svg>
                <span className="text-[15px] font-bold tracking-[0.14em] text-[#0B1F3A]">
                  LGPSM
                </span>
              </div>
            ))}
          </div>

          {/* Industry Affiliations Row */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span className="mr-1 text-[13px] font-normal uppercase tracking-[0.02em] text-[#595959]">
              INDUSTRY AFFILIATIONS:
            </span>
            {AFFILIATIONS.map((badge) => (
              <span
                key={badge}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                }}
                className="inline-flex h-[34px] items-center bg-[#EAEAEA] px-3.5 text-[13px] font-normal text-[#020202]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 32 YEARS OF GROWTH, INNOVATION & COMPLIANCE TIMELINE (Interactive Scroll Ticker) */}
      <ScrollTimelineSection />

      {/* 8. LEADERSHIP — DECADES OF EXPERIENCE IN CAPACITOR MANUFACTURING */}
      <section
        id="manufacturing-line"
        className="bg-[#EEFAFF] px-6 py-16 lg:px-[60px] lg:py-[100px]"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                LEADERSHIP
              </p>
              <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
                Decades of Experience in Capacitor
                <br />
                Manufacturing
              </h2>
            </div>
            <p className="max-w-[612px] text-[18px] font-normal leading-[1.35] text-[#595959] lg:text-[24px]">
              Unlike assemblers who buy pre-metallized rolls of indeterminate origin, CAPCO controls
              all 4 stages of the capacitor manufacturing lifecycle.
            </p>
          </div>

          {/* 2x4 Manufacturing Lifecycle Bento Grid */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-[60px] lg:grid-cols-[1.34fr_1fr_1fr_1.34fr] lg:gap-y-8">
            {/* Row 1, Col 1: /001 BOPP Film Sourcing */}
            <article className="flex min-h-[341px] flex-col justify-between rounded-[16px] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-8">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="text-[18px] font-medium text-[#020202]">/001</span>
                <span className="text-[13px] uppercase text-[#595959]">DIELECTRIC BASELINE</span>
              </div>
              <div className="my-6">
                <h3 className="text-[18px] font-medium text-[#020202]">BOPP Film Sourcing</h3>
                <p className="mt-3 text-[14px] leading-[1.48] text-[#595959]">
                  Direct procurement of electrical-grade biaxially-oriented polypropylene. Incoming
                  raw film inspected for uniform thickness, pinhole count, and &gt;600 V/micron
                  dielectric strength.
                </p>
              </div>
              <span
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
                className="inline-flex h-[32px] self-start items-center bg-[#F4F4F4] px-3 text-[12px] font-medium text-[#020202]"
              >
                TOLERANCE: ±0.1 MICRON
              </span>
            </article>

            {/* Row 1, Col 2: Photo 01. LEYBOLD CHAMBER (MEDAK) */}
            <div className="relative min-h-[341px] overflow-hidden rounded-[16px] bg-[#D9E6EC]">
              <Image
                src="/figma/about/leybold-chamber.png"
                alt="01. Leybold Chamber (Medak)"
                fill
                sizes="(min-width: 1024px) 22vw, 92vw"
                className="object-cover"
              />
            </div>

            {/* Row 1, Col 3: Photo 02. METAR AUTOMATED LINE */}
            <div className="relative min-h-[341px] overflow-hidden rounded-[16px] bg-[#D9E6EC]">
              <Image
                src="/figma/about/metar-line.png"
                alt="02. Metar Automated Line"
                fill
                sizes="(min-width: 1024px) 22vw, 92vw"
                className="object-cover"
              />
            </div>

            {/* Row 1, Col 4: /003 Automated High-Speed Winding */}
            <article className="flex min-h-[341px] flex-col justify-between rounded-[16px] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-8">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="text-[18px] font-medium text-[#020202]">/003</span>
                <span className="text-[13px] uppercase text-[#595959]">METAR SWITZERLAND</span>
              </div>
              <div className="my-6">
                <h3 className="text-[18px] font-medium text-[#020202]">
                  Automated High-Speed Winding
                </h3>
                <p className="mt-3 text-[14px] leading-[1.48] text-[#595959]">
                  Swiss Metar non-inductive precision winders maintain strict tension control,
                  preventing micro-creasing and internal partial discharge. Capacitance held
                  precisely within ±5%.
                </p>
              </div>
              <span
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
                className="inline-flex h-[32px] self-start items-center bg-[#F4F4F4] px-3 text-[12px] font-medium text-[#020202]"
              >
                TOLERANCE: &lt; ±5.0% STD
              </span>
            </article>

            {/* Row 2, Col 1: /002 Vacuum Metallization */}
            <article className="flex min-h-[341px] flex-col justify-between rounded-[16px] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-8">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="text-[18px] font-medium text-[#020202]">/002</span>
                <span className="text-[13px] uppercase text-[#595959]">LEYBOLD HIGH-VACUUM</span>
              </div>
              <div className="my-6">
                <h3 className="text-[18px] font-medium text-[#020202]">Vacuum Metallization</h3>
                <p className="mt-3 text-[14px] leading-[1.48] text-[#595959]">
                  Zinc/Aluminium alloy vapor deposition executed inside Leybold Optics chambers.
                  Graded resistivity profile (6–9 Ω/sq) ensures optimum self-healing behavior under
                  voltage spikes.
                </p>
              </div>
              <span
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
                className="inline-flex h-[32px] self-start items-center bg-[#F4F4F4] px-3 text-[12px] font-medium text-[#020202]"
              >
                RESISTIVITY: 6-9 OHM/SQ
              </span>
            </article>

            {/* Row 2, Col 2: Photo 03. NABL IN-HOUSE LAB */}
            <div className="relative min-h-[341px] overflow-hidden rounded-[16px] bg-[#D9E6EC]">
              <Image
                src="/figma/about/nabl-lab.png"
                alt="03. NABL In-House Lab"
                fill
                sizes="(min-width: 1024px) 22vw, 92vw"
                className="object-cover"
              />
            </div>

            {/* Row 2, Col 3: Photo 04. AUTOMATED EXPORT PACKING */}
            <div className="relative min-h-[341px] overflow-hidden rounded-[16px] bg-[#D9E6EC]">
              <Image
                src="/figma/about/export-packing.png"
                alt="04. Automated Export Packing"
                fill
                sizes="(min-width: 1024px) 22vw, 92vw"
                className="object-cover"
              />
            </div>

            {/* Row 2, Col 4: /004 Encapsulation & Testing */}
            <article className="flex min-h-[341px] flex-col justify-between rounded-[16px] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-8">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="text-[18px] font-medium text-[#020202]">/004</span>
                <span className="text-[13px] uppercase text-[#595959]">100% ASSURANCE</span>
              </div>
              <div className="my-6">
                <h3 className="text-[18px] font-medium text-[#020202]">
                  Encapsulation &amp; Testing
                </h3>
                <p className="mt-3 text-[14px] leading-[1.48] text-[#595959]">
                  Resin-casting or environmentally sealed non-PCB oil impregnation. Integrated P2
                  over-pressure safety disconnectors followed by automated 100% high-voltage
                  withstand testing.
                </p>
              </div>
              <span
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
                className="inline-flex h-[32px] self-start items-center bg-[#F4F4F4] px-3 text-[12px] font-medium text-[#020202]"
              >
                SAFETY: P2 OVERPRESSURE
              </span>
            </article>
          </div>

          {/* Centered Schedule Virtual Factory Tour CTA */}
          <div className="mt-12 flex justify-center lg:mt-[56px]">
            <Link
              href="/contact#general-enquiry"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] w-[264px] items-end justify-between bg-[#58C7E8] px-3.5 pb-3 pt-6 text-[13px] font-medium leading-[1.2] text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <span>Schedule Virtual Factory Tour</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="2" y="6" width="14" height="12" rx="2" />
                <path d="M22 8l-6 4 6 4V8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>



      {/* 10. FACILITIES — TWO STRATEGIC LOCATIONS IN HYDERABAD, TELANGANA */}
      <section className="px-6 py-16 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                FACILITIES
              </p>
              <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
                Two Strategic Locations in
                <br />
                Hyderabad, Telangana
              </h2>
            </div>
            <p className="max-w-[612px] text-[18px] font-normal leading-[1.35] text-[#595959] lg:text-[24px]">
              Combining high-volume automated production at our primary Mega Plant with flexible
              custom-batch winding at our legacy facility.
            </p>
          </div>

          {/* 2 Plant Cards */}
          <div className="mt-12 grid gap-6 lg:mt-[60px] lg:grid-cols-2 lg:gap-[32px]">
            {FACILITIES.map((plant) => (
              <article
                key={plant.title}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                }}
                className="flex flex-col justify-between bg-[#F4F4F4] p-7 sm:p-10 lg:min-h-[399px] lg:p-[42px]"
              >
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] uppercase text-[#595959]">{plant.tag}</p>
                      <h3 className="mt-1.5 text-[22px] font-medium leading-[1.2] text-[#020202] lg:text-[24px]">
                        {plant.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                      }}
                      className="inline-flex h-[34px] items-center bg-white px-3.5 text-[12px] font-medium text-[#020202]"
                    >
                      {plant.badge}
                    </span>
                  </div>

                  <p className="mt-5 text-[15px] leading-[1.45] text-[#595959]">{plant.body}</p>
                </div>

                <div className="mt-7 border-t border-[#58C7E8]/45 pt-6">
                  <dl className="space-y-3 text-[14px]">
                    {plant.specs.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-4">
                        <dt className="text-[#595959]">{k}</dt>
                        <dd className="text-right font-medium text-[#020202]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>

          {/* 6 KPI Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-[32px] lg:grid-cols-6 lg:gap-[20px]">
            {FACILITY_KPIS.map(([val, label]) => (
              <div
                key={label}
                className="flex h-[124px] flex-col items-center justify-center bg-[#EEFAFF] px-4 text-center lg:h-[138px]"
              >
                <strong className="text-[22px] font-medium leading-none tracking-[-0.03em] text-[#020202] lg:text-[24px]">
                  {val}
                </strong>
                <span className="mt-3 text-[12px] font-normal uppercase tracking-[0.02em] text-[#595959] lg:text-[14px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 12. RESPONSIBILITY — CORPORATE SOCIAL RESPONSIBILITY & ESG FRAMEWORK */}
      <section
        style={{
          background: "linear-gradient(180deg, #EEFAFF 0%, rgba(238, 250, 255, 0) 100%)",
        }}
        className="px-6 py-16 lg:px-[60px] lg:py-[100px]"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                RESPONSIBILITY
              </p>
              <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
                Corporate Social Responsibility
                <br />
                &amp; ESG Framework
              </h2>
            </div>
            <p className="max-w-[612px] text-[18px] font-normal leading-[1.35] text-[#595959] lg:text-[24px]">
              Sustainable, human-centered industrial stewardship woven directly into our daily plant
              operations.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-4 lg:gap-[32px]">
            {CSR_PILLARS.map((pillar) => (
              <article key={pillar.title} className="flex flex-col">
                <p className="border-b border-[#DBDBDB] pb-4 text-[13px] font-normal uppercase tracking-[0.02em] text-[#595959]">
                  {pillar.eyebrow}
                </p>
                <div className="mt-7">
                  <CsrIcon type={pillar.icon} />
                </div>
                <h3 className="mt-5 text-[18px] font-medium leading-[1.2] text-[#020202]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.48] text-[#595959]">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 13. READY TO SPECIFY CAPCO? CYAN GRID BANNER */}
      <ReadyToSpecifyCapcoSection />

      {/* 14. FREQUENTLY ASKED QUESTIONS */}
      <PublicFaqSection items={ABOUT_FAQS} />

      {/* 15. READY TO PARTNER CONCENTRIC RINGS CTA + DARK GRID FOOTER */}
      <PublicFooter />
    </main>
  );
}

