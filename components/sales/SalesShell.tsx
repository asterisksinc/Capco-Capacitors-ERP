"use client";

import type { ReactNode } from "react";
import { SalesSidebar } from "./SalesSidebar";
import { SalesTopbar } from "./SalesTopbar";

export function SalesShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SalesSidebar />
      <div className="flex-1 ml-[0px] md:ml-[280px] flex flex-col min-h-screen bg-[#FFFFFF]">
        <SalesTopbar />
        <main className="flex-1 w-full p-8 font-dm-sans">
          {children}
        </main>
      </div>
    </>
  );
}
