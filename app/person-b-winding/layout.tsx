import { PersonBShell } from "@/components/person-b/PersonBShell";
import type { ReactNode } from "react";

export default function WindingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PersonBShell>{children}</PersonBShell>;
}
