import { SolutionPage } from "@/components/public/SolutionPage";

export default function DealershipSolutionsPage() {
  return (
    <SolutionPage
      data={{
        eyebrow: "Dealership",
        title: "Grow Your Business with Capco Capacitors",
        intro:
          "Join a capacitor brand built for repeat demand across pumps, HVAC, appliances, lighting, and industrial buyers, backed by product availability and sales support.",
        cta: "Apply for Dealership",
        heroImage: "/figma/project-insights-card.png",
        proof: ["Fast-moving range", "Dealer support", "Pan-India demand", "Marketing assets"],
        overviewEyebrow: "Why Dealers Choose Us",
        overviewTitle: "A Brand That Sells Itself",
        overviewBody:
          "CAPCO helps regional dealers grow with a broad catalog, dependable dispatches, technical product support, and documentation that makes selling easier.",
        featureImage: "/figma/project-success-card.png",
        capabilities: ["High-Demand Product Range", "BIS/ISI Certified", "Vertical Integration Advantage", "Pan-India Dealer Network"],
        supportEyebrow: "Dealer Growth System",
        supportTitle: "Everything a Dealer Needs to Move Faster",
        steps: [
          {
            title: "Apply & Verify",
            body: "Share your business details, current territory, product mix, and customer base so the sales team can qualify the fit.",
          },
          {
            title: "Onboard Product Range",
            body: "Get access to high-demand capacitor categories with specs, catalog material, and application guidance.",
          },
          {
            title: "Build Local Demand",
            body: "Use dealer support, product availability, and repeat-use categories to serve contractors, OEM buyers, and service networks.",
          },
          {
            title: "Scale with Supply",
            body: "Plan recurring orders with dispatch support and a manufacturer relationship designed for long-term growth.",
          },
        ],
        darkTitle: "Two offices, one team. Close to the sites we build and the grids we serve.",
        darkCards: [
          {
            image: "/figma/project-catalogs-card.png",
            title: "Delhi NCR",
            body: "Sales coordination, dealer communication, and customer support for North India.",
          },
          {
            image: "/figma/project-insights.png",
            title: "Ankleshwar, Gujarat",
            body: "Manufacturing, operations, quality coordination, and dispatch support.",
          },
          {
            image: "/figma/products/product-5.png",
            title: "Pan-India Reach",
            body: "Dealer-led coverage for electrical, pump, appliance, and industrial capacitor demand.",
          },
        ],
        faqs: [
          "What is the minimum order quantity to start the dealership?",
          "How do I check my GST status?",
          "Can I return unsold inventory?",
          "How do I register a customer for warranty protection?",
          "What if a customer contacts CAPCO Capacitors directly?",
          "How do I request urgent stock during peak season?",
          "Is training provided for new dealers?",
          "Can I sell CAPCO products online or on ecommerce?",
        ],
        footerTitle: "Join 5000+ Successful CAPCO Dealers",
        footerBody:
          "Whether you are a regional distributor or a specialized industrial supplier, CAPCO gives you the range, marketing support, and trusted supply to grow your business profitably.",
        footerButton: "Apply for Dealership",
      }}
    />
  );
}

