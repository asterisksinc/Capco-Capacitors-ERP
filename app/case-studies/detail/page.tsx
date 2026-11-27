import { redirect } from "next/navigation";
import { caseStudies } from "@/lib/caseStudies";

// Old placeholder detail URL: send visitors to the first real case study.
export default function LegacyCaseStudyDetail() {
  redirect(`/case-studies/${caseStudies[0].slug}`);
}
