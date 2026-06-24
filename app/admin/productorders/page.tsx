"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState } from "react";
import { Search, Download, Filter, Menu, Bell, User, QrCode } from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import Link from "next/link";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function ProductOrdersPage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [qrId, setQrId] = useState<string | null>(null);

  const data = [
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Kristin Watson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Eleanor Pena", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Eleanor Pena", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Guy Hawkins", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Jenny Wilson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Michael Brown", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Emma Johnson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Product Orders" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Product Orders</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Product Orders</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          {[
            { label: "Lorem ipsum dolor", value: "124", subtext: "5% vs Last Month", subColor: "text-[#1CB061]" },
            { label: "Lorem ipsum dolor", value: "42", subtext: "Stable", subColor: "text-[#5C5C5C]" },
            { label: "Revision Requests", value: "15", subtext: "+0.2% vs Last Month", subColor: "text-[#1CB061]" },
            { label: "Lorem ipsum dolor", value: "08", subtext: "Critical", subColor: "text-[#FB3748]" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 md:border-r border-[#EBEBEB] last:border-0 pb-3 md:pb-0 md:pl-6 first:pl-0">
              <div className="flex flex-col gap-1">
                <p className="text-[13px] text-[#5C5C5C]">{item.label}</p>
                <span className="text-[24px] font-semibold text-[#171717]">{item.value}</span>
              </div>
              <span className={`text-[12px] font-medium ${item.subColor} md:mt-1`}>
                {item.subtext}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-6 pb-6 flex-1 flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search by Product Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="h-[44px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#F0FDFF]">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="h-[44px] px-4 bg-[#00B6E2] border border-[#00B6E2] text-white rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#00A0E3]">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Order ID</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Product Code</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Capacitor Type</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Grade</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Batch Size</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Manager</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Stage</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Created Timestamp</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.id}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.code}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.type}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.grade}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.batch}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.manager}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium whitespace-nowrap">
                        {row.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/productorders/${row.id.replace('#', '')}`}
                          className="inline-flex items-center justify-center h-8 px-4 bg-[#00B6E2] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#00A0E3] transition-colors"
                        >
                          View
                        </Link>
                        <button onClick={() => setQrId(row.id.replace('#', ''))} className="text-[#5C5C5C] hover:text-[#00B6E2] transition-colors">
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#EBEBEB] flex items-center justify-between">
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
      {qrId && <QRCodeModal id={qrId} onClose={() => setQrId(null)} />}
    </div>
  );
}
