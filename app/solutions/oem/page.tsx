import type { Metadata } from "next";
import { SolutionPage } from "@/components/public/SolutionPage";

export const metadata: Metadata = {
  title: "OEM Capacitor Solutions | CAPCO",
  description: "Co-engineered capacitor solutions, vertically integrated manufacturing, and dedicated support for equipment manufacturers.",
};

export default function OemSolutionsPage() {
  return <SolutionPage variant="oem" />;
}
