"use client";

import { X, Check } from "lucide-react";
import { useState, useMemo } from "react";

type ModalStep = 1 | 2 | 3;

interface IssueMaterialModalProps {
  onClose: () => void;
  onSubmit: (selectedIds: string[], totalWeight: number) => void;
  items: any[];
  requestedQty: number;
  itemType: "raw_material" | "metallisation";
}

export function IssueMaterialModal({
  onClose,
  onSubmit,
  items,
  requestedQty,
  itemType
}: IssueMaterialModalProps) {
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showValidationHint, setShowValidationHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addedWeight = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const item = items.find((i) => i.id === id);
      return sum + Number(item?.net_weight_kg ?? item?.weight_kg ?? item?.weight ?? 0);
    }, 0);
  }, [selectedIds, items]);

  const isStepOneValid = selectedIds.length > 0;

  const submitCurrentStage = async () => {
    if (!isStepOneValid) return;
    setIsSubmitting(true);
    await onSubmit(selectedIds, addedWeight);
    setIsSubmitting(false);
    setModalStep(3);
  };

  const renderStepHeader = () => {
    const labels = ["Input Details", "Review Overview", "Submit Details"];
    return (
      <div className="px-6 py-5 border-b border-[#EBEBEB]">
        <div className="flex items-center justify-between gap-2">
          {labels.map((label, index) => {
            const step = (index + 1) as ModalStep;
            const isDone = modalStep > step;
            const isActive = modalStep === step;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-1 min-w-[74px]">
                  <p className={`text-[11px] font-semibold ${isDone || isActive ? "text-[#00B6E2]" : "text-[#8B8BA2]"}`}>STEP {step}</p>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isDone ? "bg-[#00B6E2] border-[#00B6E2]" : isActive ? "border-[#00B6E2]" : "border-[#D4D4DB]"}`}>
                    {isDone ? <Check className="w-4 h-4 text-white" /> : <div className={`w-3 h-3 rounded-full ${isActive ? "bg-[#00B6E2]" : "bg-transparent"}`} />}
                  </div>
                  <p className={`text-[13px] text-center ${isDone || isActive ? "text-[#00B6E2] font-medium" : "text-[#6F6F85]"}`}>{label}</p>
                </div>
                {index < labels.length - 1 && <div className="h-px flex-1 bg-[#E5E7EB]" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepOneForm = () => {
    return (
      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-[13px] text-[#5C5C5C] text-center py-4">No matching inventory found for this request's micron and width.</p>
        )}
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const displayId = itemType === "raw_material" 
            ? (item.raw_material_code || item.roll_no || item.id)
            : (item.coil_no || item.metallisation_no || item.id);
          const weight = item.net_weight_kg ?? item.weight_kg ?? item.weight ?? "-";
          
          return (
            <label
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`flex flex-col gap-3 p-4 rounded-[8px] border transition-colors cursor-pointer ${isSelected
                ? "border-[#00B6E2] bg-[#F4FBFF]"
                : "border-[#DDE1E8] bg-white hover:border-[#A7DDEB]"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center shrink-0 ${isSelected ? "bg-[#00B6E2] border-[#00B6E2]" : "border-[#DDE1E8] bg-white"}`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-[14px] font-semibold text-[#171717]">{displayId}</span>
                </div>
                {item.status === "Returned" && (
                  <span className="px-2 py-0.5 bg-[#FFF0F0] text-[#FB3748] text-[11px] font-medium rounded-full border border-[#FB3748]/20">Returned</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-[13px] text-[#5C5C5C] pl-8">
                <span>Weight: <span className="font-medium text-[#171717]">{weight}kgs</span></span>
                <span className="w-[1px] h-3 bg-[#DDE1E8]"></span>
                <span>Width: <span className="font-medium text-[#171717]">{item.width ?? "-"}</span></span>
                <span className="w-[1px] h-3 bg-[#DDE1E8]"></span>
                <span>Micron: <span className="font-medium text-[#171717]">{item.micron ?? "-"}</span></span>
              </div>
            </label>
          );
        })}
      </div>
    );
  };

  const renderReviewCards = () => {
    const selectedItems = items.filter(i => selectedIds.includes(i.id));
    return selectedItems.map((item, idx) => {
      const net = item.net_weight_kg ?? item.weight_kg ?? item.weight ?? 0;
      const displayId = itemType === "raw_material" 
        ? (item.raw_material_code || item.roll_no || item.id)
        : (item.coil_no || item.metallisation_no || item.id);
      return (
        <div key={`raw-${idx}`} className="rounded-[12px] border border-[#78CFFA] bg-[#F4FBFF] p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-[#49526A]">
          <p>{itemType === "raw_material" ? "Raw Material ID:" : "Coil No:"} <span className="font-medium text-[#171717]">{displayId}</span></p>
          <p>Micron: <span className="font-medium text-[#171717]">{item.micron || "-"}</span></p>
          <p>Width: <span className="font-medium text-[#171717]">{item.width_m || "-"}</span></p>
          <p>Net Weight: <span className="font-medium text-[#171717]">{Number(net).toFixed(1)} kgs</span></p>
        </div>
      );
    });
  };

  const renderModalBody = () => {
    if (modalStep === 1) {
      return (
        <div className="px-6 py-6 flex flex-col gap-5 bg-[#FAFAFA]">
          {renderStepOneForm()}
          {showValidationHint && !isStepOneValid && (
            <p className="text-[12px] text-[#D92D20]">Please select at least one material to proceed.</p>
          )}
          <p className="text-[12px] text-[#667085]">Items queued for review: {selectedIds.length}</p>
        </div>
      );
    }

    if (modalStep === 2) {
      return (
        <div className="px-6 py-6 flex flex-col gap-5 bg-white">
          <div className="rounded-[10px] border border-[#DDE1E8] bg-[#FAFCFF] p-4">
            <p className="text-[15px] font-semibold text-[#1F2937] mb-1">Overview</p>
            <p className="text-[13px] text-[#6B7280]">Review all values before submitting to the workflow queue.</p>
          </div>
          {renderReviewCards()}
        </div>
      );
    }

    return (
      <div className="px-6 py-8">
        <div className="rounded-[16px] border border-[#D6EEF9] bg-[radial-gradient(circle_at_center,_#ECF8FD_0%,_#F8FCFF_45%,_#FFFFFF_100%)] p-8 md:p-10 flex flex-col items-center text-center gap-4">
          <div className="w-13 md:w-16 h-13 md:h-16 rounded-full bg-[#E6F7FF] border border-[#9DDBF6] flex items-center justify-center">
            <div className="w-7 md:w-10 h-7 md:h-10 rounded-full bg-[#00B6E2] flex items-center justify-center">
              <Check className="w-4 md:w-6 h-4 md:h-6 text-white" />
            </div>
          </div>
          <p className="text-[14px] lg:text-[27px] leading-tight text-[#171717] font-semibold">Material Issued Successfully.</p>
          <p className="text-[10px] lg:text-[15px] text-[#667085] max-w-[460px]">The requested items have been assigned and the workflow updated.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[16px] w-full max-w-[860px] shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <h2 className="text-[18px] md:text-[28px] leading-tight font-semibold text-[#171717]">Issue Material Details</h2>
              {modalStep === 1 && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#F5F7FA] text-[#5C5C5C] border border-[#EBEBEB] rounded-[6px] text-[12px] font-medium whitespace-nowrap">
                    Requested Wgt: {requestedQty}kg
                  </span>
                  <span className="px-2.5 py-1 bg-[#F4FBFF] text-[#00B6E2] border border-[#00B6E2]/20 rounded-[6px] text-[12px] font-medium whitespace-nowrap">
                    Added Wgt: {addedWeight}kg
                  </span>
                </div>
              )}
            </div>
            <p className="text-[11px] md:text-[15px] text-[#5C5C5C]">Select and confirm the materials to fulfill this request.</p>
          </div>
          <button onClick={onClose} className="text-[#5C5C5C] hover:text-[#171717] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderStepHeader()}
        <div className="max-h-[58vh] overflow-y-auto">{renderModalBody()}</div>

        <div className="flex items-center justify-between gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
          {modalStep === 1 && (
            <>
              <button onClick={onClose} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => {
                  if (!isStepOneValid) {
                    setShowValidationHint(true);
                    return;
                  }
                  setShowValidationHint(false);
                  setModalStep(2);
                }}
                className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] transition-colors ${isStepOneValid ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}
              >
                Next
              </button>
            </>
          )}

          {modalStep === 2 && (
            <>
              <button onClick={() => setModalStep(1)} disabled={isSubmitting} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Back</button>
              <button
                onClick={submitCurrentStage}
                disabled={isSubmitting || !isStepOneValid}
                className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] transition-colors flex items-center justify-center gap-2 ${isStepOneValid && !isSubmitting ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Details"}
              </button>
            </>
          )}

          {modalStep === 3 && (
            <div className="w-full flex justify-end">
              <button onClick={onClose} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5] transition-colors">Close Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
