"use client";

import { Menu, Bell, User } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function AdminOverviewPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <section className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#EBEBEB] px-4 flex items-center justify-between z-40 md:hidden">
        <button className="p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>
        <h1 className="text-[16px] font-medium text-[#171717]">Overview</h1>
        <div className="flex items-center gap-3">
          <button className="p-2">
            <Bell className="w-5 h-5 text-[#171717]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center">
            <User className="w-4 h-4 text-[#5C5C5C]" />
          </div>
        </div>
      </section>

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
