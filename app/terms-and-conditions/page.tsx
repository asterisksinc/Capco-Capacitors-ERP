import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/terms-conditions/", "/terms-and-conditions/");

export default function TermsAndConditionsPage() {
  return <LegalPage type="terms" />;
}
