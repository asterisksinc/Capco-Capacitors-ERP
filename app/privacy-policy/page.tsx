import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/privacy-policy/");

export default function PrivacyPolicyPage() {
  return <LegalPage type="privacy" />;
}
