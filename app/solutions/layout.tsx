import type { CSSProperties } from "react";

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ "--font-solutions": "var(--font-geist)", "--font-solutions-mono": "var(--font-geist)" } as CSSProperties}>{children}</div>;
}
