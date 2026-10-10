import type { Metadata } from "next";
import { SolutionPage } from "@/components/public/SolutionPage";

// The updated Figma Dealership frame contains the industrial solutions page.
export const metadata: Metadata = {
  title: "Industrial Power Factor Correction Solutions | CAPCO",
  description: "Power factor audits, APFC panel integration support, and bulk capacitor supply for industrial buyers.",
};

export default function DealershipSolutionsPage() {
  return <SolutionPage variant="industrial" />;
}
