import Link from "next/link";
import { PublicNav } from "@/components/public/PublicChrome";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/public/SiteFooter";
import { CountryPage } from "@/components/public/CountryPage";
import { countryPages } from "@/lib/countryPages";

const regions = {
  "middle-east": { title: "Middle East OEM Solutions", countries: "UAE, Egypt, Turkey", cities: "Dubai, Abu Dhabi, Cairo, Istanbul", products: "Motor Run Capacitors, PFC Capacitors, Lighting Capacitors", standards: "CE, GSO, ESMA, TSE, EOS", ports: "Jebel Ali, Alexandria, Istanbul ports", freight: "7–14 days sea freight from Chennai" },
  "south-asia": { title: "South Asia OEM Solutions", countries: "Sri Lanka, Bangladesh", cities: "Colombo, Dhaka, Chittagong", products: "Submersible Panel Capacitors, Motor Start Capacitors, Fan Capacitors", standards: "SLS, BSTI, CE", ports: "Colombo, Chittagong ports", freight: "3–7 days sea freight from Chennai" },
  africa: { title: "African Continent OEM Solutions", countries: "Nigeria, Kenya, Tanzania", cities: "Lagos, Mombasa, Dar es Salaam", products: "PFC Capacitors, Capacitor Banks, Motor Run Capacitors", standards: "SONCAP, PVOC, COC, CE", ports: "Lagos, Mombasa ports", freight: "14–21 days sea freight from Chennai" },
  usa: { title: "USA OEM Solutions", countries: "North America export market", cities: "New York, Los Angeles, Houston", products: "UL-Certified Motor Run Capacitors, PFC Capacitors", standards: "UL 810, CSA, NEC", ports: "New York, LA/Long Beach ports", freight: "25–30 days sea freight / 5–7 days air" },
  // Country pages (Global Footprint menu + export map). Facts are split from the regional entries above.
  uae: { title: "UAE OEM Solutions", countries: "Middle East export market", cities: "Dubai, Abu Dhabi", products: "Motor Run Capacitors, PFC Capacitors", standards: "CE, GSO, ESMA", ports: "Jebel Ali port", freight: "7–14 days sea freight from Chennai" },
  "sri-lanka": { title: "Sri Lanka OEM Solutions", countries: "South Asia export market", cities: "Colombo", products: "Submersible Panel Capacitors, Fan Capacitors", standards: "SLS, CE", ports: "Colombo port", freight: "3–7 days sea freight from Chennai" },
  bangladesh: { title: "Bangladesh OEM Solutions", countries: "South Asia export market", cities: "Dhaka, Chittagong", products: "Motor Start Capacitors, Fan Capacitors", standards: "BSTI, CE", ports: "Chittagong port", freight: "3–7 days sea freight from Chennai" },
  turkey: { title: "Turkey OEM Solutions", countries: "Middle East export market", cities: "Istanbul", products: "Lighting Capacitors, Motor Run Capacitors", standards: "TSE, CE", ports: "Istanbul ports", freight: "7–14 days sea freight from Chennai" },
  egypt: { title: "Egypt OEM Solutions", countries: "Middle East export market", cities: "Cairo", products: "PFC Capacitors, Motor Run Capacitors", standards: "EOS, CE", ports: "Alexandria port", freight: "7–14 days sea freight from Chennai" },
} as const;

export function generateStaticParams() { return Object.keys(regions).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = countryPages[slug];
  if (page) return { title: `${page.hero.title.join(" ")} | CAPCO Capacitors`, description: page.hero.description };
  const region = regions[slug as keyof typeof regions];
  return { title: `${region?.title ?? "Global Footprint"} | CAPCO Capacitors` };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Countries with approved copy get the full country page; others keep the simple regional layout.
  if (countryPages[slug]) return <CountryPage copy={countryPages[slug]} />;
  const region = regions[slug as keyof typeof regions] ?? regions["middle-east"];
  return <main className="min-h-screen bg-white text-[#020202]"><PublicNav /><section className="bg-[#EEFAFF] px-6 py-24 lg:px-[60px] lg:py-36"><div className="mx-auto max-w-[1200px]"><Link href="/solutions/oem#global-footprint" className="text-sm text-[#595959]">← Global Footprint</Link><p className="type-caption mt-16 font-semibold uppercase tracking-[0.14em] text-[#58C7E8]">Regional export program</p><h1 className="type-display mt-5 max-w-4xl font-normal">{region.title}</h1><p className="type-lead mt-8 text-[#595959]">{region.countries}</p><div className="mt-16 grid gap-4 md:grid-cols-2"><Info label="Cities served" value={region.cities} /><Info label="Product range" value={region.products} /><Info label="Compliance" value={region.standards} /><Info label="Ports" value={region.ports} /></div><div className="mt-4 bg-[#58C7E8] p-6 text-lg">{region.freight}</div><Link href="/contact?category=export#enquiry-form" className="mt-10 inline-flex bg-[#020202] px-6 py-4 text-sm font-medium text-white">Talk to our export team →</Link></div></section><SiteFooter /></main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="bg-white p-6 lg:p-8"><p className="type-caption uppercase tracking-[0.12em] text-[#999]">{label}</p><p className="type-lead mt-4">{value}</p></div>; }
