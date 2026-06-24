"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState } from "react";
import { Search, Download, Menu, Bell, User as UserIcon } from "lucide-react";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function FinishedGoodsPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");

  const data = [
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "429", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "738", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "583", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "600", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "274", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "154", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
    { orderId: "#PO-CC-4567", productCode: "C-450V-100uF", productName: "Lorem ipsum", quantity: "185", grade: "AA", lastUpdated: "19/03/2026:01:55:26" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full relative">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Finished Goods" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Finished Goods</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Real-time stock of quality-cleared production items ready for dispatch.
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 pb-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Finished Goods</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Real-time stock of quality-cleared production items ready for dispatch.
        </p>
      </section>

      <section className="px-4 md:px-6 py-6 flex-1 flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <button className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3] self-start md:self-auto">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Order ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Product Code</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Product Name</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Quantity</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Grade</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Last Updated Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.orderId}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.productCode}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.productName}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.quantity}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.grade}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#EBEBEB] flex items-center justify-between mt-auto">
            <span className="text-[14px] text-[#5C5C5C]">
              Showing <span className="font-semibold text-[#171717]">6</span> of <span className="font-semibold text-[#171717]">12</span> documents
            </span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded-[6px] text-[#5C5C5C] hover:bg-[#F9FAFB]">
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#00B6E2] bg-[#00B6E2] text-white rounded-[6px] text-[14px] font-medium">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] bg-white text-[#171717] rounded-[6px] text-[14px] font-medium hover:bg-[#F9FAFB]">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#EBEBEB] rounded-[6px] text-[#5C5C5C] hover:bg-[#F9FAFB]">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
