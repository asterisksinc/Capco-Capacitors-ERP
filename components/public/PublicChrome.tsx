"use client";

/* eslint-disable @next/next/no-img-element */
import { SiteFooter } from "./SiteFooter";
import { SmoothScroll } from "./SmoothScroll";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const DEFAULT_FAQS = [
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

const SPECIFY_ACCENT_CELLS = new Set([2, 6, 38, 50, 74, 92, 118, 146, 169, 202, 231, 250]);

export function PublicNav({
  variant = "light",
  logoSrc = "/figma/solutions/caef4.png",
  className = "",
}: {
  variant?: "light" | "transparent" | "overlay";
  logoSrc?: string;
  className?: string;
}) {
  const isDarkHero = variant === "transparent" || variant === "overlay";
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeClass = "font-semibold text-[#58C7E8]";
  const isAboutActive = pathname.startsWith("/about");
  const isSolutionsActive = pathname.startsWith("/solutions");
  const isProductsActive = pathname.startsWith("/products");
  const isRegionsActive = pathname.startsWith("/regions");

  return (
    <header
      className={`z-30 w-full ${
        variant === "overlay"
          ? "relative border-0 bg-transparent text-white"
          : isDarkHero
            ? "sticky top-0 border-b border-white/15 bg-[#101010]/80 text-white backdrop-blur"
            : "sticky top-0 border-b border-[#E4E4E4] bg-white/95 text-[#020202] backdrop-blur"
      } ${className}`}
    >
      <SmoothScroll />
      <div className="mx-auto flex h-[86px] max-w-[1920px] items-center justify-between px-6 lg:px-[60px]">
        <Link href="/" aria-label="CAPCO home" className="inline-flex shrink-0 items-center">
          <Image src={logoSrc} alt="CAPCO Capacitors" width={127} height={47} priority className="h-auto w-[127px]" />
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] font-normal lg:flex xl:gap-8">
          {/* Company Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/about"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#58C7E8] ${
                isAboutActive ? activeClass : ""
              }`}
            >
              Company
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[220px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/about" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                About
              </Link>
              <Link href="/gallery" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Gallery
              </Link>
              <Link href="/gallery?filter=certifications" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Certifications
              </Link>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/solutions/oem"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#58C7E8] ${
                isSolutionsActive ? activeClass : ""
              }`}
            >
              Solutions
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[220px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/solutions/oem" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                OEMs
              </Link>
              <Link href="/solutions/dealership" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Dealerships
              </Link>
              <Link href="/solutions/industrial-enquiry" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Industrial Enquiry
              </Link>
            </div>
          </div>

          {/* Products Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/products"
              className={`inline-flex items-center gap-1.5 transition hover:text-[#58C7E8] ${
                isProductsActive ? activeClass : ""
              }`}
            >
              Products
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[280px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/products" className="block px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5]">
                All Products
              </Link>
              {[
                ["Metalized Polypropylene Film", "Metalized Polypropylene Film [ MPP ]", "/products"],
                ["Fan / Motor Capacitors", "Fan Capacitors", "/products"],
                ["Luminaire Capacitor", "Luminaire Capacitor", "/products"],
                ["Power Factor Capacitors", "Power Factor Capacitors", "/products"],
                ["Customized Capacitors", "All", "/contact?category=oem#enquiry-form"],
              ].map(([label, category, href]) => (
                <div key={label} className="group/product relative">
                  <Link href={href.startsWith("/contact") ? href : `/products?category=${encodeURIComponent(category)}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-[#F5F5F5]">
                    <span>{label}</span>
                    {label !== "Customized Capacitors" && <span aria-hidden="true" className="ml-4 text-base leading-none">›</span>}
                  </Link>
                  {label === "Metalized Polypropylene Film" && (
                    <div className="invisible absolute left-full top-0 w-[300px] border border-[#E4E4E4] bg-white p-2 opacity-0 shadow-xl transition group-hover/product:visible group-hover/product:opacity-100">
                      <Link href="/products/zinc-aluminium-alloy-metalised-bopp-film" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Zinc/ Aluminium Alloy Metalized BOPP Film</Link>
                    </div>
                  )}
                  {label === "Fan / Motor Capacitors" && (
                    <div className="invisible absolute left-full top-0 min-w-[280px] border border-[#E4E4E4] bg-white p-2 opacity-0 shadow-xl transition group-hover/product:visible group-hover/product:opacity-100">
                      <Link href="/products/fan-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Fan Capacitor</Link>
                      <Link href="/products/motor-run-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Motor Run Capacitor</Link>
                      <Link href="/products/motor-start-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Motor Start Capacitor</Link>
                      <Link href="/products/submersible-panel-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Submersible Panel Capacitor</Link>
                      <Link href="/products/ac-refrigeration-washing-machine-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">A.C. / Refrigeration / Washing Machine Capacitor</Link>
                    </div>
                  )}
                  {label === "Luminaire Capacitor" && (
                    <div className="invisible absolute left-full top-0 min-w-[240px] border border-[#E4E4E4] bg-white p-2 opacity-0 shadow-xl transition group-hover/product:visible group-hover/product:opacity-100">
                      <Link href="/products/lighting-luminaire-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Lighting Capacitor</Link>
                      <Link href="/products/uv-lamp-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">UV Lamp Capacitor</Link>
                    </div>
                  )}
                  {label === "Power Factor Capacitors" && (
                    <div className="invisible absolute left-full top-0 min-w-[220px] border border-[#E4E4E4] bg-white p-2 opacity-0 shadow-xl transition group-hover/product:visible group-hover/product:opacity-100">
                      <Link href="/products/pfc-cylindrical-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Cylindrical</Link>
                      <Link href="/products/pfc-box-type-capacitor" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Box Type</Link>
                      <Link href="/products/capacitor-bank" className="block px-4 py-3 text-sm hover:bg-[#F5F5F5]">Capacitor Bank</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recognition Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/gallery?filter=awards"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#58C7E8]`}
            >
              Recognition
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[240px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/gallery?filter=awards" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Awards &amp; Achievements
              </Link>
              <Link href="/case-studies" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Case Studies
              </Link>
            </div>
          </div>

          {/* Global Footprint Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/solutions/oem#global-footprint"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-[#58C7E8] ${
                isRegionsActive ? activeClass : ""
              }`}
            >
              Global Footprint
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[220px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/regions/uae" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                UAE
              </Link>
              <Link href="/regions/usa" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                USA
              </Link>
              <Link href="/regions/sri-lanka" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Sri Lanka
              </Link>
              <Link href="/regions/bangladesh" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Bangladesh
              </Link>
              <Link href="/regions/turkey" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Turkey
              </Link>
              <Link href="/regions/africa" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                African Continent
              </Link>
              <Link href="/regions/egypt" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Egypt
              </Link>
            </div>
          </div>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3.5">
          <a
            href="tel:+919848014000"
            aria-label="Call +91-9848014000"
            className="inline-flex h-12 items-center gap-2 whitespace-nowrap px-2 text-[13px] font-medium transition hover:text-[#58C7E8] xl:px-3"
          >
            <Phone size={15} />
            {/* number only where there is room; icon alone on small laptops (1024-1279px) */}
            <span className="hidden xl:inline">+91-9848014000</span>
          </a>
          <Link
            href="/contact?category=oem#enquiry-form"
            className="inline-flex h-12 items-center whitespace-nowrap bg-[#58C7E8] px-4 text-[13px] font-medium text-[#020202] transition hover:bg-[#41b7d9]"
          >
            Request Quote
          </Link>
        </div>

        <button
          type="button"
          className={`rounded-lg p-3 lg:hidden ${isDarkHero ? "bg-white/10" : "bg-[#F5F5F5]"}`}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="public-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="public-mobile-menu"
          aria-label="Mobile navigation"
          className="absolute left-0 top-full z-50 w-full border-b border-black/10 bg-white p-6 text-black shadow-xl lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setMobileOpen(false);
          }}
        >
          <Link href="/" onClick={() => setMobileOpen(false)} className="block border-b border-black/10 py-3 text-base">
            Home
          </Link>
          {([
            ["Company", [["About", "/about"], ["Gallery", "/gallery"], ["Certifications", "/gallery?filter=certifications"]]],
            ["Solutions", [["OEMs", "/solutions/oem"], ["Dealerships", "/solutions/dealership"], ["Industrial Enquiry", "/solutions/industrial-enquiry"]]],
            ["Products", [["All Products", "/products"]]],
            ["Recognition", [["Awards & Achievements", "/gallery?filter=awards"], ["Case Studies", "/case-studies"]]],
            ["Global Footprint", [["UAE", "/regions/uae"], ["USA", "/regions/usa"], ["Sri Lanka", "/regions/sri-lanka"], ["Bangladesh", "/regions/bangladesh"], ["Turkey", "/regions/turkey"], ["African Continent", "/regions/africa"], ["Egypt", "/regions/egypt"]]],
          ] as const).map(([group, links]) => (
            <div key={group} className="border-b border-black/10 py-3">
              <p className="type-caption font-medium uppercase tracking-[0.08em] text-[#8A8A8A]">{group}</p>
              <div className="mt-1 grid grid-cols-2 gap-x-4">
                {links.map(([label, href]) =>
                  href.startsWith("mailto:") ? (
                    <a key={label} href={href} className="block py-2 text-base">{label}</a>
                  ) : (
                    <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="block py-2 text-base">{label}</Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal text-[#020202]">
      <span className="h-1.5 w-1.5 bg-[#58C7E8]" />
      {children}
    </div>
  );
}

export function ArrowButton({
  children,
  href = "/contact",
  light = false,
}: {
  children: React.ReactNode;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-14 items-center gap-7 px-4 text-sm font-semibold transition ${
        light ? "bg-white text-[#020202] hover:bg-[#58C7E8]" : "bg-[#58C7E8] text-[#020202] hover:bg-[#41b7d9]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </Link>
  );
}

export function ReadyToSpecifyCapcoSection() {
  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-white px-6 py-[60px] text-center lg:min-h-[558px] lg:px-[60px]">
      {/* Figma Ellipse 1: 1742x808 #58C7E8 with 200px blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[calc(50%-237.5px)] h-[808px] w-[1742px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#58C7E8] blur-[200px]"
      />

      {/* Figma Frame 83: 62x62 grid with #EEF7FD borders and accent filled cells at 0.3 opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1920px] flex-wrap content-center items-center justify-center overflow-hidden opacity-30"
      >
        {Array.from({ length: 288 }, (_, idx) => {
          const isFilled = SPECIFY_ACCENT_CELLS.has(idx);
          return (
            <span
              key={idx}
              style={
                isFilled
                  ? {
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                    }
                  : undefined
              }
              className={`-mx-[0.5px] h-[62px] w-[62px] shrink-0 border border-[#EEF7FD] ${
                isFilled ? "bg-[#EEF7FD]" : ""
              }`}
            />
          );
        })}
      </div>

      {/* Foreground Content (z-10) */}
      <div className="relative z-10 mx-auto flex w-full max-w-[946px] flex-col items-center">
        <p className="type-small inline-flex items-center justify-center gap-2 font-medium uppercase leading-none text-[#020202]">
          <span className="h-[6px] w-[6px] bg-white" />
          READY TO SPECIFY CAPCO?
        </p>

        <h2 className="type-h2 mt-6 font-normal text-[#020202]">
          Get Technical Support, Competitive Pricing &amp;
          <br />
          BIS-Certified Quality
        </h2>

        <p className="type-lead mx-auto mt-6 max-w-[698px] text-[#595959]">
          Whether you need a single custom capacitor or a complete supply chain partnership,
          <br className="hidden sm:inline" /> our team is ready to support your requirements.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex w-full flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact?category=oem#enquiry-form"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
            }}
            className="inline-flex min-h-[56px] w-[200px] max-w-full items-end justify-between bg-[#58C7E8] px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
          >
            <span>Request Quote</span>
            <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
          </Link>

          <a
            href="/catalogs/capco-product-catalog.pdf"
            download="CAPCO-Product-Catalog.pdf"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
            }}
            className="inline-flex min-h-[56px] w-[300px] max-w-full items-end justify-between gap-3 bg-white px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:bg-[#F4F4F4]"
          >
            <span>Download Product Catalog (PDF)</span>
            <img src="/figma/solutions/4e858.svg" alt="" aria-hidden="true" />
          </a>
        </div>

        {/* 381px Divider Line */}
        <div className="my-10 h-px w-[381px] max-w-full bg-[#58C7E8]" />

        {/* 3 Trust Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {[
            "Response within 24 hours",
            "BIS/CE Documentation Included",
            "OEM Pricing Available",
          ].map((label, idx) => (
            <div key={label} className="inline-flex items-center gap-2.5">
              <span
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                }}
                className="grid h-[44px] w-[44px] place-items-center bg-[#58C7E8]/40 text-[#020202]"
              >
                {idx === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                ) : idx === 1 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2l2.4 1.8 3-.3 1.2 2.8 2.8 1.2-.3 3L22.9 13l-1.8 2.4.3 3-2.8 1.2-1.2 2.8-3-.3L12 23.9l-2.4-1.8-3 .3-1.2-2.8-2.8-1.2.3-3L1.1 13l1.8-2.4-.3-3 2.8-1.2 1.2-2.8 3 .3L12 2z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
                  </svg>
                )}
              </span>
              <span className="text-[16px] font-normal text-[#020202] lg:text-[18px]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PublicFaqSection({
  eyebrow = "OEM Partnership Clarity",
  title = "Frequently Asked Questions",
  items = DEFAULT_FAQS,
  description,
}: {
  eyebrow?: string;
  title?: string;
  items?: readonly { q: string; a: string }[];
  /** Optional short line under the title. */
  description?: string;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white px-6 py-20 text-center lg:px-[60px] lg:py-[160px]">
      <div className="mx-auto max-w-[1800px]">
        <p className="type-small inline-flex items-center justify-center gap-2 font-medium tracking-[-0.02em] text-[#121212]">
          <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
          {eyebrow}
        </p>
        <h2 className="type-h2 mt-5 font-normal text-[#020202] lg:mt-6">
          {title}
        </h2>
        {description && (
          <p className="type-lead mx-auto mt-5 max-w-[720px] font-light text-[#4F4F4F]">{description}</p>
        )}

        <div className="mx-auto mt-12 grid max-w-[792px] gap-[3px] text-left lg:mt-[80px]">
          {items.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className={`rounded-[8px] px-6 py-5 transition-colors duration-300 ${isOpen ? "bg-[#EFEFEF]" : "bg-[#F5F5F5] hover:bg-[#F0F0F0]"}`}
              >
                <button
                  type="button"
                  id={`faq-q-${idx}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${idx}`}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[15px] font-medium leading-[1.4] tracking-[-0.03em] text-[#121212] lg:text-[16px]"
                >
                  <span>{item.q}</span>
                  <span
                    className={`relative grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[5px] text-white transition-[background-color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${isOpen ? "rotate-180 bg-[#020202]" : "bg-[#292929]"}`}
                    aria-hidden="true"
                  >
                    <span className="h-px w-3 bg-[#AAAAAA]" />
                    <span
                      className={`absolute h-3 w-px bg-[#AAAAAA] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${isOpen ? "scale-y-0" : "scale-y-100"}`}
                    />
                  </span>
                </button>
                {/* grid-rows 0fr→1fr animates to the answer's real height, no max-height guessing */}
                <div
                  id={`faq-a-${idx}`}
                  role="region"
                  aria-labelledby={`faq-q-${idx}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`type-body max-w-[92%] pt-4 text-[#595959] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${isOpen ? "translate-y-0" : "-translate-y-2"}`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Site footer for every public page: renders the home page footer (SiteFooter), including the
 * home "Ready to Partner?" CTA unless hideCta is set. CTA text props are accepted but ignored.
 */
export function PublicFooter({
  hideCta = false,
}: {
  ctaTitle?: string;
  ctaBody?: string;
  ctaButton?: string;
  ctaHref?: string;
  hideCta?: boolean;
}) {
  return <SiteFooter showPartnerCta={!hideCta} />;
}
