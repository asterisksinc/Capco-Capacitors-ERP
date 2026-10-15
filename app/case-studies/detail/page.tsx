/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

export const metadata: Metadata = {
  title: "Case Study Detail | CAPCO Capacitors",
  description:
    "See how CAPCO capacitors deliver reliability, custom dielectric engineering, and cost savings across OEM and industrial applications.",
};

const relatedStories = [
  {
    image: "/figma/solutions/case-study-rel-1.png",
    date: "08.06.2026",
    author: "logo ipsum",
    title: "Lorem ipsum dolor sit amet",
    tag: "LOREM IPSUM DOLOR",
  },
  {
    image: "/figma/solutions/case-study-rel-2.png",
    date: "08.06.2026",
    author: "logo ipsum",
    title: "Lorem ipsum dolor sit amet",
    tag: "LOREM IPSUM DOLOR",
  },
  {
    image: "/figma/solutions/case-study-rel-3.png",
    date: "08.06.2026",
    author: "logo ipsum",
    title: "Lorem ipsum dolor sit amet",
    tag: "LOREM IPSUM DOLOR",
  },
  {
    image: "/figma/solutions/case-study-rel-4.png",
    date: "08.06.2026",
    author: "logo ipsum",
    title: "Lorem ipsum dolor sit amet",
    tag: "LOREM IPSUM DOLOR",
  },
] as const;

export default function CaseStudyDetailPage() {
  return (
    <main className="min-h-screen bg-white text-[#020202]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
         ───────────────────────────────────────────────────────────── */}
      <PublicNav variant="light" />

      {/* ─────────────────────────────────────────────────────────────
          2. HERO HEADER (Frame 3)
         ───────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 lg:px-[60px] lg:pt-[52px]">
        <div className="mx-auto flex max-w-[1920px] flex-col justify-between gap-8 pb-10 lg:flex-row lg:items-end lg:gap-12">
          {/* Left Title and Pill (Frame 164) */}
          <div className="max-w-[709px]">
            <div className="inline-flex h-[28px] items-center rounded-[4px] bg-[#F4F4F4] px-2.5">
              <span className="text-[12px] font-normal uppercase leading-[120%] text-[#595959]">
                LOREM IPSUM DOLOR
              </span>
            </div>
            <h1 className="mt-5 text-[32px] font-normal leading-[120%] text-[#020202] sm:text-[40px] lg:text-[48px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            </h1>
          </div>

          {/* Right Cyan Box with White Capco Logo (Frame 166) */}
          <div className="flex h-[140px] w-full max-w-[450px] items-center justify-center bg-[#57C7E8] sm:h-[160px] lg:h-[191px] lg:w-[450px]">
            <img
              src="/figma/solutions/capco-logo-white.png"
              alt="CAPCO Capacitors"
              className="h-auto w-[180px] object-contain sm:w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Full-Width Plant Facility Hero Image (Frame 167) */}
      <div className="w-full overflow-hidden bg-[#1A1A1A]">
        <img
          src="/figma/solutions/plant-facilities-bg.png"
          alt="CAPCO manufacturing facility"
          className="h-[360px] w-full object-cover sm:h-[520px] lg:h-[959px]"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. METADATA & MARKET EXPERTISE SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 lg:px-[60px] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          {/* Metadata Bar (Frame 168) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-[12px] leading-[120%]">
              <span className="text-[#B8B8B8]">08.06.2026</span>
              <span className="text-[#B8B8B8]">/</span>
              <span className="text-[#B8B8B8]">Posted by</span>
              <span className="font-normal text-[#020202]">Russell Gold</span>
            </div>
            <div className="h-px w-full bg-[#E4E4E4]/50" />
          </div>

          {/* Market Expertise Row (Frame 151) */}
          <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="flex items-center gap-2 text-[14px] font-medium leading-none text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              MARKET EXPERTISE
            </div>

            <p className="max-w-[612px] text-[16px] font-normal leading-[120%] text-[#121212]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MODERN CAMPUS BUILDING PHOTO & MULTI-COLUMN ARTICLE
         ───────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 lg:px-[60px] lg:pb-32">
        <div className="mx-auto max-w-[1800px]">
          {/* Building Photo (Frame 169) */}
          <div className="overflow-hidden rounded-[28px] sm:rounded-[56px] lg:rounded-[98px]">
            <img
              src="/figma/solutions/case-study-building.png"
              alt="Industrial corporate campus facility"
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Right-Aligned Article Content (Frame 151 & Frame 172) */}
          <div className="mt-16 flex justify-end lg:mt-24">
            <div className="flex w-full max-w-[560px] flex-col gap-10">
              {/* Block 1 */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[28px] font-medium leading-[120%] text-[#020202] sm:text-[32px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <div className="flex flex-col gap-3.5 text-[16px] font-normal leading-[120%] text-[#121212]">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[28px] font-medium leading-[120%] text-[#020202] sm:text-[32px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <p className="text-[16px] font-normal leading-[120%] text-[#121212]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* Block 3 */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[28px] font-medium leading-[120%] text-[#020202] sm:text-[32px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <p className="text-[16px] font-normal leading-[120%] text-[#121212]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* Block 4 */}
              <div className="flex flex-col gap-4">
                <h2 className="text-[28px] font-medium leading-[120%] text-[#020202] sm:text-[32px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <p className="text-[16px] font-normal leading-[120%] text-[#121212]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. RELATED CASE STUDIES (4 Cards Grid - Frame 162)
         ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-[#EAEAEA] bg-white px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <h2 className="text-[32px] font-medium leading-[120%] text-[#020202] sm:text-[38px] lg:text-[42px]">
            Lorem ipsum dolor sit amet
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2">
            {relatedStories.map((card, idx) => (
              <Link
                key={idx}
                href="/case-studies/detail"
                className="group flex flex-col gap-5 transition hover:opacity-95"
              >
                {/* 444px x 320px Image Container */}
                <div className="relative aspect-[444/320] w-full overflow-hidden bg-[#F4F4F4]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info (Frame 155) */}
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2 text-[12px] leading-[120%]">
                    <span className="text-[#020202]">{card.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#020202]" />
                    <span className="text-[#020202]">By</span>
                    <span className="text-[#B8B8B8]">{card.author}</span>
                  </div>

                  <h3 className="text-[18px] font-medium leading-[120%] text-[#020202] transition group-hover:text-[#58C7E8]">
                    {card.title}
                  </h3>

                  <div className="inline-flex h-[28px] items-center rounded-[4px] bg-[#F4F4F4] px-2.5">
                    <span className="text-[10px] font-normal uppercase leading-[120%] text-[#595959]">
                      {card.tag}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. READY TO PARTNER? (Pre-Footer CTA with Radar Graphic)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#121212] px-6 py-28 text-center text-white lg:px-[60px] lg:py-36">
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

        <div className="relative z-10 mx-auto max-w-[901px]">
          <h2 className="text-[36px] font-normal leading-[55px] tracking-[-2.4px] text-white sm:text-[44px] lg:text-[48px]">
            Ready to Partner?
          </h2>
          <p className="mx-auto mt-4 max-w-[901px] text-[16px] font-medium leading-[22px] tracking-[-0.72px] text-white sm:text-[18px]">
            Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/contact?category=oem#enquiry-form"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
              }}
              className="inline-flex h-[56px] w-[200px] items-center justify-between bg-[#4E76F5] px-5 py-3.5 text-[14px] font-medium leading-[120%] !text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <span className="!text-white">Request OEM Pricing</span>
              <ArrowRight size={18} className="!text-white shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PUBLIC FOOTER
         ───────────────────────────────────────────────────────────── */}
      <PublicFooter hideCta={true} />
    </main>
  );
}
