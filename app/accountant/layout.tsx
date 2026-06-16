import { AccountantShell } from "@/components/accountant/AccountantShell";
import type { ReactNode } from "react";

export default function AccountantLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountantShell>{children}</AccountantShell>;
}
