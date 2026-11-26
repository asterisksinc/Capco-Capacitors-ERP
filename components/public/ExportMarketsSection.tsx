import { MapPin } from "lucide-react";

type Region = {
  code: string;
  name: string;
  summary: string;
  countries: readonly string[];
  compliance: string;
  products: string;
};

/** Content approximates the Figma frame; adjust countries/standards as needed. */
const REGIONS: readonly Region[] = [
  {
    code: "01",
    name: "Middle East & GCC",
    summary: "Long-standing distributor network supplying HVAC, pump and panel builders across the Gulf.",
    countries: ["UAE", "Saudi Arabia", "Oman", "Qatar", "Kuwait"],
    compliance: "CE / GSO / SASO",
    products: "Motor run & AC capacitors",
  },
  {
    code: "02",
    name: "South Asia Neighbours",
    summary: "Short lead times and shared standards make CAPCO a preferred regional OEM partner.",
    countries: ["Nepal", "Bangladesh", "Sri Lanka", "Bhutan"],
    compliance: "IEC / SLS / BSTI",
    products: "Fan, motor & PF capacitors",
  },
  {
    code: "03",
    name: "African Continent",
    summary: "Rugged, type-tested designs built for unstable grids and high ambient temperatures.",
    countries: ["Kenya", "Nigeria", "Tanzania", "Ethiopia", "Egypt"],
    compliance: "SONCAP / PVOC / IEC",
    products: "Power factor & motor run",
  },
  {
    code: "04",
    name: "North America",
    summary: "Private-label and OEM supply programmes with full documentation and batch traceability.",
    countries: ["USA", "Canada", "Mexico"],
    compliance: "UL recognised components",
    products: "Motor run & start capacitors",
  },
];

const STATS = [
  { value: "15+", label: "Countries served" },
  { value: "4", label: "Export regions" },
  { value: "100%", label: "Pre-dispatch inspection" },
  { value: "48h", label: "Export docs turnaround" },
];

const clip = (size: number) => ({
  clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`,
});

export default function ExportMarketsSection() {
  return (
    <section
      id="export-markets"
      style={{ background: "linear-gradient(180deg, #F4F4F4 0%, #EEFAFF 100%)" }}
      className="px-6 py-14 lg:px-[60px] lg:py-[80px]"
    >
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[900px]">
            <p className="type-small inline-flex items-center gap-2 font-medium uppercase tracking-normal text-[#020202]">
              <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
              Export Markets
            </p>
            <h2 className="type-h2 mt-5 font-normal text-[#020202]">
              Serving OEMs &amp; Distributors
              <br className="hidden sm:block" /> in 15+ Countries
            </h2>
          </div>
          <p className="type-body max-w-[620px] text-[#595959] lg:pt-6">
            With manufacturing built to Indian and international standards, CAPCO ships capacitors
            with the certification and documentation each market requires, backed by export-grade
            packaging and dependable lead times.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 border-y border-[#DBDBDB] lg:mt-[56px] lg:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex items-baseline gap-3 px-1 py-5 lg:px-6 ${
                i > 0 ? "lg:border-l lg:border-[#DBDBDB]" : ""
              } ${i % 2 === 1 ? "border-l border-[#DBDBDB] pl-4 lg:pl-6" : ""}`}
            >
              <strong className="text-[28px] font-normal leading-none tracking-[-0.04em] text-[#020202] lg:text-[36px]">
                {value}
              </strong>
              <span className="text-[12px] uppercase tracking-[0.02em] text-[#595959] lg:text-[13px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Region cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mt-10">
          {REGIONS.map(({ code, name, summary, countries, compliance, products }) => (
            <article
              key={code}
              style={clip(32)}
              className="group relative flex flex-col bg-white/80 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-7"
            >
              {/* accent bar */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#58C7E8] transition-transform duration-500 group-hover:scale-x-100"
              />

              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#595959]">
                Region / {code}
              </span>

              <h3 className="type-h3 mt-6 font-normal text-[#020202]">
                {name}
              </h3>
              <p className="type-small mt-3 leading-[1.55] text-[#595959]">{summary}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {countries.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center gap-1.5 border border-[#DBDBDB] bg-[#F7FCFE] px-2.5 py-1 text-[12px] text-[#020202]"
                  >
                    <MapPin size={11} aria-hidden="true" className="text-[#58C7E8]" />
                    {c}
                  </li>
                ))}
              </ul>

              <dl className="mt-auto pt-6">
                <div className="flex justify-between gap-4 border-t border-[#DBDBDB] py-3 text-[12px]">
                  <dt className="uppercase tracking-[0.02em] text-[#595959]">Compliance</dt>
                  <dd className="text-right text-[#020202]">{compliance}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-[#DBDBDB] pt-3 text-[12px]">
                  <dt className="uppercase tracking-[0.02em] text-[#595959]">Key Products</dt>
                  <dd className="text-right text-[#020202]">{products}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
