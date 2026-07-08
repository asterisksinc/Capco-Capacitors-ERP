"use client";

import { WO_STATUS_OPTIONS, WO_STAGE_OPTIONS } from "@/lib/constants";
import { StatusBadge } from "@/components/StatusBadge";
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
import { workOrderService } from "@/src/services/workOrderService";
import { productionStageService } from "@/src/services/productionStageService";
import { authService } from "@/src/services/authService";
import { useEffect } from "react";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

type TabType = "Raw Material" | "Metallisation";
type ModalStep = 1 | 2 | 3;

type MetallisationForm = {
  coilNo: string;
  rmId: string;
  machineNo: string;
  weight: string;
  opticalDensity: string;
  resistance: string;
  nextStage: string;
  isVerified?: boolean;
};

const rawMaterialConfig: TableConfig<any> = {
  columns: [
    { key: "rollNo", label: "Roll No", type: "text", sortable: true },
    { key: "netWeight", label: "Net Weight", type: "text", sortable: true },
    { key: "grossWeight", label: "Gross Weight", type: "text", sortable: true },
    { key: "thickness", label: "Micron", type: "text", sortable: true },
    { key: "width", label: "Width (m)", type: "text", sortable: true },
    { key: "temperature", label: "Temperature", type: "text", sortable: true },
    { key: "actualWeight", label: "Actual Weight", type: "text", sortable: true },
    { key: "damagedWeight", label: "Damaged Weight", type: "text", sortable: true },
    { key: "usedWeight", label: "Used Weight", type: "text", sortable: true },
    { key: "wastageWeight", label: "Wastage/Left Weight", type: "text", sortable: true },
    { key: "supplier", label: "Company/Supplier", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "enum", sortable: false, filter: "dropdown", options: ["Raw Material", "METALLISATION"] },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: WO_STATUS_OPTIONS },
    { key: "qr", label: "QR", type: "text", sortable: false },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

const metallisationConfig: TableConfig<any> = {
  columns: [
    { key: "coilNo", label: "Coil No.", type: "text", sortable: true },
    { key: "rmId", label: "RM ID", type: "text", sortable: true },
    { key: "machineNo", label: "Machine No.", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "opticalDensity", label: "Optical Density (OD)", type: "text", sortable: true },
    { key: "resistance", label: "Resistance", type: "text", sortable: true },
    { key: "timestamp", label: "Timestamp", type: "date", sortable: true },
    { key: "nextStage", label: "Next Stage", type: "text", sortable: false },
    { key: "status", label: "Status", type: "enum", sortable: false, filter: "dropdown", options: WO_STATUS_OPTIONS },
    { key: "qr", label: "QR", type: "text", sortable: false },
    { key: "options", label: "Action", type: "text", sortable: false },
  ],
};

const defaultMetallisationForm: MetallisationForm = {
  coilNo: "",
  rmId: "",
  machineNo: "M-01",
  weight: "",
  opticalDensity: "2.4",
  resistance: "1.5",
  nextStage: "Slitting",
};



function getDateString() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
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

function createMetallisationRow(defaultRmId: string): MetallisationForm {
  return {
    ...defaultMetallisationForm,
    coilNo: generateId("MC"),
    rmId: defaultRmId,
  };
}

export default function OperatorMetallisationDetailPage({ params }: DetailPageProps) {
  const { detailpage } = use(params);
  const orderId = detailpage.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [woData, setWoData] = useState<any>(null);

  const fetchWorkOrder = async () => {
    try {
      const data = await workOrderService.getByWorkOrderNo(orderId);
      if (data) {
        setWoData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrder();
  }, [orderId]);

  const workOrderFlowData = useMemo(() => {
    if (!woData) return null;
    return {
      overview: {
        wordCount: 1,
        micron: woData.micron ? `${woData.micron}µ` : "-",
        width: woData.width_m ? `${woData.width_m}m` : (woData.width ? `${woData.width}mm` : "-"),
        quantity: woData.quantity ? `${woData.quantity}kg` : "-",
        date: new Date(woData.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      },
      rawMaterialRows: (woData.work_order_materials || []).map((rm: any) => {
        const inv = rm.inventory || {};
        const actual = rm.quantity_kg ?? 0;
        return {
          rollNo: inv.raw_material_code || inv.roll_no || "-",
          raw_material_id: inv.id || rm.raw_material_id, // we need this for submission
          netWeight: inv.net_weight_kg != null ? `${inv.net_weight_kg}kgs` : "-",
          grossWeight: inv.gross_weight_kg != null ? `${inv.gross_weight_kg}kgs` : "-",
          thickness: inv.micron || "-",
          width: inv.width_m || "-",
          temperature: inv.temperature_c != null ? `${inv.temperature_c}°C` : "-",
          actualWeight: actual ? `${actual}kgs` : "-",
          damagedWeight: "0",
          usedWeight: actual ? `${actual}kgs` : "-",
          wastageWeight: "0",
          supplier: inv.supplier || "-",
          stage: "Raw Material",
          status: rm.status || "Completed",
        };
      }),
      metallisationRows: (woData.metallisation || []).map((met: any) => ({
        coilNo: met.metallisation_no || met.id,
        rmId: met.raw_material_id || "-",
        machineNo: met.machine_no || "-",
        weight: met.weight_kg || "0",
        opticalDensity: met.optical_density || "0",
        resistance: met.resistance_ohms || "0",
        timestamp: new Date(met.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        nextStage: "Slitting",
        status: met.status || "Completed",
      })),
    };
  }, [woData]);

  const workflowProgress = {
    stage: woData?.stage || "Raw Material",
    status: woData?.status || "Yet to Start",
  };

  const [activeTab, setActiveTab] = useState<TabType>("Raw Material");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [showValidationHint, setShowValidationHint] = useState(false);

  const availableRollIds: string[] = Array.from(new Set(workOrderFlowData?.rawMaterialRows
    .map((row: any) => row.rollNo) ?? [])) as string[];
  const rmLookup = useMemo(() => {
    const map = new Map<string, { weight: string; thickness: string; supplier: string, raw_material_id: string }>();
    for (const row of workOrderFlowData?.rawMaterialRows ?? []) {
      map.set(row.rollNo, { weight: row.netWeight ?? row.weight, thickness: row.thickness, supplier: row.supplier, raw_material_id: row.raw_material_id });
    }
    return map;
  }, [workOrderFlowData]);

  const [metallisationRowsInput, setMetallisationRowsInput] = useState<MetallisationForm[]>([createMetallisationRow("")]);
  type CapturedImage = { url: string; name: string; id: string };
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [qrData, setQrData] = useState<QRModalData | null>(null);

  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case "Raw Material": return rawMaterialConfig;
      case "Metallisation": return metallisationConfig;
      default: return rawMaterialConfig;
    }
  }, [activeTab]);

  const currentData = useMemo(() => {
    if (!workOrderFlowData) return [];
    switch (activeTab) {
      case "Raw Material": return workOrderFlowData.rawMaterialRows;
      case "Metallisation": return workOrderFlowData.metallisationRows;
      default: return [];
    }
  }, [workOrderFlowData, activeTab]);

  const {
    processedData,
    sortConfig,
    handleSort: handleSortRaw,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange,
  } = useTableControls({ data: currentData, config: currentConfig });

  const handleSort = handleSortRaw as (key: string | number | symbol) => void;

  if (loading) return <div className="p-6 text-center text-[#5C5C5C]">Loading details...</div>;
  if (!workOrderFlowData) return <div className="p-6 text-center text-[#5C5C5C]">Work Order not found</div>;

  const resetModalState = () => {
    setModalStep(1);
    setShowValidationHint(false);
    setCapturedImage(null);
    setMetallisationRowsInput([createMetallisationRow(availableRollIds[0] ?? "")]);
  };

  const openModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const isMetallisationRowValid = (row: MetallisationForm) => {
    return Boolean(
      row.coilNo.trim() &&
      row.rmId.trim() &&
      row.machineNo.trim() &&
      hasPositiveNumber(row.weight) &&
      row.opticalDensity.trim() &&
      row.resistance.trim() &&
      row.nextStage.trim(),
    );
  };

  const isCurrentStepOneValid = metallisationRowsInput.every(isMetallisationRowValid);

  const addCurrentItemToDraft = () => {
    if (!isCurrentStepOneValid) {
      setShowValidationHint(true);
      return;
    }
    setMetallisationRowsInput((prev) => [...prev, createMetallisationRow(availableRollIds[0] ?? "")]);
  };

  const updateMetallisationRow = (index: number, patch: Partial<MetallisationForm>) => {
    setMetallisationRowsInput((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)));
  };

  const removeCurrentRow = (index: number) => {
    if (metallisationRowsInput.length === 1) return;
    setMetallisationRowsInput((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitCurrentStage = async () => {
    if (!isCurrentStepOneValid) {
      setShowValidationHint(true);
      return;
    }

    try {
      const user = await authService.getCurrentProfile();
      const payload = metallisationRowsInput;

      for (const item of payload) {
        // Find raw_material_id from the rmLookup
        const rmData = rmLookup.get(item.rmId);

        await productionStageService.addMetallisation({
          metallisation_no: item.coilNo,
          work_order_id: woData.id,
          raw_material_id: rmData?.raw_material_id || "",
          machine_no: item.machineNo,
          weight_kg: parseFloat(item.weight) || 0,
          optical_density: parseFloat(item.opticalDensity) || 0,
          resistance_ohms: parseFloat(item.resistance) || 0,
          operator_id: user?.id,
        });
      }

      await workOrderService.update(woData.id, {
        stage: "Slitting",
        status: "In-progress"
      });

      setModalStep(3);
      fetchWorkOrder(); // Refresh data from backend
    } catch (err) {
      console.error(err);
      alert("Failed to save data");
    }
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
        {metallisationRowsInput.map((row, idx) => (
          <div key={`met-step1-${idx}`} className="rounded-[12px] border border-[#DDE1E8] p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#344054]">Item {idx + 1}</p>
              {metallisationRowsInput.length > 1 && (
                <button type="button" onClick={() => removeCurrentRow(idx)} className="text-[12px] text-[#D92D20] hover:underline">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Coil No.</label>
                <ScannerInput
                  value={row.coilNo}
                  onChange={(e) => updateMetallisationRow(idx, { coilNo: e.target.value })}
                  onScanData={(data) => updateMetallisationRow(idx, { coilNo: data })}
                  placeholder="Scan or enter coil no"
                  className="h-[42px] rounded-[8px] border border-[#DDE1E8] pl-[36px] px-3 text-[14px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">RM ID</label>
                <div className="relative flex flex-col gap-1">
                  <ScannerInput
                    isSelect
                    scanDisabled={!row.rmId}
                    value={row.rmId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const rm = rmLookup.get(id);
                      updateMetallisationRow(idx, {
                        rmId: id,
                        weight: rm?.weight ?? row.weight,
                        isVerified: true, // Marked as verified for prototyping purposes;
                      });
                    }}
                    onScanData={(data) => {
                      const cleanData = data.trim();
                      if (cleanData === row.rmId) {
                        updateMetallisationRow(idx, { isVerified: true });
                      } else {
                        alert(`Scanned barcode (${cleanData}) does not match selected RM ID (${row.rmId})`);
                      }
                    }}
                    className={`h-[42px] rounded-[8px] border pl-3 text-[14px] ${row.isVerified ? "border-[#12B76A] bg-[#ECFDF3]" : "border-[#DDE1E8]"}`}
                  >
                    <option value="" disabled>Select RM ID...</option>
                    {availableRollIds.map((rollId: string) => (
                      <option key={rollId} value={rollId}>{rollId}</option>
                    ))}
                  </ScannerInput>
                  {row.rmId && !row.isVerified && (
                    <span className="text-[11px] text-[#F79009]">Scan barcode to verify</span>
                  )}
                  {row.isVerified && (
                    <span className="text-[11px] text-[#12B76A] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Machine No.</label>
                <input value={row.machineNo} onChange={(e) => updateMetallisationRow(idx, { machineNo: e.target.value })} placeholder="Machine number" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Weight</label>
                <input value={row.weight} onChange={(e) => updateMetallisationRow(idx, { weight: e.target.value })} placeholder="Enter weight" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Optical Density</label>
                <input value={row.opticalDensity} onChange={(e) => updateMetallisationRow(idx, { opticalDensity: e.target.value })} placeholder="Enter optical density" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Resistance</label>
                <input value={row.resistance} onChange={(e) => updateMetallisationRow(idx, { resistance: e.target.value })} placeholder="Enter resistance" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Next Stage</label>
                <select value={row.nextStage} onChange={(e) => updateMetallisationRow(idx, { nextStage: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                  <option value="Slitting">Slitting</option>
                  <option value="Quality Check">Quality Check</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReviewCards = () => {
    const rows = metallisationRowsInput;
    return rows.map((item, idx) => (
      <div key={`met-${idx}`} className="rounded-[12px] border border-[#78CFFA] bg-[#F4FBFF] p-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-[#49526A]">
        <p>Coil No: {item.coilNo || "Auto"}</p>
        <p>RM ID: {item.rmId || "-"}</p>
        <p>Machine: {item.machineNo}</p>
        <p>Weight: {item.weight || "0"} kgs</p>
        <p>Optical Density: {item.opticalDensity}</p>
        <p>Resistance: {item.resistance}</p>
        <p>Next Stage: {item.nextStage}</p>
      </div>
    ));
  };

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-white flex flex-col relative overflow-x-hidden">
      <MobileHeader title="Work Orders details" />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm md:px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[95%] sm:max-w-[80%] shadow-lg flex flex-col overflow-hidden">
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
                  <div className="rounded-[12px] border border-[#DDE1E8] bg-white p-4 flex flex-col gap-3">
                    {!capturedImage ? (
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-medium text-[#171717]">Attach Image</label>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              id="cameraInput"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const ext = file.name.split('.').pop() || 'jpeg';
                                    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                                    setCapturedImage({
                                      url: ev.target?.result as string,
                                      name: `IMG_${Date.now()}.${ext}`,
                                      id: randomId
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label
                              htmlFor="cameraInput"
                              className="flex items-center justify-center gap-2 bg-[#F5F7FA] border border-[#DDE1E8] text-[#5C5C5C] text-[13px] font-medium rounded-[6px] h-[36px] px-3 hover:bg-[#EBEBEB] transition-colors cursor-pointer"
                            >
                              Take Photo
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start md:items-center justify-between gap-4 rounded-[8px]">
                        <div className="flex gap-2 flex-col md:flex-row">
                          <img src={capturedImage.url} alt="Preview" className="w-14 h-14 rounded-md border border-[#EBEBEB] object-cover shrink-0" />
                          <div className="flex flex-col gap-1">
                            <p className="text-[12px] md:text-[14px] font-semibold text-[#171717]">{capturedImage.name}</p>
                            <p className="text-[10px] md:text-[12px] text-[#6B7280]">ID: {capturedImage.id}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="text-[#5C5C5C] hover:text-[#171717] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {modalStep === 3 && (
                <div className="rounded-[16px] border border-[#D6EEF9] bg-[radial-gradient(circle_at_center,_#ECF8FD_0%,_#F8FCFF_45%,_#FFFFFF_100%)] p-10 flex flex-col items-center text-center gap-4">
                  <div className="w-13 md:w-16 h-13 md:h-16 rounded-full bg-[#E6F7FF] border border-[#9DDBF6] flex items-center justify-center">
                    <div className="w-7 md:w-10 h-7 md:h-10 rounded-full bg-[#00B6E2] flex items-center justify-center">
                      <Check className="w-4 md:w-6 h-4 md:h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-[18px] md:text-[27px] leading-tight text-[#171717] font-semibold">Details submitted successfully.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              {modalStep === 1 && (
                <>
                  <button onClick={closeModal} className="h-[40px] px-2 md:px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[10px] md:text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Cancel</button>
                  <div className="flex items-center gap-2">
                    <button onClick={addCurrentItemToDraft} className="h-[40px] px-2 md:px-4 bg-white border border-[#00B6E2] text-[#00B6E2] text-[10px] md:text-[14px] font-medium rounded-[6px] hover:bg-[#F0FDFF]">Add More Items</button>
                    <button onClick={() => { if (!isCurrentStepOneValid) { setShowValidationHint(true); return; } setModalStep(2); }} className={`h-[40px] px-2 md:px-5 text-[10px] md:text-[14px] font-medium rounded-[6px] ${isCurrentStepOneValid ? "bg-[#00B6E2] text-white hover:bg-[#0092b5]" : "bg-[#A7DDEB] text-white cursor-not-allowed"}`}>Next</button>
                  </div>
                </>
              )}
              {modalStep === 2 && (
                <>
                  <button onClick={() => setModalStep(1)} className="h-[40px] px-2 md:px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[10px] md:text-[14px] font-medium rounded-[6px] hover:bg-gray-50">Back</button>
                  <button onClick={submitCurrentStage} className="h-[40px] px-2 md:px-5 bg-[#00B6E2] text-white text-[10px] md:text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Submit Logs</button>
                </>
              )}
              {modalStep === 3 && (
                <button onClick={closeModal} className="h-[40px] px-2 md:px-5 bg-[#00B6E2] text-white text-[10px] md:text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5]">Done</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop breadcrumb */}
      <section className="bg-white border-b border-[#EBEBEB] hidden md:block">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px]">
            <Link href="/person-a-metallisation/workorder" className="text-[#5C5C5C] hover:text-black">Work Orders</Link>
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
                ...(activeTab === "Raw Material" ? {
                  "Roll No": row.rollNo ?? "",
                  "Net Weight": row.netWeight ?? row.weight ?? "",
                  "Gross Weight": row.grossWeight ?? "",
                  "Micron": row.thickness ?? "",
                  "Width (m)": row.width ?? "",
                  "Temperature": row.temperature ?? "",
                  "Supplier": row.supplier ?? "",
                  "Stage": row.stage ?? "",
                  "Status": row.status ?? "",
                } : {
                  "Coil No": row.coilNo ?? "",
                  "RM ID": row.rmId ?? "",
                  "Machine No": row.machineNo ?? "",
                  "Weight": row.weight ?? "",
                  "Optical Density": row.opticalDensity ?? "",
                  "Resistance": row.resistance ?? "",
                  "Timestamp": row.timestamp ?? "",
                  "Next Stage": row.nextStage ?? "",
                  "Status": row.status ?? "",
                })
              }));
              exportToExcel(exportData, `workorder-detail-${activeTab.toLowerCase().replace(/\s+/g, "-")}`, activeTab);
            }}
          />

          {activeTab !== "Raw Material" && (
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] h-[40px] px-[18px] hover:bg-[#0092b5] transition-colors shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              <span className="leading-tight truncate">
                Add Metallisation
              </span>
            </button>
          )}
        </div>

        {/* Scrollable tab bar on mobile */}
        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex items-center gap-2 border-b border-[#EBEBEB] pb-4 min-w-max">
            {["Raw Material", "Metallisation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`px-4 py-2 text-[14px] font-medium rounded-[8px] transition-colors whitespace-nowrap ${activeTab === tab
                  ? "bg-[#00B6E2] text-white"
                  : "bg-white text-[#5C5C5C] hover:bg-[#F5F7FA]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {currentConfig.columns.map((col) => (
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
                    {currentConfig.columns.map((col) => {
                      if (String(col.key) === "qr") {
                        const isRM = activeTab === "Raw Material";
                        const rowId = isRM ? (row as any).rollNo : (row as any).coilNo;
                        const qrType = isRM ? "RM" : "MC";
                        const qrDetails: Record<string, string> = isRM
                          ? { "Roll No": (row as any).rollNo ?? "", "Net Weight": (row as any).netWeight ?? (row as any).weight ?? "", "Gross Weight": (row as any).grossWeight ?? "-", "Micron": (row as any).thickness ?? "", "Width (m)": (row as any).width ?? "", "Temperature": (row as any).temperature ?? "-", "Supplier": (row as any).supplier ?? "", "Status": (row as any).status ?? "" }
                          : { "Coil No": (row as any).coilNo ?? "", "RM ID": (row as any).rmId ?? "", "Machine No": (row as any).machineNo ?? "", "Weight": (row as any).weight ?? "", "Status": (row as any).status ?? "" };
                        return (
                          <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => setQrData({ id: rowId, type: qrType, details: qrDetails })}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F5F7FA] transition-colors text-[#5C5C5C] hover:text-[#00B6E2]"
                              title="Show QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </td>
                        );
                      }
                      if (String(col.key) === "options") {
                        const isRM = activeTab === "Raw Material";
                        const rowId = isRM ? (row as any).rollNo : (row as any).coilNo;
                        const qrType = isRM ? "RM" : "MC";
                        const qrDetails: Record<string, string> = isRM
                          ? { "Roll No": (row as any).rollNo ?? "", "Net Weight": (row as any).netWeight ?? (row as any).weight ?? "", "Gross Weight": (row as any).grossWeight ?? "-", "Micron": (row as any).thickness ?? "", "Width (m)": (row as any).width ?? "", "Temperature": (row as any).temperature ?? "-", "Supplier": (row as any).supplier ?? "", "Status": (row as any).status ?? "" }
                          : { "Coil No": (row as any).coilNo ?? "", "RM ID": (row as any).rmId ?? "", "Machine No": (row as any).machineNo ?? "", "Weight": (row as any).weight ?? "", "Status": (row as any).status ?? "" };
                        return (
                          <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                            {activeTab !== "Raw Material" ? (
                              <OptionsDropdown
                                onEdit={() => alert(`Edit ${activeTab} Row ${idx}`)}
                                onDelete={() => alert(`Delete ${activeTab} Row ${idx}`)}
                                onQrCode={() => setQrData({ id: rowId, type: qrType, details: qrDetails })}
                                status={row.status}
                              />
                            ) : (
                              <button onClick={() => setQrData({ id: rowId, type: qrType, details: qrDetails })} className="text-[#5C5C5C] hover:text-[#00B6E2] transition-colors">
                                <QrCode className="w-4 h-4" />
                              </button>
                            )}
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
                      const val = row[col.key];
                      let displayVal = val;
                      if (activeTab === "Raw Material" && !val) {
                        const fallbackWeight = (row as any).netWeight ?? (row as any).weight ?? "-";
                        if (col.key === "actualWeight") displayVal = fallbackWeight;
                        else if (col.key === "usedWeight") displayVal = fallbackWeight;
                        else if (col.key === "damagedWeight") displayVal = "0.0kgs";
                        else if (col.key === "wastageWeight") displayVal = "0.0kgs";
                      }

                      return (
                        <td key={String(col.key)} className={`px-4 py-4 text-[14px] ${['rollNo', 'coilNo'].includes(String(col.key)) ? 'text-[#00B6E2] font-semibold' : 'text-[#5C5C5C]'} whitespace-nowrap`}>
                          {displayVal}
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
