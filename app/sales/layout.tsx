import { SalesShell } from "@/components/sales/SalesShell";
import type { ReactNode } from "react";

export default function SalesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SalesShell>{children}</SalesShell>;
}
