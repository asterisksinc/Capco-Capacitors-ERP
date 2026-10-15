import Image from "next/image";
import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

const stories = Array.from({ length: 9 }, (_, index) => ({ id: index + 1 }));

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav variant="light" />
      <section className="px-6 pb-24 pt-20 lg:px-[60px] lg:pb-[150px] lg:pt-[112px]">
        <div className="mx-auto max-w-[1800px]">
          <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.02em]"><span className="h-[5px] w-[5px] bg-[#58C7E8]" />Case Studies</p>
          <h1 className="mt-6 max-w-[1250px] text-[38px] font-normal leading-[1.02] tracking-[-0.055em] sm:text-[50px] lg:text-[68px]">See how CAPCO capacitors support OEMs, industries and infrastructure projects.</h1>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
            {stories.map((story) => (
              <Link key={story.id} href="/case-studies/detail" className="group block">
                <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]"><Image src="/figma/gallery/gallery-01.jpg" alt="CAPCO case study" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" /></div>
                <h2 className="mt-4 text-[15px] font-medium leading-[1.15] tracking-[-0.02em] sm:text-[17px]">Lorem ipsum dolor sit amet</h2>
                <p className="mt-2 text-[11px] leading-[1.4] text-[#B1B1B1]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="mt-3 flex items-center gap-2 text-[9px] text-[#777777]"><span>08.06.2026</span><span>•</span><span>By logo ipsum</span></div>
                <span className="mt-3 inline-block bg-[#F3F3F3] px-2 py-1 text-[8px] uppercase leading-none tracking-[0.02em] text-[#8A8A8A]">CORPORATE SOCIAL RESPONSIBILITY / CSR</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#121212] px-6 py-20 text-white lg:px-[60px] lg:py-[110px]">
        <div className="mx-auto max-w-[1800px]"><p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase"><span className="h-[5px] w-[5px] bg-[#58C7E8]" />Locations</p><h2 className="mt-5 text-[34px] font-normal tracking-[-0.05em] sm:text-[44px]">Plant Facilities</h2>
          <div className="relative mt-10 overflow-hidden rounded-[24px] lg:mt-14"><Image src="/figma/solutions/plant-facilities-bg.png" alt="CAPCO manufacturing facility" width={1920} height={1080} className="h-auto w-full object-cover" /><div className="absolute bottom-8 right-8 max-w-[310px] text-right text-[11px] leading-[1.4] text-white sm:bottom-10 sm:right-10">DADA ENERGIES LTD. 254 E-772, TSIIC Automotive Park, Mahbubnagar, Telangana, India<Link href="/contact" className="mt-5 inline-flex bg-white px-4 py-3 text-[#020202]">Get Directions on Google Maps&nbsp; →</Link></div></div>
          <div className="mt-10 grid gap-10 text-[13px] text-white/80 sm:grid-cols-2"><div><p className="uppercase text-[10px] tracking-[0.08em]">Commercial desk phone</p><p className="mt-6">+91 98480 14000</p></div><div><p className="uppercase text-[10px] tracking-[0.08em]">Department email desk</p><p className="mt-6">sales@capcocapacitor.com</p></div></div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
