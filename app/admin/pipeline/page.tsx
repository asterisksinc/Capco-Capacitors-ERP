"use client";
import { MobileHeader } from "@/components/MobileHeader";

import { useState } from "react";
import { Search, Download, Filter, ChevronDown, Menu, Bell, User as UserIcon, Calendar } from "lucide-react";
import Link from "next/link";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function PipelinePage() {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [listType, setListType] = useState<"product" | "work">("work");
  const [searchQuery, setSearchQuery] = useState("");

  const kanbanColumns = [
    {
      title: "Metallisation",
      count: 2,
      cards: [
        { id: "WO-0001", status: "Yet to Start", micron: "8", width: "1", qty: "1", date: "10/01/2025", statusColor: "", statusBg: "", isPO: false as const },
        { id: "WO-0003", status: "In-progress", micron: "8", width: "1", qty: "1", date: "10/01/2025", statusColor: "text-[#E19242]", statusBg: "bg-[#FFF4ED]", isPO: false as const }
      ]
    },
    {
      title: "Slitting",
      count: 1,
      cards: [
        { id: "WO-0002", status: "Completed", micron: "8", width: "1", qty: "1", date: "10/01/2025", statusColor: "text-[#1CB061]", statusBg: "bg-[#E8F8F0]", isPO: false as const }
      ]
    },
    {
      title: "Winding",
      count: 1,
      cards: [
        { id: "#PO-CC-4567", status: "Yet to Start", isPO: true as const, code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", qty: "1", date: "19/03/2026", statusColor: "", statusBg: "" }
      ]
    },
    {
      title: "Spray",
      count: 1,
      cards: [
        { id: "#PO-CC-4568", status: "In-progress", isPO: true as const, code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", qty: "1", date: "19/03/2026", statusColor: "text-[#E19242]", statusBg: "bg-[#FFF4ED]" }
      ]
    }
  ];

  const productOrdersList = [
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Kristin Watson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Eleanor Pena", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Eleanor Pena", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Guy Hawkins", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Jenny Wilson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Michael Brown", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
    { id: "#PO-CC-4567", code: "C-450V-100uF", type: "Motor", grade: "AA", batch: "5000", manager: "Emma Johnson", status: "Yet to Start", stage: "Yet to Start", date: "19/03/2026:01:55:26" },
  ];

  const workOrdersList = [
    { id: "WO-0001", micron: "8", width: "1", quantity: "1", stage: "Metallisation", date: "10/01/2025", status: "Yet to Start", statusColor: "", statusBg: "" },
    { id: "WO-0001", micron: "12", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "In-progress", statusColor: "text-[#E19242]", statusBg: "bg-[#FFF4ED]" },
    { id: "WO-0001", micron: "5", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "Completed", statusColor: "text-[#1CB061]", statusBg: "bg-[#E8F8F0]" },
    { id: "WO-0001", micron: "15", width: "1", quantity: "1", stage: "Metallisation", date: "10/01/2025", status: "Yet to Start", statusColor: "", statusBg: "" },
    { id: "WO-0001", micron: "7", width: "1", quantity: "1", stage: "Slitting", date: "10/01/2025", status: "Completed", statusColor: "text-[#1CB061]", statusBg: "bg-[#E8F8F0]" },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col w-full max-w-full relative">
      {/* MOBILE TOP NAVIGATION BAR */}
      <MobileHeader title="Pipeline" />

      {/* MOBILE HEADER SPACER */}
      <div className="h-14 md:hidden"></div>

      {/* DESKTOP HEADER */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-6 flex flex-col">
          <h1 className="text-[20px] font-semibold text-[#171717]">Pipeline</h1>
          <p className="text-[14px] text-[#5C5C5C] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Pipeline</h1>
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
            { label: "Lorem ipsum dolor", value: "15", subtext: "+0.2% vs Last Month", subColor: "text-[#1CB061]" },
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
        {/* VIEW TOGGLE & TOOLBAR */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center bg-[#F5F7FA] p-1 rounded-[8px] w-full md:w-[200px]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex-1 px-4 py-2 text-[14px] font-medium rounded-[6px] transition-colors ${
                viewMode === "kanban" ? "bg-[#00B6E2] text-white shadow-sm" : "text-[#5C5C5C] hover:text-[#171717]"
              }`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2 text-[14px] font-medium rounded-[6px] transition-colors ${
                viewMode === "list" ? "bg-[#00B6E2] text-white shadow-sm" : "text-[#5C5C5C] hover:text-[#171717]"
              }`}
            >
              List View
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-[400px]">
              <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search by Product Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[44px] w-full pl-10 pr-4 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#00B6E2]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {viewMode === "list" && (
                <div className="relative w-[160px] hidden md:block">
                  <select 
                    value={listType}
                    onChange={(e) => setListType(e.target.value as "product" | "work")}
                    className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]"
                  >
                    <option value="work">Work Orders</option>
                    <option value="product">Product Orders</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
              
              <div className="relative w-[130px] hidden md:block">
                <select className="h-[44px] w-full appearance-none bg-white border border-[#EBEBEB] rounded-[8px] px-4 pr-10 text-[14px] text-[#171717] focus:outline-none focus:border-[#00B6E2]">
                  <option value="sort">Sort by</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#5C5C5C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              
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
        </div>

        {/* CONTENT AREA */}
        {viewMode === "kanban" ? (
          /* KANBAN BOARD */
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
            {kanbanColumns.map((col) => (
              <div key={col.title} className="w-[340px] flex-shrink-0 bg-[#F9FAFB] border border-[#EBEBEB] rounded-[12px] flex flex-col max-h-[700px]">
                <div className="px-5 py-4 flex items-center justify-between border-b border-[#EBEBEB] bg-[#F9FAFB] rounded-t-[12px]">
                  <span className="text-[16px] font-semibold text-[#171717]">{col.title}</span>
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#EAEFF4] text-[13px] font-medium text-[#5C5C5C]">
                    {col.count}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                  {col.cards.map((card, idx) => (
                    <div key={idx} className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 flex flex-col shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[14px] font-medium text-[#171717]">{card.id}</span>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-[12px] text-[12px] font-medium ${card.statusBg || "bg-[#FFF0F1]"} ${card.statusColor || "text-[#FB3748]"}`}>
                          {card.status}
                        </span>
                      </div>
                      
                      {card.isPO ? (
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#5C5C5C]">{card.code}</span>
                            <span className="text-[#171717] font-medium">Grade: {card.grade}</span>
                            <span className="text-[#171717] font-medium">Quantity: {card.qty}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#171717] font-medium">{card.type}</span>
                            <span className="text-[#171717] font-medium">Batch Size: {card.batch}</span>
                            <div className="flex items-center gap-1.5 mt-auto">
                              <Calendar className="w-3.5 h-3.5 text-[#5C5C5C]" />
                              <span className="text-[#171717]">{card.date}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#5C5C5C]">Micron: <span className="text-[#171717] font-medium">{card.micron}</span></span>
                            <span className="text-[#5C5C5C]">Quantity: <span className="text-[#171717] font-medium">{card.qty}</span></span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#5C5C5C]">Width: <span className="text-[#171717] font-medium">{card.width}</span></span>
                            <div className="flex items-center gap-1.5 mt-auto">
                              <Calendar className="w-3.5 h-3.5 text-[#5C5C5C]" />
                              <span className="text-[#171717]">{card.date}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#EBEBEB] bg-[#F9FAFB]">
                    {listType === "product" ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Work Orders ID</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Micron</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Width</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Quantity</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Stage</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Date</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Status</th>
                        <th className="px-6 py-4 text-[13px] font-semibold text-[#171717]">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {listType === "product" ? (
                    productOrdersList.map((row, idx) => (
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
                          <Link
                            href={`/admin/productorders/${row.id.replace('#', '')}`}
                            className="inline-flex items-center justify-center h-8 px-4 bg-[#00B6E2] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#00A0E3] transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    workOrdersList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.quantity}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.stage}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-[12px] text-[12px] font-medium whitespace-nowrap ${row.statusBg || "bg-[#FFF0F1]"} ${row.statusColor || "text-[#FB3748]"}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/workorders/${row.id}`}
                            className="inline-flex items-center justify-center h-8 px-4 bg-[#00B6E2] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#00A0E3] transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
