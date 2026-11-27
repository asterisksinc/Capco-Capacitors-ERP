const CERTIFICATION_STATS = [
  ["IS:2993 / IS:13340", "BIS Certified"],
  ["ISO 9001:2008", "TUV/5GS Audited"],
  ["IEC 60252-1", "EU Directives"],
  ["IEC 60831-1/2", "Self-Healing Dry"],
  ["5,000+ Dealers", "Pan-India Stock"],
  ["15+ Nations", "Direct Exporter"],
  ["32+ Years", "Est. 1994"],
] as const;

/** Certifications & key-numbers strip (About page under the hero, OEM page under the four-step cards). */
export function CertificationStrip({ id, className = "" }: { id?: string; className?: string }) {
  return (
    <section id={id} className={`border-y border-[#DBDBDB] bg-white py-6 lg:py-[40px] ${className}`}>
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
        {CERTIFICATION_STATS.map(([title, subtitle], idx) => (
          <div
            key={title}
            className={`flex flex-col items-center justify-center gap-3 px-4 py-6 text-center lg:h-[178px] lg:gap-[16px] lg:py-0 ${
              idx < CERTIFICATION_STATS.length - 1 ? "lg:border-r lg:border-[#DBDBDB]" : ""
            }`}
          >
            <strong className="text-[19px] font-medium leading-none tracking-[-0.04em] text-[#020202] sm:text-[22px] lg:text-[24px]">
              {title}
            </strong>
            <span className="text-[14px] font-normal leading-none text-[#595959] sm:text-[16px] lg:text-[18px]">
              {subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
