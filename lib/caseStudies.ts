// CAPCO case studies: one source for the Case Studies listing, each /case-studies/[slug]
// detail page, and the "OEM Success Stories" carousel on the OEM page.
export type CaseStudy = {
  slug: string;
  image: string;
  clientTag: string;
  title: string;
  stats: readonly { label: string; value: string }[];
  summary: string;
  fullText: string;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "hvac-oem-capacitor-cost-reduction",
    image: "/figma/solutions/946c5.png",
    clientTag: "HVAC OEM Client Case",
    title: "Leading HVAC OEM Reduces Capacitor Costs by 28%",
    stats: [
      { label: "[CR]", value: "28%" },
      { label: "[FR]", value: "60%" },
      { label: "[ZQI]", value: "18 Months" },
    ],
    summary:
      "High landed cost of imported motor run capacitors with 12-week lead times. Capcocapacitors co-engineered equivalent capacitors with Leybold metallization, delivered in 10 days.",
    fullText:
      "A Tier-1 HVAC manufacturer was experiencing severe supply disruptions and escalating import duties on European-sourced motor run capacitors. CAPCO's engineering team reverse-engineered the dielectric stack and qualified a custom P2 burst-proof polypropylene capacitor within 3 weeks. Full volume production transitioned within 60 days, cutting unit costs by 28% and stabilizing assembly line inventory with buffer stock held in Hyderabad.",
  },
  {
    slug: "submersible-pump-oem-burst-proof-reliability",
    image: "/figma/solutions/4596c.png",
    clientTag: "Agricultural Pump OEM",
    title: "Submersible Pump OEM Achieves Burst-Proof Reliability Across Rural Grids",
    stats: [
      { label: "[FR]", value: "-64%" },
      { label: "[LT]", value: "10 Days" },
      { label: "[IS]", value: "IS:2993" },
    ],
    summary:
      "Rural voltage surges between 140V and 500V caused frequent capacitor failures in agricultural borewell pumps. CAPCO engineered a high-surge self-healing capacitor with reinforced dielectric margins.",
    fullText:
      "Operating in agricultural zones with severe phase fluctuations, western pump manufacturers suffered warranty returns exceeding 8%. CAPCO deployed custom MPP film with zinc-heavy edges and high-temperature polyurethane resin encapsulation. Field warranty claims plummeted by 64% over two monsoon seasons, making CAPCO their exclusive factory-installed capacitor partner.",
  },
  {
    slug: "apfc-panel-builder-modular-150-kvar-banks",
    image: "/figma/solutions/34685.png",
    clientTag: "Industrial EPC & APFC",
    title: "APFC Panel Builder Delivers 35% Space Saving with Modular 150 KVAR Banks",
    stats: [
      { label: "[SS]", value: "35%" },
      { label: "[PF]", value: "0.99" },
      { label: "[IS]", value: "IS:13340" },
    ],
    summary:
      "Heavy automotive stamping facility required high harmonic endurance in compact switchgear enclosures. CAPCO delivered modular cylindrical PFC cells rated for continuous 24/7 duty.",
    fullText:
      "Space constraints inside plant electrical substations restricted conventional box-type capacitor banks. CAPCO engineered compact 25 KVAR cylindrical cells with overpressure disconnectors, enabling 150 KVAR modular rack integration in 35% less enclosure footprint while maintaining power factor strictly at 0.99 under fluctuating robotic stamping loads.",
  },
  {
    slug: "appliance-oem-30000-hour-operating-life",
    image: "/figma/solutions/bec3c.png",
    clientTag: "Appliance Tier-1 OEM",
    title: "Consumer Appliance Manufacturer Validates 30,000-Hour Operating Life",
    stats: [
      { label: "[LIFE]", value: "30,000h" },
      { label: "[DF]", value: "<0.002" },
      { label: "[CERT]", value: "CE / RoHS" },
    ],
    summary:
      "Front-load washing machine manufacturer required Class-B 10,000h certified capacitors with integrated bleeder resistors and compact quick-connect terminals.",
    fullText:
      "To meet global export standards across Middle Eastern and European appliance markets, this manufacturer required dual BIS & CE conformity. CAPCO designed a low-loss polypropylene motor capacitor with integrated safety disconnectors and tan-delta loss below 0.0018, passing 30,000 hours of continuous accelerated thermal life testing.",
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
