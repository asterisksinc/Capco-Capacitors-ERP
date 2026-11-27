"use client";
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HomeHero from "@/components/public/HomeHero";
import { CertificationStrip } from "@/components/public/CertificationStrip";
import { PublicFaqSection } from "@/components/public/PublicChrome";
import { PartnerCtaSection, SiteFooter } from "@/components/public/SiteFooter";
import type { CountryPageCopy } from "@/lib/countryPages";

const enquiryHref = (country: string) => `/contact?category=export&market=${encodeURIComponent(country)}#enquiry-form`;
const cut = (px: number) => ({ clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${px}px), calc(100% - ${px}px) 100%, 0 100%)` });

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`type-small inline-flex items-center gap-2 font-medium uppercase tracking-[0.02em] ${light ? "text-white" : "text-[#020202]"}`}>
      <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
      {children}
    </p>
  );
}

/** Full country page: hero, market expertise slider, applications, partner, FAQ, country CTA. */
export function CountryPage({ copy }: { copy: CountryPageCopy }) {
  const { hero, expertise, applications, partner, faq, cta } = copy;
  const pricingHref = enquiryHref(copy.country);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [slide, setSlide] = useState(0);

  const goTo = (i: number) => {
    const n = expertise.cards.length;
    const next = (i + n) % n;
    setSlide(next);
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>("[data-slide]")[next];
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-[#020202]">
      {/* 1. Hero (shared with home / About / Solutions) */}
      <HomeHero
        id={`${copy.slug}-hero-title`}
        image={hero.image}
        imageAlt={`CAPCO capacitor manufacturing for ${copy.country}`}
        description={hero.description}
        tags={hero.tags}
        title={hero.title}
        primary={{ label: hero.primaryCta, href: pricingHref }}
        secondary={{ label: hero.secondaryCta, href: "/catalogs/capco-product-catalog.pdf", download: `CAPCO-${copy.country}-Catalog.pdf` }}
        cutColor="#ffffff"
      />

      {/* 2. Market expertise + slider */}
      <section className="px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <Eyebrow>{expertise.tag}</Eyebrow>
              <h2 className="type-h2 mt-5 font-normal">{expertise.title}</h2>
            </div>
            <p className="type-lead max-w-[560px] font-light text-[#4F4F4F]">{expertise.description}</p>
          </div>

          <div className="mt-10 flex items-center justify-end gap-3 lg:mt-12">
            <span className="mr-2 font-mono text-[13px] tabular-nums text-[#8C8C8C]">
              {String(slide + 1).padStart(2, "0")}/{String(expertise.cards.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => goTo(slide - 1)} aria-label="Previous" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#E5E5E5] transition hover:bg-[#020202] hover:text-white">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => goTo(slide + 1)} aria-label="Next" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#E5E5E5] transition hover:bg-[#020202] hover:text-white">
              <ArrowRight size={18} />
            </button>
          </div>

          <div
            ref={trackRef}
            onScroll={(e) => {
              const track = e.currentTarget;
              const cards = [...track.querySelectorAll<HTMLElement>("[data-slide]")];
              const idx = cards.reduce((best, c, i) => (Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(cards[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? i : best), 0);
              if (idx !== slide) setSlide(idx);
            }}
            className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
          >
            {expertise.cards.map((card) => (
              <article
                key={card.title}
                data-slide
                className="relative h-[460px] w-[88%] shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#1A1A1A] sm:h-[520px] lg:h-[max(380px,calc(80svh-260px))] lg:w-[min(1100px,72%)]"
              >
                <img src={card.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <h3 className="type-h3-lg font-normal text-white">{card.title}</h3>
                  <p className="type-body mt-3 max-w-[560px] text-white/85">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & key numbers */}
      <CertificationStrip />

      {/* 3. Applications (3 cards) */}
      <section className="px-6 py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <Eyebrow>{applications.tag}</Eyebrow>
              <h2 className="type-h2 mt-5 font-normal">{applications.title}</h2>
            </div>
            <p className="type-lead max-w-[560px] font-light text-[#4F4F4F]">{applications.description}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
            {applications.cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                style={cut(40)}
                className="group flex min-h-[320px] flex-col justify-between gap-8 bg-[#F5F5F5] p-7 transition-colors hover:bg-[#EEEEEE] lg:p-8"
              >
                <div>
                  <span className="type-small inline-block rounded-[4px] border border-[#DCDCDC] bg-white/60 px-3 py-1.5 text-[#020202]">{card.tag}</span>
                  <h3 className="type-h3 mt-8 font-normal">{card.title}</h3>
                  <p className="type-body mt-4 text-[#595959]">{card.description}</p>
                </div>
                <span style={cut(12)} className="inline-flex min-h-[52px] w-fit items-center gap-8 bg-white px-4 text-[14px] font-medium transition group-hover:bg-[#58C7E8]">
                  View products
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Ready to partner (dark) */}
      <section className="bg-[#0A0A0A] px-6 py-20 text-white lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[820px]">
              <Eyebrow light>{partner.tag}</Eyebrow>
              <h2 className="type-h2 mt-5 font-normal">{partner.title}</h2>
            </div>
            <Link
              href={pricingHref}
              style={cut(14)}
              className="inline-flex min-h-[56px] w-fit shrink-0 items-center gap-8 bg-white px-5 text-[14px] font-medium !text-[#121212] transition hover:-translate-y-0.5 hover:bg-[#58C7E8]"
            >
              {partner.cta}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[20px] bg-white/10 md:grid-cols-3 lg:mt-14">
            {partner.cards.map((card, i) => (
              <div key={card.tag} className="bg-[#111111] p-7 lg:p-10">
                <p className="font-mono text-[12px] text-[#58C7E8]">/{String(i + 1).padStart(3, "0")}</p>
                <h3 className="type-h3 mt-6 font-normal">{card.tag}</h3>
                <p className="type-body mt-3 font-light text-white/75">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ (shared FAQ design) */}
      <PublicFaqSection eyebrow={faq.tag} title={faq.title} items={faq.items} />

      {/* 6. Country CTA (home CTA design, country copy) + home footer */}
      <PartnerCtaSection title={cta.title} body={cta.body} button={cta.button} href={pricingHref} />
      <SiteFooter showPartnerCta={false} />
    </main>
  );
}
