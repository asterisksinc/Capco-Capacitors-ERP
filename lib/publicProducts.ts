export type PublicProduct = {
  slug: string;
  date: string;
  category: string;
  tagLabel?: string;
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
    tagLabel: "METALIZED POLYPROPYLENE FILM [ MPP ]",
    title: "Zinc/Aluminium Alloy Metalized BOPP Film",
    author: "Russell Gold",
    image: "/figma/products/cards/zinc-aluminium-alloy-metalised-bopp-film.jpg",
    summary: "In-house Leybold-metallized BOPP film engineered for self-healing, high-voltage capacitor applications with superior volumetric efficiency.",
  },
  {
    slug: "fan-capacitor",
    date: "08.02.2026",
    category: "Fan Capacitors",
    tagLabel: "FAN CAPACITOR",
    title: "Fan Capacitor",
    author: "Russell Gold",
    image: "/figma/products/cards/fan-capacitor.jpg",
    summary: "Dry/oil-filled fan capacitors (0.5–10 MFD) designed for stable torque, energy efficiency, and extended motor life in residential and industrial fans.",
  },
  {
    slug: "motor-run-capacitor",
    date: "07.27.2026",
    category: "Motor Capacitors",
    tagLabel: "MOTOR CAPACITOR",
    title: "Motor Run Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/cards/motor-run-capacitor.jpg",
    summary: "Dry-type motor run capacitors (0.5–432 MFD) engineered for sustained torque, energy efficiency, and extended motor lifespan in demanding AC applications.",
  },
  {
    slug: "motor-start-capacitor",
    date: "07.27.2026",
    category: "Motor Capacitors",
    title: "Motor Start Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/cards/motor-start-capacitor.jpg",
    summary: "Dry electrolytic motor start capacitors (40–500 MFD) engineered for maximum starting torque, rapid motor ignition, and extended service life in demanding applications.",
  },
  {
    slug: "submersible-panel-capacitor",
    date: "07.13.2026",
    category: "Motor Capacitors",
    title: "Submersible Panel Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/cards/submersible-panel-capacitor.jpg",
    summary: "Dry-type submersible panel capacitors (10–120 MFD) engineered for heat resistance, moisture protection, and sustained motor efficiency in underground pump installations.",
  },
  {
    slug: "ac-refrigeration-washing-machine-capacitor",
    date: "06.30.2026",
    category: "Fan Capacitors",
    title: "A.C. / Refrigeration / Washing Machine Capacitor",
    author: "Dan Barcelo",
    image: "/figma/products/cards/ac-refrigeration-washing-machine-capacitor.jpg",
    summary: "P2 safety-equipped capacitors for air conditioners, refrigerators, and washing machines—delivering burst-proof reliability, self-healing performance, and enhanced motor efficiency.",
  },
  {
    slug: "lighting-luminaire-capacitor",
    date: "06.18.2026",
    category: "Luminaire Capacitor",
    title: "Lighting Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-7.png",
    summary: "Dry-type lighting capacitors (1–45 MFD) with inbuilt discharge resistors, engineered for long-life operation and heat resistance in municipal and industrial lighting applications.",
  },
  {
    slug: "uv-lamp-capacitor",
    date: "06.12.2026",
    category: "Luminaire Capacitor",
    title: "UV Lamp Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/product-8.png",
    summary: "Dry/oil-filled UV lamp capacitors engineered for high-frequency operation, superior heat dissipation, and reliable performance in UV curing systems up to 4000V AC.",
  },
  {
    slug: "pfc-cylindrical-capacitor",
    date: "06.02.2026",
    category: "Power Factor Capacitors",
    title: "PFC Cylindrical Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/cards/pfc-cylindrical-capacitor.jpg",
    summary: "P2 safety-equipped cylindrical capacitors (0.5–25 KVAR) designed for burst-proof operation, power factor maintenance, and enhanced electrical system stability in low-tension networks.",
  },
  {
    slug: "pfc-box-type-capacitor",
    date: "06.01.2026",
    category: "Power Factor Capacitors",
    title: "Box Type Capacitor",
    author: "CAPCO Team",
    image: "/figma/products/cards/pfc-box-type-capacitor.jpg",
    summary: "Box type capacitors designed for power factor maintenance, reactive power compensation and enhanced electrical system stability in low-tension networks.",
  },
  {
    slug: "capacitor-bank",
    date: "05.26.2026",
    category: "Power Factor Capacitors",
    title: "Capacitor Bank",
    author: "CAPCO Team",
    image: "/figma/products/cards/capacitor-bank.jpg",
    summary: "Capacitor banks designed for power factor maintenance, reactive power compensation and enhanced electrical system stability in industrial and commercial low-tension networks.",
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

