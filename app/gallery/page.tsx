"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

const galleryItems = [
  ["gallery-01.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-02.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-03.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-04.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-05.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-06.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-07.jpg", "CORPORATE SOCIAL RESPONSIBILITY / CSR"],
  ["gallery-08.jpg", "AWARDS"],
  ["gallery-09.jpg", "AWARDS"],
  ["gallery-10.jpg", "AWARDS"],
  ["gallery-11.jpg", "AWARDS"],
  ["gallery-12.jpg", "CERTIFICATIONS"],
  ["gallery-13.jpg", "CERTIFICATIONS"],
  ["gallery-14.jpg", "CERTIFICATIONS"],
  ["gallery-15.jpg", "CERTIFICATIONS"],
  ["gallery-16.jpg", "CERTIFICATIONS"],
  ["gallery-17.jpg", "CERTIFICATIONS"],
  ["gallery-18.jpg", "CERTIFICATIONS"],
] as const;

const filters = ["ALL", "CORPORATE SOCIAL RESPONSIBILITY / CSR", "AWARDS", "CERTIFICATIONS"] as const;

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("ALL");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedItem === null ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const visibleItems = galleryItems
    .map((item, index) => ({ item, index }))
    .filter(({ item: [, category] }) => activeFilter === "ALL" || category === activeFilter);

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav variant="light" />

      <section className="px-6 pb-24 pt-20 lg:px-[60px] lg:pb-[150px] lg:pt-[112px]">
        <div className="mx-auto max-w-[1800px]">
          <header className="text-center">
            <h1 className="text-[48px] font-normal leading-none tracking-[-0.06em] sm:text-[64px] lg:text-[76px]">
              Media &amp; Gallery
            </h1>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[9px] uppercase tracking-[-0.02em] text-[#A2A2A2] sm:text-[10px]">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-[2px] px-3 py-1 ${activeFilter === filter ? "bg-[#020202] text-white" : "bg-[#F3F3F3]"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>

          <div className="mt-20 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-[116px] lg:grid-cols-3 lg:gap-x-8 lg:gap-y-[54px]">
            {visibleItems.map(({ item: [image, category], index }) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedItem(index)}
                className="min-w-0 text-left"
              >
                <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]">
                  <Image
                    src={`/figma/gallery/${image}`}
                    alt="CAPCO award and certification gallery"
                    fill
                    loading="eager"
                    unoptimized
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-[10px] leading-none text-[#777777]">
                  <span>08.06.2026</span>
                  <span className="mx-2">•</span>
                  <span>By </span>
                  <span className="text-[#020202]">CAPCO</span>
                </div>
                <h2 className="mt-3 text-[15px] font-medium leading-[1.15] tracking-[-0.02em] text-[#020202] sm:text-[16px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <p className="mt-3 inline-block bg-[#F3F3F3] px-2 py-1 text-[8px] uppercase leading-none tracking-[0.02em] text-[#8A8A8A]">
                  {category}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />

      {selectedItem !== null && (
        <div className="fixed inset-0 z-50 bg-black/80" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close media detail"
            onClick={() => setSelectedItem(null)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <aside className="absolute right-0 top-0 h-full w-full overflow-y-auto bg-white sm:max-w-[640px] lg:max-w-[760px]">
            <div className="flex h-[76px] items-center justify-end border-b border-[#E5E5E5] px-8">
              <button
                type="button"
                aria-label="Close media detail"
                onClick={() => setSelectedItem(null)}
                className="grid h-9 w-9 place-items-center text-[#020202]"
              >
                <X size={26} strokeWidth={1.7} />
              </button>
            </div>
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]">
                <Image
                  src={`/figma/gallery/${galleryItems[selectedItem][0]}`}
                  alt="CAPCO award and certification gallery"
                  fill
                  unoptimized
                  sizes="760px"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 text-[12px] text-[#777777]">
                <h2 className="text-[25px] font-medium leading-[1.1] tracking-[-0.04em] text-[#020202] sm:text-[30px]">
                  Lorem ipsum dolor sit amet
                </h2>
                <span className="shrink-0">08.06.2026&nbsp; • &nbsp;By <span className="text-[#020202]">logo ipsum</span></span>
              </div>
              <p className="mt-5 inline-block bg-[#F3F3F3] px-3 py-2 text-[10px] uppercase text-[#777777]">
                {galleryItems[selectedItem][1]}
              </p>
              <p className="mt-8 max-w-[640px] text-[16px] leading-[1.45] text-[#595959]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
