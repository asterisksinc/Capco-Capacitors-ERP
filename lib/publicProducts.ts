export type PublicProduct = {
  slug: string;
  date: string;
  category: string;
  title: string;
  author: string;
  image: string;
  summary: string;
};

export const publicProducts: PublicProduct[] = [
  {
    slug: "zinc-aluminium-alloy-metalised-bopp-film",
    date: "08.06.2026",
    category: "Metalized Polypropylene Film [ MPP ]",
    title: "Zinc / Aluminium Alloy Metalised BOPP Film",
    author: "Russell Gold",
    image: "/figma/products/product-1.png",
    summary: "In-house Leybold-metallized BOPP film for self-healing, high-voltage capacitor applications.",
  },
  {
    slug: "fan-capacitor",
    date: "08.02.2026",
    category: "Fan Capacitors",
    title: "Fan Capacitor",
    author: "Russell Gold",
    image: "/figma/products/product-2.png",
    summary: "Compact IS:2993 certified capacitors for fans, HVAC equipment, and appliance assemblies.",
  },
  {
    slug: "motor-run-capacitor",
    date: "07.27.2026",
    category: "Motor Capacitors",
    title: "Motor Run Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/product-3.png",
    summary: "Reliable motor-run units for continuous duty applications with stable capacitance tolerance.",
  },
  {
    slug: "motor-start-capacitor",
    date: "07.27.2026",
    category: "Motor Capacitors",
    title: "Motor Start Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/product-4.png",
    summary: "High-starting-torque capacitors for pumps, compressors, and industrial drives.",
  },
  {
    slug: "submersible-panel-capacitor",
    date: "07.13.2026",
    category: "Motor Capacitors",
    title: "Submersible Panel Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/product-5.png",
    summary: "Burst-proof capacitor assemblies for borewell and agricultural pump control panels.",
  },
  {
    slug: "ac-refrigeration-washing-machine-capacitor",
    date: "06.30.2026",
    category: "Fan Capacitors",
    title: "A.C. / Refrigeration / Washing Machine Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/product-6.png",
    summary: "P2 safety capacitors for high-density home appliance integration.",
  },
  {
    slug: "lighting-luminaire-capacitor",
    date: "06.18.2026",
    category: "Luminaire Capacitor",
    title: "Lighting Luminaire Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-7.png",
    summary: "Inbuilt discharge resistor capacitors for street lights and industrial luminaires.",
  },
  {
    slug: "uv-lamp-capacitor",
    date: "06.12.2026",
    category: "Luminaire Capacitor",
    title: "UV Lamp Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-8.png",
    summary: "High-frequency capacitors for UV curing and coating lines.",
  },
  {
    slug: "pfc-cylindrical-capacitor",
    date: "06.02.2026",
    category: "Power Factor Capacitors",
    title: "PFC Cylindrical Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-9.png",
    summary: "IS:13340 heavy-duty cells for APFC panels and grid infrastructure.",
  },
  {
    slug: "capacitor-bank",
    date: "05.26.2026",
    category: "Power Factor Capacitors",
    title: "Capacitor Bank",
    author: "CAPCO Team",
    image: "/figma/products/product-10.png",
    summary: "Panel-ready power-factor correction banks up to 150 KVAR.",
  },
  {
    slug: "customized-capacitor",
    date: "05.12.2026",
    category: "Power Factor Capacitors",
    title: "Customized Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-11.png",
    summary: "Co-engineered electrical, thermal, and mechanical capacitor builds.",
  },
];

export const productCategories = [
  "All",
  "Metalized Polypropylene Film [ MPP ]",
  "Fan Capacitors",
  "Motor Capacitors",
  "Luminaire Capacitor",
  "Power Factor Capacitors",
];

