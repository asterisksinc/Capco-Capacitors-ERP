import type { Metadata } from "next";
import { IndustrialEnquirySolutionView } from "@/components/public/IndustrialEnquirySolutionView";

export const metadata: Metadata = {
  title: "Industrial Power Factor Correction Solutions | CAPCO",
  description:
    "CAPCO provides power factor audits, APFC panel integration support, and bulk capacitor supply (0.5–25 KVAR, up to 150 KVAR banks) for industrial facilities.",
};

export default function IndustrialEnquiryPage() {
  return <IndustrialEnquirySolutionView />;
}
