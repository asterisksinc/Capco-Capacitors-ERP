"use client";

import { TablePagination } from "@/components/table/TablePagination";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { materialRequestService } from "@/src/services/materialRequestService";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";
import { IssueMaterialModal } from "@/components/material/IssueMaterialModal";
import { authService } from "@/src/services/authService";

const tableConfig: TableConfig<any> = {
  columns: [
    { key: "id", label: "Request ID", type: "text", sortable: true },
    { key: "micron", label: "Micron", type: "text", sortable: true },
    { key: "width", label: "Width", type: "text", sortable: true },
    { key: "requestedQty", label: "Req Qty", type: "text", sortable: true },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Pending", "Partially Issued", "Issued", "Cancelled"] },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
    { key: "issuedAt", label: "Issued At", type: "date", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Pending") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium">Pending</span>;
  if (status === "Partially Issued") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">Partially Issued</span>;
  if (status === "Issued") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium">Issued</span>;
  if (status === "Cancelled") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-gray-100 text-gray-500 text-[12px] font-medium">Cancelled</span>;
  return null;
}

export default function StoreHeadMaterialRequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReqId, setIssueReqId] = useState("");
  const [issueRequestNo, setIssueRequestNo] = useState("");
  const [issueItems, setIssueItems] = useState<any[]>([]);
  const [qcImageFile, setQcImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rows] = await Promise.all([
        materialRequestService.list()
      ]);

      // Show requests created by Metallisation
      const relevantRows = rows.filter((row: any) => {
        return row.notes?.includes("[Metallisation]");
      });
      
      setData(relevantRows.map((row: any) => ({
        id: row.request_no || row.id,
        originalId: row.id,
        workOrderId: row.work_order_id,
        micron: row.work_orders?.micron ? String(row.work_orders.micron) : "-",
        width: row.work_orders?.width_m ? String(row.work_orders.width_m) : "-",
        requestedQty: row.requested_quantity ? String(row.requested_quantity) : "-",
        status: row.status || "Pending",
        qcImageUrl: row.qc_image_url || "",
        requestedBy: row.requested_by || "-",
        createdAt: new Date(row.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        issuedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-",
      })));
    } catch (err) {
      console.error("Failed to load material requests", err);
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

  const [issueReqQty, setIssueReqQty] = useState(0);
  const [issueReqWorkOrderId, setIssueReqWorkOrderId] = useState("");
  const [availableRawMaterials, setAvailableRawMaterials] = useState<any[]>([]);

  const openIssueModal = async (row: any) => {
    setIssueReqId(row.originalId);
    setIssueReqQty(Number(row.requestedQty));
    setIssueReqWorkOrderId(row.workOrderId);
    
    try {
      const { inventoryService } = await import("@/src/services/inventoryService");
      const allInventory = await inventoryService.list({ filters: { status: "In Inventory" } });
      
      const woMicron = String(row.micron);
      const woWidth = String(row.width);
      
      const filtered = allInventory.filter((item: any) => {
        const itemMicron = String(item.micron ?? "-");
        const itemWidth = String(item.width_m ?? "-");
        const matchMicron = woMicron && woMicron !== "-" ? itemMicron === woMicron : true;
        const matchWidth = woWidth && woWidth !== "-" ? itemWidth === woWidth : true;
        return matchMicron && matchWidth;
      }).sort((a: any, b: any) => {
        const aReturned = a.status === "Returned" ? 1 : 0;
        const bReturned = b.status === "Returned" ? 1 : 0;
        if (aReturned !== bReturned) {
          return bReturned - aReturned;
        }
        return new Date(a.date_received || a.created_at).getTime() - new Date(b.date_received || b.created_at).getTime();
      });
      
      setAvailableRawMaterials(filtered);
      setIsIssueModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    }
  };

  const submitIssue = async (selectedIds: string[], totalWeight: number) => {
    try {
      const user = await authService.getCurrentProfile();
      await materialRequestService.issue(issueReqId, user?.id || "", totalWeight);
      
      const quantity_kg_by_inventory_id: Record<string, number> = {};
      selectedIds.forEach(id => {
        const item = availableRawMaterials.find(m => m.id === id);
        quantity_kg_by_inventory_id[id] = Number(item?.net_weight_kg ?? item?.weight ?? 0);
      });

      const { workOrderService } = await import("@/src/services/workOrderService");
      await workOrderService.assignRawMaterials({
        work_order_id: issueReqWorkOrderId,
        inventory_ids: selectedIds,
        assigned_to: "", 
        assigned_by: user?.id || "",
        quantity_kg_by_inventory_id
      });
      
      setIsIssueModalOpen(false);
      setIssueRequestNo("");
      setQcImageFile(null);
      loadData();
    } catch (err) {
      console.error("Failed to issue material", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectMaterialRequest = async (id: string) => {
    try {
      
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      await materialRequestService.cancel(id, user?.id || "");
      loadData();
    } catch (err) {
      console.error("Failed to reject material", err);
    }
  };

  if (loading) return <div className="p-6 text-center text-[#5C5C5C]">Loading material requests...</div>;

  const { paginatedData, totalPages, validPage: currentPage } = getPaginatedData(filteredData);

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Material Requests" />

      {isIssueModalOpen && (
        <IssueMaterialModal
          onClose={() => setIsIssueModalOpen(false)}
          onSubmit={submitIssue}
          items={availableRawMaterials}
          requestedQty={issueReqQty}
          itemType="raw_material"
        />
      )}

      <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-6 flex flex-col gap-6">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search by Request ID..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => {
              const exportData = filteredData.map((row: any) => ({
                "Request ID": row.id ?? "",
                "Micron": row.micron ?? "",
                "Width": row.width ?? "",
                "Req Qty": row.requestedQty ?? "",
                "Status": row.status ?? "",
                "Created At": row.createdAt ?? "",
                "Issued At": row.issuedAt ?? "",
              }));
              exportToExcel(exportData, "material-requests", "Material Requests");
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
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.requestedQty}</td>
                    <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.createdAt}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.issuedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.status === "Pending" && (
                          <>
                            <button onClick={() => openIssueModal(row)} className="text-[11px] bg-[#00B6E2] text-white px-2 py-1 rounded-[4px] hover:bg-[#0092b5]">Issue</button>
                            <button onClick={() => rejectMaterialRequest(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}
                        {row.status !== "Pending" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material requests found.</td></tr>
                )}
              </tbody>
            </table>
            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </section>
      </div>
    </div>
  );
}
