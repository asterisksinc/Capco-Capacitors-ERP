"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

const filters = ["ALL", "CORPORATE SOCIAL RESPONSIBILITY / CSR", "AWARDS", "CERTIFICATIONS"] as const;

type GalleryItem = {
  image: string;
  category: (typeof filters)[number];
  title?: string;
  /** Short line under the card title (issuer, licence no., validity). */
  meta?: string;
  description?: string;
  documents?: { label: string; href: string }[];
};

const BIS = "Bureau of Indian Standards";

const galleryItems: GalleryItem[] = [
  { image: "gallery-01.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-02.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-03.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-04.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-05.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-06.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-07.jpg", category: "CORPORATE SOCIAL RESPONSIBILITY / CSR" },
  { image: "gallery-08.jpg", category: "AWARDS" },
  { image: "gallery-09.jpg", category: "AWARDS" },
  { image: "gallery-10.jpg", category: "AWARDS" },
  { image: "gallery-11.jpg", category: "AWARDS" },
  // Current BIS licences (PDFs in /public/certifications). These supersede the 2020 copies of
  // licences CM/L-6300073908 and CM/L-0006097778 that were previously shown as gallery-15/16.
  {
    image: "cert-bis-is13340.jpg",
    category: "CERTIFICATIONS",
    title: "BIS Licence: IS 13340 (Part 1) Shunt Power Capacitors",
    meta: `${BIS} · CM/L-0006097778 · Valid to 31 Jan 2027`,
    description:
      "Self-healing shunt power (PFC) capacitors for a.c. systems rated up to 1000 V. Licence renewed from 1 Feb 2026 to 31 Jan 2027; from 10 Mar 2026 the standard is revised to IS 13340 (Part 1):2024 / IEC 60831-1:2014.",
    documents: [
      { label: "Renewal endorsement (Jan 2026)", href: "/certifications/13340%2001.pdf" },
      { label: "Standard revision endorsement (Mar 2026)", href: "/certifications/13340%2002.pdf" },
    ],
  },
  {
    image: "cert-bis-is2993-part1.jpg",
    category: "CERTIFICATIONS",
    title: "BIS Licence: IS 2993 (Part 1) a.c. Motor Capacitors",
    meta: `${BIS} · CM/L-6300073908 · Valid to 24 Aug 2031`,
    description:
      "a.c. motor (run) capacitors: general performance, testing and rating, and safety requirements (Third Revision). Licence renewed for five years in August 2026.",
    documents: [{ label: "Renewal endorsement (Aug 2026)", href: "/certifications/299301.pdf" }],
  },
  {
    image: "cert-bis-is2993-part2.jpg",
    category: "CERTIFICATIONS",
    title: "BIS Licence: IS 2993 (Part 2) Motor Start Capacitors",
    meta: `${BIS} · CM/L-6300142190 · Valid to 13 Dec 2026`,
    description:
      "Self-healing motor start capacitors, 5 to 180 µF, rated up to 275 V, 50 Hz, climatic category 40/85/21, intermittent operation classes B, C and D, safety classes S0 and S2.",
    documents: [{ label: "Licence for the use of Standard Mark", href: "/certifications/license%202993-2.pdf" }],
  },
  { image: "gallery-18.jpg", category: "CERTIFICATIONS", title: "ISO 9001:2015 Quality Management System", meta: "SM Certification Services · Certificate QMS1901557" },
  { image: "gallery-17.jpg", category: "CERTIFICATIONS", title: "ISO 45001:2018 Occupational Health & Safety", meta: "International Standards Certification" },
  { image: "gallery-14.jpg", category: "CERTIFICATIONS", title: "CE Certificates of Compliance", meta: "EMC & Low Voltage Directives" },
  { image: "gallery-12.jpg", category: "CERTIFICATIONS", title: "ISO 9001:2008 Certificate of Compliance", meta: "EQRS · Manufacturing and supply of capacitors" },
  { image: "gallery-13.jpg", category: "CERTIFICATIONS", title: "NSIC-CRISIL Performance & Credit Rating", meta: "NSIC-CRISIL · Rating SE 2B" },
];


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

  // /gallery?filter=certifications (or awards / csr) opens with that filter selected.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("filter")?.toLowerCase();
    if (!wanted) return;
    const match = filters.find((f) => f !== "ALL" && f.toLowerCase().startsWith(wanted));
    if (match) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL on load
      setActiveFilter(match);
      setShownFilter(match);
    }
  }, []);

  const changeFilter = (filter: (typeof filters)[number]) => {
    if (filter === activeFilter) return;
    const url = new URL(window.location.href);
    if (filter === "ALL") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filter.startsWith("CORPORATE") ? "csr" : filter.toLowerCase());
    window.history.replaceState(null, "", url);
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
    .filter(({ item }) => shownFilter === "ALL" || item.category === shownFilter);
  const selected = selectedItem !== null ? galleryItems[selectedItem] : null;


  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav variant="light" />

      <section className="px-6 pb-24 pt-20 lg:px-[60px] lg:pb-[150px] lg:pt-[112px]">
        <div className="mx-auto max-w-[1800px]">
          <header className="text-center">
            <h1 className="type-display font-normal">
              {activeFilter === "CERTIFICATIONS" ? "Certifications" : <>Media &amp; Gallery</>}
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
            {visibleItems.map(({ item, index }, i) => (
              <button
                key={item.image}
                type="button"
                onClick={() => openItem(index)}
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                className="gallery-card group min-w-0 cursor-pointer text-left"
              >
                <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]">
                  <Image
                    src={`/figma/gallery/${item.image}`}
                    alt={item.title ?? "CAPCO award and certification gallery"}
                    fill
                    loading="eager"
                    unoptimized
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
                {item.meta && <div className="type-caption mt-4 leading-[1.4] text-[#777777]">{item.meta}</div>}
                <h2 className={`type-h4 font-medium text-[#020202] ${item.meta ? "mt-3" : "mt-4"}`}>
                  {item.title ?? "Lorem ipsum dolor sit amet"}
                </h2>
                <p className="type-caption mt-3 inline-flex items-center gap-2 bg-[#F3F3F3] px-2 py-1 uppercase leading-none tracking-[0.02em] text-[#8A8A8A]">
                  {item.category}
                  {item.documents && <span className="text-[#58C7E8]">· PDF</span>}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />

      {selected && (
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
                  src={`/figma/gallery/${selected.image}`}
                  alt={selected.title ?? "CAPCO award and certification gallery"}
                  fill
                  unoptimized
                  sizes="760px"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 text-[12px] text-[#777777]">
                <h2 className="type-h3-lg font-medium text-[#020202]">
                  {selected.title ?? "Lorem ipsum dolor sit amet"}
                </h2>
              </div>
              {selected.meta && <p className="type-small mt-2 text-[#777777]">{selected.meta}</p>}
              <p className="type-caption mt-5 inline-block bg-[#F3F3F3] px-3 py-2 uppercase text-[#777777]">
                {selected.category}
              </p>
              <p className="type-body mt-8 max-w-[640px] text-[#595959]">
                {selected.description ??
                  (selected.category === "CERTIFICATIONS"
                    ? "Certificate held by Dada Energies (P) Ltd., manufacturer of CAPCO capacitors."
                    : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.")}
              </p>
              {selected.documents && (
                <ul className="mt-8 space-y-3">
                  {selected.documents.map((doc) => (
                    <li key={doc.href} className="flex flex-wrap items-center justify-between gap-3 border border-[#E5E5E5] px-4 py-3">
                      <span className="type-small font-medium text-[#020202]">{doc.label}</span>
                      <span className="flex gap-2">
                        <a
                          href={doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-caption bg-[#58C7E8] px-3 py-2 font-medium uppercase tracking-[0.06em] text-[#020202] transition hover:brightness-95"
                        >
                          View PDF
                        </a>
                        <a
                          href={doc.href}
                          download
                          className="type-caption bg-[#F3F3F3] px-3 py-2 font-medium uppercase tracking-[0.06em] text-[#020202] transition hover:bg-[#E6E6E6]"
                        >
                          Download
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
