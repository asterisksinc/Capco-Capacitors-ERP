"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, X, ChevronRight, Check, QrCode } from "lucide-react";
import { FileText, Ruler, Maximize2, Package } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { ScannerInput } from "@/components/ScannerInput";
import { computeWorkflowProgress } from "@/lib/data";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { OptionsDropdown } from "@/components/table/OptionsDropdown";
import { MobileHeader } from "@/components/MobileHeader";
import { QRCodeModal, type QRModalData } from "@/components/QRCodeModal";
import { exportToExcel } from "@/lib/exportExcel";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

type TabType = "Winding";
type ModalStep = 1 | 2 | 3;

type WindingForm = {
  wdId: string;
  linkedPmId: string;
  filmWidth: string;
  windingTension: string;
  turnsCount: string;
  quantityWound: string;
};

const windingConfig: TableConfig<any> = {
  columns: [
    { key: "wdId", label: "WD-ID", type: "text", sortable: true },
    { key: "linkedPmId", label: "Linked PM-ID", type: "text", sortable: true },
    { key: "filmWidth", label: "Film Width", type: "text", sortable: true },
    { key: "windingTension", label: "Winding Tension", type: "text", sortable: true },
    { key: "turnsCount", label: "Turns Count", type: "text", sortable: true },
    { key: "quantityWound", label: "Quantity Wound", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "text", sortable: true },
    { key: "timestamp", label: "Timestamp", type: "date", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

const defaultWindingForm: WindingForm = {
  wdId: "",
  linkedPmId: "",
  filmWidth: "7mm",
  windingTension: "0.5 N",
  turnsCount: "",
  quantityWound: "",
};

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

function getDateTimeString() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function generateId(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}

function hasPositiveNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0;
}

function createWindingRow(): WindingForm {
  return {
    ...defaultWindingForm,
    wdId: generateId("WD"),
  };
}

export default function WindingDetailPage({ params }: DetailPageProps) {
  const { detailpage } = use(params);
  const orderId = detailpage.toUpperCase();
  const { store, mounted, addFlowRow } = useStore();
  const workOrderFlowData = store.flowDataMap[orderId];

  const [activeTab, setActiveTab] = useState<TabType>("Winding");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [showValidationHint, setShowValidationHint] = useState(false);
  const workflowProgress = computeWorkflowProgress(workOrderFlowData);

  const availablePmIds = Array.from(new Set(store.workOrders.flatMap((wo) => {
    const flow = store.flowDataMap[wo.id];
    return flow?.slittingRows.map((row) => row.productNo) ?? [];
  })));
  const pmLookup = useMemo(() => {
    const map = new Map<string, { weight: string; grade: string; micron: string; width: string }>();
    for (const wo of store.workOrders) {
      const flow = store.flowDataMap[wo.id];
      if (!flow) continue;
      for (const s of flow.slittingRows) {
        map.set(s.productNo, { weight: s.weight, grade: s.grade, micron: s.thickness, width: flow.overview.width });
      }
    }
    return map;
  }, [store.flowDataMap]);

  const [windingRowsInput, setWindingRowsInput] = useState<WindingForm[]>([createWindingRow()]);
  const [qrData, setQrData] = useState<QRModalData | null>(null);

  const currentData = useMemo(() => {
    if (!workOrderFlowData) return [];
    return workOrderFlowData.windingRows;
  }, [workOrderFlowData]);

  const {
    processedData,
    sortConfig,
    handleSort,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange
  } = useTableControls({ data: currentData as any[], config: windingConfig });

  if (!mounted || !workOrderFlowData) return null;

  const resetModalState = () => {
    setModalStep(1);
    setShowValidationHint(false);
    setWindingRowsInput([createWindingRow()]);
  };

  const openModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const isWindingRowValid = (row: WindingForm) => {
    return Boolean(
      row.wdId.trim() &&
      hasPositiveNumber(row.turnsCount) &&
      hasPositiveNumber(row.quantityWound)
    );
  };

  const isCurrentStepOneValid = windingRowsInput.every(isWindingRowValid);

  const addCurrentItemToDraft = () => {
    if (!isCurrentStepOneValid) {
      setShowValidationHint(true);
      return;
    }
    setWindingRowsInput((prev) => [...prev, createWindingRow()]);
  };

  const updateWindingRow = (index: number, patch: Partial<WindingForm>) => {
    setWindingRowsInput((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)));
  };

  const removeCurrentRow = (index: number) => {
    if (windingRowsInput.length === 1) return;
    setWindingRowsInput((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitCurrentStage = () => {
    if (!isCurrentStepOneValid) {
      setShowValidationHint(true);
      return;
    }

    const dateTime = getDateTimeString();
    const payload = windingRowsInput;
    payload.forEach((item) => {
      addFlowRow(orderId, "Winding", {
        wdId: item.wdId || generateId("WD"),
        linkedPmId: item.linkedPmId || "-",
        filmWidth: item.filmWidth,
        windingTension: item.windingTension,
        turnsCount: item.turnsCount,
        quantityWound: item.quantityWound,
        stage: "Spray",
        timestamp: dateTime,
        status: "In-progress"
      });
    });

    setModalStep(3);
  };

  const overviewFields = [
    { label: "Word Count", value: workOrderFlowData.overview.wordCount },
    { label: "Micron", value: workOrderFlowData.overview.micron },
    { label: "Width", value: workOrderFlowData.overview.width },
    { label: "Quantity", value: workOrderFlowData.overview.quantity },
    { label: "Stage", value: workflowProgress.stage },
    { label: "Date", value: workOrderFlowData.overview.date },
    { label: "Status", value: <StatusBadge status={workflowProgress.status} /> },
  ];

  const detailKpiStats = [
    { label: "Word Count", value: workOrderFlowData.overview.wordCount, icon: FileText, valClass: "text-[#171717]" },
    { label: "Micron", value: workOrderFlowData.overview.micron, icon: Ruler, valClass: "text-[#171717]" },
    { label: "Width", value: workOrderFlowData.overview.width, icon: Maximize2, valClass: "text-[#171717]" },
    { label: "Quantity", value: workOrderFlowData.overview.quantity, icon: Package, valClass: "text-[#171717]" },
  ];

  const detailChips = [
    { label: "Stage", value: workflowProgress.stage },
    { label: "Date", value: workOrderFlowData.overview.date },
    { label: "Status", value: <StatusBadge status={workflowProgress.status} /> },
  ];

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
        {windingRowsInput.map((row, idx) => (
          <div key={`wind-step1-${idx}`} className="rounded-[12px] border border-[#DDE1E8] p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#344054]">Item {idx + 1}</p>
              {windingRowsInput.length > 1 && (
                <button type="button" onClick={() => removeCurrentRow(idx)} className="text-[12px] text-[#D92D20] hover:underline">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">WD ID</label>
                <ScannerInput
                  value={row.wdId}
                  onChange={(e) => updateWindingRow(idx, { wdId: e.target.value })}
                  onScanData={(data) => updateWindingRow(idx, { wdId: data })}
                  placeholder="Scan or enter WD ID"
                  className="h-[42px] rounded-[8px] border border-[#DDE1E8] pl-[36px] px-3 text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Linked PM-ID (Product Material)</label>
                <ScannerInput 
                  value={row.linkedPmId} 
                  onChange={(e) => {
                    const id = e.target.value;
                    const pm = pmLookup.get(id);
                    updateWindingRow(idx, {
                      linkedPmId: id,
                      filmWidth: pm?.width ?? row.filmWidth,
                    });
                  }}
                  onScanData={(data) => {
                    const pm = pmLookup.get(data);
                    updateWindingRow(idx, {
                      linkedPmId: data,
                      filmWidth: pm?.width ?? row.filmWidth,
                    });
                  }}
                  list={`pm-list-${idx}`}
                  placeholder="Scan PM ID..."
                  className="h-[42px] rounded-[8px] border border-[#DDE1E8] pl-3 text-[14px]"
                />
                <datalist id={`pm-list-${idx}`}>
                  {availablePmIds.map((pmId) => (
                    <option key={pmId} value={pmId}>{pmId}</option>
                  ))}
                </datalist>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Film Width</label>
                <input value={row.filmWidth} onChange={(e) => updateWindingRow(idx, { filmWidth: e.target.value })} placeholder="Width" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Winding Tension</label>
                <input value={row.windingTension} onChange={(e) => updateWindingRow(idx, { windingTension: e.target.value })} placeholder="Tension" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Turns Count</label>
                <input value={row.turnsCount} onChange={(e) => updateWindingRow(idx, { turnsCount: e.target.value })} placeholder="Turns count" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Quantity Wound</label>
                <input value={row.quantityWound} onChange={(e) => updateWindingRow(idx, { quantityWound: e.target.value })} placeholder="Quantity wound" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReviewCards = () => {
    return windingRowsInput.map((item, idx) => (
      <div key={`wind-${idx}`} className="rounded-[12px] border border-[#78CFFA] bg-[#F4FBFF] p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-[#49526A]">
        <p>WD ID: {item.wdId || "Auto"}</p>
        <p>Linked PM-ID: {item.linkedPmId || "-"}</p>
        <p>Film Width: {item.filmWidth}</p>
        <p>Winding Tension: {item.windingTension}</p>
        <p>Turns Count: {item.turnsCount}</p>
        <p>Quantity Wound: {item.quantityWound}</p>
      </div>
    ));
  };

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col relative overflow-x-hidden">
      <MobileHeader title="Work Orders details" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[80%] shadow-lg flex flex-col overflow-hidden">
            {renderStepHeader()}
            
            <div className="max-h-[58vh] overflow-y-auto px-6 py-5">
              {modalStep === 1 && renderStepOneForm()}
              {modalStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-[10px] border border-[#DDE1E8] bg-[#FAFCFF] p-4">
                    <p className="text-[15px] font-semibold text-[#1F2937] mb-1">Review Overview</p>
                    <p className="text-[13px] text-[#6B7280]">Review details before saving to logs.</p>
                  </div>
                  {renderReviewCards()}
                </div>
              )}
              {modalStep === 3 && (
                <div className="rounded-[16px] border border-[#D6EEF9] bg-[radial-gradient(circle_at_center,_#ECF8FD_0%,_#F8FCFF_45%,_#FFFFFF_100%)] p-10 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E6F7FF] border border-[#9DDBF6] flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#00B6E2] flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-[27px] leading-tight text-[#171717] font-semibold">Details submitted successfully.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              {modalStep === 1 && (
                <>
                  <button onClick={closeModal} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
                  <div className="flex items-center gap-2">
                    <button onClick={addCurrentItemToDraft} className="h-[40px] px-4 bg-white border border-[#00B6E2] text-[#00B6E2] text-[14px] font-medium rounded-[6px] hover:bg-[#F0FDFF]">Add More Items</button>
                    <button onClick={() => { if (!isCurrentStepOneValid) { setShowValidationHint(true); return; } setModalStep(2); }} className={`h-[40px] px-5 text-[14px] font-medium rounded-[6px] ${isCurrentStepOneValid ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}>Next</button>
                  </div>
                </>
              )}
              {modalStep === 2 && (
                <>
                  <button onClick={() => setModalStep(1)} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Back</button>
                  <button onClick={submitCurrentStage} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Logs</button>
                </>
              )}
              {modalStep === 3 && (
                <button onClick={closeModal} className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Done</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop breadcrumb */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px]">
            <Link href="/person-b-winding/workorder" className="text-[#5C5C5C] hover:text-black">Work Orders</Link>
            <ChevronRight className="w-4 h-4 text-[#8B8BA2]" />
            <span className="text-[#00B6E2] font-medium">Work order Details</span>
          </div>
        </div>
      </section>

      {/* Mobile KPI section */}
      <section className="grid grid-cols-2 gap-0 md:hidden mx-4 mt-[72px] bg-white border border-[#EBEBEB] rounded-[12px]">
        {detailKpiStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-3 ${i % 2 === 0 ? 'border-r border-b border-[#EBEBEB]' : 'border-b border-[#EBEBEB]'} ${i >= 2 ? 'border-b-0' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E6F8FD] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#00B6E2]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-medium text-[#5C5C5C]">{stat.label}</p>
                  <span className={`text-[16px] font-semibold ${stat.valClass}`}>{stat.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mobile detail chips */}
      <section className="md:hidden mx-4 mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {detailChips.map((chip, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#5C5C5C]">{chip.label}:</span>
            <span className="text-[12px] font-semibold text-[#171717]">{chip.value}</span>
          </div>
        ))}
      </section>

      {/* Desktop overview row */}
      <section className="hidden md:flex w-full px-4 md:px-6 py-6 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-6 w-full">
          {overviewFields.map((field, idx) => (
            <div key={idx} className="flex flex-col gap-[6px] min-w-0">
              <span className="text-[12px] font-normal text-[#5C5C5C] leading-tight whitespace-nowrap">{field.label}</span>
              <div className="text-[14px] font-semibold text-[#171717] leading-tight flex items-center h-5">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-4 md:px-6 py-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TableToolbar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onExport={() => {
              const exportData = currentData.map((row: any) => ({
                "WD ID": row.wdId ?? "",
                "Linked PM ID": row.linkedPmId ?? "",
                "Film Width": row.filmWidth ?? "",
                "Winding Tension": row.windingTension ?? "",
                "Turns Count": row.turnsCount ?? "",
                "Quantity Wound": row.quantityWound ?? "",
                "Stage": row.stage ?? "",
                "Timestamp": row.timestamp ?? "",
              }));
              exportToExcel(exportData, "workorder-detail-winding", "Winding");
            }}
          />

          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            <span className="leading-tight truncate">
              Add Winding
            </span>
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex items-center gap-2 border-b border-[#EBEBEB] pb-4 min-w-max">
            <button className="px-4 py-2 text-[14px] font-medium rounded-[8px] bg-[#00B6E2] text-white whitespace-nowrap">
              Winding
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {windingConfig.columns.map((col) => (
                    <th key={String(col.key)} className="px-4 py-[11px]">
                      <SortableHeader
                        column={col}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {processedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    {windingConfig.columns.map((col) => {
                      if (String(col.key) === "options") {
                        return (
                          <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                            <OptionsDropdown
                              onEdit={() => alert(`Edit Winding Row ${idx}`)}
                              onDelete={() => alert(`Delete Winding Row ${idx}`)}
                              onQrCode={() => setQrData({ id: (row as any).wdId, type: "WD", details: { "WD ID": (row as any).wdId ?? "", "Linked PM ID": (row as any).linkedPmId ?? "", "Film Width": (row as any).filmWidth ?? "", "Quantity Wound": (row as any).quantityWound ?? "", "Status": (row as any).status ?? "" } })}
                              status={row.status}
                            />
                          </td>
                        );
                      }
                      return (
                        <td key={String(col.key)} className={`px-4 py-4 text-[14px] ${col.key === 'wdId' ? 'text-[#00B6E2] font-semibold' : 'text-[#5C5C5C]'} whitespace-nowrap`}>
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
      {qrData && <QRCodeModal id={qrData.id} type={qrData.type} details={qrData.details} onClose={() => setQrData(null)} />}
    </div>
  );
}
