"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import HomeHero from "@/components/public/HomeHero";
import { caseStudies } from "@/lib/caseStudies";
import { CertificationStrip } from "@/components/public/CertificationStrip";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Plus,
  X,
} from "lucide-react";
import {
  PublicFooter,
  PublicFaqSection,
} from "@/components/public/PublicChrome";
import { FourStepProcessAndTeamSection } from "@/components/public/FourStepProcessAndTeamSection";
import { exportMarkets, WhereWeOperateSection } from "@/components/public/WhereWeOperateSection";

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

const oemStories = caseStudies;

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
  const [storyOpen, setStoryOpen] = useState(false);
  const storyCloseTimer = useRef<number | null>(null);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);

  const openStory = (story: (typeof oemStories)[number]) => {
    if (storyCloseTimer.current) window.clearTimeout(storyCloseTimer.current);
    setSelectedStory(story);
    requestAnimationFrame(() => requestAnimationFrame(() => setStoryOpen(true)));
  };

  const closeStory = () => {
    setStoryOpen(false);
    if (storyCloseTimer.current) window.clearTimeout(storyCloseTimer.current);
    storyCloseTimer.current = window.setTimeout(() => setSelectedStory(null), 320);
  };

  // Lock page scroll while the case study is open (without layout shift) and close on Escape.
  useEffect(() => {
    if (!selectedStory) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeStory();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedStory]);

  useEffect(
    () => () => {
      if (storyCloseTimer.current) window.clearTimeout(storyCloseTimer.current);
    },
    []
  );

  // Keep the 0X/0Y counter in sync when the track is swiped or scrolled directly.
  useEffect(() => {
    const container = storiesScrollRef.current;
    if (!container) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = container.querySelectorAll<HTMLElement>("[data-story-card]");
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - container.offsetLeft - container.scrollLeft);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActiveStoryIndex(best);
      });
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

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
      {/* 1. Hero (shared with the home page) */}
      <HomeHero
        id="oem-hero-title"
        image="/figma/solutions/66dd5.png"
        imageAlt="CAPCO advanced capacitor manufacturing line"
        description={<>Co-engineered capacitor solutions, vertically integrated manufacturing, and dedicated support for India&apos;s leading equipment manufacturers.</>}
        tags={["5,000+ Authorised Dealers", "20+ States Covered"]}
        title={["Your Strategic OEM", "Capacitor Partner"]}
        primary={{ label: "Schedule Technical Consultation", href: "/contact?category=oem#enquiry-form" }}
        secondary={{ label: "View OEM", href: "/catalogs/capco-product-catalog.pdf", download: "CAPCO-OEM-Solutions.pdf" }}
        cutColor="#ffffff"
      />

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
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
                Built for Equipment
                <br />
                Manufacturers
              </h2>
            </div>
            <p className="type-body max-w-[500px] text-[#595959]">
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
                        aria-expanded={isOpen}
                        aria-controls={`oem-capability-${idx}`}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                      >
                        <span
                          className={`text-[20px] font-normal tracking-[-0.52px] transition-colors duration-300 sm:text-[24px] lg:text-[26px] ${
                            isOpen ? "text-[#020202]" : "text-[#8C8C8C] hover:text-[#020202]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-white transition-transform duration-300 ease-out ${
                            isOpen ? "rotate-45" : "rotate-0"
                          }`}
                        >
                          <Plus size={15} />
                        </span>
                      </button>
                      <div
                        id={`oem-capability-${idx}`}
                        inert={!isOpen}
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="type-small max-w-[500px] pt-3 leading-[1.5] text-[#595959]">
                            {item.body}
                          </p>
                        </div>
                      </div>
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

      {/* 3. Four-Step Process & Deep Operating Experience (Staircase Reveal & Interactive Team Section) */}
      <FourStepProcessAndTeamSection
        id="oem-process-and-team"
        processEyebrow="How We Work"
        processHeading="A four-step path from site review to revenue"
        processCtaText="Start Co-Engineering Project"
        processCtaHref="/contact?category=oem#enquiry-form"
        steps={[...developmentSteps]}
        teamEyebrow="Our People"
        teamHeading="Deep operating experience across development, delivery and dispatch"
      />

      {/* 4. Certifications & key numbers (shared with the About page) */}
      <CertificationStrip />

      {/* 5. OEM Success Stories Carousel: whole section sized to ~80vh on desktop */}
      <section id="oem-stories" className="bg-white px-6 py-20 lg:px-[60px] lg:py-12">
        <div className="mx-auto max-w-[1800px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                Proven Partnerships
              </div>
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
                OEM Success Stories
              </h2>
            </div>

            {/* Carousel Navigation Controls */}
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-mono tabular-nums text-[#8C8C8C]" aria-live="polite">
                0{activeStoryIndex + 1}/0{oemStories.length}
              </span>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex - 1)}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#E5E5E5] bg-white text-[#020202] transition hover:bg-[#020202] hover:text-white"
                aria-label="Previous story"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollToStory(activeStoryIndex + 1)}
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#E5E5E5] bg-white text-[#020202] transition hover:bg-[#020202] hover:text-white"
                aria-label="Next story"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Stories Horizontal Track */}
          <div
            ref={storiesScrollRef}
            className="mt-12 flex gap-6 overflow-x-auto overscroll-x-contain pb-4 hide-scrollbar lg:mt-8"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {oemStories.map((story) => (
              <div
                key={story.title}
                data-story-card
                onClick={() => openStory(story)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openStory(story);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Read case study: ${story.title}`}
                style={{ scrollSnapAlign: "start" }}
                className="group relative h-[560px] w-[88vw] lg:h-[max(380px,calc(80svh-236px))] max-w-[1512px] shrink-0 cursor-pointer overflow-hidden rounded-[32px] bg-[#1A1A1A] transition-shadow duration-300 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#58C7E8] lg:w-[min(1512px,92%)]"
              >
                {/* Background Image */}
                <img
                  src={story.image}
                  alt={story.title}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
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
                      <h3 className="type-h3-lg font-sans font-normal text-white">
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
                      <p className="type-body mt-4 max-w-[488px] font-sans font-normal text-white/80 lg:mt-0">
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
          aria-label={selectedStory.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={closeStory}
            className={`absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              storyOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`relative max-h-[90vh] w-full max-w-[760px] overflow-y-auto overscroll-contain rounded-[24px] bg-[#121212] p-6 text-white transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 ${
              storyOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={closeStory}
              className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20 sm:right-6 sm:top-6"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
            <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#58C7E8]">
              {selectedStory.clientTag}
            </span>
            <h3 className="type-h3-lg mt-3 pr-10 font-normal">
              {selectedStory.title}
            </h3>
            <div className="my-6 grid grid-cols-3 gap-3 rounded-[16px] bg-white/5 p-4 sm:gap-4">
              {selectedStory.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="text-[11px] font-mono text-white/50">{stat.label}</span>
                  <div className="mt-1 text-[18px] font-bold text-white sm:text-[26px]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="type-body text-white/80">
              {selectedStory.fullText}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
              <Link
                href={`/case-studies/${selectedStory.slug}`}
                className="rounded-full border border-white/30 px-6 py-2.5 text-[14px] font-semibold !text-white transition hover:bg-white hover:!text-black"
              >
                Read full case study
              </Link>
              <button
                type="button"
                onClick={closeStory}
                className="cursor-pointer rounded-full bg-[#58C7E8] px-6 py-2.5 text-[14px] font-semibold text-black transition hover:brightness-105"
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
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
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
                  <h3 className="type-h3 mt-6 font-normal text-[#020202]">
                    {p.title}
                  </h3>
                  <p className="type-small mt-3 leading-[1.5] text-[#595959]">
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

      {/* 7. Where We Operate */}
      <WhereWeOperateSection locations={exportMarkets} />

      {/* 8. Start Your OEM Journey with Capco Capacitors */}
      <section className="bg-[#000000] px-6 py-20 text-white lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          <div>
            <div className="flex items-center gap-2 text-[14px] font-medium tracking-[0.02em] text-white">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              Ready to Partner?
            </div>
            <h2 className="type-h2 mt-4 font-normal text-white">
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
              <h3 className="type-h3 mt-6 font-medium text-white">
                Technical Consultation
              </h3>
              <p className="type-small mt-2 leading-relaxed text-[#8C8C8C]">
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
              <h3 className="type-h3 mt-6 font-medium text-white">
                Prototype &amp; Validation
              </h3>
              <p className="type-small mt-2 leading-relaxed text-[#8C8C8C]">
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
              <h3 className="type-h3 mt-6 font-medium text-white">
                Production &amp; Delivery
              </h3>
              <p className="type-small mt-2 leading-relaxed text-[#8C8C8C]">
                Finalize commercial terms, sign supply agreement, and begin regular deliveries with JIT or bulk shipment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions (same component as the home page) */}
      <PublicFaqSection items={oemFaqs} />


      {/* 11. Public Footer (Clean, matching Figma reference with hideCta to prevent duplicate CTA) */}
      <PublicFooter />
    </main>
  );
}
