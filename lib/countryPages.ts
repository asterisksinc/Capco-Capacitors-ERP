// Copy for the country pages (/regions/[slug]). Add a country here once its copy is approved;
// slugs without an entry fall back to the simple regional page.
export type CountryPageCopy = {
  slug: string;
  country: string;
  hero: {
    tags: [string, string];
    /** Two headline lines. */
    title: [string, string];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
  };
  expertise: {
    tag: string;
    title: string;
    description: string;
    cards: { title: string; description: string; image: string }[];
  };
  applications: {
    tag: string;
    title: string;
    description: string;
    cards: { tag: string; title: string; description: string; href: string }[];
  };
  partner: {
    tag: string;
    title: string;
    cards: { tag: string; description: string }[];
    cta: string;
  };
  faq: { tag: string; title: string; items: { q: string; a: string }[] };
  cta: { title: string; body: string; button: string };
};

export const countryPages: Record<string, CountryPageCopy> = {
  uae: {
    slug: "uae",
    country: "UAE",
    hero: {
      tags: ["Global Export Capability", "Open for UAE Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for UAE"],
      description:
        "CAPCO Capacitors is open for UAE enquiries from OEMs, distributors and industrial buyers seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request UAE Pricing",
      secondaryCta: "Download UAE Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "UAE Market Readiness",
      title: "Capacitor solutions for UAE operating conditions.",
      description:
        "CAPCO supports UAE-based OEMs, distributors and industrial buyers with export-ready capacitor solutions designed for high-temperature HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment operating in the UAE’s demanding climate.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across the UAE.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for UAE industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for UAE equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for UAE OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request UAE Pricing",
    },
    faq: {
      tag: "UAE Export FAQs",
      title: "Answers for UAE Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors in the UAE?",
          a: "Yes. CAPCO Capacitors is open for UAE enquiries from OEMs, distributors, importers and industrial buyers seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which capacitor products can CAPCO supply for UAE applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for UAE HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in the UAE?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for UAE-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For UAE-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to the UAE?",
          a: "Estimated sea-freight transit time from India to Jebel Ali is typically 7–10 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for UAE export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for UAE OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    cta: {
      title: "Looking for a Capacitor Manufacturer in the UAE?",
      body: "Request UAE-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request UAE Pricing",
    },
  },
  usa: {
    slug: "usa",
    country: "USA",
    hero: {
      tags: ["Global Export Capability", "Open for USA Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for USA"],
      description:
        "CAPCO Capacitors is open for USA enquiries from OEMs, distributors and industrial buyers seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request USA Pricing",
      secondaryCta: "Download USA Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "USA Market Readiness",
      title: "Capacitor solutions for US OEM requirements.",
      description:
        "CAPCO supports US-based OEMs, distributors and industrial buyers with export-ready capacitor solutions designed for HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment used across residential, commercial and industrial applications.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across the USA.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for US industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for US equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for US OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request USA Pricing",
    },
    faq: {
      tag: "USA Export FAQs",
      title: "Answers for US Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors in the USA?",
          a: "Yes. CAPCO Capacitors is open for USA enquiries from OEMs, distributors, importers and industrial buyers seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which capacitor products can CAPCO supply for US applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for US HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in the USA?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for US-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For US-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to the USA?",
          a: "Estimated sea-freight transit time from India to major US ports is typically 30–40 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for USA export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for US OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    // CTA copy was not supplied for the USA; mirrors the UAE wording.
    cta: {
      title: "Looking for a Capacitor Manufacturer in the USA?",
      body: "Request USA-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request USA Pricing",
    },
  },
  "sri-lanka": {
    slug: "sri-lanka",
    country: "Sri Lanka",
    hero: {
      tags: ["Global Export Capability", "Open for Sri Lanka Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for Sri Lanka"],
      description:
        "CAPCO Capacitors is open for Sri Lanka enquiries from OEMs, distributors and industrial buyers seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request Sri Lanka Pricing",
      secondaryCta: "Download Sri Lanka Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "Sri Lanka Market Readiness",
      title: "Capacitor solutions for Sri Lankan operating conditions.",
      description:
        "CAPCO supports Sri Lanka-based OEMs, distributors and industrial buyers with export-ready capacitor solutions designed for HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment used across residential, commercial and industrial applications.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across Sri Lanka.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for Sri Lankan industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for Sri Lankan equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for Sri Lankan OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request Sri Lanka Pricing",
    },
    faq: {
      tag: "Sri Lanka Export FAQs",
      title: "Answers for Sri Lankan Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors in Sri Lanka?",
          a: "Yes. CAPCO Capacitors is open for Sri Lanka enquiries from OEMs, distributors, importers and industrial buyers seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which capacitor products can CAPCO supply for Sri Lankan applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for Sri Lankan HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in Sri Lanka?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for Sri Lanka-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For Sri Lanka-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to Sri Lanka?",
          a: "Estimated sea-freight transit time from India to Colombo is typically 3–7 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for Sri Lanka export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for Sri Lankan OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    cta: {
      title: "Looking for a Capacitor Manufacturer in Sri Lanka?",
      body: "Request Sri Lanka-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request Sri Lanka Pricing",
    },
  },
  bangladesh: {
    slug: "bangladesh",
    country: "Bangladesh",
    hero: {
      tags: ["Global Export Capability", "Open for Bangladesh Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for Bangladesh"],
      description:
        "CAPCO Capacitors is open for Bangladesh enquiries from OEMs, distributors and industrial buyers seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request Bangladesh Pricing",
      secondaryCta: "Download Bangladesh Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "Bangladesh Market Readiness",
      title: "Capacitor solutions for Bangladeshi operating conditions.",
      description:
        "CAPCO supports Bangladesh-based OEMs, distributors and industrial buyers with export-ready capacitor solutions designed for HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment used across residential, commercial and industrial applications.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across Bangladesh.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for Bangladeshi industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for Bangladeshi equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for Bangladeshi OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request Bangladesh Pricing",
    },
    faq: {
      tag: "Bangladesh Export FAQs",
      title: "Answers for Bangladeshi Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors in Bangladesh?",
          a: "Yes. CAPCO Capacitors is open for Bangladesh enquiries from OEMs, distributors, importers and industrial buyers seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which capacitor products can CAPCO supply for Bangladeshi applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for Bangladeshi HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in Bangladesh?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for Bangladesh-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For Bangladesh-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to Bangladesh?",
          a: "Estimated sea-freight transit time from India to Chittagong is typically 7–12 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for Bangladesh export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for Bangladeshi OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    cta: {
      title: "Looking for a Capacitor Manufacturer in Bangladesh?",
      body: "Request Bangladesh-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request Bangladesh Pricing",
    },
  },
  turkey: {
    slug: "turkey",
    country: "Türkiye",
    hero: {
      tags: ["Global Export Capability", "Open for Türkiye Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for Türkiye"],
      description:
        "CAPCO Capacitors is open for Türkiye enquiries from OEMs, distributors and industrial buyers seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request Türkiye Pricing",
      secondaryCta: "Download Türkiye Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "Türkiye Market Readiness",
      title: "Capacitor solutions for Turkish operating conditions.",
      description:
        "CAPCO supports Türkiye-based OEMs, distributors and industrial buyers with export-ready capacitor solutions designed for HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment used across residential, commercial and industrial applications.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across Türkiye.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for Turkish industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for Turkish equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for Turkish OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request Türkiye Pricing",
    },
    faq: {
      tag: "Türkiye Export FAQs",
      title: "Answers for Turkish Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors in Türkiye?",
          a: "Yes. CAPCO Capacitors is open for Türkiye enquiries from OEMs, distributors, importers and industrial buyers seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which capacitor products can CAPCO supply for Turkish applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for Turkish HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in Türkiye?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for Türkiye-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For Türkiye-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to Türkiye?",
          a: "Estimated sea-freight transit time from India to Turkish ports is typically 20–30 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for Türkiye export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for Turkish OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    cta: {
      title: "Looking for a Capacitor Manufacturer in Türkiye?",
      body: "Request Türkiye-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request Türkiye Pricing",
    },
  },
  africa: {
    slug: "africa",
    country: "Africa",
    hero: {
      tags: ["Global Export Capability", "Open for Africa Enquiries"],
      title: ["Capacitor Manufacturing", "Partner for Africa"],
      description:
        "CAPCO Capacitors is open for enquiries from OEMs, distributors and industrial buyers across African markets seeking reliable motor run, PFC, lighting and custom capacitor solutions.",
      primaryCta: "Request Africa Pricing",
      secondaryCta: "Download Africa Catalog",
      image: "/figma/solutions/66dd5.png",
    },
    expertise: {
      tag: "Africa Market Readiness",
      title: "Capacitor solutions for African operating conditions.",
      description:
        "CAPCO supports OEMs, distributors and industrial buyers across African markets with export-ready capacitor solutions designed for HVAC systems, water-pumping infrastructure, appliances and industrial power applications.",
      cards: [
        {
          title: "HVAC & Cooling Systems",
          description:
            "Motor run and appliance capacitors for air-conditioning, refrigeration and cooling equipment used across residential, commercial and industrial applications.",
          image: "/figma/solutions/946c5.png",
        },
        {
          title: "Water & Pumping Infrastructure",
          description:
            "Motor start and submersible panel capacitors for water pumps, irrigation systems and pumping applications across African markets.",
          image: "/figma/solutions/4596c.png",
        },
        {
          title: "Industrial Power Quality",
          description:
            "PFC capacitors and capacitor banks for industrial facilities seeking improved power factor and electrical-system stability.",
          image: "/figma/solutions/34685.png",
        },
      ],
    },
    applications: {
      tag: "Applications We Serve",
      title: "Capacitor solutions for African industries.",
      description:
        "From HVAC systems and water infrastructure to appliances and industrial power networks, CAPCO supplies application-ready capacitor solutions for African equipment manufacturers and system integrators.",
      cards: [
        {
          tag: "HVAC",
          title: "Air Conditioning & Refrigeration Capacitors",
          description:
            "Motor run and appliance capacitors engineered for compressors, fan motors and cooling systems used across residential, commercial and industrial HVAC applications.",
          href: "/products/ac-refrigeration-washing-machine-capacitor",
        },
        {
          tag: "Pumps",
          title: "Water Pump & Submersible Capacitors",
          description:
            "Motor start and submersible panel capacitors designed to support reliable starting performance and sustained operation in water-pumping and irrigation systems.",
          href: "/products/submersible-panel-capacitor",
        },
        {
          tag: "Industrial",
          title: "Power Factor Correction Capacitors",
          description:
            "Cylindrical PFC capacitors and capacitor banks for APFC panel integration and industrial power factor correction applications.",
          href: "/products/pfc-cylindrical-capacitor",
        },
      ],
    },
    partner: {
      tag: "Ready to Partner",
      title: "A dependable capacitor supply partner for African OEMs and distributors.",
      cards: [
        {
          tag: "Export Documentation",
          description:
            "Export-ready documentation, including commercial invoices, packing lists, certificates of origin and applicable compliance documents.",
        },
        {
          tag: "Technical Support",
          description:
            "Technical assistance for product selection, application compatibility, specifications and custom capacitor requirements.",
        },
        {
          tag: "Reliable Supply",
          description:
            "Consistent supply of BIS and CE-certified capacitors, supported by structured production planning and export logistics coordination.",
        },
      ],
      cta: "Request Africa Pricing",
    },
    faq: {
      tag: "Africa Export FAQs",
      title: "Answers for African Buyers",
      items: [
        {
          q: "Is CAPCO open to supplying capacitors across African markets?",
          a: "Yes. CAPCO Capacitors is open for enquiries from OEMs, distributors, importers and industrial buyers across African markets seeking reliable capacitor manufacturing and export support.",
        },
        {
          q: "Which African countries can CAPCO supply to?",
          a: "CAPCO can evaluate supply opportunities across African markets, including but not limited to Kenya, Nigeria, Ghana, Tanzania, Uganda, Ethiopia, South Africa, Egypt, Morocco and Algeria. Final availability is confirmed based on destination requirements, logistics feasibility and commercial agreement.",
        },
        {
          q: "Which capacitor products can CAPCO supply for African applications?",
          a: "CAPCO offers motor run capacitors, motor start capacitors, fan capacitors, submersible panel capacitors, PFC capacitors, lighting capacitors, UV lamp capacitors and custom capacitor solutions, subject to product availability and technical requirements.",
        },
        {
          q: "Are CAPCO capacitors suitable for African HVAC applications?",
          a: "Yes. CAPCO motor run and appliance capacitors are designed for air-conditioning, refrigeration, fan motor and compressor applications. Final product selection should be based on the equipment’s rated voltage, capacitance requirement, operating temperature and installation conditions.",
        },
        {
          q: "Can CAPCO support power factor correction applications in Africa?",
          a: "Yes. CAPCO supplies cylindrical PFC capacitors and capacitor banks suitable for APFC panel integration and industrial power factor correction applications.",
        },
        {
          q: "What certifications are available for Africa-bound capacitors?",
          a: "CAPCO products are stated as BIS and CE certified on its official website. For Africa-bound shipments, buyers should confirm the applicable certification, conformity documentation and product-specific compliance requirements with CAPCO’s export team before placing an order.",
        },
        {
          q: "What is the estimated shipping time from India to African ports?",
          a: "Estimated sea-freight transit time from India to major African ports varies by destination, typically ranging from 20–45 days, subject to shipping schedules, port conditions, customs clearance and agreed Incoterms.",
        },
        {
          q: "What Incoterms can CAPCO support for Africa export orders?",
          a: "CAPCO can support commonly used export Incoterms, including FOB, CIF, DDP and EXW, subject to commercial agreement, destination requirements and logistics feasibility.",
        },
        {
          q: "Can CAPCO provide custom capacitors for African OEM applications?",
          a: "Yes. CAPCO can evaluate custom capacitor requirements based on capacitance, voltage, terminal configuration, housing, encapsulation, application conditions and required certifications. Custom solutions are subject to technical feasibility and minimum order requirements.",
        },
      ],
    },
    cta: {
      title: "Looking for a Capacitor Manufacturer in Africa?",
      body: "Request Africa-specific pricing, product specifications, export documentation and technical support from CAPCO’s export team.",
      button: "Request Africa Pricing",
    },
  },
};
