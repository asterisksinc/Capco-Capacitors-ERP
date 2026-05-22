"use client";

import { use, useState, useMemo } from "react";
import { Plus, X, Check } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { TableConfig } from "@/hooks/useTableControls";
import { useTableControls } from "@/hooks/useTableControls";
import { SortableHeader } from "@/components/table/SortableHeader";
import { TableToolbar } from "@/components/table/TableToolbar";
import { OptionsDropdown } from "@/components/table/OptionsDropdown";

type DetailPageProps = {
  params: Promise<{ detailpage: string }>;
};

type TabType = "Product Material" | "Metallisation" | "Slitting" | "Winding" | "Spray";
type ModalStep = 1 | 2;

type WindingForm = {
  wdId: string;
  linkedPmId: string;
  filmWidth: string;
  windingTension: string;
  turnsCount: string;
  quantityWound: string;
};

type SprayForm = {
  spId: string;
  linkedWdId: string;
  sprayType: string;
  feedRate: string;
  pressureSitting: string;
};

const productMaterialConfig: TableConfig<any> = {
  columns: [
    { key: "stockId", label: "Stock ID", type: "text", sortable: true },
    { key: "linkedWoId", label: "Linked WO ID", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "width", label: "Width", type: "text", sortable: true },
    { key: "micron", label: "Micron", type: "text", sortable: true },
    { key: "grade", label: "Grade", type: "text", sortable: true },
    { key: "handoverBy", label: "Handover By", type: "text", sortable: true },
    { key: "timestamp", label: "Assigned At", type: "text", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
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
    { key: "timestamp", label: "Timestamp", type: "text", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

const metallisationConfig: TableConfig<any> = {
  columns: [
    { key: "coilNo", label: "Coil No.", type: "text", sortable: true },
    { key: "rmId", label: "RM ID", type: "text", sortable: true },
    { key: "machineNo", label: "Machine No.", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "opticalDensity", label: "Optical Density", type: "text", sortable: true },
    { key: "resistance", label: "Resistance", type: "text", sortable: true },
    { key: "nextStage", label: "Next Stage", type: "text", sortable: true },
    { key: "timestamp", label: "Timestamp", type: "text", sortable: true },
    { key: "status", label: "Status", type: "text", sortable: true },
  ]
};

const slittingConfig: TableConfig<any> = {
  columns: [
    { key: "productNo", label: "Product No", type: "text", sortable: true },
    { key: "rmId", label: "RM ID", type: "text", sortable: true },
    { key: "weight", label: "Weight", type: "text", sortable: true },
    { key: "thickness", label: "Thickness", type: "text", sortable: true },
    { key: "grade", label: "Grade", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "text", sortable: true },
    { key: "timestampAdded", label: "Timestamp", type: "text", sortable: true },
    { key: "status", label: "Status", type: "text", sortable: true },
  ]
};

const sprayConfig: TableConfig<any> = {
  columns: [
    { key: "spId", label: "SP-ID", type: "text", sortable: true },
    { key: "linkedWdId", label: "Linked WD-ID", type: "text", sortable: true },
    { key: "sprayType", label: "Spray Type", type: "text", sortable: true },
    { key: "feedRate", label: "Feed Rate", type: "text", sortable: true },
    { key: "pressureSitting", label: "Pressure Sitting", type: "text", sortable: true },
    { key: "stage", label: "Stage", type: "text", sortable: true },
    { key: "timestamp", label: "Timestamp", type: "text", sortable: true },
    { key: "options", label: "Action", type: "text", sortable: false }
  ]
};

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

export default function PersonBProductOrderDetail({ params }: DetailPageProps) {
  const { detailpage } = use(params);
  const displayId = (detailpage || "PO-0001").toUpperCase();
  const { store, mounted, addFlowRow, getAssignedStocks } = useStore();

  const productOrder = store.productOrders.find((po) => po.id.replace("#", "").toUpperCase() === displayId);
  const poId = productOrder?.id ?? displayId;
  const [activeTab, setActiveTab] = useState<TabType>("Product Material");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [showValidationHint, setShowValidationHint] = useState(false);

  const [windingForm, setWindingForm] = useState<WindingForm>({
    wdId: generateId("WD"), linkedPmId: "", filmWidth: "7mm", windingTension: "0.5 N", turnsCount: "", quantityWound: ""
  });
  const [sprayForm, setSprayForm] = useState<SprayForm>({
    spId: generateId("SP"), linkedWdId: "", sprayType: "Zinc-spray", feedRate: "", pressureSitting: ""
  });
  const [modalImage, setModalImage] = useState<string | null>(null);

  const assignedStocks = useMemo(() => getAssignedStocks(poId), [store.assignments, poId, mounted]);

  const pmLookup = useMemo(() => {
    const map = new Map<string, { weight: string; grade: string; micron: string; width: string }>();
    for (const s of assignedStocks) {
      map.set(s.stockId, { weight: s.weight, grade: s.grade, micron: s.micron, width: s.width });
    }
    return map;
  }, [assignedStocks]);

  const wdLookup = useMemo(() => {
    const map = new Map<string, { filmWidth: string; windingTension: string; turnsCount: string; quantityWound: string }>();
    for (const [, flow] of Object.entries(store.flowDataMap)) {
      for (const w of flow.windingRows) {
        map.set(w.wdId, { filmWidth: w.filmWidth, windingTension: w.windingTension, turnsCount: w.turnsCount, quantityWound: w.quantityWound });
      }
    }
    return map;
  }, [store.flowDataMap]);

  const assignedPmIds = useMemo(() => new Set(assignedStocks.map((s) => s.stockId)), [assignedStocks]);

  const linkedWoIds = useMemo(() => {
    return Array.from(new Set(assignedStocks.map((s) => s.linkedWoId).filter(Boolean)));
  }, [assignedStocks]);

  const metallisationData = useMemo(() => {
    if (!mounted) return [];
    const rows: any[] = [];
    for (const woId of linkedWoIds) {
      const flow = store.flowDataMap[woId];
      if (!flow) continue;
      for (const row of flow.metallisationRows) {
        rows.push({ id: row.coilNo, ...row });
      }
    }
    return rows;
  }, [store.flowDataMap, mounted, linkedWoIds]);

  const slittingData = useMemo(() => {
    if (!mounted) return [];
    const rows: any[] = [];
    for (const woId of linkedWoIds) {
      const flow = store.flowDataMap[woId];
      if (!flow) continue;
      for (const row of flow.slittingRows) {
        rows.push({ id: row.productNo, ...row });
      }
    }
    return rows;
  }, [store.flowDataMap, mounted, linkedWoIds]);

  const stockData = useMemo(() => {
    if (!mounted) return [];
    return assignedStocks.map((s) => ({
      id: s.stockId,
      stockId: s.stockId,
      linkedWoId: s.linkedWoId,
      weight: s.weight,
      width: s.width,
      micron: s.micron,
      grade: s.grade,
      handoverBy: "Person A",
      timestamp: s.assignedAt,
    }));
  }, [assignedStocks, mounted]);

  const windingData = useMemo(() => {
    if (!mounted) return [];
    const rows: any[] = [];
    for (const [, flow] of Object.entries(store.flowDataMap)) {
      for (const wRow of flow.windingRows) {
        if (assignedPmIds.has(wRow.linkedPmId)) {
          rows.push({ id: wRow.wdId, ...wRow });
        }
      }
    }
    return rows;
  }, [store.flowDataMap, mounted, assignedPmIds]);

  const poWdIds = useMemo(() => new Set(windingData.map((r) => r.wdId)), [windingData]);

  const sprayData = useMemo(() => {
    if (!mounted) return [];
    const rows: any[] = [];
    for (const [, flow] of Object.entries(store.flowDataMap)) {
      for (const sRow of flow.sprayRows) {
        if (poWdIds.has(sRow.linkedWdId)) {
          rows.push({ id: sRow.spId, ...sRow });
        }
      }
    }
    return rows;
  }, [store.flowDataMap, mounted, poWdIds]);

  const availablePmIds = Array.from(assignedPmIds);
  const availableWdIds = Array.from(poWdIds);

  const currentConfig = useMemo(() => {
    switch (activeTab) {
      case "Product Material": return productMaterialConfig;
      case "Metallisation": return metallisationConfig;
      case "Slitting": return slittingConfig;
      case "Winding": return windingConfig;
      case "Spray": return sprayConfig;
      default: return productMaterialConfig;
    }
  }, [activeTab]);

  const currentData = useMemo(() => {
    switch (activeTab) {
      case "Product Material": return stockData;
      case "Metallisation": return metallisationData;
      case "Slitting": return slittingData;
      case "Winding": return windingData;
      case "Spray": return sprayData;
      default: return [];
    }
  }, [activeTab, stockData, metallisationData, slittingData, windingData, sprayData]);

  const {
    processedData,
    sortConfig,
    handleSort,
    filters,
    handleFilterChange,
    dateRange,
    setDateRange
  } = useTableControls({ data: currentData, config: currentConfig });

  const openWindingModal = () => {
    setWindingForm({ wdId: generateId("WD"), linkedPmId: "", filmWidth: "7mm", windingTension: "0.5 N", turnsCount: "", quantityWound: "" });
    setModalStep(1);
    setShowValidationHint(false);
    setIsModalOpen(true);
  };

  const openSprayModal = () => {
    setSprayForm({ spId: generateId("SP"), linkedWdId: "", sprayType: "Zinc-spray", feedRate: "", pressureSitting: "" });
    setModalStep(1);
    setShowValidationHint(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setShowValidationHint(false);
    setModalImage(null);
  };

  const isWindingValid = () => {
    return Boolean(
      windingForm.linkedPmId.trim() &&
      hasPositiveNumber(windingForm.turnsCount) &&
      hasPositiveNumber(windingForm.quantityWound)
    );
  };

  const isSprayValid = () => {
    return Boolean(
      sprayForm.linkedWdId.trim() &&
      sprayForm.sprayType.trim() &&
      hasPositiveNumber(sprayForm.feedRate) &&
      hasPositiveNumber(sprayForm.pressureSitting)
    );
  };

  const targetWoId = useMemo(() => {
    const fromAssigned = assignedStocks[0]?.linkedWoId;
    if (fromAssigned && store.flowDataMap[fromAssigned]) return fromAssigned;
    return Object.keys(store.flowDataMap)[0] || "WO-PO";
  }, [assignedStocks, store.flowDataMap]);

  const submitWinding = () => {
    if (!isWindingValid()) {
      setShowValidationHint(true);
      return;
    }
    addFlowRow(targetWoId, "Winding", {
      wdId: windingForm.wdId,
      linkedPmId: windingForm.linkedPmId,
      filmWidth: windingForm.filmWidth,
      windingTension: windingForm.windingTension,
      turnsCount: windingForm.turnsCount,
      quantityWound: windingForm.quantityWound,
      stage: "Spray",
      timestamp: getDateTimeString(),
      status: "Completed",
    });
    closeModal();
  };

  const submitSpray = () => {
    if (!isSprayValid()) {
      setShowValidationHint(true);
      return;
    }
    addFlowRow(targetWoId, "Spray", {
      spId: sprayForm.spId,
      linkedWdId: sprayForm.linkedWdId,
      sprayType: sprayForm.sprayType,
      feedRate: sprayForm.feedRate,
      pressureSitting: sprayForm.pressureSitting,
      stage: "Moved to Person C",
      timestamp: getDateTimeString(),
      status: "Completed",
    });
    closeModal();
  };

  if (!mounted) return null;

  return (
    <div className="font-dm-sans min-h-[calc(100vh-72px)] bg-[#FAFAFA] flex flex-col relative w-full pt-[72px] md:pt-0 pb-10">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[16px] w-full max-w-[700px] shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
              <div className="flex flex-col gap-1">
                <h2 className="text-[28px] leading-tight font-semibold text-[#171717]">
                  Add {activeTab === "Winding" ? "Winding" : "Spray"} Record
                </h2>
                <p className="text-[15px] text-[#5C5C5C]">Enter details for {displayId}</p>
              </div>
              <button onClick={closeModal} className="text-[#5C5C5C] hover:text-[#171717] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 flex flex-col gap-5">
              {activeTab === "Winding" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">WD-ID</label>
                    <input value={windingForm.wdId} readOnly className="h-[42px] rounded-[8px] border border-[#DDE1E8] bg-[#F8FAFC] px-3 text-[14px] text-[#5C5C5C]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Linked PM-ID</label>
                    <select value={windingForm.linkedPmId} onChange={(e) => {
                      const id = e.target.value;
                      const pm = pmLookup.get(id);
                      setWindingForm({ ...windingForm, linkedPmId: id });
                    }} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                      <option value="">Select PM-ID</option>
                      {availablePmIds.map((id) => <option key={id} value={id}>{id}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Film Width</label>
                    <input value={windingForm.filmWidth} onChange={(e) => setWindingForm({ ...windingForm, filmWidth: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Winding Tension</label>
                    <input value={windingForm.windingTension} onChange={(e) => setWindingForm({ ...windingForm, windingTension: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Turns Count</label>
                    <input type="number" min="1" value={windingForm.turnsCount} onChange={(e) => setWindingForm({ ...windingForm, turnsCount: e.target.value })} placeholder="Enter turns count" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Quantity Wound</label>
                    <input type="number" min="1" value={windingForm.quantityWound} onChange={(e) => setWindingForm({ ...windingForm, quantityWound: e.target.value })} placeholder="Enter quantity wound" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">SP-ID</label>
                    <input value={sprayForm.spId} readOnly className="h-[42px] rounded-[8px] border border-[#DDE1E8] bg-[#F8FAFC] px-3 text-[14px] text-[#5C5C5C]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Linked WD-ID</label>
                    <select value={sprayForm.linkedWdId} onChange={(e) => {
                      const id = e.target.value;
                      const wd = wdLookup.get(id);
                      setSprayForm({ ...sprayForm, linkedWdId: id });
                    }} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]">
                      <option value="">Select WD-ID</option>
                      {availableWdIds.map((id) => <option key={id} value={id}>{id}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Spray Type</label>
                    <input value={sprayForm.sprayType} onChange={(e) => setSprayForm({ ...sprayForm, sprayType: e.target.value })} className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Feed Rate</label>
                    <input type="number" min="0" step="0.1" value={sprayForm.feedRate} onChange={(e) => setSprayForm({ ...sprayForm, feedRate: e.target.value })} placeholder="Enter feed rate" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#171717]">Pressure Sitting</label>
                    <input type="number" min="0" step="0.1" value={sprayForm.pressureSitting} onChange={(e) => setSprayForm({ ...sprayForm, pressureSitting: e.target.value })} placeholder="Enter pressure sitting" className="h-[42px] rounded-[8px] border border-[#DDE1E8] px-3 text-[14px]" />
                  </div>
                </div>
              )}
              <div className="rounded-[12px] border border-[#DDE1E8] bg-white p-4 flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#171717]">Attach Image</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setModalImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="text-[14px]" />
                {modalImage && (
                  <img src={modalImage} alt="Preview" className="mt-2 max-h-[200px] rounded-[8px] border border-[#DDE1E8]" />
                )}
              </div>
              {showValidationHint && (
                <p className="text-[12px] text-[#D92D20]">All required fields must be filled.</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 bg-[#FAFAFA] border-t border-[#EBEBEB]">
              <button onClick={closeModal} className="h-[40px] px-4 bg-white border border-[#EBEBEB] text-[#171717] text-[14px] font-medium rounded-[6px] hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={activeTab === "Winding" ? submitWinding : submitSpray}
                className="h-[40px] px-5 bg-[#00B6E2] text-white text-[14px] font-medium rounded-[6px] hover:bg-[#0092b5] transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <section className="bg-white w-full flex justify-start border-b border-[#EBEBEB]">
        <div className="w-full px-6 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-semibold text-[#171717] leading-tight">Product Order Details</h1>
            </div>
            <p className="text-[14px] text-[#5C5C5C] flex items-center gap-2">
              {productOrder ? `${productOrder.code} — ${productOrder.grade} Grade` : displayId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#E6F8FD] text-[#00B6E2] text-[12px] font-medium px-3 py-[6px] rounded-[24px]">{productOrder?.grade ?? "-"} Grade</span>
          </div>
        </div>
      </section>

      {/* Detail grid */}
      {productOrder && (
        <section className="bg-white px-6 py-6 border-b border-[#EBEBEB] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#5C5C5C]">Product Code</span>
            <span className="text-[14px] font-medium text-[#171717]">{productOrder.code}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#5C5C5C]">Capacitor Type</span>
            <span className="text-[14px] font-medium text-[#171717]">{productOrder.type}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#5C5C5C]">Grade</span>
            <span className="text-[14px] font-medium text-[#171717]">{productOrder.grade}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#5C5C5C]">Batch Size</span>
            <span className="text-[14px] font-medium text-[#171717]">{productOrder.batchSize}</span>
          </div>
        </section>
      )}

      <section className="bg-white m-6 border border-[#EBEBEB] rounded-[8px]">
        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-5 pb-5 border-b border-[#EBEBEB]">
          {(["Product Material", "Metallisation", "Slitting", "Winding", "Spray"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-[16px] py-[8px] rounded-[6px] text-[14px] font-medium transition-colors ${
                activeTab === tab 
                  ? "bg-[#00B6E2] text-white" 
                  : "bg-[#F5F7FA] text-[#5C5C5C] hover:bg-[#e4e7ec]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TableToolbar dateRange={dateRange} onDateRangeChange={setDateRange} onExport={() => alert("Exporting data...")} />
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeTab === "Winding" && (
                <button onClick={openWindingModal} className="h-[40px] px-4 bg-[#00B6E2] hover:bg-[#0092b5] text-white text-[14px] font-medium rounded-[8px] flex items-center justify-center gap-2 whitespace-nowrap transition-colors">
                   + Winding
                </button>
              )}
              {activeTab === "Spray" && (
                 <button onClick={openSprayModal} className="h-[40px] px-4 bg-[#00B6E2] hover:bg-[#0092b5] text-white text-[14px] font-medium rounded-[8px] flex items-center justify-center gap-2 whitespace-nowrap transition-colors">
                   + Spray
                 </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto border border-[#EBEBEB] rounded-[8px] mt-2">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#EBEBEB]">
                  {currentConfig.columns.map((col) => (
                    <th key={String(col.key)} className="px-5 py-[12px]">
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
              <tbody className="divide-y divide-[#EBEBEB]">
                {processedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {currentConfig.columns.map((col) => {
                      if (String(col.key) === "options") {
                        return (
                          <td key={String(col.key)} className="px-5 py-3 whitespace-nowrap">
                            <OptionsDropdown 
                              onEdit={() => alert(`Edit row ${i}`)}
                              onDelete={() => alert(`Delete row ${i}`)}
                            />
                          </td>
                        );
                      }
                      return (
                        <td key={String(col.key)} className="px-5 py-4 text-[14px] text-[#5C5C5C] whitespace-nowrap">
                          {row[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {processedData.length === 0 && (
                  <tr>
                    <td colSpan={currentConfig.columns.length} className="px-5 py-8 text-center text-[#5C5C5C]">
                      {activeTab === "Product Material"
                        ? "No stock assigned to this product order yet."
                        : "No records found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
