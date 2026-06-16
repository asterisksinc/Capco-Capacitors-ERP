"use client";

import type { ReactNode } from "react";
import { AccountantTopbar } from "./AccountantTopbar";
import { MobileMenuProvider, useMobileMenu } from "@/components/MobileMenuContext";

function AccountantShellContent({ children }: { children: ReactNode }) {
  // Simpl shell without a sidebar, but keeps the topbar and standard layout
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AccountantTopbar />
      <main className="flex-1 w-full bg-[#FAFAFA]">
        {children}
      </main>
    </div>
  );
}

export function AccountantShell({ children }: { children: ReactNode }) {
  return (
    <MobileMenuProvider>
      <AccountantShellContent>{children}</AccountantShellContent>
    </MobileMenuProvider>
  );
}
