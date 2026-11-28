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
  /** Wide image shown in full (not cropped) on the detail page instead of `image`. */
  detailImage?: string;
  /** Published case studies have a detail page; others are shown as "Coming soon". */
  published?: boolean;
  /** Image shown beside "The Story" on the detail page. */
  storyImage?: string;
  /** Long-form story: an intro paragraph plus numbered sections (replaces challenge / solution). */
  scenario?: string;
  sections?: readonly { title: string; body: string; target?: string }[];
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
    published: true,
    image: "/figma/case-studies/apfc-panel-case-study.jpg",
    detailImage: "/figma/case-studies/oem-process-workflow.jpg",
    storyImage: "/figma/case-studies/oem-story-fan-line.jpg",
    scenario:
      "A ceiling fan manufacturer builds 20,000 fans a month across several models. Each fan needs a motor run capacitor that sets the fan's speed performance and starting behaviour. The OEM wants a supplier that matches its specification, ships on a predictable schedule, and can trace every batch. This is a composite scenario, not a real client.",
    sections: [
      {
        title: "Understanding the OEM requirement",
        body: "Supply starts with a clear specification. Before any sample is made, Capco's team records the capacitance and tolerance, rated voltage, operating temperature, terminal and lead style, physical size, expected life, and the standards the OEM's own approvals depend on. Both sides sign off this “spec sheet” as the single reference for everything that follows.",
      },
      {
        title: "Customised design and sampling",
        body: "Capco offers customisation on its products to the OEM's size and application needs. The sampling stage produces a small batch to the signed spec sheet. The OEM tests it on its own fan line and in its lab. Capco shares its own test readings alongside the samples so both sets of results can be compared.",
        target: "15 working days from signed spec to approved sample.",
      },
      {
        title: "Manufacturing and quality control",
        body: "Capco makes its own metallized polypropylene film capacitors, with in-house metallization, automatic winding and a test lab. Quality control runs at three points: incoming film and material checks, in-process checks during winding and assembly, and a final electrical test on every outgoing unit. Each batch carries a code that links back to its materials and test records.",
        target: "100% of outgoing units electrically tested; every batch traceable.",
      },
      {
        title: "Supply planning and delivery",
        body: "The OEM shares a 12-week forecast, and Capco plans material and production against it. Deliveries follow a monthly schedule agreed up front, with a named contact for order changes. If the OEM's demand moves, the forecast is revised at an agreed review point, so both sides plan from the same numbers.",
      },
      {
        title: "Support, change control and continuity",
        body: "After launch, the OEM has one point of contact for technical queries and complaints. Any change to materials, process or design goes through a written change notice, so nothing changes silently. If a batch is questioned, the traceability records allow a clear, fast review of which units are affected.",
      },
      {
        title: "Conclusion",
        body: "A fan OEM's biggest risk with a capacitor supplier is uncertainty: unclear specs, inconsistent batches and unreliable dates. This blueprint shows how Capco removes each one with a signed specification, tested and traceable batches, a shared forecast and controlled changes. If you build fans or other motor-driven products, Capco can walk you through the same process for your own range.",
      },
    ],
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

/** The 3 case study cards shown on every solution page and the Case Studies page:
 *  the published one first (links to its detail page), then two "Coming soon". */
export const featuredCaseStudies: readonly CaseStudy[] = [
  "apfc-panel-builder-modular-150-kvar-banks",
  "hvac-oem-capacitor-cost-reduction",
  "submersible-pump-oem-burst-proof-reliability",
].map((slug) => caseStudies.find((c) => c.slug === slug)!);
