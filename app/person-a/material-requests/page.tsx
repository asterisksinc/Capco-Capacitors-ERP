"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { materialRequestService } from "@/src/services/materialRequestService";
import type { TableConfig } from "@/hooks/useTableControls";
import { TablePagination } from "@/components/table/TablePagination";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import type { MaterialRequestItem } from "@/lib/data";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";

const tableConfig: TableConfig<any> = {
  columns: [
    { key: "id", label: "Request ID", type: "text", sortable: true },
    { key: "weightInfo", label: "Weight", type: "text", sortable: true },
    { key: "grade", label: "Grade", type: "text", sortable: true },
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

export default function PersonAMaterialRequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReqId, setIssueReqId] = useState("");
  const [issueItems, setIssueItems] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const rows = await materialRequestService.list();
      setData(rows.map((row: any) => ({
        id: row.request_no || row.id,
        originalId: row.id,
        weightInfo: row.stock?.weight_kg ? String(row.stock.weight_kg) : "-",
        grade: row.stock?.grade || row.grade || "-",
        requestedQty: row.requested_quantity ? String(row.requested_quantity) : "-",
        status: row.status || "Pending",
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

  const openIssueModal = (req: any) => {
    setIssueReqId(req.originalId);
    setIssueItems([{ weight: req.weightInfo, grade: req.grade, requestedQty: req.requestedQty, issuedQty: req.requestedQty }]);
    setIsIssueModalOpen(true);
  };

  const updateIssueItem = (idx: number, val: string) => {
    setIssueItems(issueItems.map((item, i) => i === idx ? { ...item, issuedQty: val } : item));
  };

  const submitIssue = async () => {
    try {
      await materialRequestService.issue(issueReqId, "Person A", Number(issueItems[0].issuedQty));
      setIsIssueModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to issue material", err);
    }
  };

  const cancelMaterialRequest = async (id: string) => {
    try {
      await materialRequestService.cancel(id, "Person A");
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

      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[600px] shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">Issue Material</h2>
                <p className="text-[15px] text-[#5C5C5C]">Set issued quantities for {issueReqId}</p>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-[#5C5C5C] hover:text-[#171717] p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              {issueItems.map((item, idx) => (
                <div key={idx} className="border border-[#DDE1E8] rounded-[12px] p-4">
                  <p className="text-[13px] font-semibold text-[#344054] mb-2">Item {idx + 1} (Weight: {item.weight}, Grade: {item.grade}, Requested: {item.requestedQty})</p>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium">Issued Quantity</label>
                    <input type="number" min="0" value={item.issuedQty} onChange={(e) => updateIssueItem(idx, e.target.value)} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              <button onClick={() => setIsIssueModalOpen(false)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
              <button onClick={submitIssue} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Issue</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 md:px-6 pt-[72px] md:pt-6 pb-6 flex flex-col gap-6">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search by Request ID..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
          <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={(scope = "all") => {
            const dataToExport = scope === "all" ? filteredData : paginatedData;
            const exportData = dataToExport.map((row: any) => ({
              "Request ID": row.id ?? "",
              "Weight": row.weightInfo ?? "",
              "Grade": row.grade ?? "",
              "Req Qty": row.requestedQty ?? "",
              "Status": row.status ?? "",
              "Created At": row.createdAt ?? "",
              "Issued At": row.issuedAt ?? "",
            }));
            exportToExcel(exportData, "material-requests", "Material Requests");
          }} />
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
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.weightInfo}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.grade}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.requestedQty}</td>
                    <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.createdAt}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.issuedAt || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.status === "Pending" && (
                          <>
                            <button onClick={() => openIssueModal(row)} className="text-[11px] bg-[#00B6E2] text-white px-2 py-1 rounded-[4px] hover:bg-[#0092b5]">Issue</button>
                            <button onClick={() => cancelMaterialRequest(row.originalId)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}
                        {row.status !== "Pending" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material requests from Person B.</td></tr>
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
