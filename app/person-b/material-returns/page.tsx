"use client";

import { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";

const tableConfig: TableConfig<any> = {
  columns: [
    { key: "id", label: "Return ID", type: "text", sortable: true },
    { key: "materialId", label: "Material ID", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "usedWeight", label: "Used Weight", type: "text", sortable: true },
    { key: "reason", label: "Reason", type: "text", sortable: false },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Pending", "Accepted", "Rejected"] },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Pending") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium">Pending</span>;
  if (status === "Accepted") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium">Accepted</span>;
  if (status === "Rejected") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">Rejected</span>;
  return null;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

function getDateString() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function MaterialReturnsPage() {
  const { store, mounted, addMaterialReturn } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ materialId: "", weight: "", usedWeight: "", reason: "" });

  const stockWeightMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const [, flow] of Object.entries(store.flowDataMap)) {
      for (const row of flow.slittingRows) {
        if (!map.has(row.productNo)) map.set(row.productNo, row.weight);
      }
    }
    for (const [, stocks] of Object.entries(store.assignments)) {
      for (const s of stocks) {
        if (!map.has(s.stockId)) map.set(s.stockId, s.weight);
      }
    }
    return map;
  }, [store.flowDataMap, store.assignments]);

  const data = useMemo(() => store.materialReturns, [store.materialReturns]);

  const {
    processedData,
    sortConfig,
    handleSort: handleSortRaw,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange,
  } = useTableControls({ data, config: tableConfig });

  const handleSort = handleSortRaw as (key: string | number | symbol) => void;

  const filteredData = processedData.filter((row) => {
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const submitReturn = () => {
    if (!formData.materialId.trim() || !formData.weight.trim()) return;
    addMaterialReturn({
      id: generateId("MRT"),
      materialId: formData.materialId,
      weight: formData.weight,
      usedWeight: formData.usedWeight || "0",
      reason: formData.reason,
      status: "Pending",
      createdAt: getDateString(),
    });
    setFormData({ materialId: "", weight: "", usedWeight: "", reason: "" });
    setIsModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Material Returns" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[600px] shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">Return Material</h2>
                <p className="text-[15px] text-[#5C5C5C]">Return unused or defective material</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#5C5C5C] hover:text-[#171717] p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Material ID</label>
                <select value={formData.materialId} onChange={(e) => {
                  const id = e.target.value;
                  const weight = stockWeightMap.get(id) ?? "";
                  setFormData({ ...formData, materialId: id, weight });
                }} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                  <option value="">Select stock...</option>
                  {Array.from(stockWeightMap.keys()).map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#171717]">Original Weight</label>
                  <input value={formData.weight} readOnly placeholder="Auto-fetched" className="h-[42px] rounded-[8px] border border-[#DDE1E8] bg-[#F8FAFC] px-3 text-[14px] text-[#5C5C5C]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#171717]">Used Weight</label>
                  <input value={formData.usedWeight} onChange={(e) => setFormData({ ...formData, usedWeight: e.target.value })} placeholder="Used weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Reason for Return</label>
                <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Describe reason for return" className="min-h-[80px] rounded-[8px] border border-[#DDE1E8] px-3 py-2 text-[14px] resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              <button onClick={() => setIsModalOpen(false)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
              <button onClick={submitReturn} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Return</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-6 flex flex-col gap-6">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Return ID..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => {
            const exportData = filteredData.map((row: any) => ({
              "Return ID": row.id ?? "",
              "Material ID": row.materialId ?? "",
              "Weight": row.weight ?? "",
              "Used Weight": row.usedWeight ?? "",
              "Reason": row.reason ?? "",
              "Status": row.status ?? "",
              "Created At": row.createdAt ?? "",
            }));
            exportToExcel(exportData, "material-returns", "Material Returns");
          }} />
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 whitespace-nowrap w-full sm:w-auto">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Return Material</span>
              <span className="sm:hidden">Return</span>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-[12px] flex flex-col gap-4 overflow-hidden">
          <div className="border border-[#EAECF0] rounded-[8px] overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {tableConfig.columns.map((col) => (
                    <th key={String(col.key)} className="px-4 py-[11px]">
                      <SortableHeader column={col} sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[14px] font-medium text-[#00B6E2]">{row.id}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.materialId}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.weight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.usedWeight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] max-w-[200px] truncate">{row.reason || "-"}</td>
                    <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.createdAt}</td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#A1A1AA]">-</span>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material returns found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
