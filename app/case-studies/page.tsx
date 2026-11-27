import Image from "next/image";
import Link from "next/link";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { featuredCaseStudies } from "@/lib/caseStudies";


export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav variant="light" />
      <section className="px-6 pb-24 pt-20 lg:px-[60px] lg:pb-[150px] lg:pt-[112px]">
        <div className="mx-auto max-w-[1800px]">
          <p className="type-caption inline-flex items-center gap-2 font-medium uppercase tracking-[0.02em]"><span className="h-[5px] w-[5px] bg-[#58C7E8]" />Case Studies</p>
          <h1 className="mt-6 max-w-[1100px] text-[34px] font-normal leading-[1.08] tracking-[-0.04em] sm:text-[44px] lg:text-[56px]">See how CAPCO capacitors support OEMs, industries and infrastructure projects.</h1>
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
            {featuredCaseStudies.map((story) => {
              const body = (
                <>
                  <div className="relative aspect-[1.37] overflow-hidden bg-[#F4F4F4]">
                    <Image src={story.image} alt={story.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className={`object-cover transition duration-500 ${story.published ? "group-hover:scale-[1.03]" : "grayscale-[35%]"}`} />
                    {!story.published && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#020202]">Coming soon</span>}
                  </div>
                  <h2 className={`type-h4 mt-4 font-medium transition ${story.published ? "group-hover:text-[#58C7E8]" : "text-[#595959]"}`}>{story.title}</h2>
                  <p className="type-small mt-2 leading-[1.5] text-[#777777]">{story.summary}</p>
                  <span className="type-caption mt-3 inline-block bg-[#F3F3F3] px-2 py-1 uppercase leading-none tracking-[0.02em] text-[#8A8A8A]">{story.clientTag}</span>
                </>
              );
              return story.published ? (
                <Link key={story.slug} href={`/case-studies/${story.slug}`} className="group block">{body}</Link>
              ) : (
                <div key={story.slug} aria-label={`${story.title} (coming soon)`}>{body}</div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#121212] px-6 py-20 text-white lg:px-[60px] lg:py-[110px]">
        <div className="mx-auto max-w-[1800px]"><p className="type-caption inline-flex items-center gap-2 font-medium uppercase"><span className="h-[5px] w-[5px] bg-[#58C7E8]" />Locations</p><h2 className="type-h2 mt-5 font-normal">Plant Facilities</h2>
          <div className="relative mt-10 h-[420px] overflow-hidden rounded-[24px] bg-[#1a1a1a] sm:h-[560px] lg:mt-14 lg:h-[680px]"><iframe title="Map: DADA ENERGIES (P) LTD., Medak, Telangana" src="https://www.google.com/maps?q=17.7359222,78.4825576&z=15&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" /><div className="absolute bottom-4 left-4 right-4 rounded-[12px] bg-[#121212]/92 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] text-white backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:max-w-[340px] sm:p-6"><p className="type-caption leading-[1.55] text-white/85">DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village, Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.</p><a href="https://maps.app.goo.gl/iCLxR4jT38AWZDBQ7" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex bg-white px-3.5 py-2.5 text-[12px] font-medium !text-[#020202] transition hover:bg-[#58C7E8]">Get Directions on Google Maps ↗</a></div></div>
          <div className="type-small mt-10 grid gap-10 text-white/80 sm:grid-cols-2"><div><p className="type-caption uppercase tracking-[0.08em]">Commercial desk phone</p><p className="mt-6">+91-9848014000</p></div><div><p className="type-caption uppercase tracking-[0.08em]">Department email desk</p><p className="mt-6">info@capcocapacitor.com</p></div></div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
