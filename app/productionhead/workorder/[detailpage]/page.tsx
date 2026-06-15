"use client";

import { Search, Plus, X, ChevronRight, Check, Layers, Ruler, Weight, Package } from "lucide-react";
import { MobileHeader, MobileSpacer } from "@/components/MobileHeader";
import { use, useState, useMemo } from "react";
import { useStore } from "@/hooks/useStore";
import { computeWorkflowProgress } from "../../../../lib/data";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

type TabType = "Raw Material" | "Metallisation" | "Slitting";
type ModalStep = 1 | 2 | 3;

type RawMaterialForm = {
  rollNo: string;
  weight: string;
  thickness: string;
  supplier: string;
};

const micronOptions = ["2", "2.5", "3", "3.5", "4", "4.5", "4.5HT", "5", "5.5", "6", "6.5", "7", "7.5"];
const supplierOptions = ["VedaCap Industries", "ElectroForge Capacitors", "NextGen Metallic Pvt Ltd"];

function StatusBadge({ status }: { status: string }) {
  if (status === "Yet to Start") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF0F1] text-[#FB3748] text-[12px] font-medium leading-tight shrink-0">Yet to Start</span>;
  }
  if (status === "In-progress") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#FFF4ED] text-[#E19242] text-[12px] font-medium leading-tight shrink-0">In-progress</span>;
  }
  if (status === "Completed") {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#E8F8F0] text-[#1CB061] text-[12px] font-medium leading-tight shrink-0">Completed</span>;
  }
  return null;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

function hasPositiveNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0;
}

const defaultRawMaterialForm: RawMaterialForm = {
  rollNo: "",
  weight: "",
  thickness: micronOptions[0],
  supplier: supplierOptions[0],
};

function createRawMaterialRow(): RawMaterialForm {
  return { ...defaultRawMaterialForm };
}

const rawMaterialConfig: TableConfig<any> = {
  columns: [
    { key: "rollNo", label: "Roll No", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "thickness", label: "Thickness", type: "number", sortable: true },
    { key: "supplier", label: "Company/Supplier", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "enum", sortable: false, filter: "dropdown", options: ["Raw Material", "METALLISATION"] },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Yet to Start", "In-progress", "Completed"] },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

const metallisationConfig: TableConfig<any> = {
  columns: [
    { key: "coilNo", label: "Coil No.", type: "text", sortable: true },
    { key: "rmId", label: "RM ID", type: "text", sortable: true },
    { key: "machineNo", label: "Machine No.", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "number", sortable: true },
    { key: "opticalDensity", label: "Optical Density (OD)", type: "text", sortable: true },
    { key: "resistance", label: "Resistance", type: "text", sortable: true },
    { key: "timestamp", label: "Timestamp", type: "date", sortable: true },
    { key: "nextStage", label: "Next Stage", type: "text", sortable: false },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Yet to Start", "In-progress", "Completed"] },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

const slittingConfig: TableConfig<any> = {
  columns: [
    { key: "productNo", label: "Product No", type: "text", sortable: true },
    { key: "rmId", label: "RM ID", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "number", sortable: true },
    { key: "thickness", label: "Thickness", type: "number", sortable: true },
    { key: "grade", label: "Grade", type: "text", sortable: true },
    { key: "timestampAdded", label: "Timestamp Added", type: "date", sortable: true },
    { key: "stage", label: "Stage", type: "enum", sortable: false, filter: "dropdown", options: ["Slitting", "Completed"] },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: ["Yet to Start", "In-progress", "Completed"] },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

export default function SupervisorWorkOrderDetailPage({ params }: DetailPageProps) {
  const { detailpage } = use(params);
  const orderId = detailpage.toUpperCase();
  const { store, mounted, addFlowRow, updateFlowRowField } = useStore();
  const workOrderFlowData = store.flowDataMap[orderId];
  const workflowProgress = computeWorkflowProgress(workOrderFlowData);
  const [activeTab, setActiveTab] = useState<TabType>("Raw Material");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [showValidationHint, setShowValidationHint] = useState(false);
  const [rawMaterialRowsInput, setRawMaterialRowsInput] = useState<RawMaterialForm[]>([createRawMaterialRow()]);

  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case "Raw Material": return rawMaterialConfig;
      case "Metallisation": return metallisationConfig;
      case "Slitting": return slittingConfig;
      default: return rawMaterialConfig;
    }
  }, [activeTab]);

  const currentData = useMemo(() => {
    if (!workOrderFlowData) return [];
    switch (activeTab) {
      case "Raw Material": return workOrderFlowData.rawMaterialRows;
      case "Metallisation": return workOrderFlowData.metallisationRows;
      case "Slitting": return workOrderFlowData.slittingRows;
      default: return [];
    }
  }, [workOrderFlowData, activeTab]);

  const {
    processedData,
    sortConfig,
    handleSort,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange
  } = useTableControls({ data: currentData, config: currentConfig });

  if (!mounted) return null;
  if (!workOrderFlowData) return null;

  const isRawMaterialRowValid = (row: RawMaterialForm) => {
    return Boolean(
      row.rollNo.trim() &&
      hasPositiveNumber(row.weight) &&
      row.thickness.trim() &&
      row.supplier.trim(),
    );
  };

  const isStepOneValid = rawMaterialRowsInput.every(isRawMaterialRowValid);

  const resetModalState = () => {
    setModalStep(1);
    setShowValidationHint(false);
    setRawMaterialRowsInput([createRawMaterialRow()]);
  };

  const openModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const addCurrentItemToDraft = () => {
    if (!isStepOneValid) {
      setShowValidationHint(true);
      return;
    }
    setRawMaterialRowsInput((prev) => [...prev, createRawMaterialRow()]);
  };

  const updateRawMaterialRow = (index: number, patch: Partial<RawMaterialForm>) => {
    setRawMaterialRowsInput((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)));
  };

  const removeCurrentRow = (index: number) => {
    if (rawMaterialRowsInput.length === 1) return;
    setRawMaterialRowsInput((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitCurrentStage = () => {
    if (!isStepOneValid) {
      setShowValidationHint(true);
      return;
    }

    const payload = rawMaterialRowsInput;
    payload.forEach((item) => {
      addFlowRow(orderId, "Raw Material", {
        rollNo: item.rollNo || generateId("RM"),
        weight: `${item.weight || "0"}kgs`,
        thickness: item.thickness,
        supplier: item.supplier || "Unknown",
        stage: "METALLISATION",
        status: "Yet to Start",
      });
    });

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
      <div className="flex flex-col gap-4">
        {rawMaterialRowsInput.map((row, idx) => (
          <div key={`raw-step1-${idx}`} className="rounded-[12px] border border-[#DDE1E8] p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#344054]">Item {idx + 1}</p>
              {rawMaterialRowsInput.length > 1 && (
                <button type="button" onClick={() => removeCurrentRow(idx)} className="text-[12px] text-[#D92D20] hover:underline">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Roll No</label>
                <input value={row.rollNo} onChange={(e) => updateRawMaterialRow(idx, { rollNo: e.target.value })} onBlur={(e) => !e.target.value.trim() && updateRawMaterialRow(idx, { rollNo: generateId("RM") })} placeholder="Enter roll no" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Weight (Kgs)</label>
                <input type="number" min="0.1" step="0.1" value={row.weight} onChange={(e) => updateRawMaterialRow(idx, { weight: e.target.value })} placeholder="Enter weight" className="h-[42px] w-full rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Micron / Thickness</label>
                <select value={row.thickness} onChange={(e) => updateRawMaterialRow(idx, { thickness: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                  {micronOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Supplier</label>
                <select value={row.supplier} onChange={(e) => updateRawMaterialRow(idx, { supplier: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                  {supplierOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReviewCards = () => {
    const rows = rawMaterialRowsInput;
    return rows.map((item, idx) => (
      <div key={`raw-${idx}`} className="rounded-[12px] border border-[#78CFFA] bg-[#F4FBFF] p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-[#49526A]">
        <p>Roll No: {item.rollNo || "Auto"}</p>
        <p>Supplier: {item.supplier || "Unknown"}</p>
        <p>Micron: {item.thickness}</p>
        <p>Weight: {item.weight || "0"} kgs</p>
        <p>Stage: Metallisation</p>
      </div>
    ));
  };

  const renderModalBody = () => {
    if (modalStep === 1) {
      return (
        <div className="px-6 py-6 flex flex-col gap-5">
          {renderStepOneForm()}
          <button onClick={addCurrentItemToDraft} className="h-[42px] rounded-[8px] bg-[#00B6E2] text-white text-[15px] font-medium hover:bg-[#0092b5] transition-colors">
            Add Item
          </button>
          {showValidationHint && !isStepOneValid && (
            <p className="text-[12px] text-[#D92D20]">All input fields are mandatory before adding an item or moving to the next step.</p>
          )}
          <p className="text-[12px] text-[#667085]">Items queued for review: {rawMaterialRowsInput.length}</p>
        </div>
      );
    }

    if (modalStep === 2) {
      return (
        <div className="px-6 py-6 flex flex-col gap-5">
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
          <div className="w-16 h-16 rounded-full bg-[#E6F7FF] border border-[#9DDBF6] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#00B6E2] flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-[27px] leading-tight text-[#171717] font-semibold">Raw materials added successfully.</p>
          <p className="text-[15px] text-[#667085] max-w-[460px]">Store Head can now hand over these materials to Person A for processing.</p>
        </div>
      </div>
    );
  };

  const kpiStats = [
    { label: "Word Count", value: workOrderFlowData.overview.wordCount, icon: Layers },
    { label: "Micron", value: workOrderFlowData.overview.micron, icon: Ruler },
    { label: "Width", value: workOrderFlowData.overview.width, icon: Ruler },
    { label: "Quantity", value: workOrderFlowData.overview.quantity, icon: Package },
  ];

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col relative w-full lg:max-w-none pb-12 overflow-x-hidden">
      <MobileHeader title="Work Order Detail" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[860px] shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div className="flex flex-col gap-1">
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">Add Raw Material Details</h2>
                <p className="text-[15px] text-[#5C5C5C]">Specify raw material details for work order {orderId}</p>
              </div>
              <button onClick={closeModal} className="text-[#5C5C5C] hover:text-[#171717] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderStepHeader()}
            <div className="max-h-[58vh] overflow-y-auto">{renderModalBody()}</div>

            <div className="flex items-center justify-between gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              {modalStep === 1 && (
                <>
                  <button onClick={closeModal} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Cancel</button>
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
                  <button onClick={() => setModalStep(1)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Back</button>
                  <button
                    onClick={submitCurrentStage}
                    className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] transition-colors ${isStepOneValid ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}
                  >
                    Submit Details
                  </button>
                </>
              )}

              {modalStep === 3 && (
                <>
                  <button onClick={closeModal} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Go to Dashboard</button>
                  <button onClick={closeModal} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5] transition-colors">View Details</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats - Mobile 2x2 grid */}
      <section className="grid grid-cols-2 gap-0 md:hidden mx-4 mt-[72px] bg-white border border-[#EBEBEB] rounded-[12px]">
        {kpiStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-3 ${i % 2 === 0 ? 'border-r border-b border-[#EBEBEB]' : 'border-b border-[#EBEBEB]'} ${i >= 2 ? 'border-b-0' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#00B6E2]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-medium text-[#5C5C5C]">{stat.label}</p>
                  <span className="text-[16px] font-semibold text-[#171717]">{stat.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Additional detail info - Mobile */}
      <section className="md:hidden mx-4 mt-3 mb-2 flex flex-wrap gap-2">
        {[
          { label: "Stage", value: workflowProgress.stage },
          { label: "Date", value: workOrderFlowData.overview.date },
          { label: "Status", value: workflowProgress.status },
        ].map((field, idx) => (
          <div key={idx} className="flex items-center gap-1.5 bg-[#F5F7FA] rounded-[8px] px-3 py-1.5">
            <span className="text-[11px] text-[#5C5C5C]">{field.label}:</span>
            <span className="text-[12px] font-semibold text-[#171717]">
              {field.label === "Status" ? <StatusBadge status={field.value} /> : field.value}
            </span>
          </div>
        ))}
      </section>

      {/* KPI Stats - Desktop row */}
      <section className="hidden md:flex items-center gap-2 px-4 md:px-6 pt-6 mb-2">
        <span className="text-[14px] font-medium text-[#5C5C5C] leading-tight">Work Orders</span>
        <ChevronRight className="w-4 h-4 text-[#A1A1AA]" />
        <span className="text-[14px] font-medium text-[#00B6E2] leading-tight">{orderId}</span>
      </section>

      <section className="hidden md:grid grid-cols-1 lg:grid-cols-4 mx-4 md:mx-6 bg-white border border-[#EBEBEB] rounded-[12px] items-center p-5">
        {kpiStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-4 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#00B6E2]" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[12px] font-medium text-[#5C5C5C] leading-tight">{stat.label}</p>
                <span className="text-[14px] font-semibold text-[#171717]">{stat.value}</span>
              </div>
              {i < kpiStats.length - 1 && (
                <div className="hidden lg:block w-[1px] h-[37px] bg-[#EAECF0] ml-auto" />
              )}
            </div>
          );
        })}
      </section>

      {/* Additional detail info - Desktop */}
      <section className="hidden md:flex items-center gap-6 px-4 md:px-6 py-4 border-b border-[#EBEBEB] mx-4 md:mx-6">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#5C5C5C]">Stage:</span>
          <span className="text-[14px] font-semibold text-[#171717]">{workflowProgress.stage}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#5C5C5C]">Date:</span>
          <span className="text-[14px] font-semibold text-[#171717]">{workOrderFlowData.overview.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-[#5C5C5C]">Status:</span>
          <StatusBadge status={workflowProgress.status} />
        </div>
      </section>

      <section className="w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-[#EBEBEB] pb-4 overflow-x-auto overflow-y-hidden scrollbar-none">
          {(["Raw Material", "Metallisation", "Slitting"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-2 text-[13px] md:text-[14px] font-medium rounded-[8px] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab
                  ? "bg-[#00B6E2] text-white"
                  : "bg-white text-[#5C5C5C] hover:bg-[#F5F7FA]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-[291px] h-[40px] flex items-center border border-[#EBEBEB] rounded-[6px] px-[10px] gap-2 bg-white">
            <Search className="w-5 h-5 shrink-0 text-[#525866]" />
            <input type="text" placeholder="Search" className="w-full min-w-0 bg-transparent text-[14px] text-[#171717] placeholder:text-[#525866] focus:outline-none" />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => alert("Exporting data...")} />

            {activeTab === "Raw Material" && (
              <button onClick={openModal} className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-4 sm:px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 whitespace-nowrap w-full sm:w-auto">
                <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span className="leading-tight">Add Raw Material</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {currentConfig.columns.map((col) => (
                    <th key={String(col.key)} className="px-4 py-[11px]">
                      <SortableHeader column={col} sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {processedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    {currentConfig.columns.map((col) => {
                      if (String(col.key) === "options") {
                        return (
                          <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                            <span className="text-[12px] text-[#5C5C5C]">-</span>
                          </td>
                        );
                      }
                      if (String(col.key) === "status") {
                        return (
                          <td key={String(col.key)} className="px-4 py-4 whitespace-nowrap">
                            <StatusBadge status={row[col.key]} />
                          </td>
                        );
                      }
                      return (
                        <td key={String(col.key)} className={`px-4 py-4 text-[14px] ${col.key === "rollNo" ? "text-[#00B6E2] font-semibold" : "text-[#5C5C5C]"} whitespace-nowrap`}>
                          {row[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
