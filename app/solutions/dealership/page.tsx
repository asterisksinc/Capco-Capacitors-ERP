import type { Metadata } from "next";
import { DealershipSolutionView } from "@/components/public/DealershipSolutionView";

export const metadata: Metadata = {
  title: "Dealership Solutions | CAPCO Capacitors",
  description:
    "Join India's most trusted capacitor dealer network: competitive margins, co-branded marketing support, and 30+ years of brand equity behind every sale.",
};

export default function DealershipSolutionsPage() {
  return <DealershipSolutionView />;
}
