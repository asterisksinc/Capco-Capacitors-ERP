"use client";

import { useEffect, useRef, useState } from "react";
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
  // The filter shown in the grid lags behind the selected one so the old set can fade out first.
  const [shownFilter, setShownFilter] = useState<(typeof filters)[number]>("ALL");
  const [gridVisible, setGridVisible] = useState(true);
  const swapTimer = useRef<number | null>(null);

  // Drawer: keep the item mounted while the closing animation plays.
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const changeFilter = (filter: (typeof filters)[number]) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setGridVisible(false);
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      setShownFilter(filter);
      setGridVisible(true);
    }, 220);
  };

  const openItem = (index: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setSelectedItem(index);
    // next frame so the panel starts off-screen and slides in
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  };

  const closeItem = () => {
    setDrawerOpen(false);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setSelectedItem(null), 420);
  };

  useEffect(() => {
    if (selectedItem === null) return;
    // Lock scroll without the page shifting when the scrollbar disappears.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeItem();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedItem]);

  useEffect(
    () => () => {
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const visibleItems = galleryItems
    .map((item, index) => ({ item, index }))
    .filter(({ item: [, category] }) => shownFilter === "ALL" || category === shownFilter);


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
                  onClick={() => changeFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`cursor-pointer rounded-[2px] px-3 py-1 transition-colors duration-300 ${
                    activeFilter === filter
                      ? "bg-[#020202] text-white"
                      : "bg-[#F3F3F3] hover:bg-[#E6E6E6] hover:text-[#595959]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </header>

          <div
            key={shownFilter}
            className={`gallery-grid mt-20 grid gap-x-6 gap-y-12 transition-opacity duration-200 ease-out sm:grid-cols-2 lg:mt-[116px] lg:grid-cols-3 lg:gap-x-8 lg:gap-y-[54px] ${
              gridVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {visibleItems.map(({ item: [image, category], index }, i) => (
              <button
                key={image}
                type="button"
                onClick={() => openItem(index)}
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                className="gallery-card group min-w-0 cursor-pointer text-left"
              >
                <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]">
                  <Image
                    src={`/figma/gallery/${image}`}
                    alt="CAPCO award and certification gallery"
                    fill
                    loading="eager"
                    unoptimized
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
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
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close media detail"
            onClick={closeItem}
            className={`absolute inset-0 h-full w-full cursor-default bg-black/80 transition-opacity duration-400 ease-out ${
              drawerOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-full overflow-y-auto bg-white shadow-2xl transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform sm:max-w-[640px] lg:max-w-[760px] ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-[76px] items-center justify-end border-b border-[#E5E5E5] px-8">
              <button
                type="button"
                aria-label="Close media detail"
                onClick={closeItem}
                className="grid h-9 w-9 cursor-pointer place-items-center text-[#020202] transition hover:rotate-90 hover:text-[#58C7E8]"
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
