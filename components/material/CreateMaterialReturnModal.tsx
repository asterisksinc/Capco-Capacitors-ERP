"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface CreateMaterialReturnModalProps {
  onClose: () => void;
  onSubmit: (formData: { materialId: string; weight: string; usedWeight: string; reason: string }) => void;
  materialOptions: { id: string; label: string; weight: string }[];
  title?: string;
  subtitle?: string;
  materialLabel?: string;
}

export function CreateMaterialReturnModal({ 
  onClose, 
  onSubmit, 
  materialOptions,
  title = "Return Material", 
  subtitle = "Return unused or defective material",
  materialLabel = "Material ID"
}: CreateMaterialReturnModalProps) {
  const [formData, setFormData] = useState({ materialId: "", weight: "", usedWeight: "", reason: "" });

  const handleSubmit = () => {
    if (!formData.materialId.trim() || !formData.weight.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <div>
            <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">{title}</h2>
            <p className="text-[15px] text-[#5C5C5C]">{subtitle}</p>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717]">{materialLabel}</label>
            <select value={formData.materialId} 
              onChange={(e) => {
                const id = e.target.value;
                const option = materialOptions.find(opt => opt.id === id);
                setFormData({ ...formData, materialId: id, weight: option ? option.weight : "" });
              }} 
              className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
              <option value="">Select...</option>
              {materialOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Original Weight</label>
              <input value={formData.weight} readOnly placeholder="Auto-fetched" className="h-[42px] rounded-[8px] border border-[#DDE1E8] bg-[#F8FAFC] px-3 text-[14px] text-[#5C5C5C]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#171717]">Used Weight</label>
              <input value={formData.usedWeight} onChange={(e) => setFormData({ ...formData, usedWeight: e.target.value })} placeholder="Used weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#171717]">Reason for Return</label>
            <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Describe reason for return" className="min-h-[80px] rounded-[8px] border border-[#DDE1E8] px-3 py-2 text-[14px] resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
          <button onClick={onClose} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Return</button>
        </div>
      </div>
    </div>
  );
}
