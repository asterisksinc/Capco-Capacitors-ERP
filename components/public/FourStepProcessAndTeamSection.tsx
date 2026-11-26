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
  const [inView, setInView] = useState(false);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);

  // Cascading staggered reveal as cards scroll into view
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [steps]);

  // Desktop stacking (>=1380px): mark a card "covered" while the next card overlaps it,
  // so its copy fades out and never shows through the gap between the next card's two panels.
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = [...container.querySelectorAll<HTMLElement>("[data-process-card]")];
      const stacking = window.innerWidth >= 1380;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        // covered as soon as the next card starts sliding over this one
        const covered =
          stacking && !!next && next.getBoundingClientRect().top < card.getBoundingClientRect().bottom - 24;
        if (card.dataset.covered !== String(covered)) card.dataset.covered = String(covered);
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
      <div className="px-6 py-20 lg:px-[60px] lg:py-32 border-b border-[#EFEFEF]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:gap-16 min-[1380px]:grid-cols-[minmax(0,1fr)_880px] min-[1600px]:grid-cols-[minmax(0,1fr)_980px]">
            {/* Left Sticky Header */}
            <div className="min-[1380px]:sticky min-[1380px]:top-[120px] min-[1380px]:self-start">
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#00E05C]" />
                {processEyebrow}
              </div>
              <h2 className="type-h2 mt-5 max-w-[460px] font-normal text-[#121212]">
                {processHeading}
              </h2>

              <div className="mt-8">
                <Link
                  href={processCtaHref}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[56px] min-w-[240px] max-w-full items-center justify-between gap-6 bg-[#0092CA] px-5 py-3 text-[14px] font-medium leading-[1.2] !text-white transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="!text-white">{processCtaText}</span>
                  <ArrowRight size={16} className="!text-white shrink-0" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Staggered Staircase Cards with Cascading Reveal */}
            <div
              ref={stepsContainerRef}
              className="flex w-full max-w-[980px] flex-col gap-8 pb-8 sm:gap-10"
            >
              {steps.map((step, idx) => {
                // Indent progressively to create the staggered staircase layout shown in the video:
                // Card 01 -> ml-0, Card 02 -> ml-8, Card 03 -> ml-16, Card 04 -> ml-24
                const staircaseIndentClass =
                  idx === 0
                    ? "lg:ml-0"
                    : idx === 1
                    ? "lg:ml-8 xl:ml-12"
                    : idx === 2
                    ? "lg:ml-16 xl:ml-24"
                    : "lg:ml-24 xl:ml-36";

                return (
                  <div
                    key={step.num}
                    data-process-card={idx}
                    style={{
                      // Two-column desktop: each card pins a step lower than the one before,
                      // so scrolling stacks them into a staircase beside the sticky heading.
                      // applied only where the cards are sticky (see min-[1380px]:top-[var(--stair-top)])
                      ["--stair-top" as string]: `${120 + idx * 32}px`,
                      // keeps each card's sticky range ending a step above the next, so the stack stays staggered
                      ["--stair-end" as string]: `${(steps.length - 1 - idx) * 32}px`,
                      transition:
                        "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transitionDelay: `${idx * 140}ms`,
                      opacity: inView ? 1 : 0.9,
                      transform: inView
                        ? "translateY(0px) scale(1)"
                        : "translateY(24px) scale(0.99)",
                    }}
                    className={`group flex flex-col gap-1 relative rounded-[16px] transition-shadow duration-300 sm:flex-row min-[1380px]:sticky min-[1380px]:top-[var(--stair-top)] min-[1380px]:mb-[var(--stair-end)] min-[1380px]:gap-2 ${staircaseIndentClass}`}
                  >
                    {/* Square Number Card with Circular Dial Pattern */}
                    <div className="relative flex h-[280px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#ECECEC] sm:h-[320px] sm:w-[320px] shrink-0 min-[1380px]:shadow-[0_-10px_28px_-14px_rgba(0,0,0,0.28)]">
                      {step.dial ? (
                        <img
                          src={step.dial}
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 m-auto h-[260px] w-[260px] opacity-70 transition-transform duration-700 ease-out group-hover:rotate-45"
                        />
                      ) : (
                        <div className="pointer-events-none absolute inset-0 m-auto h-[240px] w-[240px] rounded-full border border-dashed border-black/20" />
                      )}
                      <span className="relative z-10 font-sans text-[76px] font-light leading-none tracking-tight text-[#121212]">
                        {step.num}
                      </span>
                    </div>

                    {/* Rectangular Content Card aligned toward right */}
                    <div className="flex min-h-[280px] flex-1 flex-col justify-between rounded-[16px] bg-[#ECECEC] p-8 sm:min-h-[320px] sm:p-10 min-[1380px]:shadow-[0_-10px_28px_-14px_rgba(0,0,0,0.28)]">
                      <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[#737373] transition-opacity duration-300 group-data-[covered=true]:opacity-0">
                        {step.label}
                      </span>
                      <div className="my-auto pt-4 transition-opacity duration-300 group-data-[covered=true]:opacity-0">
                        <h3 className="type-h3 font-normal text-[#121212]">
                          {step.title}
                        </h3>
                        <p className="type-small mt-3 leading-[1.6] text-[#595959]">
                          {step.body}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 text-[12px] font-medium text-[#121212]/60 transition group-hover:text-[#121212] group-data-[covered=true]:opacity-0">
                        <span>Phase Specification Locked</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
