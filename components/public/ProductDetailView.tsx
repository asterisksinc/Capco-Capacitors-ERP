"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ClientTicker from "@/components/public/ClientTicker";
import { PhaseTimeline } from "@/components/public/PhaseTimeline";
import { ArrowRight } from "lucide-react";
import { PublicFaqSection, PublicNav } from "@/components/public/PublicChrome";
import { SiteFooter } from "@/components/public/SiteFooter";
import { type PublicProduct, publicProducts, productHref } from "@/lib/publicProducts";
import { productCopy, productSpecs } from "@/lib/productCopy";
import { exportMarkets, WhereWeOperateSection } from "@/components/public/WhereWeOperateSection";

const defaultSpecs: [string, string][] = [
  ["Type", "Standard / Customised"],
  ["Thickness", "3.5 - 14 Micron"],
  ["Film Width", "25, 30, 37.5, 45, 50, 60, 75, 100 mm"],
  ["Roll OD", "Up to 350mm"],
  ["Core ID", "75 mm"],
  ["Surface Resistivity", "6-9 OHMS / Square"],
  ["Free Margin", "1.5 - 1.8 mm"],
];

const manufacturingPhases = [
  {
    phase: "PHASE 01",
    category: "Raw Material",
    step: "01 / 05",
    title: "Film Procurement",
    description: "Sourced from certified BOPP suppliers with strict dielectric strength tolerances.",
    nextPreview: "Enclosure, P",
  },
  {
    phase: "PHASE 02",
    category: "Vacuum Metallization",
    step: "02 / 05",
    title: "Leybold Alloy Deposition",
    description: "In-house zinc-aluminium alloy vapor deposition with controlled heavy-edge resistivity profiles.",
    nextPreview: "Precision Sl",
  },
  {
    phase: "PHASE 03",
    category: "Micro-Slitting",
    step: "03 / 05",
    title: "High-Speed Precision Slitting",
    description: "Automated tension-controlled slitting across 25 mm to 100 mm widths with burr-free margins.",
    nextPreview: "Element Wind",
  },
  {
    phase: "PHASE 04",
    category: "Winding & Spraying",
    step: "04 / 05",
    title: "Automated Element Winding",
    description: "Swiss Metar winding and Schoopage metal spraying for low dissipation factor and long life.",
    nextPreview: "HV Dielectric",
  },
  {
    phase: "PHASE 05",
    category: "Quality Assurance",
    step: "05 / 05",
    title: "100% Dielectric & BIS Testing",
    description: "Self-healing clearing tests, capacitance verification, and vacuum-sealed moisture packaging.",
    nextPreview: "Film Procure",
  },
];

const journeySteps = [
  {
    title: "Technical Consultation",
    body: "Share your specifications, application requirements, and target pricing. Our engineers will recommend optimal solutions.",
    image: "/figma/products/journey/01-consultation.jpg",
  },
  {
    title: "Prototype & Validation",
    body: "Receive samples for testing and validation. We'll iterate based on your feedback until performance matches your expectations.",
    image: "/figma/products/journey/02-prototype.jpg",
  },
  {
    title: "Production & Delivery",
    body: "Finalize commercial terms, sign supply agreement, and begin regular deliveries with JIT or bulk shipment options.",
    image: "/figma/products/journey/03-delivery.jpg",
  },
];

const certifications = [
  ["/figma/home/bis-isi.svg", "BIS ISI", "IS:1709 / IS:1569", "IS:2993 / IS:13340"],
  ["/figma/home/iso-9001.svg", "ISO 9001", "2008 Standards", "Quality Management"],
  ["/figma/home/ce-mark.svg", "CE MARK", "European Conformity", "Low Voltage Directive"],
  ["/figma/home/iec-logo.svg", "IEC 60252-1", "AC Motor Capacitors", "General Safety Rules"],
  ["/figma/home/iec-logo.svg", "IEC 60831", "Power Capacitors", "Self-Healing Shunt"],
] as const;

type ProductDetailViewProps = {
  product: PublicProduct;
  previous: PublicProduct;
  next: PublicProduct;
};

export function ProductDetailView({ product, previous, next }: ProductDetailViewProps) {
  const [carouselPage, setCarouselPage] = useState(0);

  const totalPages = 4;
  const visibleProducts = [0, 1, 2].map(
    (offset) => publicProducts[(carouselPage * 3 + offset) % publicProducts.length]
  );

  const copy = productCopy[product.slug];
  const phaseItems = (copy?.phases ?? manufacturingPhases.map((phase) => ({ category: phase.category, title: phase.title, description: phase.description }))).map((phase, index) => ({
    ...phase,
    phase: `PHASE ${String(index + 1).padStart(2, "0")}`,
    step: `${String(index + 1).padStart(2, "0")} / ${String(copy?.phases.length ?? manufacturingPhases.length).padStart(2, "0")}`,
    nextPreview: index < 4 ? (copy?.phases[index + 1]?.title ?? manufacturingPhases[index + 1]?.title ?? "") : (copy?.phases[0]?.title ?? "Film Procurement"),
  }));

  const isBoppFilm = product.slug === "zinc-aluminium-alloy-metalised-bopp-film";
  const displayCategory = isBoppFilm
    ? "Metalized Polypropylene Film (MPP)"
    : product.category;

  // Content for the top of the page (hero → phases) comes from lib/productCopy.ts.
  const heroTag = copy?.heroTag ?? displayCategory;
  const heroTitle = copy?.heroTitle ?? product.title;
  const logoTagline =
    copy?.logoTagline ?? "Trusted by Leading Capacitor Manufacturers Across India, Middle East & Southeast Asia";
  const infoTag = copy?.infoTag ?? "Premium-Grade Metallized Dielectric Film";
  const infoDescription = copy?.description ?? product.summary;
  const includedTag = copy?.includedTag ?? "Engineered for Reliability";
  const includedItems = copy?.includedItems ?? [];

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. Top Navigation Bar */}
      <PublicNav logoSrc="/figma/solutions/caef4.png" />

      {/* 2. Product Hero Header & Prev/Next Controls */}
      <section className="px-6 pb-16 pt-10 lg:min-h-[527px] lg:px-[60px] lg:pb-[128px] lg:pt-[74px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.02em] text-[#666666]">
            <Link href={productHref(previous.slug)} className="transition hover:text-[#020202]">
              Previous Product
            </Link>
            <Link href={productHref(next.slug)} className="transition hover:text-[#020202]">
              Next Product
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              href={productHref(previous.slug)}
              aria-label={`Previous product: ${previous.title}`}
              className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
            >
              <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" className="rotate-180" />
            </Link>
            <Link
              href={productHref(next.slug)}
              aria-label={`Next product: ${next.title}`}
              className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
            >
              <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" />
            </Link>
          </div>

          <div className="mx-auto mt-6 max-w-[920px] text-center lg:mt-[10px]">
            <p className="type-small inline-flex items-center gap-2.5 font-medium tracking-[-0.02em] text-[#121212]">
              <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
              {heroTag}
            </p>
            <h1 className="type-display mt-5 font-normal text-[#020202]">
              {isBoppFilm ? (
                <>
                  Zinc/Aluminium Alloy
                  <br className="hidden sm:block" /> Metalized BOPP Film
                </>
              ) : (
                heroTitle
              )}
            </h1>
            {isBoppFilm && (
              <p className="type-caption mt-5 font-mono uppercase tracking-[0.08em] text-[#595959]">
                {displayCategory}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. Product information: description, what's included, drawing & specs */}
      <section className="border-y border-[#E7E7E7]">
        <div className="mx-auto max-w-[1920px]">
          {/* Top Row */}
          <div className="grid border-b border-[#E7E7E7] lg:grid-cols-2">
            {/* Top-Left Cell */}
            <div className="flex flex-col justify-between border-b border-[#E7E7E7] p-6 lg:min-h-[481px] lg:border-b-0 lg:border-r lg:p-[24px]">
              <h2 className="type-h3 font-normal text-[#020202]">
                {infoTag}
              </h2>
              <p className="type-body mt-16 max-w-[420px] text-[#404040] lg:mt-0">
                {infoDescription}
              </p>
            </div>

            {/* Top-Right Cell */}
            <div className="p-6 lg:min-h-[481px] lg:p-[24px]">
              {/* Real exploded drawing when we have one (fan, motor run); otherwise the product photo */}
              <h2 className="type-h3 font-normal text-[#020202]">
                {copy?.drawing ? "Technical Drawing" : "Product"}
              </h2>
              {copy?.drawing ? (
                <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-[759px] lg:mt-6">
                  <Image
                    src={copy.drawing}
                    alt={`${product.title}: exploded technical drawing`}
                    fill
                    sizes="(min-width: 1024px) 759px, 92vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[16px] bg-[#F4F4F4]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 560px, 92vw"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2">
            {/* Bottom-Left Cell: What's included */}
            <div className="flex flex-col border-b border-[#E7E7E7] p-6 lg:min-h-[347px] lg:border-b-0 lg:border-r lg:p-[24px]">
              <p className="type-caption inline-flex items-center gap-2 font-mono uppercase tracking-[0.08em] text-[#595959]">
                <span className="h-[4px] w-[4px] bg-[#58C7E8]" />
                {includedTag}
              </p>
              <h2 className="type-h3 mt-3 font-normal text-[#020202]">
                What&apos;s included
              </h2>
              <div className="mt-6 flex flex-wrap items-start gap-[10px]">
                {includedItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full bg-[#F4F4F4] px-[16px] py-[9px] text-[13px] font-normal leading-none tracking-[-0.02em] text-[#121212]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 lg:mt-auto lg:pt-8">
                <a
                  href="/catalogs/capco-product-catalog.pdf"
                  download
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                  }}
                  className="inline-flex min-h-[48px] w-[260px] max-w-full items-center justify-between gap-4 bg-[#58C7E8] px-4 py-3 text-[13px] font-medium text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
                >
                  <span>{copy?.infoCta ?? "Download Technical Data Sheet"}</span>
                  <span aria-hidden="true" className="text-[16px] leading-none">↓</span>
                </a>
              </div>
            </div>

            {/* Bottom-Right Cell: Specs */}
            <div className="p-6 lg:min-h-[347px] lg:p-[24px]">
              <h2 className="type-h3 font-normal text-[#020202]">
                Specs
              </h2>
              <div className="mt-5">
                {(copy?.specs ?? productSpecs[product.slug] ?? defaultSpecs).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-[#E7E7E7] py-[10.5px] text-[13px] leading-[1.2] tracking-[-0.02em] last:border-b-0"
                  >
                    <span className="text-[#121212]">{label}</span>
                    <span className="text-right text-[#595959]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4b. Logo slider (below the product information, as in the design) */}
      <section aria-label="Trusted by" className="pb-14 pt-12 lg:pb-[88px] lg:pt-[64px]">
        <div className="mx-auto max-w-[1920px]">
          <div className="px-6 text-center">
            <p className="type-caption inline-flex max-w-full items-center justify-center rounded-full bg-[#F5F5F5] px-5 py-2.5 font-mono uppercase leading-[1.35] tracking-[0.06em] text-[#595959]">
              {logoTagline}
            </p>
          </div>
          <div className="mt-6 lg:mt-10">
            <ClientTicker />
          </div>
        </div>
      </section>

      {/* 5. How we work: scroll-driven process phases */}
      <section className="pb-16 pt-14 lg:pb-[100px] lg:pt-[88px]">
        <div className="mx-auto max-w-[1920px]">
          {/* Scroll-driven phase timeline (pins while scrolling through the phases) */}
          <PhaseTimeline phases={phaseItems} />
        </div>
      </section>

      {/* 5. Product compliance certifications */}
      <section aria-label="Product certifications" className="relative overflow-hidden bg-[#EEFAFF] px-6 py-16 lg:px-[60px] lg:py-[100px]">
        <img src="/figma/home/compliance-world-map.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-[8%] -top-[46px] w-[75%] max-w-none opacity-70" />
        <div className="relative z-10 mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.02em]"><span className="h-1.5 w-1.5 bg-[#58C7E8]" /> {copy?.certificationTag ?? "TRUST THROUGH COMPLIANCE"}</div>
              <h2 className={`${copy?.certificationTagline ? "text-[24px] leading-[1.25] tracking-[-0.03em] sm:text-[28px] lg:text-[34px]" : "type-h2"} mt-4 max-w-[1000px] font-normal`}>{copy?.certificationTagline ?? <>Certified for Quality, Safety &amp; Export</>}</h2>
              {!copy?.certificationTagline && <p className="type-lead mt-4 max-w-[960px] text-[#595959]">Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.</p>}
            </div>
            <a href="/catalogs/capco-product-catalog.pdf" download className="inline-flex min-h-[56px] w-full max-w-[320px] shrink-0 items-end justify-between gap-4 bg-[#58C7E8] px-4 pb-3 pt-6 text-[13px] font-medium text-[#020202]">Download Compliance Certificates (PDF)<span aria-hidden="true" className="text-xl">↓</span></a>
          </div>
          <div className="mt-12 rounded-[20px] bg-white px-4 py-8 shadow-[0_14px_44px_rgba(88,199,232,0.14)] lg:mt-[52px] lg:px-6 lg:py-[42px]">
            <div className="grid grid-cols-1 divide-y divide-[#EAEAEA] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x lg:divide-[#EAEAEA]">
              {certifications.map(([icon, title, sub1, sub2]) => <article key={title} className="flex flex-col items-center px-6 py-6 text-center lg:py-2"><div className="flex h-[68px] w-[68px] items-center justify-center bg-[#EEFAFF]"><img src={icon} alt={title} className="max-h-12 max-w-12" /></div><h3 className="type-h4 mt-8 font-medium">{title}</h3><div className="my-3 h-px w-[64px] bg-[#58C7E8]" /><p className="type-small">{sub1}</p><p className="type-caption mt-1 text-[#595959]">{sub2}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Explore our full range of capacitors." 3-Card Product Section */}
      <section className="px-6 pb-20 pt-16 lg:px-[60px] lg:pb-[160px] lg:pt-[122px]">
        <div className="mx-auto max-w-[1800px]">
          {/* Section Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-small inline-flex items-center gap-2.5 font-medium tracking-[-0.02em] text-[#121212]">
                <span className="h-[4px] w-[4px] bg-[#4D65FF]" />
                {copy?.moreProductsTag ?? "Complete Capacitors Solutions"}
              </p>
              <h2 className={`${copy?.moreProductsTagline ? "text-[24px] leading-[1.25] tracking-[-0.03em] sm:text-[28px] lg:text-[34px]" : "type-h2"} mt-5 max-w-[900px] font-normal text-[#020202] lg:mt-6`}>
                {copy?.moreProductsTagline ?? (
                  <>
                    Explore our full
                    <br />
                    range of capacitors.
                  </>
                )}
              </h2>
            </div>

            <div className="flex flex-col items-start justify-between self-stretch sm:items-end">
              <span className="font-mono text-[10px] text-[#666666]" aria-live="polite">
                {String(carouselPage + 1).padStart(2, "0")}/{String(totalPages).padStart(2, "0")}
              </span>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  aria-label="Previous capacitor range page"
                  onClick={() => setCarouselPage((prev) => (prev + totalPages - 1) % totalPages)}
                  className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
                >
                  <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" className="rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next capacitor range page"
                  onClick={() => setCarouselPage((prev) => (prev + 1) % totalPages)}
                  className="grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[8px] bg-[#F4F4F4] transition hover:bg-[#E8E8E8]"
                >
                  <img src="/figma/solutions/a96fb.svg" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* 3-Column Product Cards */}
          <div className="mt-10 grid gap-x-[9px] gap-y-12 md:grid-cols-2 lg:mt-[44px] lg:grid-cols-3">
            {visibleProducts.map((item) => (
              <Link
                key={item.slug}
                href={productHref(item.slug)}
                className="group block"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F1F1]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 768px) 47vw, 94vw"
                    className="object-contain transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-[18px]">
                  <p className="type-caption flex flex-wrap items-center gap-2.5 tracking-[-0.01em] text-[#121212]">
                    <span className="font-medium">{item.date}</span>
                    <span>•</span>
                    <span>
                      Posted by <span className="text-[#999999]">{item.author}</span>
                    </span>
                  </p>
                  <h3 className="type-h4 mt-3 font-medium text-[#020202]">
                    {item.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center rounded-[4px] bg-[#F4F4F4] px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-[#404040]">
                    {item.tagLabel ?? item.category.toUpperCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Global Footprint — "Where We Operate" (shared map, product-page markets) */}
      <WhereWeOperateSection locations={exportMarkets} />


      {/* 8. Ready to Partner? — "Start Your OEM Journey with Capco Capacitors" */}
      {/* Same background as the "Where We Operate" section above, so the two read as one block */}
      <section className="bg-[#0A0A0A] px-6 py-16 text-white lg:px-[60px] lg:pb-[140px] lg:pt-[60px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="type-small inline-flex items-center gap-2.5 font-medium uppercase tracking-[0.02em] text-white">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                {copy?.ctaTag ?? "Ready to Partner?"}
              </p>
              <h2 className={`${copy?.ctaTagline ? "text-[24px] leading-[1.25] tracking-[-0.03em] sm:text-[28px] lg:text-[34px]" : "type-h2"} mt-6 max-w-[900px] font-normal text-white lg:mt-[28px]`}>
                {copy?.ctaTagline ?? (
                  <>
                    Start Your OEM Journey
                    <br />
                    with Capco Capacitors
                  </>
                )}
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
            {copy?.primaryCta && (
              <Link
                href={`/contact?category=${/oem/i.test(copy.primaryCta) ? "oem" : /dealer/i.test(copy.primaryCta) ? "dealership" : "bulk"}#enquiry-form`}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
                className="inline-flex min-h-[56px] items-center justify-between gap-8 bg-[#58C7E8] px-4 text-[14px] font-medium leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <span>{copy.primaryCta}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
            {/* CTA beside the heading (top-right) */}
            <Link
              href={
                /catalog/i.test(copy?.secondaryCta ?? "")
                  ? "/catalogs/capco-product-catalog.pdf"
                  : /dealer/i.test(copy?.secondaryCta ?? "")
                    ? "/solutions/dealership"
                    : /audit/i.test(copy?.secondaryCta ?? "")
                      ? "/contact?category=industrial#enquiry-form"
                      : "/contact#oem-solutions"
              }
              download={/catalog/i.test(copy?.secondaryCta ?? "") ? "CAPCO-Product-Catalog.pdf" : undefined}
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
              className="inline-flex min-h-[56px] w-[301px] max-w-full shrink-0 items-center justify-between self-start bg-white px-4 text-[14px] font-medium leading-[1.2] !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#58C7E8] lg:self-auto"
            >
              <span>{copy?.secondaryCta ?? "Schedule Technical Consultation"}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            </div>
          </div>

          {/* 3 Rounded Image Cards */}
          <div className="mt-12 grid gap-x-3 gap-y-10 md:grid-cols-3 lg:mt-[64px]">
            {journeySteps.map((card) => (
              <article key={card.title}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[20px] lg:rounded-[24px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 768px) 31vw, 94vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="type-h4 mt-6 font-medium text-white">
                  {card.title}
                </h3>
                <p className="type-small mt-3.5 max-w-[400px] leading-[1.5] text-white/72">
                  {card.body}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>
      <PublicFaqSection
        eyebrow={copy?.faqTag ?? "Technical Clarity"}
        title="Frequently Asked Questions"
        description={copy?.faqTagline}
        items={
          copy?.faqs ?? [
            { q: "What applications is this product suited for?", a: product.summary },
            { q: "Can CAPCO customize specifications for OEM requirements?", a: "Yes. Capacitance, housing, terminals, dimensions, and packaging can be configured to your application and assembly-line requirements." },
            { q: "Do you provide compliance and test certificates?", a: "Every shipment can include applicable BIS, ISO, CE, and IEC documentation with batch-level test results." },
            { q: "What is the typical lead time for bulk orders?", a: "Standard specifications are scheduled for dispatch within 7-15 working days; custom configurations are confirmed with the quotation." },
          ]
        }
      />
      <SiteFooter showPartnerCta />
    </main>
  );
}
