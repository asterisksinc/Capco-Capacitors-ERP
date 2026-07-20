"use client";

import { WO_STATUS_OPTIONS, WO_STAGE_OPTIONS } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
import { ChevronDown, Search, Layers, Clock, Activity, CheckCircle, QrCode, Download, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { TableConfig } from "@/hooks/useTableControls";
import { TablePagination } from "@/components/table/TablePagination";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { OptionsDropdown } from "@/components/table/OptionsDropdown";
import { FilterPopover, FilterChips, type FilterConfig, type FilterState, type EnumFilter, type TextFilter, type NumberRangeFilter } from "@/components/table/FilterPopover";
import { exportToExcel } from "@/lib/exportExcel";
import { MobileHeader } from "@/components/MobileHeader";
import { workOrderService } from "@/src/services/workOrderService";

export type WorkOrderRow = {
  uuid?: string;
  id: string;
  micron: string;
  width: string;
  qty: string;
  stage: string;
  date: string;
  status: string;
};




const statusFilter: EnumFilter = { label: "Status", key: "status", options: WO_STATUS_OPTIONS };
const stageFilter: EnumFilter = { label: "Stage", key: "stage", options: WO_STAGE_OPTIONS };
const textFilters: TextFilter[] = [
  { label: "Work Order ID", key: "woId", placeholder: "Search..." },
  { label: "Micron", key: "micron" },
  { label: "Width", key: "width" },
];
const numberFilters: NumberRangeFilter[] = [
  { label: "Quantity", minKey: "qtyMin", maxKey: "qtyMax" },
];

const filterConfig: FilterConfig = {
  enums: [statusFilter, stageFilter],
  texts: textFilters,
  numberRanges: numberFilters,
};

const workOrderConfig: TableConfig<WorkOrderRow> = {
  columns: [
    { key: "id", label: "Work Orders ID", type: "text", sortable: true },
    { key: "micron", label: "Micron", type: "text", sortable: true },
    { key: "width", label: "Width", type: "text", sortable: true },
    { key: "qty", label: "Quantity", type: "number", sortable: true },
    { key: "stage", label: "Stage", type: "text", sortable: true },
    { key: "date", label: "Timestamp", type: "date", sortable: true },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: WO_STATUS_OPTIONS },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};



export default function StoreHeadWorkOrderPage() {
  const [rows, setRows] = useState<WorkOrderRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModalId, setQrModalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await workOrderService.list();
      const mapped = data.map((wo: any) => ({
        uuid: wo.id,
        id: wo.work_order_no || wo.id,
        micron: wo.micron?.toString() || "-",
        width: wo.width_m?.toString() || "-",
        qty: wo.quantity?.toString() || "-",
        stage: wo.stage || "Raw Material",
        date: wo.created_at ? new Date(wo.created_at).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : "-",
        status: wo.status || "Yet to Start"
      }));
      setRows(mapped);
    } catch (error) {
      console.error("Failed to load work orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const {
    processedData,
    sortConfig,
    handleSort,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange,
    getPaginatedData,
    setCurrentPage,
  } = useTableControls({ data: rows, config: workOrderConfig });

  const [tableFilters, setTableFilters] = useState<FilterState>(() => {
    const state: FilterState = {};
    state.status = [...WO_STATUS_OPTIONS];
    state.stage = [...WO_STAGE_OPTIONS];
    state.woId = "";
    state.micron = "";
    state.width = "";
    state.qtyMin = "";
    state.qtyMax = "";
    return state;
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setTableFilters(newFilters);
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "status") {
      setTableFilters({ ...tableFilters, status: [...WO_STATUS_OPTIONS] });
    } else if (key === "stage") {
      setTableFilters({ ...tableFilters, stage: [...WO_STAGE_OPTIONS] });
    } else if (key === "woId") {
      setTableFilters({ ...tableFilters, woId: "" });
    } else if (key === "micron") {
      setTableFilters({ ...tableFilters, micron: "" });
    } else if (key === "width") {
      setTableFilters({ ...tableFilters, width: "" });
    } else if (key === "qtyMin") {
      setTableFilters({ ...tableFilters, qtyMin: "", qtyMax: "" });
    }
  };

  const filteredData = processedData.filter((row) => {
    const f = tableFilters;
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (!(f.status as string[])?.includes(row.status)) return false;
    if (f.stage && !(f.stage as string[])?.includes(row.stage)) return false;
    if (f.woId && !row.id.toLowerCase().includes((f.woId as string).toLowerCase())) return false;
    if (f.micron && row.micron !== (f.micron as string)) return false;
    if (f.width && row.width !== (f.width as string)) return false;
    if (f.qtyMin && parseInt(row.qty) < parseInt(f.qtyMin as string)) return false;
    if (f.qtyMax && parseInt(row.qty) > parseInt(f.qtyMax as string)) return false;
    return true;
  });

  const totalWorkOrders = rows.length;
  const rawMaterialCount = rows.filter((row) => row.stage.toLowerCase().includes("raw material")).length;
  const metallisationCount = rows.filter((row) => row.stage.toLowerCase().includes("metallisation")).length;
  const slittingCount = rows.filter((row) => row.stage.toLowerCase().includes("slitting")).length;
  const completedCount = rows.filter((row) => row.status === "Completed").length;
  const inProgressCount = rows.filter((row) => row.status === "In-progress").length;
  const yetToStartCount = rows.filter((row) => row.status === "Yet to Start").length;

  const overviewStats = [
    {
      title: "Total Work Orders",
      value: String(totalWorkOrders),
      icon: Layers,
      valClass: "text-[#171717]",
      subtext: `Yet ${yetToStartCount} | In-progress ${inProgressCount} | Completed ${completedCount}`,
    },
    {
      title: "Yet to Start",
      value: String(yetToStartCount),
      icon: Clock,
      valClass: "text-[#E19242]",
      subtext: "",
    },
    {
      title: "In-progress",
      value: String(inProgressCount),
      icon: Activity,
      valClass: "text-[#1CB061]",
      subtext: "",
    },
    {
      title: "Completed",
      value: String(completedCount),
      icon: CheckCircle,
      valClass: "text-[#171717]",
      subtext: "",
    },
  ];

  const { paginatedData, totalPages, validPage: currentPage } = getPaginatedData(filteredData);

  if (loading) {
    return <div className="p-6 text-center text-[#5C5C5C]">Loading work orders...</div>;
  }

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col relative overflow-x-hidden">
      <MobileHeader title="Work Orders" />

      <section className="bg-white w-full flex justify-start border-b border-[#EBEBEB]">
        <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-medium text-[#171717] leading-tight">Work Orders</h1>
            <p className="text-[14px] font-normal text-[#5C5C5C] leading-tight hidden md:block">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>
        </div>
      </section>

      <div className="w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* KPI Stats - Mobile 2x2 grid */}
        <section className="grid grid-cols-2 gap-0 md:hidden bg-white border border-[#EBEBEB] rounded-[12px]">
          {overviewStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`p-3 ${i % 2 === 0 ? 'border-r border-b border-[#EBEBEB]' : 'border-b border-[#EBEBEB]'} ${i >= 2 ? 'border-b-0' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#00B6E2]" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] font-medium text-[#5C5C5C]">{stat.title}</p>
                    <span className={`text-[16px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                    {stat.subtext && <span className="text-[10px] text-[#5C5C5C]">{stat.subtext}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* KPI Stats - Desktop row */}
        <section className="hidden md:grid grid-cols-1 lg:grid-cols-4 bg-white border border-[#EBEBEB] rounded-[12px] items-center p-5">
          {overviewStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#00B6E2]" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="text-[12px] font-medium text-[#5C5C5C] leading-tight">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[14px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                    {stat.subtext && <span className="text-[12px] text-[#5C5C5C]">{stat.subtext}</span>}
                  </div>
                </div>
                {i < overviewStats.length - 1 && (
                  <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0] ml-auto" />
                )}
              </div>
            );
          })}
        </section>

        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-[400px]">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Work Order ID..." 
              className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2] " 
            />
          </div>
          <TableToolbar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onExport={(scope = "all") => {
            const dataToExport = scope === "all" ? filteredData : paginatedData;
            const exportData = dataToExport.map(row => ({
                "Work Order ID": row.id,
                "Micron": row.micron,
                "Width": row.width,
                "Quantity": row.qty,
                "Stage": row.stage,
                "Date": row.date,
                "Status": row.status,
              }));
              exportToExcel(exportData, "work-orders", "Work Orders");
            }}
            filterConfig={filterConfig}
            filters={tableFilters}
            onApplyFilters={handleApplyFilters}
          />
        </section>

        <FilterChips config={filterConfig} filters={tableFilters} onRemove={handleRemoveFilter} />

        <section className="bg-white rounded-[12px] flex flex-col gap-4 overflow-hidden">
          <div className="border border-[#EAECF0] rounded-[8px] overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {workOrderConfig.columns.slice(0, 7).map((col) => (
                    <th key={String(col.key)} className="px-4 py-[11px]">
                      <SortableHeader
                        column={col}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                      />
                    </th>
                  ))}
                  <th className="px-4 py-[11px]">
                    <span className="text-[12px] font-medium text-[#5C5C5C]">QR</span>
                  </th>
                  {workOrderConfig.columns.slice(7).map((col) => (
                    <th key={String(col.key)} className="px-4 py-[11px]">
                      <SortableHeader
                        column={col}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] font-medium whitespace-nowrap">
                      <Link href={`/store-head/workorder/${row.id}`} className="hover:text-[#00B6E2] hover:underline cursor-pointer">
                        {row.id}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.micron}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.width}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.qty}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.stage}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setQrModalId(row.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F5F7FA] transition-colors text-[#5C5C5C] hover:text-[#00B6E2]"
                        title="Show QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <OptionsDropdown 
                        viewHref={`/store-head/workorder/${row.id}`}
                        status={row.status}
                        onEdit={() => {}}
                        onDelete={async () => {
                          if (confirm(`Are you sure you want to delete ${row.id}?`)) {
                            if ((row as any).uuid) {
                              try {
                                await workOrderService.remove((row as any).uuid);
                                await loadData();
                              } catch (e) {
                                console.error(e);
                                alert("Failed to delete work order");
                              }
                            }
                          }
                        }}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">
                      No work orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      </div>

      {/* QR Code Modal */}
      {qrModalId && (
        <QrModal workOrderId={qrModalId} onClose={() => setQrModalId(null)} />
      )}
    </div>
  );
}

function QrModal({ workOrderId, onClose }: { workOrderId: string; onClose: () => void }) {
  const svgRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleDownload = useCallback(() => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clone);
    const canvas = document.createElement("canvas");
    const size = 360;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${workOrderId.replace(/[^a-zA-Z0-9-_]/g, "_")}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.src = url;
  }, [workOrderId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] p-6 flex flex-col items-center gap-4 shadow-lg max-w-[280px] w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-[14px] font-medium text-[#171717]">QR Code</p>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div ref={svgRef} className="bg-white p-3 rounded-[8px] border border-[#EBEBEB]">
          <QRCodeSVG value={workOrderId} size={180} level="M" />
        </div>
        <p className="text-[13px] text-[#5C5C5C] text-center break-all max-w-full">{workOrderId}</p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={handleDownload}
            className="w-full h-[40px] bg-white border border-[#EBEBEB] text-[#5C5C5C] rounded-[8px] text-[14px] font-medium hover:bg-[#F5F7FA] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR
          </button>
          <button
            onClick={onClose}
            className="w-full h-[40px] bg-[#00B6E2] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#009DC4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
