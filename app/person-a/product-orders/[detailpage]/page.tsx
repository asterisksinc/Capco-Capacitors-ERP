"use client";

import { use, useState, useMemo } from "react";
import { Plus, X, ChevronRight, Trash2, Download } from "lucide-react";
import { MobileHeader } from "@/components/MobileHeader";
import { exportToExcel } from "@/lib/exportExcel";
import Link from "next/link";
import { productOrderService } from "@/src/services/productOrderService";
import { stockService } from "@/src/services/stockService";
import { authService } from "@/src/services/authService";
import { supabaseRest } from "@/src/services/supabaseClient";
import { useEffect } from "react";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Yet to Start") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium">Yet to Start</span>;
  if (status === "In-progress") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium">In-progress</span>;
  if (status === "Completed") return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium">Completed</span>;
  return null;
}

function getDateTimeString() {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function PersonAProductOrderDetail({ params }: DetailPageProps) {
  const { detailpage } = use(params);
  const displayId = (detailpage || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [poData, setPoData] = useState<any>(null);
  const [assignedStocks, setAssignedStocks] = useState<any[]>([]);
  const [matchingStock, setMatchingStock] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const allPos = await productOrderService.list();
      const originalPo = allPos.find((p: any) => p.product_order_no === displayId || p.id === displayId);
      if (!originalPo) {
        setLoading(false);
        return;
      }

      const data: any = await productOrderService.getById((originalPo as any).id);
      setPoData(data);

      const materials = data.product_order_materials || [];
      const assigned = materials.map((m: any) => ({
        id: m.id,
        stockId: m.stock?.stock_no || m.stock_id,
        linkedWoId: m.linked_work_order_id || "-",
        weight: m.weight_kg ? `${m.weight_kg}kgs` : "-",
        width: m.width_m ? `${m.width_m}m` : "-",
        micron: m.micron || "-",
        grade: m.grade || "-",
        stage: "Assigned",
        assignedAt: new Date(m.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      }));
      setAssignedStocks(assigned);

      const assignedStockIds = new Set(materials.map((m: any) => m.stock_id));
      const allStocks = await stockService.list();
      const matching = allStocks.filter((s: any) => s.grade === data.grade && !assignedStockIds.has(s.id));
      
      const rows = matching.map((s: any) => ({
        id: s.id, 
        stockId: s.stock_no,
        linkedWoId: s.work_orders?.work_order_no || "-",
        weight: s.weight_kg ? `${s.weight_kg}kgs` : "-",
        width: s.width_m ? `${s.width_m}m` : "-",
        micron: s.micron || "-",
        grade: s.grade || "-",
        stage: s.stage || "Stock",
        rawWeightKg: s.weight_kg,
        rawWidthM: s.width_m,
        rawMicron: s.micron,
      }));
      setMatchingStock(rows);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [displayId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submitAssign = async () => {
    try {
      const user = await authService.getCurrentProfile();
      for (const stock of matchingStock) {
        if (selectedIds.has(stock.id)) {
          await productOrderService.assignStock({
            product_order_id: poData.id,
            stock_id: stock.id,
            linked_work_order_id: stock.linkedWoId !== "-" ? stock.linkedWoId : undefined,
            assigned_by: user?.id || "",
            assigned_to: poData.assigned_to || user?.id,
            weight_kg: stock.rawWeightKg || 0,
            width_m: stock.rawWidthM,
            micron: stock.rawMicron,
            grade: stock.grade,
          });
        }
      }
      setSelectedIds(new Set());
      setIsModalOpen(false);
      fetchDetails();
    } catch (error) {
      console.error(error);
      alert("Failed to assign stock");
    }
  };

  const removeAssignedStock = async (id: string) => {
    try {
      await supabaseRest.remove("product_order_materials", id);
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to remove stock");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-[#5C5C5C]">Loading...</div>;
  }

  if (!poData) {
    return (
      <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex items-center justify-center">
        <p className="text-[#5C5C5C]">Product order not found.</p>
      </div>
    );
  }

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col pb-10 overflow-x-hidden">
      <MobileHeader title={poData.product_order_no || poData.product_code} />

      {/* Assign Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[800px] shadow-lg flex flex-col overflow-hidden max-h-[85vh]">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div>
                <h2 className="text-[24px] leading-tight font-semibold text-[#171717]">Assign Stock to {poData.product_order_no}</h2>
                <p className="text-[14px] text-[#5C5C5C] mt-1">Grade {poData.grade} stock items available for assignment</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#5C5C5C] hover:text-[#171717] p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB] sticky top-0">
                    <th className="px-5 py-3 text-[13px] font-medium w-10">
                      <input type="checkbox" checked={selectedIds.size === matchingStock.length && matchingStock.length > 0} onChange={() => {
                        if (selectedIds.size === matchingStock.length) setSelectedIds(new Set());
                        else setSelectedIds(new Set(matchingStock.map((s) => s.id)));
                      }} className="w-4 h-4 accent-[#00B6E2]" />
                    </th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Stock ID</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Linked WO</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Weight</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Width</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Micron</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Grade</th>
                    <th className="px-5 py-3 text-[13px] font-medium text-left">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBEB]">
                  {matchingStock.map((row) => (
                    <tr key={row.id} onClick={() => toggleSelect(row.id)} className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedIds.has(row.id) ? "bg-[#F0FDF4]" : ""}`}>
                      <td className="px-5 py-4"><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 accent-[#00B6E2]" /></td>
                      <td className="px-5 py-4 text-[14px] font-medium text-[#00B6E2]">{row.stockId}</td>
                      <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.linkedWoId}</td>
                      <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.weight}</td>
                      <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                      <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                      <td className="px-5 py-4 text-[14px] font-medium text-[#171717]">{row.grade}</td>
                      <td className="px-5 py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-[6px] text-xs font-medium">{row.stage}</span></td>
                    </tr>
                  ))}
                  {matchingStock.length === 0 && (
                    <tr><td colSpan={8} className="px-5 py-8 text-center text-[#5C5C5C] text-[14px]">No unassigned stock items with grade {poData.grade}.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              <button onClick={() => setIsModalOpen(false)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
              <button onClick={submitAssign} disabled={selectedIds.size === 0} className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] transition-colors ${selectedIds.size > 0 ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}>
                Assign ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-white w-full border-b border-[#EBEBEB] pt-[72px] md:pt-0">
        <div className="w-full px-4 md:px-6 py-5">
          <div className="hidden md:flex items-center gap-2 mb-2">
            <Link href="/person-a/product-orders" className="text-[14px] text-[#5C5C5C] hover:text-[#171717]">Product Orders</Link>
            <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
            <span className="text-[14px] font-medium text-[#00B6E2]">{poData.product_order_no}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[20px] font-semibold text-[#171717]">{poData.product_code}</h1>
              <p className="text-[14px] text-[#5C5C5C] mt-1">Assign stock to Person B for this product order</p>
            </div>
            <span className="bg-[#E6F8FD] text-[#00B6E2] text-[12px] font-medium px-3 py-[6px] rounded-[24px] whitespace-nowrap">{poData.grade} Grade</span>
          </div>
        </div>
      </section>

      {/* Product Order Info */}
      <section className="bg-white mx-4 md:mx-6 mt-6 border border-[#EBEBEB] rounded-[12px] p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><p className="text-[12px] text-[#5C5C5C]">Capacitor Type</p><p className="text-[14px] font-medium text-[#171717]">{poData.capacitor_type}</p></div>
          <div><p className="text-[12px] text-[#5C5C5C]">Grade</p><p className="text-[14px] font-medium text-[#171717]">{poData.grade}</p></div>
          <div><p className="text-[12px] text-[#5C5C5C]">Batch Size</p><p className="text-[14px] font-medium text-[#171717]">{poData.batch_size}</p></div>
          <div><p className="text-[12px] text-[#5C5C5C]">Status</p><StatusBadge status={poData.status || "Pending"} /></div>
        </div>
      </section>

      {/* Assigned Stocks */}
      <section className="bg-white mx-4 md:mx-6 mt-6 border border-[#EBEBEB] rounded-[12px]">
        <div className="px-4 md:px-6 py-5 border-b border-[#EBEBEB] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-[#171717]">Assigned Stocks</h2>
            <p className="text-[13px] text-[#5C5C5C] mt-1">{assignedStocks.length} stock item(s) assigned to this product order</p>
          </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const exportData = assignedStocks.map((row: any) => ({
                    "Stock ID": row.stockId ?? "",
                    "Linked WO": row.linkedWoId ?? "",
                    "Weight": row.weight ?? "",
                    "Width": row.width ?? "",
                    "Micron": row.micron ?? "",
                    "Grade": row.grade ?? "",
                    "Stage": row.stage ?? "",
                    "Assigned At": row.assignedAt ?? "",
                  }));
                  exportToExcel(exportData, `assigned-stocks-${detailpage}`, "Assigned Stocks");
                }}
                className="flex items-center gap-2 h-[40px] px-3 bg-white border border-[#EBEBEB] rounded-[6px] text-[14px] font-medium text-[#171717] hover:bg-gray-50 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={() => { setSelectedIds(new Set()); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Assign Stock</span>
                <span className="sm:hidden">Assign</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                <th className="px-5 py-3 text-[13px] font-medium text-left">Stock ID</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Linked WO</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Weight</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Width</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Micron</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Grade</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Stage</th>
                <th className="px-5 py-3 text-[13px] font-medium text-left">Assigned At</th>
                <th className="px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {assignedStocks.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-[14px] font-medium text-[#00B6E2]">{row.stockId}</td>
                  <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.linkedWoId}</td>
                  <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.weight}</td>
                  <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.width}</td>
                  <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.micron}</td>
                  <td className="px-5 py-4 text-[14px] font-medium text-[#171717]">{row.grade}</td>
                  <td className="px-5 py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-[6px] text-xs font-medium">{row.stage}</span></td>
                  <td className="px-5 py-4 text-[14px] text-[#5C5C5C]">{row.assignedAt}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => removeAssignedStock(row.id)} className="text-[#FB3748] hover:bg-[#FFF0F1] p-1.5 rounded-[6px] transition-colors" title="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {assignedStocks.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-[#5C5C5C] text-[14px]">No stocks assigned yet. Click "Assign Stock" to add matching grade stock.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
