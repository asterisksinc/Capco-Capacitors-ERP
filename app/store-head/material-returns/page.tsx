"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { materialReturnService } from "@/src/services/materialReturnService";
import type { TableConfig } from "@/hooks/useTableControls";
import { TablePagination } from "@/components/table/TablePagination";
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
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Pending", "Returned", "Accepted", "Rejected"] },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Pending") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium">Pending</span>;
  if (status === "Returned") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium">Returned</span>;
  if (status === "Accepted") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium">Accepted</span>;
  if (status === "Rejected") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">Rejected</span>;
  return null;
}

export default function StoreHeadMaterialReturnsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [rows] = await Promise.all([
        materialReturnService.list()
      ]);

      // Show returns created by Metallisation
      const relevantRows = rows.filter((row: any) => {
        return row.reason?.includes("[Metallisation]");
      });

      setData(relevantRows.map((row: any) => ({
        id: row.return_no || row.id,
        originalId: row.id,
        materialId: row.inventory?.raw_material_code || row.stock?.stock_no || row.material_id || "-",
        weight: row.weight_kg ? String(row.weight_kg) : "-",
        usedWeight: row.used_weight_kg != null ? String(row.used_weight_kg) : "-",
        reason: row.reason || "-",
        status: row.status || "Returned",
        returnedBy: row.returned_by || "-",
        createdAt: new Date(row.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      })));
    } catch (err) {
      console.error("Failed to load material returns", err);
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
    handleSort: handleSortRaw,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange,
    getPaginatedData,
    setCurrentPage,
  } = useTableControls({ data, config: tableConfig });

  const handleSort = handleSortRaw as (key: string | number | symbol) => void;

  const filteredData = processedData.filter((row) => {
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

    const handleAccept = async (row: any) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      await materialReturnService.accept(row.originalId, user?.id || "");

      const { supabaseRest } = await import("@/src/services/supabaseClient");
      const returnRecord = await supabaseRest.getById("material_returns", row.originalId, "inventory_id,material_id,weight_kg,used_weight_kg,quantity_returned");
      
      const targetInvId = (returnRecord as any)?.inventory_id || (returnRecord as any)?.material_id;
      
      if (targetInvId) {
        const { inventoryService } = await import("@/src/services/inventoryService");
        const usedWeight = Number((returnRecord as any)?.used_weight_kg || 0);
        const returnedWeight = Number((returnRecord as any)?.quantity_returned ?? (Number((returnRecord as any)?.weight_kg || 0) - usedWeight));
        const nextStatus = returnedWeight > 0 ? "In Inventory" : "Used Completely";
        
        await inventoryService.update(targetInvId, {
          used_weight_kg: usedWeight,
          gross_weight_kg: Math.max(0, returnedWeight),
          current_weight_kg: Math.max(0, returnedWeight),
          status: nextStatus as any,
          stage: "Inventory" as any,
        } as any);
      }

      loadData();
    } catch (err) {
      console.error("Failed to accept material return", err);
      alert("Return accepted, but inventory update failed — please refresh and verify");
    }
  };

  const rejectMaterialReturn = async (id: string) => {
    try {
      
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      await materialReturnService.reject(id, user?.id || "");
      loadData();
    } catch (err) {
      console.error("Failed to reject material return", err);
    }
  };

  const { paginatedData, totalPages, validPage: currentPage } = getPaginatedData(filteredData);

  if (loading) return <div className="p-6 text-center text-[#5C5C5C]">Loading material returns...</div>;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Material Returns" />

      <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-6 flex flex-col gap-6">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search by Return ID..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => {
              const exportData = paginatedData.map((row: any) => ({
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
                {paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-4 text-[14px] font-medium text-[#00B6E2]">{row.id}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.materialId}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.weight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.usedWeight}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C] max-w-[200px] truncate">{row.reason || "-"}</td>
                    <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.status === "Pending" || row.status === "Returned" ? (
                          <>
                            <button onClick={() => handleAccept(row)} className="text-[11px] bg-[#1CB061] text-white px-2 py-1 rounded-[4px] hover:bg-[#18994e]">Accept</button>
                            <button onClick={() => rejectMaterialReturn(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        ) : null}
                        {row.status !== "Pending" && row.status !== "Returned" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material returns found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      </div>
    </div>
  );
}
