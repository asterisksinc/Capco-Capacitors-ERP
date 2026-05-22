"use client";

import { useState, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import type { MaterialRequestItem } from "@/lib/data";

const tableConfig: TableConfig<any> = {
  columns: [
    { key: "id", label: "Request ID", type: "text", sortable: true },
    { key: "products", label: "Product No", type: "text", sortable: true },
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
  const { store, mounted, issueMaterialRequest, cancelMaterialRequest } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReqId, setIssueReqId] = useState("");
  const [issueItems, setIssueItems] = useState<MaterialRequestItem[]>([]);

  const data = useMemo(() => {
    return store.materialRequests.map((req) => {
      const first = req.items[0];
      return {
        ...req,
        products: first?.productNo ?? "-",
        grade: first?.grade ?? "-",
        requestedQty: first ? `${first.requestedQty}/${first.weight}` : "-",
      };
    });
  }, [store.materialRequests]);

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

  const pendingCount = useMemo(() => store.materialRequests.filter((r) => r.status === "Pending").length, [store.materialRequests]);

  const filteredData = processedData.filter((row) => {
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openIssueModal = (req: any) => {
    setIssueReqId(req.id);
    setIssueItems(req.items.map((item: MaterialRequestItem) => ({ ...item })));
    setIsIssueModalOpen(true);
  };

  const updateIssueItem = (idx: number, val: string) => {
    setIssueItems(issueItems.map((item, i) => i === idx ? { ...item, issuedQty: val } : item));
  };

  const submitIssue = () => {
    issueMaterialRequest(issueReqId, issueItems);
    setIsIssueModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col">
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
                  <p className="text-[13px] font-semibold text-[#344054] mb-2">{item.productNo} (Requested: {item.requestedQty})</p>
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

      <section className="bg-white w-full flex justify-start border-b border-[#EBEBEB]">
        <div className="w-full px-6 py-6 pb-4 flex items-start sm:items-center justify-between">
          <div>
            <h1 className="text-[16px] font-medium text-[#171717] leading-tight">Material Requests</h1>
            <p className="text-[14px] font-normal text-[#5C5C5C]">
              {pendingCount > 0 ? `${pendingCount} pending request(s) from Person B` : "No pending requests from Person B"}
            </p>
          </div>
        </div>
      </section>

      <div className="w-full px-6 py-6 flex flex-col gap-6">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative max-w-[400px] w-full">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Request ID..." className="h-[40px] w-full pl-9 pr-3 bg-white border border-[#EBEBEB] rounded-[8px] text-[14px] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#00B6E2]" />
          </div>
          <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => alert("Exporting...")} />
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
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.products}</td>
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
                            <button onClick={() => cancelMaterialRequest(row.id)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Reject</button>
                          </>
                        )}
                        {row.status !== "Pending" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material requests from Person B.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
