"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { MaterialRequestItem } from "@/lib/data";

interface CreateMaterialRequestModalProps {
  onClose: () => void;
  onSubmit: (items: any[]) => void;
  title?: string;
  subtitle?: string;
  mode?: "default" | "work-order";
  workOrders?: any[];
}

export function CreateMaterialRequestModal({ 
  onClose, 
  onSubmit, 
  title = "Material Request", 
  subtitle = "Request materials from stock",
  mode = "default",
  workOrders = [],
}: CreateMaterialRequestModalProps) {
  const [formItems, setFormItems] = useState<any[]>([
    { productNo: "", requestedQty: "" },
  ]);

  const addFormItem = () => {
    setFormItems([...formItems, { productNo: "", requestedQty: "" }]);
  };

  const updateFormItem = (idx: number, patch: any) => {
    setFormItems(formItems.map((item, i) => i === idx ? { ...item, ...patch } : item));
  };

  const removeFormItem = (idx: number) => {
    if (formItems.length === 1) return;
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    let valid = true;
    if (mode === "work-order") {
      valid = formItems.every((item) => item.productNo.trim() && item.requestedQty.trim());
    } else {
      valid = formItems.every((item) => item.productNo.trim() && item.requestedQty.trim());
    }
    if (!valid) return;
    onSubmit(formItems.map((item) => ({ ...item, issuedQty: "0" })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[16px] w-full max-w-[700px] shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <div>
            <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">{title}</h2>
            <p className="text-[15px] text-[#5C5C5C]">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto flex flex-col gap-4">
          <div className="border border-[#DDE1E8] rounded-[12px] p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium">Work Order ID</label>
                <select value={formItems[0].productNo} onChange={(e) => updateFormItem(0, { productNo: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                  <option value="">Select Work Order...</option>
                  {workOrders.map((wo) => <option key={wo.id} value={wo.id}>{wo.work_order_no || wo.id}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium">Requested Qty</label>
                <input type="number" min="1" value={formItems[0].requestedQty} onChange={(e) => updateFormItem(0, { requestedQty: e.target.value })} placeholder="Enter quantity" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
          <button onClick={onClose} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Request</button>
        </div>
      </div>
    </div>
  );
}
