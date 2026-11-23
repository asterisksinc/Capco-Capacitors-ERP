import { BadgeCheck, ChartColumn, Download, Gavel, Globe, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

type Certification = {
  label: string;
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  meta: string;
};

/** Replace the hrefs with the real certificate PDFs once they are in /public. */
const CERTIFICATIONS: readonly Certification[] = [
  {
    label: "BIS Certified",
    icon: BadgeCheck,
    title: "Bureau of Indian Standards",
    body: "Licensed under IS:2993 for AC motor capacitors and IS:13340 for power capacitors, qualifying CAPCO products for government tenders and the mandatory Quality Control Order.",
    cta: "Download License",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "QCO 2017 Mandate OK",
  },
  {
    label: "ISO 9001:2008",
    icon: ShieldCheck,
    title: "Quality Management System",
    body: "Every stage, from film metallization to final testing, runs under a documented ISO 9001:2008 QMS with full batch traceability and corrective-action records.",
    cta: "Download Certificate",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "Re-Audited Annually",
  },
  {
    label: "CE Marked",
    icon: Globe,
    title: "European Conformity",
    body: "CE-marked motor run and power factor capacitors meet EU safety, health and environmental requirements for export to European and CE-recognising markets.",
    cta: "Download DoC",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "EN 60252-1 Compliant",
  },
  {
    label: "IEC Compliant",
    icon: ChartColumn,
    title: "IEC 60252 & IEC 60831",
    body: "Designed and type-tested to IEC 60252-1 for motor capacitors and IEC 60831 for shunt power capacitors, covering endurance, self-healing and thermal stability.",
    cta: "Download Report",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "Type-Tested Designs",
  },
  {
    label: "Export Standards",
    icon: Truck,
    title: "Export Quality Approvals",
    body: "Products ship with the documentation each market requires, including SONCAP, PVOC, GSO and SLS, for distributors across the Middle East, Africa and South Asia.",
    cta: "Export Matrix",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "15+ Export Markets",
  },
  {
    label: "Factory Audited",
    icon: Gavel,
    title: "Third-Party Inspection",
    body: "Production lines and test labs are open to OEM and third-party audits, with pre-dispatch inspection available on every bulk order.",
    cta: "Inspection SOP",
    href: "/catalogs/capco-product-catalog.pdf",
    meta: "Zero Discrepancy",
  },
];

const clip = (size: number) => ({
  clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`,
});

export default function ComplianceSection() {
  return (
    <section id="compliance" className="bg-[#F4F4F4] px-6 py-14 lg:px-[60px] lg:py-[80px]">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[900px]">
            <p className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-normal text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              Compliance
            </p>
            <h2 className="mt-5 text-[30px] font-normal leading-[1.08] tracking-[-0.04em] text-[#020202] sm:text-[36px] lg:mt-5 lg:text-[42px]">
              BIS, ISO, CE &amp; IEC Certified
              <br className="hidden sm:block" /> Manufacturing
            </h2>
          </div>
          <p className="max-w-[620px] text-[15px] leading-[1.5] text-[#595959] lg:pt-6 lg:text-[16px]">
            CAPCO capacitors are certified to Indian and international standards, backed by
            third-party inspection and compliance with Quality Control Orders (QCO) and international
            safety norms.
          </p>
        </div>

        {/* Certification rows */}
        <div className="mt-10 flex flex-col gap-4 lg:mt-[56px]">
          {CERTIFICATIONS.map(({ label, icon: Icon, title, body, cta, href, meta }) => (
            <div key={label} className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,780px)] lg:gap-0">
              {/* Label + rule */}
              <div className="flex items-center gap-6 lg:pr-10 lg:pt-[14px]">
                <span className="shrink-0 text-[20px] font-normal uppercase leading-none tracking-[-0.01em] text-[#595959] lg:text-[26px]">
                  {label}
                </span>
                <span className="hidden h-[2px] flex-1 bg-[#DBDBDB] lg:block" aria-hidden="true" />
              </div>

              {/* Card */}
              <article style={clip(40)} className="bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div style={clip(10)} className="grid h-12 w-12 shrink-0 place-items-center bg-[#DEDEDE]/40">
                  <Icon size={22} strokeWidth={1.6} className="text-[#595959]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[19px] font-normal leading-[1.2] tracking-[-0.02em] text-[#020202] lg:text-[22px]">
                    {title}
                  </h3>
                </div>
                <p className="mt-4 max-w-[680px] text-[14px] leading-[1.55] text-[#595959] lg:text-[15px]">{body}</p>

                <div className="my-5 h-px w-full bg-[#DBDBDB] lg:my-6" />

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <a
                    href={href}
                    download
                    style={clip(12)}
                    className="inline-flex h-9 min-w-[187px] items-center justify-between gap-4 bg-[#58C7E8] px-3 text-[13px] font-medium text-[#020202] transition hover:-translate-y-0.5 hover:brightness-95"
                  >
                    <span>{cta}</span>
                    <Download size={16} aria-hidden="true" />
                  </a>
                  <span className="hidden h-[26px] w-px bg-[#DBDBDB] sm:block" aria-hidden="true" />
                  <span className="text-[13px] uppercase tracking-[0.02em] text-[#595959]">{meta}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
