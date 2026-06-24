"use client";

import { useState, useMemo } from "react";
import { Search, Download, Filter, ChevronDown, Calendar } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/hooks/useStore";
import { MobileHeader } from "@/components/MobileHeader";
import { computeWorkflowProgress } from "../../../lib/data";

export default function PipelinePage() {
  const { store, mounted } = useStore();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [listType, setListType] = useState<"product" | "work">("work");
  const [searchQuery, setSearchQuery] = useState("");

  const kanbanColumns = useMemo(() => {
    if (!mounted) return [];
    
    // Metallisation Stage
    const metallisationCards = store.workOrders.map(wo => {
      const flow = store.flowDataMap[wo.id];
      const progress = computeWorkflowProgress(flow);
      return { id: wo.id, status: progress.status, micron: wo.micron, width: wo.width, qty: wo.qty, date: wo.date, stage: progress.stage, isPO: false as const };
    }).filter(c => c.stage === "Raw Material" || c.stage === "Metallisation");

    // Slitting Stage
    const slittingCards = store.workOrders.map(wo => {
      const flow = store.flowDataMap[wo.id];
      const progress = computeWorkflowProgress(flow);
      return { id: wo.id, status: progress.status, micron: wo.micron, width: wo.width, qty: wo.qty, date: wo.date, stage: progress.stage, isPO: false as const };
    }).filter(c => c.stage === "Slitting");

    // Winding Stage
    const windingCards = store.productOrders.filter(po => {
      return po.stage === "Yet to Start" || po.stage === "Raw Material" || po.stage === "Metallisation" || po.stage === "Slitting" || po.stage === "Winding";
    }).map(po => ({
      id: po.id,
      status: po.status,
      isPO: true as const,
      code: po.code,
      type: po.type,
      grade: po.grade,
      batch: po.batchSize,
      qty: po.batchSize,
      date: po.timestamp.split(':')[0]
    }));

    // Spray Stage
    const sprayCards = store.productOrders.filter(po => {
      return po.stage === "Spray" || po.stage === "Completed";
    }).map(po => ({
      id: po.id,
      status: po.status,
      isPO: true as const,
      code: po.code,
      type: po.type,
      grade: po.grade,
      batch: po.batchSize,
      qty: po.batchSize,
      date: po.timestamp.split(':')[0]
    }));

    return [
      {
        title: "Metallisation",
        count: metallisationCards.length,
        cards: metallisationCards.map(c => ({
          ...c,
          statusColor: c.status === "Completed" ? "text-[#1CB061]" : c.status === "In-progress" ? "text-[#E19242]" : "text-[#FB3748]",
          statusBg: c.status === "Completed" ? "bg-[#E8F8F0]" : c.status === "In-progress" ? "bg-[#FFF4ED]" : "bg-[#FFF0F1]"
        }))
      },
      {
        title: "Slitting",
        count: slittingCards.length,
        cards: slittingCards.map(c => ({
          ...c,
          statusColor: c.status === "Completed" ? "text-[#1CB061]" : c.status === "In-progress" ? "text-[#E19242]" : "text-[#FB3748]",
          statusBg: c.status === "Completed" ? "bg-[#E8F8F0]" : c.status === "In-progress" ? "bg-[#FFF4ED]" : "bg-[#FFF0F1]"
        }))
      },
      {
        title: "Winding",
        count: windingCards.length,
        cards: windingCards.map(c => ({
          ...c,
          statusColor: c.status === "Completed" ? "text-[#1CB061]" : c.status === "In-progress" ? "text-[#E19242]" : "text-[#FB3748]",
          statusBg: c.status === "Completed" ? "bg-[#E8F8F0]" : c.status === "In-progress" ? "bg-[#FFF4ED]" : "bg-[#FFF0F1]"
        }))
      },
      {
        title: "Spray",
        count: sprayCards.length,
        cards: sprayCards.map(c => ({
          ...c,
          statusColor: c.status === "Completed" ? "text-[#1CB061]" : c.status === "In-progress" ? "text-[#E19242]" : "text-[#FB3748]",
          statusBg: c.status === "Completed" ? "bg-[#E8F8F0]" : c.status === "In-progress" ? "bg-[#FFF4ED]" : "bg-[#FFF0F1]"
        }))
      }
    ];
  }, [store, mounted]);

  const workOrdersList = useMemo(() => {
    if (!mounted) return [];
    return store.workOrders.map(wo => {
      const flow = store.flowDataMap[wo.id];
      const progress = computeWorkflowProgress(flow);
      return {
        id: wo.id,
        micron: wo.micron,
        width: wo.width,
        quantity: wo.qty,
        stage: progress.stage,
        date: wo.date,
        status: progress.status,
        statusColor: progress.status === "Completed" ? "text-[#1CB061]" : progress.status === "In-progress" ? "text-[#E19242]" : "text-[#FB3748]",
        statusBg: progress.status === "Completed" ? "bg-[#E8F8F0]" : progress.status === "In-progress" ? "bg-[#FFF4ED]" : "bg-[#FFF0F1]"
      };
    }).filter(row => {
      if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [store, mounted, searchQuery]);

  const productOrdersList = useMemo(() => {
    if (!mounted) return [];
    return store.productOrders.map(po => ({
      id: po.id,
      code: po.code,
      type: po.type,
      grade: po.grade,
      batch: po.batchSize,
      status: po.status,
      stage: po.stage,
      date: po.timestamp
    })).filter(row => {
      const search = searchQuery.toLowerCase();
      if (searchQuery && !row.id.toLowerCase().includes(search) && !row.code.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [store, mounted, searchQuery]);

  const totalWos = store.workOrders.length;
  const totalPos = store.productOrders.length;
  const inProgressCount = useMemo(() => {
    if (!mounted) return 0;
    const activeWos = store.workOrders.filter(w => {
      const flow = store.flowDataMap[w.id];
      return computeWorkflowProgress(flow).status === "In-progress";
    }).length;
    const activePos = store.productOrders.filter(p => p.status === "In-progress").length;
    return activeWos + activePos;
  }, [store, mounted]);

  const kpiStats = [
    { label: "Active Work Orders", value: String(totalWos), subtext: "Live floor execution", subColor: "text-[#00B6E2]" },
    { label: "Active Product Orders", value: String(totalPos), subtext: "Client demands", subColor: "text-[#1CB061]" },
    { label: "In-Progress Stages", value: String(inProgressCount), subtext: "Under active processing", subColor: "text-[#E19242]" },
  ];

  if (!mounted) return null;

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
            Visual workflow pipeline of all orders across the floor
          </p>
        </div>
      </section>

      {/* MOBILE PAGE TITLE */}
      <section className="px-4 pt-4 sm:hidden">
        <h1 className="text-[16px] font-medium text-[#171717]">Pipeline</h1>
        <p className="text-[12px] text-[#5C5C5C] mt-1">
          Visual workflow pipeline of all orders across the floor
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
          {kpiStats.map((item, i) => (
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
              <Search className="w-5 h-5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                placeholder={listType === "work" ? "Search by Work Order ID..." : "Search by PO ID or Code..."}
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
              
              <button className="h-[44px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] rounded-[8px] flex items-center gap-2 text-[14px] font-medium transition-colors hover:bg-[#F0FDFF]">
                <Download className="w-4 h-4" />
                Export
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
                            <span className="text-[#5C5C5C] font-semibold">{card.code}</span>
                            <span className="text-[#5C5C5C]">Grade: <span className="text-[#171717] font-medium">{card.grade}</span></span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#5C5C5C]">{card.type}</span>
                            <span className="text-[#5C5C5C]">Batch: <span className="text-[#171717] font-medium">{card.batch}</span></span>
                            <div className="flex items-center gap-1.5 mt-auto pt-2">
                              <Calendar className="w-3.5 h-3.5 text-[#5C5C5C]" />
                              <span className="text-[#171717] text-[11px]">{card.date}</span>
                            </div>
                          </div>
                          <div className="col-span-2 pt-3 border-t border-[#EAECF0]">
                            <Link href={`/admin/productorders/${card.id.replace('#', '')}`} className="text-[12px] text-[#00B6E2] hover:underline font-semibold">
                              View details &rarr;
                            </Link>
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
                            <div className="flex items-center gap-1.5 mt-auto pt-2">
                              <Calendar className="w-3.5 h-3.5 text-[#5C5C5C]" />
                              <span className="text-[#171717] text-[11px]">{card.date}</span>
                            </div>
                          </div>
                          <div className="col-span-2 pt-3 border-t border-[#EAECF0]">
                            <Link href={`/admin/workorders/${card.id}`} className="text-[12px] text-[#00B6E2] hover:underline font-semibold">
                              View details &rarr;
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {col.cards.length === 0 && (
                    <p className="text-[13px] text-[#5C5C5C] text-center py-6">No active cards</p>
                  )}
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
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C] font-semibold">{row.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.code}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.type}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.grade}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.batch}</td>
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
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-0.5 rounded-[12px] bg-[#E6F8FC] text-[#00B6E2] text-[12px] font-medium whitespace-nowrap">
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
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C] font-semibold">{row.id}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">{row.quantity}</td>
                        <td className="px-6 py-4 text-[14px] text-[#5C5C5C]">
                          <span className="inline-flex px-2.5 py-0.5 rounded-[12px] bg-[#E6F8FC] text-[#00B6E2] text-[12px] font-medium whitespace-nowrap">
                            {row.stage}
                          </span>
                        </td>
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
                  {((listType === "product" ? productOrdersList.length : workOrdersList.length) === 0) && (
                    <tr>
                      <td colSpan={listType === "product" ? 9 : 8} className="px-6 py-8 text-center text-[#5C5C5C]">
                        No records found
                      </td>
                    </tr>
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
