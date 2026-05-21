"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useStore } from "@/hooks/useStore";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { OptionsDropdown } from "@/components/table/OptionsDropdown";
import { FilterPopover, FilterChips, type FilterConfig, type FilterState, type EnumFilter, type TextFilter, type NumberRangeFilter } from "@/components/table/FilterPopover";
import { exportToExcel } from "@/lib/exportExcel";

type StockRow = {
  stockId: string;
  linkedWoId: string;
  weight: string;
  width: string;
  micron: string;
  grade: string;
  stage: string;
  timestamp: string;
};

const STAGE_OPTIONS = ["Slitting", "Ready for Winding", "Completed"];

const statusFilter: EnumFilter = { label: "Stage", key: "stage", options: STAGE_OPTIONS };
const textFilters: TextFilter[] = [
  { label: "Stock ID", key: "stockId", placeholder: "Search..." },
  { label: "Linked WO ID", key: "linkedWoId", placeholder: "Search..." },
  { label: "Grade", key: "grade" },
];
const numberFilters: NumberRangeFilter[] = [
  { label: "Weight", minKey: "weightMin", maxKey: "weightMax" },
  { label: "Width", minKey: "widthMin", maxKey: "widthMax" },
  { label: "Micron", minKey: "micronMin", maxKey: "micronMax" },
];

const filterConfig: FilterConfig = {
  enums: [statusFilter],
  texts: textFilters,
  numberRanges: numberFilters,
};

const stockConfig: TableConfig<StockRow> = {
  columns: [
    { key: "stockId", label: "STOCK ID", type: "text", sortable: true },
    { key: "linkedWoId", label: "Linked WO ID", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "width", label: "Width", type: "text", sortable: true },
    { key: "micron", label: "Micron", type: "text", sortable: true },
    { key: "grade", label: "Grade", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "enum", sortable: false, filter: "dropdown", options: STAGE_OPTIONS },
    { key: "timestamp", label: "Timestamp", type: "date", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

function useDerivedStock() {
  const { store, mounted } = useStore();

  return useMemo(() => {
    if (!mounted) return [];
    const rows: StockRow[] = [];
    for (const [woId, flow] of Object.entries(store.flowDataMap)) {
      for (const slitRow of flow.slittingRows) {
        rows.push({
          stockId: slitRow.productNo,
          linkedWoId: woId,
          weight: slitRow.weight,
          width: flow.overview.width,
          micron: slitRow.thickness,
          grade: slitRow.grade,
          stage: slitRow.stage,
          timestamp: slitRow.timestampAdded,
        });
      }
    }
    return rows;
  }, [store.flowDataMap, mounted]);
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Out of Stock") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium leading-tight">Out of Stock</span>;
  }
  if (status === "Low Stock") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium leading-tight">Low Stock</span>;
  }
  if (status === "In Stock") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium leading-tight">In Stock</span>;
  }
  return null;
}

export default function PersonBStockPage() {
  const data = useDerivedStock();

  const {
    processedData,
    sortConfig,
    handleSort,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange,
  } = useTableControls({ data: data, config: stockConfig });

  const [searchQuery, setSearchQuery] = useState("");

  const [tableFilters, setTableFilters] = useState<FilterState>(() => {
    const state: FilterState = {};
    state.stage = [...STAGE_OPTIONS];
    state.stockId = "";
    state.linkedWoId = "";
    state.grade = "";
    state.weightMin = "";
    state.weightMax = "";
    state.widthMin = "";
    state.widthMax = "";
    state.micronMin = "";
    state.micronMax = "";
    return state;
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setTableFilters(newFilters);
  };

  const handleRemoveFilter = (key: string) => {
    if (key === "stage") {
      setTableFilters({ ...tableFilters, stage: [...STAGE_OPTIONS] });
    } else if (key === "stockId") {
      setTableFilters({ ...tableFilters, stockId: "" });
    } else if (key === "linkedWoId") {
      setTableFilters({ ...tableFilters, linkedWoId: "" });
    } else if (key === "grade") {
      setTableFilters({ ...tableFilters, grade: "" });
    } else if (key === "weightMin") {
      setTableFilters({ ...tableFilters, weightMin: "", weightMax: "" });
    } else if (key === "widthMin") {
      setTableFilters({ ...tableFilters, widthMin: "", widthMax: "" });
    } else if (key === "micronMin") {
      setTableFilters({ ...tableFilters, micronMin: "", micronMax: "" });
    }
  };

  const filteredData = processedData.filter((row) => {
    const f = tableFilters;
    if (searchQuery && !row.stockId.toLowerCase().includes(searchQuery.toLowerCase()) && !row.linkedWoId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (!(f.stage as string[])?.includes(row.stage)) return false;
    if (f.stockId && !row.stockId.toLowerCase().includes((f.stockId as string).toLowerCase())) return false;
    if (f.linkedWoId && !row.linkedWoId.toLowerCase().includes((f.linkedWoId as string).toLowerCase())) return false;
    if (f.grade && row.grade !== (f.grade as string)) return false;
    const weightNum = parseFloat(row.weight);
    if (f.weightMin && !isNaN(weightNum) && weightNum < parseFloat(f.weightMin as string)) return false;
    if (f.weightMax && !isNaN(weightNum) && weightNum > parseFloat(f.weightMax as string)) return false;
    const widthNum = parseFloat(row.width);
    if (f.widthMin && !isNaN(widthNum) && widthNum < parseFloat(f.widthMin as string)) return false;
    if (f.widthMax && !isNaN(widthNum) && widthNum > parseFloat(f.widthMax as string)) return false;
    const micronNum = parseFloat(row.micron);
    if (f.micronMin && !isNaN(micronNum) && micronNum < parseFloat(f.micronMin as string)) return false;
    if (f.micronMax && !isNaN(micronNum) && micronNum > parseFloat(f.micronMax as string)) return false;
    return true;
  });

  const totalLots = data.length;
  const windingReadyLots = data.filter((row) => row.stage === "Ready for Winding").length;
  const slittingLots = data.filter((row) => row.stage === "Slitting").length;
  const completedLots = data.filter((row) => row.stage === "Completed").length;
  const gradeALots = data.filter((row) => row.grade === "A").length;

  const overviewStats = [
    {
      title: "Total Product Lots",
      value: String(totalLots),
      subtext: `${gradeALots} grade A lots`,
      subtextClass: "text-[#1CB061] font-semibold",
      valClass: "text-[#171717]",
    },
    {
      title: "Ready for Winding",
      value: String(windingReadyLots),
      subtext: "Available for winding",
      subtextClass: "text-[#00B6E2] font-semibold",
      valClass: "text-[#171717]",
    },
    {
      title: "Slitting Queue",
      value: String(slittingLots),
      subtext: "Still in cutting",
      subtextClass: "text-[#E19242] font-semibold",
      valClass: "text-[#171717]",
    },
    {
      title: "Completed Lots",
      value: String(completedLots),
      subtext: completedLots > 0 ? "Ready for next stage" : "No completed lots",
      subtextClass: completedLots > 0 ? "text-[#1CB061] font-semibold" : "text-[#5C5C5C] font-normal",
      valClass: "text-[#171717]",
    },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col">
      <section className="bg-white w-full flex justify-start border-b border-[#EBEBEB]">
        <div className="w-full px-6 py-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-medium text-[#171717] leading-tight">Stock Management</h1>
            <p className="text-[14px] font-normal text-[#5C5C5C] leading-tight">
              Product material from Person A slitting output — available for winding
            </p>
          </div>
          <Link
            href="/person-b/workorder"
            className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0"
          >
            <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} />
            <span className="leading-tight">Use Material</span>
          </Link>
        </div>
      </section>

      <div className="w-full px-6 py-6 flex flex-col gap-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-[#EBEBEB] rounded-[12px] items-center p-5">
          {overviewStats.map((stat, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-2 sm:py-0">
              <div className="flex flex-col gap-[6px]">
                <p className="text-[12px] font-medium text-[#5C5C5C] leading-tight">{stat.title}</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-[14px] font-semibold leading-tight ${stat.valClass}`}>{stat.value}</span>
                  <span className={`text-[12px] leading-tight ${stat.subtextClass}`}>{stat.subtext}</span>
                </div>
              </div>
              {i < overviewStats.length - 1 && (
                <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0]"></div>
              )}
            </div>
          ))}
        </section>

        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Stock ID..."
              className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]"
            />
          </div>
          <TableToolbar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onExport={() => {
              const exportData = filteredData.map(row => ({
                "Stock ID": row.stockId,
                "Linked WO ID": row.linkedWoId,
                "Weight": row.weight,
                "Width": row.width,
                "Micron": row.micron,
                "Grade": row.grade,
                "Stage": row.stage,
                "Timestamp": row.timestamp,
              }));
              exportToExcel(exportData, "stock", "Stock");
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
                  {stockConfig.columns.map((col) => (
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
                {filteredData.length > 0 ? filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[14px] font-medium text-[#00B6E2] whitespace-nowrap">
                      <Link href={`/person-b/stock/${row.stockId}`} className="hover:underline cursor-pointer">
                        {row.stockId}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.linkedWoId}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.weight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.width}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.micron}</td>
                    <td className="px-4 py-4 text-[14px] font-medium text-[#171717] whitespace-nowrap">{row.grade}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">
                       <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-[6px] text-xs font-medium tracking-wide">
                          {row.stage}
                       </span>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">{row.timestamp}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <OptionsDropdown
                        status="Yet to Start"
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">
                      No stock available. Person A needs to complete slitting on work orders first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
