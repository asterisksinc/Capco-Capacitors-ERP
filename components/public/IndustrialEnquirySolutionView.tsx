"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import HomeHero from "@/components/public/HomeHero";
import { PlantFacilitiesSection } from "@/components/public/PlantFacilitiesSection";
import { featuredCaseStudies } from "@/lib/caseStudies";
import { productHref } from "@/lib/publicProducts";
import { CertificationStrip } from "@/components/public/CertificationStrip";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  PublicFooter,
  PublicFaqSection,
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

/** Category image from the shared product catalogue (same photos as the home page category cards). */

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
    slug: "customized-capacitor",
  },
] as const;

const successStories = featuredCaseStudies;

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

export function IndustrialEnquirySolutionView() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const storiesScrollRef = useRef<HTMLDivElement | null>(null);
  const projectCardsScrollRef = useRef<HTMLDivElement | null>(null);

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
      {/* 1. Hero (shared with the home page) */}
      <HomeHero
        id="industrial-hero-title"
        image="/figma/solutions/heroes/industrial-hero.jpg"
        imageAlt="Industrial manufacturing plant with power infrastructure at dusk"
        overlay
        description={<>CAPCO provides power factor audits, APFC panel integration support, and bulk capacitor supply (0.5–25 KVAR, up to 150 KVAR banks) for industrial buyers seeking to reduce electricity demand charges, improve voltage stability, and minimize equipment downtime.</>}
        tags={["Reduce Energy Costs", "Improve Power Quality"]}
        title={["Industrial Power Factor", "Correction Solutions"]}
        primary={{ label: "Request Power Audit", href: "/contact?category=industrial#enquiry-form" }}
        secondary={{ label: "Request Bulk Quote", href: "/contact?category=bulk#enquiry-form" }}
        cutColor="#ffffff"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. THE COST OF POOR POWER FACTOR (Projects List)
         ───────────────────────────────────────────────────────────── */}
      <section id="industrial-penalty" className="bg-white px-6 py-20 lg:px-[60px] lg:py-12">
        <div className="mx-auto max-w-[1920px]">
          {/* Eyebrow and Heading Grid (Frame 151) */}
          <div className="grid gap-6 lg:grid-cols-[680px_1fr] lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                THE COST OF POOR POWER FACTOR
              </div>
              <h2 className="type-h2 mt-4 font-normal text-[#121212]">
                Are You Paying Penalty Charges for Low Power Factor?
              </h2>
            </div>
            <div className="flex justify-end">
              <p className="type-lead max-w-[612px] font-normal text-[#595959]">
                Most industrial facilities in India operate at a power factor of 0.75–0.85, well below the 0.95 threshold required by most state electricity boards.
              </p>
            </div>
          </div>

          {/* Horizontal Scroll Projects List (3 Cards: 1512px x 864px) */}
          <div
            ref={projectCardsScrollRef}
            className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 lg:mt-8"
          >
            {/* Card 1: Power Factor Penalties */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[max(380px,calc(80svh-282px))] lg:w-[min(1512px,92%)]">
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
                <h3 className="type-h3-lg font-normal text-white">
                  Power Factor Penalties
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="type-body font-normal text-white/80">
                  Facilities operating below 0.95 power factor face penalty charges of ₹1–3 per KVA of reactive power, adding significant costs to monthly electricity bills.
                </p>
                <div className="text-[26px] font-normal leading-[140%] text-white/90 sm:text-[32px]">
                  ₹5–20 Lakhs Annual Penalty
                </div>
              </div>
            </div>

            {/* Card 2: Success Stories */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[max(380px,calc(80svh-282px))] lg:w-[min(1512px,92%)]">
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
                <h3 className="type-h3-lg font-normal text-white">
                  Success Stories
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="type-body font-normal text-white/80">
                  See how OEMs, dealers, and industrial buyers achieved cost savings, efficiency gains, and growth with CAPCO capacitors.
                </p>
                <Link
                  href="/case-studies"
                  className="inline-flex h-[56px] w-[230px] items-center justify-between bg-white px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:bg-[#F2F2F2]"
                >
                  <span className="!text-[#020202]">View Case Studies</span>
                  <ArrowRight size={18} className="!text-[#020202]" />
                </Link>
              </div>
            </div>

            {/* Card 3: Industry Trends & Best Practices */}
            <div className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[max(380px,calc(80svh-282px))] lg:w-[min(1512px,92%)]">
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
                <h3 className="type-h3-lg font-normal text-white">
                  Industry Trends & Best Practices
                </h3>
              </div>

              {/* Bottom Right Glass Card */}
              <div className="absolute bottom-4 right-4 flex max-w-[560px] flex-col gap-6 rounded-[18px] bg-[rgba(16,16,16,0.42)] p-8 backdrop-blur-[14px] sm:bottom-8 sm:right-8 sm:p-10">
                <p className="type-body font-normal text-white/80">
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
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
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
          <div className="mt-12 flex flex-col gap-6 lg:mt-14">
            {waysCapcoHelps.map((way) => {
              const IconComp = way.icon;
              return (
                <div
                  key={way.id}
                  className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start lg:gap-10"
                >
                  {/* Left label, aligned with the top of its card */}
                  <span className="type-h4 font-medium uppercase text-[#595959] lg:pt-8">
                    {way.tabLabel}
                  </span>

                  {/* Right Card (902px x 394px) with Chamfered Bottom-Right Corner */}
                  <div
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)",
                    }}
                    className="flex flex-col justify-between bg-white p-7 lg:w-[760px] lg:shrink-0 lg:p-8"
                  >
                    <div>
                      {/* 64px Icon Box */}
                      <div className="grid h-12 w-12 place-items-center bg-[#DEDEDE]/40">
                        <IconComp size={22} className="text-[#595959]" />
                      </div>

                      <h3 className="type-h3 mt-5 font-normal text-[#020202]">
                        {way.title}
                      </h3>

                      <p className="type-small mt-3 max-w-[620px] font-light leading-[1.6] text-[#595959]">
                        {way.body}
                      </p>
                    </div>

                    <div>
                      <div className="my-5 h-px w-full bg-[#DBDBDB]" />

                      <div className="flex flex-wrap items-center gap-6">
                        <Link
                          href={way.href}
                          className="inline-flex h-[34px] min-w-[170px] items-center justify-center bg-[#58C7E8] px-4 text-[13px] font-medium leading-[120%] !text-[#020202] transition hover:brightness-105"
                        >
                          <span className="!text-[#020202]">{way.cta}</span>
                        </Link>

                        <div className="hidden h-[26px] w-[1px] bg-[#DBDBDB] sm:block" />

                        <span className="type-caption font-medium uppercase tracking-[0.06em] text-[#595959]">
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

      {/* 4. Certifications & key numbers (shared with the About and OEM pages) */}
      <CertificationStrip />

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
              <h2 className="type-h2 mt-4 font-normal text-[#020202]">
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
              className="inline-flex h-[56px] w-[300px] max-w-full items-center justify-between gap-3 bg-[#58C7E8] px-5 py-3 text-[14px] font-medium leading-[120%] !text-[#020202] transition hover:brightness-105"
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
                    "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                }}
                className="group flex min-h-[340px] flex-col justify-between gap-8 bg-[#F5F5F5] p-7 transition-colors duration-300 hover:bg-[#EEEEEE] lg:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="type-small rounded-[4px] border border-[#DCDCDC] bg-white/60 px-3 py-1.5 text-[#020202]">
                      {prod.tag}
                    </span>
                    <span className="type-small font-medium text-[#58C7E8]">{prod.code}</span>
                  </div>
                  <h3 className="type-h3 mt-8 font-normal text-[#020202]">{prod.title}</h3>
                  <p className="type-body mt-4 text-[#595959]">{prod.body}</p>
                </div>

                <div>
                  <div className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] uppercase text-[#595959]">
                    {prod.specs.map(([label, val]) => (
                      <span key={label}>
                        {label.replace(/:$/, "")}: <span className="font-medium normal-case text-[#020202]">{val}</span>
                      </span>
                    ))}
                  </div>
                  <Link
                    href={productHref(prod.slug)}
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)" }}
                    className="inline-flex min-h-[52px] items-center gap-8 bg-white px-4 text-[14px] font-medium !text-[#020202] transition hover:bg-[#58C7E8]"
                  >
                    <span>{prod.cta}</span>
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
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
      <section id="industrial-stories" className="bg-white px-6 py-20 lg:px-[60px] lg:py-12">
        <div className="mx-auto max-w-[1920px]">
          {/* Header Row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.56px] text-[#1C1C1C]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                Proven Partnerships
              </div>
              <h2 className="type-h2 mt-4 font-normal text-[#121212]">
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
            className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 lg:mt-8"
          >
            {successStories.map((story) => (
              <div
                key={story.title}
                data-story-card
                className="relative h-[620px] w-[90vw] shrink-0 snap-start overflow-hidden rounded-[32px] bg-[#1A1A1A] sm:h-[720px] md:w-[75vw] lg:h-[max(380px,calc(80svh-236px))] lg:w-[min(1512px,92%)]"
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
                      <h3 className="type-h3-lg mt-3 font-normal text-white">
                        {story.title}
                      </h3>
                      <p className="type-body mt-4 max-w-[620px] text-white/80">
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

                      {story.published ? (
                        <Link
                          href={`/case-studies/${story.slug}`}
                          className="inline-flex items-center justify-between text-[13px] font-medium !text-white transition hover:!text-[#58C7E8]"
                        >
                          <span>Read Full Case Study</span>
                          <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <span className="inline-flex w-fit items-center rounded-full bg-white px-3 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#020202]">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. FAQ (same component as the home page; industrial questions) */}
      <PublicFaqSection eyebrow="Industrial Buyer Clarity" items={faqItems} />

      {/* 9. Plant Facilities (same section as the Dealership page) */}
      <PlantFacilitiesSection />


      {/* ─────────────────────────────────────────────────────────────
          11. PUBLIC FOOTER
         ───────────────────────────────────────────────────────────── */}
      <PublicFooter />
    </main>
  );
}
