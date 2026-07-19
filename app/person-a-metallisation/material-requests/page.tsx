"use client";

import { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { materialRequestService } from "@/src/services/materialRequestService";
import type { TableConfig } from "@/hooks/useTableControls";
import { TablePagination } from "@/components/table/TablePagination";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";
import { CreateMaterialRequestModal } from "@/components/material/CreateMaterialRequestModal";
import { IssueMaterialModal } from "@/components/material/IssueMaterialModal";
import type { MaterialRequestItem } from "@/lib/data";
import { workOrderService } from "@/src/services/workOrderService";

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

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

export default function PersonAMetallisationMaterialRequestsPage() {
  const pathname = usePathname();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReqId, setIssueReqId] = useState("");
  const [issueItems, setIssueItems] = useState<any[]>([]);

  const [workOrders, setWorkOrders] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rows, woRows] = await Promise.all([
        materialRequestService.list(),
        import("@/src/services/workOrderService").then((m) => m.workOrderService.list())
      ]);

      const sortedWorkOrders = (woRows as any[]).sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setWorkOrders(sortedWorkOrders);

      let relevantRows = rows;
      if (pathname.includes("/person-a-metallisation")) {
        relevantRows = rows.filter((r: any) => {
          return r.notes?.includes("[Slitting]");
        });
      }

      setData(relevantRows.map((row: any) => {
        return {
          id: row.request_no || row.id,
          originalId: row.id,
          workOrderId: row.work_order_id,
          notes: row.notes || "",
          micron: row.work_orders?.micron ? String(row.work_orders.micron) : "-",
          width: row.work_orders?.width_m ? String(row.work_orders.width_m) : "-",
          requestedQty: row.requested_quantity ? String(row.requested_quantity) : "-",
          status: row.status || "Pending",
          requestedBy: row.requested_by || "-",
          // notes: row.notes || "",
          createdAt: new Date(row.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          // issuedAt: row.updated_at ? new Date(row.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-",
        };
      }));
    } catch (err) {
      console.error("Failed to load material requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pathname]);

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

  const handleCreateRequest = async (items: any[]) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      for (const item of items) {
        console.log(item);
        await materialRequestService.create({
          request_no: generateId("MRQ"),
          material_type: "raw_material" as const,
          work_order_id: item.productNo,
          requested_by: user?.id,
          requested_quantity: Number(item.requestedQty),
          status: "Pending",
          notes: "[Metallisation]"
        } as any);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to create material request", err);
    }
  };

  const [issueReqQty, setIssueReqQty] = useState(0);
  const [issueReqWorkOrderId, setIssueReqWorkOrderId] = useState("");
  const [availableCoils, setAvailableCoils] = useState<any[]>([]);

  const openIssueModal = async (row: any) => {
    setIssueReqId(row.originalId);
    setIssueReqQty(Number(row.requestedQty));
    setIssueReqWorkOrderId(row.workOrderId);

    try {
      const { productionStageService } = await import("@/src/services/productionStageService");
      const allCoils = await productionStageService.listMetallisation();

      const woMicron = String(row.micron);
      const woWidth = String(row.width);

      // Cache work orders by id so coils sharing the same work order don't refetch it repeatedly
      const workOrderCache = new Map<string, any>();
      const getWorkOrder = async (workOrderId: string) => {
        if (!workOrderId) return null;
        if (workOrderCache.has(workOrderId)) return workOrderCache.get(workOrderId);
        const wo = await workOrderService.getById(workOrderId);
        workOrderCache.set(workOrderId, wo);
        return wo;
      };

      // Array.prototype.filter can't take an async predicate — a Promise is always
      // truthy, so the old version let every coil through regardless of match.
      // Resolve matches first with Promise.all, then filter on the resolved result.
      const matchResults = await Promise.all(
        allCoils.map(async (coil: any) => {
          // Only coils that have already been returned are eligible for re-issue
          if (coil.status !== "Returned") return { coil, matches: false };

          const workOrder = await getWorkOrder(coil.work_order_id);
          const itemMicron = String(workOrder?.micron ?? "-");
          const itemWidth = String(workOrder?.width_m ?? "-");
          const matchMicron = woMicron && woMicron !== "-" ? itemMicron === woMicron : true;
          const matchWidth = woWidth && woWidth !== "-" ? itemWidth === woWidth : true;

          // Attach the resolved micron/width onto the coil so the Issue modal
          // has something to display — these fields don't exist on the coil itself.
          const enrichedCoil = {
            ...coil,
            micron: itemMicron,
            width: itemWidth,
          };

          return { coil: enrichedCoil, matches: matchMicron && matchWidth };
        })
      );

      const filtered = matchResults
        .filter((result) => result.matches)
        .map((result) => result.coil)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setAvailableCoils(filtered);
      console.log(availableCoils);
      setIsIssueModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch available coils", err);
    }
  };

  const submitIssue = async (selectedIds: string[], totalWeight: number) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      await materialRequestService.issue(issueReqId, user?.id || "", totalWeight);

      if (issueReqWorkOrderId) {
        const { productionStageService } = await import("@/src/services/productionStageService");
        await Promise.all(
          selectedIds.map((id) =>
            productionStageService.updateMetallisation(id, { work_order_id: issueReqWorkOrderId })
          )
        );
      }

      setIsIssueModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to issue material", err);
    }
  };

  const rejectMaterialRequest = async (id: string) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      // Using cancel method to represent reject for approver flow
      await materialRequestService.cancel(id, user?.id || "");
      loadData();
    } catch (err) {
      console.error("Failed to reject material", err);
    }
  };

  const cancelMaterialRequest = async (id: string) => {
    try {
      const { authService } = await import("@/src/services/authService");
      const user = await authService.getCurrentProfile();
      await materialRequestService.cancel(id, user?.id || "");
      loadData();
    } catch (err) {
      console.error("Failed to cancel material", err);
    }
  };

  const { paginatedData, totalPages, validPage: currentPage } = getPaginatedData(filteredData);

  if (loading) return <div className="p-6 text-center text-[#5C5C5C]">Loading material requests...</div>;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col overflow-x-hidden">
      <MobileHeader title="Material Requests" />

      {isModalOpen && (
        <CreateMaterialRequestModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateRequest}
          title="Material Request"
          subtitle="Request materials from Store Head"
          mode="work-order"
          workOrders={workOrders}
        />
      )}

      {isIssueModalOpen && (
        <IssueMaterialModal
          onClose={() => setIsIssueModalOpen(false)}
          onSubmit={submitIssue}
          items={availableCoils}
          requestedQty={issueReqQty}
          itemType="metallisation"
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
              const exportData = paginatedData.map((row: any) => ({
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
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 whitespace-nowrap w-full sm:w-auto">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">New Request</span>
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
                        {row.notes.includes("[Slitting]") && row.status === "Pending" && (
                          <>
                            <button onClick={() => openIssueModal(row)} className="text-[11px] bg-[#00B6E2] text-white px-2 py-1 rounded-[4px] hover:bg-[#0092b5]">Issue</button>
                            <button onClick={() => rejectMaterialRequest(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}
                        {row.notes.includes("[Metallisation]") && row.status === "Pending" && (
                          <button onClick={() => cancelMaterialRequest(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Cancel</button>
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
          </div>
          <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>
      </div>
    </div>
  );
}
