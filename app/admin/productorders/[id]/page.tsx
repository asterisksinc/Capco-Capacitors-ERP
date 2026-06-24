"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState } from "react";
import { Search, ChevronDown, Menu, Bell, User } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";
import { useParams } from "next/navigation";

export default function ProductOrderDetailsPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const params = useParams();
  const id = params.id as string;
  const displayId = id.startsWith("PO-CC") ? `#${id}` : id;

  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    { stockId: "PM-0001", weight: "58.5kgs", width: "4.5", micron: "6.5", grade: "A", status: "Pending" },
    { stockId: "PM-0001", weight: "58.5kgs", width: "4.5", micron: "6.5", grade: "A", status: "Approved" },
    { stockId: "PM-0001", weight: "58.5kgs", width: "4.5", micron: "6.5", grade: "A", status: "Pending" },
    { stockId: "PM-0001", weight: "58.5kgs", width: "4.5", micron: "6.5", grade: "A", status: "Pending" },
    { stockId: "PM-0001", weight: "58.5kgs", width: "4.5", micron: "6.5", grade: "A", status: "Approved" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Product Order Details" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DETAILS GRID */}
      <section className="px-4 md:px-6 py-6 border-b border-[#EBEBEB]">
        <h2 className="text-[18px] font-semibold text-[#171717] mb-6">Product Order Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-8 gap-x-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Order ID</span>
            <span className="text-[15px] font-medium text-[#171717]">#PO-CC-4567</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Product Code</span>
            <span className="text-[15px] font-medium text-[#171717]">C-450V-100uF</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Capacitor Type</span>
            <span className="text-[15px] font-medium text-[#171717]">Motor</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Grade</span>
            <span className="text-[15px] font-medium text-[#171717]">AA</span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Batch Size</span>
            <span className="text-[15px] font-medium text-[#171717]">5000</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] text-[#5C5C5C]">Manager</span>
            <span className="text-[15px] font-medium text-[#171717]">Kristin Watson</span>
          </div>
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[13px] text-[#5C5C5C]">Status</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">
              Yet to Start
            </span>
          </div>
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[13px] text-[#5C5C5C]">Stage</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-[12px] bg-[#E6F8FC] text-[#00B6E2] text-[12px] font-medium">
              Winding
            </span>
          </div>
          
          <div className="flex flex-col gap-1.5 col-span-2 md:col-span-4">
            <span className="text-[13px] text-[#5C5C5C]">Created Timestamp</span>
            <span className="text-[15px] font-medium text-[#171717]">19/03/2026:01:55:26</span>
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

          <div className="relative w-full md:w-[140px]">
            <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
              <option value="all">All</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">STOCK ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Weight</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Width</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Micron</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Grade</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.stockId}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.weight}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.grade}</td>
                    <td className="px-6 py-4">
                      {row.status === "Pending" ? (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium whitespace-nowrap">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium whitespace-nowrap">
                          Approved
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
