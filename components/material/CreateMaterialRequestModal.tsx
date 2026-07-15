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
  const [formItems, setFormItems] = useState<MaterialRequestItem[]>([
    { productNo: "", weight: "", requestedQty: "", issuedQty: "0", grade: "" },
  ]);

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

  const handleSubmit = () => {
    let valid = true;
    if (mode === "work-order") {
      valid = formItems.every((item) => item.productNo.trim() && item.weight.trim());
    } else {
      valid = formItems.every((item) => item.weight.trim() && item.requestedQty.trim() && item.grade.trim());
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
          {formItems.map((item, idx) => (
            <div key={idx} className="border border-[#DDE1E8] rounded-[12px] p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold text-[#344054]">Item {idx + 1}</p>
                {formItems.length > 1 && (
                  <button onClick={() => removeFormItem(idx)} className="text-[12px] text-[#D92D20] hover:underline">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mode === "work-order" ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Work Order ID</label>
                      <select value={item.productNo} onChange={(e) => updateFormItem(idx, { productNo: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                        <option value="">Select Work Order...</option>
                        {workOrders.map((wo) => <option key={wo.id} value={wo.id}>{wo.work_order_no || wo.id}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Weight</label>
                      <input value={item.weight} onChange={(e) => updateFormItem(idx, { weight: e.target.value })} placeholder="Enter weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Weight</label>
                      <input value={item.weight} onChange={(e) => updateFormItem(idx, { weight: e.target.value })} placeholder="Enter weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Requested Qty</label>
                      <input type="number" min="1" value={item.requestedQty} onChange={(e) => updateFormItem(idx, { requestedQty: e.target.value })} placeholder="Qty" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium">Grade</label>
                      <select value={item.grade} onChange={(e) => updateFormItem(idx, { grade: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                        <option value="">Select grade</option>
                        <option value="A+">A+</option>
                        <option value="AA">AA</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <button onClick={addFormItem} className="h-[42px] rounded-[8px] bg-[#00B6E2] text-white text-[15px] font-medium hover:bg-[#0092b5] transition-colors">+ Add Item</button>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
          <button onClick={onClose} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Request</button>
        </div>
      </div>
    </div>
  );
}
