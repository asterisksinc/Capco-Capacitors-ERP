import { StoreHeadShell } from "@/components/store-head/StoreHeadShell";
import type { ReactNode } from "react";

export default function StoreHeadLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <StoreHeadShell>{children}</StoreHeadShell>;
}
