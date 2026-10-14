import type { Metadata } from "next";
import { SolutionPage } from "@/components/public/SolutionPage";
import { pageMetadata } from "@/lib/seo";

// The updated Figma Dealership frame contains the industrial solutions page.
export const metadata: Metadata = pageMetadata("/industrial-solutions/", "/solutions/dealership/");

export default function DealershipSolutionsPage() {
  return <SolutionPage variant="industrial" />;
}
