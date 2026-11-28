"use client";

/* eslint-disable @next/next/no-img-element */
import HomeHero from "@/components/public/HomeHero";
import { PlantFacilitiesSection } from "@/components/public/PlantFacilitiesSection";
import { featuredCaseStudies } from "@/lib/caseStudies";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  PublicFooter,
  PublicFaqSection,
} from "@/components/public/PublicChrome";
import { FourStepProcessAndTeamSection } from "@/components/public/FourStepProcessAndTeamSection";
import { exportMarkets, WhereWeOperateSection } from "@/components/public/WhereWeOperateSection";

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


const successStories = featuredCaseStudies;

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
  const router = useRouter();
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);


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
      {/* 1. Hero (shared with the home page) */}
      <HomeHero
        id="dealership-hero-title"
        image="/figma/solutions/heroes/dealership-hero.jpg"
        imageAlt="CAPCO dealer partnership handshake outside the CAPCO Capacitors plant"
        overlay
        description={<>Join India&apos;s most trusted capacitor dealer network: competitive margins, co-branded marketing support, and 30+ years of brand equity behind every sale.</>}
        tags={["5,000+ Authorised Dealers", "20+ States Covered"]}
        title={["Grow Your Business", "with Capco Capacitors"]}
        primary={{ label: "Apply for Dealership", href: "/contact?category=dealership#enquiry-form" }}
        secondary={{ label: "View Dealership", href: "/catalogs/capco-product-catalog.pdf", download: "CAPCO-Dealership-Solutions.pdf" }}
        cutColor="#ffffff"
      />

      {/* 2. Four-Step Process & Deep Operating Experience (Staircase Reveal & Interactive Team Section) */}
      <FourStepProcessAndTeamSection
        id="dealership-process-and-team"
        processEyebrow="How We Work"
        processHeading="A four-step path from site review to revenue"
        processCtaText="Apply for Dealership"
        processCtaHref="/contact?category=dealership#enquiry-form"
        steps={[...dealerAdvantages]}
      />

      {/* 3. Where We Operate */}
      <WhereWeOperateSection locations={exportMarkets} />

      {/* 4. Plant Facilities (shared with the Industrial page) */}
      <PlantFacilitiesSection />

      {/* 5. OEM Success Stories Carousel: whole section sized to ~80vh on desktop */}
      <section id="dealer-stories" className="bg-white px-6 py-20 lg:px-[60px] lg:py-12">
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

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-mono tabular-nums text-[#8C8C8C]" aria-live="polite">
                0{activeStoryIndex + 1}/0{successStories.length}
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

          {/* Stories Track */}
          <div
            ref={storiesScrollRef}
            className="mt-12 flex gap-6 overflow-x-auto overscroll-x-contain pb-4 hide-scrollbar lg:mt-8"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {successStories.map((story) => (
              <div
                key={story.title}
                data-story-card
                onClick={() => {
                  if (story.published) router.push(`/case-studies/${story.slug}`);
                }}
                onKeyDown={(e) => {
                  if (story.published && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    router.push(`/case-studies/${story.slug}`);
                  }
                }}
                role={story.published ? "link" : undefined}
                tabIndex={story.published ? 0 : -1}
                aria-label={story.published ? `Read case study: ${story.title}` : `${story.title} (coming soon)`}
                aria-disabled={story.published ? undefined : true}
                style={{ scrollSnapAlign: "start" }}
                className={`group relative ${story.published ? "cursor-pointer hover:shadow-2xl" : "cursor-default"} min-h-[560px] w-[88vw] sm:h-[560px] lg:h-[max(380px,calc(80svh-236px))] lg:min-h-0 max-w-[1512px] shrink-0 overflow-hidden rounded-[32px] bg-[#1A1A1A] transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#58C7E8] lg:w-[min(1512px,92%)]`}
              >
                {/* Background Image */}
                <img
                  src={story.image}
                  alt={story.title}
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${story.published ? "group-hover:scale-105" : "grayscale-[35%]"}`}
                />
                {story.published ? (
                  <span className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full bg-[#58C7E8] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[#020202] transition group-hover:bg-white lg:left-[48px] lg:top-[40px]">
                    Read case study <ArrowRight size={14} />
                  </span>
                ) : (
                  <span className="absolute left-6 top-6 z-10 rounded-full bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[#020202] lg:left-[48px] lg:top-[40px]">
                    Coming soon
                  </span>
                )}

                {/* Figma Gradient: linear-gradient(180deg, rgba(10, 10, 10, 0.157) 0%, rgba(10, 10, 10, 0.45) 100%) */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10, 10, 10, 0.157) 0%, rgba(10, 10, 10, 0.45) 100%)",
                  }}
                />

                {/* Bottom Auto Layout Container: padding: 14px; gap: 0px 24px */}
                <div className="relative flex min-h-[560px] flex-col justify-end p-5 pt-[84px] sm:absolute sm:inset-0 sm:min-h-0 sm:p-6 lg:p-[14px]">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-[24px]">
                    {/* Left Title Container: width: 900px; padding: 0px 0px 34px 34px; gap: 15px */}
                    <div className="flex flex-col items-start gap-[15px] lg:w-[900px] lg:pb-[34px] lg:pl-[34px]">
                      {/* [Year/Category Tag] */}
                      <span className="font-mono text-[11px] leading-[13px] tracking-[1.1px] text-white/70">
                        {story.clientTag ? `[${story.clientTag.toUpperCase()}]` : "[CASE STUDY]"}
                      </span>
                      {/* Title: 48px / 53px / -1.44px */}
                      <h3 className="font-sans text-[22px] font-normal leading-[1.2] tracking-[-0.02em] text-white sm:text-[26px] lg:text-[32px]">
                        {story.title}
                      </h3>
                    </div>

                    {/* Right Frosted Glass Stats Card: width: 560px; max-w: 560px; height: 245.38px; padding: 36px; gap: 47.38px; background: rgba(16, 16, 16, 0.42); backdrop-blur: 14px; border-radius: 18px */}
                    <div className="flex w-full max-w-[560px] flex-col justify-between rounded-[18px] bg-[rgba(16,16,16,0.42)] p-5 backdrop-blur-[14px] sm:p-6 lg:min-h-[245px] lg:w-[560px] lg:p-[36px]">
                      {/* Stats Row: gap 32px */}
                      <div className="flex flex-wrap items-start gap-x-5 gap-y-3 sm:flex-nowrap sm:gap-6 lg:gap-[28px]">
                        {story.stats.map((stat) => (
                          <div key={stat.label} className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] leading-[13px] tracking-[1.1px] text-white/70">
                              {stat.label.startsWith("[") ? stat.label : `[${stat.label}]`}
                            </span>
                            <div className="whitespace-nowrap font-sans text-[22px] font-normal leading-[30px] tracking-[-0.8px] text-white sm:text-[34px] sm:leading-[38px] sm:tracking-[-1.14px]">
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


      {/* 6. FAQ (same component as the home page; dealer questions) */}
      <PublicFaqSection eyebrow="Dealer Partnership Clarity" items={dealershipFaqs} />


      {/* 8. Public Footer */}
      <PublicFooter />
    </main>
  );
}
