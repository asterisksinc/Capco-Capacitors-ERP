"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

export interface StepItem {
  num: string;
  label: string;
  title: string;
  body: string;
  dial?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience?: string;
  bio?: string;
  image?: string;
}

const defaultSteps: StepItem[] = [
  {
    num: "01",
    label: "STEP 01",
    title: "Application Discovery & Site Review",
    dial: "/figma/solutions/28730.svg",
    body: "Comprehensive requirement mapping analyzing your electrical loads, harmonic environments, mechanical envelope, and grid compliance standards to lock clear technical specifications.",
  },
  {
    num: "02",
    label: "STEP 02",
    title: "System Design & Prototyping",
    dial: "/figma/solutions/88be3.svg",
    body: "Custom capacitor configurations engineered with optimized Leybold vacuum metallization, low-loss dielectric winding, and flame-retardant encapsulation. Rapid prototypes delivered in 7–10 days.",
  },
  {
    num: "03",
    label: "STEP 03",
    title: "Delivery & Commissioning Trials",
    dial: "/figma/solutions/a7ea4.svg",
    body: "Extensive field validation in your equipment under real industrial loads with iterative dielectric adjustments until peak power factor and thermal stability are verified.",
  },
  {
    num: "04",
    label: "STEP 04",
    title: "Dispatch & Volume Optimization",
    dial: "/figma/solutions/db991.svg",
    body: "Vertically integrated high-throughput manufacturing with 100% routine batch testing, BIS-certified release, and scheduled buffer stock dispatch to guarantee zero downtime.",
  },
];

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Dana Whitfield",
    role: "Founder & Chief Executive",
    experience: "32+ Years in Power Electronics",
    bio: "Pioneered in-house high-vacuum film metallization in India. Built CAPCO from an industrial component workshop into an internationally certified powerhouse exporting to 15+ countries.",
    image: "/figma/solutions/3d57f.png",
  },
  {
    name: "Marcus Feld",
    role: "Chief Operating Officer",
    experience: "24+ Years Manufacturing & Operations",
    bio: "Oversees automated plant operations, lean assembly, and multi-tier supply chain logistics across the 100,000 sq.ft. TSIIC manufacturing campus.",
    image: "/figma/solutions/924b4.png",
  },
  {
    name: "Priya Raghunathan",
    role: "VP, Engineering",
    experience: "19+ Years Dielectric & Materials R&D",
    bio: "Specializes in ultra-thin BOPP metallization physics, self-healing zinc-aluminium alloy gradients, and high-frequency harmonic mitigation architectures.",
    image: "/figma/solutions/ba5d4.png",
  },
  {
    name: "Tom Alvarez",
    role: "VP, Project Development",
    experience: "16+ Years OEM Integration",
    bio: "Manages tier-1 co-engineering partnerships with major HVAC, submersible pump, and industrial APFC panel builders nationwide.",
    image: "/figma/solutions/oem-journey-1.png",
  },
  {
    name: "Rachel Boone",
    role: "Director, Origination",
    experience: "14+ Years Energy Markets & Compliance",
    bio: "Leads national dealership networks and commercial origination desks, ensuring transparent pricing, territory exclusivity, and rapid stock distribution.",
    image: "/figma/solutions/oem-journey-2.png",
  },
  {
    name: "Sam Okafor",
    role: "Head of Software & Automation",
    experience: "11+ Years Industrial IoT",
    bio: "Architect of CAPCO's smart ERP telemetry, QR inventory tracking, and computerized automated batch dielectric testing systems.",
    image: "/figma/solutions/oem-journey-3.png",
  },
  {
    name: "Nina Castellanos",
    role: "Controller",
    experience: "15+ Years Financial & Quality Audit",
    bio: "Directs financial governance, ERP cost accounting, and raw-material procurement economics to preserve unbeatable volume pricing for partners.",
    image: "/figma/solutions/17639.png",
  },
  {
    name: "Eli Grant",
    role: "Executive Assistant & Logistics",
    experience: "8+ Years Client Operations",
    bio: "Coordinates high-priority OEM dispatch logistics, sample evaluations, and immediate 24/7 technical query resolution for verified dealers.",
    image: "/figma/solutions/2f1e3.png",
  },
];

interface FourStepProcessAndTeamSectionProps {
  id?: string;
  processEyebrow?: string;
  processHeading?: string;
  processCtaText?: string;
  processCtaHref?: string;
  steps?: StepItem[];
  teamEyebrow?: string;
  teamHeading?: string;
  teamMembers?: TeamMember[];
}

export function FourStepProcessAndTeamSection({
  id = "process-and-team",
  processEyebrow = "How We Work",
  processHeading = "A four-step path from site review to revenue",
  processCtaText = "Start Co-Engineering Project",
  processCtaHref = "/contact?category=oem#enquiry-form",
  steps = defaultSteps,
  teamEyebrow = "Our People",
  teamHeading = "Deep operating experience across development, delivery and dispatch",
  teamMembers = defaultTeamMembers,
}: FourStepProcessAndTeamSectionProps) {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);

  // Desktop (>=1024px): diagonal glide from the reference. Cards sit in a staircase (each one step
  // right of the card above, right edges aligned) and, as the section scrolls, the whole staircase
  // slides left, so every card travels up-and-left and its text panel widens as it arrives.
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const cards = [...container.querySelectorAll<HTMLElement>("[data-process-card]")];
      if (window.innerWidth < 1024) {
        cards.forEach((card) => card.style.removeProperty("--glide-x"));
        return;
      }
      const width = container.clientWidth;
      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();
      // 0 when the stack's top enters the lower part of the screen, 1 when its bottom reaches mid-screen
      const progress = reduce
        ? 0.5
        : Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)));
      const step = width * 0.14; // horizontal step between consecutive cards
      const base = width * 0.3; // where card 01 starts
      const maxIndent = Math.max(0, width - 260 - 440); // keep >= 440px for the text panel
      // travel far enough that the last card ends flush left (when its bottom reaches mid-screen)
      const shift = progress * (base + step * (cards.length - 1));
      cards.forEach((card, i) => {
        const x = Math.min(maxIndent, Math.max(0, base + step * i - shift));
        card.style.setProperty("--glide-x", `${Math.round(x)}px`);
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
  }, [steps]);

  const activeMember = teamMembers[activeTeamIndex] || teamMembers[0];

  return (
    <section id={id} className="relative z-10 bg-white text-[#020202]">
      {/* ─────────────────────────────────────────────────────────────
          PART 1: FOUR-STEP PROCESS (Cascading Staggered Staircase Layout)
          Recreating exact layout & animation from reference video
         ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#EFEFEF] px-6 py-20 lg:px-[60px] lg:py-32">
        <div className="mx-auto max-w-[1800px]">
          {/* Header: eyebrow + heading (left) and CTA, above the staircase; scrolls normally */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                {processEyebrow}
              </div>
              <h2 className="type-h2 mt-5 max-w-[620px] font-normal text-[#121212]">
                {processHeading}
              </h2>
            </div>
            <Link
              href={processCtaHref}
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex min-h-[56px] min-w-[240px] max-w-full shrink-0 items-center justify-between gap-6 self-start bg-[#0092CA] px-5 py-3 text-[14px] font-medium leading-[1.2] !text-white transition hover:-translate-y-0.5 hover:brightness-105 lg:self-auto"
            >
              <span className="!text-white">{processCtaText}</span>
              <ArrowRight size={16} className="!text-white shrink-0" />
            </Link>
          </div>

          {/* Staircase: margin-left comes from --glide-x (set on scroll, desktop only) */}
          <div ref={stepsContainerRef} className="mt-12 flex flex-col gap-3 lg:mt-16 lg:gap-2.5">
            {steps.map((step) => (
              <div
                key={step.num}
                data-process-card
                className="group flex flex-col gap-1 sm:flex-row sm:gap-2.5 lg:ml-[var(--glide-x,0px)] lg:will-change-[margin]"
              >
                {/* Number card with dial */}
                <div className="relative flex h-[240px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#ECECEC] sm:h-[260px] sm:w-[260px]">
                  {step.dial ? (
                    <img
                      src={step.dial}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 m-auto h-[210px] w-[210px] opacity-70 transition-transform duration-700 ease-out group-hover:rotate-45"
                    />
                  ) : (
                    <div className="pointer-events-none absolute inset-0 m-auto h-[200px] w-[200px] rounded-full border border-dashed border-black/20" />
                  )}
                  <span className="relative z-10 font-sans text-[64px] font-light leading-none tracking-tight text-[#121212]">
                    {step.num}
                  </span>
                </div>

                {/* Content card: fills the rest of the row, so right edges stay aligned */}
                <div className="flex min-h-[240px] min-w-0 flex-1 flex-col justify-between rounded-[16px] bg-[#ECECEC] p-7 sm:min-h-[260px] sm:p-8">
                  <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[#737373]">
                    {step.label}
                  </span>
                  <div className="my-auto pt-4">
                    <h3 className="type-h3 font-normal text-[#121212]">{step.title}</h3>
                    <p className="type-small mt-3 max-w-[560px] leading-[1.6] text-[#595959]">{step.body}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 text-[12px] font-medium text-[#121212]/60 transition group-hover:text-[#121212]">
                    <span>Phase Specification Locked</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
