/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";
import { caseStudies, featuredCaseStudies, getCaseStudy } from "@/lib/caseStudies";

export function generateStaticParams() {
  return caseStudies.filter((c) => c.published).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return { title: "Case Study | CAPCO Capacitors" };
  return { title: `${study.title} | CAPCO Case Study`, description: study.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = getCaseStudy((await params).slug);
  if (!study || !study.published) notFound();
  const related = featuredCaseStudies.filter((c) => c.slug !== study.slug);

  return (
    <main className="min-h-screen bg-white text-[#020202]">
      <PublicNav variant="light" />

      {/* Header: tag + title (left), CAPCO block (right) */}
      <section className="px-6 pt-8 lg:px-[60px] lg:pt-[52px]">
        <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-8 pb-10 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-[1000px]">
            <Link href="/case-studies" className="type-small block w-fit text-[#595959] transition hover:text-[#58C7E8]">
              ← All case studies
            </Link>
            <div className="mt-6 inline-flex h-[28px] items-center rounded-[4px] bg-[#F4F4F4] px-2.5">
              <span className="type-caption uppercase leading-[120%] text-[#595959]">{study.clientTag}</span>
            </div>
            <h1 className="mt-5 max-w-[900px] text-[34px] font-normal leading-[1.08] tracking-[-0.04em] sm:text-[44px] lg:text-[56px] text-[#020202]">{study.title}</h1>
          </div>
          <div className="flex h-[140px] w-full max-w-[450px] shrink-0 items-center justify-center bg-[#57C7E8] sm:h-[160px] lg:h-[191px] lg:w-[450px]">
            <img src="/figma/solutions/capco-logo-white.png" alt="CAPCO Capacitors" className="h-auto w-[180px] object-contain sm:w-[200px]" />
          </div>
        </div>
      </section>

      {/* Main image: a wide infographic is shown in full; otherwise a cropped full-width photo */}
      {study.detailImage ? (
        <div className="bg-[#EEF5FB] px-6 py-8 lg:px-[60px] lg:py-12">
          <img src={study.detailImage} alt={`${study.title}: process overview`} className="mx-auto block h-auto w-full max-w-[1600px] rounded-[16px]" />
        </div>
      ) : (
        <div className="w-full overflow-hidden bg-[#1A1A1A]">
          <img src={study.image} alt={study.title} className="h-[320px] w-full object-cover sm:h-[460px] lg:h-[70svh] lg:max-h-[760px]" />
        </div>
      )}

      {/* Results + story */}
      <section className="px-6 py-16 lg:px-[60px] lg:py-24">
        <div className="mx-auto max-w-[1800px]">
          <div className="grid grid-cols-3 divide-x divide-[#E4E4E4] border-y border-[#E4E4E4]">
            {study.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-8 text-center lg:py-12">
                <p className="type-caption font-mono uppercase tracking-[0.12em] text-[#8A8A8A]">{stat.label}</p>
                <p className="type-h2 mt-3 font-light text-[#020202]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-20">
            <div className="flex flex-col gap-8 self-start lg:sticky lg:top-[120px]">
              <div className="flex items-center gap-2 text-[14px] font-medium uppercase leading-none text-[#020202]">
                <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
                The Story
              </div>
              {study.storyImage && (
                <img
                  src={study.storyImage}
                  alt={`${study.title}: CAPCO capacitors on an OEM assembly line`}
                  className="block aspect-[16/9] h-auto w-full rounded-[20px] object-cover lg:rounded-[24px]"
                />
              )}
            </div>
            <div className="flex flex-col gap-10">
              {study.sections ? (
                <>
                  {study.scenario && (
                    <div>
                      <h2 className="type-h3-lg font-medium text-[#020202]">The scenario</h2>
                      <p className="type-body mt-4 text-[#121212]">{study.scenario}</p>
                    </div>
                  )}
                  {study.sections.map((section, i) => (
                    <div key={section.title} className="border-t border-[#E4E4E4] pt-8">
                      <p className="type-caption font-mono uppercase tracking-[0.12em] text-[#58C7E8]">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="type-h3 mt-2 font-medium text-[#020202]">{section.title}</h2>
                      <p className="type-body mt-3 text-[#121212]">{section.body}</p>
                      {section.target && (
                        <p className="type-small mt-4 inline-flex rounded-[6px] bg-[#EEFAFF] px-3 py-2 text-[#020202]">
                          <span className="mr-2 font-medium">Target:</span>
                          {section.target}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div>
                    <h2 className="type-h3-lg font-medium text-[#020202]">The challenge</h2>
                    <p className="type-body mt-4 text-[#121212]">{study.summary}</p>
                  </div>
                  <div>
                    <h2 className="type-h3-lg font-medium text-[#020202]">Solution &amp; outcome</h2>
                    <p className="type-body mt-4 text-[#121212]">{study.fullText}</p>
                  </div>
                </>
              )}
              <Link
                href="/contact?category=oem#enquiry-form"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
                className="inline-flex min-h-[56px] w-fit items-center gap-6 bg-[#58C7E8] px-5 py-3 text-[14px] font-medium text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Discuss a similar project
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related case studies */}
      <section className="border-t border-[#EAEAEA] px-6 py-20 lg:px-[60px] lg:py-28">
        <div className="mx-auto max-w-[1800px]">
          <h2 className="type-h2 font-normal text-[#020202]">More case studies</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((card) => {
              const body = (
                <>
                  <div className="relative aspect-[444/320] w-full overflow-hidden bg-[#F4F4F4]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className={`h-full w-full object-cover transition duration-500 ${card.published ? "group-hover:scale-105" : "grayscale-[35%]"}`}
                    />
                    {!card.published && (
                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#020202]">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <h3 className={`type-h4 font-medium transition ${card.published ? "text-[#020202] group-hover:text-[#58C7E8]" : "text-[#595959]"}`}>{card.title}</h3>
                    <span className="type-caption inline-flex items-center rounded-[4px] bg-[#F4F4F4] px-2.5 py-1.5 uppercase text-[#595959]">
                      {card.clientTag}
                    </span>
                  </div>
                </>
              );
              // Only published case studies link to a detail page; the rest are "Coming soon".
              return card.published ? (
                <Link key={card.slug} href={`/case-studies/${card.slug}`} className="group flex flex-col gap-5">
                  {body}
                </Link>
              ) : (
                <div key={card.slug} aria-label={`${card.title} (coming soon)`} className="flex flex-col gap-5">
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
