"use client";

import { useState } from "react";
import { Search, Menu, Bell, User } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function WorkOrderDetailsPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Raw Material");

  const data = [
    { id: "RM-0001", micron: "8", width: "1", quantity: "1", stage: "Metallisation", date: "10/01/2025", status: "Yet to Start" },
    { id: "RM-0002", micron: "12", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "In-progress" },
    { id: "WO-0001", micron: "5", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "Completed" },
    { id: "WO-0001", micron: "15", width: "1", quantity: "1", stage: "Metallisation", date: "10/01/2025", status: "Yet to Start" },
    { id: "WO-0001", micron: "7", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "Completed" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <section className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#EBEBEB] px-4 flex items-center justify-between z-40 md:hidden">
        <button className="p-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>
        <h1 className="text-[16px] font-medium text-[#171717]">Work Orders Overview</h1>
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

      {/* DETAILS GRID */}
      <section className="px-4 md:px-6 py-6 border-b border-[#EBEBEB]">
        <h2 className="text-[18px] font-semibold text-[#171717] mb-6">Work Orders Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Word Count</span>
            <span className="text-[15px] font-medium text-[#171717]">4,200 words</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Micron</span>
            <span className="text-[15px] font-medium text-[#171717]">8</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Width</span>
            <span className="text-[15px] font-medium text-[#171717]">1</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Quantity</span>
            <span className="text-[15px] font-medium text-[#171717]">1</span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Manager</span>
            <span className="text-[15px] font-medium text-[#171717]">Kristin Watson</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Stage</span>
            <span className="text-[15px] font-medium text-[#171717]">Metallisation</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Date</span>
            <span className="text-[15px] font-medium text-[#171717]">10/01/2025</span>
          </div>
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[13px] text-[#5C5C5C]">Status</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">
              Yet to Start
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-6 py-6 flex-1 flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <div className="flex items-center bg-[#F5F7FA] p-1 rounded-[8px] w-full md:w-auto">
            {["Raw Material", "Mettalisation", "Slitting"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-2 text-[14px] font-medium rounded-[6px] transition-colors ${
                  activeTab === tab
                    ? "bg-[#00B6E2] text-white shadow-sm"
                    : "text-[#5C5C5C] hover:text-[#171717] hover:bg-[#EBEBEB]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Raw Material ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Micron</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Width</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Quantity</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Stage</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Date</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.id}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.quantity}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.stage}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                    <td className="px-6 py-4">
                      {row.status === "Yet to Start" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                          Yet to Start
                        </span>
                      )}
                      {row.status === "In-progress" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium whitespace-nowrap">
                          In-progress
                        </span>
                      )}
                      {row.status === "Completed" && (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium whitespace-nowrap">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
