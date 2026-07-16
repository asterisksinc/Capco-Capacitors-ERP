"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { materialReturnService } from "@/src/services/materialReturnService";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";
import { CreateMaterialReturnModal } from "@/components/material/CreateMaterialReturnModal";
import { inventoryService } from "@/src/services/inventoryService";

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

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

export default function PersonAMetallisationMaterialReturnsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialOptions, setMaterialOptions] = useState<{ id: string; label: string; weight: string }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rows, invData, profiles] = await Promise.all([
        materialReturnService.list(),
        import("@/src/services/inventoryService").then((m) => m.inventoryService.list()),
        import("@/src/services/supabaseClient").then((m) => m.supabaseRest.list<any>("profiles", { select: "id,roles(name)" })),
      ]);

      const profileMap = new Map();
      for (const p of profiles) {
        profileMap.set(p.id, p.roles?.name);
      }

      const options: { id: string; label: string; weight: string }[] = [];
      for (const item of invData as any[]) {
        if (item.raw_material_code) {
          options.push({
            id: item.id,
            label: item.raw_material_code,
            weight: String(item.net_weight_kg || 0)
          });
        }
      }
      setMaterialOptions(options);

      // Show returns created by Metallisation AND returns created by Slitting
      const relevantRows = rows.filter((row: any) => {
        const roleName = profileMap.get(row.returned_by);
        const isLegacyMatch = roleName === "Metallisation" || roleName === "Slitting" || row.returned_by === "Metallisation" || row.returned_by === "Slitting";
        const isTagged = row.reason?.includes("[Metallisation]") || row.reason?.includes("[Slitting]");
        return isLegacyMatch || isTagged;
      });

      setData(relevantRows.map((row: any) => ({
        id: row.return_no || row.id,
        originalId: row.id,
        materialId: row.inventory?.raw_material_code || row.stock?.stock_no || row.material_id || "-",
        weight: row.weight_kg ? String(row.weight_kg) : "-",
        usedWeight: row.used_quantity ? String(row.used_quantity) : "-",
        reason: row.reason || "-",
        status: row.status || "Returned",
        returnedBy: profileMap.get(row.returned_by) || row.returned_by,
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
  } = useTableControls({ data, config: tableConfig });

  const handleSort = handleSortRaw as (key: string | number | symbol) => void;

  const filteredData = processedData.filter((row) => {
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAccept = async (ret: any) => {
    try {
      await materialReturnService.accept(ret.originalId, "Metallisation");
      loadData();
    } catch (err) {
      console.error("Failed to accept material return", err);
    }
  };

  const rejectMaterialReturn = async (id: string) => {
    try {
      await materialReturnService.reject(id, "Metallisation");
      loadData();
    } catch (err) {
      console.error("Failed to reject material return", err);
    }
  };

  const handleCreateReturn = async (formData: { materialId: string; weight: string; usedWeight: string; reason: string }) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      const payload = {
        return_no: generateId("MRT"),
        material_type: "raw_material" as const,
        inventory_id: formData.materialId,
        returned_by: user?.id,
        weight_kg: Number(formData.weight),
        used_weight_kg: Number(formData.usedWeight),
        quantity_returned: Number(formData.weight) - Number(formData.usedWeight),
        reason: `[Metallisation] ${formData.reason}`,
      };
      console.log("Submitting return payload:", payload);
      await materialReturnService.create(payload as any);
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to create material return", err);
    }
  };

  if (loading) return <div className="p-6 text-center text-[#5C5C5C]">Loading material returns...</div>;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Material Returns" />

      {isModalOpen && (
        <CreateMaterialReturnModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateReturn}
          materialOptions={materialOptions}
          title="Return Material"
          subtitle="Return unused or defective material to Store"
          materialLabel="Material ID"
        />
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
              <span className="hidden sm:inline">New Return</span>
              <span className="sm:hidden">New</span>
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
                      <div className="flex items-center gap-1">
                        {row.reason?.includes("[Slitting]") && (row.status === "Pending" || row.status === "Returned") && (
                          <>
                            <button onClick={() => handleAccept(row)} className="text-[11px] bg-[#1CB061] text-white px-2 py-1 rounded-[4px] hover:bg-[#18994e]">Accept</button>
                            <button onClick={() => rejectMaterialReturn(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}
                        {row.status !== "Pending" && row.status !== "Returned" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
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
