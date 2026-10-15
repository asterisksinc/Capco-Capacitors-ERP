import type { Metadata } from "next";
import { OemSolutionView } from "@/components/public/OemSolutionView";

export const metadata: Metadata = {
  title: "OEM Capacitor Solutions | CAPCO",
  description: "Co-engineered capacitor solutions, vertically integrated manufacturing, and dedicated support for equipment manufacturers.",
};

export default function OemSolutionsPage() {
  return <OemSolutionView />;
}
