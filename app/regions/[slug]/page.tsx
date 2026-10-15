import Link from "next/link";
import { PublicNav } from "@/components/public/PublicChrome";
import { SiteFooter } from "@/components/public/SiteFooter";

const regions = {
  "middle-east": { title: "Middle East OEM Solutions", countries: "UAE, Egypt, Turkey", cities: "Dubai, Abu Dhabi, Cairo, Istanbul", products: "Motor Run Capacitors, PFC Capacitors, Lighting Capacitors", standards: "CE, GSO, ESMA, TSE, EOS", ports: "Jebel Ali, Alexandria, Istanbul ports", freight: "7–14 days sea freight from Chennai" },
  "south-asia": { title: "South Asia OEM Solutions", countries: "Sri Lanka, Bangladesh", cities: "Colombo, Dhaka, Chittagong", products: "Submersible Panel Capacitors, Motor Start Capacitors, Fan Capacitors", standards: "SLS, BSTI, CE", ports: "Colombo, Chittagong ports", freight: "3–7 days sea freight from Chennai" },
  africa: { title: "Africa OEM Solutions", countries: "Nigeria, Kenya, Tanzania", cities: "Lagos, Mombasa, Dar es Salaam", products: "PFC Capacitors, Capacitor Banks, Motor Run Capacitors", standards: "SONCAP, PVOC, COC, CE", ports: "Lagos, Mombasa ports", freight: "14–21 days sea freight from Chennai" },
  usa: { title: "USA OEM Solutions", countries: "USA", cities: "New York, Los Angeles, Houston", products: "UL-Certified Motor Run Capacitors, PFC Capacitors", standards: "UL 810, CSA, NEC", ports: "New York, LA/Long Beach ports", freight: "25–30 days sea freight / 5–7 days air" },
} as const;

export function generateStaticParams() { return Object.keys(regions).map((slug) => ({ slug })); }

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = regions[slug as keyof typeof regions] ?? regions["middle-east"];
  return <main className="min-h-screen bg-white text-[#020202]"><PublicNav /><section className="bg-[#EEFAFF] px-6 py-24 lg:px-[60px] lg:py-36"><div className="mx-auto max-w-[1200px]"><Link href="/#global-footprint" className="text-sm text-[#595959]">← Global Footprint</Link><p className="mt-16 text-xs font-semibold uppercase tracking-[0.14em] text-[#58C7E8]">Regional export program</p><h1 className="mt-5 max-w-4xl text-5xl font-normal tracking-[-0.05em] lg:text-8xl">{region.title}</h1><p className="mt-8 text-xl text-[#595959]">{region.countries}</p><div className="mt-16 grid gap-4 md:grid-cols-2"><Info label="Cities served" value={region.cities} /><Info label="Product range" value={region.products} /><Info label="Compliance" value={region.standards} /><Info label="Ports" value={region.ports} /></div><div className="mt-4 bg-[#58C7E8] p-6 text-lg">{region.freight}</div><Link href="/contact?category=export#enquiry-form" className="mt-10 inline-flex bg-[#020202] px-6 py-4 text-sm font-medium text-white">Talk to our export team →</Link></div></section><SiteFooter /></main>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="bg-white p-6 lg:p-8"><p className="text-xs uppercase tracking-[0.12em] text-[#999]">{label}</p><p className="mt-4 text-lg leading-7">{value}</p></div>; }
