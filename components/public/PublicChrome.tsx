"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/public/SiteFooter";

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
  const isContactActive = pathname.startsWith("/contact");

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
      <div className="public-nav-inner mx-auto flex h-[92px] max-w-[1920px] items-center justify-between px-6 lg:px-[44px]">
        <Link href="/" aria-label="CAPCO home" className="inline-flex shrink-0 items-center">
          <Image src={logoSrc} alt="CAPCO Capacitors" width={127} height={47} priority />
        </Link>

        <nav aria-label="Main navigation" className="public-nav-menu hidden items-center gap-6 text-[15px] font-normal lg:flex xl:gap-8">
          {/* Company Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/about"
              className={`inline-flex items-center gap-1.5 transition hover:text-[#58C7E8] ${
                isAboutActive ? activeClass : ""
              }`}
            >
              Company
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[230px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/about" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                About CAPCO
              </Link>
              <Link href="/about#manufacturing-line" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Manufacturing Line
              </Link>
              <Link href="/about#facilities" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Plant Locations
              </Link>
              <Link href="/about#compliance" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Certifications &amp; Compliance
              </Link>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div className="group relative py-2">
            <Link
              href="/solutions/oem"
              className={`inline-flex items-center gap-1.5 transition hover:text-[#58C7E8] ${
                isSolutionsActive ? activeClass : ""
              }`}
            >
              Solutions
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-40 min-w-[230px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/solutions/oem" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                OEM Solutions
              </Link>
              <Link href="/solutions/dealership" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Dealership &amp; Industrial
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
            <div className="invisible absolute left-0 top-full z-40 min-w-[260px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link href="/products" className="block px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5]">
                All Products
              </Link>
              <Link
                href="/products/zinc-aluminium-alloy-metalised-bopp-film"
                className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]"
              >
                Metalized BOPP Film (MPP)
              </Link>
              <Link href="/products/fan-capacitor" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Fan Capacitors
              </Link>
              <Link href="/products/motor-run-capacitor" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Motor Run Capacitors
              </Link>
              <Link href="/products/pfc-cylindrical-capacitor" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Power Factor Correction (PFC)
              </Link>
              <Link href="/products/lighting-luminaire-capacitor" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Luminaire &amp; UV Capacitors
              </Link>
            </div>
          </div>

          {/* Resources Dropdown */}
          <div className="group relative py-2">
            <a
              href="/catalogs/capco-product-catalog.pdf"
              download="CAPCO-Product-Catalog.pdf"
              className="inline-flex items-center gap-1.5 transition hover:text-[#58C7E8]"
            >
              Resources
              <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
            </a>
            <div className="invisible absolute left-0 top-full z-40 min-w-[240px] border border-[#E4E4E4] bg-white p-2 text-[#020202] opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <a
                href="/catalogs/capco-product-catalog.pdf"
                download="CAPCO-Product-Catalog.pdf"
                className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]"
              >
                Download Product Catalog (PDF)
              </a>
              <Link href="/about#compliance" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                BIS / ISO / CE Certificates
              </Link>
              <Link href="/about#faq" className="block px-4 py-2.5 text-sm hover:bg-[#F5F5F5]">
                Frequently Asked Questions
              </Link>
            </div>
          </div>

          <Link
            href="/contact"
            className={`transition hover:text-[#58C7E8] ${isContactActive ? activeClass : ""}`}
          >
            Contact
          </Link>
        </nav>

        <div className="public-nav-actions hidden items-center justify-end gap-3.5 lg:flex">
          <a
            href="tel:+919848014000"
            className="hidden h-12 items-center gap-2 px-3 text-[13px] font-medium transition hover:text-[#58C7E8] xl:inline-flex"
          >
            <Phone size={15} />
            1800-XXX-XXXX
          </a>
          <Link
            href="/contact?category=oem#enquiry-form"
            className="inline-flex h-12 items-center bg-[#58C7E8] px-4 text-[13px] font-medium text-[#020202] transition hover:bg-[#41b7d9]"
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
          {[
            ["Home", "/"],
            ["About CAPCO", "/about"],
            ["OEM Solutions", "/solutions/oem"],
            ["Dealership / Industrial Solutions", "/solutions/dealership"],
            ["Products", "/products"],
            ["Contact", "/contact"],
            ["Request Quote", "/contact?category=oem#enquiry-form"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-black/10 py-3 text-base"
            >
              {label}
            </Link>
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
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </Link>
  );
}

export function ReadyToSpecifyCapcoSection() {
  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-white px-6 py-[60px] text-center lg:min-h-[558px] lg:px-[60px]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src="/figma/home/c64c6.svg" alt="" className="absolute left-1/2 top-[-755px] max-w-none -translate-x-1/2" />
        <img src="/figma/home/79c1e.svg" alt="" className="absolute left-1/2 top-0 max-w-none -translate-x-1/2" />
      </div>

      {/* Foreground Content (z-10) */}
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-[946px] flex-col items-center">
        <p className="inline-flex items-center justify-center gap-2 text-[14px] font-medium uppercase leading-none text-[#020202]">
          <span className="h-[6px] w-[6px] bg-white" />
          READY TO SPECIFY CAPCO?
        </p>

        <h2 className="mt-6 text-[32px] font-normal leading-[1.2] tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:text-[48px]">
          Get Technical Support, Competitive Pricing &amp;
          <br />
          BIS-Certified Quality
        </h2>

        <p className="mx-auto mt-6 max-w-[698px] text-[16px] leading-[1.4] text-[#595959] lg:text-[18px]">
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
            className="inline-flex min-h-[56px] w-[200px] items-end justify-between bg-[#58C7E8] px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
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
            className="inline-flex min-h-[56px] w-[300px] max-w-full items-end justify-between gap-3 bg-white px-3 pb-3 pt-6 text-left text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:-translate-y-0.5 hover:bg-[#F4F4F4]"
          >
            <span>Download Product Catalog (PDF)</span>
            <img src="/figma/solutions/4e858.svg" alt="" aria-hidden="true" />
          </a>
        </div>

        {/* 381px Divider Line */}
        <div className="my-10 h-px w-full max-w-[381px] bg-[#58C7E8]" />

        {/* 3 Trust Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {[
            "Response within 24 hours",
            "BIS/CE Documentation Included",
            "OEM Pricing Available",
          ].map((label, idx) => (
            <div key={label} className="inline-flex max-w-full items-center gap-2.5 text-left">
              <img src={[
                "/figma/home/ffd18.svg", "/figma/home/b0b0f.svg", "/figma/home/93f49.svg",
              ][idx]} alt="" className="shrink-0" />
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
}: {
  eyebrow?: string;
  title?: string;
  items?: readonly { q: string; a: string }[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white px-6 py-20 text-center lg:px-[60px] lg:py-[160px]">
      <div className="mx-auto max-w-[1800px]">
        <p className="inline-flex items-center justify-center gap-2 text-[13px] font-medium tracking-[-0.02em] text-[#121212]">
          <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
          {eyebrow}
        </p>
        <h2 className="mt-5 text-[34px] font-normal leading-none tracking-[-0.04em] text-[#020202] sm:text-[42px] lg:mt-6 lg:text-[48px]">
          {title}
        </h2>

        <div className="mx-auto mt-12 grid max-w-[792px] gap-[3px] text-left lg:mt-[80px]">
          {items.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className="rounded-[8px] bg-[#F5F5F5] px-6 py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[15px] font-medium leading-[1.4] tracking-[-0.03em] text-[#121212] lg:text-[16px]"
                >
                  <span>{item.q}</span>
                  <span className="relative grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[5px] bg-[#292929] text-white">
                    <span className="h-px w-3 bg-[#AAAAAA]" />
                    {!isOpen && <span className="absolute h-3 w-px bg-[#AAAAAA]" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-4 max-w-[92%] text-[14px] leading-[1.55] text-[#595959] lg:text-[15px]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PublicFooter({
  ctaTitle = "Ready to Partner?",
  ctaBody = "Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery.",
  ctaButton = "Request OEM Pricing",
  ctaHref = "/contact?category=oem#enquiry-form",
}: {
  ctaTitle?: string;
  ctaBody?: string;
  ctaButton?: string;
  ctaHref?: string;
}) {
  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    window.location.href = `mailto:sales@capcocapacitor.com?subject=${encodeURIComponent(
      "Newsletter Signup"
    )}&body=${encodeURIComponent(`Please subscribe ${email} to CAPCO updates.`)}`;
  };

  return (
    <>
      <section
        id="contact"
        className="relative grid min-h-[560px] place-items-center overflow-hidden bg-[#121212] px-6 py-24 text-white lg:min-h-[720px] lg:px-[60px]"
      >
        {/* Concentric Rings & Dial Ticks */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <span className="absolute left-1/2 top-1/2 h-[980px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <span className="absolute left-1/2 top-1/2 h-[1500px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
          <div
            style={{ backgroundImage: 'url("/figma/solutions/527c0.svg")' }}
            className="absolute left-1/2 top-1/2 h-[636px] w-[636px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat"
          />
          <div
            style={{ backgroundImage: 'url("/figma/solutions/9c1db.svg")' }}
            className="absolute left-1/2 top-1/2 h-[856px] w-[856px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-no-repeat"
          />
          {/* 4 Corner L-Brackets */}
          <span className="absolute left-[15.9%] top-[18%] hidden h-[10px] w-[10px] border-l border-t border-white/30 lg:block" />
          <span className="absolute right-[15.9%] top-[18%] hidden h-[10px] w-[10px] border-r border-t border-white/30 lg:block" />
          <span className="absolute bottom-[18%] left-[15.9%] hidden h-[10px] w-[10px] border-b border-l border-white/30 lg:block" />
          <span className="absolute bottom-[18%] right-[15.9%] hidden h-[10px] w-[10px] border-b border-r border-white/30 lg:block" />
        </div>

        <div className="relative z-10 mx-auto max-w-[860px] text-center">
          <h2 className="text-[36px] font-normal leading-[1.15] tracking-[-0.05em] text-white sm:text-[42px] lg:text-[48px]">
            {ctaTitle}
          </h2>
          {ctaBody ? (
            <p className="mx-auto mt-6 max-w-[860px] text-[16px] leading-[1.42] tracking-[-0.03em] text-white/90 lg:mt-8 lg:text-[18px]">
              {ctaBody}
            </p>
          ) : null}
          <div className="mt-8">
            <Link
              href={ctaHref}
              style={{
                backgroundImage: 'url("/figma/solutions/ad979.svg")',
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
              className="inline-flex min-h-[68px] w-[200px] items-end justify-between px-3 pb-3 pt-6 text-[14px] font-medium leading-[1.2] text-[#121212] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <span>{ctaButton}</span>
              <img src="/figma/solutions/24503.svg" alt="" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <footer
        hidden
        style={{
          backgroundImage: 'url("/figma/solutions/a62f2.png")',
          backgroundSize: "100% 100%",
        }}
        className="border-t border-white/10 bg-[#121212] px-6 pb-10 pt-16 text-white lg:px-[60px]"
      >
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,680fr)_minmax(0,1040fr)] lg:gap-[80px]">
            <div>
              <h3 className="text-[28px] font-normal tracking-[-0.04em] text-white lg:text-[32px]">
                Talk with an expert at Capco
              </h3>
              <form onSubmit={handleNewsletter} className="mt-4 flex max-w-[276px]">
                <input
                  type="email"
                  name="email"
                  required
                  aria-label="Email address for newsletter"
                  placeholder="Your email"
                  className="h-[40px] w-[70%] min-w-0 bg-white/20 px-3 text-[11px] text-white placeholder:text-white/60 outline-none"
                />
                <button
                  type="submit"
                  className="h-[40px] flex-1 cursor-pointer bg-white px-3 text-[11px] font-medium text-[#121212] transition hover:bg-[#58C7E8]"
                >
                  Sign Up
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 lg:gap-y-[100px]">
              <div>
                <p className="mb-4 text-[14px] text-white/40">Company</p>
                <div className="space-y-1.5 text-[12px]">
                  <Link href="/" className="block hover:text-[#58C7E8]">
                    Home
                  </Link>
                  <Link href="/about" className="block hover:text-[#58C7E8]">
                    About
                  </Link>
                  <Link href="/solutions/oem" className="block hover:text-[#58C7E8]">
                    Solutions
                  </Link>
                  <Link href="/products" className="block hover:text-[#58C7E8]">
                    Projects
                  </Link>
                  <Link href="/contact" className="block hover:text-[#58C7E8]">
                    Careers
                  </Link>
                  <Link href="/contact" className="block hover:text-[#58C7E8]">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <p className="mb-4 text-[14px] text-white/40">Solutions</p>
                <div className="space-y-1.5 text-[12px]">
                  <Link href="/solutions/oem" className="block hover:text-[#58C7E8]">
                    Systems
                  </Link>
                  <Link href="/solutions/dealership" className="block hover:text-[#58C7E8]">
                    Deployment
                  </Link>
                  <Link href="/products" className="block hover:text-[#58C7E8]">
                    Software
                  </Link>
                </div>
              </div>

              <div>
                <p className="mb-4 text-[14px] text-white/40">Media</p>
                <div className="space-y-1.5 text-[12px]">
                  <Link href="/about#compliance" className="block hover:text-[#58C7E8]">
                    Newsroom
                  </Link>
                  <Link href="/about#compliance" className="block hover:text-[#58C7E8]">
                    Announcements
                  </Link>
                  <Link href="/about" className="block hover:text-[#58C7E8]">
                    Editorial
                  </Link>
                  <Link href="/about" className="block hover:text-[#58C7E8]">
                    Shareholder Letters
                  </Link>
                </div>
              </div>

              <div>
                <p className="mb-4 text-[14px] text-white/40">Social</p>
                <div className="space-y-1.5 text-[12px]">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block hover:text-[#58C7E8]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block hover:text-[#58C7E8]"
                  >
                    X (Twitter)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 text-[12px] text-white/55 lg:mt-[120px]">
            <Link href="/" aria-label="CAPCO home">
              <img src="/figma/solutions/75083.svg" alt="Capco" className="h-auto max-w-[240px]" />
            </Link>
            <span>©2026 Capco Energy</span>
            <div className="flex flex-col text-white">
              <Link href="/privacy-policy" className="hover:text-[#58C7E8]">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-[#58C7E8]">
                Terms &amp; Conditions
              </Link>
              <Link href="/cookie-policy" className="hover:text-[#58C7E8]">
                Cookie Policy
              </Link>
            </div>
            <span>
              All Rights Reserved. <span className="ml-3">Website by Flowit.Supply</span>
            </span>
          </div>
        </div>
      </footer>
      <SiteFooter />
    </>
  );
}
