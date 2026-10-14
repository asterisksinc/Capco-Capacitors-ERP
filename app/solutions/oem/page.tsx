import type { Metadata } from "next";
import { SolutionPage } from "@/components/public/SolutionPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/oem-solutions/", "/solutions/oem/");

export default function OemSolutionsPage() {
  return <SolutionPage variant="oem" />;
}
