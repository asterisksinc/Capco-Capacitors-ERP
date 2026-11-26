"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PublicFaqSection,
  PublicFooter,
  ReadyToSpecifyCapcoSection,
} from "@/components/public/PublicChrome";
import JourneyRoadmap from "@/components/public/JourneyRoadmap";
import ExportMarketsSection from "@/components/public/ExportMarketsSection";
import HomeHero from "@/components/public/HomeHero";

const HERO_STATS = [
  ["IS:2993 / IS:13340", "BIS Certified"],
  ["ISO 9001:2008", "TUV/5GS Audited"],
  ["IEC 60252-1", "EU Directives"],
  ["IEC 60831-1/2", "Self-Healing Dry"],
  ["5,000+ Dealers", "Pan-India Stock"],
  ["15+ Nations", "Direct Exporter"],
  ["32+ Years", "Est. 1994"],
] as const;

const JOURNEY_HIGHLIGHTS = [
  {
    num: "/001",
    tag: "Dealer Network",
    stat: "5,000+",
    title: "Authorized Distributors",
    body: "Spanning 20+ states with assured depot inventory, rapid logistics, zero margin undercutting, and full dealer replacement warranty guarantee.",
    bg: "bg-[#EEFAFF]",
  },
  {
    num: "/002",
    tag: "OEM Programme",
    stat: "100+",
    title: "Tier-1 OEM Partnerships",
    body: "Direct vendor code approval with leading air conditioning, submersible pump, industrial motor, and ballast assembly manufacturers.",
    bg: "bg-[#F4F4F4]",
  },
  {
    num: "/003",
    tag: "Track Record",
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
  { year: "1994", tag: "Founded", tagline: "The journey of CAPCO Capacitors began." },
  { year: "1996", tag: "Certification", tagline: "Obtained BIS certification for KVAR manufacturing, IS: 2834 (now IS: 13340)." },
  { year: "2005", tag: "Capability", tagline: "Integrated an in-house BOPP film metallization plant from LEYBOLD, Germany, with slitting lines for precision metallized film slitting." },
  { year: "2012", tag: "Export", tagline: "Began exporting capacitors to the Middle East & South East Asia." },
  { year: "2016", tag: "Facility", tagline: "New plant dedicated to fan & other motor run capacitors." },
  { year: "2020", tag: "Certification", tagline: "Obtained BIS certification for motor run capacitor manufacturing, IS: 2993." },
  { year: "2023", tag: "Facility", tagline: "Commissioned a state-of-the-art, fully integrated capacitor manufacturing facility in Industrial Park, Medak, Hyderabad." },
  { year: "2025", tag: "License", tagline: "Obtained license for motor start capacitor manufacturing." },
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

/**
 * Scroll-linked stacking: as the container scrolls through the viewport each card rises and
 * settles onto the one before it (card i starts a little after card i-1). Reverses on scroll up.
 */
function useScrollStack(count: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();
      // 0 when the stack's top reaches 95% of the viewport, 1 once ~70% of it has scrolled into view
      const progress = Math.min(1, Math.max(0, (vh * 0.95 - rect.top) / (rect.height * 0.7 + vh * 0.25)));
      const lift = window.innerWidth >= 1024 ? 160 : 90;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const start = i * (0.55 / Math.max(1, count - 1));
        const t = reduce ? 1 : Math.min(1, Math.max(0, (progress - start) / 0.45));
        const e = 1 - Math.pow(1 - t, 3); // ease-out
        card.style.transform = `translate3d(${(1 - e) * -28}px, ${(1 - e) * lift}px, 0) scale(${0.94 + 0.06 * e})`;
        card.style.opacity = String(0.15 + 0.85 * e);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };
  return [containerRef, setCardRef] as const;
}

export default function AboutPage() {
  const [journeyRef, isJourneyInView] = useInView<HTMLElement>(0.12);
  const [journeyStackRef, setJourneyCardRef] = useScrollStack(JOURNEY_HIGHLIGHTS.length);

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. Hero (shared with the home and Solutions pages) */}
      <HomeHero
        id="about-hero-title"
        image="/figma/about/hero-bg.jpg"
        imageAlt="CAPCO cleanroom capacitor manufacturing line"
        description={<>CAPCO Capacitors is the flagship capacitor brand of Dada Energies (P) Ltd., a Hyderabad-based manufacturer established in 1994. Dada Energies provides the manufacturing strength and quality systems behind CAPCO&rsquo;s motor run, PFC, lighting and custom capacitor solutions.</>}
        tags={["Since 1994 | HYD-PLANT-01 6 02", "Make in India"]}
        title={["32+ Years of Capacitor", "Manufacturing Excellence"]}
        primary={{ label: "Explore Manufacturing Line", href: "#manufacturing-line" }}
        secondary={{ label: "Explore Timeline", href: "#company-timeline" }}
        cutColor="#ffffff"
        overlay
      />

      {/* 2. 7-COLUMN CERTIFICATIONS & METRICS BAR (also the #compliance anchor for nav / footer links) */}
      <section id="compliance" className="mt-8 border-y border-[#DBDBDB] bg-white py-6 lg:mt-[60px] lg:py-[40px]">
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
      <section className="mx-auto grid max-w-[1920px] grid-cols-[minmax(0,1fr)] lg:min-h-[673px] lg:grid-cols-[930fr_990fr]">
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
            <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-white">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              WHO WE ARE
            </p>
            <h2 className="type-h2 mt-5 max-w-[680px] font-normal text-white lg:mt-6">
              Vertically Integrated. Compliance-
              <br />
              Backed. Export-Ready.
            </h2>

            <div className="type-body mt-7 max-w-[840px] space-y-4 font-normal text-white/85 lg:mt-8">
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
                ecosystem of 5,000+ dealers with guaranteed 12-25% operational margin stability, and
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
              className="inline-flex min-h-[56px] w-[218px] max-w-full items-end justify-between bg-[#58C7E8] px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
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
              className="inline-flex min-h-[56px] w-[280px] max-w-full items-end justify-between gap-3 bg-white px-3 pb-3 pt-6 text-[14px] font-semibold leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#F4F4F4]"
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

      {/* 5. OUR JOURNEY — 5,000+ DEALERS, 100+ OEM PARTNERS, 15+ EXPORT MARKETS */}
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
            <div className="max-w-[860px]">
              <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                OUR JOURNEY
              </p>
              <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
                5,000+ Dealers, 100+ OEM Partners,
                <br className="hidden lg:block" />{" "}
                15+ Export Markets
              </h2>
            </div>
            <p className="type-lead max-w-[520px] font-light text-[#4F4F4F] lg:pb-1.5">
              Supplying primary electrical power units to Tier-1 white goods manufacturers and
              critical sub-station grid installations nationwide.
            </p>
          </div>

          {/* 3 highlight cards cascading diagonally: each sits right of and slightly over the previous */}
          <div ref={journeyStackRef} className="relative mx-auto mt-12 max-w-[1080px] pb-4 lg:mt-[72px] lg:pb-8">
            {JOURNEY_HIGHLIGHTS.map((card, idx) => (
              <div
                key={card.num}
                ref={setJourneyCardRef(idx)}
                style={{
                  zIndex: idx + 1,
                  filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.10)) drop-shadow(0 -6px 16px rgba(0,0,0,0.05))",
                  ["--stack-x" as string]: `${idx * 16}px`,
                  ["--stack-x-lg" as string]: `${idx * 21}%`,
                  transformOrigin: "left top",
                  willChange: "transform, opacity",
                }}
                className={`relative ${idx > 0 ? "mt-5 lg:-mt-10" : ""} ml-[var(--stack-x)] w-[calc(100%-32px)] lg:ml-[var(--stack-x-lg)] lg:w-[58%]`}
              >
              <article
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)" }}
                className={`${card.bg} flex min-h-[220px] flex-col justify-between p-6 sm:p-8 lg:min-h-[240px] lg:p-[34px]`}
              >
                <div className="type-caption flex items-center gap-3 font-medium uppercase tracking-[0.1em] text-[#595959]">
                  <span className="text-[#58C7E8]">{card.num}</span>
                  <span className="h-px w-6 bg-[#595959]/30" aria-hidden="true" />
                  <span>{card.tag}</span>
                </div>
                <div className="mt-6">
                  <strong className="block text-[40px] font-light leading-none tracking-[-0.04em] text-[#020202] lg:text-[48px]">
                    {card.stat}
                  </strong>
                  <h3 className="type-h4 mt-3 font-medium text-[#020202]">
                    {card.title}
                  </h3>
                  <p className="type-small mt-2 max-w-[520px] font-light leading-[1.55] text-[#4F4F4F] lg:text-[15px]">
                    {card.body}
                  </p>
                </div>
              </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ENGINEERING SUPPLIER LOGOS & INDUSTRY AFFILIATIONS */}
      <section className="bg-[#F4F4F4] px-6 py-16 lg:px-[60px] lg:py-[72px]">
        <div className="mx-auto max-w-[1800px] text-center">
          <p className="type-caption inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.02em] text-[#020202]">
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
      <JourneyRoadmap milestones={TIMELINE_DATA} />

      {/* 8. LEADERSHIP — DECADES OF EXPERIENCE IN CAPACITOR MANUFACTURING */}
      <section
        id="manufacturing-line"
        className="bg-[#EEFAFF] px-6 py-16 lg:px-[60px] lg:py-[100px]"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[900px]">
              <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                LEADERSHIP
              </p>
              <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
                Decades of Experience in Capacitor
                <br className="hidden lg:block" />{" "}
                Manufacturing
              </h2>
            </div>
            <p className="type-lead max-w-[500px] font-light text-[#4F4F4F] lg:pb-1.5">
              Unlike assemblers who buy pre-metallized rolls of indeterminate origin, CAPCO controls
              all 4 stages of the capacitor manufacturing lifecycle.
            </p>
          </div>

          {/* 2x4 Manufacturing Lifecycle Bento Grid */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-[60px] lg:grid-cols-[1.34fr_1fr_1fr_1.34fr] lg:gap-5">
            {/* Row 1, Col 1: /001 BOPP Film Sourcing */}
            <article className="flex min-h-[320px] flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-7">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="type-caption font-medium tracking-[0.08em] text-[#58C7E8]">/001</span>
                <span className="type-caption uppercase tracking-[0.1em] text-[#595959]">DIELECTRIC BASELINE</span>
              </div>
              <div className="my-5">
                <h3 className="type-h4 font-medium text-[#020202]">BOPP Film Sourcing</h3>
                <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-[#4F4F4F]">
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
            <figure className="relative m-0 min-h-[280px] overflow-hidden rounded-[16px] bg-[#D9E6EC] md:min-h-[320px]">
              <Image
                src="/figma/about/leybold-chamber-photo.jpg"
                alt="01. Leybold Chamber (Medak)"
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
              <figcaption className="type-caption pointer-events-none absolute inset-x-3 bottom-3 rounded-[10px] bg-[#1A1A1A]/55 px-4 py-3 font-medium uppercase tracking-[0.08em] text-white backdrop-blur-md">
                01. Leybold Chamber (Medak)
              </figcaption>
            </figure>

            {/* Row 1, Col 3: Photo 02. METAR AUTOMATED LINE */}
            <figure className="relative m-0 min-h-[280px] overflow-hidden rounded-[16px] bg-[#D9E6EC] md:min-h-[320px]">
              <Image
                src="/figma/about/metar-line-photo.jpg"
                alt="02. Metar Automated Line"
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
              <figcaption className="type-caption pointer-events-none absolute inset-x-3 bottom-3 rounded-[10px] bg-[#1A1A1A]/55 px-4 py-3 font-medium uppercase tracking-[0.08em] text-white backdrop-blur-md">
                02. Metar Automated Line
              </figcaption>
            </figure>

            {/* Row 1, Col 4: /003 Automated High-Speed Winding */}
            <article className="flex min-h-[320px] flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-7">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="type-caption font-medium tracking-[0.08em] text-[#58C7E8]">/003</span>
                <span className="type-caption uppercase tracking-[0.1em] text-[#595959]">METAR SWITZERLAND</span>
              </div>
              <div className="my-5">
                <h3 className="type-h4 font-medium text-[#020202]">
                  Automated High-Speed Winding
                </h3>
                <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-[#4F4F4F]">
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
            <article className="flex min-h-[320px] flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-7">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="type-caption font-medium tracking-[0.08em] text-[#58C7E8]">/002</span>
                <span className="type-caption uppercase tracking-[0.1em] text-[#595959]">LEYBOLD HIGH-VACUUM</span>
              </div>
              <div className="my-5">
                <h3 className="type-h4 font-medium text-[#020202]">Vacuum Metallization</h3>
                <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-[#4F4F4F]">
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
            <figure className="relative m-0 min-h-[280px] overflow-hidden rounded-[16px] bg-[#D9E6EC] md:min-h-[320px]">
              <Image
                src="/figma/about/nabl-lab-photo.jpg"
                alt="03. NABL In-House Lab"
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
              <figcaption className="type-caption pointer-events-none absolute inset-x-3 bottom-3 rounded-[10px] bg-[#1A1A1A]/55 px-4 py-3 font-medium uppercase tracking-[0.08em] text-white backdrop-blur-md">
                03. NABL In-House Lab
              </figcaption>
            </figure>

            {/* Row 2, Col 3: Photo 04. AUTOMATED EXPORT PACKING */}
            <figure className="relative m-0 min-h-[280px] overflow-hidden rounded-[16px] bg-[#D9E6EC] md:min-h-[320px]">
              <Image
                src="/figma/about/export-packing-photo.jpg"
                alt="04. Automated Export Packing"
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
              <figcaption className="type-caption pointer-events-none absolute inset-x-3 bottom-3 rounded-[10px] bg-[#1A1A1A]/55 px-4 py-3 font-medium uppercase tracking-[0.08em] text-white backdrop-blur-md">
                04. Automated Export Packing
              </figcaption>
            </figure>

            {/* Row 2, Col 4: /004 Encapsulation & Testing */}
            <article className="flex min-h-[320px] flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:p-7">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
                <span className="type-caption font-medium tracking-[0.08em] text-[#58C7E8]">/004</span>
                <span className="type-caption uppercase tracking-[0.1em] text-[#595959]">100% ASSURANCE</span>
              </div>
              <div className="my-5">
                <h3 className="type-h4 font-medium text-[#020202]">
                  Encapsulation &amp; Testing
                </h3>
                <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-[#4F4F4F]">
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

      {/* 9. COMPLIANCE — BIS, ISO, CE & IEC CERTIFIED MANUFACTURING */}

      {/* 10. FACILITIES — TWO STRATEGIC LOCATIONS IN HYDERABAD, TELANGANA */}
      <section className="px-6 py-16 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                FACILITIES
              </p>
              <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
                Two Strategic Locations in
                <br />
                Hyderabad, Telangana
              </h2>
            </div>
            <p className="type-lead max-w-[612px] font-normal text-[#595959]">
              Combining high-volume automated production at our primary Mega Plant with flexible
              custom-batch winding at our legacy facility.
            </p>
          </div>

          {/* Map (left, same card shape) + plant card (right) */}
          <div className="mt-12 grid gap-6 lg:mt-[60px] lg:grid-cols-2 lg:gap-[32px]">
            <div
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
              }}
              className="relative min-h-[320px] overflow-hidden bg-[#F4F4F4] lg:min-h-[399px]"
            >
              <iframe
                title="Map: DADA ENERGIES (P) LTD., Medak, Telangana"
                src="https://www.google.com/maps?q=17.7359222,78.4825576&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
              <a
                href="https://maps.app.goo.gl/iCLxR4jT38AWZDBQ7"
                target="_blank"
                rel="noopener noreferrer"
                className="type-caption absolute right-4 top-4 inline-flex items-center gap-2 bg-white px-3 py-2 font-medium uppercase tracking-[0.08em] text-[#020202] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-[#58C7E8]"
              >
                Open in Google Maps
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
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
                      <p className="type-small uppercase text-[#595959]">{plant.tag}</p>
                      <h3 className="type-h3 mt-1.5 font-medium text-[#020202]">
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

                  <p className="type-body mt-5 text-[#595959]">{plant.body}</p>
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

      {/* 11b. EXPORT MARKETS */}
      <ExportMarketsSection />

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
              <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                RESPONSIBILITY
              </p>
              <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
                Corporate Social Responsibility
                <br />
                &amp; ESG Framework
              </h2>
            </div>
            <p className="type-lead max-w-[612px] font-normal text-[#595959]">
              Sustainable, human-centered industrial stewardship woven directly into our daily plant
              operations.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-4 lg:gap-[32px]">
            {CSR_PILLARS.map((pillar) => (
              <article key={pillar.title} className="flex flex-col">
                <p className="type-small border-b border-[#DBDBDB] pb-4 font-normal uppercase tracking-[0.02em] text-[#595959]">
                  {pillar.eyebrow}
                </p>
                <div className="mt-7">
                  <CsrIcon type={pillar.icon} />
                </div>
                <h3 className="type-h4 mt-5 font-medium text-[#020202]">
                  {pillar.title}
                </h3>
                <p className="type-small mt-3 leading-[1.48] text-[#595959]">{pillar.body}</p>
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

