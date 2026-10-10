import { Geist, Spline_Sans_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-solutions", weight: ["300", "400", "500", "600", "700"] });
const mono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--font-solutions-mono", weight: "400" });

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} ${mono.variable}`}>{children}</div>;
}
