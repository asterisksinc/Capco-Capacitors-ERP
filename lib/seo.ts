import type { Metadata } from "next";
import { seoMetadata, type SeoPath } from "./seo-metadata";

// Absolute canonicals are emitted only after the production domain is configured.
// This prevents development/preview hosts from becoming canonical URLs.
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
export const siteOrigin = configuredOrigin ? new URL(configuredOrigin).origin : undefined;

export function pageMetadata(path: SeoPath, canonicalPath = path): Metadata {
  const entry = seoMetadata[path];
  const canonical = siteOrigin ? new URL(canonicalPath, siteOrigin).toString() : undefined;

  return {
    title: entry.title,
    description: entry.description,
    keywords: [...entry.keywords],
    robots: { index: entry.indexation === "Index", follow: true },
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      type: "website",
      siteName: "CAPCO Capacitors",
      title: entry.title,
      description: entry.description,
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary",
      title: entry.title,
      description: entry.description,
    },
  };
}
