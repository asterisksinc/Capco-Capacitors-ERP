"use client";

import type { ReactNode } from "react";

import { StoreHeadSidebar } from "./StoreHeadSidebar";
import { StoreHeadTopbar } from "./StoreHeadTopbar";

export function StoreHeadShell({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHeadSidebar />
      <div className="flex-1 ml-[0px] md:ml-[260px] flex flex-col min-h-screen">
        <StoreHeadTopbar />
        <main className="flex-1 w-full bg-[#FAFAFA]">
          {children}
        </main>
      </div>
    </>
  );
}
