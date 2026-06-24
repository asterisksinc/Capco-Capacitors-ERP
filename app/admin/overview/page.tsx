"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { Menu, Bell, User } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function AdminOverviewPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Overview" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Overview</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Overview</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </section>
      
      {/* Empty area as per design */}
      <section className="px-6 py-6">
        {/* Blank content matching overview.png */}
      </section>
    </div>
  );
}
