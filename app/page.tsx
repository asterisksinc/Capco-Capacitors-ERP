"use client";

import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Download,
  Factory,
  Globe2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

const products = [
  ["BOPP Substrate", "CAT: MPP-01", "Metalized Polypropylene Film (MPP)", "In-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications.", "THICKNESS: 3.5-14 Micron", "VOLTAGE: Up to 4000V AC", "Explore MPP Film"],
  ["IS:2993 Certified", "CAT: MOT-RUN", "Fan & Motor Capacitors", "Motor run, motor start, fan, and submersible panel capacitors for HVAC, pumps, and appliances.", "RANGE: 0.5-432 MFD", "VOLTAGE: 400-440V AC", "Explore Fan & Motor"],
  ["IS:13340 Heavy Duty", "CAT: PFC-CELL", "Power Factor Correction (PFC)", "Cylindrical, box type, and capacitor banks up to 150 KVAR for industrial APFC panels.", "RANGE: 0.5-25 KVAR/Cell", "VOLTAGE: 415-440V AC", "Explore PFC Capacitors"],
  ["IS:1569 Standard", "CAT: LUM-RES", "Luminaire Capacitors", "Lighting capacitors with inbuilt discharge resistors for street lights and industrial luminaires.", "CAPACITANCE: 1-45 MFD", "RATED V: 230-250V AC", "Explore Lighting Capacitors"],
  ["High Frequency", "CAT: UV-CUR", "UV Lamp Capacitors", "High-frequency capacitors for UV curing systems in printing, coating, and industrial manufacturing.", "TUNING: Custom Build", "VOLTAGE: Up to 4000V AC", "Explore UV Capacitors"],
  ["OEM Co-Engineering", "CAT: CUST-ENG", "Customized Capacitors", "Co-engineered capacitors tailored to your electrical, thermal, and mechanical requirements.", "DIMENSIONS: Per Specification", "TERMINALS: Custom Pins/Tags", "Request Custom Solution"],
];

const industries = [
  ["HVAC & Refrigeration", "SYSTEM SECTOR: 01", "HVAC & Commercial Refrigeration Systems", "Motor run capacitors for AC units, HVAC systems, compressors, and rooftop cooling applications.", ["Capacity Range: 0.5-432 MFD", "Voltage Rating: 400-440V AC", "Standards: ISI / BIS verified"]],
  ["Water Pumps & Agriculture", "SYSTEM SECTOR: 02", "Water Pumps & Agriculture", "Submersible panel and motor-start capacitor support for pumps, borewells, and agricultural drives.", ["Capacity Range: 10-120 MFD", "Surge Tolerance: Up to 550V AC", "Enclosure: Flame-retardant"]],
  ["Home Appliances", "SYSTEM SECTOR: 03", "Home Appliances & Consumer Electronics", "Compact P2 capacitors for washing machines, refrigerators, fans, and air-conditioning assemblies.", ["Life: 30,000 operating hours", "Terminals: Faston or wire leads", "Safety: P2 protection"]],
  ["Industrial Manufacturing", "SYSTEM SECTOR: 04", "Industrial Power Factor Correction", "PFC cells, box type capacitors, and capacitor banks for APFC panels and continuous-duty facilities.", ["Range: 0.5-25 KVAR", "Banks: Up to 150 KVAR", "Standard: IS:13340"]],
  ["Lighting & Infrastructure", "SYSTEM SECTOR: 05", "Lighting & Municipal Infrastructure", "Lighting and UV lamp capacitors for street lights, luminaires, and high-output industrial fixtures.", ["Capacity: 1-45 MFD", "Frequency: 50 / 60 Hz", "Standard: IS:1569"]],
  ["Export Markets", "SYSTEM SECTOR: 06", "Export Markets", "CE-marked capacitor programs with documentation support for international procurement teams.", ["Markets: 15+ countries", "Docs: COO / test certs", "Compliance: CE / RoHS"]],
] as const;

const whyFeatures = [
  ["In-House Metallization & Winding", "Leybold Germany BOPP film metallization + Metar Switzerland automatic winding deliver purity, faster delivery, and supply discipline.", "Learn About Our Technology"],
  ["BIS, ISO & CE Certified", "Every product meets IS:2993, IS:13340, ISO 9001 standards and export requirements across OEM, dealers, and project markets.", "View Certificates"],
  ["5,000+ Dealers, JIT Delivery", "From Nashik to Coimbatore, our dealer network ensures local availability, technical support, and just-in-time replenishment.", "Meet Dealer Team"],
];

const certifications = [
  ["BIS ISI", "IS:2993 / IS:13340", ShieldCheck],
  ["ISO 9001", "Quality Management", BadgeCheck],
  ["CE Mark", "European Conformity", Globe2],
  ["IEC 60252-1", "AC Motor Capacitors", Factory],
  ["IEC 60831", "Power Capacitors", Zap],
];

const projects = [
  ["/figma/project-catalogs-card.png", "Product Catalogs & Spec Sheets", "Downloadable PDFs with electrical specs, BIS certifications, and installation guides.", "Browse Downloads"],
  ["/figma/project-success-card.png", "Success Stories", "OEM and dealer projects with measurable cost, lead-time, and reliability outcomes.", "View Case Studies"],
  ["/figma/project-insights-card.png", "Industry Trends & Best Practices", "Selection guides, PFC notes, and capacitor application insights.", "Read Insights"],
];

const faqs = [
  "What is the minimum order quantity for OEM shipments?",
  "Can you match capacitors from other manufacturers?",
  "What is the typical lead time for custom capacitor development?",
  "Do you provide technical documentation for our compliance files?",
  "Can CAPCO support JIT delivery for our assembly lines?",
  "What industries do you currently serve as an OEM partner?",
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-semibold uppercase tracking-normal ${light ? "text-white" : "text-[#020202]"}`}>
      <span className="h-1.5 w-1.5 bg-[#58c7e8]" />
      {children}
    </div>
  );
}

function ButtonLink({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <a
      href="#contact"
      className={`inline-flex h-14 items-center gap-6 px-4 text-sm font-semibold transition ${
        light
          ? "bg-white !text-[#020202] hover:bg-[#eaf8fc] [&_*]:!text-[#020202] [&_svg]:stroke-[#020202]"
          : "bg-[#58c7e8] text-[#020202] hover:bg-[#41b7d9] [&_svg]:stroke-[#020202]"
      }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </a>
  );
}

export default function Home() {
  const [industryIndex, setIndustryIndex] = useState(0);
  const activeIndustry = industries[industryIndex];
  const [sector, title, body, specs] = activeIndustry.slice(1) as [string, string, string, readonly string[]];

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <div className="relative">
        <PublicNav variant="transparent" />
        <section className="relative min-h-[640px] overflow-hidden bg-[#101010] text-white md:min-h-[760px] lg:min-h-[1139px]">
          <Image src="/figma/home/rectangle-1.png" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/25" />
          <div className="relative mx-auto flex min-h-[640px] max-w-[1920px] flex-col justify-end px-6 pb-[118px] pt-28 md:min-h-[760px] lg:min-h-[1139px] lg:px-[60px] lg:pb-[188px]">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <Eyebrow light>Electrical Systems Built For The Next Century</Eyebrow>
                <h1 className="mt-6 max-w-[780px] text-[52px] font-normal leading-[0.96] tracking-normal sm:text-[78px] lg:text-[104px]">
                  India&apos;s Trusted Capacitor Manufacturer
                </h1>
                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink>Explore Products</ButtonLink>
                  <ButtonLink light>Explore Programs</ButtonLink>
                </div>
              </div>
              <div className="grid gap-8 lg:justify-items-end">
                <p className="max-w-[560px] text-xl leading-[1.45] text-white/82">
                  BIS-certified motor run, PFC, lighting, and custom capacitors engineered with in-house BOPP metallization, JIT supply, and OEM-ready compliance.
                </p>
                <div className="grid w-full max-w-[660px] gap-3 sm:grid-cols-3">
                  {[
                    ["BIS ISI", "Certified"],
                    ["ISO 9001", "Quality Certified"],
                    ["15+ Export", "Markets"],
                  ].map(([value, label]) => (
                    <div key={value} className="border border-white/20 bg-black/25 p-4 backdrop-blur">
                      <p className="text-lg font-semibold">{value}</p>
                      <p className="mt-1 text-xs text-white/62">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="grid border-b border-[#e4e4e4] bg-[#f5f5f5] md:grid-cols-3">
        {[["32+ Years", "In Manufacturing"], ["500+", "Authorized Dealers"], ["15+", "Export Countries"]].map(([value, label]) => (
          <div key={label} className="flex min-h-[156px] flex-col items-center justify-center border-[#e4e4e4] py-10 md:min-h-[296px] md:border-r">
            <strong className="text-4xl font-normal leading-none md:text-[56px]">{value}</strong>
            <span className="mt-4 text-base text-[#595959] md:text-lg">{label}</span>
          </div>
        ))}
      </section>

      <section id="why" className="px-6 py-20 lg:min-h-[334px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-10 lg:grid-cols-[680px_1fr]">
            <div>
              <Eyebrow>Why CAPCO?</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal leading-tight tracking-normal lg:text-5xl">Engineered for Reliability, Backed by Compliance</h2>
            </div>
            <p className="self-center text-xl leading-[1.45] text-[#595959] lg:justify-self-end lg:max-w-[612px] lg:text-2xl">
              Industrial precision achieved through single-roof production, autonomous machinery, and stringent dielectric verification.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:min-h-[1743px] lg:px-[60px] lg:pb-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid gap-2 lg:grid-cols-[1.16fr_0.84fr]">
            <div className="grid gap-2">
              {["/figma/products/product-1.png", "/figma/products/product-5.png", "/figma/project-insights-card.png"].map((image) => (
                <div key={image} className="relative min-h-[330px] overflow-hidden bg-[#e8e8e8] lg:min-h-[505px]">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 58vw, 94vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              {whyFeatures.map(([featureTitle, featureBody, cta], index) => (
                <article key={featureTitle} className="flex min-h-[330px] flex-col justify-between bg-[#f3f3f3] p-8 lg:min-h-[505px] lg:p-12">
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm">{String(index + 1).padStart(2, "0")}</div>
                    <h3 className="mt-8 text-2xl font-medium">{featureTitle}</h3>
                    <p className="mt-5 max-w-[560px] text-base leading-[1.55] text-[#595959]">{featureBody}</p>
                  </div>
                  <ButtonLink>{cta}</ButtonLink>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-white px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Complete Capacitor Solutions</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Browse by Product Category</h2>
            </div>
            <ButtonLink><Download size={16} /> Download Complete Catalog</ButtonLink>
          </div>
          <div className="mt-[60px] grid gap-[42px] md:grid-cols-2 xl:grid-cols-3">
            {products.map(([badge, code, productTitle, productBody, specA, specB, cta]) => (
              <article key={productTitle} className="flex min-h-[389px] flex-col justify-between bg-[#f5f5f5] p-8">
                <div>
                  <div className="flex items-center justify-between gap-5">
                    <span className="bg-white px-3 py-2 text-sm">{badge}</span>
                    <span className="text-sm font-semibold text-[#58c7e8]">{code}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium">{productTitle}</h3>
                  <p className="mt-4 text-base leading-[1.45] text-[#595959]">{productBody}</p>
                </div>
                <div>
                  <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#dcdcdc] pt-5 text-sm">
                    <span>{specA}</span>
                    <span>{specB}</span>
                  </div>
                  <ButtonLink>{cta}</ButtonLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="bg-[#f5f5f5] px-6 py-20 lg:min-h-[1120px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <Eyebrow>Application-Specific Expertise</Eyebrow>
          <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Capacitor Solutions by Industry</h2>
          <div className="mt-12 overflow-x-auto bg-white">
            <div className="flex min-w-[1080px]">
              {industries.map((industry, index) => (
                <button
                  key={industry[0]}
                  onClick={() => setIndustryIndex(index)}
                  className={`relative h-[60px] flex-1 border-b px-4 text-center text-base ${industryIndex === index ? "border-[#020202] font-semibold text-[#020202]" : "border-[#e4e4e4] text-[#595959]"}`}
                >
                  {industry[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid overflow-hidden bg-white p-8 lg:min-h-[650px] lg:grid-cols-[1fr_420px] lg:p-[60px]">
            <div>
              <p className="text-sm font-semibold text-[#58c7e8]">{sector}</p>
              <h3 className="mt-4 text-3xl font-normal">{title}</h3>
              <p className="mt-6 max-w-4xl text-xl leading-[1.4] text-[#595959]">{body}</p>
              <div className="mt-8"><ButtonLink>Explore Solutions</ButtonLink></div>
            </div>
            <aside className="mt-10 bg-[#d9f4fb] p-8 lg:mt-0" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 62px), calc(100% - 62px) 100%, 0 100%)" }}>
              <p className="text-sm text-[#595959]">Key Specifications</p>
              <h4 className="mt-2 text-2xl font-semibold">Fit Safety Disconnecter</h4>
              <ul className="mt-6 space-y-4 text-base">
                {specs.map((spec) => <li key={spec}>+ {spec}</li>)}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section id="process" className="bg-white px-6 py-24 lg:min-h-[530px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto grid max-w-[1800px] gap-12 lg:grid-cols-[0.95fr_1fr]">
          <div className="flex items-end gap-5">
            <span className="text-xs text-[#595959]">01/05</span>
            <button className="bg-[#f5f5f5] p-3" aria-label="Previous process step"><ArrowLeft size={18} /></button>
            <button className="bg-[#f5f5f5] p-3" aria-label="Next process step"><ArrowRight size={18} /></button>
          </div>
          <div className="border-l border-[#e4e4e4] pl-10">
            <div className="flex h-12 w-12 items-center justify-center bg-[#f5f5f5] text-sm">01</div>
            <h2 className="mt-6 text-3xl font-normal tracking-normal">Raw Film Procurement</h2>
            <p className="mt-3 text-lg font-medium text-[#58c7e8]">Certified BOPP Film</p>
            <p className="mt-8 max-w-2xl text-xl leading-[1.45] text-[#595959]">Sourced from trusted suppliers with strict dielectric strength, tolerance, and RoHS controls.</p>
            <div className="mt-9"><ButtonLink>View Our Manufacturing Facilities</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="bg-[#dff8ff] px-6 py-20 lg:min-h-[642px] lg:px-[60px] lg:py-[92px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Meet Global Compliance</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Certified for Quality, Safety & Export</h2>
              <p className="mt-5 max-w-2xl text-base leading-[1.5] text-[#595959]">Industrial precision achieved through global standards, autonomous manufacturing, and stringent dielectric verification.</p>
            </div>
            <ButtonLink>Download Compliance Certificate</ButtonLink>
          </div>
          <div className="mt-12 grid gap-4 bg-white p-5 md:grid-cols-5">
            {certifications.map(([certTitle, certBody, Icon]) => (
              <article key={certTitle as string} className="flex min-h-[150px] flex-col items-center justify-center border border-[#e5e5e5] text-center">
                <Icon size={26} className="text-[#58c7e8]" />
                <h3 className="mt-5 font-semibold">{certTitle as string}</h3>
                <p className="mt-2 text-sm text-[#595959]">{certBody as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:min-h-[661px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[86px] flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Trusted By Industry Leaders</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">What Our Partners Say</h2>
            </div>
            <ButtonLink>Read More Case Studies</ButtonLink>
          </div>
          <div className="relative mt-[60px] flex min-h-[315px] items-center justify-center bg-white px-6 py-12 lg:px-[152px]">
            <button className="absolute left-5 top-1/2 hidden -translate-y-1/2 bg-[#f5f5f5] p-3 lg:block" aria-label="Previous testimonial"><ArrowLeft size={20} /></button>
            <div className="mx-auto max-w-[1284px] text-center">
              <div className="inline-flex items-center gap-3 text-sm text-[#595959]">
                <span className="bg-[#f5f5f5] px-3 py-2">OEM Client Case</span>
                <span>HVAC Manufacturing</span>
              </div>
              <blockquote className="mt-8 text-3xl font-normal leading-[1.13] tracking-normal text-[#020202] lg:text-5xl">
                CAPCO&apos;s vertically integrated manufacturing helped us reduce capacitor costs by 28% while improving lead times from 12 weeks to 10 days. Their co-engineering support was critical for our new AC product line.
              </blockquote>
              <div className="mt-10 flex items-center justify-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center bg-[#ededed] text-lg font-semibold">RK</div>
                <div className="text-left">
                  <p className="font-semibold">Rajesh Kumar</p>
                  <p className="mt-1 text-sm text-[#595959]">Head of Procurement</p>
                </div>
              </div>
            </div>
            <button className="absolute right-5 top-1/2 hidden -translate-y-1/2 bg-[#f5f5f5] p-3 lg:block" aria-label="Next testimonial"><ArrowRight size={20} /></button>
          </div>
        </div>
      </section>

      <section id="projects" className="bg-[#f5f5f5] px-6 py-20 lg:min-h-[1210px] lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Trusted By Industry Leaders</Eyebrow>
              <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Projects</h2>
            </div>
            <div className="hidden text-right lg:block">
              <p className="text-sm text-[#595959]">01/03</p>
              <div className="mt-2 flex gap-3">
                <button className="bg-white p-3" aria-label="Previous project"><ArrowLeft size={20} /></button>
                <button className="bg-white p-3" aria-label="Next project"><ArrowRight size={20} /></button>
              </div>
            </div>
          </div>
          <div className="mt-14 flex snap-x gap-2 overflow-x-auto pb-3">
            {projects.map(([image, projectTitle, projectBody, cta], index) => (
              <article key={projectTitle} className="relative h-[560px] w-[84vw] max-w-[1512px] shrink-0 snap-start overflow-hidden rounded-[18px] lg:h-[864px] lg:w-[78vw]">
                <Image src={image} alt="" fill sizes="(min-width: 1024px) 78vw, 84vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/48" />
                <div className="absolute bottom-10 left-8 text-white lg:bottom-[90px] lg:left-12">
                  {index === 0 ? <BookOpen size={32} /> : index === 1 ? <Award size={32} /> : <Zap size={32} />}
                  <h3 className="mt-4 text-3xl font-normal tracking-normal lg:text-5xl">{projectTitle}</h3>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-[#101010]/45 p-6 text-white backdrop-blur lg:left-auto lg:w-[560px] lg:p-9">
                  <p className="text-base leading-[1.4] opacity-80">{projectBody}</p>
                  <div className="mt-8"><ButtonLink light>{cta}</ButtonLink></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[558px] items-center justify-center overflow-hidden bg-white px-6 py-[60px] text-center lg:px-[60px]">
        <div
          className="absolute inset-x-0 top-0 h-[558px]"
          style={{
            background:
              "linear-gradient(90deg, #ffffff 0%, rgba(178,242,255,0.92) 18%, #58c7e8 50%, rgba(178,242,255,0.92) 82%, #ffffff 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[558px] opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.42) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="relative flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-7">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase text-[#020202]">
              <span className="h-1.5 w-1.5 bg-white" />
              Ready to Specify CAPCO?
            </div>
            <h2 className="max-w-[946px] text-4xl font-normal leading-[1.2] tracking-normal lg:text-5xl">
              Get Technical Support, Competitive Pricing & BIS-Certified Quality
            </h2>
            <p className="max-w-[698px] text-lg leading-[1.4] text-[#595959]">
              Whether you need a single custom capacitor or a complete supply chain partnership, our team is ready to support your requirements.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink>Request Quote</ButtonLink>
            <ButtonLink light>Download Product Catalog</ButtonLink>
          </div>
          <div className="h-px w-[381px] max-w-full bg-[#58c7e8]" />
          <div className="flex flex-wrap justify-center gap-10 text-lg">
            {["Response within 24 hours", "BIS/CE Documentation Included", "OEM Pricing Available"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center bg-[#9eeafd]">
                  <BadgeCheck size={18} />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:min-h-[973px] lg:px-[60px] lg:py-[140px]">
        <div className="mx-auto max-w-[800px] text-center">
          <Eyebrow>Popular Questions</Eyebrow>
          <h2 className="mt-6 text-4xl font-normal tracking-normal lg:text-5xl">Frequently Asked Questions</h2>
          <div className="mt-12 border-t border-[#e4e4e4] text-left">
            {faqs.map((question) => (
              <button key={question} className="flex min-h-[76px] w-full items-center justify-between gap-6 border-b border-[#e4e4e4] px-6 text-left text-base">
                <span>{question}</span>
                <span className="text-2xl font-light">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter
        ctaTitle="Ready to Partner?"
        ctaBody="Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery."
        ctaButton="Start a Conversation"
      />
    </main>
  );
}
