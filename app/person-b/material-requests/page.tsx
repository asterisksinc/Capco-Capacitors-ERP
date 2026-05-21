"use client";

import { useState, useMemo } from "react";
import { Plus, Search, X, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { OptionsDropdown } from "@/components/table/OptionsDropdown";
import type { MaterialRequestItem } from "@/lib/data";

const tableConfig: TableConfig<any> = {
  columns: [
    { key: "id", label: "Request ID", type: "text", sortable: true },
    { key: "itemsCount", label: "Items", type: "text", sortable: true },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Pending", "Partially Issued", "Issued", "Cancelled"] },
    { key: "createdAt", label: "Created At", type: "date", sortable: true },
    { key: "issuedAt", label: "Issued At", type: "date", sortable: true },
    { key: "notes", label: "Notes", type: "text", sortable: false },
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

function getDateString() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function MaterialRequestsPage() {
  const { store, mounted, addMaterialRequest, issueMaterialRequest, cancelMaterialRequest } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueReqId, setIssueReqId] = useState("");
  const [issueItems, setIssueItems] = useState<MaterialRequestItem[]>([]);

  const [formItems, setFormItems] = useState<MaterialRequestItem[]>([
    { productNo: "", weight: "", requestedQty: "", issuedQty: "0", grade: "" },
  ]);

  const stockIds = useMemo(() => {
    const ids: string[] = [];
    for (const [, flow] of Object.entries(store.flowDataMap)) {
      for (const row of flow.slittingRows) {
        ids.push(row.productNo);
      }
    }
    return Array.from(new Set(ids));
  }, [store.flowDataMap]);

  const data = useMemo(() => {
    return store.materialRequests.map((req) => ({
      ...req,
      itemsCount: `${req.items.length} item(s)`,
    }));
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

  const filteredData = processedData.filter((row) => {
    if (searchQuery && !row.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const addFormItem = () => {
    setFormItems([...formItems, { productNo: "", weight: "", requestedQty: "", issuedQty: "0", grade: "" }]);
  };

  const updateFormItem = (idx: number, patch: Partial<MaterialRequestItem>) => {
    setFormItems(formItems.map((item, i) => i === idx ? { ...item, ...patch } : item));
  };

  const removeFormItem = (idx: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const submitRequest = () => {
    const valid = formItems.every((item) => item.productNo.trim() && item.requestedQty.trim());
    if (!valid) return;

    addMaterialRequest({
      id: generateId("MR"),
      items: formItems.map((item) => ({ ...item, issuedQty: "0" })),
      status: "Pending",
      createdAt: getDateString(),
      notes: "",
    });

    setFormItems([{ productNo: "", weight: "", requestedQty: "", issuedQty: "0", grade: "" }]);
    setIsModalOpen(false);
  };

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
      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[700px] shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">Material Request</h2>
                <p className="text-[15px] text-[#5C5C5C]">Request materials from Person A stock</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#5C5C5C] hover:text-[#171717] p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-6 overflow-y-auto flex flex-col gap-4">
              {formItems.map((item, idx) => (
                <div key={idx} className="border border-[#DDE1E8] rounded-[12px] p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-semibold text-[#344054]">Item {idx + 1}</p>
                    {formItems.length > 1 && (
                      <button onClick={() => removeFormItem(idx)} className="text-[12px] text-[#D92D20] hover:underline">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Product No</label>
                      <select value={item.productNo} onChange={(e) => updateFormItem(idx, { productNo: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                        <option value="">Select stock</option>
                        {stockIds.map((id) => <option key={id} value={id}>{id}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Weight</label>
                      <input value={item.weight} onChange={(e) => updateFormItem(idx, { weight: e.target.value })} placeholder="Weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Requested Qty</label>
                      <input type="number" min="1" value={item.requestedQty} onChange={(e) => updateFormItem(idx, { requestedQty: e.target.value })} placeholder="Qty" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Grade</label>
                      <select value={item.grade} onChange={(e) => updateFormItem(idx, { grade: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                        <option value="">Select</option>
                        <option value="AA">AA</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addFormItem} className="h-[42px] rounded-[8px] bg-[#00B6E2] text-white text-[15px] font-medium hover:bg-[#0092b5] transition-colors">+ Add Item</button>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              <button onClick={() => setIsModalOpen(false)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
              <button onClick={submitRequest} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
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
            <p className="text-[14px] font-normal text-[#5C5C5C]">Request materials from Person A stock inventory</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>New Request</span>
          </button>
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
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.itemsCount}</td>
                    <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.createdAt}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.issuedAt || "-"}</td>
                    <td className="px-4 py-4 text-[14px] text-[#5C5C5C]">{row.notes || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.status === "Pending" && (
                          <>
                            <button onClick={() => openIssueModal(row)} className="text-[11px] bg-[#00B6E2] text-white px-2 py-1 rounded-[4px] hover:bg-[#0092b5]">Issue</button>
                            <button onClick={() => cancelMaterialRequest(row.id)} className="text-[11px] bg-[#FB3748] text-white px-2 py-1 rounded-[4px] hover:bg-[#d92d20]">Cancel</button>
                          </>
                        )}
                        {row.status !== "Pending" && <span className="text-[12px] text-[#A1A1AA]">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-[#5C5C5C] text-[14px]">No material requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
