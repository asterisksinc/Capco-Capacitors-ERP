import { SolutionPage } from "@/components/public/SolutionPage";

export default function OemSolutionsPage() {
  return (
    <SolutionPage
      data={{
        eyebrow: "OEM",
        title: "Your Strategic Capacitor Partner",
        intro:
          "Joint development support for equipment manufacturers, with capacitor design, testing, documentation, and reliable production capacity aligned to your launch schedules.",
        cta: "Schedule Technical Consultation",
        heroImage: "/figma/project-catalogs.png",
        proof: ["ISO-led process", "BIS / ISI support", "Custom ratings", "Fast development"],
        overviewEyebrow: "Built for Equipment Manufacturers",
        overviewTitle: "Built for Equipment Manufacturers",
        overviewBody:
          "CAPCO partners with HVAC, pump, appliance, lighting, and industrial OEM teams to convert electrical requirements into dependable capacitor programs with repeatable quality.",
        featureImage: "/figma/products/product-1.png",
        capabilities: ["Custom Re-engineering", "Terminal & Housing Configuration", "Prototype & Testing", "Technical Documentation"],
        supportEyebrow: "Dedicated Development Process",
        supportTitle: "Dedicated Support for Production Success",
        steps: [
          {
            title: "Application Discovery",
            body: "We map operating voltage, duty cycle, enclosure limits, thermal stress, and certification targets before recommending a capacitor build.",
          },
          {
            title: "Design & Prototyping",
            body: "Engineering teams tune capacitance, terminals, housing, dielectric construction, and protection features for your equipment platform.",
          },
          {
            title: "Validation & Tests",
            body: "Samples are verified against electrical, insulation, endurance, and fitment requirements before production approval.",
          },
          {
            title: "Mass Production",
            body: "Approved programs move into planned batch manufacturing with documentation, packing, and dispatch support for your assembly line.",
          },
        ],
        darkTitle: "Start Your OEM Journey with Capco Capacitors",
        darkCards: [
          {
            image: "/figma/products/product-2.png",
            title: "Technical Collaboration",
            body: "Engineering assistance for selection, replacement, fitment, and qualification files.",
          },
          {
            image: "/figma/products/product-3.png",
            title: "Reliable Lead Times",
            body: "Capacity planning and production visibility for program launches and repeat orders.",
          },
          {
            image: "/figma/products/product-4.png",
            title: "Quality Assurance",
            body: "Batch controls, dielectric checks, and documentation for procurement and compliance teams.",
          },
        ],
        faqs: [
          "What is the minimum order quantity for OEM customers?",
          "Can you match capacitors from other manufacturers?",
          "What is the typical lead time for custom capacitor development?",
          "Do you provide technical documentation for our compliance files?",
          "Can CAPCO support JIT delivery for our assembly lines?",
          "What industries do you currently serve as an OEM partner?",
        ],
        footerTitle: "Ready to Partner?",
        footerBody:
          "Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements.",
        footerButton: "Request Partnership",
      }}
    />
  );
}

